import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';

const OUT_DIR = path.resolve('public/3d');
fs.mkdirSync(OUT_DIR, { recursive: true });

const objContent = fs.readFileSync('refs/27-hair-trimmer/Hair Trimmer.obj', 'utf-8');

const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/exporters/GLTFExporter.js"></script>
</head>
<body>
  <script>
    window.__OBJ_DATA__ = ${JSON.stringify(objContent)};

    function runPipeline() {
      const text = window.__OBJ_DATA__;
      const lines = text.split('\\n');
      const rawVertices = [];
      const rawFaces = [];

      for (const rawLine of lines) {
        const line = rawLine.trim();
        if (line.startsWith('v ')) {
          const [, x, y, z] = line.split(/\\s+/).map(Number);
          rawVertices.push(new THREE.Vector3(x, y, z));
        } else if (line.startsWith('f ')) {
          const parts = line.split(/\\s+/).slice(1);
          const vIdx = parts.map(p => {
            const idx = parseInt(p.split('/')[0], 10);
            return idx > 0 ? idx - 1 : rawVertices.length + idx;
          });
          rawFaces.push(vIdx);
        }
      }

      // Graph connectivity
      const vertexToFaces = Array.from({ length: rawVertices.length }, () => []);
      for (let fIdx = 0; fIdx < rawFaces.length; fIdx++) {
        for (const v of rawFaces[fIdx]) vertexToFaces[v].push(fIdx);
      }

      const visited = new Uint8Array(rawFaces.length);
      const components = [];
      for (let i = 0; i < rawFaces.length; i++) {
        if (visited[i]) continue;
        const comp = [];
        const q = [i];
        visited[i] = 1;
        while (q.length > 0) {
          const curr = q.pop();
          comp.push(curr);
          for (const v of rawFaces[curr]) {
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

      const modelGroup = new THREE.Group();
      modelGroup.name = 'AutoStiloHairTrimmer';

      function getComponentMeta(cIdx) {
        switch (cIdx) {
          case 0: return { name: 'lever_assembly', type: 'lever' };
          case 1: return { name: 'body_shell', type: 'body' };
          case 2: return { name: 'blade_top_support', type: 'blade' };
          case 3: return { name: 'blade_bottom_guide', type: 'blade' };
          case 4: return { name: 'front_plate_chrome', type: 'chrome' };
          case 5:
          case 6:
          case 7: return { name: 'blade_cutting_teeth_' + (cIdx - 4), type: 'blade' };
          case 8: return { name: 'blade_comb_support', type: 'blade' };
          case 9:
          case 10:
          case 11: return { name: 'screw_' + (cIdx - 8), type: 'screw' };
          default: return { name: 'vent_slat_' + (cIdx - 11), type: 'slat' };
        }
      }

      // Physical Materials
      const bodyMat = new THREE.MeshStandardMaterial({
        name: 'Mat_Body_Polymer_Matte',
        color: 0x111215,
        roughness: 0.42,
        metalness: 0.02,
        side: THREE.FrontSide,
        depthWrite: true,
      });

      const chromeMat = new THREE.MeshStandardMaterial({
        name: 'Mat_FrontPlate_Chrome',
        color: 0xf2f4f8,
        roughness: 0.14,
        metalness: 0.98,
        side: THREE.FrontSide,
        depthWrite: true,
      });

      const steelBladeMat = new THREE.MeshStandardMaterial({
        name: 'Mat_Blades_Surgical_Steel',
        color: 0xdce0e8,
        roughness: 0.24,
        metalness: 0.96,
        side: THREE.FrontSide,
        depthWrite: true,
      });

      const leverMat = new THREE.MeshStandardMaterial({
        name: 'Mat_Taper_Lever_Gunmetal',
        color: 0x22242a,
        roughness: 0.28,
        metalness: 0.85,
        side: THREE.FrontSide,
        depthWrite: true,
      });

      const screwMat = new THREE.MeshStandardMaterial({
        name: 'Mat_Screws_Titanium_Dark',
        color: 0x353840,
        roughness: 0.30,
        metalness: 0.90,
        side: THREE.FrontSide,
        depthWrite: true,
      });

      const slatMat = new THREE.MeshStandardMaterial({
        name: 'Mat_Vent_Slats_Matte',
        color: 0x0a0a0c,
        roughness: 0.75,
        metalness: 0.05,
        side: THREE.FrontSide,
        depthWrite: true,
      });

      components.forEach((compFaces, cIdx) => {
        const meta = getComponentMeta(cIdx);
        const geo = new THREE.BufferGeometry();
        const positions = [];

        for (const fIdx of compFaces) {
          const f = rawFaces[fIdx];
          positions.push(rawVertices[f[0]].x, rawVertices[f[0]].y, rawVertices[f[0]].z);
          positions.push(rawVertices[f[1]].x, rawVertices[f[1]].y, rawVertices[f[1]].z);
          positions.push(rawVertices[f[2]].x, rawVertices[f[2]].y, rawVertices[f[2]].z);
          if (f.length === 4) {
            positions.push(rawVertices[f[0]].x, rawVertices[f[0]].y, rawVertices[f[0]].z);
            positions.push(rawVertices[f[2]].x, rawVertices[f[2]].y, rawVertices[f[2]].z);
            positions.push(rawVertices[f[3]].x, rawVertices[f[3]].y, rawVertices[f[3]].z);
          }
        }

        geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geo.computeVertexNormals();

        let mat = bodyMat;
        if (meta.type === 'chrome') mat = chromeMat;
        else if (meta.type === 'blade') mat = steelBladeMat;
        else if (meta.type === 'lever') mat = leverMat;
        else if (meta.type === 'screw') mat = screwMat;
        else if (meta.type === 'slat') mat = slatMat;

        const mesh = new THREE.Mesh(geo, mat);
        mesh.name = meta.name;
        modelGroup.add(mesh);
      });

      // Center geometry around (0,0,0)
      const box = new THREE.Box3().setFromObject(modelGroup);
      const center = new THREE.Vector3();
      box.getCenter(center);
      modelGroup.children.forEach(mesh => {
        mesh.geometry.translate(-center.x, -center.y, -center.z);
      });

      // Reorient upright with blade head at top (+Y) and front plate facing +Z
      const orientedContainer = new THREE.Group();
      orientedContainer.name = 'Trimmer_Upright_Container';
      orientedContainer.add(modelGroup);
      modelGroup.rotation.set(-Math.PI / 4, Math.PI / 3, 0);

      // Target scale: max dimension = 3.1
      const orientedBox = new THREE.Box3().setFromObject(orientedContainer);
      const orientedSize = new THREE.Vector3();
      orientedBox.getSize(orientedSize);
      const maxDim = Math.max(orientedSize.x, orientedSize.y, orientedSize.z);
      const targetScale = 3.1 / maxDim;
      orientedContainer.scale.set(targetScale, targetScale, targetScale);

      const finalRoot = new THREE.Scene();
      finalRoot.name = 'AutoStilo_Trimmer_Production';
      finalRoot.add(orientedContainer);

      const exporter = new THREE.GLTFExporter();
      exporter.parse(
        finalRoot,
        function(result) {
          // Convert array buffer to base64
          const bytes = new Uint8Array(result);
          let binary = '';
          for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          window.__GLB_BASE64__ = btoa(binary);
          window.__EXPORT_DONE__ = true;
        },
        { binary: true }
      );
    }

    window.addEventListener('load', runPipeline);
  </script>
</body>
</html>`;

const tmpHtml = path.resolve('public/temp_export_glb.html');
fs.writeFileSync(tmpHtml, html);

console.log('[Playwright] Exportando modelo GLB...');
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto(`file://${tmpHtml.replace(/\\\\/g, '/')}`, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => window.__EXPORT_DONE__ === true, { timeout: 30000 });

const base64Data = await page.evaluate(() => window.__GLB_BASE64__);
const glbBuffer = Buffer.from(base64Data, 'base64');
const outGlbPath = path.join(OUT_DIR, 'auto-stilo-trimmer.glb');
fs.writeFileSync(outGlbPath, glbBuffer);
console.log(`[Sucesso] GLB salvo em: ${outGlbPath} (${(glbBuffer.length / 1024).toFixed(1)} KB)`);

await browser.close();
fs.unlinkSync(tmpHtml);
