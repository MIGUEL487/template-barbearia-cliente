# MATRIZ DE DECISÃO: TESOURA E NAVALHA (FASE 3)

Data: 02/11/2026  
Projeto: Auto Stilo — Redesign V3  
Decisão Técnica: Escolha da tecnologia para os elementos de corte (Tesoura e Navalha) no Storytelling da Galeria.

---

## 1. Contexto e Requisitos

A Fase 3 do Redesign V3 estipula a inclusão de uma narrativa visual no scroll da seção "O Espaço & Atmosfera" (`#galeria` / "Entre. Fique à vontade."):
- Uma linha roxa ondulada vetorial que se desenha com o scroll;
- A aparição em momentos distintos de uma **tesoura** (lâminas articulando/cortando no progresso `p ∈ [0.25, 0.45]`) e uma **navalha** (lâmina se desdobrando do cabo no progresso `p ∈ [0.55, 0.78]`).

Conforme o PROMPT MESTRE V3 (seção 3.4), a escolha entre **Opção A (SVG animado com GSAP)** e **Opção B (Modelos 3D em Three.js)** deve ser formalmente justificada através de uma matriz de decisão multicritério.

---

## 2. Matriz de Decisão Comparativa

| Critério | Peso | Opção A: Ilustrações SVG Animadas (GSAP) | Opção B: Modelos 3D em Three.js (Mesh PBR) | Avaliação / Justificativa |
| :--- | :---: | :--- | :--- | :--- |
| **Realismo & Estética Editorial** | 20% | **Nota: 9/10**<br>Traço editorial vetorial fino, sombreamento em gradiente de aço cirúrgico (`#CBD5E1`, `#94A3B8`, `#334155`), integrando-se organicamente à direção de arte clara (`#FBFAF8`) e tipografia serifada. | **Nota: 7/10**<br>Exigiria shader idêntico e iluminação estúdio idêntica. Modelos 3D poderiam colidir ou competir visualmente com o modelo 3D principal (trimmer). |
| **Qualidade Visual & Nitidez** | 15% | **Nota: 10/10**<br>Escalabilidade vetorial infinita em telas Retina/High-DPI sem qualquer pixelização ou serrilhado. | **Nota: 8/10**<br>Sujeito a resolução de canvas e anti-aliasing (FXAA/MSAA) limitado em GPUs integradas. |
| **Desempenho & GPU (Mobile)** | 25% | **Nota: 10/10**<br>Custo de GPU irrisório; transformações puras CSS/GSAP com aceleração de hardware (`transform: translate3d/rotate`). Zero impacto nos 60 FPS mobile. | **Nota: 4/10**<br>Adicionar 2 novos modelos 3D com draw calls, matrizes de ossos/hierarquias e shaders aumentaria o consumo de memória e bateria em dispositivos móveis. |
| **Peso do Payload (KB)** | 15% | **Nota: 10/10**<br>Aproximadamente 4 a 6 KB no total (SVGs inline otimizados), sem requisições de rede adicionais. | **Nota: 3/10**<br>Dois arquivos GLB adicionais somariam de 1.5 a 4 MB extras de download, prejudicando o LCP e métricas Core Web Vitals. |
| **Risco de Licença e Autoria** | 15% | **Nota: 10/10**<br>**Risco zero.** Vetores de autoria própria e originais desenvolvidos especificamente para a Auto Stilo. | **Nota: 1/10**<br>**Risco Alto / Bloqueante.** Não existem modelos 3D de tesoura e navalha fornecidos nos anexos. O prompt proíbe o uso de primitivas genéricas e uso de modelos externos sem licença comercial comprovada. |
| **Manutenção & Estabilidade** | 10% | **Nota: 9.5/10**<br>Manipulação declarativa de nós SVG via GSAP timelines limpas, sem risco de context loss WebGL ou vazamento de VRAM. | **Nota: 5/10**<br>Crescimento exponencial da complexidade de gerenciar 3 instâncias 3D independentes no mesmo loop de renderização Three.js. |
| **PONTUAÇÃO FINAL PONDERADA** | **100%** | **9.75 / 10** | **4.65 / 10** |

---

## 3. Decisão Técnica Final

**Vencedor Incontestável: Opção A (Ilustrações SVG Animadas com GSAP).**

### Motivos Determinantes:
1. **Inexistência de Modelos 3D Fornecidos:** O cliente forneceu apenas o arquivo `27-hair-trimmer.rar` (máquina de acabamento). Não há modelos de tesoura nem navalha nos anexos. Criá-los com caixas/cilindros genéricos é expressamente proibido pela regra fundamental de qualidade ("não use formas plásticas ou estilizadas").
2. **Orçamento de GPU e Bateria no Mobile:** Manter um único modelo 3D principal (a máquina de acabamento) garante 60 FPS cravados até mesmo em processadores móveis modestos. Carregar 3 modelos 3D concorrentes no viewport degradaria a experiência do usuário.
3. **Identidade Visual Editorial:** O traço vetorial de navalha e tesoura em tons de grafite e aço fosco reforça a identidade de alfaiataria e ateliê do site Auto Stilo, harmonizando com os filetes e as fontes Cormorant Garamond / Fraunces.

---

## 4. Parâmetros de Implementação (Opção A)

1. **Tesoura:**
   - Componentes: Duas lâminas sobrepostas com corte de desbaste, pivô central com parafuso fresado, cabos ergonômicos com anéis de apoio.
   - Aparição: `progress ∈ [0.25, 0.45]`.
   - Movimento: Percorre o trajeto suave da linha roxa; lâminas abrem e fecham suavemente (rotação angular de 0° a 26° relativa ao pivô central).

2. **Navalha Clássica:**
   - Componentes: Cabo em polímero escuro/madeira escura e lâmina de aço desdobrável com entalhe de precisão.
   - Aparição: `progress ∈ [0.55, 0.78]`.
   - Movimento: Desdobramento gradual da lâmina em torno do pino guia (rotação de 0° a 150°), simulando o movimento do barbeiro preparando o instrumento.
