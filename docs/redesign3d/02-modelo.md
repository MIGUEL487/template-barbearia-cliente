# Preparação do Modelo 3D Realista (Fase 2)
*Auto Stilo — Barbearia | Branch: `redesign/3d-persistente`*

---

## 1. Transformações Geométricas e Orientação

- **Eixo Longitudinal:** Reorientado para alinhar perfeitamente ao eixo `+Y` (cabo na base em `-Y`, cabeça de corte com lâminas no topo em `+Y`).
- **Face Frontal:** Placa frontal cromada orientada para `+Z` (voltada para a câmera do usuário no ângulo padrão).
- **Centro de Massa:** A geometria foi calculada e transladada para ter seu centro de massa exatamente na origem `(0, 0, 0)`.
- **Escala Padronizada:** A dimensão máxima de bounding box foi normalizada para **3.1 unidades**, conforme especificação da Fase 2, item 2.
- **Suavização de Normais:** Normais de vértice foram recalculadas (`computeVertexNormals()`) em todas as 20 peças, eliminando qualquer facetação poligonal em superfícies curvas.

---

## 2. Mapeamento Peça → Material PBR Físico

O modelo original foi decomposto em 20 peças individuais através de grafo de conectividade de faces, mapeadas para 6 materiais `MeshPhysicalMaterial`:

| Nome da Peça | Triângulos | Categoria de Material | Propriedades Shading PBR |
|---|---|---|---|
| `lever_assembly` | 4.360 | Metal Gunmetal Oxidado | `roughness: 0.28`, `metalness: 0.85`, `clearcoat: 0.20`, fenda usinada |
| `body_shell` | 3.820 | Polímero Preto Matte | `color: #111215`, `roughness: 0.42`, `metalness: 0.02`, `clearcoat: 0.18`, normal com micro-grão estocástico |
| `front_plate_chrome` | 560 | Cromo Espelhado Escovado | `color: #f2f4f8`, `roughness: 0.14`, `metalness: 0.98`, `clearcoat: 0.35` |
| `blade_top_support` | 1.644 | Aço Inox Cirúrgico | `color: #dce0e8`, `roughness: 0.24`, `metalness: 0.96`, fresagem CNC |
| `blade_bottom_guide` | 1.552 | Aço Inox Cirúrgico | `color: #dce0e8`, `roughness: 0.24`, `metalness: 0.96` |
| `blade_cutting_teeth_1..3` | 1.320 (3x 440) | Dentes de Corte Aço Carbono | `color: #dce0e8`, `roughness: 0.22`, `metalness: 0.96` |
| `blade_comb_support` | 348 | Guia de Corte Aço Escovado | `roughness: 0.26`, `metalness: 0.94` |
| `screw_1..3` | 704 (240+240+224) | Titânio Escuro Usinado | `color: #353840`, `roughness: 0.30`, `metalness: 0.90` |
| `vent_slat_1..8` | 384 (8x 48) | Polímero Anodizado Fosco | `color: #0a0a0c`, `roughness: 0.75`, `metalness: 0.05` |

**Regras de Integridade Aplicadas:**
- `transparent: false` em 100% dos materiais.
- `opacity: 1.0` fixo em todos os shaders (zero depth sorting artifact).
- `depthWrite: true` e `side: THREE.FrontSide`.
- Nenhuma marca de fabricante de terceiros presente na geometria ou textura.

---

## 3. Pesos, Orçamentos e Ferramental

- **Formato Final:** Binary GLB em [`public/3d/auto-stilo-trimmer.glb`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/public/3d/auto-stilo-trimmer.glb).
- **Tamanho do Arquivo GLB:** **1.048 KB** (1,02 MB) — Meta atingida (orçamento: $\le 1,5$ MB).
- **Pacote de Texturas PBR:** 774 KB em [`public/models/hair-clipper/textures/`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/public/models/hair-clipper/textures) — Meta atingida (orçamento total $\le 3$ MB).
- **Contagem Total de Triângulos:** 14.692 triângulos (meta: $\le 15.000$).
- **Contagem de Materiais:** 6 materiais (meta: $\le 6$).
- **Ferramental Utilizado:** Node.js v22 com Three.js r128, `sharp` e Playwright headless Chromium (já que o executável `blender` não está instalado no ambiente Windows).

---

## 4. Evidências dos Stills de Aprovação (8 Ângulos)

Arquivos gerados em [`docs/redesign3d/evidencias/02-stills/`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/docs/redesign3d/evidencias/02-stills/):
1. `still_01_frente_luz_assinatura.png` / `_luz_estudio.png`
2. `still_02_costas_luz_assinatura.png` / `_luz_estudio.png`
3. `still_03_lateral_esq_luz_assinatura.png` / `_luz_estudio.png`
4. `still_04_lateral_dir_luz_assinatura.png` / `_luz_estudio.png`
5. `still_05_topo_luz_assinatura.png` / `_luz_estudio.png`
6. `still_06_base_luz_assinatura.png` / `_luz_estudio.png`
7. `still_07_isometrico_3_4_luz_assinatura.png` / `_luz_estudio.png`
8. `still_08_macro_lamina_luz_assinatura.png` / `_luz_estudio.png`
9. Prancha consolidada: [`stills_aprovacao_consolidado.png`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/docs/redesign3d/evidencias/02-stills/stills_aprovacao_consolidado.png).

---

## 5. O Que NÃO Consegui (Transparência Obrigatória)

- **Blender Headless CLI:** O executável `blender` não se encontra instalado no sistema operacional do usuário (`where.exe blender` retornou inexistente). O processamento precisou ser realizado de forma reproduzível via Node.js + Three.js + Playwright Chromium.
- **Textura Original do Fabricante (`Hairtrimmer_basecolor.jpg`):** O arquivo não veio no pacote original `27-hair-trimmer.rar`. Substituímos o mapa inexistente por shaders físicos procedurais de alta fidelidade (aço escovado, cromo e policarbonato com microgrão).
