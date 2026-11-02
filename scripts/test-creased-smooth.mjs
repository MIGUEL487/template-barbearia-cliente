import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';

const objContent = fs.readFileSync('refs/27-hair-trimmer/Hair Trimmer.obj', 'utf-8');
const textureBase64 = fs.readFileSync('C:/Users/Windows/.gemini/antigravity/brain/4ceefa96-88d0-4621-b1fa-b3d647948612/.user_uploaded/media_1793569212048_8d4b7270.jpg').toString('base64');

const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/OBJLoader.js"></script>
  <style>
    body { margin: 0; background: #0E1013; overflow: hidden; }
    canvas { width: 100vw; height: 100vh; }
  </style>
</head>
<body>
  <div id="info" style="position: absolute; top: 10px; left: 10px; color: white; font-family: sans-serif; z-index: 10;">Calculando normais suaves...</div>
  <script>
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0e1013);

    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(1024, 1024);
    renderer.setPixelRatio(2);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputEncoding = THREE.sRGBEncoding;
    document.body.appendChild(renderer.domElement);

    // Realistic studio environment lighting
    const amb = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(amb);

    const key = new THREE.DirectionalLight(0xfff8ee, 1.6);
    key.position.set(3, 4, 3.5);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xdbeafe, 0.9);
    fill.position.set(-3.5, 1, 2.5);
    scene.add(fill);

    const violetRim = new THREE.DirectionalLight(0xa855f7, 1.4);
    violetRim.position.set(-2, -3, -2);
    scene.add(violetRim);

    const topRim = new THREE.DirectionalLight(0xffffff, 1.4);
    topRim.position.set(1.5, 4, -3);
    scene.add(topRim);

    // Custom smooth normal calculator with crease angle threshold
    function computeSmoothCreasedNormals(geometry, maxCreaseAngleRad = Math.PI / 4) {
      const posAttr = geometry.attributes.position;
      const count = posAttr.count;
      const positions = posAttr.array;

      // 1. Compute face normals
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

      // 2. Spatial hashing for vertices
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

      // 3. For each vertex, average normals of adjacent faces that are within crease angle
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

            // If angle is within crease threshold, smooth together
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
      baseColorTex.flipY = true;
      baseColorTex.generateMipmaps = true;
      baseColorTex.minFilter = THREE.LinearMipmapLinearFilter;
      baseColorTex.magFilter = THREE.LinearFilter;
      baseColorTex.anisotropy = 16;
      baseColorTex.needsUpdate = true;

      const objLoader = new THREE.OBJLoader();
      const rawObject = objLoader.parse(window.__OBJ_DATA__);

      const box = new THREE.Box3().setFromObject(rawObject);
      const center = new THREE.Vector3();
      box.getCenter(center);
      rawObject.children.forEach(child => {
        if (child.isMesh) {
          child.geometry.translate(-center.x, -center.y, -center.z);
          // Apply custom smooth creased normals: 45 degrees
          computeSmoothCreasedNormals(child.geometry, Math.PI / 4);

          child.material = new THREE.MeshPhysicalMaterial({
            map: baseColorTex,
            roughness: 0.22,
            metalness: 0.38,
            clearcoat: 0.6,
            clearcoatRoughness: 0.15,
            reflectivity: 0.95,
            depthWrite: true,
            transparent: false,
          });
        }
      });

      // Target scale 3.2
      const centeredBox = new THREE.Box3().setFromObject(rawObject);
      const size = new THREE.Vector3();
      centeredBox.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      const s = 3.2 / maxDim;
      rawObject.scale.set(s, s, s);

      scene.add(rawObject);

      window.setAngle = (rx, ry, rz) => {
        rawObject.rotation.set(rx, ry, rz);
        renderer.render(scene, camera);
      };

      document.getElementById('info').innerText = 'Normais Suaves Calculadas!';
      window.__MODEL_LOADED__ = true;
    };
    textureImg.src = 'data:image/jpeg;base64,' + window.__TEXTURE_BASE64__;
  </script>
</body>
</html>`;

const fullHtml = html
  .replace('window.__OBJ_DATA__', JSON.stringify(objContent))
  .replace('window.__TEXTURE_BASE64__', JSON.stringify(textureBase64));

const tmpHtml = path.resolve('refs/27-hair-trimmer/preview_creased_smooth.html');
fs.writeFileSync(tmpHtml, fullHtml);

const browser = await chromium.launch({
  headless: true,
  args: ['--enable-webgl', '--use-gl=angle', '--ignore-gpu-blocklist']
});
const page = await browser.newPage({ viewport: { width: 1024, height: 1024 } });
await page.goto(`file://${tmpHtml.replace(/\\\\/g, '/')}`, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => window.__MODEL_LOADED__ === true, { timeout: 30000 });
await page.waitForTimeout(1000);

// Capture front (true front)
await page.evaluate(() => window.setAngle(Math.PI / 2, 0, 0));
await page.waitForTimeout(400);
const out1 = path.resolve('docs/redesign3d/evidencias/02-stills/01_verdadeira_frente.png');
await page.screenshot({ path: out1 });
console.log('Verdadeira frente salva:', out1);

// Capture back (true back)
await page.evaluate(() => window.setAngle(Math.PI / 2, Math.PI, 0));
await page.waitForTimeout(400);
const out2 = path.resolve('docs/redesign3d/evidencias/02-stills/02_verdadeiro_dorso.png');
await page.screenshot({ path: out2 });
console.log('Verdadeiro dorso salvo:', out2);

// Capture 3/4 front beauty
await page.evaluate(() => window.setAngle(1.35, 0.45, 0.25));
await page.waitForTimeout(400);
const out3 = path.resolve('docs/redesign3d/evidencias/02-stills/03_verdadeira_perspectiva_frente.png');
await page.screenshot({ path: out3 });
console.log('Perspectiva frente salva:', out3);

// Capture profile with taper lever
await page.evaluate(() => window.setAngle(Math.PI / 2, Math.PI / 2, 0));
await page.waitForTimeout(400);
const out4 = path.resolve('docs/redesign3d/evidencias/02-stills/04_perfil_alavanca.png');
await page.screenshot({ path: out4 });
console.log('Perfil alavanca salvo:', out4);

await browser.close();
if (fs.existsSync(tmpHtml)) fs.unlinkSync(tmpHtml);
