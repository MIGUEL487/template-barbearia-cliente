# Pendências e Recomendações para o Dono da Barbearia

Este documento reúne itens que dependem exclusivamente de decisões administrativas, contratuais ou de credenciais do proprietário da barbearia Auto Stilo.

---

## 1. Direitos Autorais e Licença do Modelo 3D

- **Identificação do Modelo Base:** O modelo 3D importado continha no arquivo fonte DAE/OBJ referências geométricas a um aparador profissional de cabelo.
- **Tratamento Realizado:**
  - O atlas de texturas que continha marcas nominais de terceiros foi **completamente descartado**.
  - Não há nenhuma marca registrada, logotipo, texto ou insígnia de terceiros na malha ou nos materiais do arquivo final `public/3d/auto-stilo-trimmer.glb`.
  - Foram gerados 6 materiais físicos PBR procedurais customizados (Aço Cirúrgico, Cromo Polido, Polímero Negro Grafite, Borracha de Empunhadura, Alavanca Dark Gunmetal e Respiro Preto Fosco).
- **Ação recomendada ao Dono:** Se o modelo for proveniente de marketplace 3D (ex: CGTrader, TurboSquid, Sketchfab), certifique-se de arquivar a licença comercial de uso livre de royalties para fins de documentação da empresa.

---

## 2. Endereço e Dados de Contato Oficiais

- O mapa integrado e o cartão de fallback utilizam o endereço:
  `Praça Cel. Paiva de Castro, 10 - Centro, Monte Sião - MG, 37580-000`
- O link de rota rápida direciona para o Google Maps com as coordenadas da praça central de Monte Sião.
- **Ação recomendada ao Dono:** Confirmar se o número e ponto de referência são os oficiais ou se deve ser ajustado para outra localização.

---

## 3. Privacidade e Carregamento do Mapa (LGPD)

- **Implementação Realizada:** O mapa do Google Maps **não** é carregado no primeiro segundo da página. Ele aguarda via `IntersectionObserver` até o usuário rolar a menos de 800px da seção de Contato.
- Isso previne que o Google insira cookies de rastreamento em usuários que visitam apenas a página inicial e melhora drasticamente o Core Web Vitals (LCP < 1.2s).
- **Ação recomendada ao Dono:** Incluir na Política de Privacidade do site menção ao uso do Google Maps na seção de localização.

---

## 4. Variáveis de Ambiente no Cloudflare Pages

Para o ambiente de **Preview** ou futura promoção para produção, configure no painel do Cloudflare (Settings → Environment Variables):

| Variável | Finalidade | Status Atual |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase | Usado pelo fluxo de agendamento |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave pública anônima do Supabase | Usado para RPCs e horários |
| `NEXT_PUBLIC_BARBERSHOP_ID` | Identificador da unidade Auto Stilo | Define o estabelecimento |
| `NEXT_PUBLIC_DEMO_MODE` | Modo demonstração (`true`/`false`) | `true` para previews sem gravação real |
| `NEXT_PUBLIC_DISABLE_3D` | Flag de emergência para desligar 3D | Opcional (padrão ativo) |

---

## 5. Substituição Futura de Fotografias

- As faixas decorativas com textos promocionais genéricos ("PRECISÃO E ACABAMENTO", "ATELIER MONTE SIÃO", "QUALIDADE COMPROVADA") foram **removidas**, conferindo um visual limpo e editorial.
- As fotografias reais do espaço físico da barbearia (`public/images/shop/espaco.webp`, `ambiente.webp`, etc.) continuam intactas.
- Caso o dono queira trocar as fotos no futuro por novas sessões de fotografia, basta substituir os arquivos na mesma resolução mantendo os nomes originais.
