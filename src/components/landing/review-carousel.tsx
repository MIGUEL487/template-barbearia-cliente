"use client";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { reviews } from "@/config/demo";
export function ReviewCarousel() {
  const [index, setIndex] = useState(2);
  const reduced = useReducedMotion();
  function move(delta: number) {
    setIndex((i) => (i + delta + reviews.length) % reviews.length);
  }
  return (
    <section id="avaliacoes" className="section reviews-section">
      <div className="review-heading">
        <h2>
          A palavra de
          <br />
          quem conhece.
        </h2>
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
        <div className="quote-frame" aria-live="polite" aria-atomic="true">
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
