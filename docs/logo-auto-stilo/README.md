# Logo Auto Stilo — aplicação no site e favicon

Aplicada a marca enviada como referência: monograma AS, assinatura Auto Stilo e duas coroas roxas, sem o disco branco anterior. As matrizes PNG foram preparadas a partir da referência visual do chat; não são arquivos vetoriais. Arquivos de trabalho em `assets/brand/`, exportações web em `public/brand/auto-stilo/`.

- Cabeçalho branco: desenho preto com coroas roxas, caixa de 48×48px, sem fundo ou recorte circular. Header mantém 81px nos três tamanhos testados.
- Rodapé preto: desenho branco com coroas roxas. O componente `BrandLogo` recebe `tone="dark"` conforme a superfície, independentemente do tema do aparelho.
- Favicon SVG adaptativo: desenho preto no tema claro do navegador e branco no escuro; coroas roxas nos dois. PNGs 16/32/48/128, ICO 16/32/48 e ícone Apple 180 preparados como alternativas. O SVG contém imagens raster embutidas, não uma vetorização da marca.
- Removido `src/app/icon.png`, que gerava uma declaração automática do ícone antigo. Os novos caminhos de favicon evitam reutilizar o caminho antigo da logo circular.

## Verificação

Build de produção local com demo e marca d'água ativos. Typecheck, lint, build, tokens e espaçamento passaram. Playwright/Chromium com rolagem real em 1440×900, 1366×768 e 390×844: cabeçalho e rodapé inspecionados, nenhuma rolagem horizontal, zero erros de console, fontes corretas e arquivos de ícone acessíveis. SVG renderizado nos dois temas e pixels conferidos: preto no claro, branco no escuro, pixels roxos presentes e fundo transparente em ambos.

[Marca e favicon no claro](marca-e-favicon-light.png) · [Marca e favicon no escuro](marca-e-favicon-dark.png) · [Dados](results.json)

| Tamanho | Cabeçalho | Rodapé |
| --- | --- | --- |
| 1440×900 | [captura](1440-header.jpg) | [captura](1440-footer.jpg) |
| 1366×768 | [captura](1366-header.jpg) | [captura](1366-footer.jpg) |
| 390×844 | [captura](390-header.jpg) | [captura](390-footer.jpg) |

`node scripts/prepare-brand.mjs` recria as exportações locais a partir das matrizes; não utiliza rede ou geração de imagem no build. Para repetir o QA no preview local de produção: `node scripts/qa-brand.mjs`.

Marquee, Ritual, agendamento, tokens e Cloudflare permanecem sem mudanças funcionais. Escopo desta entrega: `template-barbearia-cliente`. O painel do dono não foi alterado. Não houve deploy manual. A aba real do navegador, Safari/iOS físico e a publicação após o push não foram validados; as evidências mostram o SVG renderizado e as declarações de ícones no Chromium local.
