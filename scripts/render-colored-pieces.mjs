import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';

const outDir = path.resolve('docs/redesign3d/evidencias/00-antes');
fs.mkdirSync(outDir, { recursive: true });

// Copy the reference image provided
const refPecas = path.resolve('refs/EVIDENCIA_pecas_do_modelo.png');
if (fs.existsSync(refPecas)) {
  fs.copyFileSync(refPecas, path.join(outDir, 'EVIDENCIA_pecas_do_modelo.png'));
}

const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { margin: 0; background: #f8f9fa; font-family: sans-serif; overflow: hidden; }
    #canvas-container { width: 1024px; height: 1024px; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; }
    .viewport { width: 512px; height: 512px; position: relative; }
    .label { position: absolute; top: 12px; left: 16px; font-size: 14px; font-weight: bold; color: #333; z-index: 10; background: rgba(255,255,255,0.8); padding: 4px 8px; border-radius: 4px; }
  </style>
  <script>
    window.__OBJ_DATA__ = ${JSON.stringify(fs.readFileSync('refs/27-hair-trimmer/Hair Trimmer.obj', 'utf-8'))};
  </script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/OBJLoader.js"></script>
</head>
<body>
  <div id="canvas-container">
    <div class="viewport" id="vp1"><div class="label">Vista Lateral (Eixo X/Y)</div></div>
    <div class="viewport" id="vp2"><div class="label">Vista 3/4 Superior</div></div>
    <div class="viewport" id="vp3"><div class="label">Vista Frontal (Lâminas)</div></div>
    <div class="viewport" id="vp4"><div class="label">Vista Traseira / Alavanca</div></div>
  </div>
  <script>
    const COLORS = [
      0x3b82f6, // 1: alavanca (blue)
      0xf97316, // 2: carcaça principal (orange)
      0x10b981, // 3: suporte lâmina 1 (emerald)
      0xec4899, // 4: suporte lâmina 2 (pink)
      0x8b5cf6, // 5: placa frontal (purple)
      0xeab308, // 6: dentes 1 (yellow)
      0x06b6d4, // 7: dentes 2 (cyan)
      0x14b8a6, // 8: dentes 3 (teal)
      0xa855f7, // 9: suporte pente (violet)
      0xef4444, // 10: parafuso 1 (red)
      0xf43f5e, // 11: parafuso 2 (rose)
      0xd946ef, // 12: parafuso 3 (fuchsia)
      0x6366f1, // 13-20: grade slats
      0x6366f1, 0x6366f1, 0x6366f1, 0x6366f1, 0x6366f1, 0x6366f1, 0x6366f1
    ];

    const OBJ_DATA = window.__OBJ_DATA__;
    async function init() {
      const text = OBJ_DATA;
      
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

      // Connectivity BFS
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

      // Create Three.js Group with colored meshes
      const group = new THREE.Group();

      components.forEach((compFaces, cIdx) => {
        const geo = new THREE.BufferGeometry();
        const positions = [];

        for (const fIdx of compFaces) {
          const f = faces[fIdx];
          // Triangle 1
          positions.push(vertices[f[0]].x, vertices[f[0]].y, vertices[f[0]].z);
          positions.push(vertices[f[1]].x, vertices[f[1]].y, vertices[f[1]].z);
          positions.push(vertices[f[2]].x, vertices[f[2]].y, vertices[f[2]].z);
          // Triangle 2 (quad)
          if (f.length === 4) {
            positions.push(vertices[f[0]].x, vertices[f[0]].y, vertices[f[0]].z);
            positions.push(vertices[f[2]].x, vertices[f[2]].y, vertices[f[2]].z);
            positions.push(vertices[f[3]].x, vertices[f[3]].y, vertices[f[3]].z);
          }
        }

        geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geo.computeVertexNormals();

        const color = COLORS[cIdx % COLORS.length];
        const mat = new THREE.MeshStandardMaterial({
          color: color,
          roughness: 0.4,
          metalness: 0.1,
          side: THREE.DoubleSide
        });

        const mesh = new THREE.Mesh(geo, mat);
        group.add(mesh);
      });

      // Center group
      const box = new THREE.Box3().setFromObject(group);
      const center = new THREE.Vector3();
      box.getCenter(center);
      group.position.sub(center);

      // Setup 4 renderers
      const configs = [
        { id: 'vp1', pos: [0, 0, 4.5], rot: [0, 0, 0] },
        { id: 'vp2', pos: [3.2, 2.5, 3.2], rot: [0, 0, 0] },
        { id: 'vp3', pos: [4.2, 0.5, 0], rot: [0, 0, 0] },
        { id: 'vp4', pos: [-3.2, 1.5, -3.2], rot: [0, 0, 0] }
      ];

      for (const cfg of configs) {
        const dom = document.getElementById(cfg.id);
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf6f6f8);

        const amb = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(amb);
        const dir1 = new THREE.DirectionalLight(0xffffff, 1.2);
        dir1.position.set(5, 10, 7);
        scene.add(dir1);
        const dir2 = new THREE.DirectionalLight(0xffffff, 0.5);
        dir2.position.set(-5, -5, -5);
        scene.add(dir2);

        const clonedGroup = group.clone();
        scene.add(clonedGroup);

        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
        camera.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
        renderer.setSize(512, 512);
        renderer.setPixelRatio(1);
        dom.appendChild(renderer.domElement);
        renderer.render(scene, camera);
      }

      window.__RENDER_DONE__ = true;
    }

    window.addEventListener('load', init);
  </script>
</body>
</html>`;

const tmpHtmlPath = path.resolve('public/temp_colored_pieces.html');
fs.writeFileSync(tmpHtmlPath, html);

const browser = await chromium.launch({
  headless: true,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist']
});

const page = await browser.newPage({ viewport: { width: 1024, height: 1024 } });
// Serve via local static server or file url
await page.goto(`file://${tmpHtmlPath.replace(/\\\\/g, '/')}`);

// Wait for render
await page.waitForFunction(() => window.__RENDER_DONE__ === true, { timeout: 30000 });
await page.waitForTimeout(1000);

const screenshotPath = path.join(outDir, 'pecas_coloridas_confirmadas.png');
await page.screenshot({ path: screenshotPath });
console.log(`Render das 20 peças coloridas salvo em: ${screenshotPath}`);

await browser.close();
fs.unlinkSync(tmpHtmlPath);
