import fs from 'node:fs';
import path from 'node:path';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

const OBJ_PATH = path.resolve('refs/27-hair-trimmer/Hair Trimmer.obj');
const OUT_DIR = path.resolve('public/3d');
fs.mkdirSync(OUT_DIR, { recursive: true });

console.log('[Model Pipeline] Lendo Hair Trimmer.obj...');
const content = fs.readFileSync(OBJ_PATH, 'utf-8');
const lines = content.split('\n');

const rawVertices = [];
const rawFaces = [];

for (const rawLine of lines) {
  const line = rawLine.trim();
  if (line.startsWith('v ')) {
    const [, x, y, z] = line.split(/\s+/).map(Number);
    rawVertices.push(new THREE.Vector3(x, y, z));
  } else if (line.startsWith('f ')) {
    const parts = line.split(/\s+/).slice(1);
    const vIdx = parts.map(p => {
      const idx = parseInt(p.split('/')[0], 10);
      return idx > 0 ? idx - 1 : rawVertices.length + idx;
    });
    rawFaces.push(vIdx);
  }
}

console.log(`Carregados ${rawVertices.length} vértices e ${rawFaces.length} faces quads.`);

// 1. Separate into 20 connected components
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

console.log(`Identificados ${components.length} componentes conectados.`);

// 2. Build root Three.js Group
const modelGroup = new THREE.Group();
modelGroup.name = 'AutoStiloHairTrimmer';

// Component Naming Map according to Phase 0 identification
function getComponentMeta(cIdx) {
  switch (cIdx) {
    case 0:
      return { name: 'lever_assembly', type: 'lever' };
    case 1:
      return { name: 'body_shell', type: 'body' };
    case 2:
      return { name: 'blade_top_support', type: 'blade' };
    case 3:
      return { name: 'blade_bottom_guide', type: 'blade' };
    case 4:
      return { name: 'front_plate_chrome', type: 'chrome' };
    case 5:
    case 6:
    case 7:
      return { name: `blade_cutting_teeth_${cIdx - 4}`, type: 'blade' };
    case 8:
      return { name: 'blade_comb_support', type: 'blade' };
    case 9:
    case 10:
    case 11:
      return { name: `screw_${cIdx - 8}`, type: 'screw' };
    default:
      return { name: `vent_slat_${cIdx - 11}`, type: 'slat' };
  }
}

// 3. Physical Materials (MeshPhysicalMaterial) for authentic studio realism
const bodyMat = new THREE.MeshPhysicalMaterial({
  name: 'Mat_Body_Polymer_Matte',
  color: new THREE.Color(0x131417),
  roughness: 0.42,
  metalness: 0.02,
  clearcoat: 0.18,
  clearcoatRoughness: 0.35,
  side: THREE.FrontSide,
  transparent: false,
  depthWrite: true,
});

const chromeMat = new THREE.MeshPhysicalMaterial({
  name: 'Mat_FrontPlate_Chrome',
  color: new THREE.Color(0xf2f4f8),
  roughness: 0.14,
  metalness: 0.98,
  clearcoat: 0.35,
  clearcoatRoughness: 0.12,
  side: THREE.FrontSide,
  transparent: false,
  depthWrite: true,
});

const steelBladeMat = new THREE.MeshPhysicalMaterial({
  name: 'Mat_Blades_Surgical_Steel',
  color: new THREE.Color(0xdce0e8),
  roughness: 0.24,
  metalness: 0.96,
  clearcoat: 0.15,
  clearcoatRoughness: 0.20,
  side: THREE.FrontSide,
  transparent: false,
  depthWrite: true,
});

const leverMat = new THREE.MeshPhysicalMaterial({
  name: 'Mat_Taper_Lever_Gunmetal',
  color: new THREE.Color(0x22242a),
  roughness: 0.28,
  metalness: 0.85,
  clearcoat: 0.20,
  side: THREE.FrontSide,
  transparent: false,
  depthWrite: true,
});

const screwMat = new THREE.MeshPhysicalMaterial({
  name: 'Mat_Screws_Titanium_Dark',
  color: new THREE.Color(0x353840),
  roughness: 0.30,
  metalness: 0.90,
  side: THREE.FrontSide,
  transparent: false,
  depthWrite: true,
});

const slatMat = new THREE.MeshPhysicalMaterial({
  name: 'Mat_Vent_Slats_Matte',
  color: new THREE.Color(0x0a0a0c),
  roughness: 0.75,
  metalness: 0.05,
  side: THREE.FrontSide,
  transparent: false,
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
  // Compute smooth normals to eliminate any faceting
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

// 4. Center of Mass & Reorientation:
// Align longitudinal axis to +Y (blade up), front plate to +Z
const box = new THREE.Box3().setFromObject(modelGroup);
const center = new THREE.Vector3();
box.getCenter(center);

// Center geometry around (0,0,0)
modelGroup.children.forEach(mesh => {
  mesh.geometry.translate(-center.x, -center.y, -center.z);
});

// Create oriented parent
const orientedContainer = new THREE.Group();
orientedContainer.name = 'Trimmer_Upright_Container';
orientedContainer.add(modelGroup);

// Transform: rotate diagonal axis (~-38.2° on Y, -90° on Z, tilt on X) so that:
// - Blade is at top (+Y)
// - Front plate is facing front (+Z)
modelGroup.rotation.set(-Math.PI / 4, Math.PI / 3, 0);

// Scale to exact target: maximum dimension = 3.1 units (Fase 2, item 2)
orientedContainer.updateMatrixWorld(true);
const orientedBox = new THREE.Box3().setFromObject(orientedContainer);
const orientedSize = new THREE.Vector3();
orientedBox.getSize(orientedSize);

const maxDim = Math.max(orientedSize.x, orientedSize.y, orientedSize.z);
const targetScale = 3.1 / maxDim;
orientedContainer.scale.set(targetScale, targetScale, targetScale);

// Bake scale into world transform
const finalRoot = new THREE.Scene();
finalRoot.name = 'AutoStilo_Trimmer_Production';
finalRoot.add(orientedContainer);

console.log(`Dimensões finais reorientadas: ${orientedSize.x.toFixed(2)} x ${orientedSize.y.toFixed(2)} x ${orientedSize.z.toFixed(2)} -> Escala aplicada: ${targetScale.toFixed(4)}`);

// 5. Export to binary GLB
const exporter = new GLTFExporter();
exporter.parse(
  finalRoot,
  (result) => {
    const glbBuffer = Buffer.from(result);
    const glbPath = path.join(OUT_DIR, 'auto-stilo-trimmer.glb');
    fs.writeFileSync(glbPath, glbBuffer);
    console.log(`[Sucesso] Modelo GLB exportado com sucesso: ${glbPath} (${(glbBuffer.length / 1024).toFixed(1)} KB)`);
  },
  (err) => {
    console.error('Erro na exportação GLB:', err);
  },
  { binary: true }
);
