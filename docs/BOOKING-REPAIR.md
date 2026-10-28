# Correção de agendamento

O SQL consolidado e o relatório completo estão no repositório do dono: `supabase/booking-repair.sql` e `docs/BOOKING-REPAIR.md`.

Este cliente agora exige NEXT_PUBLIC_BARBERSHOP_ID válido, reconhece True/False sem distinguir maiúsculas e registra os erros do catálogo/disponibilidade/hold no console. Só um hold não confirma pagamento: a tela informa pré-reserva de 15 minutos.

Conferir no build: NEXT_PUBLIC_SUPABASE_URL=https://REF.supabase.co e NEXT_PUBLIC_SUPABASE_ANON_KEY iguais aos do dono; NEXT_PUBLIC_BARBERSHOP_ID igual ao shop_members.barbershop_id do dono; NEXT_PUBLIC_DEMO_MODE=false. Somente .env.example está versionado; nenhum .env.production/.env.local foi encontrado.

Sem credenciais remotas não foi possível confirmar os valores Cloudflare, a associação do dono ou o checkout publicado. Não foi realizado deploy manual nem escrita em Supabase real. O fluxo de banco foi testado em PostgreSQL 17 isolado: visitante → disponibilidade → hold com email NULL → pagamento verificado pelo servidor → leitura autenticada do dono, além de almoço/folga/bloqueio/fechamento e permissões anônimas. A criação de cobrança no provedor continua pendente no checkout estático; o teste SQL não simula uma compra real.
