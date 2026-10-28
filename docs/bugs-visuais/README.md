# Correções de bugs visuais — 28/10/2026

Branch de trabalho: `fix-bugs-visuais`, criada da `master` limpa e atualizada, base `02326776c2183ef09228a72c572394e32cd163e1`. Evidências locais de **build de produção**, servido por `wrangler dev --local`; não é validação do site publicado depois do push.

## O que foi corrigido

1. O degradê do hero estava no `.signature` limitado a 1280px. A superfície agora ocupa 100% da largura, preservando os recuos do conteúdo. Equipe e Espaço também receberam fundo na largura inteira. Não foi usado `100vw`, que poderia incluir a barra de rolagem.
2. O Ritual fixava em `top top`, ignorando o header. Um `ResizeObserver` publica a altura real em `--header-h`; o pin usa esse offset e atualiza quando a altura muda. Header de 81px nos três testes, com logo/nome lado a lado e DEMO discreto. Foto redimensionada para caber na altura disponível; o zoom acontece dentro da moldura. Sem movimento, as três etapas seguem em fluxo normal, sem altura fixa que corte o texto.
3. Marca sobre mídia convertida em padrão diagonal translúcido, abaixo das legendas e dos controles. O selo global foi reposicionado para o fluxo do rodapé, pois também cobria “Voltar” no celular; texto, interruptor e padrão global mantidos. Cinco fotos distribuídas em cinco espaços: Assinatura/nuca, Ritual/perfil, História/reconhecimento, Espaço/interior e Galeria/acabamento. Galeria complementar reduzida para um cartão. [Inventário e fotos necessárias](../FOTOS-NECESSARIAS.md).
4. Vídeos sem controles nativos e sem botão separado abaixo. Moldura de 32px com `overflow:hidden`, isolamento e máscara de compatibilidade WebKit. Reprodução muda em loop ao entrar na viewport, pausa ao sair ou ocultar a aba, clique/toque para pausar/retomar e som opcional. Ícone de play aparece apenas em pausa. Com movimento reduzido, não há autoplay; reprodução manual continua disponível. Legendas e posters preservados.
5. A linha preta era o `border-top` herdado de `.final-cta`; a cinza próxima vinha do último item da FAQ. Removidos esses divisores e os divisores de seção que podiam produzir o mesmo sintoma, incluindo o início do footer. Não foi necessário sobrepor seções em 1px. As emendas medidas são contíguas, sem vão.
6. Removidos magnetismo no próprio alvo e deslocamento CSS de 8px no hover; o brilho interno do CTA continua. Entradas não deslocam os controles do header nem a barra fixa de agendamento. Confirmar/Voltar têm gap de 16px e botão secundário com padding; grupos empilhados no celular. Catálogo, filtros, horários e grupos de `/agendar` revisados/testados; fluxo demo completo concluído.
7. Prévia que seguia o cursor removida: imagem, importação, listener e CSS. Halo roxo removido também. Busca em `src/` não encontra `service-preview`, `cursor-halo`, `onPointerMove` ou `quickTo` nos componentes/estilos da landing.

O JSX/CSS do marquee “CORTE · BARBA · ESTILO · AUTO STILO” foi comparado com a base e está idêntico. Tokens, fontes, cores, arquivos de mídia, hero/player, lógica de reserva, Supabase, `wrangler.jsonc` e configuração de headers não foram alterados.

## Resultado dos testes

`typecheck`, `lint`, `build`, `tokens:check` e `spacing:check`: passaram. [Logs](checks/). O lint avisa apenas que o comando `next lint` será descontinuado no Next 16. Build de QA com `NEXT_PUBLIC_DEMO_MODE=true NEXT_PUBLIC_DEMO_WATERMARK=true`, nos dois lados da comparação, sem gravar essas variáveis no repositório.

Playwright/Chromium com rolagem real por `mouse.wheel`, animações habilitadas e casos adicionais com `prefers-reduced-motion: reduce`. Antes: degradê limitado, foto sob o header, watermark sobre legenda, controles nativos, bordas, gap zero e prévia no cursor reproduzidos. O hover anterior variou aproximadamente 5,1px nos desktops.

| Viewport | Largura/página sem overflow | Header | Variação do botão | Gap Confirmar/Voltar | CLS observado | Console |
| --- | --- | --- | --- | --- | --- | --- |
| 1440×900 | 1440 = 1440px | 81px | 0px | 16px | 0.00078 | 0 erros |
| 1366×768 | 1366 = 1366px | 81px | 0px | 16px | 0.00090 | 0 erros |
| 390×844 | 390 = 390px | 81px | 0px | 16px | 0.00314 | 0 erros |

As sete superfícies de transição medidas têm largura igual à viewport e início em x=0. Nas cinco amostras do Ritual por tamanho, a moldura permanece abaixo do header e acima do fim da viewport. Os dois vídeos têm raio de 32px, nenhum atributo `controls`, posters distintos e nenhuma fonte repetida entre fotos/posters/vídeos. Alvos medidos dos grupos de ação ≥48px (mínimo solicitado: 44px). Reprodução, pausa fora da tela, áudio, pausa manual, retomada, conclusão da simulação e movimento reduzido passaram nos três tamanhos.

Dados: [antes](antes/results.json), [depois e inventário completo de mídia](depois/results.json), [interações](depois/interactions.json), [emendas entre seções](depois/seams.json). O inventário registra cada imagem escolhida pelo navegador e seus `source` responsivos, cada vídeo e seu poster; variantes de tamanho/formato de uma foto são agrupadas para detectar reutilização entre espaços. Os dois posters são representações de seus próprios vídeos, não espaços de fotografia adicionais.

## Screenshots antes/depois dos sete pontos

Cada par abaixo abre capturas do build de produção no tamanho indicado. Há capturas adicionais de confirmação, `/agendar`, vídeo em pausa com movimento reduzido e Ritual sem pin na pasta `depois/`.

| Ponto | 1440×900 | 1366×768 | 390×844 |
| --- | --- | --- | --- |
| 1. Degradê | [antes](antes/1440-1-degrade.jpg) · [depois](depois/1440-1-degrade.jpg) | [antes](antes/1366-1-degrade.jpg) · [depois](depois/1366-1-degrade.jpg) | [antes](antes/390-1-degrade.jpg) · [depois](depois/390-1-degrade.jpg) |
| 2. Ritual/header | [antes](antes/1440-2-ritual.jpg) · [depois](depois/1440-2-ritual.jpg) | [antes](antes/1366-2-ritual.jpg) · [depois](depois/1366-2-ritual.jpg) | [antes](antes/390-2-ritual.jpg) · [depois](depois/390-2-ritual.jpg) |
| 3. Fotos/legenda/marca | [antes](antes/1440-3-fotos-legendas.jpg) · [depois](depois/1440-3-fotos-legendas.jpg) | [antes](antes/1366-3-fotos-legendas.jpg) · [depois](depois/1366-3-fotos-legendas.jpg) | [antes](antes/390-3-fotos-legendas.jpg) · [depois](depois/390-3-fotos-legendas.jpg) |
| 4. Vídeos | [antes](antes/1440-4-videos.jpg) · [depois](depois/1440-4-videos.jpg) | [antes](antes/1366-4-videos.jpg) · [depois](depois/1366-4-videos.jpg) | [antes](antes/390-4-videos.jpg) · [depois](depois/390-4-videos.jpg) |
| 5. Emenda | [antes](antes/1440-5-emenda.jpg) · [depois](depois/1440-5-emenda.jpg) | [antes](antes/1366-5-emenda.jpg) · [depois](depois/1366-5-emenda.jpg) | [antes](antes/390-5-emenda.jpg) · [depois](depois/390-5-emenda.jpg) |
| 6. Estabilidade do CTA | [antes](antes/1440-6-botao.jpg) · [depois](depois/1440-6-botao.jpg) | [antes](antes/1366-6-botao.jpg) · [depois](depois/1366-6-botao.jpg) | [antes](antes/390-6-botao.jpg) · [depois](depois/390-6-botao.jpg) |
| 6. Confirmar/Voltar | [antes](antes/1440-6-confirmacao.jpg) · [depois](depois/1440-6-confirmacao.jpg) | [antes](antes/1366-6-confirmacao.jpg) · [depois](depois/1366-6-confirmacao.jpg) | [antes](antes/390-6-confirmacao.jpg) · [depois](depois/390-6-confirmacao.jpg) |
| 7. Cursor nos serviços | [antes](antes/1440-7-cursor-servicos.jpg) · [depois](depois/1440-7-cursor-servicos.jpg) | [antes](antes/1366-7-cursor-servicos.jpg) · [depois](depois/1366-7-cursor-servicos.jpg) | [antes](antes/390-7-cursor-servicos.jpg) · [depois](depois/390-7-cursor-servicos.jpg) |

## Limitações e pendências honestas

- Safari/iOS físico não foi testado. A tentativa de instalar WebKit falhou com HTTP 403 “Domain forbidden” nos servidores de download ([evidência](checks/webkit.txt)). O recorte usa CSS específico para WebKit, mas a confirmação em iPhone/Safari continua pendente.
- Não reproduzi o aparecimento espontâneo da foto fora da lista de serviços, sem interação. Reproduzi a prévia seguindo o mouse sobre a lista e removi integralmente esse efeito. O header antigo mediu aproximadamente 125px com DEMO neste ambiente, não os ~156px relatados; o encobrimento da foto foi reproduzido.
- As capturas são amostras, com animações reais; texto pode estar em transição entre etapas. A garantia medida da moldura se refere ao período de apresentação/pin do Ritual, não a impedir que imagens saiam naturalmente da viewport ao rolar para outra seção.
- Não foram alteradas contas/configurações Cloudflare, executados deploys manuais, migrations ou gravações em banco real. O teste do agendamento foi local e demonstrativo; backend real e publicação após o push não fazem parte destas evidências.
- Faltam dois retratos autorizados da equipe. Mais três fotos diferentes são necessárias apenas se quiser restaurar os quatro cartões complementares da galeria.

## Repetir o QA

```sh
NEXT_PUBLIC_DEMO_MODE=true NEXT_PUBLIC_DEMO_WATERMARK=true npm run build
npm run preview:cf
# Em outro terminal, após o preview ficar pronto:
node scripts/qa-visual-bugs.mjs depois
node scripts/qa-visual-interactions.mjs
```

Os scripts aceitam `QA_BASE_URL` e `CHROMIUM_PATH`. Use apenas preview local em modo demo. O modo `antes` do primeiro script captura uma versão anterior servida em outra porta, sem exigir que ela cumpra as novas asserções. As evidências desta entrega usam a base `0232677` em um worktree isolado para o antes.
