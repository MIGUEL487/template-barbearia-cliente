"use client";
import {RegionalText,useRegional} from '@/components/regional/provider';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShopImage } from './shop-image';
import { useMotionEnabled } from '@/components/motion-preferences';
import Link from 'next/link';

export function Immersive() {
const {t}=useRegional();

  const ref = useRef<HTMLElement>(null);
  const enabled = useMotionEnabled();

  useEffect(() => {
    if (!enabled) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.immersive-image').forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 40, rotation: i ? 1 : -1, scale: 0.98 },
          {
            y: -24,
            rotation: 0,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.4,
            },
          }
        );
      });
    }, ref);
    return () => ctx.revert();
  }, [enabled]);

  return (
    <section ref={ref} id="assinatura" className="section immersive">
      {/* Coluna 1, Linha 1 */}
      <div id="galeria" className="immersive-heading">
        <p><RegionalText text="Barbearia Modelo · Espaço &amp; Tradição"/></p>
        <h2><RegionalText text="Entre."/><br /><RegionalText text="Fique à vontade."/></h2>
        <p><RegionalText text="O espaço, o cuidado e a atenção aos detalhes que definem cada visita."/></p>
      </div>

      {/* Coluna 2, Linha 1 */}
      <figure className="immersive-image">
        <ShopImage
          name="interior"
          alt={t("Ambiente e estrutura contemporânea da barbearia")}
        />
        <figcaption><RegionalText text="Design acolhedor e atmosfera de atendimento exclusivo."/></figcaption>
      </figure>

      {/* Coluna 1, Linha 2 */}
      <figure className="immersive-image immersive-detail">
        <ShopImage
          name="servicos"
          alt={t("Precisão artesanal e acabamento técnico no corte")}
        />
        <figcaption><RegionalText text="Precisão artesanal, do desenho ao acabamento."/></figcaption>
      </figure>

      {/* Coluna 2, Linha 2: Cartão editorial para preencher a coluna vazia com equilíbrio visual */}
      <div className="immersive-story">
        <p className="immersive-story-eyebrow"><RegionalText text="Atmosfera &amp; Precisão"/></p>
        <h3><RegionalText text="O equilíbrio entre tradição artesanal e conforto contemporâneo."/></h3>
        <p><RegionalText text="Cada detalhe do nosso espaço foi concebido para transformar seu atendimento em uma pausa genuína. Iluminação técnica que valoriza cada traço do corte, navalha com fio impecável e ambiente planejado para quem valoriza pontualidade e excelência."/></p>
        <div className="immersive-story-badges">
          <span><RegionalText text="Hora marcada"/></span>
          <span><RegionalText text="Ambiente climatizado"/></span>
          <span><RegionalText text="Atendimento individual"/></span>
        </div>
        <Link className="text-link" href="/agendar"><RegionalText text="Agendar horário no espaço ↗"/></Link>
      </div>
    </section>
  );
}
