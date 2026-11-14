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
export function LiveStep1({
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
      key="step1"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-8"
    >
      <div className="text-center">
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-text">
          Escolha o <span className="italic text-accent">Profissional</span>
        </h1>
        <p className="text-xs text-text-muted mt-2">
          Selecione quem irá cuidar do seu visual
        </p>
      </div>

      <div className="flex justify-center">
        <motion.button
          onClick={() => {
            setSelectedBarber({
              id: null,
              name: "Primeiro Disponível",
              bio: null,
            });
            setStep(2);
          }}
          className="inline-flex items-center gap-4 bg-surface hover:bg-surface-2 text-text px-8 py-4 rounded-full font-bold text-xs transition-all group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <span>Sem preferência (horário mais rápido)</span>
          <ChevronRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-10 pt-4">
        {barbers.map((b, i) => (
          <motion.div
            key={b.id || "nobarb"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => {
              setSelectedBarber(b);
              setStep(2);
            }}
            className="flex flex-col items-center group cursor-pointer"
          >
            <motion.div
              className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-surface-2 p-2 transition-all"
              whileHover={{ scale: 1.06 }}
            >
              <div className="w-full h-full rounded-full bg-surface flex items-center justify-center text-accent overflow-hidden font-serif text-2xl font-bold">
                {b.avatar_url ? (
                  <Image
                    width={128}
                    height={128}
                    unoptimized
                    src={b.avatar_url}
                    alt={b.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{b.name.charAt(0)}</span>
                )}
              </div>
            </motion.div>
            <h3 className="font-serif text-base font-bold text-text mt-4 group-hover:text-accent transition-colors">
              {b.name}
            </h3>
            <span className="text-xs text-text-muted">
              {b.bio || "Especialista"}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
