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
  <style>
    body { margin: 0; background: #0E1013; overflow: hidden; }
    canvas { width: 100vw; height: 100vh; }
  </style>
</head>
<body>
  <div id="info" style="position: absolute; top: 10px; left: 10px; color: white; font-family: monospace; z-index: 10; font-size: 16px;">Inicializando...</div>
  <script>
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0e1013);

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(1024, 1024);
    renderer.setPixelRatio(1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputEncoding = THREE.sRGBEncoding;
    document.body.appendChild(renderer.domElement);

    // Soft studio lighting
    const amb = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(amb);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(3, 4, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe2e8f0, 0.8);
    fillLight.position.set(-4, 2, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x9333ea, 1.2);
    rimLight.position.set(0, -4, -3);
    scene.add(rimLight);

    const topRim = new THREE.DirectionalLight(0xffffff, 1.0);
    topRim.position.set(0, 5, -2);
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

      // Center geometry at origin
      const box = new THREE.Box3().setFromObject(rawObject);
      const center = new THREE.Vector3();
      box.getCenter(center);
      rawObject.children.forEach(child => {
        if (child.isMesh) {
          child.geometry.translate(-center.x, -center.y, -center.z);
        }
      });

      // Scale to fit nicely
      const centeredBox = new THREE.Box3().setFromObject(rawObject);
      const size = new THREE.Vector3();
      centeredBox.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      const s = 3.2 / maxDim;
      rawObject.scale.set(s, s, s);

      // Reorient: in OBJ coords, find which way faces front
      const rootGroup = new THREE.Group();
      rootGroup.name = 'TrimmerGroup';
      rootGroup.add(rawObject);
      scene.add(rootGroup);

      rawObject.traverse((child) => {
        if (child.isMesh) {
          child.geometry.computeVertexNormals();
          child.material = new THREE.MeshStandardMaterial({
            map: baseColorTex,
            roughness: 0.32,
            metalness: 0.25,
            depthWrite: true,
            transparent: false,
          });
        }
      });

      window.__ROOT_GROUP__ = rootGroup;
      window.__RAW_OBJECT__ = rawObject;
      window.__RENDERER__ = renderer;
      window.__SCENE__ = scene;
      window.__CAMERA__ = camera;

      window.setAngle = (rx, ry, rz) => {
        rawObject.rotation.set(rx, ry, rz);
        renderer.render(scene, camera);
      };

      document.getElementById('info').innerText = 'Pronto!';
      window.__MODEL_READY__ = true;
    };
    textureImg.src = 'data:image/jpeg;base64,' + window.__TEXTURE_BASE64__;
  </script>
</body>
</html>`;

const fullHtml = html
  .replace('window.__OBJ_DATA__', JSON.stringify(objContent))
  .replace('window.__TEXTURE_BASE64__', JSON.stringify(textureBase64));

const tmpHtml = path.resolve('refs/27-hair-trimmer/preview_angles.html');
fs.writeFileSync(tmpHtml, fullHtml);

const browser = await chromium.launch({
  headless: true,
  args: ['--enable-webgl', '--use-gl=angle', '--ignore-gpu-blocklist']
});
const page = await browser.newPage({ viewport: { width: 1024, height: 1024 } });
await page.goto(`file://${tmpHtml.replace(/\\\\/g, '/')}`, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => window.__MODEL_READY__ === true, { timeout: 30000 });
await page.waitForTimeout(1000);

// We test angles to find the exact orientation of front, back, profile, and 3/4 beauty
const angles = [
  { name: '01_frente_teste1', rx: Math.PI / 2, ry: 0, rz: 0 },
  { name: '02_frente_teste2', rx: -Math.PI / 2, ry: 0, rz: 0 },
  { name: '03_frente_teste3', rx: 0, ry: Math.PI, rz: 0 },
  { name: '04_frente_teste4', rx: Math.PI / 2, ry: Math.PI, rz: 0 },
  { name: '05_perspectiva_beauty', rx: 1.2, ry: 2.8, rz: -0.3 },
  { name: '06_perfil_alavanca', rx: 1.5, ry: 1.57, rz: 0 },
];

for (const a of angles) {
  await page.evaluate(({ rx, ry, rz }) => window.setAngle(rx, ry, rz), a);
  await page.waitForTimeout(300);
  const outPath = path.resolve(`docs/redesign3d/evidencias/02-stills/${a.name}.png`);
  await page.screenshot({ path: outPath });
  console.log('Capturado:', outPath);
}

await browser.close();
if (fs.existsSync(tmpHtml)) fs.unlinkSync(tmpHtml);
console.log('Todos os ângulos capturados!');
