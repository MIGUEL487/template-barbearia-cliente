import fs from 'node:fs';
import path from 'node:path';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

const dir = path.resolve('public/models/hair-clipper');
const objContent = fs.readFileSync(path.join(dir, 'Hair Trimmer.obj'), 'utf-8');

console.log('--- Analisando Hair Trimmer.obj com OBJLoader ---');
const loader = new OBJLoader();
const object = loader.parse(objContent);

console.log('Objeto raiz:', object.type, 'Filhos:', object.children.length);

let totalVertices = 0;
let totalFaces = 0;

object.traverse((child) => {
  if (child.isMesh) {
    const geo = child.geometry;
    const pos = geo.attributes.position;
    const count = pos ? pos.count : 0;
    totalVertices += count;
    console.log(`Mesh: "${child.name}", Vértices: ${count}, Tem Normals: ${!!geo.attributes.normal}, Tem UVs: ${!!geo.attributes.uv}`);
  }
});

// Compute Bounding Box
const box = new THREE.Box3().setFromObject(object);
const size = new THREE.Vector3();
box.getSize(size);
const center = new THREE.Vector3();
box.getCenter(center);

console.log('\n--- Dimensões e Posição do Modelo ---');
console.log(`Bounding Box Min: (${box.min.x.toFixed(2)}, ${box.min.y.toFixed(2)}, ${box.min.z.toFixed(2)})`);
console.log(`Bounding Box Max: (${box.max.x.toFixed(2)}, ${box.max.y.toFixed(2)}, ${box.max.z.toFixed(2)})`);
console.log(`Tamanho Total (L x A x P): ${size.x.toFixed(2)} x ${size.y.toFixed(2)} x ${size.z.toFixed(2)}`);
console.log(`Centro Geométrico: (${center.x.toFixed(2)}, ${center.y.toFixed(2)}, ${center.z.toFixed(2)})`);
console.log(`Total de Vértices: ${totalVertices}`);
