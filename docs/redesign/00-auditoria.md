# Auditoria Técnica e Visual — Fase 0
**Projeto:** `MIGUEL487/template-barbearia-cliente`  
**Data:** 31/10/2026  
**Branch de Trabalho Criada:** `redesign/studio-3d` (baseada em `origin/master` atualizada)  
**Status do Baseline:** Todos os checks (`tokens:check`, `typecheck`, `lint`, `build`) verdes [OK].

---

## 1. Baseline e Status do Git

- **Branch base:** `master` (commit `4cb9ff6`)
- **Nova branch:** `redesign/studio-3d`
- **Git Status Inicial:** Árvore de trabalho limpa (`working tree clean`), sem arquivos pendentes de commit.
- **Evidência do Baseline:** Salva em `docs/redesign/evidencias/00-baseline.txt`.
  - `tokens:check`: ✅ Hash `48ebe6b7...` validado com sucesso.
  - `typecheck`: ✅ `tsc --noEmit` completado sem nenhum erro de tipo.
  - `lint`: ✅ `next lint` aprovado (0 warnings, 0 erros).
  - `build`: ✅ `next build` gerou com sucesso todas as 8 rotas estáticas (`/`, `/agendar`, `/meu-agendamento`, `/_not-found`, `/robots.txt`, `/sitemap.xml`) e exportou para `./out` com cabeçalhos CSP.
- **Screenshots Baseline Gravados (1440px e 390px):**
  - `docs/redesign/evidencias/00-antes/home_1440.png`
  - `docs/redesign/evidencias/00-antes/home_390.png`
  - `docs/redesign/evidencias/00-antes/agendar_1440.png`
  - `docs/redesign/evidencias/00-antes/agendar_390.png`
  - `docs/redesign/evidencias/00-antes/meu-agendamento_1440.png`
  - `docs/redesign/evidencias/00-antes/meu-agendamento_390.png`

---

## 2. Inventário de Dependências e Versões

Lidas diretamente de `package.json` e `package-lock.json`:

| Biblioteca | Versão Declarada | Status no Projeto |
| :--- | :--- | :--- |
| **Next.js** | `15.5.28` | Static HTML Export (`output: 'export'`) para Cloudflare Workers Assets |
| **React** | `19.3.1` | React 19 estável |
| **React DOM** | `19.3.1` | React 19 estável |
| **GSAP** | `3.15.0` | Versão fixa (inclui ScrollTrigger integrado via `gsap/ScrollTrigger`) |
| **Lenis** | `1.3.27` | Versão fixa |
| **Three.js** | `0.187.0` | Instalado (deve ser pinado como versão fixa sem `^` conforme R12) |
| **Playwright** | `1.64.1` | Runner dos scripts de QA em `scripts/` |
| **Tailwind CSS** | `3.4.15` | Utilitários e classes base |

---

## 3. Estrutura de Rotas e Componentes

### Rotas Existentes (`src/app`):
- `/` (`src/app/page.tsx`): Landing page pública.
- `/agendar` (`src/app/agendar/page.tsx`): Fluxo de agendamento em 5 etapas com hold de 15 minutos e Supabase RPC.
- `/meu-agendamento` (`src/app/meu-agendamento/page.tsx`): Consulta e cancelamento de reservas por token.
- `/_not-found` (`src/app/not-found.tsx`): Página de erro 404 estática.
- `/robots.txt` e `/sitemap.xml`: Rotas de SEO e metadados.

### Estrutura de Componentes (`src/components`):
- `src/components/landing/`: Componentes da home (`hero.tsx`, `navigation.tsx`, `editorial.tsx`, `catalog.tsx`, `sections.tsx`, `review-carousel.tsx`, `contact-map.tsx`, `faq.tsx`, `shop-image.tsx`, `shop-videos.tsx`, `counter.tsx`).
- `src/components/booking/`: Componentes de agendamento (intocáveis quanto à lógica).
- `src/components/ui/`: Primitivas reutilizáveis (botões, modal, etc.).
- `src/components/smooth-scroll.tsx`: Wrapper do Lenis integrado ao GSAP ticker.
- `src/components/three/brand-sculpture.tsx`: Componente WebGL Three.js isolado com carregamento dinâmico.

---

## 4. Estado da Inicialização de Lenis e GSAP (Loops RAF)

### Como estão hoje:
1. **Lenis (`src/components/smooth-scroll.tsx`):**
   - Inicializado em um único ponto no `layout.tsx`.
   - Conduzido pelo ticker do GSAP (`gsap.ticker.add((time) => lenis.raf(time * 1000))`), garantindo **um único loop RAF**.
   - Integração com ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)`.
   - `gsap.ticker.lagSmoothing(0)`.
   - Respeita `prefers-reduced-motion` cancelando o setup.
   - **Ponto a corrigir na Fase 4/6:** Desligar o Lenis estritamente em `/agendar` e `/meu-agendamento` para não interferir nos formulários, e adicionar `data-lenis-prevent` em menus e popovers.

2. **GSAP no Hero e Seções (`hero.tsx`, `editorial.tsx`):**
   - O `hero.tsx` atual instanciava um `createScrollEngine` que criava instâncias adicionais de GSAP/ScrollTrigger paralelas.
   - Na Fase 3/4, isso será unificado para usar exclusivamente a instância compartilhada do GSAP, limpando todas as timelines com `gsap.context()`.

---

## 5. Lista de Tudo que Prende o Scroll Hoje (Violadores da Regra R5)

A auditoria identificou os seguintes mecanismos legados que capturam ou travam o scroll:

1. **`src/lib/cinematic/scroll-engine.ts` (Linha 18 a 26):**
   - Função `lockAt(top)`: adiciona listeners não-passivos de `wheel` e `keydown` com `event.preventDefault()`. Isso trava o scroll do usuário durante a reprodução do vídeo do Hero.
   - **Correção:** Remover completamente o `lockAt` e qualquer captura de wheel/touch.
2. **`src/components/landing/hero.tsx` (Linhas 285 e 342):**
   - Uso de `pin: true` no ScrollTrigger do Hero e chamada para `releaseScroll = engine.lockAt(top)`.
   - **Correção:** Proibir `pin: true` no Hero. Usar fluxo natural ou sticky nativo (`position: sticky; top: 0; height: 100svh`) sem travar a navegação.
3. **`src/components/landing/editorial.tsx` (Linha 101):**
   - `Ritual` utiliza `pin: true` no ScrollTrigger para fixar a seção durante 2 viewports.
   - **Correção:** Reestruturar para sticky css dentro de um wrapper de altura controlada ou timeline baseada em scroll sem travar o usuário.

---

## 6. Fontes de Dados de Conteúdo

Todas as informações dinâmicas e de negócio do site se originam exclusivamente de:

1. **Supabase Views / Tabelas Públicas:**
   - `public_services`: Lista oficial de serviços, preços (`price`) e durações (`duration_minutes`).
   - `public_barbers`: Barbeiros reais cadastrados (`name`, `bio`, `avatar_url`).
   - `public_site_settings`: Configurações da barbearia (`deposit_percentage`, `hero_title`, etc.).
   - `public_faq_items`: Perguntas frequentes reais.
2. **Arquivos de Configuração Estática:**
   - `src/config/demo.ts`: Dados de fallback e informações institucionais reais da barbearia:
     - Endereço: `R. do Tanque, 395 – Bela Vista, Monte Sião – MG`
     - Telefone / WhatsApp: `(35) 99737-4960`
     - Horários: Segunda a Sábado, das 09h às 19h
     - Avaliações Google: `4.9 ★` (comprovada por briefing oficial)
   - `src/config/frames.json`: Mapeamento de posters e frames da introdução.

Nenhuma foto, depoimento, cliente fictício ou texto promocional falso pode ser inventado (Regra R6).

---

## 7. Inventário de Assets em `public/` e `assets/`

### A. Assets Oficiais Reais da Auto Stilo (AUTORIZADOS):
- **Logotipos e Identidade:**
  - `public/brand/auto-stilo/logo-on-light.png`: Logo oficial para fundo branco/claro (Bitmap real, intocável).
  - `public/brand/auto-stilo/logo-on-dark.png`: Logo oficial para fundos escuros.
  - `public/favicon-auto-stilo.svg` e favicons PNG (`16x16`, `32x32`, `apple-touch-icon.png`).
  - `assets/brand/auto-stilo-original.png`: Arquivo original mestre.
- **Fotografias Reais do Atelier Auto Stilo (`public/media/auto-stilo/`):**
  - `espaco-1360.webp` / `avif` (69 KB): Interior real do salão em Monte Sião (balcão preto, cadeiras hidráulicas, teto de LEDs hexagonais).
  - `acabamento-478.webp` / `avif` (19 KB): Detalhe real de corte com navalha e máquina.
  - `corte-nuca-480.webp` / `avif` (19 KB): Acabamento milimétrico visto de trás.
  - `corte-perfil-480.webp` / `avif` (22 KB): Detalhe de perfil e barba cuidada.
  - `reconhecimento-1360.webp` / `avif` (145 KB): Troféu e certificado recebidos pela Auto Stilo.
  - `em-atendimento.mp4` (848 KB): Vídeo real curto do atendimento.

### B. Assets Externos / Demonstrativos / Banco de Imagens (PROIBIDOS NO NOVO DESIGN):
- `public/frames/pc/*` e `public/frames/mobile/*`: Frames extraídos de ator/modelo externo em banco de demonstração (não são da Auto Stilo).
- `public/video/pc.mp4` e `mobile.mp4`: Vídeos externos genéricos de demonstração.
- Imagens e referências do arquivo `Auto_Stilo_Claude_Referencias.zip` (`video-referencia-lovable.webm`, frames `f01` a `f24`): pertencem a outra barbearia fictícia ("Mr. Mustache"). **Proibido reutilizar.**

---

## 8. Componente do Marquee e Preservação (Regra R8)

- **Componente:** `MarqueeFooter` em `src/components/landing/editorial.tsx`.
- **Comportamento:** Duplo trilho em loop infinito (`animation: marquee-run 26s linear infinite`), com pausa automática fora da tela via `IntersectionObserver`.
- **Preservação:** O componente, seu ciclo de vida e seu efeito contínuo são mantidos intactos, sendo apenas estilizados dentro da paleta clara aprovada na Fase 6.

---

## 9. Componentes e Hooks do Agendamento (INTOCÁVEIS)

Os arquivos a seguir governam a integridade funcional do SaaS e **não podem sofrer alterações lógicas**:

1. `src/components/booking/use-live-booking.tsx`: Hook mestre de agendamento (gerencia etapas, seleção de barbeiros, cálculo de horários disponíveis, hold de 15 minutos e chamada da RPC `create_booking_hold`).
2. `src/components/booking/live-booking.tsx`: Orquestrador visual das etapas.
3. `src/components/booking/live-step-1.tsx` a `live-step-5.tsx`: Telas do fluxo.
4. `src/components/booking/booking-calendar.tsx`: Calendário com cálculo de dias úteis e bloqueios.
5. `src/components/booking/live-management.tsx`: Gestão e cancelamento de reserva por token.
6. `src/lib/supabase.ts`: Inicialização do cliente Supabase e checagem de variáveis de ambiente.
7. `src/lib/booking-diagnostics.ts`: Relatório e telemetria de falhas.

Qualquer ajuste no agendamento ocorrerá exclusivamente na camada de CSS (`src/app/agendar/booking.css`) na Fase 7.

---

## 10. Padrão dos Scripts de Teste QA Existentes

Os scripts em `scripts/qa-*.mjs` utilizam Playwright com Chromium headless e seguem os padrões:
- Interceptação de todas as rotas `https://*.supabase.co/**` para testes com dados mockados (zero escrita no banco de produção).
- Emulação de viewports responsivos: `1440x900`, `1280x800`, `768x1024`, `390x844`, `360x640`.
- Emulação de limitação de CPU 4× (`CDP: Emulation.setCPUThrottlingRate: 4`).
- Asserções estritas de ausência de overflow horizontal (`document.documentElement.scrollWidth <= innerWidth`).
- Checagem de console limpo (zero erros de hidratação ou exceções não tratadas).

---

## 11. Repositório do Proprietário (`template-barbearia-dono`) — Somente Leitura

- **Caminho Local:** `C:\Users\Windows\.gemini\antigravity\scratch\barbearia-template\template-barbearia-dono`
- **Condição:** **SOMENTE LEITURA** (Nenhum arquivo editado, nenhum commit).
- **Tokens no Dono:** O painel administrativo do dono opera em tema escuro Dashdark X (`#080F25`, superfícies `#101935`, acento `#7C3AED`).
- **Hash de Sincronização:** `src/styles/design-tokens.css` possui hash SHA-256 `48ebe6b79d5cf8ccf3bdd3d9d022155d6a7b47842d5ee7d95ef2b188de3bb0c7`, verificado por `npm run tokens:check`.
- **Estratégia de Respeito à Regra R4:** O arquivo `design-tokens.css` **não será modificado**. Criaremos `src/styles/site-tokens.css` com as variáveis do tema claro aprovado pelo proprietário para o site público.

---

## 12. Comparação Histórica: `origin/design-branco` vs `master` Atual

### Análise dos Branches:
1. **Branch `origin/design-branco` (Commit `73cbf75`):**
   - Esta branch contém a **identidade visual clara aprovada pelo proprietário**.
   - Fundo predominante branco (`--bg: #FFFFFF`), superfícies off-white (`#F6F5F8`), filetes sutis (`rgba(10, 10, 12, 0.12)`), texto escuro (`#0A0A0C`), títulos em serifa (*Fraunces*), e o violeta (`#7C3AED`) reservado apenas para acentos de contraste.
   - O `<html>` não possui classe `dark`.
2. **Branch `master` Atual (Commits `41bcaa0` e posteriores):**
   - Recebeu uma tentativa de redesign escuro integral com Dashdark X (`#080F25`), cards escuros com bordas brilhantes e gradientes violetas.
   - O usuário e o proprietário **reprovaram** o tema escuro para a landing page pública, exigindo o retorno à **identidade visual clara** baseada no commit `73cbf75`.

### Conclusão & Base de Referência:
O commit `73cbf75` é a **base visual de referência oficial** para os tokens, tipografia e proporções da nova experiência clara. O novo redesign será construído na branch `redesign/studio-3d`, importando a paleta clara em `site-tokens.css` e incorporando a cena 3D (máquina de corte Three.js), header compacto e motion design do GSAP/Lenis.

---

## 13. Conclusão da Fase 0 & Próximos Passos

A auditoria da Fase 0 foi concluída com êxito e com todas as evidências registradas:
- Nenhuma alteração foi realizada em arquivos de código ou regras de negócio.
- O baseline foi gravado em `docs/redesign/evidencias/00-baseline.txt`.
- As capturas de tela do estado antes foram gravadas em `docs/redesign/evidencias/00-antes/`.
- A branch `redesign/studio-3d` está ativa e pronta para a execução do plano detalhado.
