# Foto da equipe e quantidade de pessoas

Branch: `feat-fotos-reserva-grupo`, nos dois repositórios. Sem merge automático.

A home agora mostra o mesmo `public_barbers.avatar_url` usado no agendamento,
com o mesmo fallback para imagem ausente ou inválida. Recarregue a home após
trocar a foto em Equipe no painel.

Os controles −/+ na etapa de serviços reais permitem de 1 a 6 pessoas por serviço.
O resumo, preço, sinal e duração acompanham a quantidade. Uma única pré-reserva
reserva o intervalo contínuo para o grupo, com um responsável pelo contato e
atendimentos seguidos pelo mesmo profissional. Cancelamento pelo token é do grupo.

**Antes de publicar esta melhoria**, no SQL Editor do projeto
`jrzabortkpouqkwndpcq`, execute o arquivo do repositório do dono:
`supabase/migrations/20261101000000_group_bookings.sql`.

[Instruções e SQL no repo do dono](https://github.com/MIGUEL487/template-barbearia-dono/blob/feat-fotos-reserva-grupo/docs/RESERVA-PARA-PESSOAS.md).
Nenhuma migração foi executada no banco real nesta tarefa.

Uma unidade continua usando as RPCs atuais. Para repetir um serviço, o cliente
chama `get_group_availability` e `create_group_booking_hold`; o calendário recebe
as mesmas quantidades. Essas funções contam IDs repetidos, calculam no servidor
o preço/tempo total e gravam um item por pessoa, com hold e token de 15 minutos.
Sem o SQL, essa opção falha com aviso; nunca simula uma reserva ou ignora unidades.

QA: build, lint, typecheck e tokens; Playwright com APIs interceptadas, sem gravação
real, em 1440/390/320 px, para 1 e 2 pessoas e fotos iguais na home/agendamento.
`QA_PEOPLE=2 node scripts/qa-booking-loading.mjs` gera capturas em
`docs/group-booking`, usando um retrato sintético de teste.
O teste SQL local do repo do dono valida reserva, preço, tempo, itens, bloqueios,
almoço, folgas, fechamento, expiração e permissões no PostgreSQL isolado.
