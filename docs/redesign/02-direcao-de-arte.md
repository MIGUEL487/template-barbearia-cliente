# Documento de Direção de Arte e Tokens de Design — Fase 2
**Projeto:** Auto Stilo — Studio 3D (Tema Claro Oficial)  
**Evidência Gerada:** [`docs/redesign/evidencias/02-tipografia.png`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/docs/redesign/evidencias/02-tipografia.png)  
**Arquivo de Tokens:** [`src/styles/site-tokens.css`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/src/styles/site-tokens.css)

---

## 1. Filosofia Criativa: Studio Editorial & Linha de Navalha

O design público da Auto Stilo afasta-se deliberadamente dos clichês de sites gerados por IA (fundos escuros genéricos, gradientes violetas decorativos como wallpaper, cards arredondados idênticos e glows difusos).

Inspirando-se nas diretrizes de alta costura editorial, Apple HIG e na precisão dos instrumentos de barbearia:
- **Espaço Negativo Generoso:** O fundo branco e creme proporciona respiro, sensação de limpeza cirúrgica e sofisticação de estúdio.
- **Linha de Navalha (*Razor Line*):** Divisores ultra-finos de 1px hairline (`rgba(10, 10, 12, 0.08)`) que estruturam o grid com precisão milimétrica.
- **Geometria Retangular Controlada:** Raios sutis de 2px a 4px nos botões e inputs (`--radius-subtle: 2px`), abolindo as pílulas arredondadas infladas típicas de SaaS genérico.

---

## 2. Paleta Cromática Oficial

| Papel | Token | Valor Hex/RGBA | Área de Uso |
| :--- | :--- | :--- | :--- |
| **Fundo Primário** | `--bg` / `--bg-primary` | `#FFFFFF` | 75% da tela. Base principal da landing page e fluxo de navegação. |
| **Fundo Secundário** | `--bg-secondary` | `#FBFAF8` | Seções alternadas e blocos de apoio. |
| **Superfície Suave** | `--surface` / `--bg-soft` | `#F6F5F8` | Fundos de cards e caixas de serviço. |
| **Superfície Média** | `--surface-2` | `#EEEAF3` | Badges sutis e contêineres secundários. |
| **Texto / Títulos** | `--ink` / `--text` | `#0A0A0C` | Títulos e textos de alto contraste (WCAG AAA). |
| **Texto Secundário** | `--text-secondary` | `#4A4A52` | Subtítulos e parágrafos explicativos (WCAG AA). |
| **Texto Muted** | `--text-muted` | `#625D6D` | Metadados, etiquetas técnicas e legendas. |
| **Acento Marca** | `--accent` | `#7C3AED` | **Estritamente ≤ 8% da tela**: destaques tipográficos em itálico, badges numéricos e linhas de foco. |
| **Linha de Navalha** | `--hairline` / `--border` | `rgba(10, 10, 12, 0.08)` | Bordas de contêineres e linhas estruturais. |

---

## 3. Tipografia Editorial em Parceria

1. **Títulos e Display:**
   - **Família:** `Fraunces` (serifa com corte óptico editorial).
   - **Pesos:** 400 normal e 400 itálico expressivo para palavras de assinatura.
   - **Tracking:** `-0.025em` a `-0.03em`.
   - **Line-height:** `1.08` a `1.15`.
2. **Corpo e Interface:**
   - **Família:** `Manrope` (sem serifa geométrica neutra).
   - **Pesos:** 400 normal, 500 médio e 600 semi-bold para micro-ações.
   - **Line-height:** `1.6` para máxima legibilidade e conforto de leitura.

---

## 4. Integração Técnica e Conformidade de Tokens

- O arquivo base [`src/styles/design-tokens.css`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/src/styles/design-tokens.css) foi preservado intacto.
- A validação `npm run tokens:check` continua comparando o hash de sincronia com [`template-barbearia-dono`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-dono) com resultado `[OK]`.
- As variáveis do tema claro vivem exclusivamente em [`src/styles/site-tokens.css`](file:///C:/Users/Windows/.gemini/antigravity/scratch/barbearia-template/template-barbearia-cliente/src/styles/site-tokens.css), garantindo isolamento arquitetural e zero risco para o painel administrativo.

Pronto para avançar para a **Fase 3 (Protótipo de Hero + Header Compacto — Rumo ao GATE 1)**.
