# Adendo — conclusão obrigatória do Hero

Base: 2db3e8f4b1c8fb37121620a518a9e44cdc55a2c5. Backup: backup/pre-hero-gate-20261104. Branch fix/hero-completion-gate. Código isolado no commit 520f30e. Destino master conforme instrução vigente do usuário; main e painel do dono preservados.

## Máquina de estados e pin

- Tracking: pin original de 4,5 telas desktop / 3,5 mobile. ScrollTrigger continua definindo o destino; o renderer anterior desenha índices adjacentes e informa o índice efetivamente pintado.
- Catching-up: tentativa de ultrapassar a fronteira é limitada a trigger.end−2, mantendo o Hero fixado e a próxima seção fora do viewport. Lenis virtualScroll limita roda/toque antes de processar o delta; teclado End/PageDown/Space/ArrowDown e um guard para scroll nativo/programático cobrem os outros caminhos. Ctrl/Meta+roda não são interceptados.
- Complete: somente o callback do desenho real do índice 238 (arquivo 239) arma completionPending. A liberação ocorre no próximo tick GSAP, depois da oportunidade de apresentação desse desenho. Não há liberação por targetFrame, relógio ou timeout. O excesso de gestos é descartado, não enfileirado. Após concluir, o visitante precisa continuar sua navegação normalmente; não há salto automático causado por deltas antigos.
- Retorno: o renderer mantém a progressão inversa ±1 e rearma a proteção quando desenha frames anteriores dentro do Hero. O estado de conclusão é preservado ao trocar variante depois de já sair da intro.

Somente uma instância Lenis e um ticker GSAP; o renderer existente continua inscrito nesse ticker. Sem overflow-y:hidden permanente ou nova instância de smooth scroll. Limite geométrico finito, sem aumentar indefinidamente pin spacers. O guard e os listeners são removidos no unmount. Enquanto a sequência está retida, as seções seguintes ficam inert para não levar foco de teclado a conteúdo fora da tela; os valores prévios são restaurados ao concluir/sair.

## Navegação e falhas

CTA da abertura e link Agendar sem esperar levam diretamente a /agendar desde o frame 1; o gate não impede mudança de rota. O antigo Pular introdução foi substituído por acesso direto ao agendamento, pois permitir que ele pulasse para outra seção violaria o adendo.

prefers-reduced-motion usa apresentação estática e não instala a trava. Versão sem animação permite escolher explicitamente a alternativa acessível, importante em falhas de rede; não marca uma sequência incompleta como concluída. Não há bypass automático de scroll em caso de atraso. A rede pode prolongar a espera por um frame; o último desenho válido e os controles de acesso/alternativa permanecem disponíveis.

## Composição

Logo oficial branca/roxa já existente em /brand/auto-stilo/logo-on-dark.png, proporcional. Logo acima do CTA, ambos no mesmo eixo horizontal central e como grupo centralizado verticalmente, com gap 32px desktop/24px mobile. Centralização por flex, sem depender do translateY que o GSAP anima. Entrada curta coordenada (logo primeiro, botão 60ms depois) e saída da composição vinculada ao displayedFrame. H1 semântico visualmente oculto permanece. O título textual e subtítulo visual foram retirados dessa composição para manter logo + botão como pedido.

## Validação

Lint, typecheck, build DEMO_MODE=false e tokens:check passaram. qa-hero-gate.mjs: 1920×1080, 1366×768, 390×844, 360×800. BoundingBoxes conferem eixo X de ambos e centro Y do conjunto (tolerância de 2/3px). Tentativas repetidas de wheel com 20000px, End e toque longo não alcançaram a próxima seção enquanto displayedFrame<239. Após concluir, houve liberação sem scroll acumulado. Cada viewport registrou 477 desenhos adjacentes, ida 1→239 e retorno 239→1; nenhum pageerror.

O teste conferiu inert durante a espera e sua restauração ao concluir. Confirmou o clique real do CTA desde a abertura, ausência de gate na rota de agendamento, alternativa estática explícita e reduced-motion. Google Maps foi interceptado com fixture para não depender de rede externa. Não houve acesso/gravação em Supabase real; o código do agendamento não foi alterado. Evidências PNG e results.json acompanham o relatório. Testes de touch usam CDP em Chromium, não um iPhone físico.

Nenhuma mudança em banco, RPCs, RLS, autenticação, PWA/notificações, fontes globais ou repo dono. Skills ui-animations/web-animation-design e webapp-testing reutilizadas para movimento e verificação; bibliotecas já instaladas, sem dependências novas.

## Publicação

Push na master usa o fluxo existente Cloudflare Workers Builds, sem deploy manual concorrente. Hash remoto será conferido. O ambiente não permite consultar GitHub checks/Cloudflare ou abrir workers.dev; deployment e homologação na URL pública permanecem não confirmados. Isso não equivale à confirmação de deploy.
