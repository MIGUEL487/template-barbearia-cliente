# Barbearia Template — Site Público & Agendamento (`template-barbearia-cliente`)

Repositório público do sistema premium de barbearia: landing page institucional de alto padrão, carrossel de fotos, depoimentos, sobre, FAQ e wizard de agendamento online com proteção contra overbooking e hold temporário.

## Stack
- **Framework:** Next.js (App Router) + TypeScript
- **Estilização:** Tailwind CSS + Design Tokens (`design-tokens.css`)
- **Animações:** Motion (Framer Motion) com respeito a `prefers-reduced-motion`
- **Banco de Dados:** Supabase (PostgreSQL, exclusivamente via chave pública anon e RPCs)

## Instalação e Execução Local

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local

# Iniciar servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## Scripts Disponíveis
- `npm run dev`: Inicia o servidor local de desenvolvimento.
- `npm run build`: Gera o build de produção.
- `npm run lint`: Executa a verificação estática com ESLint.
- `npm run typecheck`: Validação rigorosa de tipagem com TypeScript.
- `npm test`: Executa os testes automatizados.
