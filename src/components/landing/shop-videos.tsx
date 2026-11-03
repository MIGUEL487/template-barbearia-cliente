"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { PhotoWatermark } from "@/components/demo-watermark";
import { useMotionEnabled } from "@/components/motion-preferences";

interface VideoItem {
  id: string;
  name: string;
  title: string;
  poster: string;
}

const PLAYLIST: VideoItem[] = [
  {
    id: "visita",
    name: "visita",
    title: "Uma visita à Auto Stilo",
    poster: "/media/auto-stilo/visita-poster.webp",
  },
  {
    id: "em-atendimento",
    name: "em-atendimento",
    title: "O cuidado durante o atendimento",
    poster: "/media/auto-stilo/em-atendimento-poster.webp",
  },
];

export function ShopVideos() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeSlot, setActiveSlot] = useState<"A" | "B">("A"); // Double-buffer slot A or B
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isCrossfading, setIsCrossfading] = useState(false);
  const motionEnabled = useMotionEnabled();

  const containerRef = useRef<HTMLDivElement>(null);
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  const userPausedRef = useRef(false);

  const currentVideo = PLAYLIST[currentIndex];
  const nextIndex = (currentIndex + 1) % PLAYLIST.length;
  const nextVideo = PLAYLIST[nextIndex];

  // Active / Buffer references
  const activeVideoEl = activeSlot === "A" ? videoARef.current : videoBRef.current;
  const bufferVideoEl = activeSlot === "A" ? videoBRef.current : videoARef.current;

  // Handle Play / Pause Toggle
  const togglePlay = useCallback(() => {
    if (!activeVideoEl) return;
    if (activeVideoEl.paused) {
      userPausedRef.current = false;
      activeVideoEl.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      userPausedRef.current = true;
      activeVideoEl.pause();
      setIsPlaying(false);
    }
  }, [activeVideoEl]);

  // Advance to specific index with double-buffer crossfade
  const goToVideo = useCallback((newIndex: number) => {
    if (newIndex === currentIndex || isCrossfading) return;
    setIsCrossfading(true);

    const targetSlot = activeSlot === "A" ? "B" : "A";
    const nextEl = targetSlot === "A" ? videoARef.current : videoBRef.current;
    const prevEl = targetSlot === "A" ? videoBRef.current : videoARef.current;

    if (nextEl) {
      nextEl.src = `/media/auto-stilo/${PLAYLIST[newIndex].name}.mp4`;
      nextEl.muted = isMuted;
      nextEl.load();

      const onCanPlay = () => {
        nextEl.removeEventListener("canplay", onCanPlay);
        if (!userPausedRef.current && motionEnabled) {
          nextEl.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
        }
        setActiveSlot(targetSlot);
        setCurrentIndex(newIndex);
        setTimeout(() => {
          if (prevEl) prevEl.pause();
          setIsCrossfading(false);
        }, 250);
      };

      if (nextEl.readyState >= 3) {
        onCanPlay();
      } else {
        nextEl.addEventListener("canplay", onCanPlay);
      }
    }
  }, [currentIndex, isCrossfading, activeSlot, isMuted, motionEnabled]);

  const handleNext = useCallback(() => {
    goToVideo((currentIndex + 1) % PLAYLIST.length);
  }, [currentIndex, goToVideo]);

  const handlePrev = useCallback(() => {
    goToVideo((currentIndex - 1 + PLAYLIST.length) % PLAYLIST.length);
  }, [currentIndex, goToVideo]);

  // Video Ended -> Automatic playlist progression
  useEffect(() => {
    const vA = videoARef.current;
    const vB = videoBRef.current;

    const onEnded = () => {
      handleNext();
    };

    if (vA) vA.addEventListener("ended", onEnded);
    if (vB) vB.addEventListener("ended", onEnded);

    return () => {
      if (vA) vA.removeEventListener("ended", onEnded);
      if (vB) vB.removeEventListener("ended", onEnded);
    };
  }, [handleNext]);

  // Viewport IntersectionObserver & Visibility handling
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let inView = false;
    const syncPlayback = () => {
      const activeEl = activeSlot === "A" ? videoARef.current : videoBRef.current;
      if (!activeEl) return;

      if (!inView || document.hidden || userPausedRef.current || !motionEnabled) {
        activeEl.pause();
        setIsPlaying(false);
      } else {
        activeEl.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    };

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting && entry.intersectionRatio >= 0.35;
      syncPlayback();
    }, { threshold: [0, 0.35] });

    io.observe(container);
    document.addEventListener("visibilitychange", syncPlayback);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
    };
  }, [activeSlot, motionEnabled]);

  // Initial source setup
  useEffect(() => {
    if (videoARef.current && !videoARef.current.src) {
      videoARef.current.src = `/media/auto-stilo/${PLAYLIST[0].name}.mp4`;
      videoARef.current.load();
    }
  }, []);

  return (
    <section className="section films-section" aria-labelledby="films-title">
      <div className="section-container">
        <div className="section-eyebrow">
          <span className="eyebrow-index">06</span>
          <span className="eyebrow-sep">{"//"}</span>
          <span>CINEMATOGRAFIA & RITUAL</span>
        </div>

        <div className="gallery-header-split" style={{ marginBottom: "36px" }}>
          <h2 id="films-title" className="gallery-title">
            O espaço e o cuidado, <span className="headline-italic">em movimento.</span>
          </h2>
          <p className="gallery-desc">
            Registros autênticos do cotidiano no atelier. Acompanhe a atmosfera, a recepção e a precisão do atendimento.
          </p>
        </div>

        {/* Moldura Cinematográfica Única */}
        <div
          ref={containerRef}
          className="single-film-player"
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "1080px",
            margin: "0 auto",
            borderRadius: "var(--radius-button, 12px)",
            overflow: "hidden",
            background: "#0A0A0C",
            boxShadow: "0 20px 48px -8px rgba(10, 10, 12, 0.12)",
            border: "1px solid rgba(10, 10, 12, 0.08)",
          }}
        >
          {/* Viewport de Vídeo (Buffer Duplo A/B) */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "clamp(360px, 60vh, 640px)",
              background: "#000000",
              overflow: "hidden",
            }}
          >
            {/* Slot A */}
            <video
              ref={videoARef}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: activeSlot === "A" ? 1 : 0,
                transition: "opacity 250ms ease-in-out",
                pointerEvents: activeSlot === "A" ? "auto" : "none",
              }}
              playsInline
              muted={isMuted}
              poster={PLAYLIST[0].poster}
              preload="metadata"
              aria-label={PLAYLIST[0].title}
            />

            {/* Slot B */}
            <video
              ref={videoBRef}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: activeSlot === "B" ? 1 : 0,
                transition: "opacity 250ms ease-in-out",
                pointerEvents: activeSlot === "B" ? "auto" : "none",
              }}
              playsInline
              muted={isMuted}
              poster={PLAYLIST[1].poster}
              preload="metadata"
              aria-label={PLAYLIST[1].title}
            />

            <PhotoWatermark />
          </div>

          {/* Barra de Controles Acessíveis & Playlist */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
              padding: "16px 24px",
              background: "#FFFFFF",
              borderTop: "1px solid rgba(10, 10, 12, 0.08)",
            }}
          >
            {/* Indicador Ativo com ARIA Live */}
            <div
              aria-live="polite"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "var(--accent, #7C3AED)",
                  letterSpacing: "0.1em",
                }}
              >
                {String(currentIndex + 1).padStart(2, "0")} / {String(PLAYLIST.length).padStart(2, "0")}
              </span>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "var(--text, #0A0A0C)",
                }}
              >
                {currentVideo.title}
              </span>
            </div>

            {/* Controles de Reprodução */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                type="button"
                className="btn-player"
                onClick={handlePrev}
                aria-label="Vídeo anterior"
                style={{
                  minWidth: "44px",
                  minHeight: "44px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--surface, #F6F5F8)",
                  border: "1px solid rgba(10, 10, 12, 0.08)",
                  color: "var(--text, #0A0A0C)",
                  cursor: "pointer",
                }}
              >
                <SkipBack size={18} aria-hidden="true" />
              </button>

              <button
                type="button"
                className="btn-player"
                onClick={togglePlay}
                aria-label={isPlaying ? "Pausar vídeo" : "Reproduzir vídeo"}
                aria-pressed={isPlaying}
                style={{
                  minWidth: "44px",
                  minHeight: "44px",
                  padding: "0 18px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "#0A0A0C",
                  border: "none",
                  color: "#FFFFFF",
                  fontWeight: 600,
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                {isPlaying ? (
                  <>
                    <Pause size={18} fill="currentColor" aria-hidden="true" />
                    <span>Pausar</span>
                  </>
                ) : (
                  <>
                    <Play size={18} fill="currentColor" aria-hidden="true" />
                    <span>Reproduzir</span>
                  </>
                )}
              </button>

              <button
                type="button"
                className="btn-player"
                onClick={handleNext}
                aria-label="Próximo vídeo"
                style={{
                  minWidth: "44px",
                  minHeight: "44px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--surface, #F6F5F8)",
                  border: "1px solid rgba(10, 10, 12, 0.08)",
                  color: "var(--text, #0A0A0C)",
                  cursor: "pointer",
                }}
              >
                <SkipForward size={18} aria-hidden="true" />
              </button>

              <button
                type="button"
                className="btn-player btn-icon-round"
                onClick={() => setIsMuted((v) => !v)}
                aria-label={isMuted ? "Ativar som do vídeo" : "Desativar som do vídeo"}
                aria-pressed={!isMuted}
                style={{
                  minWidth: "44px",
                  minHeight: "44px",
                  marginLeft: "8px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--surface, #F6F5F8)",
                  border: "1px solid rgba(10, 10, 12, 0.08)",
                  color: "var(--text, #0A0A0C)",
                  cursor: "pointer",
                }}
              >
                {isMuted ? (
                  <VolumeX size={18} aria-hidden="true" />
                ) : (
                  <Volume2 size={18} aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
