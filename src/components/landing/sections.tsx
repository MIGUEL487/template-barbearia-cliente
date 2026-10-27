import { ReviewCarousel } from "./review-carousel";
import { PhotoWatermark } from "@/components/demo-watermark";
import { Faq } from "./faq";
import Image from "next/image";
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
      <div className="gallery-stage">
        <div
          className="gallery-rail"
          tabIndex={0}
          role="region"
          aria-label="Galeria do espaço, use as setas para rolar"
        >
          {[
            ["interior", "Luz que desenha o espaço"],
            ["detalhe", "Precisão em cada detalhe"],
          ].map(([src, title], i) => (
            <figure className="gallery-piece" key={i}>
              <div className="reveal-mask">
                <Image
                  src={`/demo/auto-stilo/${src}.svg`}
                  width={src === "interior" ? 1600 : 960}
                  height={1200}
                  alt={title + " — ilustração de apresentação"}
                />
                {i === 0 && <PhotoWatermark />}
              </div>
              <figcaption>
                {title}
                <small>Ilustração · foto real em breve</small>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
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
            Horários: a confirmar com o proprietário.
            <br />
            Informação disponível: terça a partir das 09h.
          </p>
          <a
            className="cta"
            href="https://www.google.com/maps/search/?api=1&query=Barbearia+Auto+Stilo+Monte+Si%C3%A3o"
          >
            Ver rota no mapa ↗
          </a>
        </div>
        <iframe
          title="Localização da Barbearia Auto Stilo"
          src="https://www.google.com/maps?q=Rua+do+Tanque+395+Monte+Siao+MG&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
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
      <footer className="site-footer">
        <div>
          <p>Auto Stilo · Barbearia</p>
          <p>{shop.city}</p>
          <Link href="/meu-agendamento">Consultar meu agendamento</Link>
        </div>
        <p>
          Versão de apresentação. Preços, equipe e serviços de exemplo. Horários
          completos e Instagram a confirmar.
        </p>
      </footer>
    </>
  );
}
