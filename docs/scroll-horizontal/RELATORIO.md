# Correção do scroll cinematográfico

Base e backup: b3c7c16e2fd5d9d48a012d365c79b495f201a999, tag remota backup/pre-scroll-horizontal-20261104. Branch fix/cinematic-scroll-horizontal; destino master conforme instrução do usuário, main preservada. Mudança funcional/visual desta rodada isolada no commit 4077df58a412bddd701d591d26d43404abc86fd0.

## Diagnóstico e correções

| Antes | Depois |
| --- | --- |
| Header fixo sempre visível sobre o filme | Oculto desde o HTML/CSS inicial; classe past-cinema depende do progresso real do pin; transição 240 ms opacidade/translate reversível |
| Trabalho repetido para o mesmo índice e desenho duplicado ao decodificar | Atualização apenas ao mudar o índice; um desenho por conclusão; resize ignora dimensões idênticas |
| Decode com falha podia ser repetido continuamente | Índice com falha não é novamente decodificado na mesma sessão |
| Nenhum Lenis ativo nesta landing | Uma instância, um callback GSAP ticker, autoRaf=false, syncTouch=false; cleanup ao sair da rota; rotas SaaS mantêm scroll nativo |
| Scrub 350 ms sem integração de suavização | Lenis lerp 0,14 e scrub curto de 150 ms; sem suavização de toque artificial |
| Equipe em lista estática após o catálogo | Jornada horizontal pinada, vertical→horizontal nos dois tamanhos, reversível; fallback vertical reduced motion |
| Animação genérica também atingia títulos cinematográficos | Exclusão de .cinema e .team-journey no observador genérico |
| Navegação substituía URL e descartava query | Preserva pathname/search ao atualizar hash; evita diagnóstico congelado |

O teste touch inicialmente acusou progresso congelado no objeto debug; a transformação real continuava avançando. A causa desse falso resultado era a remoção de ?debug-hero pela navegação. Não mantive um loop extra para contornar o diagnóstico.

## Dados e limites

Somente public_barbers(id,name,bio,avatar_url) da loja configurada. Fotos usam o mesmo BarberPhoto existente; nomes/bios vêm do banco, não de mocks ou especialidades inventadas. Sem configuração, lista vazia ou erro, introdução e CTA permanecem úteis; não surgem profissionais falsos. Consulta de serviços original preservada e separada da equipe. Sem alteração de agendamento, autenticação, Supabase/RPC/SQL/RLS, tokens, fontes ou painel do dono. Sem dependências novas: GSAP 3.15.0 e Lenis 1.3.27 já estavam instalados.

O painel do dono tinha alterações locais anteriores; não foi modificado nem publicado nesta rodada.

## Validação

Lint, typecheck, build NEXT_PUBLIC_DEMO_MODE=false e tokens:check passaram. Wrangler deploy --dry-run passou. Testes locais em 1920×1080, 1366×768, 820×1180, 390×844 e 360×800: header oculto/revelado/reverso, Lenis único, pin horizontal em 5/50/95%, retorno e saída sem overflow, reduced motion e rotas de reserva. Regressão do Hero nos dez marcos para frente/para trás, orçamento de bitmaps e touch/rotação/teclado também testados. Evidências e scripts acompanham o repositório.

Lighthouse local de produção: performance 97, acessibilidade 100, LCP 1351.91 ms, CLS 0, TBT 121.5 ms. Isto não mede INP de campo nem garante 60fps em todo celular físico. Nada foi gravado em Supabase; o teste sem credenciais exercita os dois painéis de introdução/CTA, não confirma os dados reais de profissionais em produção.

## Publicação e limites do ambiente

Fluxo existente: push master → Cloudflare Workers Builds. Não realizar deploy manual concorrente. Rede desta sessão não inclui api.github.com, api.cloudflare.com nem workers.dev; não há connector de deploy Cloudflare disponível. Por isso não é possível atestar conclusão do build remoto nem abrir a URL publicada nesta sessão. Push/merge e confirmação de deploy são estados separados; conferir o SHA no deployment antes de considerar produção validada.

## Skills

Usadas: ui-animations (inclusive timing-and-easing), motion-design e web-animation-design. webapp-testing orienta validação com navegador. animate foi lida e não usada: seu catálogo local depende de caminhos macOS que não correspondem ao site. apple-design foi consultada, sem apresentar auditoria HIG ou alegar validação nativa. Inventário das demais skills verificadas consta no relatório cinematográfico anterior; não foram executados scanners Strix nem scripts de terceiros. GSAP/Lenis são bibliotecas, não skills.

Validação de toque horizontal real (CDP touchStart/touchMove/touchEnd), retorno e foco de teclado passou após a correção da query de debug. Transformação horizontal e progresso foram conferidos separadamente. Merge autorizado pelo prompt desta rodada na master; confirmação de deploy continua dependente da plataforma.
