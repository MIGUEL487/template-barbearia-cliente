"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Scissors,
  Calendar,
  Clock,
  User,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";

interface BookingDetail {
  id: string;
  status: string;
  starts_at: string;
  ends_at: string;
  barber_name: string;
  customer_name: string;
  services: string[];
  total_price: number;
  deposit_amount: number;
  can_cancel: boolean;
  can_reschedule: boolean;
}

function MeuAgendamentoContent() {
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get("token") || "";

  const [tokenInput, setTokenInput] = useState(tokenParam);
  const [activeToken, setActiveToken] = useState(tokenParam);
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Reagendamento
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const loadBooking = async (tok: string) => {
    if (!tok || tok.trim() === "") return;
    setIsLoading(true);
    setStatusMessage(null);

    try {
      const { data, error } = await supabase.rpc("get_booking_by_token", {
        p_token: tok.trim(),
      });

      if (error) throw error;
      setBooking(data as BookingDetail);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Agendamento não encontrado ou token inválido";
      setStatusMessage({ type: "error", text: msg });
      setBooking(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeToken) {
      loadBooking(activeToken);
    }
  }, [activeToken]);

  const handleCancel = async () => {
    if (!confirm("Deseja realmente cancelar este agendamento?")) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase.rpc("cancel_booking_by_token", {
        p_token: activeToken,
        p_reason: "Cancelado pelo cliente via portal",
      });

      if (error) throw error;
      setStatusMessage({ type: "success", text: "Agendamento cancelado com sucesso." });
      loadBooking(activeToken);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Falha ao cancelar";
      setStatusMessage({ type: "error", text: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReschedule = async () => {
    if (!newDate || !newTime) {
      alert("Selecione a nova data e horário.");
      return;
    }

    setIsLoading(true);
    const newStartsAt = `${newDate}T${newTime}:00`;

    try {
      const { data, error } = await supabase.rpc("reschedule_booking_by_token", {
        p_token: activeToken,
        p_new_starts_at: newStartsAt,
      });

      if (error) throw error;
      setStatusMessage({ type: "success", text: "Agendamento reagendado com sucesso!" });
      setIsRescheduling(false);
      loadBooking(activeToken);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Falha ao reagendar";
      setStatusMessage({ type: "error", text: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-bg text-text py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text font-medium">
            <ChevronLeft className="w-4 h-4 text-accent" />
            <span>Voltar ao site</span>
          </Link>

          <div className="flex items-center gap-2">
            <Scissors className="w-4 h-4 text-accent" />
            <span className="font-serif font-bold text-sm">Barbearia Premium</span>
          </div>
        </div>

        <div className="bg-surface border border-border p-6 rounded-md shadow-card">
          <h1 className="font-serif text-2xl font-bold text-text mb-1">Meu Agendamento</h1>
          <p className="text-xs text-text-muted mb-4">
            Consulte, reagende ou cancele sua reserva utilizando o código seguro recebido.
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Cole seu código ou token de reserva aqui..."
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="flex-1 bg-surface-2 border border-border rounded-sm px-3.5 py-2 text-xs text-text outline-none focus:border-accent"
            />
            <button
              onClick={() => setActiveToken(tokenInput)}
              className="bg-accent hover:bg-accent-hover text-accent-contrast px-4 py-2 rounded-sm text-xs font-bold transition-all"
            >
              Consultar
            </button>
          </div>
        </div>

        {statusMessage && (
          <div
            className={`p-4 rounded-sm text-xs flex items-start gap-2.5 ${
              statusMessage.type === "success"
                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                : "bg-danger/10 border border-danger/30 text-danger"
            }`}
          >
            {statusMessage.type === "success" ? <CheckCircle2 className="w-4 h-4 mt-0.5" /> : <AlertCircle className="w-4 h-4 mt-0.5" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center py-8">
            <span className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {booking && (
          <div className="bg-surface border border-accent/40 rounded-lg p-6 shadow-premium space-y-5">
            <div className="flex justify-between items-start border-b border-border pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted">Status do Agendamento</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`w-2.5 h-2.5 rounded-full ${booking.status === "confirmed" ? "bg-emerald-400" : booking.status === "hold" ? "bg-amber-400" : "bg-danger"}`} />
                  <strong className="text-base font-serif capitalize text-text">{booking.status}</strong>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-text-muted block">Valor Total</span>
                <strong className="text-accent text-base">{formatCurrency(booking.total_price)}</strong>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-text-muted block">Cliente:</span>
                <strong className="text-text">{booking.customer_name}</strong>
              </div>
              <div>
                <span className="text-text-muted block">Profissional:</span>
                <strong className="text-text">{booking.barber_name}</strong>
              </div>
              <div className="col-span-2">
                <span className="text-text-muted block">Data e Horário:</span>
                <strong className="text-text">{new Date(booking.starts_at).toLocaleString("pt-BR")}</strong>
              </div>
              <div className="col-span-2">
                <span className="text-text-muted block">Serviços:</span>
                <span className="text-text font-medium">{booking.services?.join(", ")}</span>
              </div>
            </div>

            {/* Reagendamento Modal/Form */}
            {isRescheduling && (
              <div className="p-4 bg-surface-2 border border-border rounded-sm space-y-3">
                <h4 className="font-semibold text-xs text-text">Escolha a Nova Data e Horário:</h4>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="bg-surface border border-border rounded-sm px-2.5 py-1.5 text-xs text-text outline-none"
                  />
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="bg-surface border border-border rounded-sm px-2.5 py-1.5 text-xs text-text outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => setIsRescheduling(false)}
                    className="px-3 py-1 border border-border rounded-sm text-xs hover:bg-surface"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleReschedule}
                    className="bg-accent hover:bg-accent-hover text-accent-contrast px-3 py-1 rounded-sm text-xs font-bold"
                  >
                    Confirmar Novo Horário
                  </button>
                </div>
              </div>
            )}

            {/* Ações */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              {booking.can_reschedule && !isRescheduling && (
                <button
                  onClick={() => setIsRescheduling(true)}
                  className="px-4 py-2 border border-border rounded-sm text-xs font-semibold hover:bg-surface-2 text-text transition-colors"
                >
                  Reagendar Horário
                </button>
              )}

              {booking.can_cancel && (
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-danger/10 hover:bg-danger/20 text-danger border border-danger/30 rounded-sm text-xs font-semibold transition-colors"
                >
                  Cancelar Agendamento
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function MeuAgendamentoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg text-text flex items-center justify-center">
          <div className="text-xs text-text-muted">Carregando agendamento...</div>
        </div>
      }
    >
      <MeuAgendamentoContent />
    </Suspense>
  );
}
