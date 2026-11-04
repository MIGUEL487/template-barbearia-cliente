import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';
import sharp from 'sharp';

const TARGET_DIR = path.resolve('docs/redesign3d/evidencias/01-contraste');
fs.mkdirSync(TARGET_DIR, { recursive: true });

const objContent = fs.readFileSync('refs/27-hair-trimmer/Hair Trimmer.obj', 'utf-8');

const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { margin: 0; padding: 0; background: #000; overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    #wrapper { display: flex; width: 1600px; height: 900px; }
    .half { width: 800px; height: 900px; position: relative; }
    .label { position: absolute; top: 24px; left: 28px; z-index: 10; font-size: 16px; font-weight: 700; padding: 6px 14px; border-radius: 6px; letter-spacing: 0.05em; }
    .light-label { background: rgba(0,0,0,0.85); color: #fff; }
    .dark-label { background: rgba(255,255,255,0.9); color: #0f1013; }
    .title-banner { position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%); z-index: 10; font-size: 15px; font-weight: 600; padding: 8px 18px; border-radius: 20px; background: rgba(18, 18, 22, 0.9); color: #f0f0f4; border: 1px solid rgba(255,255,255,0.15); }
    canvas { display: block; width: 800px; height: 900px; }
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
</head>
<body>
  <div id="wrapper">
    <div class="half" id="leftHalf">
      <div class="label light-label">DIREÇÃO A: FUNDO CLARO EDITORIAL (#FBFAF8)</div>
    </div>
    <div class="half" id="rightHalf">
      <div class="label dark-label">DIREÇÃO B: FUNDO ESCURO SÓBRIO (#0E1013)</div>
    </div>
    <div class="title-banner" id="poseTitle">POSE 1: HERO / APRESENTAÇÃO FRONTAL</div>
  </div>

  <script>
    window.__OBJ_DATA__ = ${JSON.stringify(objContent)};

    let sceneLight, cameraLight, rendererLight;
    let sceneDark, cameraDark, rendererDark;
    let modelLight, modelDark;

    const POSES = [
      {
        id: 'pose_01',
        name: 'Pose 1: Hero / Ângulo Principal (Placa frontal e lâminas)',
        cam: [0, 0, 4.2],
        rot: [-0.35, 0.45, 0.12],
        scale: 1.05
      },
      {
        id: 'pose_02',
        name: 'Pose 2: Perfil Lateral 90° (Espessura, alavanca e curvatura)',
        cam: [0, 0, 4.2],
        rot: [-0.15, 1.57, 0],
        scale: 1.05
      },
      {
        id: 'pose_03',
        name: 'Pose 3: Macro Close-up Lâminas (Dentes de aço e fixação)',
        cam: [0, 0.85, 2.2],
        rot: [-0.25, 0.20, 0.05],
        scale: 1.45
      },
      {
        id: 'pose_04',
        name: 'Pose 4: Vista Superior de Topo (Chanfros e grade)',
        cam: [0, 3.8, 1.2],
        rot: [-1.30, 0.35, 0],
        scale: 1.0
      },
      {
        id: 'pose_05',
        name: 'Pose 5: Flanco Traseiro 3/4 (Alavanca e carcaça inferior)',
        cam: [0, 0, 4.2],
        rot: [0.30, 2.80, -0.15],
        scale: 1.05
      },
      {
        id: 'pose_06',
        name: 'Pose 6: Base / Cabo e Parafusos (Conector e ergonomia)',
        cam: [0, -1.2, 3.2],
        rot: [0.85, -0.40, 0.10],
        scale: 1.15
      }
    ];

    function parseObjPieces(text) {
      const lines = text.split('\\n');
      const vertices = [];
      const faces = [];
      for (const rawLine of lines) {
        const line = rawLine.trim();
        if (line.startsWith('v ')) {
          const [, x, y, z] = line.split(/\\s+/).map(Number);
          vertices.push(new THREE.Vector3(x, y, z));
        } else if (line.startsWith('f ')) {
          const parts = line.split(/\\s+/).slice(1);
          const vIdx = parts.map(p => {
            const idx = parseInt(p.split('/')[0], 10);
            return idx > 0 ? idx - 1 : vertices.length + idx;
          });
          faces.push(vIdx);
        }
      }

      const vertexToFaces = Array.from({ length: vertices.length }, () => []);
      for (let fIdx = 0; fIdx < faces.length; fIdx++) {
        for (const v of faces[fIdx]) vertexToFaces[v].push(fIdx);
      }

      const visited = new Uint8Array(faces.length);
      const components = [];
      for (let i = 0; i < faces.length; i++) {
        if (visited[i]) continue;
        const comp = [];
        const q = [i];
        visited[i] = 1;
        while (q.length > 0) {
          const curr = q.pop();
          comp.push(curr);
          for (const v of faces[curr]) {
            for (const n of vertexToFaces[v]) {
              if (!visited[n]) {
                visited[n] = 1;
                q.push(n);
              }
            }
          }
        }
        components.push(comp);
      }
      components.sort((a, b) => b.length - a.length);

      return { vertices, faces, components };
    }

    function buildPbrTrimmer(parsed, isDarkTheme) {
      const { vertices, faces, components } = parsed;
      const group = new THREE.Group();

      // Materials (Declared temporary for Phase 1 contrast study)
      const plasticMat = new THREE.MeshStandardMaterial({
        color: isDarkTheme ? 0x141619 : 0x111215,
        roughness: 0.48,
        metalness: 0.04,
        side: THREE.FrontSide,
        depthWrite: true,
      });

      const chromeMat = new THREE.MeshStandardMaterial({
        color: 0xe6e8ec,
        roughness: 0.22,
        metalness: 0.95,
        side: THREE.FrontSide,
        depthWrite: true,
      });

      const steelBladeMat = new THREE.MeshStandardMaterial({
        color: 0xccd0d8,
        roughness: 0.32,
        metalness: 0.90,
        side: THREE.FrontSide,
        depthWrite: true,
      });

      const screwMat = new THREE.MeshStandardMaterial({
        color: 0x3a3d44,
        roughness: 0.30,
        metalness: 0.85,
        side: THREE.FrontSide,
        depthWrite: true,
      });

      components.forEach((compFaces, cIdx) => {
        const geo = new THREE.BufferGeometry();
        const positions = [];

        for (const fIdx of compFaces) {
          const f = faces[fIdx];
          positions.push(vertices[f[0]].x, vertices[f[0]].y, vertices[f[0]].z);
          positions.push(vertices[f[1]].x, vertices[f[1]].y, vertices[f[1]].z);
          positions.push(vertices[f[2]].x, vertices[f[2]].y, vertices[f[2]].z);
          if (f.length === 4) {
            positions.push(vertices[f[0]].x, vertices[f[0]].y, vertices[f[0]].z);
            positions.push(vertices[f[2]].x, vertices[f[2]].y, vertices[f[2]].z);
            positions.push(vertices[f[3]].x, vertices[f[3]].y, vertices[f[3]].z);
          }
        }

        geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geo.computeVertexNormals();

        // Assign proper material based on component index (from Phase 0 audit)
        let mat = plasticMat;
        if (cIdx === 4) {
          // front plate
          mat = chromeMat;
        } else if (cIdx === 2 || cIdx === 3 || cIdx === 5 || cIdx === 6 || cIdx === 7 || cIdx === 8) {
          // blades & teeth
          mat = steelBladeMat;
        } else if (cIdx === 9 || cIdx === 10 || cIdx === 11) {
          // screws
          mat = screwMat;
        }

        const mesh = new THREE.Mesh(geo, mat);
        group.add(mesh);
      });

      // Center geometry around mass center
      const box = new THREE.Box3().setFromObject(group);
      const center = new THREE.Vector3();
      box.getCenter(center);
      group.position.sub(center);

      // Reorient upright with blade head at top
      const pivot = new THREE.Group();
      pivot.add(group);
      group.rotation.set(-Math.PI / 4, Math.PI / 3, 0);

      return pivot;
    }

    function setupScene(containerId, isDark) {
      const container = document.getElementById(containerId);
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(isDark ? 0x0e1013 : 0xfbfaf8);

      const camera = new THREE.PerspectiveCamera(38, 800 / 900, 0.1, 50);

      const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
      renderer.setSize(800, 900);
      renderer.setPixelRatio(1);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = isDark ? 1.15 : 1.05;
      container.appendChild(renderer.domElement);

      // Lighting Rig
      const keyLight = new THREE.DirectionalLight(0xffffff, isDark ? 2.6 : 2.4);
      keyLight.position.set(4, 5, 4);
      scene.add(keyLight);

      const rimLight = new THREE.DirectionalLight(isDark ? 0x9370db : 0xe4d8ff, isDark ? 2.8 : 1.8);
      rimLight.position.set(-4, 3, -3);
      scene.add(rimLight);

      const fillLight = new THREE.DirectionalLight(0xf2f4f8, isDark ? 0.9 : 1.3);
      fillLight.position.set(0, -3, 3);
      scene.add(fillLight);

      const ambLight = new THREE.AmbientLight(0xffffff, isDark ? 0.45 : 0.75);
      scene.add(ambLight);

      return { scene, camera, renderer };
    }

    async function init() {
      const parsed = parseObjPieces(window.__OBJ_DATA__);

      const lightSetup = setupScene('leftHalf', false);
      sceneLight = lightSetup.scene;
      cameraLight = lightSetup.camera;
      rendererLight = lightSetup.renderer;
      modelLight = buildPbrTrimmer(parsed, false);
      sceneLight.add(modelLight);

      const darkSetup = setupScene('rightHalf', true);
      sceneDark = darkSetup.scene;
      cameraDark = darkSetup.camera;
      rendererDark = darkSetup.renderer;
      modelDark = buildPbrTrimmer(parsed, true);
      sceneDark.add(modelDark);

      window.__POSES__ = POSES;
      window.__setPose__ = function(poseIndex) {
        const p = POSES[poseIndex];
        document.getElementById('poseTitle').textContent = p.name.toUpperCase();

        [modelLight, modelDark].forEach(m => {
          m.rotation.set(p.rot[0], p.rot[1], p.rot[2]);
          m.scale.set(p.scale, p.scale, p.scale);
        });

        [cameraLight, cameraDark].forEach(c => {
          c.position.set(p.cam[0], p.cam[1], p.cam[2]);
          c.lookAt(0, 0, 0);
        });

        rendererLight.render(sceneLight, cameraLight);
        rendererDark.render(sceneDark, cameraDark);
      };

      window.__setPose__(0);
      window.__READY__ = true;
    }

    window.addEventListener('load', init);
  </script>
</body>
</html>`;

const tmpHtmlPath = path.resolve('public/temp_contrast_lab.html');
fs.writeFileSync(tmpHtmlPath, html);

console.log('[Playwright] Iniciando Chromium para teste de contraste...');
const browser = await chromium.launch({
  headless: true,
  args: [
    '--enable-webgl',
    '--use-gl=angle',
    '--ignore-gpu-blocklist',
    '--no-sandbox',
    '--disable-setuid-sandbox'
  ]
});

const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
await page.goto(`file://${tmpHtmlPath.replace(/\\\\/g, '/')}`, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => window.__READY__ === true, { timeout: 30000 });
await page.waitForTimeout(1000);

const poseCount = await page.evaluate(() => window.__POSES__.length);
const imagePaths = [];

for (let i = 0; i < poseCount; i++) {
  const poseInfo = await page.evaluate((idx) => {
    window.__setPose__(idx);
    return window.__POSES__[idx];
  }, i);

  await page.waitForTimeout(800);
  const outPath = path.join(TARGET_DIR, `prancha_${poseInfo.id}.png`);
  await page.screenshot({ path: outPath });
  console.log(`[Salvo] Prancha comparativa ${poseInfo.id} (${poseInfo.name}) -> ${outPath}`);
  imagePaths.push(outPath);
}

await browser.close();
fs.unlinkSync(tmpHtmlPath);

// Generate Master Contact Sheet (2 columns x 3 rows grid of all 6 poses)
console.log('[Sharp] Gerando prancha comparativa consolidada (master contact sheet)...');
const masterWidth = 1600;
const masterHeight = 900 * 3 / 2; // scaled down to manageable resolution

const smallImages = await Promise.all(imagePaths.map(async (imgPath) => {
  return await sharp(imgPath).resize(800, 450).toBuffer();
}));

const composites = [
  { input: smallImages[0], top: 0, left: 0 },
  { input: smallImages[1], top: 0, left: 800 },
  { input: smallImages[2], top: 450, left: 0 },
  { input: smallImages[3], top: 450, left: 800 },
  { input: smallImages[4], top: 900, left: 0 },
  { input: smallImages[5], top: 900, left: 800 },
];

const masterPath = path.join(TARGET_DIR, 'prancha_comparativa_completa.png');
await sharp({
  create: {
    width: 1600,
    height: 1350,
    channels: 3,
    background: { r: 15, g: 15, b: 18 }
  }
}).composite(composites).png().toFile(masterPath);

console.log(`[Sucesso] Prancha consolidada gerada em: ${masterPath}`);
