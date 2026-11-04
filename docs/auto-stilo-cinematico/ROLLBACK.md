# Rollback seguro

Nenhum merge desta tarefa na master ou deploy de produção foi realizado. Portanto não há hash de merge a inventar.

Backup dos arquivos locais/dependências: tag backup/pre-hero-cinematografico-20261104, commit 5412ab8. Backup da master restaurada: tag backup/master-restaurada-20261104, commit 83f23dc. Master restaurada encontrada no fetch: 83f23dc (remoto em 04/11). A branch feat/hero-cinematografico incorpora essa master e preserva a feature anterior 901fe06.

Antes de um futuro merge, registrar seu SHA real aqui. Se for um merge commit: git revert -m 1 SHA_DO_MERGE_REAL; git push origin master. Não executar o placeholder. Se fast-forward, reverter apenas commits desta tarefa em ordem reversa, sem incluir a incorporação da master ou features anteriores. Não usar reset/force. Banco não faz parte do rollback.

Cloudflare: Workers & Pages → template-barbearia-cliente → Deployments → localizar o deployment de produção anterior pelo commit 83f23dc (verificar se é realmente o anterior na hora) → Rollback. Nenhuma operação no banco, painel do dono ou main.
