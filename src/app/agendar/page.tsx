"use client";

import React, { useState, useEffect } from "react";
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
  CreditCard,
  QrCode,
  Download,
} from "lucide-react";
import { formatCurrency, formatDuration } from "@/lib/utils";
import confetti from "canvas-confetti";

interface Barber {
  id: string;
  name: string;
  bio: string;
  avatar_url?: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
}

export default function AgendarPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Dados mockados / fallback para preview imediato e testes offline
  const barbers: Barber[] = [
    { id: "barber-any", name: "Sem preferência (Primeiro disponível)", bio: "Atendimento mais rápido possível com qualquer profissional da equipe." },
    { id: "barber-1", name: "Carlos Oliveira", bio: "Mestre em cortes clássicos, degradê navalhado e barba na toalha quente." },
    { id: "barber-2", name: "Lucas Mendes", bio: "Especialista em visagismo, corte tesoura tradicional e tratamento capilar." },
    { id: "barber-3", name: "Rafael Santos", bio: "Especialista em barboterapia aromática e desenhos de precisão." },
  ];

  const services: Service[] = [
    { id: "srv-1", name: "Corte Clássico", description: "Lavagem, corte estilizado na tesoura/máquina e finalização.", duration_minutes: 40, price: 60 },
    { id: "srv-2", name: "Barba Terapia Completa", description: "Toalha quente, óleos emolientes, massagem e navalha descartável.", duration_minutes: 35, price: 55 },
    { id: "srv-3", name: "Corte + Barba (Combo)", description: "Experiência completa com alinhamento facial e acabamento premium.", duration_minutes: 70, price: 105 },
    { id: "srv-4", name: "Acabamento / Pezinho", description: "Alinhamento com navalha, nuca e contornos do cabelo.", duration_minutes: 20, price: 30 },
  ];

  // Estado do Agendamento
  const [selectedBarber, setSelectedBarber] = useState<Barber>(barbers[0]);
  const [selectedServices, setSelectedServices] = useState<Service[]>([services[0]]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [selectedTime, setSelectedTime] = useState<string>("14:30");
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [paymentOption, setPaymentOption] = useState<"deposit" | "full" | "in_person">("deposit");
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
  const [marketingConsent, setMarketingConsent] = useState<boolean>(false);

  // Estado de Finalização
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [holdCountdown, setHoldCountdown] = useState<number>(600); // 10 minutos
  const [bookingToken, setBookingToken] = useState<string>("");

  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration_minutes, 0);
  const depositAmount = Math.round((totalPrice * 0.5) * 100) / 100;

  // Toggle de múltiplos serviços
  const toggleService = (service: Service) => {
    if (selectedServices.some((s) => s.id === service.id)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
      }
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  // Contagem regressiva do Hold
  useEffect(() => {
    if (step === 5 && holdCountdown > 0) {
      const timer = setInterval(() => setHoldCountdown((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [step, holdCountdown]);

  const handleConfirmBooking = () => {
    if (!customerName || !customerPhone || !acceptedTerms) {
      alert("Por favor, preencha seu nome, telefone e aceite os termos de agendamento.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setBookingToken("tok_" + Math.random().toString(36).substring(2, 12));
      setStep(5);
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Ignora em ambientes sem canvas nativo
      }
    }, 1200);
  };

  const generateICS = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Barbearia Premium//Agendamentos//PT-BR
BEGIN:VEVENT
SUMMARY:Atendimento Barbearia Premium - ${selectedServices.map((s) => s.name).join(", ")}
DESCRIPTION:Profissional: ${selectedBarber.name}\\nServiços: ${selectedServices.map((s) => s.name).join(", ")}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `agendamento-barbearia-${selectedDate}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-bg text-text pb-28">
      {/* Top Header */}
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
        {/* ETAPA 1: ESCOLHA DO BARBEIRO */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">Etapa 01</span>
              <h1 className="font-serif text-3xl font-bold mt-1 text-text">Escolha o Profissional</h1>
              <p className="text-sm text-text-muted mt-1">Selecione o barbeiro de sua preferência ou o primeiro disponível.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {barbers.map((barber) => {
                const isSelected = selectedBarber.id === barber.id;
                return (
                  <button
                    key={barber.id}
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
                            <span className="text-xs text-text-muted">Barbeiro Especialista</span>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-accent text-accent-contrast flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-text-muted mt-2 leading-relaxed">{barber.bio}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ETAPA 2: ESCOLHA DOS SERVIÇOS (MULTISSELEÇÃO) */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">Etapa 02</span>
              <h1 className="font-serif text-3xl font-bold mt-1 text-text">Selecione os Serviços</h1>
              <p className="text-sm text-text-muted mt-1">Você pode selecionar múltiplos serviços para a mesma sessão.</p>
            </div>

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
                      <p className="text-xs text-text-muted mb-4">{service.description}</p>
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
          </div>
        )}

        {/* ETAPA 3: DATA E HORÁRIO */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">Etapa 03</span>
              <h1 className="font-serif text-3xl font-bold mt-1 text-text">Escolha Data & Horário</h1>
              <p className="text-sm text-text-muted mt-1">Disponibilidade em tempo real para {selectedBarber.name}.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Calendário Simplificado */}
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
                  * Horários calculados considerando a duração total de <strong>{formatDuration(totalDuration)}</strong> para os serviços escolhidos.
                </p>
              </div>

              {/* Grade de Horários */}
              <div className="bg-surface border border-border p-6 rounded-md">
                <h3 className="font-serif font-bold text-base mb-4 flex items-center gap-2 text-text">
                  <Clock className="w-4 h-4 text-accent" />
                  <span>Horários Livres</span>
                </h3>

                <div className="grid grid-cols-3 gap-2">
                  {["09:00", "09:40", "10:30", "11:15", "14:00", "14:40", "15:30", "16:15", "17:00", "17:45", "18:30"].map((time) => {
                    const isSelected = selectedTime === time;
                    return (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 px-3 rounded-sm text-xs font-semibold border transition-all text-center ${
                          isSelected
                            ? "bg-accent text-accent-contrast border-accent shadow-premium"
                            : "bg-surface-2 border-border text-text hover:border-accent/40"
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ETAPA 4: SEUS DADOS & CHECKOUT */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">Etapa 04</span>
              <h1 className="font-serif text-3xl font-bold mt-1 text-text">Seus Dados & Pagamento</h1>
              <p className="text-sm text-text-muted mt-1">Garantia de reserva com confirmação imediata.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Formulário */}
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

                {/* Opção de Pagamento */}
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
                      <strong className="text-text block font-medium">Sinal de 50% via Pix ou Cartão ({formatCurrency(depositAmount)})</strong>
                      <span className="text-text-muted">Garante o horário sem fila. Restante de {formatCurrency(totalPrice - depositAmount)} pago no balcão.</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-sm border border-border hover:border-accent/40 cursor-pointer bg-surface-2">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentOption === "full"}
                      onChange={() => setPaymentOption("full")}
                      className="text-accent focus:ring-accent"
                    />
                    <div className="text-xs">
                      <strong className="text-text block font-medium">Pagamento Total ({formatCurrency(totalPrice)})</strong>
                      <span className="text-text-muted">Pague tudo agora e só compareça na barbearia.</span>
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
                      <span className="text-text-muted">Sujeito à fila de espera em dias de alto movimento.</span>
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
                      Li e concordo com os <Link href="/termos" className="text-accent underline">Termos de Uso</Link> e com a <Link href="/cancelamento" className="text-accent underline">Política de Cancelamento</Link> (reembolso garantido até 24h antes).
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
                      (Opcional) Desejo receber lembretes e novidades exclusivas via WhatsApp. Você pode se descadastrar a qualquer momento.
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
                    <strong className="text-text">{selectedBarber.name}</strong>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Data:</span>
                    <strong className="text-text">{selectedDate} às {selectedTime}</strong>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Duração Prevista:</span>
                    <strong className="text-text">{formatDuration(totalDuration)}</strong>
                  </div>
                </div>

                <div className="border-t border-border pt-3 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-text-muted">Serviços Selecionados:</span>
                  {selectedServices.map((s) => (
                    <div key={s.id} className="flex justify-between text-xs">
                      <span className="text-text-muted">{s.name}</span>
                      <span className="text-text font-semibold">{formatCurrency(s.price)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text font-medium">Total dos Serviços:</span>
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

                  {paymentOption === "deposit" && (
                    <div className="flex justify-between text-xs text-text-muted">
                      <span>Restante no Local:</span>
                      <span>{formatCurrency(totalPrice - depositAmount)}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleConfirmBooking}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-accent-contrast font-bold py-3.5 px-4 rounded-sm text-sm transition-all shadow-premium"
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

        {/* ETAPA 5: CONFIRMAÇÃO & MEU AGENDAMENTO */}
        {step === 5 && (
          <div className="max-w-2xl mx-auto bg-surface border border-accent/40 p-8 rounded-lg shadow-premium text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">Reserva Pré-Confirmada</span>
              <h2 className="font-serif text-3xl font-bold mt-1 text-text">Horário Reservado com Sucesso!</h2>
              <p className="text-sm text-text-muted mt-2">
                O seu horário está protegido temporariamente.
              </p>
            </div>

            {/* Hold Countdown */}
            <div className="bg-surface-2 border border-border p-4 rounded-md inline-flex items-center gap-3">
              <Clock className="w-5 h-5 text-accent animate-pulse" />
              <div className="text-left">
                <span className="text-xs text-text-muted block">Tempo restante para concluir o sinal:</span>
                <strong className="text-sm text-accent font-mono">
                  {Math.floor(holdCountdown / 60)}:{(holdCountdown % 60).toString().padStart(2, "0")} minutos
                </strong>
              </div>
            </div>

            {/* Detalhes do Agendamento */}
            <div className="bg-surface-2 border border-border p-5 rounded-md text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-text-muted">Código da Reserva:</span>
                <strong className="font-mono text-accent">{bookingToken}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Cliente:</span>
                <span className="text-text font-medium">{customerName} ({customerPhone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Barbeiro:</span>
                <span className="text-text font-medium">{selectedBarber.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Data & Hora:</span>
                <span className="text-text font-medium">{selectedDate} às {selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Valor a Pagar Agora:</span>
                <strong className="text-accent text-sm">
                  {paymentOption === "deposit"
                    ? formatCurrency(depositAmount)
                    : paymentOption === "full"
                    ? formatCurrency(totalPrice)
                    : "No balcão"}
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

      {/* Fixed Bottom Bar for Steps 1 to 3 */}
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
                  onClick={() => setStep((prev) => (prev - 1) as any)}
                  className="px-4 py-2 text-xs font-semibold border border-border rounded-sm hover:bg-surface-2 transition-colors text-text"
                >
                  Voltar
                </button>
              )}

              <button
                onClick={() => setStep((prev) => (prev + 1) as any)}
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
