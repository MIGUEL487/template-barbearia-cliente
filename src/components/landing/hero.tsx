import { ShopImage } from "./shop-image";
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
            <ShopImage name="espaco" priority alt="Recepção da Auto Stilo, com balcão preto e iluminação geométrica" />
          </div>
          <figcaption>
            O espaço Auto Stilo · Monte Sião
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
