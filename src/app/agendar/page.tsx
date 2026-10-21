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
  AlertTriangle,
} from "lucide-react";
import { supabase, getBarbershopId, getMissingClientEnvVars } from "@/lib/supabase";
import { formatCurrency, formatDuration } from "@/lib/utils";
import confetti from "canvas-confetti";

interface Barber {
  id: string | null;
  name: string;
  bio: string | null;
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

  // Dados Reais do Banco
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

  // Dados do Cliente
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [paymentOption, setPaymentOption] = useState<"deposit" | "full" | "in_person">("deposit");
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
  const [marketingConsent, setMarketingConsent] = useState<boolean>(false);

  // Estado da Reserva Real
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingToken, setBookingToken] = useState<string>("");
  const [holdExpiresAt, setHoldExpiresAt] = useState<string | null>(null);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(600);

  const missingEnv = getMissingClientEnvVars();

  // 1. Carregar Dados Iniciais do Supabase
  useEffect(() => {
    if (missingEnv.length > 0) {
      setErrorBanner(`Configuração pendente no .env.local: ${missingEnv.join(", ")}`);
      setIsLoadingInitial(false);
      return;
    }

    async function fetchInitialData() {
      try {
        const shopId = getBarbershopId();

        // Carregar Barbeiros Ativos
        const { data: barbData, error: barbErr } = await supabase
          .from("public_barbers")
          .select("id, name, bio")
          .eq("barbershop_id", shopId);

        if (barbErr) throw barbErr;

        const barberList: Barber[] = [
          {
            id: null,
            name: "Sem preferência (Primeiro Disponível)",
            bio: "Atendimento mais rápido alocado automaticamente entre os profissionais livres.",
          },
          ...(barbData || []),
        ];

        setBarbers(barberList);
        setSelectedBarber(barberList[0]);

        // Carregar Serviços Ativos
        const { data: srvData, error: srvErr } = await supabase
          .from("public_services")
          .select("id, name, description, duration_minutes, price")
          .eq("barbershop_id", shopId);

        if (srvErr) throw srvErr;

        if (srvData && srvData.length > 0) {
          setServices(srvData);
          setSelectedServices([srvData[0]]);
        }

        // Carregar Percentual de Sinal
        const { data: setData } = await supabase
          .from("public_site_settings")
          .select("deposit_percentage")
          .eq("barbershop_id", shopId)
          .maybeSingle();

        if (setData?.deposit_percentage) {
          setDepositPct(Number(setData.deposit_percentage));
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Erro ao conectar ao Supabase";
        setErrorBanner(msg);
      } finally {
        setIsLoadingInitial(false);
      }
    }

    fetchInitialData();
  }, []);

  // 2. Consulta de Disponibilidade Real via RPC get_availability
  const fetchAvailability = useCallback(async () => {
    if (selectedServices.length === 0 || !selectedDate) return;

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
      const msg = err instanceof Error ? err.message : "Erro ao consultar horários disponíveis";
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

  // Contagem regressiva do Hold Real
  useEffect(() => {
    if (step === 5 && holdExpiresAt) {
      const targetTime = new Date(holdExpiresAt).getTime();
      const interval = setInterval(() => {
        const diff = Math.max(0, Math.floor((targetTime - Date.now()) / 1000));
        setCountdownSeconds(diff);
        if (diff === 0) {
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, holdExpiresAt]);

  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration_minutes, 0);
  const depositAmount = Math.round((totalPrice * (depositPct / 100)) * 100) / 100;

  const toggleService = (service: Service) => {
    if (selectedServices.some((s) => s.id === service.id)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
      }
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  // 3. Confirmar e Criar Reserva Real via RPC create_booking_hold
  const handleConfirmBooking = async () => {
    if (!customerName || !customerPhone || !acceptedTerms) {
      setErrorBanner("Preencha seu nome, telefone e aceite os termos de agendamento.");
      return;
    }

    if (!selectedSlot) {
      setErrorBanner("Nenhum horário selecionado.");
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
        p_customer_email: customerEmail,
        p_marketing_consent: marketingConsent,
      });

      if (error) {
        // Conflito de concorrência detectado pelo banco
        if (error.message.includes("já está ocupado") || error.message.includes("acabou de ser reservado")) {
          setErrorBanner("Esse horário acabou de ser reservado por outro cliente. Por favor, escolha outro horário.");
          setStep(3);
          fetchAvailability();
          setIsSubmitting(false);
          return;
        }
        throw error;
      }

      const res = data as {
        booking_id: string;
        hold_expires_at: string;
        cancellation_token: string;
      };

      setBookingToken(res.cancellation_token);
      setHoldExpiresAt(res.hold_expires_at);
      setStep(5);

      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch {
        // Ignora em ambientes sem canvas
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Falha ao confirmar reserva";
      setErrorBanner(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateICS = () => {
    if (!selectedSlot) return;
    const startIso = selectedSlot.start_time.replace(/[-:]/g, "").split(".")[0] + "Z";
    const endIso = selectedSlot.end_time.replace(/[-:]/g, "").split(".")[0] + "Z";

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Barbearia Premium//Agendamentos//PT-BR
BEGIN:VEVENT
UID:${bookingToken}@barbearia
DTSTAMP:${startIso}
DTSTART:${startIso}
DTEND:${endIso}
SUMMARY:Atendimento Barbearia - ${selectedServices.map((s) => s.name).join(", ")}
DESCRIPTION:Serviços: ${selectedServices.map((s) => s.name).join(", ")}\\nGestão: /meu-agendamento?token=${bookingToken}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `agendamento-${selectedDate}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoadingInitial) {
    return (
      <div className="min-h-screen bg-bg text-text flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-text-muted">Conectando ao banco de dados...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-text pb-28">
      {/* Header */}
      <header className="border-b border-border bg-surface/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-text-muted hover:text-text transition-colors">
            <ChevronLeft className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">Voltar ao site</span>
          </Link>

          <div className="flex items-center gap-2">
            <Scissors className="w-4 h-4 text-accent" />
            <span className="font-serif font-bold text-sm">Barbearia Premium</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Conexão Segura</span>
          </div>
        </div>

        {/* Stepper Progress Bar */}
        <div className="max-w-5xl mx-auto px-4 py-3 border-t border-border/50">
          <div className="grid grid-cols-4 gap-2 text-xs font-semibold">
            <div className={`flex items-center gap-2 ${step >= 1 ? "text-accent" : "text-text-muted/40"}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] border ${step >= 1 ? "border-accent bg-accent/15" : "border-border"}`}>1</span>
              <span className="hidden sm:inline">Barbeiro</span>
            </div>
            <div className={`flex items-center gap-2 ${step >= 2 ? "text-accent" : "text-text-muted/40"}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] border ${step >= 2 ? "border-accent bg-accent/15" : "border-border"}`}>2</span>
              <span className="hidden sm:inline">Serviços</span>
            </div>
            <div className={`flex items-center gap-2 ${step >= 3 ? "text-accent" : "text-text-muted/40"}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] border ${step >= 3 ? "border-accent bg-accent/15" : "border-border"}`}>3</span>
              <span className="hidden sm:inline">Horário</span>
            </div>
            <div className={`flex items-center gap-2 ${step >= 4 ? "text-accent" : "text-text-muted/40"}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] border ${step >= 4 ? "border-accent bg-accent/15" : "border-border"}`}>4</span>
              <span className="hidden sm:inline">Confirmação</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {errorBanner && (
          <div className="mb-6 p-4 rounded-sm bg-danger/10 border border-danger/30 text-danger text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorBanner}</span>
          </div>
        )}

        {/* ETAPA 1: ESCOLHA DO BARBEIRO */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">Etapa 01</span>
              <h1 className="font-serif text-3xl font-bold mt-1 text-text">Escolha o Profissional</h1>
              <p className="text-sm text-text-muted mt-1">Selecione o barbeiro de sua preferência ou o primeiro disponível.</p>
            </div>

            {barbers.length === 0 ? (
              <div className="text-center py-12 text-sm text-text-muted border border-dashed border-border rounded-md">
                Nenhum barbeiro ativo disponível no momento.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {barbers.map((barber) => {
                  const isSelected = selectedBarber?.id === barber.id;
                  return (
                    <button
                      key={barber.id ?? "any"}
                      onClick={() => setSelectedBarber(barber)}
                      className={`text-left p-5 rounded-md border transition-all flex flex-col justify-between ${
                        isSelected
                          ? "bg-surface border-accent shadow-premium ring-1 ring-accent"
                          : "bg-surface border-border hover:border-accent/40"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${isSelected ? "border-accent bg-accent/10 text-accent" : "border-border bg-surface-2 text-text-muted"}`}>
                              <User className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="font-serif font-bold text-base text-text">{barber.name}</h3>
                              <span className="text-xs text-text-muted">
                                {barber.id === null ? "Alocação Automática" : "Barbeiro Especialista"}
                              </span>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-accent text-accent-contrast flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          )}
                        </div>
                        {barber.bio && <p className="text-xs text-text-muted mt-2 leading-relaxed">{barber.bio}</p>}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ETAPA 2: ESCOLHA DOS SERVIÇOS */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">Etapa 02</span>
              <h1 className="font-serif text-3xl font-bold mt-1 text-text">Selecione os Serviços</h1>
              <p className="text-sm text-text-muted mt-1">Você pode selecionar múltiplos serviços para a mesma sessão.</p>
            </div>

            {services.length === 0 ? (
              <div className="text-center py-12 text-sm text-text-muted border border-dashed border-border rounded-md">
                Nenhum serviço ativo encontrado para esta barbearia.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.map((service) => {
                  const isSelected = selectedServices.some((s) => s.id === service.id);
                  return (
                    <button
                      key={service.id}
                      onClick={() => toggleService(service)}
                      className={`text-left p-5 rounded-md border transition-all flex flex-col justify-between ${
                        isSelected
                          ? "bg-surface border-accent shadow-premium ring-1 ring-accent"
                          : "bg-surface border-border hover:border-accent/40"
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-serif font-bold text-base text-text">{service.name}</h3>
                          <span className="font-bold text-accent">{formatCurrency(service.price)}</span>
                        </div>
                        {service.description && (
                          <p className="text-xs text-text-muted mb-4">{service.description}</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs text-text-muted pt-3 border-t border-border">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-accent" />
                          <span>{formatDuration(service.duration_minutes)}</span>
                        </div>
                        <span className={`font-semibold ${isSelected ? "text-accent" : "text-text-muted"}`}>
                          {isSelected ? "Selecionado" : "+ Adicionar"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ETAPA 3: DATA E HORÁRIO REAL VIA RPC get_availability */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">Etapa 03</span>
              <h1 className="font-serif text-3xl font-bold mt-1 text-text">Escolha Data & Horário</h1>
              <p className="text-sm text-text-muted mt-1">
                Disponibilidade real consultada no banco para {selectedBarber?.name}.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Seletor de Data */}
              <div className="bg-surface border border-border p-6 rounded-md">
                <h3 className="font-serif font-bold text-base mb-4 flex items-center gap-2 text-text">
                  <CalendarIcon className="w-4 h-4 text-accent" />
                  <span>Selecione o Dia</span>
                </h3>

                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-surface-2 border border-border rounded-sm p-3 text-sm text-text outline-none focus:border-accent transition-colors"
                />

                <p className="text-xs text-text-muted mt-4">
                  * Duração total estimada de <strong>{formatDuration(totalDuration)}</strong>.
                </p>
              </div>

              {/* Grade de Horários Reais */}
              <div className="bg-surface border border-border p-6 rounded-md">
                <h3 className="font-serif font-bold text-base mb-4 flex items-center gap-2 text-text">
                  <Clock className="w-4 h-4 text-accent" />
                  <span>Horários Livres</span>
                </h3>

                {isLoadingSlots ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-2">
                    <span className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-text-muted">Consultando agenda no banco...</span>
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="text-center py-10 text-xs text-text-muted border border-dashed border-border rounded-sm p-4">
                    Nenhum horário livre para este dia com a duração solicitada. Tente outra data.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1">
                    {availableSlots.map((slot) => {
                      const timeStr = new Date(slot.start_time).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                      const isSelected = selectedSlot?.start_time === slot.start_time;
                      return (
                        <button
                          key={slot.start_time}
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-2 px-3 rounded-sm text-xs font-semibold border transition-all text-center ${
                            isSelected
                              ? "bg-accent text-accent-contrast border-accent shadow-premium"
                              : "bg-surface-2 border-border text-text hover:border-accent/40"
                          }`}
                        >
                          {timeStr}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ETAPA 4: SEUS DADOS & CHECKOUT */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">Etapa 04</span>
              <h1 className="font-serif text-3xl font-bold mt-1 text-text">Seus Dados & Confirmação</h1>
              <p className="text-sm text-text-muted mt-1">Preencha seus dados para alocar a reserva provisória.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="bg-surface border border-border p-6 rounded-md space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: João da Silva"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-surface-2 border border-border focus:border-accent rounded-sm px-4 py-2.5 text-sm text-text outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                      WhatsApp com DDD *
                    </label>
                    <input
                      type="tel"
                      placeholder="(11) 98765-4321"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-surface-2 border border-border focus:border-accent rounded-sm px-4 py-2.5 text-sm text-text outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                      E-mail (para envio do comprovante)
                    </label>
                    <input
                      type="email"
                      placeholder="joao@email.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full bg-surface-2 border border-border focus:border-accent rounded-sm px-4 py-2.5 text-sm text-text outline-none"
                    />
                  </div>
                </div>

                {/* Opções de Pagamento */}
                <div className="bg-surface border border-border p-6 rounded-md space-y-3">
                  <h4 className="font-serif font-bold text-sm text-text mb-2">Forma de Pagamento</h4>

                  <label className="flex items-center gap-3 p-3 rounded-sm border border-border hover:border-accent/40 cursor-pointer bg-surface-2">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentOption === "deposit"}
                      onChange={() => setPaymentOption("deposit")}
                      className="text-accent focus:ring-accent"
                    />
                    <div className="text-xs">
                      <strong className="text-text block font-medium">
                        Sinal de {depositPct}% via Pix ou Cartão ({formatCurrency(depositAmount)})
                      </strong>
                      <span className="text-text-muted">
                        Garante o horário sem fila. Restante de {formatCurrency(totalPrice - depositAmount)} pago no balcão.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-sm border border-border hover:border-accent/40 cursor-pointer bg-surface-2">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentOption === "in_person"}
                      onChange={() => setPaymentOption("in_person")}
                      className="text-accent focus:ring-accent"
                    />
                    <div className="text-xs">
                      <strong className="text-text block font-medium">Pagar 100% no Local ({formatCurrency(totalPrice)})</strong>
                      <span className="text-text-muted">Pagamento integral efetuado na recepção da barbearia.</span>
                    </div>
                  </label>
                </div>

                {/* Checkboxes de Aceite e LGPD */}
                <div className="space-y-3 pt-2">
                  <label className="flex items-start gap-2.5 text-xs text-text-muted cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="mt-0.5 text-accent focus:ring-accent rounded-sm"
                    />
                    <span>
                      Li e concordo com os Termos de Uso e com a Política de Cancelamento (reembolso garantido até 24h antes).
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 text-xs text-text-muted cursor-pointer">
                    <input
                      type="checkbox"
                      checked={marketingConsent}
                      onChange={(e) => setMarketingConsent(e.target.checked)}
                      className="mt-0.5 text-accent focus:ring-accent rounded-sm"
                    />
                    <span>
                      (Opcional) Desejo receber lembretes e novidades da barbearia via WhatsApp.
                    </span>
                  </label>
                </div>
              </div>

              {/* Resumo Lateral */}
              <div className="bg-surface border border-accent/30 p-6 rounded-md shadow-card h-fit space-y-4">
                <h3 className="font-serif font-bold text-lg text-text border-b border-border pb-3">Resumo da Reserva</h3>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-text-muted">
                    <span>Profissional:</span>
                    <strong className="text-text">{selectedBarber?.name}</strong>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Data:</span>
                    <strong className="text-text">
                      {selectedSlot ? new Date(selectedSlot.start_time).toLocaleString("pt-BR") : selectedDate}
                    </strong>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Duração Prevista:</span>
                    <strong className="text-text">{formatDuration(totalDuration)}</strong>
                  </div>
                </div>

                <div className="border-t border-border pt-3 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-text-muted">Serviços:</span>
                  {selectedServices.map((s) => (
                    <div key={s.id} className="flex justify-between text-xs">
                      <span className="text-text-muted">{s.name}</span>
                      <span className="text-text font-semibold">{formatCurrency(s.price)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text font-medium">Total:</span>
                    <strong className="text-text font-bold">{formatCurrency(totalPrice)}</strong>
                  </div>

                  <div className="flex justify-between text-sm text-accent">
                    <span>Paga Agora:</span>
                    <strong className="text-base font-extrabold">
                      {paymentOption === "deposit"
                        ? formatCurrency(depositAmount)
                        : paymentOption === "full"
                        ? formatCurrency(totalPrice)
                        : "R$ 0,00"}
                    </strong>
                  </div>
                </div>

                <button
                  onClick={handleConfirmBooking}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-accent-contrast font-bold py-3.5 px-4 rounded-sm text-sm transition-all shadow-premium disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-accent-contrast border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Confirmar Agendamento</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ETAPA 5: CONFIRMAÇÃO & TOKEN REAL */}
        {step === 5 && (
          <div className="max-w-2xl mx-auto bg-surface border border-accent/40 p-8 rounded-lg shadow-premium text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">Reserva Alocada no Banco</span>
              <h2 className="font-serif text-3xl font-bold mt-1 text-text">Horário Protegido com Sucesso!</h2>
              <p className="text-sm text-text-muted mt-2">
                Sua reserva provisória está registrada no banco de dados.
              </p>
            </div>

            {/* Hold Countdown Real */}
            <div className="bg-surface-2 border border-border p-4 rounded-md inline-flex items-center gap-3">
              <Clock className="w-5 h-5 text-accent animate-pulse" />
              <div className="text-left">
                <span className="text-xs text-text-muted block">Expiração da reserva provisória (Hold):</span>
                <strong className="text-sm text-accent font-mono">
                  {Math.floor(countdownSeconds / 60)}:{(countdownSeconds % 60).toString().padStart(2, "0")} minutos
                </strong>
              </div>
            </div>

            {/* Detalhes Reais */}
            <div className="bg-surface-2 border border-border p-5 rounded-md text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-text-muted">Token de Gerenciamento:</span>
                <strong className="font-mono text-accent truncate max-w-xs">{bookingToken}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Cliente:</span>
                <span className="text-text font-medium">{customerName} ({customerPhone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Data & Hora:</span>
                <span className="text-text font-medium">
                  {selectedSlot ? new Date(selectedSlot.start_time).toLocaleString("pt-BR") : selectedDate}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Sinal a pagar:</span>
                <strong className="text-accent text-sm">
                  {paymentOption === "deposit" ? formatCurrency(depositAmount) : "No balcão"}
                </strong>
              </div>
            </div>

            {/* Ações */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={generateICS}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-surface hover:bg-surface-2 border border-border px-5 py-2.5 rounded-sm text-xs font-semibold text-text transition-colors"
              >
                <Download className="w-4 h-4 text-accent" />
                <span>Adicionar ao Calendário (.ics)</span>
              </button>

              <Link
                href={`/meu-agendamento?token=${bookingToken}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-accent-contrast px-5 py-2.5 rounded-sm text-xs font-bold transition-all shadow-premium"
              >
                <span>Acessar Meu Agendamento</span>
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Barra Fixa Inferior para Etapas 1 a 3 */}
      {step < 4 && (
        <div className="fixed bottom-0 inset-x-0 bg-surface/95 backdrop-blur-md border-t border-border p-4 z-40">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <div className="text-xs">
              <span className="text-text-muted block">Seleção Atual:</span>
              <strong className="text-text font-semibold">
                {selectedServices.map((s) => s.name).join(", ")} • {formatCurrency(totalPrice)}
              </strong>
            </div>

            <div className="flex items-center gap-3">
              {step > 1 && (
                <button
                  onClick={() => setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4)}
                  className="px-4 py-2 text-xs font-semibold border border-border rounded-sm hover:bg-surface-2 transition-colors text-text"
                >
                  Voltar
                </button>
              )}

              <button
                onClick={() => {
                  if (step === 3 && !selectedSlot) {
                    setErrorBanner("Por favor, selecione um horário antes de continuar.");
                    return;
                  }
                  setErrorBanner(null);
                  setStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
                }}
                className="inline-flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-accent-contrast px-6 py-2.5 rounded-sm text-xs font-bold transition-all shadow-premium"
              >
                <span>Continuar</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
