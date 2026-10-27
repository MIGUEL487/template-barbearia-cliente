"use client";
import { useEffect, useRef, useState } from "react";
import { PhotoWatermark } from "@/components/demo-watermark";

function ShopVideo({ name, title }: { name: string; title: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const video = ref.current!;
    const pause = () => video.pause();
    const observer = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) pause();
    }, { threshold: .2 });
    const visibility = () => { if (document.hidden) pause(); };
    observer.observe(video);
    document.addEventListener("visibilitychange", visibility);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", visibility); pause(); };
  }, []);
  return <figure className="shop-film" data-motion>
    <div className="film-frame">
      <video ref={ref} width="360" height="640" playsInline muted controls preload="none"
        poster={`/media/auto-stilo/${name}-poster.webp`} aria-label={title}
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)}>
        <source src={`/media/auto-stilo/${name}.mp4`} type="video/mp4" />
        Seu navegador não reproduz este vídeo.
      </video>
      <PhotoWatermark />
    </div>
    <figcaption>{title}</figcaption>
    <button type="button" aria-pressed={playing} onClick={() => {
      const video = ref.current!;
      if (video.paused) { void video.play().catch(() => setPlaying(false)); } else video.pause();
    }}>{playing ? "Pausar vídeo" : "Reproduzir vídeo"}</button>
  </figure>;
}
export function ShopVideos() {
  return <section className="section films-section" aria-labelledby="films-title">
    <div className="section-heading"><h2 id="films-title">Um pouco<br />do nosso dia.</h2><p>O espaço e o cuidado, em movimento.<br />Reproduza quando quiser.</p></div>
    <div className="films-grid"><ShopVideo name="visita" title="Uma visita à Auto Stilo" /><ShopVideo name="em-atendimento" title="O cuidado durante o atendimento" /></div>
  </section>;
}
