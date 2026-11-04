# DIAGNÓSTICO E REDESENHO: SEÇÃO "ENTRE. FIQUE À VONTADE." (FASE 4)

Data: 02/11/2026  
Projeto: Auto Stilo — Redesign V3  
Componente Auditado: `src/components/landing/sections.tsx` (`Gallery`, `#galeria`)

---

## 1. Inventário Pré-Modificação

- **Arquivo:** `src/components/landing/sections.tsx` (linhas 33–85)
- **Props:** Nenhuma (componente estático de landing page).
- **Estado React (`useState`, `useReducer`):** Zero. Nenhum estado existia.
- **Handlers de Evento (`onClick`, `onKeyDown`, etc.):** Zero.
- **Timelines / Gatilhos GSAP:** Inexistentes. A seção era 100% estática.
- **Elementos Interativos Reais:** 0 botões, 0 links, 0 inputs.
- **Imagens Utilizadas:**
  - `ShopImage name="espaco"` (foto principal do salão com bancadas, espelhos e iluminação);
  - `ShopImage name="acabamento"` (foto de corte de cabelo).

---

## 2. Investigação dos Problemas

### 2.1 Por que "as interações não funcionavam"?
1. **Inexistência de Código Interativo:** Ao inspecionar o código-fonte de `Gallery`, verificou-se que nenhum evento de clique ou hover funcional havia sido implementado. Os elementos tinham visual de cards clicáveis (bordas arredondadas, sombras, legendas estilizadas), mas eram simples tags `<figure>` e `<figcaption>` sem qualquer handler.
2. **Camadas com Cores Escuras em Contraste Artificial:**
   - O CSS anterior utilizava `var(--surface-obsidian)` e `rgba(13, 20, 38, 0.95)` nos cartões de legenda, criando blocos negros pesados que quebravam a leveza da direção de arte clara (`#FBFAF8`).
   - A exibição de coordenadas geográficas puramente decorativas em fonte mono (`[ 22°25'42"S · 46°34'18"W ]`) transmitia aspecto artificial de "template gerado por IA".

---

## 3. Solução e Redesenho Editorial

### 3.1 Arquitetura da Seção com Storytelling Integrado
- **Container Sticky de Scroll Livre:**
  - Wrapper externo com `min-height: 240vh` (desktop) e `220vh` (mobile), permitindo progressão temporal do scroll.
  - Container sticky interno com `position: sticky; top: var(--header-height-desktop); height: calc(100svh - var(--header-height-desktop))` sem bloqueio de rolagem (sem `pin: true`).
- **Camada de Zoom da Imagem:**
  - A imagem `espaco.webp` inicia com escala `scale(0.72)` emoldurada com elegância e, conforme o scroll avança, cresce suavemente para `scale(1.0)` preenchendo a janela visual, convidando o visitante a "entrar" no espaço.
- **Linha Roxa Ondulada e Vetores de Alfaiataria (Fase 3):**
  - Path vetorial cúbico SVG em violeta suave (`var(--accent-purple, #7C3AED)`), animado via `strokeDashoffset`.
  - Tesoura SVG entrando em `p ∈ [0.25, 0.45]` com movimento de corte sutil nas lâminas.
  - Navalha clássica de barbeiro SVG entrando em `p ∈ [0.55, 0.78]` desdobrando suavemente sua lâmina de aço.
- **Controles Interativos Acessíveis:**
  - Adição de 3 pontos de foco/inspeção interativos do ateliê:
    1. **Bancadas & Espelhos:** Bancadas em madeira e espelhos com iluminação neutra.
    2. **Cadeiras Hidráulicas:** Poltronas ergonômicas em couro legítimo com reclinação total.
    3. **Iluminação & Acústica:** Teto acústico com luz quente e música ambiente suave.
  - Botões reais com suporte pleno a foco de teclado (`Tab`), cliques de mouse e toques mobile, com `aria-expanded` e painel de informações descritivo.
- **Preservação de Áreas Livres:**
  - Marcação de zonas textuais com `data-story-avoid="true"` e `data-3d-avoid="true"`.
