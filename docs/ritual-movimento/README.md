# Ritual: centralização e movimento do recorte

A foto permanece na coluna esquerda no desktop, com centro vertical alinhado ao centro da faixa preta. A linha decorativa fica fora do cálculo de altura; a moldura reserva folga para crescer e girar sem tocar no header ou nos degradês. No celular, foto e texto continuam empilhados e o conjunto fica centralizado na seção.

Durante a rolagem, a **moldura inteira** cresce de 94% para 106% e gira de −2° para +2°, em torno do centro. A imagem dentro dela não recebe transformação: enquadramento, posição e dimensões internas permanecem constantes. A marca acompanha a moldura. A rolagem reversa desfaz o movimento; a preferência por movimento reduzido remove escala/rotação.

Validação em build de produção local, Playwright/Chromium com `mouse.wheel`: 1920×920, 1440×900, 1366×768 e 390×844. Centro vertical no desktop com diferença inferior a 1px; foto inteira dentro da viewport, sem sobreposição com o header ou overflow horizontal; crescimento e rotação medidos em três posições; enquadramento interno constante; rolagem reversa e movimento reduzido passaram; zero erros de console. Typecheck, lint, build, tokens e verificação da grade de espaçamento passaram.

| Viewport | Início | Meio | Fim |
| --- | --- | --- | --- |
| 1920×920 | [captura](1920-inicio.jpg) | [captura](1920-meio.jpg) | [captura](1920-fim.jpg) |
| 1440×900 | [captura](1440-inicio.jpg) | [captura](1440-meio.jpg) | [captura](1440-fim.jpg) |
| 1366×768 | [captura](1366-inicio.jpg) | [captura](1366-meio.jpg) | [captura](1366-fim.jpg) |
| 390×844 | [captura](390-inicio.jpg) | [captura](390-meio.jpg) | [captura](390-fim.jpg) |

[Medidas completas](results.json). Para repetir: gerar o build em modo demo, executar `npm run preview:cf` e, em outro terminal, `node scripts/qa-ritual-motion.mjs`.

Sem alterações em outras seções, agendamento, tokens ou Cloudflare. Não foi feito deploy manual. Validação Safari/iOS físico continua pendente; estas evidências são do Chromium local, não da publicação remota após o push.
