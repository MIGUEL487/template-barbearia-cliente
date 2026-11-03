"use client";

import { useEffect, useRef, useState } from "react";

export function ContactMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Carregamento automático adiantado via IntersectionObserver (rootMargin 800px)
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        },
        { rootMargin: "800px 0px" }
      );
      observer.observe(el);
      return () => observer.disconnect();
    } else {
      setShouldLoad(true);
    }
  }, []);

  // Timeout de 8s para ativar fallback se o mapa não carregar
  useEffect(() => {
    if (!shouldLoad || isLoaded) return;
    const timer = setTimeout(() => {
      if (!isLoaded) setHasError(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, [shouldLoad, isLoaded]);

  return (
    <div
      ref={containerRef}
      className="contact-map"
      style={{
        position: "relative",
        width: "100%",
        minHeight: "380px",
        height: "100%",
        overflow: "hidden",
        borderRadius: "var(--radius-button, 12px)",
        border: "1px solid var(--border-hairline, rgba(0, 0, 0, 0.08))",
        background: "var(--surface-sunken, #F4F2EE)",
      }}
    >
      {shouldLoad && !hasError && (
        <iframe
          title="Localização da Barbearia Auto Stilo em Monte Sião"
          src="https://www.google.com/maps?q=Rua+do+Tanque+395+Monte+Siao+MG&output=embed"
          referrerPolicy="no-referrer"
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            minHeight: "380px",
            border: 0,
            margin: 0,
            padding: 0,
          }}
        />
      )}

      {(!shouldLoad || (shouldLoad && !isLoaded && !hasError)) && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-muted, #71717A)",
            fontSize: "0.875rem",
          }}
          aria-hidden="true"
        >
          Carregando mapa do atelier...
        </div>
      )}

      {hasError && (
        <div
          className="map-fallback-card"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            textAlign: "center",
            background: "var(--surface-sunken, #F4F2EE)",
          }}
        >
          <p style={{ fontWeight: 600, marginBottom: "8px", color: "var(--text-main, #18181B)" }}>
            Barbearia Auto Stilo
          </p>
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted, #71717A)", marginBottom: "16px" }}>
            Rua do Tanque, 395 · Bela Vista, Monte Sião — MG
          </p>
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=Rua+do+Tanque+395+Monte+Siao+MG"
            target="_blank"
            rel="noopener noreferrer"
            className="cta"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              fontSize: "0.875rem",
            }}
          >
            Abrir rota no Google Maps →
          </a>
        </div>
      )}
    </div>
  );
}
