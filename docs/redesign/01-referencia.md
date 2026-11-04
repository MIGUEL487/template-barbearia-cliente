# Documento de Análise da Referência Externa — Fase 1
**Projeto:** Auto Stilo — Redesign Studio 3D (Tema Claro)  
**Arquivo de Referência:** `referencias/video-referencia-lovable.webm` (95.55s, 1920x922, 24 frames em `referencias/frames/`)  
**Site de Origem Analisado:** `https://screenshot-to-silhouette-861.lovable.app/` ("Mr. Mustache")

---

## 1. Gramática Visual e de Movimento da Referência

A inspeção detalhada do vídeo e dos 24 frames extraídos (`f01.jpg` a `f24.jpg`) revelou a seguinte estrutura de design e motion:

### 1.1 Header Compacto
- **Altura e fixação:** O header tem altura compacta (~60px), permanecendo fixo no topo com alta discrição.
- **Estrutura:** Logo à esquerda, menu de navegação centralizado ("Experiência", "Serviços", "Estilos", "Equipe"), e botão CTA de ação primária à direita ("Agendar meu horário").
- **Barra de Progresso:** Uma linha fina de 1px/2px acoplada à base inferior do header acompanha o percentual de rolagem da página (0% a 100%), fornecendo feedback de leitura constante.

### 1.2 Hero Editorial Assimétrico
- **Composição:** Dividido em duas colunas assimétricas:
  - **Coluna esquerda:** Eyebrow em caixa alta com tracking espaçado (`MR. MUSTACHE • BARBEARIA EM PINHEIROS`), título condensado de grande impacto visual com destaque colorido pontual em badge/pílula, subtítulo objetivo e botão CTA direto acompanhado de link secundário ("Conhecer os serviços").
  - **Coluna direita:** Cartão fotográfico editorial com cantos sutilmente arredondados e badge flutuante ("CORTE • BARBA • ESTILO").
- **Fluxo de Scroll:** O Hero não trava a rolagem. O visitante transiciona suavemente para as seções inferiores sem interrupções forçadas.

### 1.3 Faixa Marquee de Transição
- Entre o Hero e a narrativa, há uma faixa contínua em movimento suave (`CORTE • BARBA • ESTILO`), criando ritmo e quebrando a transição entre blocos.

### 1.4 Seção Narrativa Interativa ("Ritual / Cuidado nos Detalhes")
- **Passos:** Dividida em 3 momentos claros:
  1. `01 ENTENDER`: "Antes da tesoura, uma conversa."
  2. `02 EXECUTAR`: "Precisão em cada passagem."
  3. `03 FINALIZAR`: "Agora, escolha o seu ritual."
- **Objeto Central e Instrumentos:** Conforme a página rola pelos 3 passos, a imagem central do cliente se transforma e os instrumentos de barbearia (máquina de cortar cabelo, tesoura e pente) entram em cena, giram e acompanham a narrativa.
- **Nota Técnica:** Na referência Lovable, os instrumentos são recortes de imagem (PNG 2.5D com transformações CSS/GSAP). Na Auto Stilo, implementaremos uma **cena 3D real com Three.js** para a máquina de corte profissional, conferindo acabamento autoral e interatividade autêntica.

### 1.5 Catálogo de Serviços e Estilos
- **Serviços:** Grid limpo em 2 colunas. Título à esquerda e lista de serviços numerados à direita (`01 Corte`, `02 Barba com toalha quente`) com tempo, preço e botão "Quero este serviço".
- **Carrossel de Cortes:** Cards fotográficos com proporção editorial vertical, paginação numérica (`01 / 04`) e setas de navegação.

### 1.6 Seção de Barbeiros (Equipe)
- Ritmo visual alternado (colunas com desnível vertical), cada membro com nome imponente, especialidade e CTA contextualizado ("Agendar com [Nome]").

### 1.7 Rodapé e Acessibilidade
- Informações completas de funcionamento e localização, mapa simplificado, links de navegação e seletor explícito de acessibilidade: "Movimento completo" vs "Movimento reduzido".

---

## 2. Tabela Comparativa: Referência Lovable vs Proposta Auto Stilo

| Elemento | Referência Lovable (Mr. Mustache) | Implementação Proposta Auto Stilo (Tema Claro) |
| :--- | :--- | :--- |
| **Tema & Fundo** | Fundo escuro (preto puro `#000000`) com acento laranja queimado. | **Tema Claro Oficial:** Fundo branco puro (`#FFFFFF`) e creme (`#FBFAF8`), superfícies neutras (`#F6F5F8`), sem saturação excessiva. |
| **Cor de Destaque** | Laranja (`#FF6B00`) com glow difuso. | **Violeta Auto Stilo (`#7C3AED`):** Uso estrito e cirúrgico em acentos de contraste (≤ 8% da área visível). Sem glow de IA. |
| **Tipografia** | Sans condensada pesada para títulos, sem serifa neutra para corpo. | **Alta Costura Editorial:** Títulos na serifa expressiva *Fraunces*, corpo em *Manrope* e detalhes técnicos em mono/sans. |
| **Header** | ~60px, fundo escuro transparente. | **Compacto e Esculpido:** ≤ 64px desktop / ≤ 56px mobile, fundo branco sólido, borda 1px hairline, logo oficial `logo-on-light.png` ≤ 28px, barra de progresso fina no topo. |
| **Objeto de Destaque** | Recorte 2.5D estático/girado via CSS da máquina e tesoura. | **Three.js 3D Real:** Máquina de cortar cabelo profissional modelada proceduralmente, com metal escovado, dentes de lâmina, alavanca e sombra de contato. Scrub contínuo pelo scroll. |
| **Scroll Engine** | Rolagem nativa suave com animação por gatilho. | **Scroll 100% Livre (Regra R5):** Sem `pin: true` no Hero, sem `lockAt`, sem `preventDefault`. Lenis sincronizado em 1.2s easing sem engasgos. |
| **Botões & Formas** | Pílulas arredondadas (`rounded-full`) com glow. | **Geometria Elegante:** Bordas retangulares refinadas com raio sutil de 2px (`--radius-subtle`), remetendo à lâmina de navalha. |
| **Agendamento** | Formulário genérico simulado com etapas visuais. | **Sistema Real Auto Stilo:** Preservação estrita dos hooks, regras de hold de 15 min, RPCs do Supabase e lógica existente sem alterações. |
| **Acessibilidade** | Toggle de movimento no footer. | Suporte nativo a `prefers-reduced-motion` no sistema e chave manual de acessibilidade. |

---

## 3. Conclusão da Fase 1

A referência externa fornece uma excelente lição de **ritmo editorial, cabeçalho discreto e narrativa de instrumentos**. No entanto, a Auto Stilo supera a referência ao traduzir essa estrutura para um **tema claro sofisticado**, com tipografia serifada de alto padrão e uma verdadeira cena 3D WebGL sem travamento de tela.

Pronto para avançar para a **Fase 2 (Direção de Arte, Grid e Tokens de Design)**.
