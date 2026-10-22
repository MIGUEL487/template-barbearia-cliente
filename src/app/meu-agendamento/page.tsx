"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
  Search,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

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
    <main className="min-h-screen bg-bg text-text">
      {/* Header Fixo */}
      <header className="fixed top-0 inset-x-0 z-50 bg-bg/80 backdrop-blur-xl border-b border-hairline">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-text-muted hover:text-text text-xs font-medium transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Voltar</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-serif font-bold text-text">
            <Scissors className="w-4 h-4 text-accent" />
            <span>Meu Agendamento</span>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 pt-24 pb-12 space-y-6">
        {/* Busca por Token */}
        <motion.div
          className="bg-surface rounded-[28px] p-8 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <h1 className="font-serif text-2xl font-bold text-text">Consultar Reserva</h1>
            <p className="text-xs text-text-muted mt-1">
              Digite ou cole o código que você recebeu ao confirmar.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Cole seu código de reserva aqui..."
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="flex-1 bg-surface-2 rounded-full px-6 py-3.5 text-xs text-text focus:ring-2 focus:ring-accent focus:outline-none transition-all"
            />
            <motion.button
              onClick={() => setActiveToken(tokenInput)}
              className="bg-accent hover:bg-accent-hover text-accent-contrast px-8 py-3.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2"
              whileTap={{ scale: 0.95 }}
            >
              <Search className="w-4 h-4" />
              <span>Consultar</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Mensagem de Status */}
        <AnimatePresence>
          {statusMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`p-4 rounded-[20px] text-xs flex items-center gap-2.5 ${
                statusMessage.type === "success"
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-danger/10 text-danger"
              }`}
            >
              {statusMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading && (
          <div className="flex justify-center py-8">
            <span className="w-7 h-7 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Detalhes do Agendamento */}
        <AnimatePresence>
          {booking && (
            <motion.div
              className="bg-surface rounded-[28px] p-8 space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex justify-between items-start pb-5 border-b border-hairline">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted block mb-1">
                    Status da Reserva
                  </span>
                  <span
                    className={`inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      booking.status === "confirmed"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : booking.status === "hold"
                        ? "bg-accent/10 text-accent"
                        : "bg-danger/15 text-danger"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-text-muted block mb-1">Valor Total</span>
                  <strong className="text-accent font-serif text-xl">{formatCurrency(booking.total_price)}</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-surface-2 rounded-[20px] p-4">
                  <span className="text-text-muted block text-[11px] mb-0.5">Cliente</span>
                  <strong className="text-text text-sm font-serif">{booking.customer_name}</strong>
                </div>

                <div className="bg-surface-2 rounded-[20px] p-4">
                  <span className="text-text-muted block text-[11px] mb-0.5">Profissional</span>
                  <strong className="text-text text-sm font-serif">{booking.barber_name}</strong>
                </div>

                <div className="sm:col-span-2 bg-surface-2 rounded-[20px] p-4">
                  <span className="text-text-muted block text-[11px] mb-0.5">Data e Horário</span>
                  <strong className="text-text text-sm font-mono">
                    {new Date(booking.starts_at).toLocaleString("pt-BR", { dateStyle: "long", timeStyle: "short" })}
                  </strong>
                </div>

                <div className="sm:col-span-2 bg-surface-2 rounded-[20px] p-4">
                  <span className="text-text-muted block text-[11px] mb-0.5">Serviços</span>
                  <span className="text-text font-semibold">{booking.services?.join(", ")}</span>
                </div>
              </div>

              {/* Reagendamento */}
              <AnimatePresence>
                {isRescheduling && (
                  <motion.div
                    className="p-6 bg-surface-2 rounded-[24px] space-y-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <h4 className="font-serif font-bold text-sm text-text">Nova Data e Horário:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="bg-surface rounded-full px-5 py-2.5 text-xs text-text focus:ring-2 focus:ring-accent focus:outline-none"
                      />
                      <input
                        type="time"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        className="bg-surface rounded-full px-5 py-2.5 text-xs text-text focus:ring-2 focus:ring-accent focus:outline-none"
                      />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        onClick={() => setIsRescheduling(false)}
                        className="px-5 py-2 text-xs font-semibold text-text-muted hover:text-text rounded-full"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleReschedule}
                        className="bg-accent hover:bg-accent-hover text-accent-contrast px-6 py-2.5 rounded-full text-xs font-bold transition-all active:scale-95"
                      >
                        Confirmar Novo Horário
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Ações */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-hairline">
                {booking.can_reschedule && !isRescheduling && (
                  <motion.button
                    onClick={() => setIsRescheduling(true)}
                    className="bg-surface-2 hover:bg-surface-3 text-text px-6 py-2.5 rounded-full text-xs font-bold transition-colors"
                    whileTap={{ scale: 0.95 }}
                  >
                    Reagendar
                  </motion.button>
                )}

                {booking.can_cancel && (
                  <motion.button
                    onClick={handleCancel}
                    className="bg-danger/15 hover:bg-danger/25 text-danger px-6 py-2.5 rounded-full text-xs font-bold transition-colors"
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancelar
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
