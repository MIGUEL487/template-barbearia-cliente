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
      gsap.ticker.add(tick);
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
            { opacity: 1, y: 12 },
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
            e.isIntersecting ? "running" : "paused",
          );
        }),
      );
      document
        .querySelectorAll(".ambient-loop")
        .forEach((e) => observer.observe(e));
      document.fonts.ready.then(() => ScrollTrigger.refresh());
      dispose = () => {
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
