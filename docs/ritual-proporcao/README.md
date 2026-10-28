# Ritual — proporção da moldura corrigida

A alteração anterior reduziu a altura da moldura sem reduzir sua largura, deixando o arco mais achatado. Restaurada a relação original de **7:6** (560×480 no desktop com espaço suficiente). Em alturas menores, largura e altura diminuem juntas. No celular, a mesma relação é preservada, com a moldura centralizada na coluna.

Centralização no preto, escala uniforme de 94% a 106% e rotação de −2° a +2° mantidas. Sem transformação/zoom na imagem interna. O enquadramento fica constante durante a rolagem.

Build de produção local com modo demo e marca d'água ativos. Typecheck, lint, build, tokens e grade de espaçamento passaram. Playwright com rolagem real validou quatro tamanhos: proporção da moldura, escala igual nos dois eixos, centro no desktop, ausência de recorte pelo header e de overflow, rolagem reversa, movimento reduzido e zero erros de console.

| Viewport | Início | Meio | Fim |
| --- | --- | --- | --- |
| 1920×920 | [captura](1920-inicio.jpg) | [captura](1920-meio.jpg) | [captura](1920-fim.jpg) |
| 1440×900 | [captura](1440-inicio.jpg) | [captura](1440-meio.jpg) | [captura](1440-fim.jpg) |
| 1366×768 | [captura](1366-inicio.jpg) | [captura](1366-meio.jpg) | [captura](1366-fim.jpg) |
| 390×844 | [captura](390-inicio.jpg) | [captura](390-meio.jpg) | [captura](390-fim.jpg) |

[Medidas completas](results.json). Para repetir no preview local de produção: `QA_OUTPUT=docs/ritual-proporcao node scripts/qa-ritual-motion.mjs`.

Estas evidências são locais em Chromium; não validam Safari/iOS físico nem o deploy remoto após o push. Não foram alterados Cloudflare, agendamento, outras seções ou o movimento já aprovado.
