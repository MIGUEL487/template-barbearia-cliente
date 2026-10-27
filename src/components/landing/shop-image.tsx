import { PhotoWatermark } from "@/components/demo-watermark";

const media = {
  espaco: { width: 1360, height: 1020, widths: [480, 960, 1360] },
  reconhecimento: { width: 1360, height: 1020, widths: [480, 960, 1360] },
  "corte-perfil": { width: 765, height: 1020, widths: [480] },
  "corte-nuca": { width: 765, height: 1020, widths: [480] },
  acabamento: { width: 478, height: 500, widths: [478] },
};
export function ShopImage({ name, alt, priority = false }: {
  name: keyof typeof media; alt: string; priority?: boolean;
}) {
  const item = media[name];
  const source = (ext: string) => item.widths.map(w => `/media/auto-stilo/${name}-${w}.${ext} ${w}w`).join(", ");
  return <div className="shop-image">
    <picture>
      <source type="image/avif" srcSet={source("avif")} sizes="(max-width:767px) 85vw, 50vw" />
      {/* Responsive local files: no remote optimizer required by Workers Static Assets. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/media/auto-stilo/${name}-${item.widths.at(-1)}.webp`} srcSet={source("webp")}
        sizes="(max-width:767px) 85vw, 50vw" width={item.width} height={item.height}
        loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"}
        decoding="async" alt={alt} />
    </picture>
    <PhotoWatermark />
  </div>;
}
