"use client";
import {RegionalText} from '@/components/regional/provider';
import Link from "next/link";
import { useState } from "react";
export function DemoManagement() {
  const [status, setStatus] = useState("Agendamento de exemplo");
  const [action, setAction] = useState<"cancelar" | "reagendar" | null>(null);
  return (
    <main className="booking-shell">
      <Link className="brand" href="/"><RegionalText text="Barbearia Modelo"/></Link>
      <h1><RegionalText text="Meu agendamento"/></h1>
      <p className="demo-alert"><RegionalText text="Demonstração. Nenhuma reserva real será consultada ou alterada."/></p>
      <h2 aria-live="polite">{status}</h2>
      <p><RegionalText text="Corte de assinatura · Profissional 01 · horário ilustrativo"/></p>
      <div className="actions">
        <button className="cta" onClick={() => setAction("reagendar")}><RegionalText text="Reagendar exemplo"/></button>
        <button className="button-secondary" onClick={() => setAction("cancelar")}><RegionalText text="Cancelar exemplo"/></button>
      </div>
      {action && (
        <section
          role="dialog"
          aria-modal="false"
          aria-labelledby="confirm-action"
        >
          <h2 id="confirm-action"><RegionalText text="Confirmar"/>{action}?</h2>
          {action === "reagendar" && (
            <label className="field-label"><RegionalText text="Nova data ilustrativa"/><input type="date" />
            </label>
          )}
          <div className="actions confirmation-actions">
          <button
            className="cta"
            onClick={() => {
              setStatus(
                action === "cancelar"
                  ? "Cancelamento simulado"
                  : "Reagendamento simulado",
              );
              setAction(null);
            }}
          ><RegionalText text="Confirmar simulação"/></button>
          <button className="button-secondary" onClick={() => setAction(null)}><RegionalText text="Voltar"/></button>
          </div>
        </section>
      )}
    </main>
  );
}
