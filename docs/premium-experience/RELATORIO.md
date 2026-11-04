# Auto Stilo — refinamento visual do cliente

Base: 7c9ffcee908c7665f483af0383e46dc4eca19254. Branch feat/premium-experience. Backup remoto: backup/pre-premium-experience-20261104. Código: 3c8af2c + 38fb079. Destino master; main preservada.

## Entrega

- Transição Hero → marquee → imersão vertical. Marquee usa Cinzel, textos reais da marca/cidade, duas cópias equivalentes para loop contínuo, pausa fora da tela/aba e apresentação estática em reduced-motion. Sem scroll extra, novo pin ou dependência.
- Fundo inicial discretamente mais escuro, logo e CTA principal continuam centrados. Removido o link Agendar sem esperar. O botão Versão sem animação fica visualmente oculto, aparecendo somente quando recebe foco por teclado; seu handler acessível foi preservado.
- Artefato: havia branco em gradientes legados (.final-cta) e no fundo dos componentes de marca d'água fora do contêiner da landing. Removi a transição clara do CTA final e dei fundo grafite ao body/rodapé/badge apenas nas rotas escuras. Marcas de demonstração preservadas. Hero fica sem máscara/sombra/filtro de borda; não alego ter identificado um frame de gravação que não foi anexado nesta rodada.
- Horizontal: imagens maiores, proporções editoriais, deslocamento vertical e escala 0,98→1,03 sincronizados ao containerAnimation, títulos e marcadores de progressão. PinSpacing, prioridades e scrub direto anteriores preservados; não foi reintroduzido atraso do trilho.
- Agendamento e consulta de reserva: identidade grafite, Cinzel/Outfit locais já disponíveis, etapas com hierarquia, cards com foto/seleção, campos e calendário escuros, horários com contraste, resumo em superfície própria, ação fixa com confirmação legível e geometria testada em 360px. Loading usa a versão branca da logo; controles de seleção continuam 24×24, sem alongamento.

A máquina de estados que exige o frame 239 realmente desenhado foi mantida. Nenhuma alteração em use-live-booking, disponibilidade, preços, holds, validações, RPCs, Supabase, autenticação ou banco. Sem instalação de dependências e sem reprocessar fotos/frames.

## Validação

- Lint, TypeScript, build DEMO_MODE=false e tokens:check passaram (contrato de tokens original intacto).
- qa-premium-booking: profissional → serviço → calendário e dias indisponíveis → horário → formulário → hold, com assert dos parâmetros RPC; desktop 1440, tablet 820 e celular 390, em fusos diferentes.
- qa-premium-ui: profissional, serviço, calendário e confirmação em 1440/390/360; confirma hold fictício e que a ação não sai do viewport.
- Consulta /meu-agendamento com token e resposta fictícios em 1440/390, sem overflow.
- qa-premium-landing: logo/CTA, extras ocultos, marquee em movimento, horizontal e Ritual sem sobreposição, footer sem vazamento claro; desktop/mobile.
- qa-hero-gate: quatro viewports, 477 desenhos adjacentes (239 ida + 238 volta), tentativas rápidas de wheel/End/toque sem ultrapassar antes do desenho final, sem scroll acumulado, CTA e alternativa estática por teclado.

Build de QA usou DEMO_MODE=false e DEMO_WATERMARK=true, URL pública conhecida e chave pública fictícia. Todas as chamadas Supabase foram interceptadas; nenhum hold real foi criado. Google Maps também foi simulado nos testes locais. As variáveis de Cloudflare não foram alteradas. Prints e JSONs em booking/, booking-calendar/, landing/ e hero-gate/.

## Limites e publicação

Testes não equivalem a reserva real no banco ou homologação em aparelho físico. Publicação segue Git → Cloudflare, sem deploy manual paralelo. Hash de Git será conferido, mas checks/deploy e URL publicada não podem ser confirmados por este ambiente (API GitHub/Cloudflare e workers.dev indisponíveis). Não confundir push concluído com deploy concluído.

## Skills

Reutilizadas high-end-visual-design, ui-animations, motion-design, web-animation-design e webapp-testing, já lidas nesta conversa. Inventário das demais disponíveis/ausentes permanece em docs/auto-stilo-cinematico/RELATORIO.md. Não executei scripts desconhecidos ou scanners Strix para uma alteração visual.
