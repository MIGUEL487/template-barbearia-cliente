# Auditoria: simulação e agendamento real

## Causas e evidências

Antes desta correção, `src/config/demo.ts` calculava:

```ts
DEMO_MODE === 'true' || !(SUPABASE_URL && SUPABASE_ANON_KEY)
```

Portanto `false` não prevalecia sobre uma credencial ausente: `/agendar` renderizava DemoBooking e `/meu-agendamento` renderizava DemoManagement. Agora só `true`, `True`, `TRUE` ou `1` ativam simulação; false/False/FALSE/0/ausente não ativam. Falta de configuração produz erro explícito.

Segunda falha comprovada: LiveStep2 e LiveStep3 continham apenas o resumo/botão da barra inferior e eram reutilizados como conteúdo principal. Nenhum controle renderizava services, availableSlots ou selectedDate. LiveChoices agora renderiza seleção de serviços, data e slots reais.

Terceira falha: Catalog inicializava serviços/barbeiros com snapshot.json e mantinha esses dados se a consulta falhasse. Agora inicia vazio fora da simulação, valida configuração e mostra erro sem fallback.

Não foi possível provar qual condição disparava no build remoto: acesso à URL publicada bloqueado com CONNECT 403 pelo proxy do ambiente. Os valores do build Cloudflare e a chave pública real não estão disponíveis nesta sessão. Não se conclui que a chave remota está ausente apenas a partir da fórmula; `?debug=1` permite conferir modo, ref e variáveis pendentes no build efetivamente publicado.

## Inventário completo de flags de dados

| Leitor | Flag/efeito |
| --- | --- |
| src/config/demo.ts | NEXT_PUBLIC_DEMO_MODE → envFlag; só ativa explicitamente simulação |
| src/app/agendar/page.tsx | demoMode → DemoBooking ou LiveBooking |
| src/app/meu-agendamento/page.tsx | demoMode → DemoManagement ou LiveManagement |
| src/components/landing/catalog.tsx | demoMode → catálogo/equipe ilustrativos; caso contrário consultas públicas |
| src/components/landing/faq.tsx | demoMode → FAQ ilustrativo; caso contrário public_faq_items |
| src/components/demo-watermark.tsx | NEXT_PUBLIC_DEMO_WATERMARK → overlay, badge e fotos; NEXT_PUBLIC_WATERMARK_TEXT → texto; NEXT_PUBLIC_WATERMARK_CONTACT → contato |
| src/app/layout.tsx | watermarkEnabled → título Demo/noindex; não controla consultas ou persistência |
| src/app/robots.ts, scripts/headers.mjs | NEXT_PUBLIC_DEMO_WATERMARK → noindex; aceita true/1 sem diferenciar caixa |
| src/components/booking/diagnostics.tsx | ?debug=1 → exibe diagnóstico; não altera persistência |
| scripts/snapshot.mjs | ferramenta antiga de snapshot público, removida do prebuild e não importada pela interface; normalizada também para reconhecer true/1 sem diferenciar caixa |

Não há outro flag mock de persistência. `motion`, `lenis` e preferências de animação controlam apenas apresentação.

## Inventário de dados de exemplo/fallbacks

- DemoBooking: demoServices/demoBarbers e slots fixos 09:00/10:30/14:00/15:30/17:00; conclusão apenas muda estado React, sem RPC. Só renderiza com demoMode explícito.
- DemoManagement: texto e cancelamento/reagendamento locais, só com demoMode explícito.
- Catalog: dados demo só com demoMode; snapshot não é mais utilizado. Erro ou lista vazia não injeta serviços/barbeiros.
- Faq: demoFaq só com demoMode; falha real mostra aviso; lista vazia permanece vazia.
- useLiveBooking: arrays reais começam vazios; não há geração local de slots. Sem preferência envia barber_id null, não um barbeiro falso. Disponibilidade vazia permanece vazia; erro mostra mensagem e detalhes no console.
- Cliente Supabase: URL/chave fictícias de inicialização evitam quebra de prerender, mas validação bloqueia catálogo/agendamento quando as variáveis reais faltam. barbershop_id não tem mais fallback.
- Percentual inicial 50 é valor de apresentação anterior à resposta de site_settings; preço/hold são calculados pelo servidor. Não cria reserva local. Token e expiração precisam existir na resposta da RPC para mostrar pré-reserva.
- Iniciais do barbeiro quando não há avatar são fallback visual; nome e ID continuam do banco.
- shop, reviews, fotos/editorial e textos institucionais de config/demo.ts/landing permanecem conteúdo estático da landing; não substituem consultas do agendamento. Hero/canvas/poster e placeholders são fallbacks visuais, sem efeito no banco.

## Cloudflare: variáveis exatas do build de produção

```text
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_SUPABASE_URL=https://jrzabortkpouqkwndpcq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<chave pública do projeto jrzabortkpouqkwndpcq>
NEXT_PUBLIC_BARBERSHOP_ID=11111111-1111-1111-1111-111111111111
NEXT_PUBLIC_DEMO_WATERMARK=true ou false, independente da reserva
NEXT_PUBLIC_WATERMARK_TEXT=<texto opcional>
NEXT_PUBLIC_WATERMARK_CONTACT=<contato opcional>
```

Não publicar service_role. NEXT_PUBLIC_* é incorporado no build estático: mudar somente uma variável runtime não altera o JavaScript já publicado. Fazer novo build da master e conferir o commit implantado.

## Validação publicada

1. Abra `/agendar?debug=1`. Deve mostrar Simulação: não, projeto jrzabortkpouqkwndpcq, ID 11111111-1111-1111-1111-111111111111 e nenhuma variável pendente. A marca d'água pode continuar ligada.
2. Selecione Carlos ou Jeronimo, serviços reais e data. A aba Network deve mostrar POST get_availability com p_barbershop_id correto, p_barber_id escolhido (null para sem preferência), p_date YYYY-MM-DD sem conversão UTC e p_service_ids dos serviços selecionados.
3. Segunda a sábado: horários retornados pelo servidor, respeitando almoço 12–13, folgas, bloqueios e reservas. Domingo: nenhum horário se is_off=true. O frontend não inventa slots nem decide expediente.
4. Navegadores fora do Brasil também devem mostrar horas em America/Sao_Paulo. Datas do calendário partem da data de São Paulo.
5. Confirme a pré-reserva e verifique create_booking_hold retornando cancellation_token e hold_expires_at. A RPC no SQL consolidado do dono define 15 minutos; frontend não pode alterar a expiração retornada. Se a função antiga ainda retorna 10 minutos, revisar/aplicar booking-repair.sql do dono antes de declarar o banco corrigido.
6. Atualize a agenda do dono na mesma data/loja; deve aparecer status hold. Não é confirmação de pagamento. Alterações de expediente exigem nova consulta de disponibilidade no cliente.
7. Em erro, a UI informa indisponibilidade e o console registra [Supabase] com code/message/details/hint. Não compartilhar tokens de gestão nem dados pessoais nos logs.
8. Sem ?debug=1 o painel de diagnóstico não aparece; nenhuma chave é exposta nele.

## Testes executados

Build com DEMO_MODE=false, WATERMARK=true, URL/ref/loja informados e chave pública fictícia de fixture; Playwright interceptou todas as chamadas Supabase, sem escritas remotas. Desktop e celular, fusos Asia/Tokyo e America/Los_Angeles: seleção de serviço, domingo vazio, erro PGRST202 visível, recuperação e seleção de 09:00 em São Paulo, parâmetros exatos e hold com token/15 minutos. Isso prova a interface e o contrato das RPCs, não a configuração/schema do banco publicado. O teste de banco isolado do trabalho anterior está no repo do dono.

Também passou um segundo build DEMO_MODE=false sem credenciais: continuou no componente real, mostrou mensagem amigável, não fez requisições Supabase e não exibiu simulação. O diagnóstico identificou as três variáveis ausentes e ficou oculto sem ?debug=1. A matriz true/True/TRUE/1 e false/False/FALSE/0/ausente passou no parser de flags.

## Arquivos alterados

- `src/lib/env-flag.ts`, `src/config/demo.ts`: ativação explícita de simulação.
- `src/lib/supabase.ts`: remoção do ID implícito de loja.
- `src/lib/booking-diagnostics.ts`, `src/components/booking/diagnostics.tsx`, `src/app/layout.tsx`: erro estruturado e diagnóstico opt-in.
- `src/components/booking/live-choices.tsx`, `live-booking.tsx`: controles reais de serviço/data/slots.
- `src/components/booking/use-live-booking.tsx`: parâmetros RPC, data de São Paulo, validação de resposta de hold, erros.
- `src/components/booking/live-step-3.tsx`, `live-step-4.tsx`: resumo de horário em São Paulo.
- `src/components/landing/catalog.tsx`: remoção do snapshot/fallback e erro explícito.
- `src/components/demo-watermark.tsx`, `src/app/robots.ts`, `scripts/headers.mjs`: watermark independente e flags normalizados.
- `scripts/snapshot.mjs`, `package.json`: snapshot fora do prebuild; normalização do script legado.
- `scripts/qa-live-booking.mjs`, `scripts/qa-booking-missing-env.mjs`: regressões do fluxo real e configuração ausente.
- `docs/LIVE-BOOKING-AUDIT.md`: evidências e validação.

Nenhuma alteração no Cloudflare ou Supabase real.
