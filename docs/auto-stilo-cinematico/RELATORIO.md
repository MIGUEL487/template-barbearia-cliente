# Entrega e limites

Branch feat/hero-cinematografico. Somente cliente alterado nesta tarefa. Painel dono tinha alterações locais anteriores (agenda/dependências) e foi preservado, não foi publicado.

Base local 901fe06 e backup dependências 5412ab8, tag remota criada. Fetch encontrou master restaurada 83f23dc; foi incorporada na branch. Conflitos: package.json/lock preservam dependências remotas e three exato preexistente; headers preservam CSP por rota remota + cache dos novos frames. Não restaurei um commit antigo apagando funcionalidades recentes. Documento remoto de recuperação identifica 4bad46e/73cbf75 como pré-black; o ponto de trabalho preserva a recuperação 83f23dc.

Implementados: player novo, 478 frames originais e manifesto, identidade route-scoped, fontes oficiais+licença, seção vertical, narrativa do ritual e logo branca/header/CTAs. Arquivos principais: src/components/landing/cinematic-hero.tsx, immersive.tsx, editorial.tsx, navigation.tsx; src/app/page.tsx, cinematic.css, fonts; scripts/headers.mjs, qa-cinematic.mjs. Hero legado e frames antigos preservados. Nenhuma dependência adicional ao redesign: GSAP/Lenis/Three já instalados; Three/Lenis não usados na página nova.

Lint/typecheck/build passaram em fases; build final DEMO_MODE=false. tokens:check passou. Scroll com mouse.wheel, cinco viewports, dez marcos, reverse, orçamento de bitmaps, reduced motion e abertura das duas rotas passaram no teste local; ver results.json. Não foi feita reserva real em Supabase nem teste autenticado do dono. Não se alterou nenhuma RPC, SQL ou configuração Cloudflare.

Lighthouse: ver PERFORMANCE.md e JSONs. Não foram provados INP de campo, cache de produção ou uso em dispositivo físico. Orçamento aproximado poster+JS 433 KB ultrapassa referência ~400 KB. Acesso gh API aos checks retornou Forbidden. Sem confirmação de checks/preview da plataforma, a publicação na master não está liberada por este relatório. Não foi feito deploy manual.

## Skills verificadas

| Nome | Estado | Caminho encontrado |
| --- | --- | --- |
| apple-design | disponível e não usada | `/workspace/local-skills/apple-design/SKILL.md` |
| frontend-design | disponível e não usada | `/workspace/local-skills/frontend-design/SKILL.md` |
| high-end-visual-design | disponível e usada | `/workspace/local-skills/high-end-visual-design/SKILL.md` |
| design-taste-frontend | disponível e não usada | `/workspace/local-skills/design-taste-frontend/SKILL.md` |
| minimalist-ui | disponível e não usada | `/workspace/local-skills/minimalist-ui/SKILL.md` |
| impeccable | disponível e não usada | `/workspace/local-skills/impeccable/SKILL.md` |
| ui-ux-pro-max | disponível e não usada | `/workspace/local-skills/ui-ux-pro-max/SKILL.md` |
| genjutsu | não instalada com esse nome | — |
| brandkit | disponível e não usada | `/workspace/local-skills/brandkit/SKILL.md` |
| brand-guidelines | disponível e não usada | `/workspace/local-skills/brand-guidelines/SKILL.md` |
| extract-ds | disponível e não usada | `/workspace/local-skills/extract-ds/SKILL.md` |
| taste | disponível e não usada | `/workspace/local-skills/design-taste-frontend-v1/SKILL.md` |
| gsap-scrolltrigger | disponível e não usada | `/workspace/local-skills/gsap-scrolltrigger/SKILL.md` |
| gsap-react | não instalada com esse nome | — |
| animate | disponível e não usada | `/workspace/local-skills/animate/SKILL.md` |
| ui-animations | disponível e usada | `/workspace/local-skills/ui-animations/SKILL.md` |
| motion-design | disponível e não usada | `/workspace/local-skills/motion-design/SKILL.md` |
| web-animation-design | disponível e não usada | `/workspace/local-skills/web-animation-design/SKILL.md` |
| inspo-ui | não instalada com esse nome | — |
| verification | disponível e não usada | `/workspace/local-skills/strix-fix-verification/SKILL.md` |
| webapp-testing | disponível e usada | `/workspace/local-skills/webapp-testing/SKILL.md` |
| playwright-cli | disponível e não usada | `/workspace/local-skills/playwright-cli/SKILL.md` |
| playwright-triage | disponível e não usada | `/workspace/local-skills/playwright-triage/SKILL.md` |
| playwright | disponível e não usada | `/workspace/local-skills/playwright-triage/SKILL.md` |
| strix | disponível e não usada | `/workspace/local-skills/strix-idor/SKILL.md` |

GSAP, Lenis e Motion são bibliotecas; a presença de uma biblioteca não foi contada como skill.

Teste touch por dispatchTouchEvent real de Chromium, rotação mobile→landscape e teclado PageDown passaram após corrigir preservação do gesto entre variantes; ver touch-keyboard.json. Wrangler deploy --dry-run passou, sem upload de deployment.

Branch publicada no GitHub em feat/hero-cinematografico; deploy/preview Cloudflare não confirmados. Nenhuma URL de preview foi inventada. No teste final, as janelas de texto também foram verificadas nos cortes, além dos frames. Hash do código: 95aae84 (documentação pode acrescentar commits). Backup adicional da master restaurada enviado como backup/master-restaurada-20261104.
