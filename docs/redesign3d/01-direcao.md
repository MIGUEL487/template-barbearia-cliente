# Direção Artística e Storyboard de Palcos 3D (GATE 1)
*Auto Stilo — Barbearia (Monte Sião, MG) | Branch: `redesign/3d-persistente`*

---

## 1. Comparação Crítica: Fundo Claro (A) vs. Fundo Escuro (B)

Abaixo está a avaliação estruturada entre a **Direção A (Claro Editorial)** e a **Direção B (Escuro Sóbrio)** com base no modelo 3D real (`Hair Trimmer.obj`) particionado em suas 20 peças metálicas e plásticas, inspecionado em 6 poses distintas nas pranchas comparativas (`evidencias/01-contraste/prancha_comparativa_completa.png`).

| Critério | **Direção A: Fundo Claro (#FBFAF8 / #FFFFFF)** | **Direção B: Fundo Escuro (#0E1013 / #16191E)** |
|---|---|---|
| **Identidade da Barbearia** | Alinhada à identidade aprovada do cliente (alfaiataria, cuidado artesanal, tipografia serifada Fraunces e acento violeta `#7C3AED` ≤ 8%). | Remete a SaaS / Dashboard. Exigiria reabrir a discussão da marca que já foi aprovada em claro. |
| **Qualidade Visual com o Modelo Real** | **Vencedor inequívoco:** O corpo da máquina é de polímero preto/grafite fosco. Sobre fundo claro, a silhueta externa inteira, a curvatura e a empunhadura destacam-se com precisão fotográfica de produto. As lâminas de aço inox e a placa frontal cromada ganham contraste por reflexo especular de ambientes escuros. | O corpo preto da máquina **funde-se com o fundo escuro**, tornando a silhueta imperceptível. Apenas os dentes de metal e a placa refletem luz, forçando o uso de luzes de recorte coloridas fortes (rim light neon), caindo no clichê visual de IA e tecnologia gamer. |
| **Legibilidade Editorial** | Textos pretos (`#0A0A0C`) em fundo creme/branco possuem contraste WCAG AAA (> 14:1). A máquina atua em palcos laterais dedicados, sem competir com a tipografia. | Textos brancos em fundo escuro cansam a leitura em textos longos. A máquina escura no fundo passa com baixo contraste, mas perde seu valor de exibição artesanal. |
| **Mobile (390 × 844)** | Excelente leitura em ambientes com luz solar direta (uso comum de clientes na rua ao agendar). | Economia mínima de bateria em telas OLED, mas prejudica a leitura de tabelas de preços e catálogo sob luz ambiente. |
| **Coerência com a Referência em Vídeo** | A referência (estúdio de barbearia internacional) usa fundo escuro para criar drama cinematográfico, porém seu **verdadeiro mérito técnico está no ritmo, nos palcos e na escala** da máquina — princípios perfeitamente transpostos para a paleta clara. | Cópia literal do fundo escuro da referência, descaracterizando a identidade local da barbearia de Monte Sião. |
| **Manutenção e Tokens** | Zero custo adicional: tokens já sincronizados e validados com `design-tokens.css` e `site-tokens.css`. A rota `/agendar` já está 100% harmonizada. | Alto custo de refatoração: exige criar nova matriz completa de tokens para todas as 9 rotas, formulários de reserva e componentes de agendamento. |

### Recomendação do Diretor de Arte: **DIREÇÃO A (FUNDO CLARO EDITORIAL)**
**Justificativa Técnica e Visual:**
A máquina fornecida possui corpo substancialmente preto. Na Direção A, a máquina comporta-se como "tinta preta sobre papel nobre", conversando diretamente com a serifa tipográfica, as linhas de navalha e o estilo editorial artesanal da barbearia. Na Direção B, a perda da silhueta preta sobre preto anula a volumetria do objeto.

> [!IMPORTANT]
> **Aviso de Conformidade (R6):** Esta recomendação técnica **não autoriza** a alteração da paleta. Conforme a regra R6, o projeto permanece na paleta clara até aprovação explícita do cliente humano no GATE 1.

---

## 2. Conceito Arquitetural: "Palcos" e "Corredores"

A máquina tridimensional não flutua como elemento aleatório sobre o site. Ela **possui moradia fixa em cada seção**, delimitada no DOM por atributos explícitos:

```
┌─────────────────────────────────────────────────────────────┐
│ SEÇÃO HERO                                                  │
│ ┌───────────────────────────┐  ┌──────────────────────────┐ │
│ │ [data-3d-avoid]           │  │ [data-3d-stage="hero"]   │ │
│ │ Título, Texto e CTAs      │  │ Palco Livre da Máquina   │ │
│ └───────────────────────────┘  └──────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                    [CORREDOR 1 DIAGONAL]
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ SEÇÃO ASSINATURA                                            │
│ ┌───────────────────────────┐  ┌──────────────────────────┐ │
│ │ [data-3d-stage="detalhe-1"]│  │ [data-3d-avoid]          │ │
│ │ Palco de Perfil Lateral   │  │ Foto com Arco + Manifesto│ │
│ └───────────────────────────┘  └──────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Regras dos Palcos
1. **Medição Real no DOM:** A posição tridimensional `(x, y, z)` e a escala da máquina são derivadas diretamente do retângulo visível `getBoundingClientRect()` do elemento `[data-3d-stage]`, convertidas para as coordenadas de câmera do Three.js via `unproject`.
2. **Proteção de Conteúdo (`data-3d-avoid`):** Todos os blocos de texto (títulos, parágrafos), botões de ação (CTAs), cards de preços e inputs de formulário são marcados com `data-3d-avoid`. O teste automatizado T6 verifica em 40 posições de scroll que a projeção 2D da máquina na tela nunca intersecta esses elementos (tolerância 0px).
3. **Comportamento Mobile:** No viewport mobile (390px), as seções não comportam duas colunas lado a lado. O palco transforma-se em um **espaçador vertical** (`min-height: 35svh a 55svh`) posicionado entre os blocos de texto. O objeto ocupa exclusivamente esse vão livre, eliminando qualquer texto sobreposto.

---

## 3. Storyboard Final de 10 Marcos

### Convenção de Eixos e Rotação
- **Origem (0, 0, 0):** Centro de massa da geometria (reorientada e centralizada na Fase 2).
- **Eixo `+Y`:** Eixo longitudinal (cabo na base, lâmina no topo).
- **Eixo `+Z`:** Face frontal (placa frontal voltada para `+Z`).
- **Ordem de Euler:** `YXZ` com ângulos contínuos acumulados (sem modular em 360° para evitar inversões bruscas de giro no scroll reverso).
- **Variáveis de Rotação:**
  * `rz`: inclinação no plano da tela.
  * `ry`: rotação contínua em torno do eixo longo (0° = de frente para o usuário).
  * `rx`: inclinação do topo em direção à câmera.

### Tabela de Parâmetros dos 10 Marcos

| # | Marco (ID Palco) | Posição e Âncora no Layout | Tamanho (% vh) Desktop | Tamanho (% vh) Mobile | rz | ry | rx | Opacidade Canvas (CSS) | Comportamento de Movimento |
|---|---|---|---|---|---|---|---|---|---|
| **1** | `hero` | Coluna direita do Hero, abaixo do header e ao lado da chamada | ≤ 34% | ≤ 24% | -32° | -38° | 10° | 0.55 | Já visível no carregamento inicial da página. |
| **2** | `corredor-1` | Desce em curva suave pelo vão à direita em direção ao Marquee | ≤ 30% | ≤ 22% | -12° | -10° | 20° | 0.75 | **Reação imediata:** move-se já entre `scrollY = 0` e `40px` com curva `power1.out`. |
| **3** | `detalhe-01` | Palco lateral esquerdo na seção Assinatura | ≤ 55% | ≤ 40% | -8° | +90° | 0° | 1.00 | Perfil lateral exato a 90°, destacando espessura e curvatura. |
| **4** | `detalhe-02` | Palco lateral na seção Ritual (Macro Close-up) | ≤ 110% | ≤ 95% | -20° | +140° | 28° | 1.00 | Câmera se aproxima das lâminas de corte de precisão; único corte permitido pela borda da tela. |
| **5** | `detalhe-03` | Palco direito no recuo da seção Ritual | ≤ 45% | ≤ 35% | 15° | +215° | 8° | 1.00 | Recuo técnico e giro para exibir a alavanca de regulagem e acabamento. |
| **6** | `servicos` | Corredor lateral estreito à direita do Catálogo | ≤ 22% | ≤ 16% | 70° | +270° | 12° | 0.40 | Recuo em escala e opacidade para garantir 100% de clareza na tabela de serviços e preços. |
| **7** | `equipe` | Vão diagonal entre as colunas da seção História / Espaço | ≤ 26% | ≤ 18% | 100° | +300° | 10° | 0.60 | Travessia sutil em arco acompanhando a leitura dos diferenciais. |
| **8** | `agendar` | Palco ao lado da chamada final de agendamento | ≤ 40% | ≤ 28% | -10° | +330° | 10° | 0.90 | Máquina aponta sutilmente para o botão principal de agendar. |
| **9** | `faq-local` | Canto inferior direito | ≤ 16% | ≤ 12% | -40° | +350° | 6° | 0.25 | Recolhimento discreto próximo ao rodapé. |
| **10** | `final` | Centro da tela nos últimos 40vh do rodapé | ≤ 30% | ≤ 20% | 0° | +360° | 0° | 0.90 → 0.00 | Conclusão do giro completo de 360° com fade-out suave do canvas CSS. |

---

## 4. Evidências do GATE 1 Geradas

1. **Pranchas Comparativas de Contraste:**
   - [`prancha_comparativa_completa.png`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/docs/redesign3d/evidencias/01-contraste/prancha_comparativa_completa.png)
   - Individuais: `prancha_pose_01.png` a `prancha_pose_06.png`.
2. **Wireframes Arquiteturais de Palcos e Zonas Evitadas:**
   - Desktop (1440px): [`wireframe_palcos_1440.png`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/docs/redesign3d/evidencias/01-contraste/wireframe_palcos_1440.png)
   - Mobile (390px): [`wireframe_palcos_390.png`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/docs/redesign3d/evidencias/01-contraste/wireframe_palcos_390.png)
3. **Protótipo Interativo Atualizado:**
   - Rota `/lab/3d` com seletor de fundo Claro (A) vs. Escuro (B), alternador dos 10 marcos e painel `?debug=1`.
