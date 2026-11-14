'use client';
import {useEffect,useRef} from 'react';
const words='AUTO STILO  ·  MONTE SIÃO / MG  ·  CORTE, BARBA & ESTILO  ·  PRECISÃO EM CADA DETALHE  ·  ';
export function TransitionMarquee(){const ref=useRef<HTMLElement>(null);useEffect(()=>{const el=ref.current!;const io=new IntersectionObserver(([e])=>el.classList.toggle('is-running',e.isIntersecting));io.observe(el);return()=>io.disconnect()},[]);return <section ref={ref} className="hero-marquee" aria-label="Auto Stilo, Monte Sião, corte, barba e estilo"><div className="hero-marquee-track" aria-hidden="true"><span>{words}</span><span>{words}</span></div></section>}
