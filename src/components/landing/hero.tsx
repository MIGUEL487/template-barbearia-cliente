"use client";

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useMotionEnabled } from '@/components/motion-preferences';
import { ShopImage } from './shop-image';

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const motionEnabled = useMotionEnabled();

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    if (!motionEnabled) {
      // Reduced motion: immediate reveal
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-eyebrow, .hero-display-title, .hero-lead, .hero-actions, .hero-meta-strip',
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.7,
          ease: 'power3.out',
          clearProps: 'transform',
        }
      );

      gsap.fromTo(
        '.hero-visual-card',
        { opacity: 0, scale: 0.98, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          delay: 0.15,
          ease: 'power3.out',
          clearProps: 'transform',
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, [motionEnabled]);

  return (
    <section ref={rootRef} className="hero-studio-3d" aria-label="Apresentação da Barbearia Auto Stilo">
      <div className="hero-studio-container">
        <div className="hero-studio-grid">
          {/* Coluna Esquerda: Cópia e Chamada Editorial */}
          <div className="hero-copy-col">
            <div className="hero-eyebrow">
              <span className="hero-bullet" />
              <span>Auto Stilo · Monte Sião, MG</span>
            </div>

            <h1 className="hero-display-title">
              Seu estilo. Sua <span className="hero-title-accent">assinatura.</span>
              <span className="hero-title-secondary">Precisão em cada detalhe.</span>
            </h1>

            <p className="hero-lead">
              Experiência autoral de barbearia com pontualidade rigorosa, atendimento com tempo reservado e acabamento de alta costura.
            </p>

            <div className="hero-actions">
              <Link className="hero-btn-primary" href="/agendar">
                <span>Agendar Horário</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
              <a className="hero-btn-outline" href="#servicos">
                Conhecer Serviços
              </a>
            </div>

            <div className="hero-meta-strip">
              <span className="hero-meta-item">
                <span className="hero-bullet" /> R. do Tanque, 395 · Monte Sião
              </span>
              <span className="hero-meta-item">
                <span className="hero-bullet" /> Horário reservado sem filas
              </span>
              <span className="hero-meta-item">
                <span className="hero-bullet" /> Ter–Sáb das 09h às 19h
              </span>
            </div>
          </div>

          {/* Coluna Direita: Composição Visual e Fotografia Editorial */}
          <div className="hero-visual-col">
            <div className="hero-visual-card">
              <div className="hero-photo-wrapper">
                <ShopImage
                  name="espaco"
                  alt="Espaço sofisticado da Barbearia Auto Stilo em Monte Sião com poltronas anatômicas"
                  priority
                />
              </div>

              <div className="hero-visual-badge">
                <span className="hero-badge-tag">MONTE SIÃO · MG</span>
                <span className="hero-badge-title">CORTE · BARBA · ALTA COSTURA</span>
              </div>

              {/* Slot para o modelo 3D procedural da máquina de corte (Fase 4) */}
              <div id="hero-3d-anchor" className="hero-3d-slot" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>

      {/* Faixa Marquee de Separação de Alta Precisão (Scroll Livre) */}
      <div className="hero-marquee-strip" aria-label="Auto Stilo, corte, barba e estilo">
        <div className="hero-marquee-track">
          <span>• CORTE • BARBA • ESTILO • AUTO STILO • MONTE SIÃO • ALTA COSTURA • PONTUALIDADE • </span>
          <span>• CORTE • BARBA • ESTILO • AUTO STILO • MONTE SIÃO • ALTA COSTURA • PONTUALIDADE • </span>
          <span>• CORTE • BARBA • ESTILO • AUTO STILO • MONTE SIÃO • ALTA COSTURA • PONTUALIDADE • </span>
          <span>• CORTE • BARBA • ESTILO • AUTO STILO • MONTE SIÃO • ALTA COSTURA • PONTUALIDADE • </span>
        </div>
      </div>
    </section>
  );
}
