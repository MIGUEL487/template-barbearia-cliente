import { PhotoWatermark } from "@/components/demo-watermark";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { shop } from "@/config/demo";
export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="cursor-light" aria-hidden="true" />
      <div className="hero-top">
        <p>Barbearia em {shop.city}</p>
        <p>R. do Tanque, 395</p>
      </div>
      <h1 id="hero-title">Auto Stilo</h1>
      <div className="hero-bottom">
        <div>
          <h2>
            Estilo.
            <br />
            Sem igual.
          </h2>
          <p>
            Corte, barba e cuidado nos detalhes.
            <br />
            Um tempo para você, em Monte Sião.
          </p>
          <div className="actions">
            <Link className="cta" href="/agendar">
              Agendar horário{" "}
              <ArrowUpRight size={20} strokeWidth={1.5} aria-hidden="true" />
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
              alt="Ilustração do espaço inspirada no teto de LEDs hexagonais"
            />
          </div>
          <PhotoWatermark />
          <figcaption>
            O espaço Auto Stilo · ilustração de apresentação
          </figcaption>
        </figure>
      </div>
      <div className="hero-foot">
        <span>Precisão no corte. Presença no estilo.</span>
        <a href="#servicos">Explore a experiência ↓</a>
      </div>
    </section>
  );
}
