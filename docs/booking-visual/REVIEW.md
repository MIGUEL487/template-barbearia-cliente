# Revisão visual do agendamento

Branch: fix-agendamento-visual. Sem merge na master.

Base da auditoria: c6b01b3, último commit antes das correções funcionais de agendamento. Estado anterior desta revisão: 25657e0. Essa referência técnica não substitui uma aprovação visual do usuário.

## Comparação completa dos arquivos com efeito na apresentação

| Arquivo alterado desde c6b01b3 | Funcional necessário: manter | Visual: corrigir/reverter |
| --- | --- | --- |
| src/components/booking/live-choices.tsx (novo) | Seleção de serviços, data, slots reais e estados vazio/carregando | Removidas classes próprias p-4/rounded-2xl/border e composição horizontal improvisada; reutiliza choice com checkbox, field-label e time-choices do CSS aprovado. Mesma entrada motion das outras etapas |
| src/components/booking/live-booking.tsx | Renderiza LiveChoices no conteúdo, mantendo resumo na barra inferior; antes havia dois resumos e nenhum seletor | Nenhuma classe/layout existente alterado; mantém o scaffold anterior das etapas reais |
| src/components/booking/live-step-3.tsx | Resumo do horário em America/Sao_Paulo | Nenhuma classe alterada |
| src/components/booking/live-step-4.tsx | Resumo do horário em America/Sao_Paulo | Nenhuma classe alterada |
| src/components/booking/live-step-5.tsx | Texto correto de pré-reserva, não confirmação de pagamento | Mantidas integralmente classes e animações anteriores; não restaurar texto enganoso de confirmação |
| src/components/booking/diagnostics.tsx (novo) | Diagnóstico somente com debug=1 | Removidos todos os estilos inline novos; reutiliza booking-shell/bg-bg/text-text; invisível sem debug |
| src/app/layout.tsx | Monta diagnóstico opt-in | Fontes, classes, cores e ordem dos elementos existentes intactas |
| src/components/landing/catalog.tsx | Dados reais, erro explícito, sem snapshot silencioso | Classes, motion, cards, tipografia e filtros existentes intactos; não restaurar dados fictícios para reproduzir aparência |
| src/config/demo.ts | Simulação só por flag explícito | A troca da interface simulada pela real muda o conteúdo visto; reverter isto quebraria a gravação. Nenhum estilo foi alterado neste arquivo |
| src/components/demo-watermark.tsx | Flag independente, aceita true/1 | Marcação e estilos de marca d'água intactos |
| src/app/robots.ts, scripts/headers.mjs | noindex conforme watermark | Não alteram aparência |
| src/components/booking/use-live-booking.tsx | Dados, parâmetros, erros e datas reais | Não contém alteração de classes/layout/animação |

Demais arquivos das correções: src/lib/supabase.ts, src/lib/env-flag.ts, src/lib/booking-diagnostics.ts, package.json, scripts/snapshot.mjs, scripts/qa-live-booking.mjs, scripts/qa-booking-missing-env.mjs, docs/BOOKING-REPAIR.md e docs/LIVE-BOOKING-AUDIT.md: configuração, lógica, testes ou documentação. Não alteram CSS/classes/fontes.

`src/styles/**`, `src/app/globals.css`, tokens, arquivos de fontes, configuração Tailwind, hero e marquee (`editorial.tsx`) são idênticos a c6b01b3. Nenhum novo CSS, fonte, cor ou token introduzido nesta revisão. /meu-agendamento real (live-management.tsx) também é idêntico à base; o flag passou a ativar o componente real já existente em vez da simulação. Não se reintroduz simulação para conseguir igualdade de conteúdo.

## Antes/depois: desktop e celular

As capturas usam 1440×900 e 390×844, com a mesma fixture local, animação habilitada e dados iguais. Não foram feitas consultas/gravações no Supabase real. `before` representa 25657e0; `after` representa esta branch.

| Tela | Antes | Depois |
| --- | --- | --- |
| /agendar — serviços | Nome, descrição e valor comprimidos no mesmo eixo; classes adicionadas de padding/borda/raio | Card choice já existente, checkbox e descrição/valor empilhados; fundo branco, contraste pelos tokens e seleção com accent-soft |
| /agendar — horários | Input com classes utilitárias próprias, slots com classe choice sem estado de seleção adequado | field-label/input aprovado; botões time-choices existentes com aria-pressed e estado selecionado; animação igual às outras etapas |
| /agendar — profissional | Componente real anterior | Sem alteração; captura de controle |
| /meu-agendamento | Interface real anterior com dados da fixture | Sem alteração; captura de controle |

Capturas: [antes](before/) e [depois](after/), nomeadas por largura e etapa. Teste reproduzível: scripts/qa-booking-visual.mjs. Teste funcional: scripts/qa-live-booking.mjs.

## Preview Cloudflare

O push somente desta branch permite ao build de branches do Cloudflare gerar preview, se configurado. Não foi realizado deploy manual, alteração no Cloudflare ou merge na master. A API GitHub de checks está bloqueada neste ambiente (HTTP Forbidden); o link do preview não deve ser inventado. Se não for possível obter a URL, abrir o check Workers Builds desta branch no GitHub e copiar a URL de preview exibida no build Cloudflare.
