# Procedimento de Rollback e Segurança — Redesign V3

**Data:** 03/11/2026  
**Branch de trabalho:** `redesign/v3-correcoes`  
**Tag de partida intacta:** `pre-v3-20261102` (commit `fc0deb0`)  
**Branch Master:** 100% INTACTA (sem nenhum commit novo, sem merge)

---

## 1. Como reverter totalmente as alterações (Restaurar o estado anterior)

Se por qualquer motivo for necessário voltar ao estado anterior à execução do V3:

### Opção A: Descartar a branch `redesign/v3-correcoes` e voltar para a tag
```bash
# 1. Certifique-se de que não há arquivos soltos não commitados
git reset --hard
git clean -fd

# 2. Checkout na branch master limpa
git checkout master

# 3. Se desejar recriar a branch a partir da tag oficial de segurança
git branch -D redesign/v3-correcoes
git checkout -b redesign/v3-correcoes pre-v3-20261102
```

### Opção B: Reverter commits específicos mantendo o histórico
```bash
# Reverte os commits de v3 mantendo o histórico de auditoria
git revert --no-edit aa85220..HEAD
```

---

## 2. Kill-Switch de Emergência (Desligar 3D instantaneamente)

Para desligar o modelo 3D sem precisar de rollback de código ou recompilação complexa:

1. No arquivo `src/components/landing/sections.tsx`, a renderização do componente `<Global3DScene />` é controlada pela verificação de WebGL e pode ser silenciada definindo:
   ```ts
   // Para desativar temporariamente o 3D, comente a linha:
   // <Global3DScene />
   ```
2. Ou via variável de ambiente no Cloudflare Pages:
   ```bash
   NEXT_PUBLIC_DISABLE_3D=true
   ```
   O componente `Global3DScene` checa `process.env.NEXT_PUBLIC_DISABLE_3D === 'true'` e retorna `null` imediatamente, sem inicializar Three.js, shaders ou carregamento de GLB. O layout do site se reorganiza sem qualquer falha visual.

---

## 3. Garantias de Isolamento de Infraestrutura

- **Master:** A branch `master` não recebeu nenhum push e não foi alterada.
- **Produção:** Nenhum comando `wrangler deploy` ou publicação em produção foi executado.
- **Supabase:** Nenhuma gravação, mutação ou exclusão foi feita no banco de dados do Supabase. Todos os testes de QA rodaram com rede interceptada e mock de integridade.
- **Repositório do Dono:** O repositório `template-barbearia-dono` não foi tocado.
