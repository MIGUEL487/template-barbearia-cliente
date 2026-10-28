# Navegação direta para seções

Links válidos para conteúdo depois do hero, como `/#servicos`, `/#galeria` e `/#contato`, abrem diretamente no destino, sem montar o player ou o pin dos frames iniciais. A posição é corrigida depois da montagem do layout e do carregamento das fontes, respeitando a altura real do header.

Links de seção na página são tratados tanto como `#seção` quanto como `/#seção`: salto direto, liberação do bloqueio de leitura do hero e histórico do navegador preservado. Depois da introdução, navegar entre seções não leva a rolagem de volta aos frames. Abrir a página normalmente, sem hash de seção, mantém a experiência inicial.

Build, typecheck e lint passaram. Playwright em 1440×900, 1366×768 e 390×844 verificou destinos de seção, menu e histórico, com zero requisições fetch de frames na navegação iniciada por âncora e zero erros de página. Um cenário adicional confirmou a introdução normal e a navegação posterior sem voltar à região do hero. [Resultados](results.json). Repetir no preview de produção local com `node scripts/qa-anchors.mjs`.

Sem alteração de agendamento, aparência das seções, marca ou Cloudflare. Validação local em Chromium; publicação remota após o push não verificada.
