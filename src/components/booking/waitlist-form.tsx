"use client";
import {RegionalText} from '@/components/regional/provider';
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
    [queueDate, setQueueDate] = useState(date),
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
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
  }).format(new Date());
  const latest = new Date(Date.parse(today + "T12:00Z") + 90 * 86400000)
    .toISOString()
    .slice(0, 10);
  return (
    <section className="mt-4">
      <button
        className="button-secondary"
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      ><RegionalText text="Entrar na lista de espera"/></button>
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
                p_date: queueDate,
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
          <h3><RegionalText text="Lista de espera · contato manual"/></h3>
          <p><RegionalText text="Usaremos o serviço e o profissional selecionados. Escolha a data e a janela abaixo; dias sem expediente compatível serão recusados. Não há aviso automático. WhatsApp é uma integração futura."/></p>
          <label className="field-label"><RegionalText text="Data desejada para a fila"/><input
              type="date"
              value={queueDate}
              min={today}
              max={latest}
              onChange={(e) => {
                setQueueDate(e.target.value);
                setDone(false);
                setNotice("");
              }}
              required
            />
          </label>
          <label className="field-label"><RegionalText text="Nome"/><input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              maxLength={120}
            />
          </label>
          <label className="field-label"><RegionalText text="Telefone"/><input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              minLength={8}
              maxLength={20}
            />
          </label>
          <label className="field-label"><RegionalText text="Contato permitido"/><select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
            >
              <option value="phone"><RegionalText text="Telefone · contato manual"/></option>
              <option value="email"><RegionalText text="E-mail · contato manual"/></option>
            </select>
          </label>
          {channel === "email" && (
            <label className="field-label"><RegionalText text="E-mail"/><input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                maxLength={254}
              />
            </label>
          )}
          <label className="field-label"><RegionalText text="A partir de"/><input
              type="time"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              required
            />
          </label>
          <label className="field-label"><RegionalText text="Até"/><input
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
            /><RegionalText text="Autorizo contato manual sobre esta solicitação pelo meio escolhido. Isso não é consentimento para promoções."/></label>
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
