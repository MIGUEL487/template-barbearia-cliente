"use client";
import { useState,useEffect,useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {Counter} from "./counter";
import { reviews } from "@/config/demo";
import {useMotionEnabled} from '@/components/motion-preferences';
export function ReviewCarousel() {
  const ref=useRef<HTMLElement>(null),enabled=useMotionEnabled();const [paused,setPaused]=useState(false);
  useEffect(()=>{if(!enabled||paused)return;let timer:ReturnType<typeof setInterval>|undefined,visible=false;const stop=()=>{if(timer)clearInterval(timer);timer=undefined};const sync=()=>{stop();if(visible&&!document.hidden)timer=setInterval(()=>setIndex(i=>(i+1)%reviews.length),5000)};const io=new IntersectionObserver(([e])=>{visible=e.isIntersecting;sync()});if(ref.current)io.observe(ref.current);document.addEventListener('visibilitychange',sync);return()=>{stop();io.disconnect();document.removeEventListener('visibilitychange',sync)}},[enabled,paused]);
  const [index, setIndex] = useState(2);
  const reduced = useReducedMotion();
  function move(delta: number) {
    setIndex((i) => (i + delta + reviews.length) % reviews.length);
  }
  return (
    <section ref={ref} id="avaliacoes" className="section reviews-section">
      <div className="review-heading">
        <h2>
          A palavra de
          <br />
          quem conhece.
        </h2>
        <p className="review-score"><Counter value={5} decimals={1}/> · <Counter value={53}/> avaliações no Google</p>
        <span aria-label="5 estrelas" className="review-stars">{Array.from({length:5},(_,i)=><motion.span key={i} initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} transition={{delay:i*.12}}>★</motion.span>)}</span>
        <p>
          Avaliações do Google · citações fornecidas no briefing, em
          demonstração.
        </p>
      </div>
      <div
        className="review-feature"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") move(1);
          if (e.key === "ArrowLeft") move(-1);
        }}
      >
        <div className="quote-frame" aria-live={paused?"polite":"off"} aria-atomic="true">
          <AnimatePresence mode="wait" initial={false}>
            <motion.blockquote
              key={index}
              initial={{ opacity: 0, y: reduced ? 0 : 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduced ? 0 : -6 }}
              transition={{ duration: reduced ? 0.12 : 0.28 }}
            >
              <p>“{reviews[index]}”</p>
              <cite>Cliente · Google</cite>
            </motion.blockquote>
          </AnimatePresence>
        </div>
        <div className="quote-controls">
          <span>
            {index + 1} de {reviews.length}
          </span>
          <div>
            <button type="button" aria-pressed={paused} onClick={()=>setPaused(!paused)}>{paused?"Retomar":"Pausar"}</button>
            <button
              type="button"
              aria-label="Avaliação anterior"
              onClick={() => move(-1)}
            >
              Anterior
            </button>
            <button
              type="button"
              aria-label="Próxima avaliação"
              onClick={() => move(1)}
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
