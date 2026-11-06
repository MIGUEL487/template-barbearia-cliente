# Mobile Experience 2.0 — cliente

## Alterações

Identidade grafite/lavanda, fontes, logo, marquee e conteúdo existente preservados. Ajustes locais de composição para títulos, Hero em `100svh`, safe areas, enquadramento, navegação e formulário. Touch permanece nativo (`syncTouch:false`, wheel suavizado somente para ponteiro fino), sem novo Lenis nem novo RAF. O ticker GSAP único continua entregando o mesmo relógio ao player e ao ScrollTrigger.

Sequência WebP continua com 239 frames adjacentes. `frame-pacer.ts` aplica aceleração/desaceleração e limites de 30 fps para avançar no desktop / 24 no mobile, 36/30 para retroceder. Não tenta compensar abas ocultas acumulando centenas de frames. O canvas só desenha um vizinho por atualização. A linha de textos segue o frame efetivamente desenhado, não o destino solicitado. A distância passa para 6,5 alturas no desktop e 5 no retrato mobile. Somente o Hero aplica o controle; o documento continua normal depois dele.

O gate existente libera a próxima seção só depois do último frame desenhado e de outro tick. O CTA funciona desde o primeiro frame e a alternativa sem animação permanece disponível. Frame ausente/indecodificável por 15s libera a apresentação estática e a navegação: a rede não pode prender o visitante indefinidamente. O poster permanece atrás do canvas, evitando fundo vazio. Este escape acessível prevalece sobre o gate em caso de falha.

Bitmaps limitados ao entorno (até 13 desktop / 9 mobile / 7 aparelhos com <=4GB anunciados). Blobs comprimidos também são descartados longe do frame atual (raio 48 normal / 24 baixa memória), com até três downloads em voo. Reverse pode reler frames do cache HTTP em vez de manter toda a sequência decodificada. Resolução usa DPR limitado a 2, ou 1 em memória baixa. No horizontal, o visitante continua usando gesto vertical; foco em links internos posiciona o painel correspondente. Cleanup de ticker, triggers, observer e bitmaps preservado.

No agendamento: inputs de 16px evitam zoom de foco no iOS; ações respeitam safe area; calendário e botões seguem a linguagem glass existente; telas baixas usam ações sticky no fluxo, reduzindo sobreposição com teclado. Quantidade de pessoas, disponibilidade, holds, duração, buffer, Pix, validação e contratos Supabase não foram alterados.

## Auditoria

| Área | Implementação / verificação |
| --- | --- |
| Hero / home | Centro comum para logo/CTA; sequência, máximo visual, reversão e saída verificados com Playwright |
| Horizontal / equipe | Gesto vertical, foco por teclado, fotos Supabase existentes e ausência de overflow |
| Ritual, serviços, espaço, avaliações, contato | Componentes e animações existentes preservados; ajustes responsivos, enquadramento e passagem pelas seções |
| `/agendar` | Seis larguras, calendário ao lado/no fluxo conforme viewport, seleção, campos, hold e erros com dados interceptados |
| `/meu-agendamento` | Componente existente preservado; sem mudança de contrato de cancelamento/remarcação |
| PWA cliente | Não foi criada uma infraestrutura PWA nova nesta tarefa |
| GSAP / Lenis | Versões mantidas: GSAP 3.15.0, Lenis 1.3.27; um ticker, autoRaf:false, native touch, refresh e cleanup |

## Verificação reproduzível

`npm run lint`, `npm run typecheck`, `npm run tokens:check`, `npm run build`, `node tests/frame-pacer.test.mjs`.

Para exercitar reserva sem banco real, gere **apenas localmente** um build com URL/key públicas fictícias e demo false:

```sh
NEXT_PUBLIC_SUPABASE_URL=https://fixture.supabase.co NEXT_PUBLIC_SUPABASE_ANON_KEY=fixture-public-key NEXT_PUBLIC_BARBERSHOP_ID=11111111-1111-1111-1111-111111111111 NEXT_PUBLIC_DEMO_MODE=false npm run build
node scripts/qa-mobile2-booking.mjs
node scripts/qa-mobile2-cinema.mjs
```

Esses scripts iniciam servidor local e interceptam todo tráfego Supabase; não escrevem no projeto real. Não publique esse diretório `out/` de teste. O build da Cloudflare deve continuar usando as variáveis reais já cadastradas. A publicação normal por Git faz outro build.

Resoluções: 1920×1080, 1366×768, 820×1180, 430×932, 390×844 e 360×800. As menores usam Chromium com touch/CDP; não são aparelhos físicos. Motion é exercitado com scroll rápido/reverso, não somente screenshots. Reduced motion tem conteúdo estático e CTA sem pin. Métricas em `evidencias/cinema-results.json` são observações locais de memória/long tasks/layout durante gestos e saltos deliberados; não equivalem a Core Web Vitals de campo nem a INP real. Não há certificação de teclado virtual/iPhone físico neste ambiente.

## Publicação e rollback

Branch `feat/mobile2-cinematic`. Backup independente `backup/pre-mobile2-20261105` aponta para `168eab36a18bf3d8dcfe17f517ed8adf2eefc7ad`. Após checks críticos, merge fast-forward e push normal na master; a integração Git da Cloudflare reconstrói o site. Não executar deploy do build fictício de testes.

Rollback por `git revert` dos commits desta etapa e push normal, sem force push e sem apagar branches. O painel tem outro backup e rollback documentado em `template-barbearia-dono/docs/raiox4/README.md`. Nenhuma migration do cliente ou alteração em Supabase é necessária para os ajustes mobile.
