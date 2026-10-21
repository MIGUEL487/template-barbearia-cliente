# Registro de Decisões de Arquitetura (ADR) — Barbearia Template (Cliente)

## Decisões Tomadas

### D1: Aplicação Pública com Acesso Somente Leitura via Views e RPCs
- **Decisão:** O repositório cliente utiliza **estritamente a chave anônima pública (anon key)** do Supabase.
- **Regra:** O site público **nunca** executa queries diretas em tabelas com PII (`customers`, `bookings`, `payments`).
- **Acesso:** Feito exclusivamente por:
  - Views públicas: serviços ativos, barbeiros ativos, configurações do site, galeria, FAQ, depoimentos;
  - RPCs transacionais: `get_availability`, `create_booking_hold`, `get_booking_by_token`, `cancel_booking_by_token`, `reschedule_booking_by_token`.

### D2: Experiência Visual e Design System
- **Decisão:** Estilo escuro sofisticado com cartões grafite de borda fina, destaque âmbar (`#F59E0B`), tipografia com títulos em serifa elegante e corpo sans-serif geométrico legível.
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
- `{{COR_ACCENT}}`: Padrão inicial âmbar (`#F59E0B`).
