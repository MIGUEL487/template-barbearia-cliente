# Desfazer somente o refinamento visual do cliente

Backup: backup/pre-premium-experience-20261104 → 7c9ffcee908c7665f483af0383e46dc4eca19254.

Em checkout limpo:

```sh
git fetch origin
git switch master
git merge --ff-only origin/master
git revert 38fb079
git revert 3c8af2c
git push origin master
```

Reverte os commits de runtime desta rodada, preservando histórico e os 239 frames/gate anteriores. Testes/docs podem permanecer. Se mudanças posteriores conflitarem, preservá-las ao resolver e repetir os checks. Sem reset/force push e sem banco.

Cloudflare: Workers & Pages → template-barbearia-cliente → Deployments → localizar o deployment anterior pelo commit 7c9ffce e conferir seu estado antes de Rollback. A plataforma não foi acessível para confirmar esse deployment.
