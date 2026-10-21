"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
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
import { supabase, getBarbershopId, getMissingClientEnvVars } from "@/lib/supabase";
import { formatCurrency, formatDuration } from "@/lib/utils";
import confetti from "canvas-confetti";

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

export default function AgendarPage() {
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
    return today.toISOString().split("T")[0];
  });
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [availableSlots, setAvailableSlots] = useState<AvailabilitySlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(false);

  // Checkout
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [paymentOption, setPaymentOption] = useState<"deposit" | "full" | "in_person">("deposit");
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "credit_card" | "cash">("pix");
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
  const [marketingConsent, setMarketingConsent] = useState<boolean>(false);

  // Confirmação
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingToken, setBookingToken] = useState<string>("");
  const [holdExpiresAt, setHoldExpiresAt] = useState<string | null>(null);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(600);

  const missingEnv = getMissingClientEnvVars();

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

        if (bData) setBarbers(bData);

        const { data: sData } = await supabase
          .from("public_services")
          .select("id, name, description, duration_minutes, price")
          .eq("barbershop_id", shopId)
          .order("price", { ascending: true });

        if (sData) {
          setServices(sData);
          if (sData.length > 0 && selectedServices.length === 0) {
            setSelectedServices([sData[0]]);
          }
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

  const fetchAvailability = useCallback(async () => {
    if (!selectedDate || selectedServices.length === 0) return;

    setIsLoadingSlots(true);
    setSelectedSlot(null);
    setErrorBanner(null);

    try {
      const shopId = getBarbershopId();
      const serviceIds = selectedServices.map((s) => s.id);

      const { data, error } = await supabase.rpc("get_availability", {
        p_barbershop_id: shopId,
        p_barber_id: selectedBarber?.id || null,
        p_date: selectedDate,
        p_service_ids: serviceIds,
      });

      if (error) throw error;
      setAvailableSlots((data as AvailabilitySlot[]) || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao carregar horários";
      setErrorBanner(msg);
    } finally {
      setIsLoadingSlots(false);
    }
  }, [selectedBarber, selectedServices, selectedDate]);

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
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration_minutes, 0);
  const depositAmount = Math.round(totalPrice * (depositPct / 100) * 100) / 100;
  const payNowAmount =
    paymentOption === "full" ? totalPrice : paymentOption === "deposit" ? depositAmount : 0;
  const payLaterAmount = totalPrice - payNowAmount;

  const toggleService = (service: Service) => {
    if (selectedServices.some((s) => s.id === service.id)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
      }
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleConfirmBooking = async () => {
    if (!customerName.trim() || !customerPhone.trim() || !acceptedTerms) {
      setErrorBanner("Preencha seu nome, WhatsApp e aceite os termos para continuar.");
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

      const { data, error } = await supabase.rpc("create_booking_hold", {
        p_barbershop_id: shopId,
        p_barber_id: selectedSlot.barber_id || selectedBarber?.id || null,
        p_starts_at: selectedSlot.start_time,
        p_service_ids: serviceIds,
        p_customer_name: customerName,
        p_customer_phone: customerPhone,
        p_customer_email: customerEmail || undefined,
        p_marketing_consent: marketingConsent,
      });

      if (error) {
        if (error.message.includes("ocupado") || error.message.includes("reservado")) {
          setErrorBanner("Esse horário acabou de ser reservado por outro cliente. Por favor, escolha outro.");
          setStep(3);
          fetchAvailability();
          setIsSubmitting(false);
          return;
        }
        throw error;
      }

      if (data) {
        setBookingToken(data.token);
        setHoldExpiresAt(data.hold_expires_at);
        setStep(5);
        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
            colors: ["#F5A524", "#F4F1EA", "#E09015"],
          });
        } catch {
          // confetti opcional
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao processar agendamento.";
      setErrorBanner(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gerador simples de datas próximas para o calendário circular
  const getUpcomingDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      days.push({
        iso: d.toISOString().split("T")[0],
        dayNum: d.getDate(),
        weekDay: d.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", ""),
        isToday: i === 0,
      });
    }
    return days;
  };

  const stepsHeader = [
    { num: 1, label: "Profissional" },
    { num: 2, label: "Serviço" },
    { num: 3, label: "Horário" },
    { num: 4, label: "Confirmar" },
  ];

  return (
    <main className="min-h-screen bg-bg text-text pb-32">
      {/* Barra Superior em Pílula Flutuante */}
      <header className="pt-6 px-4 max-w-5xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-surface-2 hover:bg-surface-3 text-text px-5 py-2.5 rounded-full text-xs font-semibold transition-colors shadow-sm"
        >
          <ChevronLeft className="w-4 h-4 text-accent" />
          <span>Voltar ao início</span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-serif font-bold text-text">
          <Scissors className="w-4 h-4 text-accent" />
          <span>Agendamento Online</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 pt-10">
        {/* Indicador de Etapas (Stepper com Linhas e Círculos) */}
        {step <= 4 && (
          <div className="mb-12">
            <div className="flex items-center justify-between relative max-w-xl mx-auto">
              <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-[2px] bg-surface-2 -z-0" />
              {stepsHeader.map((s) => {
                const isActive = step === s.num;
                const isPast = step > s.num;
                return (
                  <div key={s.num} className="relative z-10 flex flex-col items-center">
                    <button
                      onClick={() => isPast && setStep(s.num as any)}
                      disabled={!isPast}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                        isActive
                          ? "bg-accent text-accent-contrast shadow-glow scale-110"
                          : isPast
                          ? "bg-accent/20 text-accent cursor-pointer"
                          : "bg-surface-2 text-text-muted cursor-not-allowed"
                      }`}
                    >
                      {isPast ? <Check className="w-4 h-4 stroke-[3]" /> : s.num}
                    </button>
                    <span
                      className={`text-[11px] font-semibold mt-2 ${
                        isActive ? "text-accent" : isPast ? "text-text" : "text-text-muted"
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

        {/* Chip Flutuante do Barbeiro Selecionado */}
        {step > 1 && step <= 4 && selectedBarber && (
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-3 bg-surface-2 px-5 py-2 rounded-full text-xs shadow-sm">
              <span className="text-text-muted">Profissional selecionado:</span>
              <strong className="text-text font-serif">{selectedBarber.name}</strong>
              <button
                onClick={() => setStep(1)}
                className="text-accent hover:underline font-bold text-[11px] ml-1"
              >
                Trocar
              </button>
            </div>
          </div>
        )}

        {/* Alerta de Erro */}
        {errorBanner && (
          <div className="mb-8 p-4 rounded-[20px] bg-danger/10 text-danger text-xs flex items-center gap-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="flex-1">{errorBanner}</span>
          </div>
        )}

        {/* ETAPA 1: PROFISSIONAL */}
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in">
            <div className="text-center">
              <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-text">
                Escolha o <span className="italic text-accent">Profissional</span>
              </h1>
              <p className="text-xs text-text-muted mt-2">
                Selecione quem irá cuidar do seu visual ou agende com quem tiver a agenda mais rápida
              </p>
            </div>

            {/* Opção Rápida: Sem Preferência */}
            <div className="flex justify-center">
              <button
                onClick={() => {
                  setSelectedBarber({ id: null, name: "Primeiro Disponível", bio: null });
                  setStep(2);
                }}
                className="inline-flex items-center gap-3 bg-surface hover:bg-surface-2 text-text px-8 py-4 rounded-full font-bold text-xs shadow-soft transition-all active:scale-95 group"
              >
                <div className="w-8 h-8 rounded-full bg-accent-soft text-accent flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span>Sem preferência de barbeiro (Horário mais rápido)</span>
                <ChevronRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Lista em Círculos Grandes */}
            <div className="flex flex-wrap items-center justify-center gap-10 pt-4">
              {barbers.map((b) => (
                <div
                  key={b.id || "nobarb"}
                  onClick={() => {
                    setSelectedBarber(b);
                    setStep(2);
                  }}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-surface-2 p-1.5 shadow-soft transition-all duration-300 group-hover:scale-105 group-hover:ring-2 group-hover:ring-accent">
                    <div className="w-full h-full rounded-full bg-surface flex items-center justify-center text-accent overflow-hidden font-serif text-2xl font-bold">
                      {b.avatar_url ? (
                        <img src={b.avatar_url} alt={b.name} className="w-full h-full object-cover" />
                      ) : (
                        <span>{b.name.charAt(0)}</span>
                      )}
                    </div>
                  </div>
                  <h3 className="font-serif text-base font-bold text-text mt-3 group-hover:text-accent transition-colors">
                    {b.name}
                  </h3>
                  <span className="text-xs text-text-muted">{b.bio || "Especialista"}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ETAPA 2: SERVIÇOS (Linhas respiradas, sem caixas em grade) */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="text-center mb-8">
              <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-text">
                Escolha os <span className="italic text-accent">Serviços</span>
              </h1>
              <p className="text-xs text-text-muted mt-2">
                Você pode selecionar mais de um serviço para o mesmo atendimento
              </p>
            </div>

            <div className="space-y-3">
              {services.map((srv) => {
                const isSelected = selectedServices.some((s) => s.id === srv.id);
                return (
                  <div
                    key={srv.id}
                    onClick={() => toggleService(srv)}
                    className={`rounded-2xl md:rounded-full px-6 py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer transition-all duration-200 select-none ${
                      isSelected
                        ? "bg-accent-soft shadow-sm"
                        : "bg-surface hover:bg-surface-2"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Círculo de seleção */}
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                          isSelected ? "bg-accent text-accent-contrast" : "bg-surface-2 text-transparent"
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <div>
                        <h3 className="font-serif text-base font-bold text-text">{srv.name}</h3>
                        <p className="text-xs text-text-muted line-clamp-1">
                          {srv.description || "Produtos de alta performance e toalha aromática."}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-hairline">
                      <div className="flex items-center gap-1.5 text-xs text-text-muted">
                        <Clock className="w-3.5 h-3.5 text-accent" />
                        <span>{formatDuration(srv.duration_minutes)}</span>
                      </div>
                      <div className="font-serif font-bold text-lg text-accent">
                        {formatCurrency(srv.price)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Barra Fixa Inferior com Resumo e Botão Pílula */}
            <div className="fixed bottom-6 inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
              <div className="w-full max-w-2xl bg-surface/90 backdrop-blur-xl rounded-full px-6 py-3.5 flex items-center justify-between shadow-soft pointer-events-auto">
                <div className="text-xs">
                  <span className="text-text-muted">Total: </span>
                  <strong className="text-accent font-serif text-base font-bold">
                    {formatCurrency(totalPrice)}
                  </strong>
                  <span className="text-text-muted ml-2">({formatDuration(totalDuration)})</span>
                </div>

                <button
                  onClick={() => setStep(3)}
                  disabled={selectedServices.length === 0}
                  className="bg-accent hover:bg-accent-hover text-accent-contrast px-6 py-2.5 rounded-full font-bold text-xs shadow-glow transition-transform active:scale-95 disabled:opacity-40"
                >
                  Continuar para Horário
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ETAPA 3: HORÁRIO (Calendário Circular + Horários em Pílulas) */}
        {step === 3 && (
          <div className="space-y-8 animate-in fade-in">
            <div className="text-center">
              <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-text">
                Escolha o <span className="italic text-accent">Horário</span>
              </h1>
              <p className="text-xs text-text-muted mt-2">
                Disponibilidade consultada em tempo real com o banco de dados
              </p>
            </div>

            {/* Seletor de Dias em Círculos */}
            <div className="bg-surface rounded-[32px] p-6 shadow-soft">
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none justify-start md:justify-center">
                {getUpcomingDays().map((d) => {
                  const isSelected = selectedDate === d.iso;
                  return (
                    <button
                      key={d.iso}
                      onClick={() => setSelectedDate(d.iso)}
                      className={`flex flex-col items-center justify-center w-14 h-20 rounded-full transition-all shrink-0 ${
                        isSelected
                          ? "bg-accent text-accent-contrast shadow-glow scale-105"
                          : "bg-surface-2 hover:bg-surface-3 text-text"
                      }`}
                    >
                      <span className="text-[10px] uppercase font-bold tracking-wider opacity-70">
                        {d.weekDay}
                      </span>
                      <span className="font-serif text-lg font-bold mt-1">{d.dayNum}</span>
                      {d.isToday && (
                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Horários do Dia em Pílulas */}
            <div className="bg-surface rounded-[32px] p-8 shadow-soft">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-hairline">
                <div className="flex items-center gap-2 text-xs font-bold text-text">
                  <Clock className="w-4 h-4 text-accent" />
                  <span>Horários para {new Date(selectedDate + "T12:00:00").toLocaleDateString("pt-BR", { dateStyle: "long" })}</span>
                </div>
                <button
                  onClick={fetchAvailability}
                  className="text-text-muted hover:text-accent p-1 text-xs flex items-center gap-1 font-semibold"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Atualizar</span>
                </button>
              </div>

              {isLoadingSlots ? (
                <div className="flex flex-col items-center justify-center py-12 text-text-muted">
                  <span className="w-7 h-7 border-2 border-accent border-t-transparent rounded-full animate-spin mb-3" />
                  <p className="text-xs">Consultando horários em tempo real...</p>
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="text-center py-12 text-xs text-text-muted">
                  Nenhum horário livre para esta data. Por favor, selecione outro dia no calendário acima.
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {availableSlots.map((slot) => {
                    const timeLabel = new Date(slot.start_time).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    const isSelected = selectedSlot?.start_time === slot.start_time;

                    return (
                      <button
                        key={slot.start_time}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-3 px-4 rounded-full font-mono text-xs font-bold transition-all duration-200 active:scale-95 ${
                          isSelected
                            ? "bg-accent text-accent-contrast shadow-glow scale-105"
                            : "bg-surface-2 hover:bg-surface-3 text-text"
                        }`}
                      >
                        {timeLabel}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Barra Inferior com Horário Escolhido */}
            <div className="fixed bottom-6 inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
              <div className="w-full max-w-2xl bg-surface/90 backdrop-blur-xl rounded-full px-6 py-3.5 flex items-center justify-between shadow-soft pointer-events-auto">
                <div className="text-xs">
                  {selectedSlot ? (
                    <span>
                      Horário:{" "}
                      <strong className="text-accent font-mono font-bold text-sm">
                        {new Date(selectedSlot.start_time).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </strong>
                    </span>
                  ) : (
                    <span className="text-text-muted">Selecione um horário</span>
                  )}
                </div>

                <button
                  onClick={() => setStep(4)}
                  disabled={!selectedSlot}
                  className="bg-accent hover:bg-accent-hover text-accent-contrast px-6 py-2.5 rounded-full font-bold text-xs shadow-glow transition-transform active:scale-95 disabled:opacity-40"
                >
                  Continuar para Confirmação
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ETAPA 4: CONFIRMAÇÃO & CHECKOUT (Superfícies Tonais e Campos em Pílula) */}
        {step === 4 && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start animate-in fade-in">
            {/* Formulário do Cliente (7 Colunas) */}
            <div className="md:col-span-7 bg-surface rounded-[32px] p-8 shadow-soft space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-hairline">
                <h2 className="font-serif text-xl font-bold text-text">Seus Dados de Contato</h2>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-soft text-accent text-[11px] font-semibold">
                  <Lock className="w-3 h-3" />
                  <span>Conexão Segura</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1.5 ml-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full bg-surface-2 rounded-full px-5 py-3 text-xs text-text focus:ring-2 focus:ring-accent focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1.5 ml-2">
                    WhatsApp / Telefone *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full bg-surface-2 rounded-full px-5 py-3 text-xs text-text focus:ring-2 focus:ring-accent focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1.5 ml-2">
                    E-mail (para receber confirmação)
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className="w-full bg-surface-2 rounded-full px-5 py-3 text-xs text-text focus:ring-2 focus:ring-accent focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Opção de Pagamento: Sinal ou Total */}
              <div className="pt-4 border-t border-hairline">
                <label className="block text-xs font-semibold text-text-muted mb-2 ml-2">
                  Condição de Pagamento
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentOption("deposit")}
                    className={`py-3 px-4 rounded-2xl text-xs font-bold transition-all text-left flex flex-col justify-between ${
                      paymentOption === "deposit"
                        ? "bg-accent-soft text-accent ring-1 ring-accent"
                        : "bg-surface-2 text-text-muted hover:text-text"
                    }`}
                  >
                    <span>Sinal ({depositPct}%)</span>
                    <strong className="font-serif text-sm mt-1">{formatCurrency(depositAmount)}</strong>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentOption("full")}
                    className={`py-3 px-4 rounded-2xl text-xs font-bold transition-all text-left flex flex-col justify-between ${
                      paymentOption === "full"
                        ? "bg-accent-soft text-accent ring-1 ring-accent"
                        : "bg-surface-2 text-text-muted hover:text-text"
                    }`}
                  >
                    <span>Pagamento Total (100%)</span>
                    <strong className="font-serif text-sm mt-1">{formatCurrency(totalPrice)}</strong>
                  </button>
                </div>
              </div>

              {/* Termos e Consentimentos Separados */}
              <div className="space-y-3 pt-4 border-t border-hairline text-xs">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-0.5 rounded accent-accent"
                  />
                  <span className="text-text-muted">
                    Concordo com os Termos de Uso e a Política de Cancelamento da barbearia.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={marketingConsent}
                    onChange={(e) => setMarketingConsent(e.target.checked)}
                    className="mt-0.5 rounded accent-accent"
                  />
                  <span className="text-text-muted">
                    Aceito receber lembretes de horário e promoções exclusivas via WhatsApp.
                  </span>
                </label>
              </div>

              <button
                onClick={handleConfirmBooking}
                disabled={isSubmitting || !acceptedTerms}
                className="w-full bg-accent hover:bg-accent-hover text-accent-contrast py-4 rounded-full font-bold text-sm shadow-glow transition-all active:scale-95 disabled:opacity-40"
              >
                {isSubmitting ? "Reservando horário no banco..." : "Confirmar Reserva"}
              </button>
            </div>

            {/* Resumo Lateral (5 Colunas) */}
            <div className="md:col-span-5 bg-surface-2 rounded-[32px] p-8 shadow-soft space-y-6">
              <h3 className="font-serif text-lg font-bold text-text pb-4 border-b border-hairline">
                Resumo do Agendamento
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-text-muted block text-[11px]">Profissional</span>
                  <strong className="text-text font-serif text-sm">
                    {selectedBarber?.name || "Primeiro Disponível"}
                  </strong>
                </div>

                <div>
                  <span className="text-text-muted block text-[11px]">Data & Horário</span>
                  <strong className="text-text font-mono text-sm">
                    {new Date(selectedDate + "T12:00:00").toLocaleDateString("pt-BR")} às{" "}
                    {selectedSlot
                      ? new Date(selectedSlot.start_time).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "--:--"}
                  </strong>
                </div>

                <div>
                  <span className="text-text-muted block text-[11px] mb-1">Serviços Selecionados</span>
                  <div className="space-y-1.5">
                    {selectedServices.map((s) => (
                      <div key={s.id} className="flex justify-between text-text">
                        <span>{s.name}</span>
                        <span className="font-serif font-bold text-accent">{formatCurrency(s.price)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-hairline space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">Valor Total:</span>
                    <span className="font-serif font-bold text-text">{formatCurrency(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-accent font-semibold">Paga agora (online):</span>
                    <span className="font-serif font-bold text-accent">{formatCurrency(payNowAmount)}</span>
                  </div>
                  {payLaterAmount > 0 && (
                    <div className="flex justify-between text-xs text-text-muted">
                      <span>Resta pagar no local:</span>
                      <span className="font-mono">{formatCurrency(payLaterAmount)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ETAPA 5: SUCESSO (Superfície Arredondada e Token Real) */}
        {step === 5 && (
          <div className="max-w-xl mx-auto bg-surface rounded-[36px] p-10 md:p-14 text-center shadow-soft animate-in zoom-in-95 space-y-6">
            <div className="w-16 h-16 rounded-full bg-accent-soft text-accent mx-auto flex items-center justify-center">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div>
              <h2 className="font-serif text-3xl font-bold text-text mb-2">Agendamento Realizado!</h2>
              <p className="text-xs text-text-muted">
                Seu horário está reservado com sucesso no sistema da barbearia.
              </p>
            </div>

            <div className="bg-surface-2 rounded-2xl p-4 text-xs font-mono">
              <span className="text-text-muted block text-[10px] uppercase font-sans mb-1">
                Token do Agendamento
              </span>
              <strong className="text-accent text-sm select-all">{bookingToken}</strong>
            </div>

            {holdExpiresAt && countdownSeconds > 0 && (
              <div className="inline-flex items-center gap-2 bg-accent-soft text-accent px-4 py-2 rounded-full text-xs font-semibold font-mono">
                <Clock className="w-4 h-4" />
                <span>
                  Reserva ativa: {Math.floor(countdownSeconds / 60)}:
                  {String(countdownSeconds % 60).padStart(2, "0")}
                </span>
              </div>
            )}

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={`/meu-agendamento?token=${bookingToken}`}
                className="w-full sm:w-auto bg-accent hover:bg-accent-hover text-accent-contrast px-6 py-3 rounded-full font-bold text-xs shadow-glow transition-all active:scale-95"
              >
                Ver Meu Agendamento
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto bg-surface-2 hover:bg-surface-3 text-text px-6 py-3 rounded-full font-semibold text-xs transition-colors"
              >
                Voltar à Página Inicial
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
