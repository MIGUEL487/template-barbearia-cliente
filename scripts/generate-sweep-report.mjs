import fs from 'node:fs';
import path from 'node:path';

const root = 'C:\\Users\\Windows\\.gemini\\antigravity\\scratch\\barbearia-template\\template-barbearia-cliente';
const jsonPath = path.join(root, 'docs/redesign-v3/evidencias/02-diagnostico-sumico/sweep-scroll.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

let md = '# RELATÓRIO DE VARREDURA DE SCROLL (60 PASSOS) — DIAGNÓSTICO DE SUMIÇO DA MÁQUINA 3D\n\n';
md += `Altura Total da Página: ${data.sweepResults.scrollHeight}px | Viewport: ${data.sweepResults.clientHeight}px | MaxScroll: ${data.sweepResults.maxScroll}px\n\n`;

md += '| Passo | Scroll % | ScrollY (px) | Opacidade Canvas | Canvas Visível? | Seções na Viewport | Elemento no Centro | Fundo do Elemento |\n';
md += '| :--- | :---: | :---: | :---: | :---: | :--- | :--- | :--- |\n';

const results = data.sweepResults.results;
let firstDisappear = null;

for (const r of results) {
  const sec = r.sectionsInView.map(s => s.id).join(', ') || 'Nenhuma';
  const topEl = r.elementsAtCenter[0] ? `${r.elementsAtCenter[0].tag}.${r.elementsAtCenter[0].className}` : 'none';
  const bg = r.elementsAtCenter[0] ? r.elementsAtCenter[0].bg : 'transparent';
  
  if (r.containerOpacity < 0.25 && !firstDisappear) {
    firstDisappear = r;
  }

  md += `| ${r.step} | ${r.progressPct}% | ${r.scrollY} | ${r.containerOpacity.toFixed(2)} | ${r.canvasVisible ? 'SIM' : '**NÃO**'} | ${sec} | \`${topEl.slice(0, 35)}\` | \`${bg}\` |\n`;
}

md += '\n## ANÁLISE DETALHADA DAS CAUSAS:\n\n';
md += `1. **Primeiro Ponto de Oclusão / Sumiço:**\n`;
if (firstDisappear) {
  md += `   - **ScrollY:** ${firstDisappear.scrollY}px (Passo ${firstDisappear.step}, ~${firstDisappear.progressPct}% do scroll)\n`;
  md += `   - **Opacidade Registrada:** ${firstDisappear.containerOpacity.toFixed(2)}\n`;
  md += `   - **Seções em Exibição:** ${firstDisappear.sectionsInView.map(s => s.id).join(', ')}\n`;
} else {
  md += `   - A opacidade não caiu abaixo de 0.25 em nenhum ponto intermediário.\n`;
}

md += `\n2. **Curva de Opacidade Programada em global-3d-scene.tsx:**\n`;
md += `   - **Hero (p <= 0.12):** Opacidade interpola de 0.50 para 0.85.\n`;
md += `   - **Assinatura/Ritual (0.12 < p <= 0.26):** Opacidade interpola de 0.85 para 1.00.\n`;
md += `   - **Serviços / Catálogo (0.26 < p <= 0.45):** Opacidade DESPENCA de 1.00 para **0.28** (quase invisível).\n`;
md += `   - **História / Equipe (0.45 < p <= 0.65):** Opacidade sobe timidamente para 0.65.\n`;
md += `   - **Galeria / Entre Fique à vontade / Vídeos / Mapa (0.65 < p <= 0.85):** A timeline NÃO POSSUI MARCOS ESPECÍFICOS para a Galeria (#galeria), Vídeos (.films-section) e Mapa (#contato)! O código pula diretamente de 'História' para 'Agendamento Final'.\n`;
md += `   - **Rodapé (p > 0.85):** Opacidade vai de 0.88 para 0.00.\n`;

md += `\n3. **Fundos Opacos Sobrepostos:**\n`;
md += `   - Verificou-se que a seção do catálogo de serviços (\`#servicos\`), a galeria e as seções de reviews possuem containers internos que ocluem a visualização quando o elemento central possui background opaco.\n`;

fs.writeFileSync(path.join(root, 'docs/redesign-v3/evidencias/02-diagnostico-sumico/diagnostico-sumico-tabela.md'), md, 'utf8');
console.log('diagnostico-sumico-tabela.md escrito com sucesso!');
