"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { HairClipper, HairClipperHandle } from "@/components/three/hair-clipper";

export default function Lab3DPage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const clipperRef = useRef<HairClipperHandle>(null);
  const runwayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const runway = runwayRef.current;
          if (!runway) return;

          const rect = runway.getBoundingClientRect();
          const totalDistance = rect.height - window.innerHeight;
          const current = Math.max(0, Math.min(1, -rect.top / (totalDistance || 1)));

          setScrollProgress(current);
          clipperRef.current?.setProgress(current);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const jumpTo = (pct: number) => {
    const runway = runwayRef.current;
    if (!runway) return;
    const totalDistance = runway.scrollHeight - window.innerHeight;
    const targetY = window.scrollY + runway.getBoundingClientRect().top + totalDistance * pct;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  const getPhaseName = (p: number) => {
    if (p < 0.2) return "01 · Hero Pose (Visão Geral em 3/4)";
    if (p < 0.45) return "02 · Perfil da Alavanca Lateral (Taper Lever)";
    if (p < 0.7) return "03 · Dentes da Lâmina de Precisão (Aço Escovado)";
    if (p < 0.9) return "04 · Empunhadura Ergonômica & Anel Violeta";
    return "05 · Finalização Studio (Acabamento Completo)";
  };

  return (
    <div style={{ background: "#FFFFFF", color: "#0A0A0C", minHeight: "100vh" }}>
      {/* Top Laboratory Bar */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "56px",
          background: "#FFFFFF",
          borderBottom: "1px solid rgba(10, 10, 12, 0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link
            href="/"
            style={{
              fontSize: "13px",
              color: "#4A4A52",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            &larr; Voltar à Home
          </Link>
          <span style={{ color: "rgba(10, 10, 12, 0.2)" }}>|</span>
          <span
            style={{
              fontFamily: "var(--font-serif), Georgia, serif",
              fontSize: "16px",
              fontWeight: 500,
            }}
          >
            Auto Stilo · Laboratório 3D (Hair Clipper)
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              fontSize: "11px",
              fontFamily: "monospace",
              background: "#F6F5F8",
              padding: "4px 8px",
              borderRadius: "2px",
              border: "1px solid rgba(10, 10, 12, 0.08)",
            }}
          >
            Scrub: {(scrollProgress * 100).toFixed(1)}%
          </span>
        </div>
      </header>

      {/* Tall Scroll Runway (250vh) com Sticky Canvas */}
      <div
        ref={runwayRef}
        style={{
          height: "250vh",
          position: "relative",
          marginTop: "56px",
        }}
      >
        <div
          style={{
            position: "sticky",
            top: "56px",
            height: "calc(100vh - 56px)",
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr",
            alignItems: "center",
            padding: "0 48px",
            boxSizing: "border-box",
          }}
        >
          {/* Telemetria e Controles */}
          <div style={{ maxWidth: "460px", padding: "24px 0" }}>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#7C3AED",
                marginBottom: "12px",
              }}
            >
              Fase 4 · Protótipo 3D Three.js
            </div>

            <h1
              style={{
                fontFamily: "var(--font-serif), Georgia, serif",
                fontSize: "36px",
                lineHeight: 1.15,
                fontWeight: 400,
                margin: "0 0 16px",
                letterSpacing: "-0.02em",
              }}
            >
              Máquina de Cortar Cabelo Profissional
            </h1>

            <p
              style={{
                fontFamily: "var(--font-sans), sans-serif",
                fontSize: "15px",
                lineHeight: 1.6,
                color: "#4A4A52",
                margin: "0 0 28px",
              }}
            >
              Modelo procedural tridimensional em Three.js com dentes de lâmina em aço escovado, alavanca lateral articulada, chassi ergonômico e iluminação de estúdio sobre fundo branco.
            </p>

            {/* Caixa de Telemetria do Scrub */}
            <div
              style={{
                background: "#FBFAF8",
                border: "1px solid rgba(10, 10, 12, 0.08)",
                borderRadius: "4px",
                padding: "16px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  color: "#7A7A85",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "6px",
                }}
              >
                Fase de Visualização Ativa:
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#0A0A0C",
                  marginBottom: "12px",
                }}
              >
                {getPhaseName(scrollProgress)}
              </div>

              {/* Barra de Progresso Visual */}
              <div
                style={{
                  height: "4px",
                  width: "100%",
                  background: "rgba(10, 10, 12, 0.06)",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${scrollProgress * 100}%`,
                    background: "#7C3AED",
                    transition: "width 0.05s ease-out",
                  }}
                />
              </div>
            </div>

            {/* Botões Rápidos de Scrub */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
                <button
                  key={pct}
                  onClick={() => jumpTo(pct)}
                  style={{
                    background:
                      Math.abs(scrollProgress - pct) < 0.12 ? "#0A0A0C" : "transparent",
                    color:
                      Math.abs(scrollProgress - pct) < 0.12 ? "#FFFFFF" : "#0A0A0C",
                    border: "1px solid rgba(10, 10, 12, 0.12)",
                    borderRadius: "2px",
                    padding: "6px 12px",
                    fontSize: "12px",
                    fontFamily: "monospace",
                    cursor: "pointer",
                    minWidth: "auto",
                    minHeight: "auto",
                  }}
                >
                  {(pct * 100).toFixed(0)}%
                </button>
              ))}
            </div>
          </div>

          {/* Canvas 3D Isolado */}
          <div
            id="lab-3d-viewport"
            style={{
              width: "100%",
              height: "540px",
              position: "relative",
              borderRadius: "6px",
              overflow: "hidden",
            }}
          >
            <HairClipper ref={clipperRef} progress={scrollProgress} interactive={true} />
          </div>
        </div>
      </div>

      {/* Seção Inferior para Provar que o Scroll Continua Livremente */}
      <section
        style={{
          borderTop: "1px solid rgba(10, 10, 12, 0.08)",
          padding: "80px 24px",
          background: "#FBFAF8",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-serif), Georgia, serif",
              fontSize: "28px",
              margin: "0 0 16px",
              fontWeight: 400,
            }}
          >
            Scroll 100% Livre Comprovado
          </h2>
          <p
            style={{
              fontFamily: "var(--font-sans), sans-serif",
              fontSize: "15px",
              color: "#4A4A52",
              lineHeight: 1.6,
              margin: "0 0 24px",
            }}
          >
            Ao atingir 100% da rotação, a página continua fluindo naturalmente sem capturar ou travar a roda do mouse, cumprindo integralmente a Regra R5.
          </p>
          <Link
            href="/"
            style={{
              display: "inline-block",
              background: "#0A0A0C",
              color: "#FFFFFF",
              padding: "12px 24px",
              borderRadius: "2px",
              fontSize: "14px",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Retornar à Página Principal &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
