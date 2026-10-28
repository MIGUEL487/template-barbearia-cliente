"use client";
import type { Variants } from "motion/react";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { DemoBadge } from "@/components/demo-watermark";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Scissors,
  Calendar as CalendarIcon,
  Clock,
  User,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
  Download,
  Sparkles,
  Lock,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import {
  supabase,
  getBarbershopId,
  getMissingClientEnvVars,
} from "@/lib/supabase";
import {
  formatCurrency,
  formatDuration,
  formatLocalDate,
  fixMojibake,
} from "@/lib/utils";
import confetti from "canvas-confetti";

/* ─── animações ─── */
const pageVariants: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, y: -16, transition: { duration: 0.25 } },
};

const fadeUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

interface Barber {
  id: string | null;
  name: string;
  bio: string | null;
  avatar_url?: string | null;
}

interface Service {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price: number;
}

interface AvailabilitySlot {
  barber_id: string;
  start_time: string;
  end_time: string;
}

import type { useLiveBooking } from "./use-live-booking";
export function LiveStep4({
  state,
}: {
  state: ReturnType<typeof useLiveBooking>;
}) {
  const {
    step,
    setStep,
    barbers,
    setBarbers,
    services,
    setServices,
    depositPct,
    setDepositPct,
    isLoadingInitial,
    setIsLoadingInitial,
    errorBanner,
    setErrorBanner,
    selectedBarber,
    setSelectedBarber,
    selectedServices,
    setSelectedServices,
    selectedDate,
    setSelectedDate,
    selectedSlot,
    setSelectedSlot,
    availableSlots,
    setAvailableSlots,
    isLoadingSlots,
    setIsLoadingSlots,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    customerEmail,
    setCustomerEmail,
    paymentOption,
    setPaymentOption,
    paymentMethod,
    setPaymentMethod,
    acceptedTerms,
    setAcceptedTerms,
    marketingConsent,
    setMarketingConsent,
    isSubmitting,
    setIsSubmitting,
    bookingToken,
    setBookingToken,
    holdExpiresAt,
    setHoldExpiresAt,
    countdownSeconds,
    setCountdownSeconds,
    missingEnv,
    selectedBarberId,
    fetchAvailability,
    totalPrice,
    totalDuration,
    depositAmount,
    payNowAmount,
    payLaterAmount,
    toggleService,
    handleConfirmBooking,
    upcomingDays,
    stepsHeader,
  } = state;
  return (
    <motion.div
      key="step4"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
    >
      {/* Formulário */}
      <div className="md:col-span-7 bg-surface rounded-[28px] p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-hairline">
          <h2 className="font-serif text-xl font-bold text-text">Seus Dados</h2>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-xs font-semibold">
            <Lock className="w-3 h-3" />
            <span>Seguro</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-2 ml-2">
              Nome Completo *
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Seu nome"
              className="w-full bg-surface-2 rounded-full px-6 py-4 text-xs text-text focus:ring-2 focus:ring-accent focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted mb-2 ml-2">
              WhatsApp / Telefone *
            </label>
            <input
              type="text"
              required
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="(11) 99999-9999"
              className="w-full bg-surface-2 rounded-full px-6 py-4 text-xs text-text focus:ring-2 focus:ring-accent focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted mb-2 ml-2">
              E-mail (confirmação)
            </label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
              className="w-full bg-surface-2 rounded-full px-6 py-4 text-xs text-text focus:ring-2 focus:ring-accent focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Pagamento */}
        <div className="pt-4 border-t border-hairline">
          <label className="block text-xs font-semibold text-text-muted mb-2 ml-2">
            Condição de Pagamento
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPaymentOption("deposit")}
              className={`py-4 px-4 rounded-[20px] text-xs font-bold transition-all text-left flex flex-col ${
                paymentOption === "deposit"
                  ? "bg-accent/10 text-accent ring-1 ring-accent/30"
                  : "bg-surface-2 text-text-muted hover:text-text"
              }`}
            >
              <span>Sinal ({depositPct}%)</span>
              <strong className="font-serif text-sm mt-2">
                {formatCurrency(depositAmount)}
              </strong>
            </button>

            <button
              type="button"
              onClick={() => setPaymentOption("full")}
              className={`py-4 px-4 rounded-[20px] text-xs font-bold transition-all text-left flex flex-col ${
                paymentOption === "full"
                  ? "bg-accent/10 text-accent ring-1 ring-accent/30"
                  : "bg-surface-2 text-text-muted hover:text-text"
              }`}
            >
              <span>Total (100%)</span>
              <strong className="font-serif text-sm mt-2">
                {formatCurrency(totalPrice)}
              </strong>
            </button>
          </div>
        </div>

        {/* Termos */}
        <div className="space-y-4 pt-4 border-t border-hairline text-xs">
          <label className="flex items-start gap-4 cursor-pointer">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-2 rounded accent-accent"
            />
            <span className="text-text-muted">
              Concordo com os Termos de Uso e a Política de Cancelamento.
            </span>
          </label>

          <label className="flex items-start gap-4 cursor-pointer">
            <input
              type="checkbox"
              checked={marketingConsent}
              onChange={(e) => setMarketingConsent(e.target.checked)}
              className="mt-2 rounded accent-accent"
            />
            <span className="text-text-muted">
              Aceito receber lembretes e promoções via WhatsApp.
            </span>
          </label>
        </div>

        <motion.button
          onClick={handleConfirmBooking}
          disabled={isSubmitting || !acceptedTerms}
          className="w-full bg-accent hover:bg-accent-hover text-accent-contrast py-4 rounded-full font-bold text-sm transition-all disabled:opacity-40"
          whileTap={{ scale: 0.97 }}
        >
          {isSubmitting ? "Reservando..." : "Confirmar Reserva"}
        </motion.button>
      </div>

      {/* Resumo */}
      <div className="md:col-span-5 bg-surface-2 rounded-[28px] p-8 space-y-6">
        <h3 className="font-serif text-lg font-bold text-text pb-4 border-b border-hairline">
          Resumo
        </h3>

        <div className="space-y-4 text-xs">
          <div>
            <span className="text-text-muted block text-xs">Profissional</span>
            <strong className="text-text font-serif text-sm">
              {selectedBarber?.name || "Primeiro Disponível"}
            </strong>
          </div>

          <div>
            <span className="text-text-muted block text-xs">
              Data & Horário
            </span>
            <strong className="text-text font-mono text-sm">
              {new Date(selectedDate + "T12:00:00").toLocaleDateString("pt-BR")}{" "}
              às{" "}
              {selectedSlot
                ? new Date(selectedSlot.start_time).toLocaleTimeString(
                    "pt-BR",
                    {
                      timeZone: "America/Sao_Paulo",
                hour: "2-digit",
                      minute: "2-digit",
                    },
                  )
                : "--:--"}
            </strong>
          </div>

          <div>
            <span className="text-text-muted block text-xs mb-2">Serviços</span>
            <div className="space-y-2">
              {selectedServices.map((s) => (
                <div key={s.id} className="flex justify-between text-text">
                  <span>{s.name}</span>
                  <span className="font-serif font-bold text-accent">
                    {formatCurrency(s.price)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-hairline space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-text-muted">Valor Total:</span>
              <span className="font-serif font-bold text-text">
                {formatCurrency(totalPrice)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-accent font-semibold">Paga agora:</span>
              <span className="font-serif font-bold text-accent">
                {formatCurrency(payNowAmount)}
              </span>
            </div>
            {payLaterAmount > 0 && (
              <div className="flex justify-between text-xs text-text-muted">
                <span>Resta no local:</span>
                <span className="font-mono">
                  {formatCurrency(payLaterAmount)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
