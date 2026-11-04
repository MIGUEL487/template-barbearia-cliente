# DIAGNÓSTICO DETALHADO POR PROBLEMA (P1 A P7) — FASE 0

Documento elaborado conforme o protocolo das Fases 1 a 7 do PROMPT MESTRE V3.
Evidências empíricas coletadas e salvas em `docs/redesign-v3/evidencias/`.

---

## PROBLEMA P1: A máquina 3D aparece quase toda branca, com reflexos exagerados e sem detalhes

- **Sintoma Observado:** Na página inicial e nas capturas de scroll (`evidencias/00-antes/hero-1440.png`, `maquina-scroll-0pct-1440.png`), a máquina de corte apresenta aparência esbranquiçada e estourada, com reflexos brancos muito fortes que ofuscam os detalhes mecânicos, a carcaça e as ranhuras.
- **Hipóteses Investigadas:**
  - *H1:* O modelo ainda carrega via OBJ+MTL sem textura (`Kd 1 1 1`).
  - *H2:* GLB com fatores PBR padrão ou desbalanceados (`metallicFactor` e `roughnessFactor` genéricos espelhando o fundo branco).
  - *H3:* Cor base branca no plástico.
  - *H4:* Espaço de cor errado na textura.
  - *H5:* Iluminação e exposição estouradas (`toneMappingExposure` alto, muitas luzes direcionais brancas contra fundo claro).
  - *H6:* Atlas UV de marca de terceiro aplicado incorretamente.
  - *H7:* Malha única sem separação de materiais por peça.
- **Causa Confirmada (com Evidência):**
  - **Evidência 1 (`docs/redesign-v3/evidencias/01-stills/inspecao-glb.md`):** O arquivo GLB (`auto-stilo-trimmer.glb`, 1361.3 KB) possui **apenas 1 material único** (`Mat_AutoStilo_Trimmer_PBR`), aplicado a todos os 14,7 mil triângulos indistintamente. Os fatores gravados no glTF são `metallicFactor: 0.35` e `roughnessFactor: 0.28`. A rugosidade de 0.28 é excessivamente reflexiva/espelhada para o corpo de polímero da máquina.
  - **Evidência 2 (`src/components/three/global-3d-scene.tsx`, L63 e L73-94):** O setup de iluminação e pós-processamento soma 5 fontes de luz potentes: `AmbientLight(0.65)` + `DirectionalLight(2.2)` + `DirectionalLight(1.1)` + `DirectionalLight(1.8)` + `DirectionalLight(1.6)` com `toneMappingExposure: 1.15` em `ACESFilmicToneMapping`. Essa soma de intensidades (> 7.3) sobre um material com rugosidade 0.28 em frente a um background claro `#FBFAF8` gera queima de brancos (blown-out highlights).
- **Correção Proposta:**
  1. Decompor a malha do modelo em peças individuais por conectividade (carcaça frontal, traseira, lâminas de corte, alavanca, parafusos, grade de ventilação).
  2. Aplicar materiais PBR específicos por componente: carcaça em polímero escuro grafite/preto fosco (`baseColor: #101113`, `metalness: 0`, `roughness: 0.50`), lâminas em aço inox escovado (`metalness: 1`, `roughness: 0.32`), placa frontal em cromo acetinado (`metalness: 1`, `roughness: 0.25`), parafusos e alavanca metálicos escuros.
  3. Rebalancear a iluminação: `toneMappingExposure: 0.90`, ambiente sutil, luz direcional chave ~2.0 e luz de recorte violeta de marca, eliminando superexposição.
- **Risco:** Requer geração cuidadosa dos buffers de geometria por peça para não alterar a geometria original nem exceder o orçamento de 3 MB.

---

## PROBLEMA P2: A máquina precisa começar em pé desde o hero e acompanhar o scroll até o rodapé sem sumir

- **Sintoma Observado:** A máquina inicia inclinada a ~ -14° no Hero (`hero-1440.png`) e, ao passar da seção de serviços, desaparece ou perde quase toda a visibilidade, não acompanhando a experiência até o rodapé.
- **Hipóteses Investigadas:**
  - *D1:* Seções ou wrappers com `background-color` opaco desenhados em camada acima do canvas (`z-index` e empilhamento).
  - *D2:* Ancestral do canvas com propriedades que quebram `position: fixed` (`transform`, `filter`, `perspective`, `backdrop-filter`).
  - *D3:* Contextos de empilhamento com `z-index` cobrindo o canvas.
  - *D4:* `timeline` GSAP que não mapeia as seções reais após Serviços.
  - *D5:* Opacidade do container caindo arbitrariamente para perto de zero.
- **Causa Confirmada (com Evidência):**
  - **Evidência 1 (`docs/redesign-v3/evidencias/02-diagnostico-sumico/diagnostico-sumico-tabela.md`):** O canvas possui `z-index: 1`. A varredura de 60 passos demonstrou que as seções `.team-section`, `.films-section`, `.reviews-section`, `.how-editorial` e `.contact-editorial` possuem `background-color: rgb(255, 255, 255)` opaco em suas classes CSS, o que as faz pintar **em cima do canvas fixed**, ocluindo 100% da máquina 3D a partir do meio da página.
  - **Evidência 2 (`src/components/three/global-3d-scene.tsx`, L128-137 e L182-260):**
    1. A pose inicial no Hero foi configurada com `rx: 0.10, ry: 0.15, rz: -0.25` (inclinada em Z, não vertical).
    2. A timeline foi dividida em faixas arbitrárias de progresso percentual (`0.12`, `0.26`, `0.45`, `0.65`, `0.85`), sem gatilhos vinculados às seções reais (`#galeria`, `.films-section`, `#contato`). Na faixa `0.26 < p <= 0.45` (Serviços), a opacidade programada cai drasticamente para `0.28`.
- **Correção Proposta:**
  1. Definir a pose inicial com eixo longo vertical: `rz: 0°`, `ry: -20°`, `rx: 4°`.
  2. Tornar o fundo das seções transparente (`background: transparent`), delegando a cor clara ao `body` / container base, garantindo que o canvas fixed permaneça visível.
  3. Reconstruir a timeline do GSAP acoplada aos palcos reais de cada seção (`[data-3d-stage]`), mantendo a máquina presente, reposicionada nas colunas livres e com opacidade confortável até os últimos 30vh antes do rodapé.
- **Risco:** Garantir que o texto em cada seção possua `data-3d-avoid="true"` para que a máquina em movimento nunca sobreponha tipografia legível ou botões de agendamento.

---

## PROBLEMA P3: Linha roxa ondulada + zoom da imagem + tesoura e navalha no scroll (Storytelling)

- **Sintoma Observado:** Atualmente não há narrativa visual com linha de corte ondulada, nem transição de zoom de imagem do espaço, nem animação de tesoura e navalha.
- **Hipóteses Investigadas:**
  - *Local do Storytelling:* Onde ancorar? A seção ideal é a Galeria Editorial ("Entre. Fique à vontade.", `#galeria`), pois a aproximação/zoom da foto do espaço representa visualmente "entrar" na barbearia.
  - *Tesoura e Navalha:* SVG animado (Opção A) vs. Modelos 3D adicionais (Opção B).
- **Causa Confirmada (com Evidência):** A funcionalidade ainda não foi implementada no código atual; a seção `#galeria` é estática.
- **Correção Proposta:**
  1. Implementar container com altura estendida e filho `position: sticky; top: var(--header-h); height: calc(100svh - var(--header-h))` (sem `pin` invasivo do GSAP).
  2. Zoom progressivo contínuo da foto real `public/media/auto-stilo/espaco.webp` via `transform: scale(0.72) -> scale(1.0)`.
  3. Linha roxa ondulada vetorial em SVG (`stroke-dashoffset` sincronizado ao scroll via `scrub`).
  4. Entrada da tesoura (com lâminas articuladas abrindo/fechando) e navalha (desdobrando do cabo) em momentos distintos do scroll.
- **Risco:** Evitar layout shifts (CLS) reservando o `aspect-ratio` e garantindo que o SVG não saia da viewport nem cruze sobre os textos.

---

## PROBLEMA P4: A seção "Entre. Fique à vontade." está feia e as interações não funcionam

- **Sintoma Observado:** Conforme inspecionado em `evidencias/00-antes/secao-entre-fique-a-vontade-1440.png`, a seção apresenta dois cards estáticos assimétricos com rodapés pretos/azul-escuros (`rgba(13, 20, 38, 0.95)`), coordenadas mono decorativas e nenhuma resposta a cliques ou toques.
- **Hipóteses Investigadas:**
  - *H1:* Elementos com `pointer-events: none` interceptando interações.
  - *H2:* Componente puramente estático sem handlers de evento ou estado React.
  - *H3:* Incoerência visual com o restante do design claro editorial.
- **Causa Confirmada (com Evidência):**
  - **Evidência 1 (`docs/redesign-v3/evidencias/00-antes/gallery-interactions.json`):** A seção `#galeria` possui 31 elementos DOM no total, mas **0 botões, 0 links e 0 handlers de clique**. É um bloco estático de HTML que parece um card interativo mas nada faz.
  - **Evidência 2 (`src/styles/landing.css`, L2136-2153):** Usa caixas com fundo escuro (`var(--surface-obsidian)` e `rgba(13, 20, 38, 0.95)`), que geram um choque visual desagradável em relação ao restante do site, lembrando um template genérico de IA.
- **Correção Proposta:**
  1. Redesenhar a seção para que converse harmonicamente com a estética editorial da Auto Stilo (tipografia serifada, fundo claro `#FBFAF8`, linhas finas de corte).
  2. Integrar a seção ao mecanismo de Storytelling (P3), permitindo ao usuário explorar os detalhes do atelier através de controles acessíveis e visualização expandida de alta qualidade.
  3. Adicionar micro-interações suaves com foco e teclado visíveis.
- **Risco:** Manter a fluidez do scroll sem bloquear o toque móvel em dispositivos touchscreen.

---

## PROBLEMA P5: Vídeos lado a lado: trocar por um único player grande com playlist automática

- **Sintoma Observado:** Conforme `secao-videos-1440.png`, a seção `.films-section` exibe dois vídeos (`visita.mp4` e `em-atendimento.mp4`) em colunas estreitas lado a lado (`.films-grid`), cada um com seus próprios botões pequenos de play/pause e som.
- **Causa Confirmada (com Evidência):** `src/components/landing/shop-videos.tsx`, L71 implementa `<div className="films-grid"><ShopVideo name="visita" /><ShopVideo name="em-atendimento" /></div>`.
- **Correção Proposta:**
  1. Substituir a grade dupla por uma **moldura cinematográfica única e ampla** (largura de conteúdo, altura ~75-80svh).
  2. Implementar arquitetura de **buffer duplo com 2 tags `<video>` (A/B)** para permitir crossfade limpo de 250ms sem tela preta ao avançar de vídeo.
  3. Playlist automática: ao disparar o evento `ended`, avança suavemente para o próximo vídeo; ao fim do último, retorna ao primeiro em loop.
  4. Controles personalizados elegantes: Anterior, Próximo, Play/Pause, Mudo/Som, indicador textual e de progresso (ex: "01 / 02").
  5. Desligar autoplay fora da viewport via `IntersectionObserver` e pausar em `document.hidden`.
- **Risco:** Políticas de autoplay dos navegadores exigem `muted` inicial; manter compatibilidade rigorosa com iOS Safari e Chrome mobile.

---

## PROBLEMA P6: Mapa com botão "Carregar mapa", mal dimensionado e com espaços vazios

- **Sintoma Observado:** Na seção de contato (`secao-mapa-1440.png`), o mapa não carrega inicialmente e exibe apenas um botão solto "Carregar mapa", com área vazia ao redor.
- **Causa Confirmada (com Evidência):** `src/components/landing/contact-map.tsx`, L3:
  `export function ContactMap(){ const [open,setOpen]=useState(false); return <div className="contact-map">{open?<iframe .../>:<button onClick={()=>setOpen(true)}>Carregar mapa</button>}</div> }`
- **Correção Proposta:**
  1. Eliminar o botão "Carregar mapa".
  2. Carregar o iframe do Google Maps de forma **automática e assíncrona** via `IntersectionObserver` quando a seção estiver a ~800px da viewport, não penalizando o First Contentful Paint nem o LCP da página.
  3. Dimensionar a moldura com proporção consistente (100% de largura e altura do container), sem lacunas, com moldura editorial refinada e bloco de endereço/horários padronizado ao lado.
  4. Fallback funcional: caso o iframe falhe ou exceda o timeout de 8s, exibir card direto com link "Abrir no Google Maps".
- **Risco:** Transparência de privacidade: o carregamento sob demanda do iframe transmite o IP ao provedor do mapa (documentado em `PENDENCIAS_DO_DONO.md`).

---

## PROBLEMA P7: Faixas e rodapés decorativos nas fotos; hero desalinhado; botões sem arredondamento consistente

- **Sintomas Observados:**
  1. Fotos possuem faixas decorativas artificiais sob as imagens com textos como "PRECISÃO E ACABAMENTO", "ATELIER MONTE SIÃO", "QUALIDADE COMPROVADA" (`fotos-faixas-decorativas-1440.png`).
  2. O Hero possui desalinhamentos verticais entre a coluna de texto e o card da foto.
  3. Os botões do site possuem estilos de borda completamente dispersos: alguns têm `2px`, outros `0px`, outros `8px` e formulários com `rounded-full` / `9999px`.
- **Causa Confirmada (com Evidência):**
  - Legendas: `src/components/landing/editorial.tsx`, L40-44 e L209-212; `src/components/landing/sections.tsx`, L58-64; `src/components/landing/hero.tsx`, L108-111.
  - Botões: `docs/redesign-v3/evidencias/00-antes/botoes-diagnostico.md` comprovou 9 botões com `2px`, 8 botões com `0px`, 4 botões com `8px` e estilos pílula no agendamento.
- **Correção Proposta:**
  1. Remover todas as faixas decorativas artificiais sob as fotos, mantendo apenas legendas informativas limpas no `alt` acessível de cada imagem.
  2. Alinhar o Hero à grade de 12 colunas, refinando o ritmo vertical de 8px e posicionando a máquina 3D em pé na coluna lateral sem tocar a foto.
  3. Unificar todos os botões no token `--radius-button: 12px;` (com variantes de ícone circulares documentadas).
- **Risco:** Garantir que o token sincronizado `design-tokens.css` não seja alterado (R4), utilizando a camada do site (`site-tokens.css`).

---

## 8. MATRIZ DE DECISÃO: TESOURA E NAVALHA (FASE 3)

| Critério | Opção A: Ilustrações SVG Originais Animadas | Opção B: Modelos 3D em Three.js |
| :--- | :--- | :--- |
| **Realismo & Estilo** | **Excelente:** traço editorial vetorial afiado, desenho de alta precisão em harmonia com a tipografia e o conceito de alta costura da barbearia. | **Incerto:** não existem modelos 3D de tesoura e navalha nos anexos do projeto; criar primitivas 3D genéricas geraria aspecto de brinquedo. |
| **Peso do Pacote** | **Leve (< 15 KB)** via SVG otimizado. | **Pesado (+ 1.5 a 4 MB)** em novos arquivos GLB/texturas. |
| **Desempenho Mobile** | **60 FPS constantes**, aceleração via transformações CSS/GSAP no SVG. | Alto risco de sobrecarga da GPU móvel ao renderizar 3 geometrias 3D simultâneas no mesmo canvas. |
| **Risco de Licença** | **Zero:** código vetorial 100% autoral, sem dependência de terceiros. | **Elevado:** ausência de licença comercial para modelos de terceiros. |
| **Legibilidade** | **Perfeita:** elementos em escala controlada que não competem com os textos da seção. | Risco de oclusão do conteúdo pelo volume 3D. |
| **Decisão Final** | **OPÇÃO A SELECIONADA (Recomendada)** | Descartada por violar orçamento e ausência de modelos com procedência. |

---

## 9. MARCOS DA COREOGRAFIA 3D RECONSTRUÍDOS (ORDEM DO DOM REAL)

| # | Seção Real no DOM | ID / Seletor | Palco 3D (`data-3d-stage`) | Comportamento Coreográfico da Máquina 3D |
|---|---|---|---|---|
| 1 | **Hero** | `.hero-studio-3d` | `hero` | **Em pé (vertical rz: 0°, ry: -20°)**, repousada na coluna visual direita sem sobrepor a foto. |
| 2 | **Diretriz da Marca** | `#assinatura` | `detalhe-01` | Desce suavemente para a lateral esquerda, rotacionando a ~45° para exibir o perfil mecânico. |
| 3 | **O Ritual** | `#ritual` | `detalhe-02` | Avança para o centro-direita em plano de detalhe (macro da lâmina de corte). |
| 4 | **Catálogo de Serviços** | `#servicos` | `servicos` | Recua para a extremidade direita com baixa opacidade (0.35) para não competir com os cards de corte/barba. |
| 5 | **História & Tradição** | `#historia` | `equipe` | Reposiciona-se na margem esquerda, com rotação em 3/4 exibindo a carcaça fosca. |
| 6 | **O Espaço & Atmosfera (Storytelling)** | `#galeria` | `galeria` | Acompanha a entrada do espaço e a linha ondulada na lateral superior. |
| 7 | **Filmes / Vídeos** | `.films-section` | `videos` | Permanece sutilmente na lateral direita com iluminação suave. |
| 8 | **Depoimentos Google** | `#avaliacoes` | `reviews` | Transita para o fundo com baixa presença visual. |
| 9 | **Como Funciona** | `.how-editorial` | `passos` | Flutua suavemente entre as etapas de agendamento. |
| 10 | **Localização & Contato** | `#contato` | `contato` | Posiciona-se ao lado do painel de horários e mapa. |
| 11 | **Agendamento Final** | `.final-cta-editorial` | `agendar` | Aponta suavemente em direção ao botão principal "Agendar meu horário". |
| 12 | **Marquee & Rodapé** | `.marquee-footer` | `saida` | **Fade suave nos últimos 30vh**, saindo de cena antes do rodapé final. |

---
*Relatório de auditoria elaborado com base em dados coletados via Playwright e inspeção estática.*
