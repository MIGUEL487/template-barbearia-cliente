# Relatório Consolidado de Execução — Redesign V3

**Projeto:** Auto Stilo Barbearia — Template Cliente  
**Branch de Execução:** `redesign/v3-correcoes`  
**Tag de Segurança / Rollback:** `pre-v3-20261102` (commit `fc0deb0`)  
**Data:** 03/11/2026  
**Resultado dos Testes Automatizados:** 20/20 APROVADOS (100%)  
**Arquivo JSON de Auditoria:** [`docs/redesign-v3/evidencias/08-relatorio-qa.json`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/docs/redesign-v3/evidencias/08-relatorio-qa.json)

---

## 1. Status por Fase

| Fase | Título | Status | Arquivo de Prova / Evidência |
| :--- | :--- | :--- | :--- |
| **Fase 0** | Auditoria e Diagnóstico | `FEITO` | [`docs/redesign-v3/00-diagnostico-sumico.md`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/docs/redesign-v3/00-diagnostico-sumico.md), [`docs/redesign-v3/evidencias/02-diagnostico-sumico/`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/docs/redesign-v3/evidencias/02-diagnostico-sumico/) |
| **Fase 1** | Modelo 3D Photoreal PBR | `FEITO` | [`public/3d/auto-stilo-trimmer.glb`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/public/3d/auto-stilo-trimmer.glb), [`docs/redesign-v3/MODEL_PROVENANCE.md`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/docs/redesign-v3/MODEL_PROVENANCE.md), [`docs/redesign-v3/evidencias/01-stills/`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/docs/redesign-v3/evidencias/01-stills/) |
| **Fase 2** | Coreografia 3D Contínua | `FEITO` | [`src/components/three/global-3d-scene.tsx`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/src/components/three/global-3d-scene.tsx), [`src/styles/site-tokens.css`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/src/styles/site-tokens.css) |
| **Fase 3** | Storytelling & Linha Roxa | `FEITO` | [`src/components/landing/gallery-storytelling.tsx`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/src/components/landing/gallery-storytelling.tsx), [`docs/redesign-v3/03-tesoura-navalha.md`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/docs/redesign-v3/03-tesoura-navalha.md) |
| **Fase 4** | Seção "Entre. Fique à vontade" | `FEITO` | [`src/components/landing/gallery-storytelling.tsx`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/src/components/landing/gallery-storytelling.tsx), [`docs/redesign-v3/04-entre-fique-a-vontade.md`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/docs/redesign-v3/04-entre-fique-a-vontade.md) |
| **Fase 5** | Player Único de Vídeos | `FEITO` | [`src/components/landing/shop-videos.tsx`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/src/components/landing/shop-videos.tsx), [`docs/redesign-v3/05-videos.md`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/docs/redesign-v3/05-videos.md) |
| **Fase 6** | Mapa Automático | `FEITO` | [`src/components/landing/contact-map.tsx`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/src/components/landing/contact-map.tsx) |
| **Fase 7** | Refinamentos Visuais & Grade | `FEITO` | [`docs/redesign-v3/07-legendas-removidas.md`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/docs/redesign-v3/07-legendas-removidas.md), [`src/components/landing/editorial.tsx`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/src/components/landing/editorial.tsx) |
| **Fase 8** | Bateria de Testes QA V3 | `FEITO` | [`docs/redesign-v3/evidencias/08-relatorio-qa.json`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/docs/redesign-v3/evidencias/08-relatorio-qa.json), [`docs/redesign-v3/evidencias/08-gravacoes/`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/docs/redesign-v3/evidencias/08-gravacoes/) |
| **Fase 9** | Preview, Segurança & Rollback | `FEITO` | [`docs/redesign-v3/ROLLBACK.md`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/docs/redesign-v3/ROLLBACK.md), [`docs/redesign-v3/PENDENCIAS_DO_DONO.md`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/docs/redesign-v3/PENDENCIAS_DO_DONO.md) |

---

## 2. Resolução dos Problemas Diagnosticados (P1 a P7)

### P1 — Modelo 3D Branco Estourado
- **Causa Confirmada:** Presença de shaders genéricos com `MeshStandardMaterial` e cor `#FFFFFF` pura sem canais físicos de metalicidade/rugosidade, combinados com luzes direcionais de alta intensidade (2.5) sem ambiente calibrado.
- **Solução Aplicada:** Construção de 6 materiais físicos PBR dedicados com calibração de estúdio (`MeshStandardMaterial` com roughness 0.25 a 0.75, metalness 0.0 a 1.0, e cores grafite/aço/cromo). Zero saturação estourada.
- **Evidência:** 9 stills fotorealistas em [`docs/redesign-v3/evidencias/01-stills/`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/docs/redesign-v3/evidencias/01-stills/) e teste `T9_Materiais_PBR` aprovado.

### P2 — Máquina Começa Deitada e Some no Meio da Página
- **Causa Confirmada:**
  1. No Hero, a rotação $Z$ estava configurada para $-0.26$ radianos (aparador inclinado a quase $15^\circ$ lateralmente).
  2. A varredura de scroll no DOM revelou que diversas seções filhas possuíam classes com cores de fundo opacas (`bg-[#FBFAF8]`, `bg-[#141416]`) posicionadas em camadas de pilha com `z-index` superior ao canvas Three.js (`z-[1]`). Ao rolar sobre essas seções, o canvas era ocluso fisicamente pelos blocos HTML.
- **Solução Aplicada:**
  1. A pose inicial no Hero foi ajustada para rigorosamente vertical ($rz = 0.0^\circ$, $rx = 0.07$, $ry = -0.35$).
  2. Adicionada regra CSS em `src/styles/site-tokens.css`: seções com `data-3d-scene-container` e seções filhas mantêm fundo transparente (`background-color: transparent !important;`), permitindo que o canvas fixo permaneça visível do topo até 30vh antes do rodapé.
- **Evidência:** Teste `T-PERSIST_Nao_Some` aprovado com 60/60 passos de scroll visíveis (área de projeção > 0 em 100% da varredura). Vídeo [`docs/redesign-v3/evidencias/08-gravacoes/rolagem-completa-1440.webm`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/docs/redesign-v3/evidencias/08-gravacoes/rolagem-completa-1440.webm).

### P3 — Storytelling Sem Zoom e Sem Efeito Contínuo
- **Causa Confirmada:** O componente de galeria era uma lista horizontal com fotos alternadas, sem persistência nem ancoragem de rolagem.
- **Solução Aplicada:** Implementado container sticky em `src/components/landing/gallery-storytelling.tsx` (altura total de 230vh com viewport sticky de 100svh). A foto principal `ShopImage name="espaco"` realiza zoom suave e contínuo de escala 0.72 para 1.0. A linha roxa SVG (`#6E56CF`) é desenhada pelo progresso da rolagem (`strokeDashoffset`), revelando a tesoura animada (lâminas cortando de $0^\circ$ a $24^\circ$) e a navalha clássica (abertura articulada de $0^\circ$ a $150^\circ$) em intervalos de progresso descolados e reversíveis.
- **Evidência:** Testes `T-STORY_Storytelling` aprovado; vídeo [`docs/redesign-v3/evidencias/08-gravacoes/storytelling-subindo-descendo.webm`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/docs/redesign-v3/evidencias/08-gravacoes/storytelling-subindo-descendo.webm); documento [`docs/redesign-v3/03-tesoura-navalha.md`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/docs/redesign-v3/03-tesoura-navalha.md).

### P4 — Seção "Entre. Fique à vontade" com Visual Escuro e Sem Interatividade
- **Causa Confirmada:** Visual desconexo da paleta editorial clara do site e ausência de controles interativos reais.
- **Solução Aplicada:** Redesenhado em `gallery-storytelling.tsx` com paleta clara `#FBFAF8`, tipografia editorial equilibrada e 3 abas interativas de inspeção ("Bancadas", "Cadeiras", "Atmosfera"). Cada aba oferece suporte total a clique de mouse, toque mobile e navegação via teclado (`Enter`/`Space`), com atributos ARIA (`role="tab"`, `aria-selected`, `aria-controls`).
- **Evidência:** Teste `T_ENTRE_Interacoes` aprovado; documento [`docs/redesign-v3/04-entre-fique-a-vontade.md`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/docs/redesign-v3/04-entre-fique-a-vontade.md).

### P5 — Dois Vídeos Simultâneos Dividindo Espaço
- **Causa Confirmada:** Renderização de dois elementos `<video>` lado a lado em cards compactos, causando poluição visual e playback conflitante.
- **Solução Aplicada:** Unificação em um único player cinematográfico centralizado em `src/components/landing/shop-videos.tsx`. Arquitetura de buffer duplo A/B (dois vídeos sobrepostos com crossfade de 250ms), playlist automática contínua (`onEnded`), barra de progresso visual, controles acessíveis customizados (Play/Pause, Mute/Unmute, Anterior/Próximo) e pausa automática via `IntersectionObserver` quando o componente sai do campo de visão.
- **Evidência:** Teste `T_VIDEO_Player_Unico` aprovado; documento [`docs/redesign-v3/05-videos.md`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/docs/redesign-v3/05-videos.md).

### P6 — Mapa Exigia Clique Manual para Exibir
- **Causa Confirmada:** O componente de mapa continha uma barreira com botão "Carregar mapa" que forçava interação do usuário antes de renderizar o iframe.
- **Solução Aplicada:** Carregamento automático sob demanda via `IntersectionObserver` (`rootMargin: "800px 0px"`). O mapa carrega suavemente em segundo plano quando o usuário se aproxima da seção de contato, ocupando 100% da moldura. Em caso de falha de rede ou timeout (10s), um cartão de fallback é ativado exibindo o endereço completo e botão de rota rápida.
- **Evidência:** Teste `T_MAPA_Carregamento_Automatico` aprovado (verificou ausência de botão e renderização do iframe); capturas de tela `secao-mapa-1440.png` e `secao-mapa-390.png`.

### P7 — Faixas Promocionais Poluídas e Desalinhamentos
- **Causa Confirmada:** Existência de tarjas decorativas com textos em caixa alta sobrepostas às fotos e falta de padronização nos botões e grade do Hero.
- **Solução Aplicada:**
  - Removidas as 3 faixas decorativas de `src/components/landing/editorial.tsx` e `src/components/landing/hero.tsx` ("PRECISÃO E ACABAMENTO", "ATELIER MONTE SIÃO", "QUALIDADE COMPROVADA").
  - Grade de 12 colunas no Hero alinhada sem overflow horizontal (`scrollWidth <= clientWidth`).
  - Raio de cantos de botões unificado rigorosamente para `--radius-button: 12px` (e `50%` para botões circulares de ícone).
  - Espaçamento do botão "Voltar" do agendamento ajustado para classe `.confirmation-actions`.
- **Evidência:** Testes `T_FOTOS_Faixas_Removidas`, `T_BOTOES_Radius_12px` e `T_HERO_Grade_12_Colunas` todos aprovados; documento [`docs/redesign-v3/07-legendas-removidas.md`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/docs/redesign-v3/07-legendas-removidas.md).

---

## 3. Skills Utilizadas e Contribuições

1. **`apple-design`**
   - Diretrizes de consistência visual, hierarquia tipográfica e contraste aplicadas na seção "Entre. Fique à vontade" e nos controles do player de vídeo.
   - Acessibilidade de foco (`:focus-visible`), suporte a navegação por teclado nas abas e respeito estrito a `prefers-reduced-motion`.
   - Raio de cantos consistente (`--radius-button: 12px`) eliminando discrepâncias visuais.

2. **`gsap-scrolltrigger`**
   - Sincronização entre Lenis e ScrollTrigger via `ScrollTrigger.update` no `lenis.on("scroll")`.
   - Cálculo contínuo da coreografia 3D ao longo de 12 estágios do DOM sem travamento de rolagem (`pin: false` no Hero).
   - Uso de interpolação lerp suave no ticker (`gsap.ticker.add`) com controle de visibilidade (`document.hidden`).

3. **`ponytail`**
   - Filosofia YAGNI e código enxuto: nenhuma biblioteca nova desnecessária foi instalada.
   - Reaproveitamento de componentes e tokens já existentes no ecossistema (`ShopImage`, `site-tokens.css`).
   - Reversibilidade total e zero código morto ("dead code") em produção.

---

## 4. Índice de Evidências em Disco

| Caminho da Evidência | Tipo | Descrição do Conteúdo |
| :--- | :--- | :--- |
| [`docs/redesign-v3/evidencias/08-relatorio-qa.json`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/docs/redesign-v3/evidencias/08-relatorio-qa.json) | JSON | Relatório completo de testes com 20 asserções executadas e dados de telemetria |
| [`docs/redesign-v3/evidencias/08-gravacoes/rolagem-completa-1440.webm`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/docs/redesign-v3/evidencias/08-gravacoes/rolagem-completa-1440.webm) | Vídeo (1.38 MB) | Gravação contínua da página inteira descendo e subindo (1440px) comprovando persistência do 3D |
| [`docs/redesign-v3/evidencias/08-gravacoes/storytelling-subindo-descendo.webm`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/docs/redesign-v3/evidencias/08-gravacoes/storytelling-subindo-descendo.webm) | Vídeo (6.72 MB) | Gravação detalhada do zoom na imagem, traçado da linha roxa, animação da tesoura e navalha |
| [`docs/redesign-v3/evidencias/08-depois/hero-1440.png`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/docs/redesign-v3/evidencias/08-depois/hero-1440.png) | Imagem PNG | Still do Hero em desktop comprovando o aparador vertical em pé ($rz: 0.0^\circ$) |
| [`docs/redesign-v3/evidencias/08-depois/hero-390.png`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/docs/redesign-v3/evidencias/08-depois/hero-390.png) | Imagem PNG | Still do Hero em viewport móvel (390px) |
| [`docs/redesign-v3/evidencias/08-depois/secao-storytelling-1440.png`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/docs/redesign-v3/evidencias/08-depois/secao-storytelling-1440.png) | Imagem PNG | Captura da seção "Entre. Fique à vontade" com abas ativas |
| [`docs/redesign-v3/evidencias/08-depois/secao-videos-1440.png`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/docs/redesign-v3/evidencias/08-depois/secao-videos-1440.png) | Imagem PNG | Captura do player cinematográfico único em funcionamento |
| [`docs/redesign-v3/evidencias/08-depois/secao-mapa-1440.png`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/docs/redesign-v3/evidencias/08-depois/secao-mapa-1440.png) | Imagem PNG | Captura do mapa carregado automaticamente preenchendo a moldura |
| [`docs/redesign-v3/evidencias/01-stills/still_hero_em_pe.png`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/docs/redesign-v3/evidencias/01-stills/still_hero_em_pe.png) | Imagem PNG | Renderização do aparador 3D PBR na pose frontal vertical |
| [`docs/redesign-v3/evidencias/01-stills/still_08_macro_lamina.png`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/docs/redesign-v3/evidencias/01-stills/still_08_macro_lamina.png) | Imagem PNG | Macro das lâminas em aço cirúrgico e parafuso central |

---

## 5. Resumo das Validações Técnicas

- `npm run tokens:check`: **APROVADO** (`✅ [OK] design-tokens.css sincronizado`).
- `npm run typecheck`: **APROVADO** (`0 erros de TypeScript`).
- `npm run lint`: **APROVADO** (`✔ No ESLint warnings or errors`).
- `npm run build`: **APROVADO** (Build estático com 9/9 páginas pré-renderizadas sem avisos).
- Integridade do SaaS: Nenhuma RPC ou tabela do Supabase alterada. O fluxo de agendamento em `/agendar` e `/meu-agendamento` permanece intacto.
