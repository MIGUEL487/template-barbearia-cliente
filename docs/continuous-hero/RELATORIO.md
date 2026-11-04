# Hero contínuo, limites dos pins e mapa

Base: eb8f662a90593ca2941711befc631a826fc5e5b5. Backup remoto: backup/pre-continuous-hero-20261104. Branch fix/continuous-hero-and-pins. Commit isolado de código: a4f8642cef4f161f7e5a06adcf1c529c4723790e. Destino master, conforme autorização anterior; main e painel do dono preservados.

## Causas e evidências

- Hero: usava round(progress*238) como índice de desenho e escolhia o bitmap pronto mais próximo. Scroll rápido necessariamente saltava índices. Agora targetFrame é só o destino; displayedFrame muda exclusivamente em ±1. O histórico trace registra chamadas efetivas de paint, não o alvo. Ver results.json e interrupt.json.
- Horizontal: havia scrub adicional de 250 ms além da suavização Lenis. O término físico do pin não esperava o tween terminar. qa-horizontal-scrub-boundary.mjs reproduziu pinReleased=true com displayed=0 no salto ao fim; scrub=true chegou a displayed=1 no mesmo ponto. Mantive a suavização Lenis, sem atraso adicional do trilho.
- Medidas: equipe assíncrona recria o trigger. Prioridades explícitas Hero=100, horizontal=50, Ritual=0, sort antes de refresh, pinSpacing=true e ResizeObserver com guarda de dimensões estabilizam a ordem. O teste estático de refresh isolado não reproduziu erro de medida, portanto não atribuo a causa exclusivamente à ordem de criação. O teste completo atrasou a resposta dos dois barbeiros e validou quatro painéis.
- Ritual: fica depois do fim físico do horizontal; a seção Signature foi preservada e movida para antes da equipe. Testes conferiram boundingBox do Ritual fora do viewport em 5%, 50%, 95% e 100% do pin e no retorno. Não utilizei z-index para mascarar a seção.
- Áreas vazias: o renderer mantém o último desenho enquanto aguarda decode e preserva o bitmap no redimensionamento. Não existe desenho preto substituindo arquivo ausente. Conteúdo do horizontal não depende de opacidade zero. Não recebi a gravação citada no prompt; não alego ter reproduzido cada área vazia do vídeo ausente.

## Renderização, carregamento e compromisso de navegação

Um único ticker GSAP atualiza Lenis e os subscribers do renderer. Sem novo requestAnimationFrame. Lenis continua único, autoRaf=false e syncTouch=false. Cada tick elegível pode desenhar apenas um índice adjacente, até aproximadamente 60/s, conforme o dispositivo. Um único destino substitui o anterior, sem fila de comandos. Inverter o scroll altera o próximo passo; não há reprodução antiga enfileirada.

Frame 1 primeiro; em seguida vizinhança atual, chaves e intervalos 8/4/2/restantes. Três downloads e dois decodes simultâneos. Blobs comprimidos até 239 arquivos; bitmaps limitados a ±6 desktop (13), ±4 mobile (9), ±3 pouca memória (7), fechados ao sair da janela. Fetch abortado e bitmaps liberados no unmount. Nenhum frame foi reencodificado ou removido: os 478 arquivos foram comparados byte a byte com os dois ZIPs fornecidos.

**Compromisso explícito:** não bloqueio scroll nem estendo indefinidamente o pin. Se o usuário ultrapassar toda a intro instantaneamente, a página segue e o Canvas pode completar os frames fora do viewport. Não prometo que todos sejam vistos na tela após um salto arbitrário. Essa é a prioridade de navegação acessível permitida pelo prompt. Em rede lenta, o último frame válido permanece; erros reais são logados com [Hero], sem saltar silenciosamente o frame. Sem timeout que obrigue saltar índices. Atraso total depende de rede/dispositivo; não é garantido um prazo fixo para baixar todos.

## Logo e mapa

Logo oficial existente public/brand/auto-stilo/logo-on-dark.png: branco com coroas roxas, transparência preservada. BrandLogo reutilizado, dimensões proporcionais, entrada curta e saída comandada pelo displayedFrame. H1 semântico sr-only; subtítulo e CTA mantidos. Sem substituição das fontes Cinzel/Outfit ou criação de uma Parisienne que não estava instalada no layout.

Mapa mantém exatamente o endereço da integração anterior: Rua do Tanque 395, Monte Sião/MG. Iframe eager já vem no HTML, sem clique. Placeholder, onError e timeout de 15 s mais link externo sempre disponível. Iframes cross-origin não permitem inspecionar seu documento de erro com confiabilidade; o link externo garante fallback mesmo quando um erro interno dispara load. Requisição não é aguardada pelo Hero. O carregamento real do Google pode aumentar bytes/CPU; não foi possível medir seu custo real por restrição de rede. Testes interceptaram o Google com fixture e simularam falha. Não uso essa medição para prometer performance de produção do mapa.

## Testes

Lint, typecheck, build DEMO_MODE=false e tokens:check passaram. Teste local com URL/key públicas fictícias somente para habilitar a consulta no bundle de QA: todas as requisições Supabase interceptadas, duas respostas de barbeiros atrasadas, nenhum acesso ou escrita no banco real. Um build posterior sem a chave fictícia valida a exportação normal; variáveis do Cloudflare não foram alteradas.

1920×1080, 1366×768, 390×844, 360×800: 477 desenhos adjacentes por cenário (239 avanço + 238 retorno), sem falhas de frame, sem pageerror/console error nos casos de sucesso; janela de memória respeitada. Primeiros 30 frames, salto rápido, retorno completo, interrupção e reversão no meio, canvas com pixels opacos, logo e H1, equipe assíncrona, horizontal completo e saída/reverso, Ritual separado, mapa inicial e fallback. Toque CDP, rotação e teclado passaram; reduced-motion vertical passou. Testes usam gesto real de mouse/touch em Chromium; não equivalem a homologação em iPhone físico. /agendar e /meu-agendamento não tiveram mudanças de código.

Scripts: qa-continuous-hero.mjs, qa-continuous-touch.mjs, qa-continuous-interrupt.mjs, qa-horizontal-scrub-boundary.mjs, qa-pin-refresh-order.mjs. QA anterior passou a aguardar displayedFrame, em vez de presumir que o Canvas chega ao target em 700 ms.

## Escopo e skills

Apenas landing, seu player visual e testes/docs. Nenhuma alteração em RPC, migration, RLS, autenticação, PWA, notificações, dados de agendamento ou repo dono. Reutilizadas as instruções pertinentes já lidas: ui-animations, motion-design, web-animation-design, webapp-testing. Nenhum pacote novo. Inventário das skills disponíveis/ausentes permanece nos relatórios anteriores; não chamei bibliotecas de skills nem executei scanners de segurança por uma mudança de scroll.

## Publicação

Push master aciona o fluxo Cloudflare existente. Não fazer deploy manual concorrente. Este ambiente não permite consultar api.github.com/api.cloudflare.com nem acessar workers.dev; confirmação de deployment e teste da URL pública ficam explicitamente pendentes. O hash remoto de Git será conferido; isso não prova que o Cloudflare publicou. Não houve mudança de conta/configuração Cloudflare.
