# Movimento e memória

239 frames por variante, idx=round(progress*238). Pin 4,5 telas desktop/tablet e 3,5 mobile retrato; scrub 0,35 s. Canvas cover, DPR máximo 2 (1 em pouca memória), ResizeObserver, variante reavaliada por matchMedia. Debug apenas desenvolvimento ou ?debug-hero=1: window.__HERO__.

Textos: abertura 1–46; precisão 56–106; experiência 114–164; estilo 176–201; próximo corte 208–239. Timeline GSAP reversível; não cruza cortes em 48/109/167/204. Sem microescurecimento dos cortes.

Desktop: texto à direita, cenas B/C no alto, primeira/última com CTA. Mobile: textos na faixa inferior acima das ações fixas, macro na faixa superior. Evidências nos dez marcos, cinco viewports. Zonas dependem do cover; inspeção visual manual dos screenshots complementa testes, sem detector automático de rosto.

Sem gesto só frame 1. Após wheel/touchstart/keydown: prioridade vizinhança atual e chaves, a cada 8/4/2/restantes; concorrência de download 3, decode 2. Blobs comprimidos retidos; ImageBitmaps limitados à janela ±8 desktop/±5 mobile/±3 baixa memória, fechados na saída. SaveData/2g usa índices alternados. Sem centenas de imagens DOM. Poster permanece se canvas falhar. Cleanup aborta fetches, mata timeline/trigger e fecha bitmaps.

Reduced motion: sem pin, poster e quatro referências empilhadas; sem interação com propriedades controladas por Motion. Ritual mantém narrativa Acolhimento → Precisão → Resultado, rotação discreta e escala até 1,05; seção vertical usa parallax moderado. _headers inclui cache immutable para desktop/mobile e no-cache para manifesto. Cabeçalhos reais do Cloudflare ainda não conferidos.
