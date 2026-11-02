import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';
import sharp from 'sharp';

const TARGET_DIR = path.resolve('docs/redesign3d/evidencias/02-stills');
fs.mkdirSync(TARGET_DIR, { recursive: true });

const glbBase64 = fs.readFileSync('public/3d/auto-stilo-trimmer.glb').toString('base64');

const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { margin: 0; background: #fbfaf8; overflow: hidden; font-family: -apple-system, sans-serif; }
    #canvas-container { width: 1200px; height: 900px; position: relative; }
    .label { position: absolute; top: 24px; left: 24px; font-size: 16px; font-weight: 700; color: #111; background: rgba(255,255,255,0.9); padding: 8px 16px; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>
</head>
<body>
  <div id="canvas-container">
    <div class="label" id="stillLabel">STILL 1: FRENTE</div>
  </div>

  <script>
    const GLB_B64 = ${JSON.stringify(glbBase64)};

    const ANGLES = [
      { id: 'still_01_frente', name: '1. Vista Frontal (Placa Cromo e Lâmina)', cam: [0, 0, 4.2], rot: [0, 0, 0] },
      { id: 'still_02_costas', name: '2. Vista Traseira (Carcaça e Parafusos)', cam: [0, 0, 4.2], rot: [0, Math.PI, 0] },
      { id: 'still_03_lateral_esq', name: '3. Vista Lateral Esquerda (Alavanca)', cam: [0, 0, 4.2], rot: [0, Math.PI / 2, 0] },
      { id: 'still_04_lateral_dir', name: '4. Vista Lateral Direita (Perfil)', cam: [0, 0, 4.2], rot: [0, -Math.PI / 2, 0] },
      { id: 'still_05_topo', name: '5. Vista Superior / Topo (Chanfro Lâminas)', cam: [0, 3.8, 1.6], rot: [-Math.PI / 3, 0, 0] },
      { id: 'still_06_base', name: '6. Vista Inferior / Base (Cabo e Conector)', cam: [0, -3.8, 1.6], rot: [Math.PI / 3, 0, 0] },
      { id: 'still_07_isometrico_3_4', name: '7. Vista 3/4 Isométrica (Apresentação)', cam: [0, 0.4, 4.0], rot: [-0.25, 0.45, 0.1] },
      { id: 'still_08_macro_lamina', name: '8. Macro Close-up (Dentes de Aço Inox)', cam: [0, 0.85, 2.0], rot: [-0.15, 0.20, 0.05] },
    ];

    let scene, camera, renderer, modelRoot;
    let keyLight, rimLight, fillLight, ambLight;

    async function init() {
      const container = document.getElementById('canvas-container');
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xfbfaf8);

      camera = new THREE.PerspectiveCamera(38, 1200 / 900, 0.1, 50);
      renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
      renderer.setSize(1200, 900);
      renderer.setPixelRatio(1.5);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      container.appendChild(renderer.domElement);

      // Studio Lighting
      keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
      keyLight.position.set(4, 5, 4);
      scene.add(keyLight);

      rimLight = new THREE.DirectionalLight(0xe4d8ff, 2.0); // Subtle lavender accent
      rimLight.position.set(-4, 3, -3);
      scene.add(rimLight);

      fillLight = new THREE.DirectionalLight(0xf2f4f8, 1.2);
      fillLight.position.set(0, -3, 3);
      scene.add(fillLight);

      ambLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambLight);

      // Soft contact shadow
      const shadowCanvas = document.createElement('canvas');
      shadowCanvas.width = 256;
      shadowCanvas.height = 256;
      const sctx = shadowCanvas.getContext('2d');
      const grad = sctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      grad.addColorStop(0, 'rgba(10, 10, 14, 0.22)');
      grad.addColorStop(0.4, 'rgba(10, 10, 14, 0.08)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      sctx.fillStyle = grad;
      sctx.fillRect(0, 0, 256, 256);

      const shadowTex = new THREE.CanvasTexture(shadowCanvas);
      const shadowGeo = new THREE.PlaneGeometry(3.6, 3.6);
      const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, opacity: 0.35, depthWrite: false });
      const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
      shadowMesh.rotation.x = -Math.PI / 2;
      shadowMesh.position.y = -1.6;
      scene.add(shadowMesh);

      // Decode GLB from base64
      const binaryString = atob(GLB_B64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);

      const loader = new THREE.GLTFLoader();
      loader.parse(
        bytes.buffer,
        '',
        (gltf) => {
          modelRoot = gltf.scene;
          scene.add(modelRoot);
          window.__ANGLES__ = ANGLES;
          window.__READY__ = true;
        },
        (err) => console.error('Error parsing GLB:', err)
      );
    }

    window.__setAngle__ = function(idx, setupNum) {
      const a = ANGLES[idx];
      document.getElementById('stillLabel').textContent = a.name.toUpperCase() + (setupNum === 2 ? ' (LUZ DE ESTÚDIO PURA)' : ' (LUZ ASSINATURA VIOLETA)');

      if (setupNum === 2) {
        rimLight.color.setHex(0xffffff);
        rimLight.intensity = 1.8;
      } else {
        rimLight.color.setHex(0xe4d8ff);
        rimLight.intensity = 2.2;
      }

      modelRoot.rotation.set(a.rot[0], a.rot[1], a.rot[2]);
      camera.position.set(a.cam[0], a.cam[1], a.cam[2]);
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    window.addEventListener('load', init);
  </script>
</body>
</html>`;

const tmpHtml = path.resolve('public/temp_stills.html');
fs.writeFileSync(tmpHtml, html);

console.log('[Playwright] Capturando 8 stills de aprovação em 2 setups de luz...');
const browser = await chromium.launch({
  headless: true,
  args: ['--enable-webgl', '--use-gl=angle', '--ignore-gpu-blocklist', '--no-sandbox', '--disable-setuid-sandbox']
});

const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
await page.goto(`file://${tmpHtml.replace(/\\\\/g, '/')}`, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => window.__READY__ === true, { timeout: 30000 });
await page.waitForTimeout(1000);

const stillsList = [];

for (let i = 0; i < 8; i++) {
  // Setup 1 (Signature Rim)
  const angleInfo = await page.evaluate((idx) => {
    window.__setAngle__(idx, 1);
    return window.__ANGLES__[idx];
  }, i);
  await page.waitForTimeout(600);

  const outPath1 = path.join(TARGET_DIR, `${angleInfo.id}_luz_assinatura.png`);
  await page.screenshot({ path: outPath1 });
  console.log(`[Salvo] ${angleInfo.id}_luz_assinatura.png`);
  stillsList.push(outPath1);

  // Setup 2 (Pure White Studio)
  await page.evaluate((idx) => {
    window.__setAngle__(idx, 2);
  }, i);
  await page.waitForTimeout(600);

  const outPath2 = path.join(TARGET_DIR, `${angleInfo.id}_luz_estudio.png`);
  await page.screenshot({ path: outPath2 });
  console.log(`[Salvo] ${angleInfo.id}_luz_estudio.png`);
}

await browser.close();
fs.unlinkSync(tmpHtml);

// Composite master sheet (4 columns x 2 rows)
console.log('[Sharp] Consolidando prancha mestre de aprovação dos 8 stills...');
const resizedStills = await Promise.all(stillsList.map(async (p) => {
  return await sharp(p).resize(600, 450).toBuffer();
}));

const composites = [
  { input: resizedStills[0], top: 0, left: 0 },
  { input: resizedStills[1], top: 0, left: 600 },
  { input: resizedStills[2], top: 0, left: 1200 },
  { input: resizedStills[3], top: 0, left: 1800 },
  { input: resizedStills[4], top: 450, left: 0 },
  { input: resizedStills[5], top: 450, left: 600 },
  { input: resizedStills[6], top: 450, left: 1200 },
  { input: resizedStills[7], top: 450, left: 1800 },
];

const masterPath = path.join(TARGET_DIR, 'stills_aprovacao_consolidado.png');
await sharp({
  create: {
    width: 2400,
    height: 900,
    channels: 3,
    background: { r: 251, g: 250, b: 248 }
  }
}).composite(composites).png().toFile(masterPath);

console.log(`[Sucesso] Prancha mestre de 8 stills gerada em: ${masterPath}`);

// Copy master sheet to artifact directory
const artifactDir = path.resolve('C:/Users/Windows/.gemini/antigravity/brain/4ceefa96-88d0-4621-b1fa-b3d647948612');
fs.copyFileSync(masterPath, path.join(artifactDir, 'stills_aprovacao_consolidado.png'));
fs.copyFileSync(stillsList[0], path.join(artifactDir, 'still_01_frente.png'));
fs.copyFileSync(stillsList[7], path.join(artifactDir, 'still_08_macro_lamina.png'));
