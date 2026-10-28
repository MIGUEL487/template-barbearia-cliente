"use client";
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotionEnabled } from '@/components/motion-preferences';

export function LandingMotion() {
  const enabled = useMotionEnabled();
  useEffect(() => {
    if (!enabled) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.signature .arch,.gallery-piece .reveal-mask').forEach(el => {
        gsap.fromTo(el.querySelector('img'), { yPercent: -4, scale: 1.06 }, {
          yPercent: 4, scale: 1.02, ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: .5 },
        });
      });
      gsap.fromTo('.hex-line', { strokeDashoffset: 800 }, {
        strokeDashoffset: 0,
        scrollTrigger: { trigger: '.space-window', start: 'top 85%', end: 'bottom 40%', scrub: .4 },
      });
      gsap.fromTo('.footer-wordmark', { y: 32, opacity: 0 }, {
        y: 0, opacity: 1, duration: .8,
        scrollTrigger: { trigger: '.site-footer', start: 'top 85%', once: true },
      });
    });
    return () => ctx.revert();
  }, [enabled]);
  return null;
}
