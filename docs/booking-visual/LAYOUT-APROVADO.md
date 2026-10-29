# Retorno ao layout anterior completo

Branch fix-agendar-layout-aprovado, sem merge na master.

A revisão anterior só adaptava os seletores ao CSS, mas mantinha a estrutura de LiveBooking: header fixo, indicadores em caixas, profissionais com avatares e barra flutuante. Isso não reproduzia o layout anterior que era mostrado por DemoBooking.

Agora LiveBooking utiliza a mesma estrutura visual de DemoBooking: booking-shell, brand com Voltar ao início, step-progress, h1 serifado, cards choice, campo field-label, botões time-choices, resumo booking-summary e barra booking-actions/booking-action-buttons. A animação volta ao deslocamento horizontal de 16px, duração .18s, respeitando movimento reduzido. Nenhum CSS, token, fonte, marquee ou hero foi alterado.

A lógica continua em useLiveBooking, sem mock: dados públicos reais, seleção de barbeiro e serviços, chamada get_availability, datas em São Paulo, criação de hold, token e expiração. O formulário usa os mesmos campos e consentimentos necessários. Múltiplos serviços usam checkbox; barbeiro usa radio. Sem preferência continua disponível. O resumo informa o sinal configurado no servidor; a confirmação de pagamento continua pendente como antes, sem simular cobrança aprovada. Textos de simulação não foram restaurados.

Validação: build com DEMO_MODE=false, lint e typecheck passaram. Playwright passou em desktop/celular, fusos Asia/Tokyo e America/Los_Angeles, erro de disponibilidade, domingo vazio e envio da pré-reserva. As chamadas Supabase foram interceptadas com fixtures; não houve escrita no banco real. Não foram alterados hook de dados, RPCs ou /meu-agendamento.

Capturas:

- [Desktop: profissional](layout-aprovado/1440-agendar-profissional.jpg), [serviços](layout-aprovado/1440-agendar-servicos.jpg), [horários](layout-aprovado/1440-agendar-horarios.jpg).
- [Celular: profissional](layout-aprovado/390-agendar-profissional.jpg), [serviços](layout-aprovado/390-agendar-servicos.jpg), [horários](layout-aprovado/390-agendar-horarios.jpg).

O site publicado só muda após aprovação/merge desta branch e build automático de produção. Não foi realizado deploy manual.
