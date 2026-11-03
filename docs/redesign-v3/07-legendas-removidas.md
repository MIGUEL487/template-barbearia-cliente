# INVENTÁRIO DE LEGENDAS E FAIXAS DECORATIVAS REMOVIDAS (FASE 7.1)

Data: 02/11/2026  
Projeto: Auto Stilo — Redesign V3  
Regra de Limpeza: Remoção de tags, tarjas e legendas artificiais que poluíam as fotografias reais. O texto informativo relevante foi preservado no atributo `alt` das imagens.

---

## 1. Tabela de Ocorrências Removidas

| Arquivo Original | Linhas | Texto / Elemento Removido | Motivo da Remoção | Destino do Conteúdo Informativo |
| :--- | :---: | :--- | :--- | :--- |
| `src/components/landing/editorial.tsx` | 40–44 | `<figcaption className="photo-caption">` com `PRECISÃO E ACABAMENTO` e `ATELIER MONTE SIÃO` | Faixa decorativa artificial cobrindo o rodapé da fotografia do artesão/barbeiro. | Preservado no `alt`: *"Retrato em preto e branco do profissional da Auto Stilo com navalha de precisão"*. |
| `src/components/landing/editorial.tsx` | 209–213 | `<figcaption className="history-caption">` com `QUALIDADE COMPROVADA` e `Monte Sião · Minas Gerais` | Tarja artificial sobreposta à foto de tesoura e pente de madeira. | Preservado no `alt`: *"Ferramentas tradicionais de barbearia: tesoura de corte fino e pente de madeira"*. |
| `src/components/landing/hero.tsx` | 108–111 | `<div className="hero-visual-badge">` com `MONTE SIÃO · MG` e `CORTE · BARBA · ALTA COSTURA` | Selo flutuante artificial sobre a foto principal do salão. | O endereço e serviços já constam no texto principal do Hero e no cabeçalho. |
| `src/components/landing/sections.tsx` | 58–64 | `<span className="caption-coord">[ 22°25'42"S · 46°34'18"W ]</span>` | Coordenadas mono decorativas estilo ficção científica/IA. | Removido em favor de tipografia editorial limpa e elegante. |

---

## 2. Verificação de Integridade

- Nenhuma fotografia foi deletada ou substituída por imagens de inteligência artificial.
- As fotografias reais mantêm enquadramento natural com `object-fit: cover` e proporções preservadas.
- Todas as tags `<img>` / `<ShopImage>` mantiveram atributos `alt` completos e informativos para leitores de tela e SEO.
