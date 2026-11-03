"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotionEnabled } from "@/components/motion-preferences";
import { ShopImage } from "./shop-image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const DETAILS = [
  {
    id: "bancadas",
    title: "01 · Bancadas & Espelhos",
    heading: "Precisão na iluminação e ergonomia",
    desc: "Bancadas em carvalho natural e espelhos com iluminação neutra de 4000K, calibrada para conferir precisão máxima a cada traço e contorno.",
    tag: "Estúdio de Corte",
  },
  {
    id: "cadeiras",
    title: "02 · Cadeiras Anatômicas",
    heading: "Conforto postural e reclinação total",
    desc: "Poltronas hidráulicas clássicas com acabamento em couro nobre, suporte lombar dedicado e reclinação perfeita para barboterapia e toalha quente.",
    tag: "Ergonomia Premium",
  },
  {
    id: "atmosfera",
    title: "03 · Atmosfera & Pausa",
    heading: "Acústica suave e ambiente intimista",
    desc: "Tratamento acústico de estúdio, música ambiente discreta e ambiente livre de ruídos ou pressa. Uma pausa real no seu dia.",
    tag: "Experiência Pessoal",
  },
];

export function GalleryStorytelling() {
  const motionEnabled = useMotionEnabled();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const imageFrameRef = useRef<HTMLDivElement>(null);
  const imageElRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const scissorsRef = useRef<SVGGElement>(null);
  const scissorBladeLeftRef = useRef<SVGPathElement>(null);
  const scissorBladeRightRef = useRef<SVGPathElement>(null);
  const razorRef = useRef<SVGGElement>(null);
  const razorBladeRef = useRef<SVGGElement>(null);

  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (!motionEnabled) return;
    const wrapper = wrapperRef.current;
    const imageEl = imageElRef.current;
    const path = pathRef.current;
    if (!wrapper || !imageEl || !path) return;

    const pathLength = path.getTotalLength();
    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      // 1. Zoom progressivo da imagem: scale(0.72) -> scale(1.0)
      tl.fromTo(
        imageEl,
        { scale: 0.72, transformOrigin: "center center" },
        { scale: 1.0, ease: "none", duration: 1 },
        0
      );

      // 2. Linha roxa ondulada (Fase 3.3): desenha entre p=0.15 e p=0.85
      tl.fromTo(
        path,
        { strokeDashoffset: pathLength },
        { strokeDashoffset: 0, ease: "none", duration: 0.70 },
        0.15
      );

      // 3. Tesoura vetorial (Fase 3.4): entra entre p=0.25 e p=0.45
      if (scissorsRef.current && scissorBladeLeftRef.current && scissorBladeRightRef.current) {
        tl.fromTo(
          scissorsRef.current,
          { opacity: 0, x: -30, y: 15 },
          { opacity: 1, x: 0, y: 0, ease: "power2.out", duration: 0.08 },
          0.23
        );
        // Articulação das lâminas (abrindo e cortando suavemente)
        tl.fromTo(
          scissorBladeLeftRef.current,
          { transformOrigin: "50px 50px", rotate: 0 },
          { transformOrigin: "50px 50px", rotate: 24, ease: "sine.inOut", duration: 0.12, yoyo: true, repeat: 1 },
          0.25
        );
        tl.fromTo(
          scissorBladeRightRef.current,
          { transformOrigin: "50px 50px", rotate: 0 },
          { transformOrigin: "50px 50px", rotate: -24, ease: "sine.inOut", duration: 0.12, yoyo: true, repeat: 1 },
          0.25
        );
        tl.to(
          scissorsRef.current,
          { opacity: 0, x: 20, ease: "power2.in", duration: 0.06 },
          0.44
        );
      }

      // 4. Navalha clássica (Fase 3.4): entra entre p=0.55 e p=0.78 com desdobramento da lâmina
      if (razorRef.current && razorBladeRef.current) {
        tl.fromTo(
          razorRef.current,
          { opacity: 0, x: 25, y: -10 },
          { opacity: 1, x: 0, y: 0, ease: "power2.out", duration: 0.08 },
          0.54
        );
        // Desdobramento suave da lâmina em torno do pivô (0° -> 155°)
        tl.fromTo(
          razorBladeRef.current,
          { transformOrigin: "15px 45px", rotate: 0 },
          { transformOrigin: "15px 45px", rotate: 150, ease: "power2.out", duration: 0.18 },
          0.56
        );
        tl.to(
          razorRef.current,
          { opacity: 0, y: 20, ease: "power2.in", duration: 0.08 },
          0.82
        );
      }
    }, wrapper);

    return () => ctx.revert();
  }, [motionEnabled]);

  const activeDetail = DETAILS[activeTab] ?? DETAILS[0]!;

  return (
    <section id="galeria" className="gallery-storytelling-section" aria-label="O Espaço & Atmosfera">
      {/* Wrapper de altura progressiva no scroll sem pin */}
      <div
        ref={wrapperRef}
        className="gallery-storytelling-wrapper"
        style={{
          position: "relative",
          minHeight: motionEnabled ? "230vh" : "auto",
        }}
      >
        <div
          ref={stickyRef}
          className="gallery-sticky-stage"
          style={{
            position: motionEnabled ? "sticky" : "relative",
            top: "var(--header-height-desktop, 64px)",
            minHeight: "calc(100svh - var(--header-height-desktop, 64px))",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "24px 20px 32px",
            overflow: "hidden",
          }}
        >
          {/* Cabeçalho Editorial com Avoid Markers */}
          <div className="gallery-editorial-header" data-story-avoid="true" data-3d-avoid="true" style={{ maxWidth: "1200px", margin: "0 auto", width: "100%", zIndex: 10 }}>
            <div className="section-eyebrow">
              <span className="eyebrow-index">05</span>
              <span className="eyebrow-sep">{"//"}</span>
              <span>O ESPAÇO &amp; ATMOSFERA</span>
            </div>

            <div className="gallery-header-split" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px", marginTop: "12px" }}>
              <h2 className="gallery-title" style={{ fontSize: "clamp(2rem, 3.8vw, 3.2rem)", lineHeight: 1.15, fontWeight: 500, margin: 0 }}>
                Entre. Fique à <span className="headline-italic">vontade.</span>
              </h2>
              <p className="gallery-desc" style={{ maxWidth: "480px", margin: 0, fontSize: "0.95rem", lineHeight: 1.6, color: "var(--text-muted, #71717A)" }}>
                Concreto aparente, iluminação pontual e acabamentos escuros. Um ambiente projetado para uma experiência de pausa e cuidado pessoal.
              </p>
            </div>
          </div>

          {/* Quadro Central de Visualização & Storytelling com Zoom Progressivo */}
          <div
            ref={imageFrameRef}
            className="gallery-view-canvas"
            style={{
              position: "relative",
              maxWidth: "1100px",
              width: "100%",
              margin: "20px auto",
              borderRadius: "var(--radius-button, 12px)",
              overflow: "hidden",
              aspectRatio: "16 / 9",
              maxHeight: "56vh",
              boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.08)",
              border: "1px solid var(--border-hairline, rgba(0, 0, 0, 0.08))",
              background: "#18181B",
            }}
          >
            {/* Imagem Real do Espaço */}
            <div
              ref={imageElRef}
              className="gallery-image-zoom-target"
              style={{
                width: "100%",
                height: "100%",
                transform: motionEnabled ? "scale(0.72)" : "scale(1.0)",
                willChange: "transform",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShopImage
                name="espaco"
                alt="Interior sofisticado da Barbearia Auto Stilo em Monte Sião com bancadas de madeira, poltronas hidráulicas e iluminação estúdio"
              />
            </div>

            {/* Linha Roxa Ondulada e Vetores SVG de Tesoura e Navalha (Fase 3.3 & 3.4) */}
            <svg
              className="gallery-story-svg"
              viewBox="0 0 1440 600"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 5,
              }}
            >
              <defs>
                <linearGradient id="purpleGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#9333EA" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#7C3AED" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#C084FC" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* Caminho Ondulado em Violeta da Marca */}
              <path
                ref={pathRef}
                d="M 60 480 C 280 490, 420 180, 720 220 C 1020 260, 1180 120, 1380 160"
                fill="none"
                stroke="url(#purpleGlow)"
                strokeWidth="2.5"
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Tesoura Vetorial Original (Opção A) */}
              <g
                ref={scissorsRef}
                transform="translate(480, 240) scale(0.7)"
                style={{ opacity: motionEnabled ? 0 : 0.85, transition: "opacity 0.2s" }}
              >
                {/* Lâmina Esquerda com Argola */}
                <path
                  ref={scissorBladeLeftRef}
                  d="M 50 50 L 15 15 C 8 8, 2 14, 8 20 L 45 52 L 20 85 C 10 92, 22 105, 30 96 L 52 58 Z"
                  fill="#E2E8F0"
                  stroke="#334155"
                  strokeWidth="1.5"
                />
                {/* Lâmina Direita com Argola */}
                <path
                  ref={scissorBladeRightRef}
                  d="M 50 50 L 85 15 C 92 8, 98 14, 92 20 L 55 52 L 80 85 C 90 92, 78 105, 70 96 L 48 58 Z"
                  fill="#CBD5E1"
                  stroke="#1E293B"
                  strokeWidth="1.5"
                />
                {/* Parafuso do Pivô Central */}
                <circle cx="50" cy="50" r="4.5" fill="#0F172A" stroke="#94A3B8" strokeWidth="1" />
              </g>

              {/* Navalha Clássica Articulada (Opção A) */}
              <g
                ref={razorRef}
                transform="translate(940, 180) scale(0.65)"
                style={{ opacity: motionEnabled ? 0 : 0.85, transition: "opacity 0.2s" }}
              >
                {/* Cabo da Navalha */}
                <path
                  d="M 15 45 C 30 48, 80 50, 130 42 C 140 40, 145 46, 135 50 C 85 60, 30 55, 15 45 Z"
                  fill="#18181B"
                  stroke="#3F3F46"
                  strokeWidth="1.5"
                />
                {/* Lâmina de Aço Inox Desdobrável */}
                <g ref={razorBladeRef}>
                  <path
                    d="M 15 45 L 85 30 C 95 28, 100 20, 95 18 L 20 28 C 12 30, 10 40, 15 45 Z"
                    fill="#E2E8F0"
                    stroke="#475569"
                    strokeWidth="1.5"
                  />
                  <line x1="22" y1="30" x2="88" y2="24" stroke="#94A3B8" strokeWidth="0.8" />
                </g>
                {/* Pino do Pivô da Navalha */}
                <circle cx="15" cy="45" r="3" fill="#E2E8F0" stroke="#09090B" strokeWidth="1" />
              </g>
            </svg>
          </div>

          {/* Painel Interativo Editorial: Detalhes do Atelier (Fase 4 - Controles Reais) */}
          <div
            className="gallery-interactive-deck"
            data-story-avoid="true"
            data-3d-avoid="true"
            style={{
              maxWidth: "1100px",
              width: "100%",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              zIndex: 10,
            }}
          >
            {/* Abas Interativas Acessíveis */}
            <div
              role="tablist"
              aria-label="Destaques do Atelier Auto Stilo"
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              {DETAILS.map((item, idx) => {
                const isSelected = activeTab === idx;
                return (
                  <button
                    key={item.id}
                    role="tab"
                    id={`tab-${item.id}`}
                    aria-selected={isSelected}
                    aria-controls={`panel-${item.id}`}
                    type="button"
                    onClick={() => setActiveTab(idx)}
                    className="filter-tab"
                    style={{
                      padding: "8px 16px",
                      fontSize: "0.825rem",
                      fontWeight: isSelected ? 600 : 400,
                      borderRadius: "var(--radius-button, 12px)",
                      border: "1px solid",
                      borderColor: isSelected ? "var(--accent-purple, #7C3AED)" : "var(--border-hairline, rgba(0, 0, 0, 0.1))",
                      background: isSelected ? "var(--text-main, #18181B)" : "rgba(255, 255, 255, 0.8)",
                      color: isSelected ? "#FFFFFF" : "var(--text-main, #18181B)",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {item.title}
                  </button>
                );
              })}
            </div>

            {/* Conteúdo da Aba Ativa */}
            <div
              id={`panel-${activeDetail.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${activeDetail.id}`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
                padding: "14px 18px",
                borderRadius: "var(--radius-button, 12px)",
                background: "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(8px)",
                border: "1px solid var(--border-hairline, rgba(0, 0, 0, 0.08))",
              }}
            >
              <div>
                <span
                  style={{
                    display: "inline-block",
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "var(--accent-purple, #7C3AED)",
                    fontWeight: 600,
                    marginBottom: "2px",
                  }}
                >
                  {activeDetail.tag}
                </span>
                <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 600, color: "var(--text-main, #18181B)" }}>
                  {activeDetail.heading}
                </h4>
                <p style={{ margin: "4px 0 0", fontSize: "0.875rem", color: "var(--text-muted, #71717A)", maxWidth: "700px" }}>
                  {activeDetail.desc}
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted, #71717A)" }}>
                  R. do Tanque, 395 · Monte Sião
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
