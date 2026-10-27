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

export function useLiveBooking() {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Dados do Banco
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [depositPct, setDepositPct] = useState<number>(50);
  const [isLoadingInitial, setIsLoadingInitial] = useState<boolean>(true);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  // Seleções do Usuário
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    const currentHour = today.getHours();
    const currentMin = today.getMinutes();
    const isPastCutoff =
      currentHour > 18 || (currentHour === 18 && currentMin >= 30);
    const isSunday = today.getDay() === 0;

    // Se hoje for domingo ou já passou das 18h30, inicializa no próximo dia de atendimento
    if (isSunday || isPastCutoff) {
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + 1);
      if (nextDay.getDay() === 0) {
        nextDay.setDate(nextDay.getDate() + 1); // Pula domingo para segunda-feira
      }
      return formatLocalDate(nextDay);
    }
    return formatLocalDate(today);
  });
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(
    null,
  );
  const [availableSlots, setAvailableSlots] = useState<AvailabilitySlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(false);

  // Checkout
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [paymentOption, setPaymentOption] = useState<
    "deposit" | "full" | "in_person"
  >("deposit");
  const [paymentMethod, setPaymentMethod] = useState<
    "pix" | "credit_card" | "cash"
  >("pix");
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
  const [marketingConsent, setMarketingConsent] = useState<boolean>(false);

  // Confirmação
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingToken, setBookingToken] = useState<string>("");
  const [holdExpiresAt, setHoldExpiresAt] = useState<string | null>(null);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(600);

  const missingEnv = useMemo(() => getMissingClientEnvVars(), []);

  useEffect(() => {
    if (missingEnv.length > 0) {
      setErrorBanner(`Configuração pendente: ${missingEnv.join(", ")}`);
      setIsLoadingInitial(false);
      return;
    }

    async function fetchInitialData() {
      try {
        const shopId = getBarbershopId();

        const { data: bData } = await supabase
          .from("public_barbers")
          .select("id, name, bio, avatar_url")
          .eq("barbershop_id", shopId);

        if (bData) {
          const cleaned = bData.map((b) => ({
            ...b,
            name: fixMojibake(b.name),
            bio: b.bio ? fixMojibake(b.bio) : null,
          }));
          setBarbers(cleaned);
        }

        const { data: sData } = await supabase
          .from("public_services")
          .select("id, name, description, duration_minutes, price")
          .eq("barbershop_id", shopId)
          .order("price", { ascending: true });

        if (sData) {
          const cleaned = sData.map((s) => ({
            ...s,
            name: fixMojibake(s.name),
            description: s.description ? fixMojibake(s.description) : null,
          }));
          setServices(cleaned);
          setSelectedServices((prev) =>
            prev.length === 0 && cleaned.length > 0 ? [cleaned[0]] : prev,
          );
        }

        const { data: setRes } = await supabase
          .from("public_site_settings")
          .select("deposit_percentage")
          .eq("barbershop_id", shopId)
          .maybeSingle();

        if (setRes && setRes.deposit_percentage) {
          setDepositPct(Number(setRes.deposit_percentage));
        }
      } catch (err: unknown) {
        console.error(err);
      } finally {
        setIsLoadingInitial(false);
      }
    }

    fetchInitialData();
  }, [missingEnv]);

  const selectedBarberId = selectedBarber?.id || null;

  const fetchAvailability = useCallback(async () => {
    if (!selectedDate || selectedServices.length === 0) return;

    setIsLoadingSlots(true);
    setSelectedSlot(null);
    setErrorBanner(null);

    try {
      const shopId = getBarbershopId();
      const serviceIds = selectedServices.map((s) => s.id);

      // Tenta chamar a RPC get_availability do Supabase
      const { data, error } = await supabase.rpc("get_availability", {
        p_barbershop_id: shopId,
        p_barber_id: selectedBarberId,
        p_date: selectedDate,
        p_service_ids: serviceIds,
      });

      if (!error && data && Array.isArray(data) && data.length > 0) {
        setAvailableSlots(data as AvailabilitySlot[]);
        return;
      }

      setAvailableSlots([]);
      if (error)
        setErrorBanner(
          "Não foi possível consultar horários. Tente novamente ou fale com a barbearia.",
        );
    } catch (err: unknown) {
      console.warn("Aviso ao carregar horários:", err);
      setAvailableSlots([]);
    } finally {
      setIsLoadingSlots(false);
    }
  }, [selectedBarberId, selectedDate, selectedServices]);

  useEffect(() => {
    if (step === 3) {
      fetchAvailability();
    }
  }, [step, fetchAvailability]);

  // Contagem regressiva de Hold
  useEffect(() => {
    if (step === 5 && holdExpiresAt) {
      const targetTime = new Date(holdExpiresAt).getTime();
      const interval = setInterval(() => {
        const diff = Math.max(0, Math.floor((targetTime - Date.now()) / 1000));
        setCountdownSeconds(diff);
        if (diff === 0) clearInterval(interval);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, holdExpiresAt]);

  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce(
    (sum, s) => sum + s.duration_minutes,
    0,
  );
  const depositAmount = Math.round(totalPrice * (depositPct / 100) * 100) / 100;
  const payNowAmount =
    paymentOption === "full"
      ? totalPrice
      : paymentOption === "deposit"
        ? depositAmount
        : 0;
  const payLaterAmount = totalPrice - payNowAmount;

  const toggleService = (service: Service) => {
    if (selectedServices.some((s) => s.id === service.id)) {
      if (selectedServices.length > 1) {
        setSelectedServices(
          selectedServices.filter((s) => s.id !== service.id),
        );
      }
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleConfirmBooking = async () => {
    if (!customerName.trim() || !customerPhone.trim() || !acceptedTerms) {
      setErrorBanner(
        "Preencha seu nome, WhatsApp e aceite os termos para continuar.",
      );
      return;
    }

    if (!selectedSlot) {
      setErrorBanner("Selecione um horário disponível.");
      return;
    }

    setIsSubmitting(true);
    setErrorBanner(null);

    try {
      const shopId = getBarbershopId();
      const serviceIds = selectedServices.map((s) => s.id);

      // Validação de UUID para evitar erro 22P02 no PostgreSQL se for "default-barber" ou outro placeholder
      const isValidUUID = (id: string | null | undefined): id is string =>
        typeof id === "string" &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          id,
        );

      const targetBarber = isValidUUID(selectedSlot.barber_id)
        ? selectedSlot.barber_id
        : isValidUUID(selectedBarber?.id)
          ? selectedBarber.id
          : null;

      const { data, error } = await supabase.rpc("create_booking_hold", {
        p_barbershop_id: shopId,
        p_barber_id: targetBarber,
        p_starts_at: selectedSlot.start_time,
        p_service_ids: serviceIds,
        p_customer_name: customerName.trim(),
        p_customer_phone: customerPhone.trim(),
        p_customer_email: customerEmail?.trim() || null,
        p_marketing_consent: Boolean(marketingConsent),
      });

      if (error) {
        if (
          error.message.includes("ocupado") ||
          error.message.includes("reservado")
        ) {
          setErrorBanner(
            "Esse horário acabou de ser reservado por outro cliente. Por favor, escolha outro.",
          );
          setStep(3);
          fetchAvailability();
          setIsSubmitting(false);
          return;
        }
        if (
          error.message.includes("ambiguous") ||
          error.message.includes("gen_random_bytes") ||
          error.message.includes("PGRST202")
        ) {
          setErrorBanner(
            "Aviso: O banco de dados Supabase precisa executar o script atualizar_banco_supabase.sql no SQL Editor para ativar as funções de agendamento.",
          );
          setIsSubmitting(false);
          return;
        }
        throw error;
      }

      if (data) {
        setBookingToken(data.token || data.cancellation_token || "");
        setHoldExpiresAt(data.hold_expires_at);
        setStep(5);
        try {
          if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches)
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.6 },
              colors: ["#C8C2B8", "#F0EDE6", "#8A8580"],
            });
        } catch {
          // confetti opcional
        }
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Erro ao processar agendamento.";
      setErrorBanner(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gerador de datas próximas (memoizado para performance e estabilidade de render)
  const upcomingDays = useMemo(() => {
    const days: {
      iso: string;
      dayNum: number;
      weekDay: string;
      isToday: boolean;
    }[] = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      days.push({
        iso: formatLocalDate(d),
        dayNum: d.getDate(),
        weekDay: d
          .toLocaleDateString("pt-BR", { weekday: "short" })
          .replace(".", ""),
        isToday: i === 0,
      });
    }
    return days;
  }, []);

  const stepsHeader = [
    { num: 1, label: "Profissional" },
    { num: 2, label: "Serviço" },
    { num: 3, label: "Horário" },
    { num: 4, label: "Confirmar" },
  ];

  return {
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
  };
}
