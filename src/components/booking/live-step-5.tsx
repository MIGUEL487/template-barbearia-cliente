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
export function LiveStep5({
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
      key="step5"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-xl mx-auto"
    >
      <motion.div
        className="bg-surface rounded-[32px] p-10 md:p-14 text-center space-y-6"
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="w-16 h-16 rounded-full bg-accent/15 text-accent mx-auto flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
        >
          <Check className="w-8 h-8 stroke-[3]" />
        </motion.div>

        <div>
          <h2 className="font-serif text-3xl font-bold text-text mb-2">
            Pré-reserva criada <DemoBadge/>
          </h2>
          <p className="text-xs text-text-muted">
            Seu horário está separado por 15 minutos. A confirmação do pagamento ainda está pendente. Fale com a barbearia para concluir.
          </p>
        </div>

        <div className="bg-surface-2 rounded-[20px] p-4 text-xs font-mono">
          <span className="text-text-muted block text-xs uppercase font-sans mb-2">
            Token
          </span>
          <strong className="text-accent text-sm select-all">
            {bookingToken}
          </strong>
        </div>

        {holdExpiresAt && countdownSeconds > 0 && (
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-xs font-semibold font-mono">
            <Clock className="w-4 h-4" />
            <span>
              Reserva ativa: {Math.floor(countdownSeconds / 60)}:
              {String(countdownSeconds % 60).padStart(2, "0")}
            </span>
          </div>
        )}

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={`/meu-agendamento?token=${bookingToken}`}
            className="w-full sm:w-auto bg-accent hover:bg-accent-hover text-accent-contrast px-6 py-4 rounded-full font-bold text-xs transition-all active:scale-95"
          >
            Ver Meu Agendamento
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto bg-surface-2 hover:bg-surface-3 text-text px-6 py-4 rounded-full font-semibold text-xs transition-colors"
          >
            Voltar à Página Inicial
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
