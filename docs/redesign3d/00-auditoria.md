# Auditoria do Sistema 3D Atual — Auto Stilo
*Data: 01 de novembro de 2026 | Branch: `redesign/3d-persistente` | Repositório: `template-barbearia-cliente`*

---

## 1. Arquivos, Importações e Carregamento

### 1.1 Arquivos que importam `three`
- `src/components/three/global-3d-scene.tsx`: Componente atualmente ativo e montado em `src/app/page.tsx`. Importa `three`, `OBJLoader`, `gsap` e `ScrollTrigger`.
- `src/components/three/hair-clipper.tsx`: Implementação anterior com canvas isolado, progress imperativo e suporte a GSAP/Lenis. Não montado na home principal.
- `src/components/three/brand-sculpture.tsx`: Escultura procedural antiga de metal e vidro. Desativado da home principal.
- `src/app/lab/3d/page.tsx`: Rota de laboratório que importa componentes 3D para inspeção isolada.

### 1.2 Formato e Loader do Modelo
- O modelo atual é carregado via `OBJLoader` a partir de `/models/hair-clipper/hair-clipper.obj`.
- Não utiliza compressão Draco ou Meshopt.
- O arquivo `.obj` original possui **7.346 vértices** e **7.346 faces quads** (equivalente exato a **14.692 triângulos**).
- Não há GLB otimizado servido no momento.

### 1.3 Quantidade e Posição de Renderers / Canvases
- Na home (`/`), existe **exatamente 1 canvas** WebGL gerado dinamicamente dentro de `.global-3d-scene`.
- Propriedades do elemento:
  * `position: fixed; inset: 0; width: 100vw; height: 100svh;`
  * `pointer-events: none; z-index: 1;`
  * Está posicionado visualmente atrás do conteúdo principal (`#conteudo` com `position: relative; z-index: 2`).

### 1.4 Loops de Animação e Sincronização (RAF / Tickers)
- **Loops concorrentes identificados:**
  1. `SmoothScroll` (`src/components/smooth-scroll.tsx`): Instancia o Lenis e conecta `lenis.on('scroll', ScrollTrigger.update)` e alimenta o Lenis via `gsap.ticker.add((t) => lenis.raf(t * 1000))`.
  2. `Global3DScene` (`src/components/three/global-3d-scene.tsx`): Possui um loop `requestAnimationFrame(render)` próprio rodando continuamente a 60 fps (com verificação de `IntersectionObserver`), mesmo quando não há scroll ou interação de mouse.
  3. `LandingMotion` (`src/components/landing/motion.tsx`): Animações adicionais com GSAP ScrollTrigger na página.
- **Risco identificado:** A renderização 3D não é sob demanda; consome ciclos contínuos de GPU desnecessariamente fora de movimento.

---

## 2. Seção, Altura e Início do Movimento

- O canvas 3D ocupa `100svh` fixo na tela.
- **Início do movimento:** A timeline do GSAP está configurada com:
  * `trigger: document.body`
  * `start: "top top"`
  * `end: "bottom bottom"`
  * `scrub: 0.8`
- O primeiro estágio da timeline (`STAGE 1`) tem keyframe em `0.10` da página com easing `power2.inOut`.
- **Diagnóstico:** Por usar `power2.inOut` e intervalo até `0.10` (que equivale a mais de 1.100px no desktop e 1.360px no mobile), nos primeiros 10 a 40px de scroll a variação de movimento é imperceptível para o usuário humano, criando a sensação de que o objeto está estático até rolar bastante a tela.

---

## 3. Materiais, Normais, Opacidade e Transparências

- **Material Atual:** `MeshStandardMaterial` único aplicado a toda a malha:
  * `metalness: 0.65`
  * `roughness: 0.28`
  * `transparent: true`
  * `opacity: 0.40` no início, variando até `0.88` e caindo para `0.0`.
- **Causa Exata do Aspecto Cinza e Sem Contraste:**
  * O arquivo `.mtl` original busca `Hairtrimmer_basecolor.jpg`, inexistente no pacote original.
  * Na implementação anterior, foi aplicada a textura `Atlas_UV_de_Textura_para_Máquina_PRO_45.png` como basecolor. Como os UVs do modelo **não coincidem** com esse atlas (apenas 42,88% de IoU medido matematicamente), áreas de metal recebem pixels de plástico e vice-versa, resultando em manchas cinzentas e falta de definição das lâminas e parafusos.
  * Não há separação de materiais PBR por componente (carcaça, lâminas, cromo, alavanca e parafusos compartilham a mesma propriedade metálica e rugosidade).
- **Causa Exata das Partes Transparentes:**
  * O material tem `transparent: true` diretamente na malha do Three.js.
  * Em motores WebGL como o Three.js, quando uma malha complexa com concavidades (carcaça vazada, dentes de lâmina internos e suportes) é renderizada com `transparent: true` e `depthWrite: true`, ocorre **conflito de ordenação de profundidade (depth sorting artifact)**: faces traseiras são desenhadas antes de faces frontais dependendo do ângulo da câmera, tornando partes do corpo aparentemente "fantasmas" ou translúcidas.
  * **Solução:** `transparent: false` obrigatório em todas as peças sólidas. O fade deve ser feito estritamente via opacidade CSS no container do canvas (`opacity: X`), preservando a opacidade física 100% dos materiais.

---

## 4. Bounding Box, Tamanho e Sobreposição de Conteúdo

### 4.1 Medições na Viewport Desktop (1440 × 900)
- Altura total rolável: `11.021px`.
- Tamanho do canvas: `1440 x 900px` (fração de viewport: 100%).
- Bounding Box do objeto 3D:
  * O modelo usa escala normalizada `baseScale = 2.8 / maxDim`.
  * Na posição de zoom (Ritual / Stage 2), o modelo ocupa aproximadamente 65% a 70% da altura da viewport.
- **Sobreposição com texto (T6):**
  * Na seção Ritual, o modelo está alinhado à direita (`x: 1.15`), mas no Catálogo (#servicos), ao recuar para `x: 1.75`, a rotação projeta parte das lâminas sobre a margem direita da grade de serviços em telas entre 1024px e 1280px.
  * O modelo não possui âncoras amarradas a palcos do DOM via `getBoundingClientRect()`, dependendo de coordenadas fixas arbitrárias (`state.x = 1.25`, etc.).

### 4.2 Medições na Viewport Mobile (390 × 844)
- Altura total rolável: `13.676px`.
- Tamanho do canvas: `390 x 844px`.
- **Problema Crítico de Legibilidade no Mobile:**
  * Em telas móveis estreitas (390px), as coordenadas fixas (`x: -0.3`, `x: 0.35`) deixam o corpo da máquina centralizado ou semi-centralizado.
  * Como os títulos editoriais e parágrafos ocupam quase 100% da largura útil (350px de largura com 20px de padding), o modelo 3D passa **diretamente por trás das palavras**, degradando o contraste de leitura de textos pretos sobre fundo claro.

---

## 5. Inventário dos Componentes das Seções da Home e Booking (Intocáveis)

Os seguintes arquivos compõem a estrutura protegida que não deve sofrer alterações em regras de negócio ou estrutura funcional:

| Caminho | Papel | Status |
|---|---|---|
| `src/components/landing/hero.tsx` | Hero da página pública (Headline, CTA, mídias) | Preservar textos, botões e marcações |
| `src/components/landing/editorial.tsx` | Assinatura, Ritual, História, Marquee e Footer | Preservar estrutura e marquee original |
| `src/components/landing/catalog.tsx` | Catálogo de serviços com preços e CTAs | Intocável (sem sobreposição da máquina) |
| `src/components/landing/sections.tsx` | Galeria, Avaliações e Detalhes do espaço | Intocável |
| `src/components/landing/navigation.tsx` | Header de navegação e menu mobile | Preservar (header compacto) |
| `src/components/landing/motion.tsx` | Efeitos de revelação e parallax suave das fotos | Preservar |
| `src/components/booking/*` (15 arquivos) | Fluxo completo de agendamento (RPCs, horários, slots) | **100% Intocável** |
| `src/app/agendar/page.tsx` | Página de agendamento | **100% Intocável** |
| `src/app/meu-agendamento/page.tsx` | Consulta e cancelamento de agendamento | **100% Intocável** |
| `src/styles/design-tokens.css` | Design tokens sincronizados com o painel (`tokens:check`) | **100% Intocável (não editar)** |

---

## 6. Evidências Vinculadas

1. `00-baseline.txt`: Compilação, lint, tipagem e tokens verdes.
2. `home_1440_full.png` e `home_390_full.png`: Capturas completas do estado inicial.
3. `home_1440_scroll_0..100.png` e `home_390_scroll_0..100.png`: Capturas em 5 posições de scroll.
4. `pecas_coloridas_confirmadas.png`: Prova visual da malha particionada em 20 componentes conectados.
5. `sobreposicao_uv_calculada.png` e `uv_atlas_overlap_report.json`: Prova matemática de incompatibilidade do atlas (42,88% IoU).
6. `MODEL_PROVENANCE.md`: Documentação de proveniência, direitos de marca e bloqueio de produção.
