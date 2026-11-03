"use client";

import { GalleryStorytelling } from "./gallery-storytelling";
import { ReviewCarousel } from "./review-carousel";
import { ShopImage } from "./shop-image";
import { ShopVideos } from "./shop-videos";
import { ContactMap } from "./contact-map";
import { Faq } from "./faq";
import Link from "next/link";
import { shop } from "@/config/demo";

export function Proof() {
  return (
    <section className="proof section" aria-label="Avaliações no Google">
      <div className="proof-container">
        <p className="proof-statement">
          Quem senta na cadeira,<br />
          retorna pela <span className="headline-italic">precisão.</span>
        </p>
        <div className="proof-stats">
          <strong className="rating-score">
            {shop.rating}
            <span className="rating-stars" aria-label="5 estrelas">★★★★★</span>
          </strong>
          <p className="rating-count">
            {shop.reviews} avaliações no Google · Informação do atelier
          </p>
        </div>
      </div>
    </section>
  );
}

export function Gallery() {
  return (
    <>
      <GalleryStorytelling />
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
      <section className="section how-editorial">
        <div className="section-container">
          <div className="section-eyebrow">
            <span className="eyebrow-index">06</span>
            <span className="eyebrow-sep">{'//'}</span>
            <span>COMO FUNCIONA</span>
          </div>

          <div className="how-header">
            <h2 className="how-title">
              Seu horário reservado.<br />
              <span className="headline-italic">Sem filas, sem complicação.</span>
            </h2>
          </div>

          <div className="how-steps-grid">
            {[
              {
                step: '01',
                title: 'Escolha o profissional',
                desc: 'Selecione o barbeiro da sua preferência ou opte pelo primeiro disponível.',
              },
              {
                step: '02',
                title: 'Selecione os serviços',
                desc: 'Corte, barba, barboterapia ou combos completos para a sua rotina.',
              },
              {
                step: '03',
                title: 'Defina o dia e horário',
                desc: 'Visualize os horários em tempo real no calendário dinâmico.',
              },
              {
                step: '04',
                title: 'Confirmação instantânea',
                desc: 'Receba os detalhes e lembretes com hold garantido de 15 minutos.',
              },
            ].map((s) => (
              <div className="how-step-card" key={s.step}>
                <span className="step-number">{s.step}</span>
                <h3 className="step-heading">{s.title}</h3>
                <p className="step-body">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="how-cta-center">
            <Link className="cta cta-large" href="/agendar">
              <span>Iniciar meu agendamento</span>
              <span className="cta-arrow">↗</span>
            </Link>
          </div>
        </div>
      </section>

      <section id="contato" className="section contact-editorial">
        <div className="section-container">
          <div className="section-eyebrow">
            <span className="eyebrow-index">07</span>
            <span className="eyebrow-sep">{'//'}</span>
            <span>LOCALIZAÇÃO & ATENDIMENTO</span>
          </div>

          <div className="contact-grid">
            <div className="contact-info-panel">
              <h2 className="contact-headline">
                Nos vemos na <span className="headline-italic">Auto Stilo.</span>
              </h2>
              <p className="contact-lead">
                Estamos localizados no bairro Bela Vista em Monte Sião, com fácil estacionamento e localização central.
              </p>

              <div className="contact-details-list">
                <div className="detail-row">
                  <span className="detail-label">ENDEREÇO</span>
                  <address className="detail-value">{shop.address}</address>
                </div>

                <div className="detail-row">
                  <span className="detail-label">HORÁRIO</span>
                  <span className="detail-value">{shop.hours}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">CONTATO DIRETO</span>
                  <a href={shop.whatsapp} className="detail-value whatsapp-link" target="_blank" rel="noopener noreferrer">
                    {shop.phone} · Fale pelo WhatsApp ↗
                  </a>
                </div>
              </div>

              <div className="contact-actions">
                <a
                  className="button-editorial"
                  href="https://www.google.com/maps/search/?api=1&query=Barbearia+Auto+Stilo+Monte+Si%C3%A3o"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Abrir no Google Maps ↗
                </a>
              </div>
            </div>

            <div className="contact-map-panel">
              <ContactMap />
            </div>
          </div>
        </div>
      </section>

      <Faq />

      <section className="section final-cta-editorial relative">
        <div className="section-container final-cta-container relative" data-3d-avoid="true">
          <div className="cta-glow-spot" aria-hidden="true" />
          {/* Palco 3D para apontar para o botão de agendamento final */}
          <div data-3d-stage="agendar" className="pointer-events-none absolute left-1/2 top-4 h-32 w-32 -translate-x-1/2 opacity-0" aria-hidden="true" />
          
          <h2 className="final-cta-title" data-3d-avoid="true">
            Precisão em cada detalhe.<br />
            Seu próximo corte <span className="headline-italic">começa aqui.</span>
          </h2>
          <p className="final-cta-sub" data-3d-avoid="true">
            Garanta seu horário com conveniência e experimente o padrão Auto Stilo.
          </p>
          <div className="final-cta-buttons" data-3d-avoid="true">
            <Link className="cta cta-xl" href="/agendar">
              <span>Agendar meu horário</span>
              <span className="cta-arrow">↗</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
