# Calendário do agendamento

Substitui o input de data nativo em /agendar por calendário mensal, usando os tokens já existentes: branco, texto preto, roxo no dia selecionado e destaque do dia atual. Título serifado, navegação de meses e espaçamentos da escala de 8px. Os demais componentes e a landing não foram alterados.

Cada dia futuro do mês consulta get_availability com o barbershop_id configurado, o barbeiro selecionado (null para sem preferência) e os serviços reais. São no máximo três consultas simultâneas. Dia sem slots, passado, em consulta ou com falha fica desabilitado. Não há horário ou dia de trabalho inventado no frontend. Em Sem preferência, o dia fica disponível se algum profissional tiver horário.

Ao clicar numa data habilitada, a RPC é consultada novamente ANTES de selecionar. Se o dono acabou de fechar/bloquear o dia, a seleção é recusada e o dia é apagado. O calendário também atualiza ao voltar à aba. Essa proteção depende de a RPC do projeto respeitar working_hours.is_off, closed_days, time_off e almoço — conforme o SQL consolidado do repositório do dono. Não consulta tabelas privadas nem muda policies.

Horários da data continuam vindo do hook real. Seleções antigas são limpas durante atualização; respostas atrasadas de datas anteriores são descartadas. Pré-reserva continua passando pela validação SQL e retorna token/expiração. Alterações concorrentes ainda podem ocorrer após a consulta; a RPC de hold é a validação definitiva.

Erro de consulta desabilita os dias afetados, informa indisponibilidade e registra [Supabase] com detalhes. Há botão para tentar novamente. Datas são strings YYYY-MM-DD; data de hoje em America/Sao_Paulo; montagem dos meses em UTC evita deslocamento do dia em navegadores de outros fusos.

Testes em scripts/qa-live-booking.mjs: desktop e celular, fusos Asia/Tokyo e America/Los_Angeles; domingo sem slots, dia fechado sem slots, erro PGRST202, dia que fecha após o calendário carregar, recuperação e envio de hold. As RPCs são interceptadas com fixtures, sem escrita no Supabase real. Build DEMO_MODE=false, lint e typecheck também verificados.

Capturas: [desktop](1440-calendar.jpg) e [celular](390-calendar.jpg).

Branch feat-calendario-agendamento para revisão visual. Não foi realizado deploy manual, merge na master ou mudança no Supabase.

## Horários ao lado do calendário

O calendário e a lista de horários agora usam duas colunas a partir de 768px, separadas por 32px. No celular, ficam em coluna, com intervalo de 24px. A lista informa a data selecionada e mantém as animações, bloqueios e chamadas reais existentes. Validação em 1440px, 820px e 390px, sem overflow e com pré-reserva concluída em backend interceptado de teste. Capturas: [desktop](1440-layout.jpg), [tablet](820-layout.jpg), [celular](390-layout.jpg). Merge automático desta mudança autorizado pelo usuário.
