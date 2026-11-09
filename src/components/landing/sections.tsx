"use client";
import {RegionalText,useRegional} from '@/components/regional/provider';
import { ReviewCarousel } from "./review-carousel";
import { ShopImage } from "./shop-image";
import { ShopVideos } from "./shop-videos";
import {ContactMap} from "./contact-map";
import { Faq } from "./faq";
import Link from "next/link";
import { shop } from "@/config/demo";
export function Proof() {
const {t}=useRegional();

  return (
    <section className="proof section" aria-label={t("Avaliações no Google")}>
      <p><RegionalText text="Quem senta na cadeira,"/><br /><RegionalText text="volta pelo cuidado."/></p>
      <div>
        <strong>
          {shop.rating}
          <span aria-label={t("5 estrelas")}>★★★★★</span>
        </strong>
        <p>
          {shop.reviews}<RegionalText text="avaliações no Google · informação do briefing"/></p>
      </div>
      <p className="demo-note"><RegionalText text="Demonstração de apresentação"/></p>
    </section>
  );
}
export function Gallery() {
const {t}=useRegional();

  return (
    <>
    <section id="galeria" className="section gallery-section">
      <div className="section-heading">
        <h2><RegionalText text="Entre."/><br /><RegionalText text="Fique à vontade."/></h2>
        <p><RegionalText text="Concreto, luz e personalidade."/><br /><RegionalText text="Um espaço com a nossa assinatura."/></p>
      </div>
      <figure className="space-window"><ShopImage name="espaco" alt={t("Interior da barbearia: bancadas e iluminação profissional")}/><svg viewBox="0 0 400 200" aria-hidden="true"><path className="hex-line" d="M40 20 L100 20 L130 72 L100 124 L40 124 L10 72 Z M130 72 L190 72 L220 124 L190 176 L130 176 L100 124" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="800"/></svg><figcaption><RegionalText text="O espaço · Barbearia Modelo"/></figcaption></figure>
      <div className="gallery-stage">
        <div
          className="gallery-rail"
          tabIndex={0}
          role="region"
          aria-label={t("Galeria do espaço, use as setas para rolar")}
        >
          {([
            ["tesoura-detalhe", "O cuidado de perto", "Detalhe do corte com tesoura e acabamento manual"],
            ["barba-cabelo-lateral", "Alinhamento e simetria", "Corte de cabelo e alinhamento de barba finalizados"],
            ["degrade-desenho-folha", "Arte e estilo", "Degradê personalizado com arte exclusiva"],
          ] as const).map(([name, title, alt]) => (
            <figure className="gallery-piece" key={name}>
              <div className="reveal-mask"><ShopImage name={name} alt={alt} /></div>
              <figcaption>{title}<small><RegionalText text="Ambiente de demonstração"/></small></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
    <ShopVideos />
    </>
  );
}
export function Reviews() {
  return <ReviewCarousel />;
}
export function Details() {
  return (
    <>
      <section className="section how-section">
        <h2><RegionalText text="Seu horário."/><br /><RegionalText text="Sem complicar."/></h2>
        <ol>
          {[
            "Escolha o profissional",
            "Encontre seu serviço",
            "Selecione o horário",
            "Confira e confirme",
          ].map((s, i) => (
            <li key={s}>
              <span>{i + 1}</span>
              <h3><RegionalText text={s}/></h3>
            </li>
          ))}
        </ol>
        <Link className="text-link" href="/agendar"><RegionalText text="Começar meu agendamento"/></Link>
      </section>
      <section id="contato" className="section contact-section">
        <h2><RegionalText text="Nos vemos"/><br /><RegionalText text="na cadeira."/></h2>
        <div>
          <address>{shop.address}</address>
          <a href={shop.whatsapp}>{shop.phone}</a>
          <p>
            {shop.hours}
          </p>
          <a
            className="cta"
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.name + " " + shop.address)}`}
          ><RegionalText text="Ver rota no mapa ↗"/></a>
        </div>
        <ContactMap />
      </section>
      <Faq />
      <section className="section final-cta">
        <h2><RegionalText text="Seu próximo corte"/><br /><RegionalText text="começa aqui."/></h2>
        <Link className="cta" href="/agendar"><RegionalText text="Escolher meu horário ↗"/></Link>
      </section>

    </>
  );
}
