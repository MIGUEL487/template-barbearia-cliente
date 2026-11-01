import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';
import http from 'node:http';

const repoRoot = path.resolve('.');
const outDir = path.resolve('docs/redesign/evidencias/04-3d');
fs.mkdirSync(outDir, { recursive: true });

// Static server to serve Three.js and the model files
const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/test-render.html';
  const filePath = path.join(repoRoot, reqPath);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.statusCode = 404;
    return res.end('Not found');
  }
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.jpg': 'image/jpeg',
    '.obj': 'text/plain; charset=utf-8',
  };
  res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
  fs.createReadStream(filePath).pipe(res);
});

const PORT = 3461;

async function run() {
  await new Promise(r => server.listen(PORT, r));

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Test Model Render</title>
      <style>
        body { margin: 0; background: #FFFFFF; overflow: hidden; }
        canvas { width: 100vw; height: 100vh; display: block; }
      </style>
      <script type="importmap">
        {
          "imports": {
            "three": "/node_modules/three/build/three.module.js",
            "three/addons/": "/node_modules/three/examples/jsm/"
          }
        }
      </script>
    </head>
    <body>
      <script type="module">
        import * as THREE from 'three';
        import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xFFFFFF);

        const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.set(0, 0, 5.0);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(2);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        renderer.shadowMap.enabled = true;
        document.body.appendChild(renderer.domElement);

        // Studio Lighting
        const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
        keyLight.position.set(4, 5, 4);
        scene.add(keyLight);

        const rimLight = new THREE.DirectionalLight(0xe0d4ff, 2.0);
        rimLight.position.set(-4, 3, -3);
        scene.add(rimLight);

        const fillLight = new THREE.DirectionalLight(0xf0f2f8, 1.2);
        fillLight.position.set(0, -3, 3);
        scene.add(fillLight);

        const ambLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambLight);

        // Load Texture
        const texLoader = new THREE.TextureLoader();
        const texture = texLoader.load('/public/models/hair-clipper/Hairtrimmer_basecolor.jpg');
        texture.colorSpace = THREE.SRGBColorSpace;

        const material = new THREE.MeshStandardMaterial({
          map: texture,
          metalness: 0.65,
          roughness: 0.28,
        });

        // Load OBJ
        const objLoader = new OBJLoader();
        objLoader.load('/public/models/hair-clipper/Hair Trimmer.obj', (obj) => {
          // Center geometry
          const box = new THREE.Box3().setFromObject(obj);
          const center = new THREE.Vector3();
          box.getCenter(center);
          const size = new THREE.Vector3();
          box.getSize(size);

          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 2.8 / maxDim;

          obj.traverse((child) => {
            if (child.isMesh) {
              child.material = material;
              child.geometry.center();
            }
          });

          obj.scale.set(scale, scale, scale);

          // Find the best orientation: model is elongated along X or Z
          // Let's position it upright and slightly angled
          obj.rotation.set(-Math.PI / 4, Math.PI / 3, 0);

          scene.add(obj);

          // Contact shadow
          const shadowCanvas = document.createElement('canvas');
          shadowCanvas.width = 256;
          shadowCanvas.height = 256;
          const sctx = shadowCanvas.getContext('2d');
          const grad = sctx.createRadialGradient(128, 128, 0, 128, 128, 128);
          grad.addColorStop(0, 'rgba(10, 10, 14, 0.25)');
          grad.addColorStop(0.4, 'rgba(10, 10, 14, 0.1)');
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          sctx.fillStyle = grad;
          sctx.fillRect(0, 0, 256, 256);

          const shadowTex = new THREE.CanvasTexture(shadowCanvas);
          const shadowPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(3.5, 3.5),
            new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true })
          );
          shadowPlane.rotation.x = -Math.PI / 2;
          shadowPlane.position.y = -1.5;
          scene.add(shadowPlane);

          window.__MODEL_LOADED = true;
          renderer.render(scene, camera);
        });
      </script>
    </body>
    </html>
  `;

  fs.writeFileSync(path.join(repoRoot, 'test-render.html'), html, 'utf-8');

  const browser = await chromium.launch({
    headless: true,
    args: ['--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader'],
  });
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 2 });
  await page.goto(`http://localhost:${PORT}/test-render.html`);

  await page.waitForFunction(() => window.__MODEL_LOADED === true, { timeout: 15000 });
  await page.waitForTimeout(500);

  const shotPath = path.join(outDir, 'test_model_render.png');
  await page.screenshot({ path: shotPath });
  console.log('Render salvo com sucesso em:', shotPath);

  await browser.close();
  server.close();
  fs.unlinkSync(path.join(repoRoot, 'test-render.html'));
}

run().catch(err => {
  console.error('Erro:', err);
  server.close();
});
