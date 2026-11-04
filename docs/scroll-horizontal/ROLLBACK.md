# Reverter somente esta rodada

Backup: backup/pre-scroll-horizontal-20261104 → b3c7c16e2fd5d9d48a012d365c79b495f201a999.
Commit de código desta rodada: 4077df58a412bddd701d591d26d43404abc86fd0.

Após o merge por fast-forward, executar em uma árvore limpa:

```sh
git fetch origin
git switch master
git merge --ff-only origin/master
git revert 4077df58a412bddd701d591d26d43404abc86fd0
git push origin master
```

O revert desfaz apenas o código desta rodada e mantém o redesign anterior, os arquivos de evidências e alterações posteriores não conflitantes. Se existirem conflitos com futuras mudanças, resolvê-los sem apagar essas mudanças e rodar os checks antes de push. Sem reset/force push e sem comandos de banco.

Alternativa de deploy: Cloudflare → Workers & Pages → template-barbearia-cliente → Deployments → localizar o deployment de produção anterior à correção, conferindo seu commit b3c7c16 → Rollback. Confirmar primeiro que esse era o deployment ativo anterior; a existência do deployment não foi comprovada por este ambiente. Isso não altera Git ou Supabase.
