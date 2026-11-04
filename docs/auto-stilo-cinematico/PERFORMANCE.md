# Medições locais, não produção

Lighthouse mobile no build estático local: performance 96, acessibilidade 100, LCP 1353,23 ms, CLS 0, TBT 172,5 ms. INP de campo não disponível: TBT não equivale a INP. Medição final com header fixo. Uma rodada anterior sem concorrência de testes obteve 99/100 e TBT 58,5 ms; resultados locais variam com a carga da máquina. JSON final incluído.

Sem interação: 1 frame carregado/decodificado, orçamento 11 no mobile. Poster mobile 115244 bytes. Soma de TODO JavaScript da landing estimada com gzip: 317764 bytes; poster+JS=433008 bytes, acima da referência ~400 KB. Servidor HTTP local serve sem compressão e total inicial inclui fontes/imagens das seções; não confundir esta estimativa com transferência medida no Cloudflare. Não foram reprocessados os frames para forçar o orçamento. Ainda é necessário medir compressão/cache no preview e INP com uso real.

Não declaro a meta de produção atingida. Os 183 frames antigos e assets de experimentos remotos foram preservados conforme instrução; podem ser revisados depois. ZIPs originais ficam fora de public.
