"use client";
import {RegionalText,useRegional} from '@/components/regional/provider';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/brand-logo';
import { sequentialFrames } from '@/lib/cinematic/sequential-frames';
import { subscribeLandingFrame, jumpLandingTo, registerScrollBoundary } from './scroll-manager';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotionEnabled } from '@/components/motion-preferences';

const cues = [
  { frame: 1, start: 1, in: 1, out: 36, end: 44, title: 'Barbearia Modelo', copy: 'Corte, Barba & Estilo' },
  { frame: 2, start: 42, in: 52, out: 84, end: 92, title: 'Ambiente pensado para o seu bem-estar.' },
  { frame: 3, start: 90, in: 100, out: 132, end: 140, title: 'Precisão artesanal em cada corte.' },
  { frame: 4, start: 138, in: 148, out: 180, end: 188, title: 'O ritual clássico que você merece.' },
  { frame: 5, start: 186, in: 196, out: 212, end: 220, title: 'Mais que um corte. Uma experiência.' },
  { frame: 6, start: 218, in: 224, out: 239, end: 240, title: 'Seu próximo estilo começa aqui.' },
];

const path = (v: string, i: number) =>
  `/frames/${v}/frame_${String(i + 1).padStart(4, '0')}.webp`;

export function CinematicHero() {
const {t}=useRegional();

  const root = useRef<HTMLElement>(null);
  const surface = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const enabled = useMotionEnabled();

  useEffect(() => {
    const el = root.current!;
    const cv = canvas.current!;
    const box = surface.current!;
    const mq = matchMedia('(max-width: 768px) and (orientation: portrait)');
    let dispose = () => {};
    let completedBeforeResize = false;

    const setup = () => {
      dispose();
      const reduced = !enabled || matchMedia('(prefers-reduced-motion: reduce)').matches;
      let savedOff = false;
      try {
        savedOff = localStorage.getItem('auto-stilo-motion') === 'off';
      } catch {}
      el.closest('.cinematic-site')?.classList.remove('past-cinema');
      el.classList.toggle(
        'cinema-static',
        reduced &&
          (savedOff ||
            matchMedia('(prefers-reduced-motion: reduce)').matches ||
            new URLSearchParams(location.search).get('motion') === 'off')
      );
      if (reduced) {
        if (el.classList.contains('cinema-static')) {
          el.closest('.cinematic-site')?.classList.add('past-cinema');
        }
        return;
      }

      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.config({ ignoreMobileResize: true });

      const texts = Array.from(el.querySelectorAll<HTMLElement>('.cinema-cue'));
      const timeline = gsap.timeline({ paused: true });

      cues.forEach((cue, i) => {
        const node = texts[i];
        if (!node) return;
        gsap.set(node, { autoAlpha: i === 0 ? 1 : 0, y: i === 0 ? 0 : 16 });
        if (i) {
          timeline.to(
            node,
            { autoAlpha: 1, y: 0, duration: cue.in - cue.start, ease: 'none' },
            cue.start - 1
          );
        }
        if (i < cues.length - 1) {
          timeline.to(
            node,
            { autoAlpha: 0, y: -16, duration: cue.end - cue.out, ease: 'none' },
            cue.out - 1
          );
        }
      });
      timeline.to({}, { duration: 1 }, 237);

      type Phase = 'tracking' | 'catching-up' | 'complete';
      let phase: Phase = completedBeforeResize ? 'complete' : 'tracking';
      let displayed = -1;
      let completionPending = false;
      let correcting = false;
      const debug = new URLSearchParams(location.search).has('debug-hero');
      let trigger: ScrollTrigger | undefined;

      const limit = () => (trigger ? trigger.end - 2 : Infinity);
      const siblings = Array.from(el.parentElement?.children || [])
        .filter((node): node is HTMLElement => node instanceof HTMLElement && node !== el)
        .map((node) => ({ node, inert: node.inert }));
      const setInert = (held: boolean) =>
        siblings.forEach(({ node, inert }) => {
          node.inert = held || inert;
        });
      setInert(phase !== 'complete');

      const publish = () => {
        el.dataset.phase = phase;
        if (debug) {
          (window as Window & { __HERO_GATE__?: unknown }).__HERO_GATE__ = {
            phase,
            displayedFrame: displayed + 1,
            limit: limit(),
            position: scrollY,
          };
        }
      };

      const updateHeader = () =>
        el
          .closest('.cinematic-site')
          ?.classList.toggle('past-cinema', phase === 'complete' && !!trigger && scrollY >= trigger.end);

      let failed = false;
      const fallback = () => {
        if (failed) return;
        failed = true;
        phase = 'complete';
        completedBeforeResize = true;
        setInert(false);
        el.classList.add('cinema-static');
        el.closest('.cinematic-site')?.classList.add('past-cinema');
        trigger?.kill(true);
        gsap.set(texts, { clearProps: 'all' });
        player?.dispose();
        publish();
        console.warn('[Hero] Sequência indisponível; navegação estática liberada.');
      };

      const player = sequentialFrames(
        cv,
        box,
        mq.matches ? 'mobile' : 'desktop',
        (index) => {
          displayed = index;
          timeline.time(index);
          if (index >= 237) completionPending = true;
          else {
            completionPending = false;
            if (!completedBeforeResize || !trigger || scrollY < trigger.end) {
              phase = 'tracking';
              completedBeforeResize = false;
              setInert(true);
            }
          }
          publish();
          updateHeader();
        },
        fallback
      );

      if (!player) {
        setInert(false);
        el.classList.add('cinema-static');
        el.closest('.cinematic-site')?.classList.add('past-cinema');
        return;
      }

      const constrain = (position: number) => {
        if (failed || phase === 'complete' || position <= limit()) return position;
        phase = 'catching-up';
        player.setTarget(238);
        publish();
        return limit();
      };

      const guard = () => {
        if (failed || correcting || !trigger) return;
        const top = constrain(scrollY);
        if (top < scrollY) {
          correcting = true;
          jumpLandingTo(top);
          correcting = false;
        }
        publish();
        updateHeader();
      };

      const stopBoundary = registerScrollBoundary(constrain);
      const stop = subscribeLandingFrame((time) => {
        if (completionPending) {
          completionPending = false;
          phase = 'complete';
          completedBeforeResize = true;
          setInert(false);
          publish();
          updateHeader();
        }
        player.tick(time);
        guard();
      });

      trigger = ScrollTrigger.create({
        id: 'cinematic-hero',
        refreshPriority: 100,
        trigger: el,
        start: 'top top',
        end: () => `+=${innerHeight * (mq.matches ? 4.5 : 5.5)}`,
        pin: box,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (failed) return;
          player.setTarget(self.progress * 238);
          guard();
        },
      });

      const keydown = (event: KeyboardEvent) => {
        if (
          event.altKey ||
          event.ctrlKey ||
          event.metaKey ||
          event.shiftKey ||
          !(event.target instanceof HTMLElement) ||
          event.target.closest('input,textarea,select,[contenteditable=true],button,a')
        )
          return;
        const distance =
          event.key === 'End'
            ? Infinity
            : ['PageDown', ' '].includes(event.key)
            ? innerHeight
            : event.key === 'ArrowDown'
            ? 64
            : 0;
        if (!distance) return;
        const requested = scrollY + distance;
        const allowed = constrain(requested);
        if (allowed < requested) {
          event.preventDefault();
          jumpLandingTo(allowed);
        }
      };

      window.addEventListener('scroll', guard, { passive: true });
      window.addEventListener('keydown', keydown);
      guard();

      dispose = () => {
        window.removeEventListener('scroll', guard);
        window.removeEventListener('keydown', keydown);
        stopBoundary();
        stop();
        setInert(false);
        trigger?.kill(true);
        player.dispose();
        timeline.kill();
        gsap.set(texts, { clearProps: 'all' });
        cv.style.opacity = '0';
        delete el.dataset.phase;
        if (debug) delete (window as Window & { __HERO_GATE__?: unknown }).__HERO_GATE__;
      };
    };

    setup();
    mq.addEventListener('change', setup);
    return () => {
      dispose();
      mq.removeEventListener('change', setup);
    };
  }, [enabled]);

  return (
    <section ref={root} className="cinema" aria-label={t("Barbearia Modelo, o cuidado em movimento")}>
      <div ref={surface} className="cinema-surface">
        <picture className="cinema-poster">
          <source
            media="(max-width:768px) and (orientation:portrait)"
            srcSet={path('mobile', 0)}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={path('desktop', 0)}
            width="1672"
            height="941"
            fetchPriority="high"
            alt={t("Barbearia Modelo — Ambiente e tradição artesanal")}
          />
        </picture>
        <canvas ref={canvas} aria-hidden="true" />
        <div className="cinema-scrim" />
        {cues.map((cue, i) => (
          <div
            className={`cinema-cue cue-${i}`}
            key={cue.frame}
            data-reference={cue.frame}
          >
            {i === 0 ? (
              <>
                <h1 className="sr-only"><RegionalText text="Barbearia Modelo — Corte, Barba &amp; Estilo"/></h1>
                <BrandLogo tone="dark" className="cinema-brand" />
              </>
            ) : (
              <h2>{t(cue.title)}</h2>
            )}
            {(i === 0 || i === cues.length - 1) && (
              <Link className="cta" href="/agendar"><RegionalText text="Agendar horário"/><span aria-hidden="true">↗</span>
              </Link>
            )}
          </div>
        ))}
        <div className="cinema-alternatives">
          <button
            className="hero-motion-alternative"
            type="button"
            onClick={() => {
              try {
                localStorage.setItem('auto-stilo-motion', 'off');
              } catch {}
              window.dispatchEvent(new Event('auto-stilo-motion'));
            }}
          ><RegionalText text="Versão sem animação"/></button>
        </div>
      </div>
      <div className="cinema-still-story">
        {cues.slice(1).map((c, idx) => (
          <article key={c.frame}>
            <picture>
              <source
                media="(max-width:768px) and (orientation:portrait)"
                srcSet={path('mobile', idx + 1)}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={path('desktop', idx + 1)}
                alt={t("Detalhe do ambiente e atendimento na barbearia")}
                width="1672"
                height="941"
                loading="lazy"
              />
            </picture>
            <h2>{c.title}</h2>
          </article>
        ))}
      </div>
    </section>
  );
}
