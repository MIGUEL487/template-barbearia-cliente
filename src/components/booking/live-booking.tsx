"use client";
import type { Variants } from "framer-motion";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { DemoBadge } from "@/components/demo-watermark";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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

import { useLiveBooking } from "./use-live-booking";
import { LiveStep1 } from "./live-step-1";
import { LiveStep2 } from "./live-step-2";
import { LiveStep3 } from "./live-step-3";
import { LiveStep4 } from "./live-step-4";
import { LiveStep5 } from "./live-step-5";

export default function LiveBooking() {
  const state = useLiveBooking();
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
    <main className="min-h-screen bg-bg text-text pb-32">
      {/* Header Fixo */}
      <header className="fixed top-0 inset-x-0 z-50 bg-bg  border-b border-hairline">
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
            <span>Agendamento</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 pt-24">
        {/* Indicador de Etapas */}
        {step <= 4 && (
          <div className="mb-12">
            <div className="flex items-center justify-between relative max-w-xl mx-auto">
              <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-[2px] bg-surface-2 -z-0" />
              {stepsHeader.map((s) => {
                const isActive = step === s.num;
                const isPast = step > s.num;
                return (
                  <div
                    key={s.num}
                    className="relative z-10 flex flex-col items-center"
                  >
                    <motion.button
                      onClick={() => isPast && setStep(s.num as any)}
                      disabled={!isPast}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isActive
                          ? "bg-accent text-accent-contrast shadow-glow scale-110"
                          : isPast
                            ? "bg-accent/20 text-accent cursor-pointer"
                            : "bg-surface-2 text-text-muted cursor-not-allowed"
                      }`}
                      whileTap={isPast ? { scale: 0.92 } : undefined}
                    >
                      {isPast ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : (
                        s.num
                      )}
                    </motion.button>
                    <span
                      className={`text-xs font-semibold mt-2 ${
                        isActive
                          ? "text-accent"
                          : isPast
                            ? "text-text"
                            : "text-text-muted"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Chip do Barbeiro */}
        {step > 1 && step <= 4 && selectedBarber && (
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-3 bg-surface-2 px-5 py-2 rounded-full text-xs">
              <span className="text-text-muted">Profissional:</span>
              <strong className="text-text font-serif">
                {selectedBarber.name}
              </strong>
              <button
                onClick={() => setStep(1)}
                className="text-accent hover:underline font-bold text-xs ml-1"
              >
                Trocar
              </button>
            </div>
          </motion.div>
        )}

        {/* Erro */}
        {errorBanner && (
          <motion.div
            className="mb-8 p-4 rounded-[20px] bg-danger/10 text-danger text-xs flex items-center gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="flex-1">{errorBanner}</span>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {/* ETAPA 1 */}
          {step === 1 && <LiveStep1 key="step1" state={state} />}

          {/* ETAPA 2 */}
          {step === 2 && <LiveStep2 key="step2" state={state} />}

          {/* ETAPA 3 */}
          {step === 3 && <LiveStep3 key="step3" state={state} />}

          {/* ETAPA 4 */}
          {step === 4 && <LiveStep4 key="step4" state={state} />}

          {/* ETAPA 5 */}
          {step === 5 && <LiveStep5 key="step5" state={state} />}
        </AnimatePresence>
      </div>

      {/* Barra Inferior Fixa Global para Etapas 2 e 3 (fora do AnimatePresence com transform dos steps) */}
      <AnimatePresence>
        {(step === 2 || step === 3) && (
          <motion.div
            key="bottom-floating-bar"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-6 inset-x-0 z-40 flex justify-center px-4 pointer-events-none"
          >
            <div className="w-full max-w-2xl bg-bg/90  border border-hairline rounded-full px-6 py-3.5 flex items-center justify-between shadow-soft pointer-events-auto">
              <AnimatePresence mode="wait">
                {step === 2 && <LiveStep2 key="step2" state={state} />}

                {step === 3 && <LiveStep3 key="step3" state={state} />}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
