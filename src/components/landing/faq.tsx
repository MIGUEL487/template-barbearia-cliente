"use client";
import { useEffect, useState } from "react";
import { demoMode, demoFaq } from "@/config/demo";
import { supabase, getBarbershopId } from "@/lib/supabase";
export function Faq() {
  const [items, setItems] = useState(demoMode ? demoFaq : []);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (demoMode) return;
    let active = true;
    supabase
      .from("public_faq_items")
      .select("id,question,answer")
      .eq("barbershop_id", getBarbershopId())
      .then(({ data, error }) => {
        if (active) {
          if (error) setFailed(true);
          else setItems(data || []);
        }
      });
    return () => {
      active = false;
    };
  }, []);
  return (
    <section className="section faq-section">
      <h2>Antes de chegar.</h2>
      <div>
        {failed && (
          <p role="alert">
            Não foi possível carregar as dúvidas. Fale com a barbearia pelo
            WhatsApp.
          </p>
        )}
        {items.map((f) => (
          <details key={f.id}>
            <summary>
              {f.question}
              <span aria-hidden="true">+</span>
            </summary>
            <p>{f.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
