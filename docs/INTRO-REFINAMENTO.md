# Refinamento da introdução e agendamento

- Botões e cards do agendamento: raio de 24 px, mantendo seletores 24 × 24 px.
- Pular introdução: aviso flutuante centralizado no topo, com entrada suave;
  some quando a navegação principal aparece. Preferência por movimento reduzido
  respeitada. O clique mantém navegação, hash e foco no conteúdo.
- Bloco “O cuidado começa aqui” removido, inclusive da timeline da introdução.
- Renderizador principal de quadros: canvas aproveita até DPR 2, limitado pela
  resolução original de 1920 × 1080. Redimensionamento com suavização de qualidade
  alta. PCs com mais memória pré-carregam oito quadros à frente; aparelhos com
  memória informada de até 4 GB continuam com seis. Mobile preservado.
- Caminho alternativo `?renderer=video`: demanda suavizada em 180 ms em vez de
  280 ms. Vídeos desktop recodificados em CRF 18, mantendo os 183 quadros, 30 fps
  e 1080p. Cada direção passa de aproximadamente 7 MB para 10 MB; não se recuperam
  detalhes ausentes nos quadros originais. O caminho padrão continua com imagens.

Verificações: build, lint, typecheck e tokens; fluxo de reserva com Supabase
interceptado em 1440/390/320 px; aviso no topo e pular em desktop/celular; reprodução
desktop e canvas de alta densidade. Fontes e paleta preservadas.

Capturas: `docs/intro-notice`. Branch `fix-agendar-intro-desktop`, sem merge automático.
