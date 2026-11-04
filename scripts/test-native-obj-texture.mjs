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
  <div id="info" style="position: absolute; top: 10px; left: 10px; color: white; font-family: sans-serif; z-index: 10;">Carregando...</div>
  <script>
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x14161b);

    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 1.2, 5.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(2);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.outputEncoding = THREE.sRGBEncoding;
    document.body.appendChild(renderer.domElement);

    // Studio lights
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x222233, 1.2);
    scene.add(hemiLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight1.position.set(5, 8, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x7c3aed, 1.2);
    dirLight2.position.set(-5, -2, -3);
    scene.add(dirLight2);

    const dirLight3 = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight3.position.set(-4, 4, 3);
    scene.add(dirLight3);

    const textureImg = new Image();
    textureImg.onload = () => {
      const baseColorTex = new THREE.Texture(textureImg);
      baseColorTex.encoding = THREE.sRGBEncoding;
      baseColorTex.flipY = true;
      baseColorTex.needsUpdate = true;

      const objLoader = new THREE.OBJLoader();
      const object = objLoader.parse(window.__OBJ_DATA__);

      const box = new THREE.Box3().setFromObject(object);
      const center = new THREE.Vector3();
      box.getCenter(center);
      object.children.forEach(child => {
        if (child.isMesh) {
          child.geometry.translate(-center.x, -center.y, -center.z);
        }
      });

      // Target scale 3.1
      const centeredBox = new THREE.Box3().setFromObject(object);
      const size = new THREE.Vector3();
      centeredBox.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      const s = 3.1 / maxDim;
      object.scale.set(s, s, s);

      object.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.geometry.computeVertexNormals();

          child.material = new THREE.MeshStandardMaterial({
            map: baseColorTex,
            roughness: 0.35,
            metalness: 0.45,
            depthWrite: true,
            transparent: false,
            side: THREE.FrontSide
          });
        }
      });

      // Upright pose
      object.rotation.set(-Math.PI / 4, Math.PI / 3, 0);

      scene.add(object);
      window.__MODEL_OBJECT__ = object;
      document.getElementById('info').innerText = 'Modelo Carregado com UV 4K!';
      window.__MODEL_LOADED__ = true;
      renderer.render(scene, camera);
    };
    textureImg.src = 'data:image/jpeg;base64,' + window.__TEXTURE_BASE64__;

    function animate() {
      requestAnimationFrame(animate);
      if (window.__MODEL_OBJECT__) {
        renderer.render(scene, camera);
      }
    }
    animate();
  </script>
</body>
</html>`;

const fullHtml = html
  .replace('window.__OBJ_DATA__', JSON.stringify(objContent))
  .replace('window.__TEXTURE_BASE64__', JSON.stringify(textureBase64));

const tmpHtml = path.resolve('refs/27-hair-trimmer/preview_injected.html');
fs.writeFileSync(tmpHtml, fullHtml);

const browser = await chromium.launch({
  headless: true,
  args: ['--enable-webgl', '--use-gl=angle', '--ignore-gpu-blocklist']
});
const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
await page.goto(`file://${tmpHtml.replace(/\\\\/g, '/')}`, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => window.__MODEL_LOADED__ === true, { timeout: 30000 });
await page.waitForTimeout(2000);

const outScreenshot = path.resolve('docs/redesign3d/evidencias/02-stills/teste_textura_4k_nativo.png');
await page.screenshot({ path: outScreenshot });
console.log('Screenshot salva em:', outScreenshot);

await browser.close();
if (fs.existsSync(tmpHtml)) fs.unlinkSync(tmpHtml);
