# Integração SaaS 2.0 — site público

Base anterior: master `6cbc8568a7137b81ba354842212aa2d2a225217c`; tag `backup/pre-saas2-20261104`. Trabalho em `feat/saas-2`, com commits por etapa. Não foram feitas gravações no Supabase real nem alterados os tokens/identidade, Hero ou marquee aprovados.

## Implementado

- Percentual zero respeitado; cálculos em centavos; atualização da política ao voltar à aba/abrir resumo. Política ausente/inválida ou falha no carregamento inicial bloqueia o fluxo, com erro real no console.
- Resumo distingue sinal calculado, sinal solicitado e pagamento pendente. Usa os valores retornados pelo servidor na pré-reserva; zero não é apresentado como pagamento pendente e não confirma automaticamente o atendimento.
- Um profissional ativo: seleção automática, etapa oculta e progresso renumerado. Dois ou mais: escolha normal. Nenhum: aviso e avanço bloqueado.
- Homepage com um profissional: espaço, profissional real, serviços reais do catálogo e convite ao agendamento. Sem profissionais fictícios ou fotos duplicadas para preencher equipe.
- Lista de espera com data independente do calendário de reserva, janela de horário, serviço/profissional selecionados e consentimento para contato manual. O banco recusa dias sem expediente compatível. Não cria hold ao se inscrever nem promete aviso automático. WhatsApp continua futuro.
- Mesmo helper financeiro no dono/cliente, SHA-256 `2746655dd8f585f09f90ae63244311c7cbec719d71c48ead5ebfb17f99a014ce`.

## Dependência do painel/banco

O único SQL da entrega está no repositório **template-barbearia-dono**, em `supabase/saas2-install.sql`. Ele reúne as quatro migrations SaaS 2.0; não executá-lo automaticamente. Revise o roteiro [ATIVACAO do dono](https://github.com/MIGUEL487/template-barbearia-dono/blob/feat/saas-2/docs/saas-2/ATIVACAO.md). Não reaplique seeds ou SQL antigo em produção.

Antes da ativação, confira nos dois builds:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://jrzabortkpouqkwndpcq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<a mesma chave pública real do projeto>
NEXT_PUBLIC_BARBERSHOP_ID=11111111-1111-1111-1111-111111111111
NEXT_PUBLIC_DEMO_MODE=false
```

Marca d’água continua independente. Os testes usaram chaves públicas fictícias; não as copie para o Cloudflare. O novo contrato SQL valida o preço/duração/buffer no servidor e cria holds de 15 minutos; sem aplicá-lo, o contrato real continua sendo o que já existe no seu Supabase.

## QA

Lint, typecheck, build com DEMO_MODE=false, tokens:check e Wrangler deploy --dry-run. Playwright em 1440/1024/820/390: escolha de zero/um/dois profissionais, quantidades, percentuais 0/50/100/33,33, calendário ao lado dos horários, timezone diferente, criação de hold e inscrição consentida sem hold automático. Todas as requests de escrita foram interceptadas em fixtures.

Hero em 1920/1366/390/360: 239 frames sequenciais, reverso, pin, wheel rápido, gesto longo, CTA direto, teclado e alternativa de movimento reduzido. Homepage em desktop/celular com um profissional e serviço de fixture: quatro painéis, marquee funcionando, sem overflow. Prints/resultados em `evidencias/`, `hero/` e `landing/`.

Testes locais não comprovam as variáveis reais, o SQL aplicado ou a entrega em produção. A URL de preview e o status do deployment devem ser copiados do Cloudflare; não são inferidos do push.

## Rollback

Use uma branch a partir da master atual e reverta somente os commits deste trabalho em ordem inversa, teste e faça merge/push normal. Não use force push ou apague branches. Não reverta alterações posteriores de outros trabalhos. A tag registra a base anterior; não é uma instrução para resetar o histórico.

Git não reverte o Supabase. Tabelas novas são aditivas; preservar dados e o contrato seguro é preferível a restaurar SQL antigo que ignorava buffers ou validava mal horários. Para restaurar funções, use backup das definições do banco real com revisão, sem recalcular depósitos históricos. Veja o [ROLLBACK do dono](https://github.com/MIGUEL487/template-barbearia-dono/blob/feat/saas-2/docs/saas-2/ROLLBACK.md).
