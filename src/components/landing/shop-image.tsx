import { PhotoWatermark } from "@/components/demo-watermark";

export interface OptimizedPhoto {
  file: string;
  width: number;
  height: number;
  defaultAlt: string;
}

export const AUTO_STILO_PHOTOS = {
  // As 10 fotografias originais autorizadas da Auto Stilo
  "degrade-nuca": {
    file: "01_degrade-nuca.webp",
    width: 930,
    height: 1161,
    defaultAlt: "Corte degradê na nuca com acabamento milimétrico",
  },
  "social-corte-classico": {
    file: "02_social-corte-classico.webp",
    width: 1038,
    height: 1308,
    defaultAlt: "Corte social clássico realizado na Auto Stilo",
  },
  "maquina-acabamento": {
    file: "03_maquina-acabamento.webp",
    width: 1029,
    height: 1308,
    defaultAlt: "Barbeiro realizando acabamento com máquina de precisão",
  },
  "toalha-barba": {
    file: "04_toalha-barba.webp",
    width: 1029,
    height: 1299,
    defaultAlt: "Tratamento de barba com toalha quente e óleos essenciais",
  },
  "barba-cabelo-lateral": {
    file: "05_barba-cabelo-lateral.webp",
    width: 1032,
    height: 1311,
    defaultAlt: "Corte de cabelo e alinhamento de barba finalizados",
  },
  "tesoura-detalhe": {
    file: "06_tesoura-detalhe.webp",
    width: 1035,
    height: 1308,
    defaultAlt: "Detalhe artesanal do corte com tesoura",
  },
  "teto-hexagonal": {
    file: "07_teto-hexagonal.webp",
    width: 1041,
    height: 1299,
    defaultAlt: "Iluminação geométrica hexagonal no interior da Auto Stilo",
  },
  "barbeiro-selfie": {
    file: "08_barbeiro-selfie.webp",
    width: 930,
    height: 1161,
    defaultAlt: "Profissional da barbearia Auto Stilo em Monte Sião",
  },
  "interior-recepcao": {
    file: "09_interior-recepcao.webp",
    width: 1904,
    height: 1428,
    defaultAlt: "Recepção e vista interna do espaço Auto Stilo",
  },
  "degrade-desenho-folha": {
    file: "10_degrade-desenho-folha.webp",
    width: 1071,
    height: 1338,
    defaultAlt: "Degradê personalizado com arte e desenho estilizado",
  },

  // Mapeamentos de compatibilidade sem colisão/repetição
  "espaco": {
    file: "07_teto-hexagonal.webp",
    width: 1041,
    height: 1299,
    defaultAlt: "Iluminação geométrica e ambiente Auto Stilo",
  },
  "acabamento": {
    file: "03_maquina-acabamento.webp",
    width: 1029,
    height: 1308,
    defaultAlt: "Acabamento preciso com máquina",
  },
  "corte-nuca": {
    file: "01_degrade-nuca.webp",
    width: 930,
    height: 1161,
    defaultAlt: "Corte degradê na nuca",
  },
  "corte-perfil": {
    file: "04_toalha-barba.webp",
    width: 1029,
    height: 1299,
    defaultAlt: "Ritual de toalha quente e barba terapia",
  },
  "reconhecimento": {
    file: "02_social-corte-classico.webp",
    width: 1038,
    height: 1308,
    defaultAlt: "Corte social clássico e tradição",
  },
} as const;

export type ShopPhotoName = keyof typeof AUTO_STILO_PHOTOS;

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
  const photo = AUTO_STILO_PHOTOS[name] || AUTO_STILO_PHOTOS["teto-hexagonal"];
  const altText = alt || photo.defaultAlt;

  return (
    <div className={`shop-image ${className}`}>
      <picture>
        <source
          media="(max-width: 768px)"
          srcSet={`/img/fotos-otimizadas/mobile/${photo.file}`}
          type="image/webp"
        />
        <img
          src={`/img/fotos-otimizadas/full/${photo.file}`}
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
