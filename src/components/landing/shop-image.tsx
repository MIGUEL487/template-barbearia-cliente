import { PhotoWatermark } from "@/components/demo-watermark";

export interface OptimizedPhoto {
  file: string;
  width: number;
  height: number;
  defaultAlt: string;
}

export const TEMPLATE_PHOTOS = {
  // 4 Imagens genéricas de exemplo para o template de barbearia
  "interior": {
    file: "01_barbearia_interior.webp",
    width: 1448,
    height: 1086,
    defaultAlt: "Ambiente e ambientação interna da barbearia",
  },
  "servicos": {
    file: "02_corte_closeup.webp",
    width: 1448,
    height: 1086,
    defaultAlt: "Detalhe e acabamento de corte profissional",
  },
  "equipe": {
    file: "03_barbeiro_retrato.webp",
    width: 1448,
    height: 1086,
    defaultAlt: "Barbeiro profissional pronto para o atendimento",
  },
  "lounge": {
    file: "04_recepcao_lounge.webp",
    width: 1448,
    height: 1086,
    defaultAlt: "Recepção e espaço lounge de acolhimento",
  },

  // Mapeamentos de compatibilidade semânticos com as seções do site
  "espaco": {
    file: "01_barbearia_interior.webp",
    width: 1448,
    height: 1086,
    defaultAlt: "Ambiente moderno e sofisticado da barbearia",
  },
  "teto-hexagonal": {
    file: "01_barbearia_interior.webp",
    width: 1448,
    height: 1086,
    defaultAlt: "Iluminação e estrutura contemporânea da barbearia",
  },
  "interior-recepcao": {
    file: "04_recepcao_lounge.webp",
    width: 1448,
    height: 1086,
    defaultAlt: "Recepção aconchegante e área de espera",
  },
  "recepcao": {
    file: "04_recepcao_lounge.webp",
    width: 1448,
    height: 1086,
    defaultAlt: "Recepção e lounge de atendimento",
  },
  "acabamento": {
    file: "02_corte_closeup.webp",
    width: 1448,
    height: 1086,
    defaultAlt: "Precisão nos detalhes e acabamento artesanal",
  },
  "maquina-acabamento": {
    file: "02_corte_closeup.webp",
    width: 1448,
    height: 1086,
    defaultAlt: "Técnica e precisão no alinhamento do corte",
  },
  "tesoura-detalhe": {
    file: "02_corte_closeup.webp",
    width: 1448,
    height: 1086,
    defaultAlt: "Cuidado e técnica no corte com tesoura",
  },
  "toalha-barba": {
    file: "02_corte_closeup.webp",
    width: 1448,
    height: 1086,
    defaultAlt: "Ritual clássico e cuidado dedicado",
  },
  "social-corte-classico": {
    file: "01_barbearia_interior.webp",
    width: 1448,
    height: 1086,
    defaultAlt: "Tradição, estilo e cuidado artesanal",
  },
  "barba-cabelo-lateral": {
    file: "02_corte_closeup.webp",
    width: 1448,
    height: 1086,
    defaultAlt: "Alinhamento e simetria no corte e barba",
  },
  "degrade-nuca": {
    file: "02_corte_closeup.webp",
    width: 1448,
    height: 1086,
    defaultAlt: "Degradê e acabamento milimétrico",
  },
  "degrade-desenho-folha": {
    file: "02_corte_closeup.webp",
    width: 1448,
    height: 1086,
    defaultAlt: "Estilo personalizado e atendimento com excelência",
  },
  "barbeiro-selfie": {
    file: "03_barbeiro_retrato.webp",
    width: 1448,
    height: 1086,
    defaultAlt: "Profissional dedicado ao seu estilo",
  },
  "reconhecimento": {
    file: "03_barbeiro_retrato.webp",
    width: 1448,
    height: 1086,
    defaultAlt: "Excelência e tradição na barbearia",
  },
} as const;

// Aliases para retrocompatibilidade
export const AUTO_STILO_PHOTOS = TEMPLATE_PHOTOS;

export type ShopPhotoName = keyof typeof TEMPLATE_PHOTOS;

export function ShopImage({
  name,
  alt,
  priority = false,
  className = "",
}: {
  name: ShopPhotoName;
  alt?: string;
  priority?: boolean;
  className?: string;
}) {
  const photo = TEMPLATE_PHOTOS[name] || TEMPLATE_PHOTOS["interior"];
  const altText = alt || photo.defaultAlt;

  return (
    <div className={`shop-image ${className}`}>
      <picture>
        <source
          media="(max-width: 768px)"
          srcSet={`/img/template/mobile/${photo.file}`}
          type="image/webp"
        />
        <img
          src={`/img/template/full/${photo.file}`}
          width={photo.width}
          height={photo.height}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          alt={altText}
        />
      </picture>
      <PhotoWatermark />
    </div>
  );
}
