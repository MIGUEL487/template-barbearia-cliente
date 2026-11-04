import fs from 'node:fs';
import path from 'node:path';

const root = 'C:\\Users\\Windows\\.gemini\\antigravity\\scratch\\barbearia-template\\template-barbearia-cliente';
const jsonPath = path.join(root, 'docs/redesign-v3/evidencias/00-antes/button-audit.json');
const buttons = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const radii = {};
buttons.forEach(b => {
  radii[b.borderRadius] = (radii[b.borderRadius] || 0) + 1;
});

let md = '# AUDITORIA DE BORDER-RADIUS DOS BOTÕES\n\n';
md += '## Distribuição de Border-Radius Encontrada:\n\n';
md += '| Border-Radius Computado | Quantidade de Botões | Situação |\n';
md += '| :--- | :---: | :--- |\n';

for (const [r, count] of Object.entries(radii)) {
  const status = r === '12px' ? '✅ Sugerido pelo V3' : '❌ Inconsistente (pílula / 8px / 9999px)';
  md += `| \`${r}\` | ${count} | ${status} |\n`;
}

md += '\n## Lista Completa dos Botões Auditados:\n\n';
md += '| Texto / Rótulo | Tag | Classe | Border-Radius |\n';
md += '| :--- | :---: | :--- | :---: |\n';

buttons.forEach(b => {
  md += `| ${b.text || '(sem texto)'} | \`${b.tag}\` | \`${(b.className || '').slice(0, 40)}\` | \`${b.borderRadius}\` |\n`;
});

fs.writeFileSync(path.join(root, 'docs/redesign-v3/evidencias/00-antes/botoes-diagnostico.md'), md, 'utf8');
console.log('botoes-diagnostico.md escrito!');
