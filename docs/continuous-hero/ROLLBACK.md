# Rollback desta rodada

Backup: backup/pre-continuous-hero-20261104 → eb8f662a90593ca2941711befc631a826fc5e5b5.
Código isolado: a4f8642cef4f161f7e5a06adcf1c529c4723790e.

Após merge por fast-forward:

```sh
git fetch origin
git switch master
git merge --ff-only origin/master
git revert a4f8642cef4f161f7e5a06adcf1c529c4723790e
git push origin master
```

O revert restaura o código anterior desta rodada, preservando SaaS, dados e histórico. Testes/docs adicionados podem continuar no repo; os testes antigos foram adaptados à política nova e podem precisar voltar junto para reproduzir exatamente a bateria antiga. Se houver mudanças posteriores conflitantes, resolvê-las preservando-as e rodar checks antes de push. Sem reset/force/SQL.

Cloudflare: Workers & Pages → template-barbearia-cliente → Deployments → conferir deployment anterior por commit eb8f662 → Rollback. Não posso afirmar que esse deployment existe/era o ativo sem confirmação da plataforma. Nada disso altera Supabase ou painel do dono.
