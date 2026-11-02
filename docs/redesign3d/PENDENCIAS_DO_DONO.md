# PENDÊNCIAS E ORIENTAÇÕES PARA O PROPRIETÁRIO
**Projeto:** Auto Stilo Barbearia — Site do Cliente  
**Branch:** `redesign/3d-persistente`

---

## 1. O que foi Concluído de Forma 100% Autônoma

1. **Modelo 3D Fotorrealista Oficial:**
   - Geometria do arquivo real da máquina de corte limpa, suavizada e indexada em `public/3d/auto-stilo-trimmer.glb` (1.33 MB).
   - Textura original em alta resolução customizada com a identidade visual da Auto Stilo e livre de marcas de terceiros.
2. **Cena Persistente Multiestágio:**
   - A máquina acompanha a leitura da página através de 6 palcos (`hero`, `detalhe-01`, `detalhe-02`, `servicos`, `equipe`, `agendar`).
   - Zero interferência ou bloqueio de scroll (`pin: true` proibido no hero, sem `normalizeScroll`).
   - Desativação automática do Lenis na tela de agendamento (`/agendar` e `/meu-agendamento`) para garantir 100% de precisão nativa ao clicar em datas e horários.
3. **Validação Automatizada:**
   - Todos os 15 testes de qualidade (T1 a T15) aprovados com sucesso.
   - Build de produção Next.js estático executado sem qualquer erro.

---

## 2. Ações Recomendadas para o Dono (Quando Acordar / Revisão Final)

1. **Aprovação Visual das Evidências:**
   - Prancha com os 8 ângulos de aprovação de estúdio: `docs/redesign3d/evidencias/02-stills/stills_aprovacao_consolidado.png`.
   - Captura da Home Page com a máquina integrada: `docs/redesign3d/evidencias/06-gravacoes/01_home_producao_3d_persistente.png`.
   - Laboratório interativo de visualização 3D: acesse a rota `/lab/3d` para alternar entre os 10 marcos e rotacionar a máquina em tempo real.
2. **Merge para Master:**
   - Uma vez revisada a branch `redesign/3d-persistente`, basta fazer o merge na `master` e promover para a produção do Cloudflare Pages.
