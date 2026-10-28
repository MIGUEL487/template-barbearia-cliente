"use client";
import { useEffect, useRef, useState } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";
import { PhotoWatermark } from "@/components/demo-watermark";
import { useMotionEnabled } from "@/components/motion-preferences";

function ShopVideo({ name, title }: { name: string; title: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const choice = useRef<"auto" | "paused" | "playing">("auto");
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const enabled = useMotionEnabled();
  useEffect(() => {
    const video = ref.current!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const sync = () => {
      const mayPlay = choice.current === "playing" || (choice.current === "auto" && enabled && !reduced.matches);
      if (!visible || document.hidden || !mayPlay) video.pause();
      else void video.play().catch(() => setPlaying(false));
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= .35;
      sync();
    }, { threshold: [0, .35] });
    const preference = () => { if (reduced.matches) choice.current = "auto"; sync(); };
    observer.observe(video);
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", preference);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      reduced.removeEventListener("change", preference);
      video.pause();
    };
  }, [enabled]);
  const toggle = () => {
    const video = ref.current!;
    if (video.paused) {
      choice.current = "playing";
      void video.play().catch(() => setPlaying(false));
    } else {
      choice.current = "paused";
      video.pause();
    }
  };
  return <figure className="shop-film" data-motion>
    <div className="film-frame">
      <video ref={ref} width="360" height="640" playsInline muted={muted} loop preload="none"
        poster={`/media/auto-stilo/${name}-poster.webp`} aria-label={title}
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}>
        <source src={`/media/auto-stilo/${name}.mp4`} type="video/mp4" />
        Seu navegador não reproduz este vídeo.
      </video>
      <PhotoWatermark />
      <button className="film-toggle" type="button" onClick={toggle}
        aria-label={`${playing ? "Pausar" : "Reproduzir"}: ${title}`} aria-pressed={playing}>
        {!playing && <span className="film-play"><Play size={24} fill="currentColor" aria-hidden="true" /></span>}
      </button>
      <button className="film-sound" type="button" onClick={() => setMuted(value => !value)}
        aria-label={`${muted ? "Ativar" : "Desativar"} som: ${title}`} aria-pressed={!muted}>
        {muted ? <VolumeX size={20} aria-hidden="true" /> : <Volume2 size={20} aria-hidden="true" />}
      </button>
    </div>
    <figcaption>{title}</figcaption>
  </figure>;
}
export function ShopVideos() {
  return <section className="section films-section" aria-labelledby="films-title">
    <div className="section-heading"><h2 id="films-title">Um pouco<br />do nosso dia.</h2><p>O espaço e o cuidado, em movimento.<br />Reproduza quando quiser.</p></div>
    <div className="films-grid"><ShopVideo name="visita" title="Uma visita à Auto Stilo" /><ShopVideo name="em-atendimento" title="O cuidado durante o atendimento" /></div>
  </section>;
}
