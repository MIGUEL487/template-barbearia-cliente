"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotionEnabled, MotionToggle } from "@/components/motion-preferences";
import { ShopImage } from "./shop-image";
import { BrandLogo } from "@/components/brand-logo";
import { shop } from "@/config/demo";

export function Signature() {
  return (
    <section id="proposta" className="section signature">
      <div>
        <p>Barbearia Modelo, no seu tempo.</p>
        <h2>
          Cuidado que<br />
          tem a sua <em>assinatura.</em>
        </h2>
        <p>
          Um momento para renovar o corte, alinhar a barba e sair se sentindo bem.
          Conheça nossa proposta de atendimento exclusivo e personalizado.
        </p>
        <Link className="text-link" href="#historia">
          Conheça a proposta ↗
        </Link>
      </div>
      <figure className="arch">
        <ShopImage
          name="lounge"
          alt="Recepção e espaço de acolhimento da barbearia"
        />
      </figure>
      <ul className="pillars">
        {[
          "Seu horário, reservado para você",
          "Conforto em cada visita",
          "Cuidado em cada detalhe",
        ].map((t) => (
          <li key={t}>
            <h3>{t}</h3>
            <p>Atendimento individualizado e ambiente climatizado.</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Ritual() {
  const ref = useRef<HTMLElement>(null);
  const enabled = useMotionEnabled();

  useEffect(() => {
    if (!enabled) return;
    const element = ref.current;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const steps = ref.current!.querySelectorAll(".ritual-step");
      gsap.set(steps, { autoAlpha: 0 });
      gsap.set(steps[0], { autoAlpha: 1 });
      ref.current!.classList.add("ritual-active");

      const tl = gsap.timeline({
        scrollTrigger: {
          id: "ritual",
          refreshPriority: 0,
          pinSpacing: true,
          trigger: ref.current,
          start: () =>
            `top ${
              parseFloat(
                getComputedStyle(document.documentElement).getPropertyValue(
                  "--header-h"
                )
              ) || 0
            }px`,
          end: () => `+=${innerHeight * 2}`,
          pin: true,
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      });

      for (let i = 1; i < steps.length; i++) {
        tl.to(
          steps[i - 1],
          { autoAlpha: 0, y: -24, duration: 0.25 },
          i - 0.4
        ).fromTo(
          steps[i],
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.4 },
          i - 0.1
        );
      }

      tl.fromTo(
        ".ritual-photo",
        { scale: 0.94, rotation: -2 },
        { scale: 1.05, rotation: 2, duration: 3, ease: "none" },
        0
      ).fromTo(
        ".razor-line",
        { strokeDashoffset: 600 },
        { strokeDashoffset: 0, duration: 3 },
        0
      );
    }, ref);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("auto-stilo-header-resize", refresh);
    return () => {
      window.removeEventListener("auto-stilo-header-resize", refresh);
      ctx.revert();
      element?.classList.remove("ritual-active");
    };
  }, [enabled]);

  return (
    <section ref={ref} className="ritual" aria-label="Nosso ritual em três etapas">
      <div className="ritual-grid">
        <div className="ritual-photo">
          <ShopImage
            name="servicos"
            alt="Ritual de precisão, toalha quente e acabamento"
          />
        </div>
        <div className="ritual-words">
          {[
            [
              "Acolhimento.",
              "A conversa vem primeiro. O seu estilo e o seu momento orientam o cuidado.",
            ],
            [
              "Precisão.",
              "Precisão no desenho, atenção no acabamento. Um ritual pensado para você.",
            ],
            [
              "Resultado.",
              "O cuidado está nos detalhes. Pronto para seguir o dia com uma nova assinatura.",
            ],
          ].map(([title, copy], i) => (
            <div className="ritual-step" key={title}>
              <p>Ritual de atendimento · etapa {i + 1} de 3</p>
              <h2>{title}</h2>
              <p>{copy}</p>
            </div>
          ))}
        </div>
        <svg viewBox="0 0 600 80" aria-hidden="true">
          <path
            className="razor-line"
            d="M8 60 Q180 2 300 40 T592 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="600"
          />
        </svg>
      </div>
    </section>
  );
}

export function History() {
  return (
    <section id="historia" className="section history">
      <figure>
        <ShopImage
          name="interior"
          alt="Ambiente clássico com bancadas e iluminação profissional"
        />
      </figure>
      <div>
        <h2>
          Seu estilo.<br />
          Nossa atenção.
        </h2>
        <p>Um espaço pensado para cuidar de você, do corte ao detalhe.</p>
        <p>
          Dedicação contínua ao ofício da barbearia artesanal. Cada cliente recebe
          atendimento individual com foco no resultado e no respeito ao seu tempo.
        </p>
        <ol className="timeline">
          {[
            "Compreender seu estilo e preferência",
            "Cuidar de cada detalhe com técnica apurada",
            "Garantir satisfação e pontualidade",
          ].map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ol>
        <p className="signature-script">Barbearia Modelo, por inteiro.</p>
      </div>
    </section>
  );
}

export function MarqueeFooter() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current!;
    const io = new IntersectionObserver(([e]) =>
      el.classList.toggle("running", e.isIntersecting)
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div
        ref={ref}
        className="marquee"
        aria-label="Corte, barba, estilo, Barbearia Modelo"
      >
        {[0, 1].map((i) => (
          <div className="marquee-window" key={i}>
            <div
              className="marquee-track"
              style={{ animationDirection: i ? "reverse" : "normal" }}
            >
              <span>CORTE · BARBA · ESTILO · BARBEARIA MODELO · </span>
              <span aria-hidden="true">
                CORTE · BARBA · ESTILO · BARBEARIA MODELO · 
              </span>
            </div>
          </div>
        ))}
      </div>
      <footer className="site-footer">
        <Link className="footer-brand-mark" href="/" aria-label="Barbearia Modelo, início">
          <BrandLogo tone="dark" />
        </Link>
        <p className="footer-wordmark">Barbearia Modelo.</p>
        <div>
          <Link href="/agendar">Agendar horário</Link>
          <Link href="/meu-agendamento">Consultar agendamento</Link>
          <Link href="/politica-de-privacidade">Privacidade (LGPD)</Link>
          <Link href="/termos-de-uso">Termos de Uso</Link>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("open-cookie-preferences"))}
            className="text-text-muted hover:text-white transition-colors underline cursor-pointer"
          >
            Configurações de cookies
          </button>
          <MotionToggle />
        </div>
        <p>
          {shop.address} · WhatsApp {shop.phone} · Horário: {shop.hours}
        </p>
        <div className="barber-stripe" aria-hidden="true" />
      </footer>
    </>
  );
}
