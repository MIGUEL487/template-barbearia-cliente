import fs from 'node:fs';
import path from 'node:path';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

const ROOT_DIR = 'C:\\Users\\Windows\\.gemini\\antigravity\\scratch\\barbearia-template\\template-barbearia-cliente';
const OBJ_PATH = path.join(ROOT_DIR, 'refs/27-hair-trimmer/Hair Trimmer.obj');
const OUT_GLB = path.join(ROOT_DIR, 'public/3d/auto-stilo-trimmer.glb');

console.log('[Pipeline] Lendo Hair Trimmer.obj...');
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

console.log(`Vértices carregados: ${rawVertices.length}, Faces quads: ${rawFaces.length}`);

// 1. Separar componentes conectados
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
console.log(`Total de componentes conectados: ${components.length}`);

// 2. Definir Materiais PBR Conforme Tabela da Fase 1.2
// Sem specular herdado, sem transparent, depthWrite: true, side: FrontSide
const matBody = new THREE.MeshPhysicalMaterial({
  name: 'Mat_Body_Polymer_Dark',
  color: new THREE.Color(0x101113),
  roughness: 0.50,
  metalness: 0.0,
  clearcoat: 0.10,
  clearcoatRoughness: 0.40,
  side: THREE.FrontSide,
  transparent: false,
  depthWrite: true,
});

const matChrome = new THREE.MeshPhysicalMaterial({
  name: 'Mat_FrontPlate_Chrome',
  color: new THREE.Color(0xE2E8F0),
  roughness: 0.25,
  metalness: 1.0,
  clearcoat: 0.30,
  clearcoatRoughness: 0.15,
  side: THREE.FrontSide,
  transparent: false,
  depthWrite: true,
});

const matSteelBlade = new THREE.MeshPhysicalMaterial({
  name: 'Mat_Blades_Surgical_Steel',
  color: new THREE.Color(0xCBD5E1),
  roughness: 0.32,
  metalness: 1.0,
  clearcoat: 0.15,
  side: THREE.FrontSide,
  transparent: false,
  depthWrite: true,
});

const matLever = new THREE.MeshPhysicalMaterial({
  name: 'Mat_Lever_Polymer',
  color: new THREE.Color(0x18191D),
  roughness: 0.45,
  metalness: 0.20,
  clearcoat: 0.10,
  side: THREE.FrontSide,
  transparent: false,
  depthWrite: true,
});

const matScrews = new THREE.MeshPhysicalMaterial({
  name: 'Mat_Screws_Dark_Metal',
  color: new THREE.Color(0x334155),
  roughness: 0.35,
  metalness: 1.0,
  side: THREE.FrontSide,
  transparent: false,
  depthWrite: true,
});

const matVents = new THREE.MeshPhysicalMaterial({
  name: 'Mat_Vent_Slats_Matte',
  color: new THREE.Color(0x0A0A0C),
  roughness: 0.75,
  metalness: 0.0,
  side: THREE.FrontSide,
  transparent: false,
  depthWrite: true,
});

function getComponentMeta(cIdx) {
  // cIdx 0..19
  // 0: alavanca (4360 tris)
  // 1: carcaça (3820 tris)
  // 2: lâmina topo (1644 tris)
  // 3: lâmina guia (1552 tris)
  // 4: placa frontal cromo (560 tris)
  // 5..7: dentes corte (440 tris cada)
  // 8: suporte pente (348 tris)
  // 9..11: parafusos (240, 240, 224 tris)
  // 12..19: ranhuras grade ventilação (48 tris cada)
  if (cIdx === 0) return { name: 'lever_assembly', material: matLever };
  if (cIdx === 1) return { name: 'body_shell', material: matBody };
  if (cIdx === 4) return { name: 'front_plate_chrome', material: matChrome };
  if ([2, 3, 5, 6, 7, 8].includes(cIdx)) return { name: `blade_part_${cIdx}`, material: matSteelBlade };
  if ([9, 10, 11].includes(cIdx)) return { name: `screw_${cIdx - 8}`, material: matScrews };
  return { name: `vent_slat_${cIdx - 11}`, material: matVents };
}

// 3. Montar Geometrias e Malhas
const rootGroup = new THREE.Group();
rootGroup.name = 'AutoStilo_Trimmer_Root';

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

  const mesh = new THREE.Mesh(geo, meta.material);
  mesh.name = meta.name;
  rootGroup.add(mesh);
});

// 4. Centralização e Reorientação Físico-Geométrica
// Centro de massa na origem
const rawBox = new THREE.Box3().setFromObject(rootGroup);
const center = new THREE.Vector3();
rawBox.getCenter(center);

rootGroup.children.forEach(mesh => {
  mesh.geometry.translate(-center.x, -center.y, -center.z);
});

// No Hair Trimmer.obj original:
// O eixo longitudinal está deitado no plano XZ girado a ~40°, e o topo da lâmina aponta para X positivo / Z negativo.
// Uma rotação combinada de:
// rx = -Math.PI / 4 (-45°)
// ry = Math.PI / 3 (+60°)
// rz = 0
// Ou vamos calcular a matriz exata para que a lâmina (peça 2/3) fique com Y máximo (topo) e a placa frontal (peça 4) fique com Z máximo (frente).
const rotMatrix = new THREE.Matrix4();
rotMatrix.makeRotationFromEuler(new THREE.Euler(-Math.PI / 4, Math.PI / 3, 0, 'XYZ'));

rootGroup.children.forEach(mesh => {
  mesh.geometry.applyMatrix4(rotMatrix);
});

// Recalcular bounding box após rotação
const rotatedBox = new THREE.Box3().setFromObject(rootGroup);
const rotatedSize = new THREE.Vector3();
rotatedBox.getSize(rotatedSize);

const maxDim = Math.max(rotatedSize.x, rotatedSize.y, rotatedSize.z);
const targetScale = 3.1 / maxDim;

// Aplicar escala diretamente nos vértices (baked transform, regra 5)
const scaleMatrix = new THREE.Matrix4().makeScale(targetScale, targetScale, targetScale);
rootGroup.children.forEach(mesh => {
  mesh.geometry.applyMatrix4(scaleMatrix);
  mesh.geometry.computeVertexNormals();
});

// Centralizar perfeitamente mais uma vez após scale
const finalBox = new THREE.Box3().setFromObject(rootGroup);
const finalCenter = new THREE.Vector3();
finalBox.getCenter(finalCenter);

rootGroup.children.forEach(mesh => {
  mesh.geometry.translate(-finalCenter.x, -finalCenter.y, -finalCenter.z);
});

const checkSize = new THREE.Vector3();
new THREE.Box3().setFromObject(rootGroup).getSize(checkSize);
console.log(`Dimensões finais normadas: ${checkSize.x.toFixed(2)} x ${checkSize.y.toFixed(2)} x ${checkSize.z.toFixed(2)} (Maior: ${Math.max(checkSize.x, checkSize.y, checkSize.z).toFixed(2)})`);

// 5. Exportar GLB Binário
const exporter = new GLTFExporter();
exporter.parse(
  rootGroup,
  (glbArrayBuffer) => {
    const buffer = Buffer.from(glbArrayBuffer);
    fs.writeFileSync(OUT_GLB, buffer);
    console.log(`\n✅ [Sucesso] GLB exportado para: ${OUT_GLB} (${(buffer.length / 1024).toFixed(1)} KB)`);
  },
  (err) => {
    console.error('Erro ao exportar GLB:', err);
  },
  { binary: true }
);
