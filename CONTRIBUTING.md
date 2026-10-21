# Contribuindo para o template-barbearia-cliente

## Convenções de Código
- **Commits:** Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`).
- **Branches:** Crie branches temáticas (`feature/`, `fix/`).
- **TypeScript:** Modo estrito (`strict: true`). Sem tipos `any` implícitos.
- **Segurança:** Nunca comitar segredos. O repositório cliente utiliza exclusivamente a anon key do Supabase.
- **Validações:** Antes de enviar um PR, assegure-se de que `npm run lint` e `npm run typecheck` passam localmente.
