"use client";

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotionEnabled, MotionToggle } from '@/components/motion-preferences';
import { ShopImage } from './shop-image';
import { BrandLogo } from '@/components/brand-logo';

export function Signature() {
  return (
    <section id="assinatura" className="section signature-editorial">
      <div className="editorial-container">
        <div className="editorial-header" data-3d-avoid="true">
          <div className="editorial-meta">
            <span className="meta-index">01</span>
            <span className="meta-separator">{'//'}</span>
            <span className="meta-title">DIRETRIZ DA MARCA</span>
          </div>
          <h2 className="editorial-headline" data-3d-avoid="true">
            Cuidado que tem a sua <span className="headline-italic">assinatura.</span>
          </h2>
          <p className="editorial-subhead" data-3d-avoid="true">
            Um momento para renovar o corte, alinhar a barba e sair revigorado. Cada detalhe foi concebido para entregar pontualidade, privacidade e conforto sem concessões.
          </p>
          <div className="editorial-action" data-3d-avoid="true">
            <Link className="editorial-link" href="#historia">
              <span>Conheça a história e proposta</span>
              <span className="editorial-link-arrow">↓</span>
            </Link>
          </div>
        </div>

        <div className="editorial-visual" data-3d-stage="detalhe-01">
          <figure className="editorial-photo-wrapper">
            <div className="photo-crop">
              <ShopImage name="corte-nuca" alt="Acabamento de corte e alinhamento milimétrico visto de trás" />
            </div>
            
          </figure>
        </div>

        <div className="editorial-pillars" data-3d-avoid="true">
          {[
            {
              num: '01',
              title: 'Seu horário, sem espera',
              desc: 'Agenda com reservas de tempo dedicadas e pontualidade rigorosa para o seu dia a dia.',
            },
            {
              num: '02',
              title: 'Conforto em cada visita',
              desc: 'Poltronas anatômicas, iluminação cênica e ambientação sonora cuidadosamente selecionada.',
            },
            {
              num: '03',
              title: 'Precisão nos detalhes',
              desc: 'Técnicas de navalha tradicional, toalhas aquecidas e cosmética masculina de alto padrão.',
            },
          ].map((item) => (
            <div className="pillar-row" key={item.num} data-3d-avoid="true">
              <span className="pillar-num">{item.num}</span>
              <div className="pillar-content">
                <h3 className="pillar-title">{item.title}</h3>
                <p className="pillar-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Ritual() {
  const ref = useRef<HTMLElement>(null);
  const enabled = useMotionEnabled();

  useEffect(() => {
    if (!enabled) return;
    const element = ref.current;
    if (!element) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const steps = element.querySelectorAll('.ritual-step');
      gsap.set(steps, { autoAlpha: 0, y: 30 });
      gsap.set(steps[0], { autoAlpha: 1, y: 0 });
      element.classList.add('ritual-active');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: element,
          start: () => `top ${parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 0}px`,
          end: () => `+=${innerHeight * 2}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      for (let i = 1; i < steps.length; i++) {
        tl.to(steps[i - 1], { autoAlpha: 0, y: -24, duration: 0.35 }, i - 0.4).fromTo(
          steps[i],
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.45 },
          i - 0.05
        );
      }

      tl.fromTo(
        '.ritual-photo',
        { scale: 0.95, rotation: -1 },
        { scale: 1.05, rotation: 1, duration: 3, ease: 'none' },
        0
      ).fromTo(
        '.razor-line',
        { strokeDashoffset: 600 },
        { strokeDashoffset: 0, duration: 3, ease: 'none' },
        0
      );
    }, ref);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('auto-stilo-header-resize', refresh);

    return () => {
      window.removeEventListener('auto-stilo-header-resize', refresh);
      ctx.revert();
      element.classList.remove('ritual-active');
    };
  }, [enabled]);

  return (
    <section ref={ref} className="ritual" aria-label="Nosso ritual em três etapas">
      <div className="ritual-grid">
        <div className="ritual-photo" data-3d-stage="detalhe-02">
          <ShopImage name="corte-perfil" alt="Detalhe de corte, acabamento e barba bem cuidada" />
          <div className="photo-grain-overlay" aria-hidden="true" />
        </div>

        <div className="ritual-words" data-3d-avoid="true">
          {[
            [
              '01',
              'Acolhida & Diagnóstico',
              'A conversa vem primeiro. Analisamos o formato do rosto, tipo de fio e o seu estilo para criar um desenho sob medida.',
            ],
            [
              '02',
              'Corte & Barboterapia',
              'Precisão no corte à tesoura, alinhamento na navalha e toalha vaporizada para relaxamento absoluto da pele.',
            ],
            [
              '03',
              'Finalização de Autor',
              'O toque final com pomadas de fixação natural, óleo hidratante e alinhamento milimétrico para durar semanas.',
            ],
          ].map(([num, title, copy]) => (
            <div className="ritual-step" key={title} data-3d-avoid="true">
              <div className="step-badge">
                <span className="step-badge-num">ETAPA {num}</span>
                <span className="step-badge-sep">/</span>
                <span>03</span>
              </div>
              <h2>{title}</h2>
              <p>{copy}</p>
            </div>
          ))}
        </div>

        <svg viewBox="0 0 600 80" className="razor-svg" aria-hidden="true">
          <path
            className="razor-line"
            d="M8 60 Q180 2 300 40 T592 24"
            fill="none"
            stroke="url(#violet-blade-gradient)"
            strokeWidth="2.5"
            strokeDasharray="600"
          />
          <defs>
            <linearGradient id="violet-blade-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7B61FF" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#A78BFA" stopOpacity="1" />
              <stop offset="100%" stopColor="#7B61FF" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
}

export function History() {
  return (
    <section id="historia" className="section history-editorial">
      <div className="history-container">
        <div className="history-badge">
          <span>02 {'//'} TRADIÇÃO &amp; ATENÇÃO</span>
        </div>
        <div className="history-grid">
          <figure className="history-figure" data-3d-stage="equipe">
            <ShopImage name="reconhecimento" alt="Reconhecimento e certificados de barbearia recebidos pela Auto Stilo" />
            
          </figure>

          <div className="history-narrative" data-3d-avoid="true">
            <h2 className="history-title" data-3d-avoid="true">
              Seu estilo.<br />
              Nossa <span className="headline-italic">atenção.</span>
            </h2>
            <p className="history-p" data-3d-avoid="true">
              A Auto Stilo nasceu para resgatar o momento de cuidar de si como uma experiência de pausa, estilo e bem-estar. Não somos uma linha de produção: cada cadeira é um espaço de atendimento individual.
            </p>
            <p className="history-p-secondary" data-3d-avoid="true">
              Combinamos o rigor da barbearia tradicional à estética contemporânea, criando cortes duradouros e barbas com desenho impecável.
            </p>

            <div className="history-milestones" data-3d-avoid="true">
              {[
                { title: 'Conhecer o seu estilo', desc: 'Entendimento personalizado das suas preferências e rotina.' },
                { title: 'Cuidar de cada detalhe', desc: 'Execução técnica apurada da raiz às pontas da barba.' },
                { title: 'Receber você outra vez', desc: 'Relacionamento de confiança contínuo a cada visita.' },
              ].map((m) => (
                <div className="milestone-item" key={m.title} data-3d-avoid="true">
                  <div className="milestone-dot" />
                  <div className="milestone-text">
                    <h4>{m.title}</h4>
                    <p>{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="signature-script">Auto Stilo — Precisão em cada detalhe.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function MarqueeFooter() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => el.classList.toggle('running', e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div ref={ref} className="marquee-wrapper" aria-label="Corte, barba, estilo, Auto Stilo">
        <div className="marquee-border-top" />
        {[0, 1].map((i) => (
          <div className="marquee-window" key={i}>
            <div className="marquee-track" style={{ animationDirection: i ? 'reverse' : 'normal' }}>
              <span>✦ CORTE · BARBA · ESTILO · AUTO STILO · MONTE SIÃO ✦ </span>
              <span aria-hidden="true">✦ CORTE · BARBA · ESTILO · AUTO STILO · MONTE SIÃO ✦ </span>
            </div>
          </div>
        ))}
        <div className="marquee-border-bottom" />
      </div>

      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-top">
            <Link className="footer-brand" href="/" aria-label="Auto Stilo, início">
              <BrandLogo tone="dark" />
              <div className="footer-brand-text">
                <span className="brand-name">Auto Stilo</span>
                <span className="brand-sub">Atelier de Barbearia</span>
              </div>
            </Link>

            <nav className="footer-nav" aria-label="Links do rodapé">
              <Link href="/agendar" className="footer-nav-link primary">
                Agendar horário
              </Link>
              <Link href="/meu-agendamento" className="footer-nav-link">
                Consultar meu agendamento
              </Link>
              <a href="#servicos" className="footer-nav-link">
                Catálogo
              </a>
              <a href="#equipe" className="footer-nav-link">
                Profissionais
              </a>
              <a href="#contato" className="footer-nav-link">
                Localização
              </a>
            </nav>

            <div className="footer-motion-control">
              <MotionToggle />
            </div>
          </div>

          <div className="footer-divider" />

          <div className="footer-bottom">
            <p className="footer-copy">
              © {new Date().getFullYear()} Auto Stilo Barbearia · R. do Tanque, 395 – Bela Vista, Monte Sião – MG.
            </p>
            <p className="footer-credits">
              Design & Engenharia com Three.js, GSAP e Lenis
            </p>
          </div>
        </div>
        <div className="barber-stripe" aria-hidden="true" />
      </footer>
    </>
  );
}
