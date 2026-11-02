import fs from 'node:fs';
import path from 'node:path';

const objPath = path.resolve('refs/27-hair-trimmer/Hair Trimmer.obj');
const content = fs.readFileSync(objPath, 'utf-8');
const lines = content.split('\n');

const vertices = [];
const faces = []; // array of vertex indices (0-based)

for (const rawLine of lines) {
  const line = rawLine.trim();
  if (line.startsWith('v ')) {
    const [, x, y, z] = line.split(/\s+/).map(Number);
    vertices.push({ x, y, z });
  } else if (line.startsWith('f ')) {
    const parts = line.split(/\s+/).slice(1);
    const vIndices = parts.map(p => {
      const vIdx = parseInt(p.split('/')[0], 10);
      return vIdx > 0 ? vIdx - 1 : vertices.length + vIdx;
    });
    faces.push(vIndices);
  }
}

console.log(`Carregados ${vertices.length} vértices e ${faces.length} faces quads.`);

// Build graph of connected faces (share at least one vertex index)
// In an OBJ mesh, quads can be split into 2 triangles
// An adjacency graph can be built: vertex -> faces that use this vertex
const vertexToFaces = Array.from({ length: vertices.length }, () => []);
for (let fIdx = 0; fIdx < faces.length; fIdx++) {
  for (const vIdx of faces[fIdx]) {
    vertexToFaces[vIdx].push(fIdx);
  }
}

// Disjoint Set Union (DSU) or Breadth-First Search (BFS) to find connected components of faces
const visitedFaces = new Uint8Array(faces.length);
const components = [];

for (let i = 0; i < faces.length; i++) {
  if (visitedFaces[i]) continue;
  
  const componentFaces = [];
  const queue = [i];
  visitedFaces[i] = 1;

  while (queue.length > 0) {
    const currFace = queue.pop();
    componentFaces.push(currFace);

    for (const vIdx of faces[currFace]) {
      for (const neighborFace of vertexToFaces[vIdx]) {
        if (!visitedFaces[neighborFace]) {
          visitedFaces[neighborFace] = 1;
          queue.push(neighborFace);
        }
      }
    }
  }

  components.push(componentFaces);
}

// Sort components by triangle count descending (quad = 2 triangles)
components.sort((a, b) => b.length - a.length);

console.log(`\n--- COMPONENTES CONECTADOS IDENTIFICADOS: ${components.length} peças ---`);
const componentDetails = components.map((compFaces, index) => {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, minZ = Infinity, maxZ = -Infinity;
  const compVertSet = new Set();
  
  for (const fIdx of compFaces) {
    for (const vIdx of faces[fIdx]) {
      compVertSet.add(vIdx);
      const { x, y, z } = vertices[vIdx];
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      if (z < minZ) minZ = z;
      if (z > maxZ) maxZ = z;
    }
  }

  const length = Math.hypot(maxX - minX, maxY - minY, maxZ - minZ);
  const triCount = compFaces.length * 2;

  return {
    index: index + 1,
    quads: compFaces.length,
    triangles: triCount,
    vertices: compVertSet.size,
    bbox: {
      dx: (maxX - minX).toFixed(3),
      dy: (maxY - minY).toFixed(3),
      dz: (maxZ - minZ).toFixed(3),
      diag: length.toFixed(3),
    },
    bounds: { minX, maxX, minY, maxY, minZ, maxZ },
    faceIndices: compFaces
  };
});

for (const comp of componentDetails) {
  console.log(`Peça #${comp.index}: ${comp.triangles} triângulos (${comp.quads} quads, ${comp.vertices} vértices). BBox: ${comp.bbox.dx} x ${comp.bbox.dy} x ${comp.bbox.dz} (Diag: ${comp.bbox.diag})`);
}

fs.writeFileSync(
  path.resolve('docs/redesign3d/evidencias/00-antes/pecas_componentes.json'),
  JSON.stringify(componentDetails.map(c => ({
    index: c.index,
    triangles: c.triangles,
    quads: c.quads,
    vertices: c.vertices,
    bbox: c.bbox
  })), null, 2)
);
