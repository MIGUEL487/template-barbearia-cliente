"use client";
import {RegionalText,useRegional} from '@/components/regional/provider';

import Link from "next/link";
import { useCallback, useState } from "react";
import { BookingCalendar } from "./booking-calendar";
import { BarberPhoto } from "@/components/barber-photo";
import { BookingSkeleton, BrandLoading } from "./booking-loading";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { DemoBadge } from "@/components/demo-watermark";

import { useLiveBooking } from "./use-live-booking";

export default function LiveBooking() {
const {t,locale,profile,money:formatCurrency}=useRegional();
const time = (iso: string) =>
  new Date(iso).toLocaleTimeString(locale, {
    timeZone: profile.timezone,
    hour: "2-digit",
    minute: "2-digit",
  });



  const s = useLiveBooking();
  const serviceSummary = s.selectedServices.map(service => `${s.serviceQuantities[service.id] || 1}× ${service.name}`).join(', ');
  const reduced = useReducedMotion();
  const [calendarAvailable, setCalendarAvailable] = useState(false);
  const [calendarLoading, setCalendarLoading] = useState(true);

  const loadingTimes = s.isLoadingSlots || calendarLoading;
  const { setSelectedSlot } = s;

  const onCalendarAvailability = useCallback(
    (available: boolean) => {
      setCalendarAvailable(available);
      if (!available) setSelectedSlot(null);
    },
    [setSelectedSlot],
  );

  const isSingleBarber = s.barbers.length <= 1;

  // Navigation handlers
  const handleNextStep = () => {
    if (s.step === 1) {
      if (isSingleBarber) {
        if (s.barbers.length === 1 && !s.selectedBarber) {
          s.setSelectedBarber(s.barbers[0]);
        }
        s.setStep(3);
      } else {
        s.setStep(2);
      }
    } else if (s.step === 2) {
      s.setStep(3);
    } else if (s.step === 3) {
      s.setStep(4);
    }
  };

  const handlePrevStep = () => {
    if (s.step === 4) {
      s.setStep(3);
    } else if (s.step === 3) {
      if (isSingleBarber) {
        s.setStep(1);
      } else {
        s.setStep(2);
      }
    } else if (s.step === 2) {
      s.setStep(1);
    }
  };

  const disabled =
    s.isLoadingInitial ||
    s.missingEnv.length > 0 ||
    s.isSubmitting ||
    (s.step === 1 && !s.selectedServices.length) ||
    (s.step === 2 && !s.selectedBarber) ||
    (s.step === 3 && (!calendarAvailable || !s.selectedSlot || s.isLoadingSlots)) ||
    (s.step === 4 && (!s.acceptedTerms || !s.customerName.trim() || !s.customerPhone.trim()));

  // Dynamic step titles for the stepper
  const stepTitles = isSingleBarber
    ? ["Serviços", "Data e Horário", "Identificação"]
    : ["Serviços", "Profissional", "Data e Horário", "Identificação"];

  const currentStepIndex = isSingleBarber
    ? s.step === 1
      ? 0
      : s.step === 3
        ? 1
        : s.step === 4
          ? 2
          : 3
    : s.step - 1;

  return (
    <main className="booking-shell">
      <Link className="brand" href="/"><RegionalText text="Barbearia Modelo"/><span><RegionalText text="Voltar ao início"/></span>
      </Link>

      {/* Stepper bar */}
      <ol className="step-progress" aria-label={t("Etapas do agendamento")}>
        {stepTitles.map((title, i) => (
          <li
            key={title}
            aria-current={i === currentStepIndex ? "step" : undefined}
            className={i < currentStepIndex ? "step-completed" : ""}
          >
            {i + 1}
            <span>{title}</span>
          </li>
        ))}
      </ol>

      {/* Page Heading */}
      <h1>
        {s.step === 1
          ? "Escolha os serviços"
          : s.step === 2
            ? "Escolha o profissional"
            : s.step === 3
              ? "Data e horário"
              : s.step === 4
                ? "Identificação e resumo"
                : "Pré-reserva confirmada"}
      </h1>

      {s.errorBanner && (
        <p className="demo-alert" role="alert">
          {s.errorBanner}
        </p>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={s.isLoadingInitial ? "initial" : s.step}
          initial={{ opacity: 0, x: reduced ? 0 : 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: reduced ? 0 : -16 }}
          transition={{ duration: 0.18 }}
        >
          {s.isLoadingInitial && <BookingSkeleton />}

          {/* ETAPA 1: SERVIÇOS */}
          {!s.isLoadingInitial && s.step === 1 && (
            <fieldset aria-label={t("Serviços")} className="booking-step-fieldset">
              <legend><RegionalText text="Selecione um ou mais serviços"/></legend>
              <div className="services-grid space-y-3">
                {s.services.map((service) => {
                  const isChecked = s.selectedServices.some((x) => x.id === service.id);
                  const quantity = s.serviceQuantities[service.id] || 1;
                  return (
                    <div
                      key={service.id}
                      className={`choice service-card flex-col sm:flex-row sm:items-center justify-between gap-3 ${isChecked ? "is-selected ring-1 ring-accent/40 bg-surface-2/90" : ""}`}
                    >
                      <label className="flex items-center gap-3 cursor-pointer flex-1 min-w-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => s.toggleService(service)}
                          className="rounded accent-accent w-4 h-4 cursor-pointer"
                        />
                        <div className="choice-info flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <strong className="text-sm font-semibold truncate">
                              {service.name}
                            </strong>
                            <span className="text-sm font-semibold text-accent font-mono shrink-0">
                              {formatCurrency(Number(service.price))}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-text-muted mt-1">
                            <span>{service.duration_minutes}<RegionalText text="min"/></span>
                            {service.description && (
                              <>
                                <span>·</span>
                                <span className="truncate">{service.description}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </label>

                      {isChecked && (
                        <div
                          className="service-quantity flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-hairline/60"
                          role="group"
                          aria-label={`Pessoas para ${service.name}`}
                        >
                          <span className="text-xs text-text-muted mr-1"><RegionalText text="Pessoas:"/></span>
                          <button
                            type="button"
                            aria-label={`Diminuir pessoas para ${service.name}`}
                            disabled={quantity <= 1}
                            onClick={() => s.setServiceQuantity(service.id, quantity - 1)}
                            className="w-8 h-8 rounded-lg bg-surface-3 hover:bg-surface border border-hairline text-text flex items-center justify-center font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            −
                          </button>
                          <output
                            aria-live="polite"
                            aria-label={`Quantidade de pessoas para ${service.name}`}
                            className="min-w-6 text-center text-xs font-bold text-text font-mono"
                          >
                            {quantity}
                          </output>
                          <button
                            type="button"
                            aria-label={`Aumentar pessoas para ${service.name}`}
                            disabled={quantity >= 6}
                            onClick={() => s.setServiceQuantity(service.id, quantity + 1)}
                            className="w-8 h-8 rounded-lg bg-surface-3 hover:bg-surface border border-hairline text-text flex items-center justify-center font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            +
                          </button>
                          <small className="text-[11px] text-text-muted ml-1">
                            {quantity === 1 ? "pessoa" : "pessoas"}
                          </small>
                        </div>
                      )}
                    </div>
                  );
                })}
                {!s.services.length && (
                  <p className="no-items text-xs text-text-muted"><RegionalText text="Nenhum serviço disponível no momento. Fale com a barbearia."/></p>
                )}
              </div>
            </fieldset>
          )}

          {/* ETAPA 2: PROFISSIONAL (Apenas se houver mais de 1 barbeiro) */}
          {s.step === 2 && !isSingleBarber && (
            <fieldset aria-label={t("Profissional")} className="booking-step-fieldset">
              <legend><RegionalText text="Com quem você prefere ser atendido?"/></legend>
              <div className="barbers-grid space-y-3">
                {s.barbers.map((b) => {
                  const isChecked = s.selectedBarber?.id === b.id;
                  return (
                    <label
                      className={`choice barber-card ${isChecked ? "is-selected" : ""}`}
                      key={b.id}
                    >
                      <input
                        type="radio"
                        name="barber"
                        checked={isChecked}
                        onChange={() => s.setSelectedBarber(b)}
                      />
                      <BarberPhoto url={b.avatar_url || null} name={b.name} />
                      <div className="choice-info flex-1 min-w-0">
                        <strong className="text-sm font-semibold truncate block">
                          {b.name}
                        </strong>
                        <small className="text-xs text-text-muted truncate block mt-0.5">
                          {b.bio || "Especialista em cortes e barba"}
                        </small>
                      </div>
                    </label>
                  );
                })}
                {!!s.barbers.length && (
                  <label
                    className={`choice barber-card ${
                      s.selectedBarber !== null && s.selectedBarber.id === null
                        ? "is-selected"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="barber"
                      checked={s.selectedBarber !== null && s.selectedBarber.id === null}
                      onChange={() =>
                        s.setSelectedBarber({
                          id: null,
                          name: "Primeiro disponível",
                          bio: "Atendimento com qualquer barbeiro disponível no horário escolhido.",
                        })
                      }
                    />
                    <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/25 flex items-center justify-center text-accent font-bold shrink-0">
                      ✦
                    </div>
                    <div className="choice-info flex-1 min-w-0">
                      <strong className="text-sm font-semibold block"><RegionalText text="Sem preferência"/></strong>
                      <small className="text-xs text-text-muted block mt-0.5"><RegionalText text="Escolher o primeiro profissional disponível."/></small>
                    </div>
                  </label>
                )}
              </div>
            </fieldset>
          )}

          {/* ETAPA 3: DATA E HORÁRIO */}
          {s.step === 3 && (
            <fieldset aria-label={t("Horários")} className="booking-step-fieldset">
              <legend><RegionalText text="Selecione a data e o horário"/></legend>
              <div className="booking-date-layout">
                <BookingCalendar
                  value={s.selectedDate}
                  barberId={s.selectedBarberId}
                  serviceIds={s.requestedServiceIds}
                  onChange={(date) => {
                    if (date === s.selectedDate) void s.fetchAvailability();
                    else s.setSelectedDate(date);
                  }}
                  onAvailability={onCalendarAvailability}
                  onLoadingChange={setCalendarLoading}
                />
                <section
                  className="booking-time-panel"
                  aria-label={t("Horários disponíveis")}
                >
                  <h2><RegionalText text="Horários disponíveis"/></h2>
                  <p className="font-semibold text-xs text-accent-light">
                    {s.selectedDate.split("-").reverse().join("/")}
                  </p>
                  <div className="booking-slots-region" aria-busy={loadingTimes}>
                    <AnimatePresence mode="wait" initial={false}>
                      {loadingTimes ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: reduced ? 0 : 0.15 }}
                        >
                          <BookingSkeleton kind="slots" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key={s.selectedDate}
                          className="time-choices"
                          initial={{ opacity: 0, y: reduced ? 0 : 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{
                            opacity: 0,
                            y: reduced ? 0 : -8,
                            pointerEvents: "none",
                          }}
                          transition={{ duration: reduced ? 0 : 0.22 }}
                        >
                          {calendarAvailable &&
                            s.availableSlots.map((slot) => {
                              const isSelected =
                                s.selectedSlot?.start_time === slot.start_time &&
                                s.selectedSlot?.barber_id === slot.barber_id;
                              return (
                                <motion.button
                                  type="button"
                                  whileTap={reduced ? undefined : { scale: 0.96 }}
                                  aria-pressed={isSelected}
                                  key={slot.barber_id + slot.start_time}
                                  onClick={() => s.setSelectedSlot(slot)}
                                >
                                  <span>{time(slot.start_time)}</span>
                                  {s.selectedBarber?.id === null && (
                                    <small className="block text-[10px] opacity-75">
                                      {s.barbers.find(
                                        (b) => b.id === slot.barber_id,
                                      )?.name || "Barbeiro"}
                                    </small>
                                  )}
                                </motion.button>
                              );
                            })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {!loadingTimes && !s.availableSlots.length && (
                      <p role="status" className="text-xs text-text-muted py-6 text-center"><RegionalText text="Não há horários disponíveis nesta data. Selecione outro dia no calendário."/></p>
                    )}
                  </div>
                  <p className="text-[11px] text-text-muted mt-2">{profile.timezone}</p>
                </section>
              </div>
            </fieldset>
          )}

          {/* ETAPA 4: IDENTIFICAÇÃO E RESUMO */}
          {s.step === 4 && (
            <form
              id="booking-confirmation"
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                void s.handleConfirmBooking();
              }}
            >
              <div className="p-5 rounded-2xl bg-surface-2/80 border border-hairline shadow-soft space-y-3">
                <h2 className="text-sm font-bold text-text uppercase tracking-wider"><RegionalText text="Resumo do Agendamento"/></h2>
                <dl className="booking-summary text-xs space-y-2">
                  <div className="flex justify-between border-b border-hairline/60 pb-1.5">
                    <dt className="text-text-muted font-medium"><RegionalText text="Serviços"/></dt>
                    <dd className="font-semibold text-text text-right">
                      {serviceSummary}
                    </dd>
                  </div>
                  <div className="flex justify-between border-b border-hairline/60 pb-1.5">
                    <dt className="text-text-muted font-medium"><RegionalText text="Profissional"/></dt>
                    <dd className="font-semibold text-text">
                      {s.barbers.find((b) => b.id === s.selectedSlot?.barber_id)
                        ?.name ||
                        s.selectedBarber?.name ||
                        "Primeiro disponível"}
                    </dd>
                  </div>
                  <div className="flex justify-between border-b border-hairline/60 pb-1.5">
                    <dt className="text-text-muted font-medium"><RegionalText text="Quando"/></dt>
                    <dd className="font-semibold text-accent-light font-mono">
                      {s.selectedDate.split("-").reverse().join("/")}<RegionalText text="às"/>{" "}
                      {s.selectedSlot && time(s.selectedSlot.start_time)}
                    </dd>
                  </div>
                  <div className="flex justify-between border-b border-hairline/60 pb-1.5">
                    <dt className="text-text-muted font-medium"><RegionalText text="Valor Total"/></dt>
                    <dd className="font-bold text-sm text-text font-mono">
                      {formatCurrency(s.totalPrice)}
                    </dd>
                  </div>
                  {s.depositPct > 0 && s.depositPct < 100 && (
                    <div className="flex justify-between text-accent font-medium">
                      <dt><RegionalText text="Sinal ("/>{s.depositPct}%)</dt>
                      <dd className="font-mono">{formatCurrency(s.depositAmount)}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <div className="space-y-3">
                <label className="field-label block">
                  <span className="text-xs font-semibold text-text-muted block mb-1"><RegionalText text="Nome Completo *"/></span>
                  <input
                    value={s.customerName}
                    onChange={(e) => s.setCustomerName(e.target.value)}
                    placeholder={t("Seu nome e sobrenome")}
                    autoComplete="name"
                    required
                    className="w-full"
                  />
                </label>

                <label className="field-label block">
                  <span className="text-xs font-semibold text-text-muted block mb-1"><RegionalText text="WhatsApp *"/></span>
                  <input
                    type="tel"
                    value={s.customerPhone}
                    onChange={(e) => s.handlePhoneChange(e.target.value)}
                    placeholder="(35) 99999-9999"
                    autoComplete="tel"
                    required
                    className="w-full"
                  />
                </label>

                <label className="field-label block">
                  <span className="text-xs font-semibold text-text-muted block mb-1"><RegionalText text="E-mail (opcional)"/></span>
                  <input
                    type="email"
                    value={s.customerEmail}
                    onChange={(e) => s.setCustomerEmail(e.target.value)}
                    placeholder={t("seuemail@exemplo.com")}
                    autoComplete="email"
                    className="w-full"
                  />
                </label>

                <label className="choice terms-choice flex items-start gap-3 p-3.5 rounded-xl border border-hairline cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={s.acceptedTerms}
                    onChange={(e) => s.setAcceptedTerms(e.target.checked)}
                    required
                  />
                  <span className="leading-relaxed"><RegionalText text="Concordo com os"/><strong><RegionalText text="Termos de Uso"/></strong> e a{" "}
                    <strong><RegionalText text="Política de Cancelamento"/></strong><RegionalText text="da Barbearia Modelo."/></span>
                </label>

                <label className="choice terms-choice flex items-start gap-3 p-3.5 rounded-xl border border-hairline cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={s.marketingConsent}
                    onChange={(e) => s.setMarketingConsent(e.target.checked)}
                  />
                  <span className="leading-relaxed"><RegionalText text="Aceito receber lembretes e confirmações do agendamento via WhatsApp."/></span>
                </label>
              </div>
            </form>
          )}

          {/* ETAPA 5: CONFIRMAÇÃO COM CONTAGEM REGRESSIVA */}
          {s.step === 5 && (
            <div className="demo-success text-center space-y-4" role="status">
              <DemoBadge />
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 mx-auto flex items-center justify-center text-3xl font-bold">
                ✓
              </div>
              <div>
                <h2 className="text-xl font-bold text-text"><RegionalText text="Pré-reserva Garantida!"/></h2>
                <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto"><RegionalText text="Seu horário está separado por 15 minutos enquanto aguardamos a conclusão do procedimento."/></p>
              </div>

              {s.holdExpiresAt && (
                <div className="countdown-box p-4 rounded-2xl bg-surface-2 border border-accent/30 max-w-xs mx-auto shadow-sm">
                  <span className="text-[11px] uppercase tracking-wider text-text-muted font-bold block mb-1"><RegionalText text="Tempo Restante para Concluir"/></span>
                  <div className="text-3xl font-mono font-bold text-accent">
                    {Math.floor(s.countdownSeconds / 60)}:
                    {String(s.countdownSeconds % 60).padStart(2, "0")}
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-2">
                <Link
                  className="cta block w-full max-w-xs mx-auto"
                  href={"/meu-agendamento?token=" + encodeURIComponent(s.bookingToken)}
                ><RegionalText text="Ver Meu Agendamento"/></Link>
                <Link
                  href="/"
                  className="button-secondary block w-full max-w-xs mx-auto text-xs"
                ><RegionalText text="Voltar ao Início"/></Link>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Floating Action Bar */}
      {s.step < 5 && (
        <div className="booking-actions">
          <p>
            <span className="block truncate max-w-[200px] sm:max-w-xs">
              {serviceSummary || "Selecione um serviço"}
            </span>
            <strong>{formatCurrency(s.totalPrice)}</strong>
          </p>
          <div className="booking-action-buttons">
            {s.step > 1 && (
              <button
                type="button"
                className="button-secondary"
                disabled={s.isSubmitting}
                onClick={handlePrevStep}
              ><RegionalText text="Voltar"/></button>
            )}
            {s.step === 4 ? (
              <button
                className="cta"
                type="submit"
                form="booking-confirmation"
                disabled={Boolean(disabled)}
                aria-busy={s.isSubmitting}
              >
                {s.isSubmitting ? (
                  <>
                    <BrandLoading compact label="Criando sua pré-reserva" />
                    <span><RegionalText text="Confirmando..."/></span>
                  </>
                ) : (
                  "Confirmar pré-reserva"
                )}
              </button>
            ) : (
              <button
                className="cta"
                type="button"
                disabled={Boolean(disabled)}
                onClick={handleNextStep}
              ><RegionalText text="Continuar"/></button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
