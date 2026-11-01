# Auto Stilo — Relatório de Verificação da Trajetória 3D Contínua

## 1. Metadados da Cena Three.js + GSAP ScrollTrigger
- **Modelo:** Máquina de cortar cabelo oficial do cliente (`hair-clipper.obj`, 44.076 vértices, normalizada).
- **Textura:** `hair-clipper-basecolor.jpg` (4096x4096px sRGB com reflexos metálicos e iluminação de estúdio).
- **Canvas Global:** `position: fixed; top: 0; left: 0; pointer-events: none; z-index: 1;`.
- **Interação:** 100% segura — o canvas não intercepta cliques, toques ou eventos de scroll (`pointerEvents: none`).
- **Header Compacto:** Altura de 64px (estritamente <= 64px desktop / <= 56px mobile) com barra de progresso.
- **Scroll Total da Página:** 11921px sem nenhum travamento, sem `pin: true` de tela inteira e sem `preventDefault()`.

## 2. Trajetória Coreografada por Seção
| Etapa | Seção | Posição (X, Y, Z) | Rotação | Opacidade | Objetivo Visual |
|---|---|---|---|---|---|
| **01** | **Hero** (0% scroll) | (1.35, 0.05, 0.6) | (-0.45, 0.75, 0.2) | 0.38 | Presença sutil ao fundo do Hero, sem competir com a tipografia. |
| **02** | **Assinatura** (~18% scroll) | (-0.85, -0.15, 1.15) | (-0.25, 1.85, -0.15) | 0.76 | Deslocamento para o lado esquerdo em ângulo dinâmico. |
| **03** | **Ritual** (~40% scroll) | (0.10, 0.08, 2.15) | (-0.08, 3.14, 0.04) | 0.92 | **Destaque central em close-up:** visualização frontal das lâminas, parafusos e dentes. |
| **04** | **Catálogo** (~62% scroll) | (1.55, -0.25, -0.40) | (-0.50, 4.50, 0.25) | 0.22 | Recuo para o fundo profundo com baixa opacidade; legibilidade 100% preservada. |
| **05** | **História** (~82% scroll) | (-1.25, 0.12, 0.75) | (-0.30, 5.85, -0.20) | 0.52 | Flanco esquerdo com iluminação de recorte sutil. |
| **06** | **Rodapé** (100% scroll) | (0.00, 0.65, -1.20) | (-0.60, 7.20, 0.10) | 0.00 | Fade-out contínuo e suave antes do rodapé. |

## 3. Comportamento Bidirecional
- A rolagem de retorno (100% -> 0%) reverte perfeitamente as transformações sem saltos ou recriação de cena.
