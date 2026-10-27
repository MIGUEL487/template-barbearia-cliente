"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
gsap.registerPlugin(ScrollTrigger);
export function LandingMotion() {
  useEffect(() => {
    const mm = gsap.matchMedia();
    let dispose = () => {};
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const lenis = new Lenis({ autoRaf: false, anchors: true });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (t: number) => lenis.raf(t * 1000);
      const visibility = () => {
        document.querySelectorAll<HTMLElement>(".ambient-loop").forEach(el => el.style.setProperty("--play", !document.hidden && el.getBoundingClientRect().bottom > 0 && el.getBoundingClientRect().top < innerHeight ? "running" : "paused"));
        if (document.hidden) { gsap.ticker.remove(tick); lenis.stop(); }
        else { lenis.start(); gsap.ticker.add(tick); ScrollTrigger.refresh(); }
      };
      document.addEventListener("visibilitychange", visibility);
      if (!document.hidden) gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      const ctx = gsap.context(() => {
        gsap.to(".hero-art", {
          yPercent: 4,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 0.2,
          },
        });
        gsap.utils.toArray<HTMLElement>(".reveal-mask").forEach((el) =>
          gsap.fromTo(
            el,
            { opacity: 1, y: 16 },
            {
              opacity: 1,
              y: 0,
              scrollTrigger: {
                trigger: el,
                start: "top 92%",
                end: "top 55%",
                scrub: 0.2,
              },
            },
          ),
        );
      });
      const observer = new IntersectionObserver((es) =>
        es.forEach((e) => {
          (e.target as HTMLElement).style.setProperty(
            "--play",
            e.isIntersecting && !document.hidden ? "running" : "paused",
          );
        }),
      );
      document
        .querySelectorAll(".ambient-loop")
        .forEach((e) => observer.observe(e));
      document.fonts.ready.then(() => ScrollTrigger.refresh());
      dispose = () => {
        document.removeEventListener("visibilitychange", visibility);
        observer.disconnect();
        ctx.revert();
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
      return dispose;
    });
    return () => {
      mm.revert();
    };
  }, []);
  return null;
}
