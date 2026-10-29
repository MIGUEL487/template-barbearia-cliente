# Agendamento: vidro, tipografia e carregamento

Escopo: `/agendar`, incluindo a versão explicitamente demonstrativa. Página inicial,
marquee, RPCs, persistência, tokens compartilhados e painel do dono preservados.

- Cormorant Garamond variável nos títulos; Plus Jakarta Sans variável nos controles.
  Fontes locais, sem chamadas ao Google Fonts, com licenças OFL em `src/app/fonts`.
  Famílias com nomes próprios para evitar colisão com a fonte da página inicial.
- Barra de ações flutuante com desfoque e reflexos; botões com bordas iluminadas e
  acabamento translúcido. O conteúdo rolável não recebe desfoque.
- Primário roxo com texto branco: contraste mínimo calculado de 6,14:1 no extremo
  mais claro do gradiente. Foco visível por teclado e controles de ação de 48 px.
- Skeletons no catálogo, dias e horários. Indicadores vinculados às consultas reais,
  sem temporizadores que escondem o carregamento. Falhas saem do estado de espera
  e mantêm o aviso amigável existente. Confirmação conserva seu texto e seu espaço.
- Logo aprovada e transparente com anel SVG animado: composição original inspirada
  no MP4 enviado. O vídeo original não foi editado ou incorporado; o resultado não
  contém o fundo lilás nem a marca do gerador do vídeo.
- Movimento reduzido desliga rotação e shimmer; alto contraste/transparência reduzida
  usa superfície sólida; cores forçadas preservam contornos. Aba oculta pausa loops.

## Referências aplicadas

Skills locais solicitadas: `apple-design/SKILL.md` e
`high-end-visual-design/SKILL.md`, em `/workspace/local-skills`.
A primeira orientou materiais somente nos controles, carregamento contextual,
alvos de toque, foco e alternativas acessíveis. A segunda orientou a combinação
tipográfica, acabamento discreto, sombras leves e animação por transform/opacity.
O efeito é uma interpretação web de Liquid Glass.

## Verificação

Build com `NEXT_PUBLIC_DEMO_MODE=false`, URL de API do projeto informado e chave
fictícia local. Playwright intercepta todas as chamadas Supabase: nenhum teste
consulta ou grava no banco real.

```sh
npm run lint
npm run typecheck
npm run build
npm run tokens:check
node scripts/qa-booking-loading.mjs
QA_REDUCED_MOTION=1 node scripts/qa-booking-loading.mjs
node scripts/qa-live-booking.mjs
```

Os testes de navegador precisam do build com as variáveis públicas de teste e de
`npm run preview:cf` em localhost:8787. Cobrem respostas retidas até liberação,
skeletons, fontes carregadas, foco por teclado, falha HTTP, alto contraste/cores
forçadas, fluxo até pré-reserva e larguras 1440, 820, 390 e 320 px. O teste da agenda
também cobre três fusos, dias indisponíveis e revalidação de dia fechado.

Capturas em `docs/booking-glass`: `*-loading.png`, `*-calendar-loading.png` e
`*-calendar.png`. São fixtures de teste, não evidência do banco de produção.

Entrega em `feat-agendamento-glass-loading`, sem merge automático desta alteração
visual. O link público de preview depende do check do Cloudflare da branch; não
há deploy manual nem alteração de configuração do Cloudflare nesta entrega.
