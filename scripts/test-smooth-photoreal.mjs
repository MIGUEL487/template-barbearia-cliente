import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';

const objContent = fs.readFileSync('refs/27-hair-trimmer/Hair Trimmer.obj', 'utf-8');
const textureBase64 = fs.readFileSync('refs/27-hair-trimmer/Hairtrimmer_basecolor.jpg').toString('base64');

const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/OBJLoader.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/utils/BufferGeometryUtils.js"></script>
  <style>
    body { margin: 0; background: #0E1013; overflow: hidden; }
    canvas { width: 100vw; height: 100vh; }
  </style>
</head>
<body>
  <div id="info" style="position: absolute; top: 10px; left: 10px; color: white; font-family: monospace; z-index: 10;">Carregando...</div>
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

    // Advanced studio lighting
    const amb = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(amb);

    // Main key light (soft top-right)
    const key = new THREE.DirectionalLight(0xfff5ea, 1.8);
    key.position.set(3, 4, 3.5);
    scene.add(key);

    // Fill light (cool blue-white left)
    const fill = new THREE.DirectionalLight(0xdbeafe, 0.9);
    fill.position.set(-3.5, 1, 2.5);
    scene.add(fill);

    // Subtle violet rim light (brand identity)
    const violetRim = new THREE.DirectionalLight(0xa855f7, 1.4);
    violetRim.position.set(-2, -3, -2);
    scene.add(violetRim);

    // Crisp white top rim (edge definition on steel and chrome)
    const topRim = new THREE.DirectionalLight(0xffffff, 1.3);
    topRim.position.set(1.5, 4, -3);
    scene.add(topRim);

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

      // Process meshes with smooth normals
      rawObject.traverse((child) => {
        if (child.isMesh) {
          try {
            const smoothGeo = THREE.BufferGeometryUtils.mergeVertices(child.geometry, 1e-4);
            smoothGeo.computeVertexNormals();
            child.geometry.dispose();
            child.geometry = smoothGeo;
          } catch (e) {
            console.warn('mergeVertices fallback:', e);
            child.geometry.computeVertexNormals();
          }

          // High-grade physical material with clearcoat on polymer body and chrome reflections
          child.material = new THREE.MeshPhysicalMaterial({
            map: baseColorTex,
            roughness: 0.28,
            metalness: 0.35,
            clearcoat: 0.4,
            clearcoatRoughness: 0.2,
            reflectivity: 0.9,
            depthWrite: true,
            transparent: false,
          });
        }
      });

      // Center geometry
      const box = new THREE.Box3().setFromObject(rawObject);
      const center = new THREE.Vector3();
      box.getCenter(center);
      rawObject.children.forEach(child => {
        if (child.isMesh) child.geometry.translate(-center.x, -center.y, -center.z);
      });

      // Scale to max dimension = 3.2
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

      document.getElementById('info').innerText = 'Suavizado PBR Pronto!';
      window.__MODEL_READY__ = true;
    };
    textureImg.src = 'data:image/jpeg;base64,' + window.__TEXTURE_BASE64__;
  </script>
</body>
</html>`;

const fullHtml = html
  .replace('window.__OBJ_DATA__', JSON.stringify(objContent))
  .replace('window.__TEXTURE_BASE64__', JSON.stringify(textureBase64));

const tmpHtml = path.resolve('refs/27-hair-trimmer/preview_smooth.html');
fs.writeFileSync(tmpHtml, fullHtml);

const browser = await chromium.launch({
  headless: true,
  args: ['--enable-webgl', '--use-gl=angle', '--ignore-gpu-blocklist']
});
const page = await browser.newPage({ viewport: { width: 1024, height: 1024 } });
page.on('console', msg => console.log('[Browser Console]', msg.type(), msg.text()));
page.on('pageerror', err => console.log('[Browser Error]', err));
await page.goto(`file://${tmpHtml.replace(/\\\\/g, '/')}`, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => window.__MODEL_READY__ === true, { timeout: 30000 });
await page.waitForTimeout(1000);

// Capture front beauty angle
await page.evaluate(() => window.setAngle(Math.PI / 2, Math.PI, 0));
await page.waitForTimeout(400);
const out1 = path.resolve('docs/redesign3d/evidencias/02-stills/01_frente_suave_realista.png');
await page.screenshot({ path: out1 });
console.log('Frente suave salva:', out1);

// Capture 3/4 perspective beauty angle
await page.evaluate(() => window.setAngle(1.35, 2.75, -0.25));
await page.waitForTimeout(400);
const out2 = path.resolve('docs/redesign3d/evidencias/02-stills/02_perspectiva_suave_realista.png');
await page.screenshot({ path: out2 });
console.log('Perspectiva 3/4 salva:', out2);

// Capture macro blade angle
await page.evaluate(() => window.setAngle(1.5, Math.PI, 0.4));
await page.waitForTimeout(400);
const out3 = path.resolve('docs/redesign3d/evidencias/02-stills/03_macro_lamina_realista.png');
await page.screenshot({ path: out3 });
console.log('Macro lâmina salva:', out3);

await browser.close();
if (fs.existsSync(tmpHtml)) fs.unlinkSync(tmpHtml);
