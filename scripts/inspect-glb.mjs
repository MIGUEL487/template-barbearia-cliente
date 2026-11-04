import fs from 'node:fs';
import path from 'node:path';

const root = 'C:\\Users\\Windows\\.gemini\\antigravity\\scratch\\barbearia-template\\template-barbearia-cliente';
const glbPath = path.join(root, 'public/3d/auto-stilo-trimmer.glb');
const glb = fs.readFileSync(glbPath);

const jsonLength = glb.readUInt32LE(12);
const jsonChunk = glb.subarray(20, 20 + jsonLength).toString('utf8');
const gltf = JSON.parse(jsonChunk);

let report = '# INSPEÇÃO DO MODELO GLB ATUAL (auto-stilo-trimmer.glb)\n\n';
report += `Tamanho do Arquivo: ${(glb.length / 1024).toFixed(1)} KB\n\n`;
report += `## 1. Materiais Definidos no GLB:\n\`\`\`json\n${JSON.stringify(gltf.materials, null, 2)}\n\`\`\`\n\n`;
report += `## 2. Texturas e Imagens:\n\`\`\`json\nTextures: ${JSON.stringify(gltf.textures || [], null, 2)}\nImages: ${JSON.stringify(gltf.images || [], null, 2)}\n\`\`\`\n\n`;
report += `## 3. Malhas e Primitivas:\n\`\`\`json\n${JSON.stringify(gltf.meshes, null, 2)}\n\`\`\`\n`;

fs.writeFileSync(path.join(root, 'docs/redesign-v3/evidencias/01-stills/inspecao-glb.md'), report, 'utf8');
console.log('inspecao-glb.md gerado com sucesso!');
