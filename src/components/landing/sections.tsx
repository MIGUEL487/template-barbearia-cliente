import { ReviewCarousel } from "./review-carousel";
import { ShopImage } from "./shop-image";
import { ShopVideos } from "./shop-videos";
import {ContactMap} from "./contact-map";
import { Faq } from "./faq";
import Link from "next/link";
import { shop } from "@/config/demo";
export function Proof() {
  return (
    <section className="proof section" aria-label="Avaliações no Google">
      <p>
        Quem senta na cadeira,
        <br />
        volta pelo cuidado.
      </p>
      <div>
        <strong>
          {shop.rating}
          <span aria-label="5 estrelas">★★★★★</span>
        </strong>
        <p>
          {shop.reviews} avaliações no Google · informação do briefing
        </p>
      </div>
      <p className="demo-note">Demonstração de apresentação</p>
    </section>
  );
}
export function Gallery() {
  return (
    <>
    <section id="galeria" className="section gallery-section">
      <div className="section-heading">
        <h2>
          Entre.
          <br />
          Fique à vontade.
        </h2>
        <p>
          Concreto, luz e personalidade.
          <br />
          Um espaço com a nossa assinatura.
        </p>
      </div>
      <figure className="space-window"><ShopImage name="espaco" alt="Interior Auto Stilo: balcão preto, piso claro e teto de LEDs"/><svg viewBox="0 0 400 200" aria-hidden="true"><path className="hex-line" d="M40 20 L100 20 L130 72 L100 124 L40 124 L10 72 Z M130 72 L190 72 L220 124 L190 176 L130 176 L100 124" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="800"/></svg><figcaption>O espaço Auto Stilo · Monte Sião</figcaption></figure>
      <div className="gallery-stage">
        <div
          className="gallery-rail"
          tabIndex={0}
          role="region"
          aria-label="Galeria do espaço, use as setas para rolar"
        >
          {([
            ["acabamento", "O cuidado de perto", "Acabamento com máquina durante o atendimento"],
          ] as const).map(([name, title, alt]) => (
            <figure className="gallery-piece" key={name}>
              <div className="reveal-mask"><ShopImage name={name} alt={alt} /></div>
              <figcaption>{title}<small>Imagem fornecida pela Auto Stilo</small></figcaption>
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
        <h2>
          Seu horário.
          <br />
          Sem complicar.
        </h2>
        <ol>
          {[
            "Escolha o profissional",
            "Encontre seu serviço",
            "Selecione o horário",
            "Confira e confirme",
          ].map((s, i) => (
            <li key={s}>
              <span>{i + 1}</span>
              <h3>{s}</h3>
            </li>
          ))}
        </ol>
        <Link className="text-link" href="/agendar">
          Começar meu agendamento
        </Link>
      </section>
      <section id="contato" className="section contact-section">
        <h2>
          Nos vemos
          <br />
          na Auto Stilo.
        </h2>
        <div>
          <address>{shop.address}</address>
          <a href={shop.whatsapp}>{shop.phone}</a>
          <p>
            {shop.hours}
          </p>
          <a
            className="cta"
            href="https://www.google.com/maps/search/?api=1&query=Barbearia+Auto+Stilo+Monte+Si%C3%A3o"
          >
            Ver rota no mapa ↗
          </a>
        </div>
        <ContactMap />
      </section>
      <Faq />
      <section className="section final-cta">
        <h2>
          Seu próximo corte
          <br />
          começa aqui.
        </h2>
        <Link className="cta" href="/agendar">
          Escolher meu horário ↗
        </Link>
      </section>

    </>
  );
}
