"use client";
import { useState } from "react";
import { supabase, getBarbershopId } from "@/lib/supabase";
import { reportSupabaseError } from "@/lib/booking-diagnostics";
export function WaitlistForm({
  date,
  barberId,
  serviceIds,
}: {
  date: string;
  barberId: string | null;
  serviceIds: string[];
}) {
  const [open, setOpen] = useState(false),
    [name, setName] = useState(""),
    [phone, setPhone] = useState(""),
    [email, setEmail] = useState(""),
    [channel, setChannel] = useState("phone"),
    [start, setStart] = useState("09:00"),
    [end, setEnd] = useState("19:00"),
    [consent, setConsent] = useState(false),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState(""),
    [done, setDone] = useState(false);
  return (
    <section className="mt-4">
      <button
        className="button-secondary"
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        Entrar na lista de espera
      </button>
      {open && (
        <form
          className="mt-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setNotice("");
            try {
              const { error } = await supabase.rpc("join_waitlist", {
                p_barbershop_id: getBarbershopId(),
                p_barber_id: barberId,
                p_service_ids: serviceIds,
                p_date: date,
                p_window_start: start,
                p_window_end: end,
                p_customer_name: name.trim(),
                p_phone: phone.trim(),
                p_email: email.trim() || null,
                p_contact_channel: channel,
                p_consent: consent,
              });
              if (error) throw error;
              setDone(true);
              setNotice(
                "Solicitação registrada. Nenhum horário está reservado e não há aviso automático. Fale com a barbearia para acompanhar.",
              );
            } catch (error) {
              reportSupabaseError("join_waitlist", error);
              setNotice(
                "Não foi possível entrar na lista de espera. Confira os dados ou fale com a barbearia.",
              );
            } finally {
              setBusy(false);
            }
          }}
        >
          <h3>Lista de espera · contato manual</h3>
          <p>
            Usaremos o serviço, o profissional e a data selecionados (
            {date.split("-").reverse().join("/")}). Não há envio automático.
            WhatsApp é uma integração futura.
          </p>
          <label className="field-label">
            Nome
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              maxLength={120}
            />
          </label>
          <label className="field-label">
            Telefone
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              minLength={8}
              maxLength={20}
            />
          </label>
          <label className="field-label">
            Contato permitido
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
            >
              <option value="phone">Telefone · contato manual</option>
              <option value="email">E-mail · contato manual</option>
            </select>
          </label>
          {channel === "email" && (
            <label className="field-label">
              E-mail
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                maxLength={254}
              />
            </label>
          )}
          <label className="field-label">
            A partir de
            <input
              type="time"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              required
            />
          </label>
          <label className="field-label">
            Até
            <input
              type="time"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              min={start}
              required
            />
          </label>
          <label className="choice">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              required
            />
            Autorizo contato manual sobre esta solicitação pelo meio escolhido.
            Isso não é consentimento para promoções.
          </label>
          <button
            className="cta"
            type="submit"
            disabled={busy || done || !consent || start >= end}
          >
            {busy
              ? "Registrando…"
              : done
                ? "Solicitação registrada"
                : "Registrar preferência"}
          </button>
          {notice && <p role="status">{notice}</p>}
        </form>
      )}
    </section>
  );
}
