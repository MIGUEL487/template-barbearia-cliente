# INVENTÁRIO E ARQUITETURA DO NOVO PLAYER DE VÍDEOS (FASE 5)

Data: 02/11/2026  
Projeto: Auto Stilo — Redesign V3  
Componente: `src/components/landing/shop-videos.tsx`

---

## 1. Inventário dos Vídeos Existentes

| Arquivo de Vídeo | Resolução / Aspecto | Peso | Descrição / Uso |
| :--- | :---: | :---: | :--- |
| `public/media/auto-stilo/visita.mp4` | 720x1280 (Vertical 9:16) | ~1.8 MB | Registro do espaço interno, recepção e atmosfera da barbearia. |
| `public/media/auto-stilo/em-atendimento.mp4` | 720x1280 (Vertical 9:16) | ~848 KB | Detalhe de atendimento real com toalha quente, navalhete e corte. |

*Nota:* Ambos os vídeos originais foram rigorosamente mantidos. Nenhum arquivo foi removido ou alterado.

---

## 2. Nova Arquitetura do Player Único de Alta Definição

### 2.1 Buffer Duplo A/B (Zero Tela Preta)
- Dois elementos `<video>` montados em simultâneo (`videoA` e `videoB`).
- Enquanto o vídeo ativo reproduz no buffer frontal, o próximo vídeo é pré-carregado no buffer secundário.
- A transição ocorre somente quando `readyState >= 3` (HAVE_FUTURE_DATA) é atingido, aplicando um crossfade suave de opacidade (250 ms) via transição CSS acelerada por hardware.

### 2.2 Playlist Automática & Loop Infinito
- Quando o evento `ended` é disparado pelo vídeo em reprodução, o player alterna automaticamente para o próximo vídeo da lista.
- Ao alcançar o último vídeo, retorna de forma contínua para o índice inicial (`01 / 02`).

### 2.3 Controles Acessíveis Personalizados
- Os controles nativos do navegador (`controls`) foram desativados em todos os navegadores.
- Adicionados botões dedicados e estilizados no padrão editorial da marca:
  - **Vídeo Anterior (`aria-label="Vídeo anterior"`):** Ícone chevron esquerdo.
  - **Pausar / Reproduzir (`aria-label="Pausar / Reproduzir vídeo"`):** Ícone contextual Play/Pause com `aria-pressed`.
  - **Próximo Vídeo (`aria-label="Próximo vídeo"`):** Ícone chevron direito.
  - **Áudio / Silenciar (`aria-label="Ativar / Silenciar som"`):** Controle de volume com persistência por sessão.
  - **Indicador de Trilha (`aria-live="polite"`):** Exibe `01 / 02 · Uma visita à Auto Stilo`.

### 2.4 Gerenciamento Inteligente de Recursos
- **IntersectionObserver:** Pausa a reprodução automaticamente quando o player está fora da viewport (< 35% de visibilidade). Ao reentrar na tela, retoma a reprodução apenas se o usuário não tiver clicado manualmente em pausa.
- **Visibilidade da Aba:** Pausa imediata ao alternar de aba (`document.hidden`).
- **Acessibilidade:** Suporte a navegação por teclado (`Tab`, `Enter`, `Espaço`), estados `:focus-visible` evidentes e respeito imediato a `prefers-reduced-motion`.
