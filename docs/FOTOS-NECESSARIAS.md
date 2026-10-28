# Fotos disponíveis e distribuição sem repetição

Cada fotografia é exibida em um único local da página. AVIF/WebP e tamanhos responsivos são versões do mesmo arquivo, não espaços adicionais. O logo e os frames do hero são identidades/representações da mesma mídia, não novas fotografias.

| Espaço | Foto atual | Fotos novas necessárias |
| --- | --- | --- |
| Hero | Sequência de atendimento fornecida; poster é o primeiro frame | 0 |
| Assinatura, foto em arco | `corte-nuca` | 0 |
| Ritual, três textos sobre uma única foto | `corte-perfil` | 0 |
| História | `reconhecimento` | 0 |
| Espaço, foto principal | `espaco` | 0 |
| Galeria, único cartão complementar | `acabamento` | 0 |
| Vídeo “Uma visita à Auto Stilo” | `visita.mp4` e seu poster exclusivo | 0 |
| Vídeo “O cuidado durante o atendimento” | `em-atendimento.mp4` e seu poster exclusivo | 0 |
| Equipe, profissional 01 | Placeholder com iniciais | 1 retrato autorizado |
| Equipe, profissional 02 | Placeholder com iniciais | 1 retrato autorizado |
| Avaliações | Sem fotografia; texto e controles existentes | 0 |

Para completar os espaços existentes: **2 fotos novas**, uma por profissional, com os nomes e autorização de uso. A galeria foi reduzida de quatro cartões complementares para um; as três imagens removidas já aparecem em outras seções. Para voltar a ter quatro cartões, envie **3 fotos adicionais diferentes**. São 5 novas fotos no total se quiser completar a equipe e ampliar novamente a galeria. Uma fachada limpa pode ser uma dessas três imagens adicionais.

Não foram duplicadas fotos para preencher espaços, nem alterados arquivos originais. `scripts/qa-visual-bugs.mjs` registra imagens selecionadas pelo navegador, `source` responsivos, posters e vídeos no relatório de cada viewport; agrupa os tamanhos/formatos de uma mesma foto para detectar repetição entre espaços.
