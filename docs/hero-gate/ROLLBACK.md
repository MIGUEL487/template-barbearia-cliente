# Rollback apenas deste adendo

Backup: backup/pre-hero-gate-20261104 → 2db3e8f4b1c8fb37121620a518a9e44cdc55a2c5.

Após merge por fast-forward:

```sh
git fetch origin
git switch master
git merge --ff-only origin/master
git revert 520f30e
git push origin master
```

Esse único revert remove a trava e a centralização desta rodada, restaurando o comportamento de código anterior sem reescrever histórico ou afetar banco/SaaS. Se mudanças posteriores conflitarem, preservar essas mudanças ao resolver os conflitos e repetir os checks. Testes/docs adicionados podem permanecer para histórico.

Alternativa Cloudflare: Workers & Pages → template-barbearia-cliente → Deployments → localizar o deployment anterior pelo commit 2db3e8f e conferir antes de Rollback. A existência/estado desse deployment não foi verificada pelo ambiente. Nenhuma ação no Supabase ou painel do dono.
