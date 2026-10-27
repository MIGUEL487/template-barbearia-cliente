# Registro de Decisões de Arquitetura (ADR) — Barbearia Template (Cliente)

## Decisões Tomadas

### D1: Aplicação Pública com Acesso Somente Leitura via Views e RPCs
- **Decisão:** O repositório cliente utiliza **estritamente a chave anônima pública (anon key)** do Supabase.
- **Regra:** O site público **nunca** executa queries diretas em tabelas com PII (`customers`, `bookings`, `payments`).
- **Acesso:** Feito exclusivamente por:
  - Views públicas: serviços ativos, barbeiros ativos, configurações do site, galeria, FAQ, depoimentos;
  - RPCs transacionais: `get_availability`, `create_booking_hold`, `get_booking_by_token`, `cancel_booking_by_token`, `reschedule_booking_by_token`.

### D2: Experiência Visual e Design System
- **Decisão:** Estilo escuro sofisticado com cartões grafite de borda fina, destaque violeta (`#A78BFA`), botão forte `#7C3AED`, tipografia com títulos em serifa elegante e corpo sans-serif geométrico legível.
- **Tokens:** Definidos em `design-tokens.css` para permitir personalização de cor, fonte e logo diretamente por barbearia sem alterar o código-fonte.
- **Acessibilidade:** Suporte total a `prefers-reduced-motion`, contraste WCAG AA e navegação completa por teclado.

### D3: Fluxo de Agendamento Resiliente com Hold Temporário
- **Decisão:** Wizard em 4 etapas (Profissional → Serviços → Horário → Checkout).
- **Hold:** Criação de reserva provisória com contagem regressiva visual. Tratamento amigável e automático de conflito de concorrência.

### D4: Gestão do Agendamento pelo Cliente sem Necessidade de Login
- **Decisão:** O cliente consulta, cancela e reagenda através de token temporário recebido na confirmação (e-mail/WhatsApp).

---

## Decisões Pendentes / Configuráveis por Instalação
- `{{NOME}}`: Nome comercial da barbearia.
- `{{DOMINIO}}`: Domínio do cliente (ex.: `barbearia.com.br`).
- `{{COR_ACCENT}}`: Padrão inicial violeta (`#A78BFA`), botão forte `#7C3AED`.

## Redesign Black
Dark-only: nenhum seletor de tema existente. Display condensado Bebas Neue + corpo Manrope, arquivos locais via next/font/local. Tokens canônicos idênticos nos dois repositórios.

## Versão final e Workers
Next 15.5.28 + React 19.3.1 + Framer Motion 14.7.0; OpenNext 1.20.13 no painel. Migração autorizada pela continuação do trabalho após identificar os alertas legados. Cookies do servidor são assíncronos. O cliente continua estático e a API de dados mantém views/RPCs. Audit final sem vulnerabilidades conhecidas; isso não substitui testes RLS/pagamento em banco demo autorizado.

## Refinamento editorial
A direção monumental condensada foi substituída por Fraunces/Manrope. H1 público 42px no móvel e até 68px no desktop; peso 400, cor neutra, line-height 1.15. A paleta e superfícies passam a preto/cinza; foco e ação principal preservam violeta. A tipografia da UI administrativa permanece sans.
