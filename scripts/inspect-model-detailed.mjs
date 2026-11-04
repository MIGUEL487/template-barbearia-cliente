import fs from 'node:fs';
import path from 'node:path';

const objPath = path.resolve('refs/27-hair-trimmer/Hair Trimmer.obj');
const mtlPath = path.resolve('refs/27-hair-trimmer/Hair Trimmer.mtl');

const content = fs.readFileSync(objPath, 'utf-8');
const lines = content.split('\n');

let v = 0;
let vt = 0;
let vn = 0;
let f = 0;
let triCount = 0;
let quadCount = 0;
let other = 0;
const g = new Set();
const o = new Set();
const usemtl = new Set();

let minU = Infinity, maxU = -Infinity, minV = Infinity, maxV = -Infinity;
let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, minZ = Infinity, maxZ = -Infinity;

for (const rawLine of lines) {
  const line = rawLine.trim();
  if (line.startsWith('v ')) {
    v++;
    const [, x, y, z] = line.split(/\s+/).map(Number);
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
    if (z < minZ) minZ = z;
    if (z > maxZ) maxZ = z;
  } else if (line.startsWith('vt ')) {
    vt++;
    const [, u, vCoord] = line.split(/\s+/).map(Number);
    if (u < minU) minU = u;
    if (u > maxU) maxU = u;
    if (vCoord < minV) minV = vCoord;
    if (vCoord > maxV) maxV = vCoord;
  } else if (line.startsWith('vn ')) {
    vn++;
  } else if (line.startsWith('f ')) {
    f++;
    const parts = line.split(/\s+/).slice(1);
    if (parts.length === 3) triCount++;
    else if (parts.length === 4) quadCount++;
    else other++;
  } else if (line.startsWith('g ')) {
    g.add(line);
  } else if (line.startsWith('o ')) {
    o.add(line);
  } else if (line.startsWith('usemtl ')) {
    usemtl.add(line);
  }
}

console.log('--- ESTATÍSTICAS DO MODELO OBJ ORIGINAL ---');
console.log('Vértices geométricos (v):', v);
console.log('Coordenadas UV (vt):', vt);
console.log('Normais de vértice (vn):', vn);
console.log('Faces poligonais (f):', f, `(Triângulos: ${triCount}, Quads: ${quadCount}, Outros: ${other})`);
console.log('Total equivalente de triângulos:', triCount + quadCount * 2);
console.log('Objetos (o):', Array.from(o));
console.log('Grupos (g):', Array.from(g));
console.log('Materiais referenciados (usemtl):', Array.from(usemtl));
console.log('Limites X:', minX.toFixed(4), 'a', maxX.toFixed(4), '-> Largura:', (maxX - minX).toFixed(4));
console.log('Limites Y:', minY.toFixed(4), 'a', maxY.toFixed(4), '-> Altura:', (maxY - minY).toFixed(4));
console.log('Limites Z:', minZ.toFixed(4), 'a', maxZ.toFixed(4), '-> Profundidade:', (maxZ - minZ).toFixed(4));
console.log('Limites UV U:', minU.toFixed(4), 'a', maxU.toFixed(4));
console.log('Limites UV V:', minV.toFixed(4), 'a', maxV.toFixed(4));

if (fs.existsSync(mtlPath)) {
  console.log('\n--- CONTEÚDO DO ARQUIVO MTL ---');
  console.log(fs.readFileSync(mtlPath, 'utf-8'));
}
