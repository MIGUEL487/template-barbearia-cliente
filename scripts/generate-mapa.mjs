import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = 'C:\\Users\\Windows\\.gemini\\antigravity\\scratch\\barbearia-template\\template-barbearia-cliente';

const commands = [
  { name: '1. fique à vontade / entre', cmd: 'git grep -n -i -E "fique (à|a) vontade|entre\\.?\\s*$|entre\\."' },
  { name: '2. ateliê monte sião / precisão e acabamento', cmd: 'git grep -n -i -E "ateli(ê|e) monte si(ã|a)o|precis(ã|a)o e acabamento"' },
  { name: '3. carregar mapa', cmd: 'git grep -n -i "carregar mapa"' },
  { name: '4. maps / google / iframe', cmd: 'git grep -n -i -E "maps\\.google|google\\.com/maps|openstreetmap|leaflet|mapbox|<iframe"' },
  { name: '5. video elements', cmd: 'git grep -n -E "<video|\\.mp4|\\.webm|HTMLVideoElement"' },
  { name: '6. three.js imports', cmd: 'git grep -l -E "from [\'\"]three|require\\([\'\"]three"' },
  { name: '7. gsap / ScrollTrigger / lenis', cmd: 'git grep -l -E "gsap|ScrollTrigger|lenis"' },
  { name: '8. 3D Loaders and Materials', cmd: 'git grep -n -E "GLTFLoader|OBJLoader|MTLLoader|FBXLoader|MeshPhongMaterial|MeshStandardMaterial|MeshPhysicalMaterial"' },
  { name: '9. border-radius / rounded nos estilos e componentes', cmd: 'git grep -n -i -E "border-radius|rounded" -- "*.css" "*.tsx"' }
];

let report = '# MAPA DO CÓDIGO — REDESIGN V3\n\nGerado automaticamente via buscas git grep na raiz do repositório.\n\n';

for (const c of commands) {
  report += `## ${c.name}\n\`\`\`\n`;
  try {
    const out = execSync(c.cmd, { cwd: root, encoding: 'utf-8' });
    report += out.trim() + '\n';
  } catch (err) {
    report += (err.stdout ? err.stdout.trim() : 'Nenhuma ocorrência encontrada.') + '\n';
  }
  report += '```\n\n';
}

// Also find public media files
report += '## 10. Arquivos de mídia em public/\n```\n';
function walkDir(dir) {
  let files = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      files = files.concat(walkDir(full));
    } else if (/\.(mp4|webm|glb|jpg|jpeg|webp|png|obj|mtl)$/i.test(item.name)) {
      files.push(full.replace(root + path.sep, '').replace(/\\/g, '/'));
    }
  }
  return files;
}

try {
  const publicFiles = walkDir(path.join(root, 'public')).sort();
  report += publicFiles.join('\n') + '\n';
} catch (e) {
  report += 'Erro listando public/: ' + e.message + '\n';
}
report += '```\n';

fs.writeFileSync(path.join(root, 'docs/redesign-v3/00-mapa-do-codigo.md'), report, 'utf-8');
console.log('00-mapa-do-codigo.md gerado com sucesso!');
