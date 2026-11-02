import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';

const OUT_DIR = path.resolve('public/3d');
fs.mkdirSync(OUT_DIR, { recursive: true });

const objContent = fs.readFileSync('refs/27-hair-trimmer/Hair Trimmer.obj', 'utf-8');
const textureBase64 = fs.readFileSync('public/models/hair-clipper/textures/auto-stilo-basecolor.jpg').toString('base64');

const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/OBJLoader.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/utils/BufferGeometryUtils.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/exporters/GLTFExporter.js"></script>
</head>
<body>
  <div id="status">Exportando...</div>
  <script>
    function computeSmoothCreasedNormals(geometry, maxCreaseAngleRad = Math.PI / 4) {
      const posAttr = geometry.attributes.position;
      const count = posAttr.count;
      const positions = posAttr.array;

      const numFaces = Math.floor(count / 3);
      const faceNormals = new Float32Array(numFaces * 3);
      const pA = new THREE.Vector3(), pB = new THREE.Vector3(), pC = new THREE.Vector3();
      const cb = new THREE.Vector3(), ab = new THREE.Vector3();

      for (let f = 0; f < numFaces; f++) {
        const i3 = f * 9;
        pA.set(positions[i3], positions[i3 + 1], positions[i3 + 2]);
        pB.set(positions[i3 + 3], positions[i3 + 4], positions[i3 + 5]);
        pC.set(positions[i3 + 6], positions[i3 + 7], positions[i3 + 8]);

        cb.subVectors(pC, pB);
        ab.subVectors(pA, pB);
        cb.cross(ab).normalize();

        faceNormals[f * 3] = cb.x;
        faceNormals[f * 3 + 1] = cb.y;
        faceNormals[f * 3 + 2] = cb.z;
      }

      const posMap = new Map();
      function getPosKey(x, y, z) {
        return Math.round(x * 1000) + '_' + Math.round(y * 1000) + '_' + Math.round(z * 1000);
      }

      for (let f = 0; f < numFaces; f++) {
        for (let v = 0; v < 3; v++) {
          const idx = f * 3 + v;
          const px = positions[idx * 3];
          const py = positions[idx * 3 + 1];
          const pz = positions[idx * 3 + 2];
          const key = getPosKey(px, py, pz);
          if (!posMap.has(key)) posMap.set(key, []);
          posMap.get(key).push({ vertIdx: idx, faceIdx: f });
        }
      }

      const normals = new Float32Array(count * 3);
      const minDot = Math.cos(maxCreaseAngleRad);
      const myFaceNorm = new THREE.Vector3();
      const otherFaceNorm = new THREE.Vector3();
      const avgNorm = new THREE.Vector3();

      for (const [key, cluster] of posMap.entries()) {
        for (const item of cluster) {
          myFaceNorm.set(
            faceNormals[item.faceIdx * 3],
            faceNormals[item.faceIdx * 3 + 1],
            faceNormals[item.faceIdx * 3 + 2]
          );

          avgNorm.set(0, 0, 0);
          let contributors = 0;

          for (const other of cluster) {
            otherFaceNorm.set(
              faceNormals[other.faceIdx * 3],
              faceNormals[other.faceIdx * 3 + 1],
              faceNormals[other.faceIdx * 3 + 2]
            );

            if (myFaceNorm.dot(otherFaceNorm) >= minDot) {
              avgNorm.add(otherFaceNorm);
              contributors++;
            }
          }

          if (contributors > 0) avgNorm.normalize();
          else avgNorm.copy(myFaceNorm);

          normals[item.vertIdx * 3] = avgNorm.x;
          normals[item.vertIdx * 3 + 1] = avgNorm.y;
          normals[item.vertIdx * 3 + 2] = avgNorm.z;
        }
      }

      geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
    }

    const textureImg = new Image();
    textureImg.onload = () => {
      const baseColorTex = new THREE.Texture(textureImg);
      baseColorTex.encoding = THREE.sRGBEncoding;
      baseColorTex.flipY = false; // GLTF uses flipY=false
      baseColorTex.generateMipmaps = true;
      baseColorTex.minFilter = THREE.LinearMipmapLinearFilter;
      baseColorTex.magFilter = THREE.LinearFilter;
      baseColorTex.anisotropy = 16;
      baseColorTex.needsUpdate = true;

      const objLoader = new THREE.OBJLoader();
      const rawObject = objLoader.parse(window.__OBJ_DATA__);

      const trimmerMat = new THREE.MeshStandardMaterial({
        name: 'Mat_AutoStilo_Trimmer_PBR',
        map: baseColorTex,
        roughness: 0.28,
        metalness: 0.35,
        depthWrite: true,
        transparent: false,
        side: THREE.FrontSide
      });

      rawObject.traverse((child) => {
        if (child.isMesh) {
          computeSmoothCreasedNormals(child.geometry, Math.PI / 4);
          try {
            const indexedGeo = THREE.BufferGeometryUtils.mergeVertices(child.geometry, 1e-4);
            child.geometry.dispose();
            child.geometry = indexedGeo;
          } catch (e) {
            console.warn('mergeVertices fallback:', e);
          }
          child.material = trimmerMat;
          child.name = 'AutoStilo_Trimmer_Body';
        }
      });

      // Center geometry around (0,0,0)
      const box = new THREE.Box3().setFromObject(rawObject);
      const center = new THREE.Vector3();
      box.getCenter(center);
      rawObject.children.forEach(child => {
        if (child.isMesh) {
          child.geometry.translate(-center.x, -center.y, -center.z);
        }
      });

      // In raw OBJ coords:
      // Blade is at +Z or top
      // Let's create an upright root container where blade head is at +Y and front faces +Z
      const uprightContainer = new THREE.Group();
      uprightContainer.name = 'Trimmer_Upright_Model';
      uprightContainer.add(rawObject);

      // Raw object orientation adjustment:
      // In preview, rotation (Math.PI / 2, 0, 0) showed the front upright!
      // So rotating rawObject by (Math.PI / 2, 0, 0) makes +Y up and +Z forward!
      rawObject.rotation.set(Math.PI / 2, 0, 0);

      // Scale to maxDim = 3.1
      const uprightBox = new THREE.Box3().setFromObject(uprightContainer);
      const size = new THREE.Vector3();
      uprightBox.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      const s = 3.1 / maxDim;
      uprightContainer.scale.set(s, s, s);

      const finalScene = new THREE.Scene();
      finalScene.name = 'AutoStilo_Trimmer_Scene';
      finalScene.add(uprightContainer);

      const exporter = new THREE.GLTFExporter();
      exporter.parse(
        finalScene,
        function (result) {
          const bytes = new Uint8Array(result);
          let binary = '';
          const chunkSize = 8192;
          for (let i = 0; i < bytes.byteLength; i += chunkSize) {
            const chunk = bytes.subarray(i, i + chunkSize);
            binary += String.fromCharCode.apply(null, chunk);
          }
          window.__GLB_BASE64__ = btoa(binary);
          window.__EXPORT_DONE__ = true;
          document.getElementById('status').innerText = 'Exportação Concluída!';
        },
        { binary: true }
      );
    };
    textureImg.src = 'data:image/jpeg;base64,' + window.__TEXTURE_BASE64__;
  </script>
</body>
</html>`;

const fullHtml = html
  .replace('window.__OBJ_DATA__', JSON.stringify(objContent))
  .replace('window.__TEXTURE_BASE64__', JSON.stringify(textureBase64));

const tmpHtml = path.resolve('public/temp_export_photoreal_glb.html');
fs.writeFileSync(tmpHtml, fullHtml);

console.log('[Playwright] Exportando modelo GLB fotorrealista...');
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
page.on('console', msg => console.log('[Browser Console]', msg.type(), msg.text()));
page.on('pageerror', err => console.log('[Browser Error]', err));
await page.goto(`file://${tmpHtml.replace(/\\\\/g, '/')}`, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => window.__EXPORT_DONE__ === true, { timeout: 60000 });

const base64Data = await page.evaluate(() => window.__GLB_BASE64__);
const glbBuffer = Buffer.from(base64Data, 'base64');
const outGlbPath = path.join(OUT_DIR, 'auto-stilo-trimmer.glb');
fs.writeFileSync(outGlbPath, glbBuffer);
console.log(`[Sucesso] GLB fotorrealista salvo em: ${outGlbPath} (${(glbBuffer.length / 1024).toFixed(1)} KB)`);

await browser.close();
if (fs.existsSync(tmpHtml)) fs.unlinkSync(tmpHtml);
