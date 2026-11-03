import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';

const ROOT_DIR = 'C:\\Users\\Windows\\.gemini\\antigravity\\scratch\\barbearia-template\\template-barbearia-cliente';
const OUT_DIR = path.join(ROOT_DIR, 'public/3d');
const STILLS_DIR = path.join(ROOT_DIR, 'docs/redesign-v3/evidencias/01-stills');
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(STILLS_DIR, { recursive: true });

const objContent = fs.readFileSync(path.join(ROOT_DIR, 'refs/27-hair-trimmer/Hair Trimmer.obj'), 'utf-8');

const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/exporters/GLTFExporter.js"></script>
</head>
<body style="margin: 0; background: #FBFAF8; overflow: hidden;">
  <canvas id="c" width="1024" height="1024"></canvas>
  <script>
    window.__OBJ_DATA__ = ${JSON.stringify(objContent)};
    window.__EXPORT_DONE__ = false;

    async function runPipeline() {
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

      // Model group
      const modelGroup = new THREE.Group();
      modelGroup.name = 'AutoStilo_Trimmer_Pieces';

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

      // Calibrated Physical PBR Materials (Fase 1.2 Table)
      // Carcaça e tampas: Plástico preto/grafite #101113, roughness 0.50, metalness 0.0
      const bodyMat = new THREE.MeshStandardMaterial({
        name: 'Mat_Body_Polymer_Dark',
        color: 0x101113,
        roughness: 0.50,
        metalness: 0.0,
        side: THREE.FrontSide,
        depthWrite: true,
      });

      // Placa frontal: Cromo escovado #E2E8F0, roughness 0.25, metalness 1.0
      const chromeMat = new THREE.MeshStandardMaterial({
        name: 'Mat_FrontPlate_Chrome',
        color: 0xE2E8F0,
        roughness: 0.25,
        metalness: 1.0,
        side: THREE.FrontSide,
        depthWrite: true,
      });

      // Lâminas: Aço inox escovado #CBD5E1, roughness 0.32, metalness 1.0
      const steelBladeMat = new THREE.MeshStandardMaterial({
        name: 'Mat_Blades_Surgical_Steel',
        color: 0xCBD5E1,
        roughness: 0.32,
        metalness: 1.0,
        side: THREE.FrontSide,
        depthWrite: true,
      });

      // Alavanca: Plástico escuro + parafuso metálico #18191D, roughness 0.45, metalness 0.20
      const leverMat = new THREE.MeshStandardMaterial({
        name: 'Mat_Taper_Lever_Dark',
        color: 0x18191D,
        roughness: 0.45,
        metalness: 0.20,
        side: THREE.FrontSide,
        depthWrite: true,
      });

      // Parafusos: Metal escuro #334155, roughness 0.35, metalness 1.0
      const screwMat = new THREE.MeshStandardMaterial({
        name: 'Mat_Screws_Dark_Metal',
        color: 0x334155,
        roughness: 0.35,
        metalness: 1.0,
        side: THREE.FrontSide,
        depthWrite: true,
      });

      // Grade de ventilação: Preto fosco #0A0A0C, roughness 0.75, metalness 0.0
      const slatMat = new THREE.MeshStandardMaterial({
        name: 'Mat_Vent_Slats_Matte',
        color: 0x0A0A0C,
        roughness: 0.75,
        metalness: 0.0,
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

      // 1. Center of mass to (0,0,0)
      const initialBox = new THREE.Box3().setFromObject(modelGroup);
      const center = new THREE.Vector3();
      initialBox.getCenter(center);
      modelGroup.children.forEach(mesh => {
        mesh.geometry.translate(-center.x, -center.y, -center.z);
      });

      // 2. Reorient longitudinal axis along +Y (blade up) and front plate facing +Z
      const rotMatrix = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(-Math.PI / 4, Math.PI / 3, 0, 'XYZ'));
      modelGroup.children.forEach(mesh => {
        mesh.geometry.applyMatrix4(rotMatrix);
      });

      // 3. Scale to max dimension = 3.1
      const rotatedBox = new THREE.Box3().setFromObject(modelGroup);
      const rotatedSize = new THREE.Vector3();
      rotatedBox.getSize(rotatedSize);
      const maxDim = Math.max(rotatedSize.x, rotatedSize.y, rotatedSize.z);
      const targetScale = 3.1 / maxDim;

      const scaleMatrix = new THREE.Matrix4().makeScale(targetScale, targetScale, targetScale);
      modelGroup.children.forEach(mesh => {
        mesh.geometry.applyMatrix4(scaleMatrix);
        mesh.geometry.computeVertexNormals();
      });

      // 4. Final centering
      const finalBox = new THREE.Box3().setFromObject(modelGroup);
      const finalCenter = new THREE.Vector3();
      finalBox.getCenter(finalCenter);
      modelGroup.children.forEach(mesh => {
        mesh.geometry.translate(-finalCenter.x, -finalCenter.y, -finalCenter.z);
      });

      // Final Scene for Export
      const exportScene = new THREE.Scene();
      exportScene.name = 'AutoStilo_Trimmer_Production';
      exportScene.add(modelGroup);

      // Export to binary GLB
      const exporter = new THREE.GLTFExporter();
      exporter.parse(
        exportScene,
        function(result) {
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

      // Render Scene Setup for Stills
      const canvas = document.getElementById('c');
      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: false,
      });
      renderer.setSize(1024, 1024);
      renderer.setPixelRatio(1);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.90; // Exposure 0.90 calibrada
      renderer.outputEncoding = THREE.sRGBEncoding;

      const stillScene = new THREE.Scene();
      stillScene.background = new THREE.Color(0xFBFAF8); // Fundo claro editorial real

      // Calibrated Studio Lighting Rig
      const ambLight = new THREE.AmbientLight(0xffffff, 0.45);
      stillScene.add(ambLight);

      const keyLight = new THREE.DirectionalLight(0xfff8ee, 2.2);
      keyLight.position.set(3.5, 4.5, 3.5);
      stillScene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0xdbeafe, 0.9);
      fillLight.position.set(-3.0, 1.5, 2.5);
      stillScene.add(fillLight);

      const violetRim = new THREE.DirectionalLight(0xa855f7, 1.6);
      violetRim.position.set(-2.5, -2.5, -2.5);
      stillScene.add(violetRim);

      const topRim = new THREE.DirectionalLight(0xffffff, 1.2);
      topRim.position.set(1.0, 4.0, -2.5);
      stillScene.add(topRim);

      stillScene.add(modelGroup);

      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
      camera.position.set(0, 0, 5.0);

      window.__renderAngle = function(rx, ry, rz, dist = 5.0, targetY = 0) {
        modelGroup.rotation.set(rx, ry, rz);
        modelGroup.position.set(0, targetY, 0);
        camera.position.set(0, 0, dist);
        camera.lookAt(0, 0, 0);
        renderer.render(stillScene, camera);
      };
    }

    runPipeline();
  </script>
</body>
</html>
`;

const browser = await chromium.launch({
  headless: true,
  args: ['--enable-webgl', '--use-gl=angle', '--ignore-gpu-blocklist', '--no-sandbox']
});

try {
  const page = await browser.newPage({ viewport: { width: 1024, height: 1024 } });
  await page.setContent(html);

  console.log('[Pipeline] Aguardando exportação GLB...');
  await page.waitForFunction(() => window.__EXPORT_DONE__ === true, { timeout: 60000 });

  const glbBase64 = await page.evaluate(() => window.__GLB_BASE64__);
  const glbBuffer = Buffer.from(glbBase64, 'base64');
  const glbDest = path.join(OUT_DIR, 'auto-stilo-trimmer.glb');
  fs.writeFileSync(glbDest, glbBuffer);
  console.log(`✅ [Sucesso] GLB salvo em ${glbDest} (${(glbBuffer.length / 1024).toFixed(1)} KB)`);

  // Render 8 Approval Stills + Hero Pose
  const stills = [
    { name: 'still_01_frente.png', rx: 0, ry: 0, rz: 0, dist: 4.8 },
    { name: 'still_02_costas.png', rx: 0, ry: Math.PI, rz: 0, dist: 4.8 },
    { name: 'still_03_perfil_esquerdo.png', rx: 0, ry: Math.PI / 2, rz: 0, dist: 4.8 },
    { name: 'still_04_perfil_direito.png', rx: 0, ry: -Math.PI / 2, rz: 0, dist: 4.8 },
    { name: 'still_05_topo_lamina.png', rx: -Math.PI / 3, ry: 0, rz: 0, dist: 4.2 },
    { name: 'still_06_base.png', rx: Math.PI / 3, ry: 0, rz: 0, dist: 4.2 },
    { name: 'still_07_isometrico_3_4.png', rx: 0.15, ry: -0.55, rz: 0.05, dist: 4.8 },
    { name: 'still_08_macro_lamina.png', rx: -0.45, ry: 0.25, rz: 0, dist: 2.2, targetY: -0.9 },
    { name: 'still_hero_em_pe.png', rx: 0.07, ry: -0.35, rz: 0.0, dist: 4.8 }, // Pose vertical em pé no Hero
  ];

  for (const s of stills) {
    await page.evaluate(({ rx, ry, rz, dist, targetY }) => {
      window.__renderAngle(rx, ry, rz, dist, targetY || 0);
    }, s);
    await page.waitForTimeout(100);
    const canvas = page.locator('#c');
    const dest = path.join(STILLS_DIR, s.name);
    await canvas.screenshot({ path: dest });
    console.log(`[Still] Salvo: ${s.name}`);
  }

  console.log('\n✅ [Fase 1 Concluída] Modelo GLB PBR com 6 materiais físicos e 9 stills gerados.');

} finally {
  await browser.close();
}
