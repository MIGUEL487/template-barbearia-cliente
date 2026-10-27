import { PhotoWatermark } from "@/components/demo-watermark";
import Image from "next/image";
import Link from "next/link";
import { shop } from "@/config/demo";
export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-bottom">
        <div className="hero-copy">
          <p className="hero-location">Barbearia em {shop.city}</p>
          <h1 id="hero-title">
            Estilo.
            <br />
            Sem igual.
          </h1>
          <p>
            Corte, barba e cuidado nos detalhes.
            <br />
            Um tempo para você, em Monte Sião.
          </p>
          <div className="actions">
            <Link className="cta" href="/agendar">
              Agendar horário
            </Link>
            <a className="text-link" href={shop.whatsapp}>
              Chamar no WhatsApp
            </a>
          </div>
        </div>
        <figure className="hero-art">
          <div className="ambient-loop">
            <Image
              src="/demo/auto-stilo/interior.svg"
              width={1600}
              height={1200}
              priority
              alt="Ilustração do espaço da Auto Stilo"
            />
          </div>
          <PhotoWatermark />
          <figcaption>
            O espaço Auto Stilo · ilustração de apresentação
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
