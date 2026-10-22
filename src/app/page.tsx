"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scissors,
  Calendar,
  Clock,
  ChevronRight,
  User,
  MapPin,
  Instagram,
  Sparkles,
  CheckCircle2,
  Plus,
  ArrowRight,
  Phone,
  Star,
} from "lucide-react";
import { supabase, getBarbershopId, getMissingClientEnvVars } from "@/lib/supabase";
import { formatCurrency, formatDuration, fixMojibake } from "@/lib/utils";

/* ─────────── tipos ─────────── */

interface Service {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price: number;
}

interface Barber {
  id: string;
  name: string;
  bio: string | null;
  avatar_url: string | null;
}

interface SiteSettings {
  brand_name: string;
  brand_tagline: string | null;
  accent_color: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string | null;
  deposit_percentage: number;
  instagram_url: string | null;
  maps_embed_url: string | null;
  about_history: string | null;
  about_location: string | null;
  about_payment_methods: string | null;
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

/* ─────────── animações ─────────── */

const pageVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } },
};

const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.92 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

/* ─────────── páginas ─────────── */
type PageId = "home" | "servicos" | "sobre" | "barbeiros" | "contato";

export default function HomePage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [faq, setFaq] = useState<FaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<PageId>("home");
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const missingEnv = useMemo(() => getMissingClientEnvVars(), []);

  useEffect(() => {
    if (missingEnv.length > 0) {
      setIsLoading(false);
      return;
    }

    async function loadData() {
      try {
        const shopId = getBarbershopId();

        const { data: setRes } = await supabase
          .from("public_site_settings")
          .select("*")
          .eq("barbershop_id", shopId)
          .maybeSingle();

        if (setRes) {
          setSettings({
            ...setRes,
            brand_name: fixMojibake(setRes.brand_name),
            brand_tagline: fixMojibake(setRes.brand_tagline),
            hero_title: fixMojibake(setRes.hero_title),
            hero_subtitle: fixMojibake(setRes.hero_subtitle),
            about_text: fixMojibake(setRes.about_text),
            about_location: fixMojibake(setRes.about_location),
          });
        }

        const { data: srvRes } = await supabase
          .from("public_services")
          .select("*")
          .eq("barbershop_id", shopId)
          .order("price", { ascending: true });

        if (srvRes) {
          setServices(
            srvRes.map((s) => ({
              ...s,
              name: fixMojibake(s.name),
              description: s.description ? fixMojibake(s.description) : null,
            }))
          );
        }

        const { data: barbRes } = await supabase
          .from("public_barbers")
          .select("*")
          .eq("barbershop_id", shopId);

        if (barbRes) {
          setBarbers(
            barbRes.map((b) => ({
              ...b,
              name: fixMojibake(b.name),
              bio: b.bio ? fixMojibake(b.bio) : null,
            }))
          );
        }

        const { data: faqRes } = await supabase
          .from("public_faq_items")
          .select("id, question, answer")
          .eq("barbershop_id", shopId)
          .order("sort_order", { ascending: true });

        if (faqRes) {
          setFaq(
            faqRes.map((f) => ({
              ...f,
              question: fixMojibake(f.question),
              answer: fixMojibake(f.answer),
            }))
          );
        }
      } catch (err: unknown) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [missingEnv]);

  const navItems: { id: PageId; label: string }[] = [
    { id: "home", label: "Início" },
    { id: "servicos", label: "Serviços" },
    { id: "sobre", label: "Sobre" },
    { id: "barbeiros", label: "Profissionais" },
    { id: "contato", label: "Contato" },
  ];

  const navigateTo = (page: PageId) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0 });
  };

  return (
    <main className="min-h-screen bg-bg text-text selection:bg-accent/30 selection:text-text overflow-hidden">
      {/* Aviso de Configuração */}
      {missingEnv.length > 0 && (
        <div className="bg-accent/10 p-3 text-center text-xs text-accent">
          Configuração pendente no .env.local: {missingEnv.join(", ")}
        </div>
      )}

      {/* ═══════ HEADER FIXO ═══════ */}
      <header className="fixed top-0 inset-x-0 z-50 bg-bg/80 backdrop-blur-xl border-b border-hairline">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => navigateTo("home")} className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full bg-accent/10 text-accent flex items-center justify-center transition-transform group-hover:scale-105">
              <Scissors className="w-4 h-4 rotate-45" />
            </div>
            <div>
              <span className="font-serif text-base font-bold text-text tracking-tight">
                {settings?.brand_name || "Barbearia"}
              </span>
              <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted leading-none mt-0.5">
                {settings?.brand_tagline || "Estilo Masculino"}
              </p>
            </div>
          </button>

          {/* Nav Central */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`relative px-4 py-2 text-xs font-medium transition-colors rounded-full ${
                  currentPage === item.id
                    ? "text-text bg-surface-2"
                    : "text-text-muted hover:text-text hover:bg-surface/60"
                }`}
              >
                {item.label}
                {currentPage === item.id && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-[17px] left-1/2 -translate-x-1/2 w-5 h-[2px] bg-accent rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/meu-agendamento"
              className="hidden sm:inline-flex text-xs text-text-muted hover:text-text transition-colors"
            >
              Meu agendamento
            </Link>
            <Link
              href="/agendar"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-accent-contrast px-5 py-2.5 rounded-full font-semibold text-xs transition-all active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Agendar</span>
            </Link>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center gap-1 overflow-x-auto px-4 pb-3 scrollbar-none">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`shrink-0 px-3.5 py-1.5 text-[11px] font-medium rounded-full transition-colors ${
                currentPage === item.id
                  ? "text-text bg-surface-2"
                  : "text-text-muted"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      {/* ═══════ CONTEÚDO POR PÁGINA ═══════ */}
      <div className="pt-[88px] md:pt-[72px]">
        <AnimatePresence mode="wait">
          {/* ─── HOME ─── */}
          {currentPage === "home" && (
            <motion.div key="home" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              {/* Hero com Imagem de Fundo Escurecida e Opacidade Baixa */}
              <section className="px-4 md:px-8 pt-6 pb-8 max-w-7xl mx-auto">
                <div className="relative rounded-[32px] md:rounded-[44px] overflow-hidden min-h-[75vh] flex items-center justify-center bg-black shadow-soft border border-hairline">
                  {/* Imagem de Fundo com Opacidade Baixa */}
                  <img
                    src="/hero-bg.jpg"
                    alt="Barbearia"
                    className="absolute inset-0 w-full h-full object-cover opacity-25 select-none pointer-events-none"
                  />
                  {/* Overlay Escuro (Quadrado Preto com Opacidade ~70%) */}
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px]" />

                  {/* Conteúdo */}
                  <motion.div
                    className="relative z-10 text-center max-w-2xl mx-auto px-6 py-16"
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                  >
                    {/* Tag */}
                    <motion.div variants={fadeUp} className="mb-8">
                      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/8 border border-white/10 text-white/70 text-xs font-medium backdrop-blur-sm">
                        <Sparkles className="w-3 h-3" />
                        Experiência & Pontualidade
                      </span>
                    </motion.div>

                    {/* Título */}
                    <motion.h1
                      variants={fadeUp}
                      className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-[1.05] tracking-tight mb-6"
                    >
                      Redefinindo o{" "}
                      <span className="italic text-accent">
                        Estilo Masculino
                      </span>
                    </motion.h1>

                    {/* Subtítulo */}
                    <motion.p
                      variants={fadeUp}
                      className="text-white/55 text-sm sm:text-base max-w-lg mx-auto mb-10 leading-relaxed font-light"
                    >
                      {settings?.hero_subtitle ||
                        "Cortes clássicos e modernos, toalha aromática quente e agendamento online instantâneo sem filas."}
                    </motion.p>

                    {/* Botões */}
                    <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <Link
                        href="/agendar"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-accent hover:bg-accent-hover text-accent-contrast px-8 py-4 rounded-full font-semibold text-sm transition-all active:scale-95"
                      >
                        <Calendar className="w-4 h-4" />
                        Agendar horário
                      </Link>
                      <button
                        onClick={() => navigateTo("servicos")}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/8 hover:bg-white/12 border border-white/10 text-white px-8 py-4 rounded-full font-medium text-sm transition-all backdrop-blur-sm"
                      >
                        Ver serviços
                        <ArrowRight className="w-4 h-4 text-accent" />
                      </button>
                    </motion.div>
                  </motion.div>
                </div>
              </section>

              {/* Quick Stats */}
              <motion.section
                className="px-4 md:px-8 pb-16 max-w-5xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { num: `${services.length || "5"}+`, label: "Serviços" },
                    { num: `${barbers.length || "3"}`, label: "Profissionais" },
                    { num: "4.9", label: "Avaliação" },
                    { num: "24h", label: "Agendamento" },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      className="bg-surface rounded-[24px] p-6 text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + i * 0.1 }}
                    >
                      <div className="font-serif text-2xl font-bold text-accent mb-1">{stat.num}</div>
                      <div className="text-xs text-text-muted">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* Preview dos Serviços (3 primeiros) */}
              {services.length > 0 && (
                <section className="px-4 md:px-8 pb-20 max-w-5xl mx-auto">
                  <div className="flex items-end justify-between mb-8">
                    <div>
                      <span className="text-[11px] uppercase tracking-[0.2em] text-accent font-medium block mb-1">
                        Destaques
                      </span>
                      <h2 className="font-serif text-2xl font-semibold text-text">Serviços Populares</h2>
                    </div>
                    <button
                      onClick={() => navigateTo("servicos")}
                      className="text-xs text-text-muted hover:text-accent transition-colors flex items-center gap-1"
                    >
                      Ver todos <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {services.slice(0, 3).map((srv, i) => (
                      <motion.div
                        key={srv.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * i, duration: 0.4 }}
                        className="bg-surface hover:bg-surface-2/70 rounded-[20px] md:rounded-full px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center text-accent shrink-0 group-hover:bg-accent/10 transition-colors">
                            <Scissors className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="font-serif text-sm font-bold text-text">{srv.name}</h3>
                            <p className="text-[11px] text-text-muted line-clamp-1">
                              {srv.description || "Atendimento premium completo."}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-5">
                          <span className="text-xs text-text-muted flex items-center gap-1">
                            <Clock className="w-3 h-3 text-accent" />
                            {formatDuration(srv.duration_minutes)}
                          </span>
                          <span className="font-serif font-bold text-accent">{formatCurrency(srv.price)}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}
            </motion.div>
          )}

          {/* ─── SERVIÇOS ─── */}
          {currentPage === "servicos" && (
            <motion.div key="servicos" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <section className="px-4 md:px-8 py-12 max-w-5xl mx-auto">
                <motion.div variants={staggerContainer} initial="initial" animate="animate">
                  <motion.div variants={fadeUp} className="text-center mb-12">
                    <span className="text-[11px] uppercase tracking-[0.2em] text-accent font-medium block mb-2">
                      Cardápio
                    </span>
                    <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-text">
                      Nossos <span className="italic text-accent">Serviços</span>
                    </h1>
                    <p className="text-xs text-text-muted mt-3 max-w-md mx-auto">
                      Selecione os procedimentos desejados e agende diretamente pelo site.
                    </p>
                  </motion.div>

                  {isLoading ? (
                    <div className="flex justify-center py-16">
                      <span className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : services.length === 0 ? (
                    <motion.div variants={fadeUp} className="bg-surface-2 p-12 text-center rounded-[28px] text-xs text-text-muted">
                      Nenhum serviço disponível no momento.
                    </motion.div>
                  ) : (
                    <div className="space-y-3">
                      {services.map((srv, i) => (
                        <motion.div
                          key={srv.id}
                          variants={fadeUp}
                          custom={i}
                          className="bg-surface hover:bg-surface-2/70 rounded-[20px] md:rounded-full px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center text-accent shrink-0 group-hover:bg-accent/10 transition-colors">
                              <Scissors className="w-4 h-4" />
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
                            <div className="font-serif font-bold text-base text-accent">
                              {formatCurrency(srv.price)}
                            </div>
                            <Link
                              href={`/agendar?service=${srv.id}`}
                              className="bg-surface-2 hover:bg-accent hover:text-accent-contrast text-text px-4 py-1.5 rounded-full text-xs font-bold transition-all"
                            >
                              Agendar
                            </Link>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Barra inferior CTA */}
                  <motion.div variants={fadeUp} className="mt-12 text-center">
                    <Link
                      href="/agendar"
                      className="inline-flex items-center gap-2.5 bg-accent hover:bg-accent-hover text-accent-contrast px-8 py-4 rounded-full font-semibold text-sm transition-all active:scale-95"
                    >
                      <Calendar className="w-4 h-4" />
                      Agendar agora
                    </Link>
                  </motion.div>
                </motion.div>
              </section>
            </motion.div>
          )}

          {/* ─── SOBRE ─── */}
          {currentPage === "sobre" && (
            <motion.div key="sobre" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <section className="px-4 md:px-8 py-12 max-w-5xl mx-auto">
                <motion.div variants={staggerContainer} initial="initial" animate="animate">
                  <motion.div variants={fadeUp} className="text-center mb-12">
                    <span className="text-[11px] uppercase tracking-[0.2em] text-accent font-medium block mb-2">
                      Sobre a Casa
                    </span>
                    <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-text">
                      Tradição & <span className="italic text-accent">Hospitalidade</span>
                    </h1>
                  </motion.div>

                  {/* Hero Image repetida para sobre com baixa opacidade */}
                  <motion.div variants={scaleIn} className="relative rounded-[32px] overflow-hidden h-64 md:h-80 mb-12 bg-black border border-hairline">
                    <img src="/hero-bg.jpg" alt="Barbearia" className="w-full h-full object-cover opacity-25 select-none pointer-events-none" />
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-5 py-2.5 rounded-full text-white/80 text-xs font-medium backdrop-blur-sm">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Agendamento online 24h, sem ligação e sem espera
                      </div>
                    </div>
                  </motion.div>

                  {/* Grid de Conteúdo */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div variants={fadeUp} className="bg-surface rounded-[28px] p-8 space-y-4">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="font-mono text-xs text-accent/60">01</span>
                        <h3 className="font-serif text-lg font-bold text-text">Nossa História</h3>
                      </div>
                      <p className="text-sm text-text-muted leading-relaxed">
                        {settings?.about_history ||
                          "Nascemos do desejo de resgatar o ambiente clássico das barbearias com a agilidade do mundo contemporâneo. Cada cliente é recebido com café fresco, ambiente climatizado e atendimento exclusivo focado na sua melhor versão."}
                      </p>
                    </motion.div>

                    <motion.div variants={fadeUp} className="bg-surface rounded-[28px] p-8 space-y-4">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="font-mono text-xs text-accent/60">02</span>
                        <h3 className="font-serif text-lg font-bold text-text">Nossos Profissionais</h3>
                      </div>
                      <p className="text-sm text-text-muted leading-relaxed">
                        Nossos profissionais passam por constantes especializações nas academias de visagismo mais conceituadas do país. Pontualidade e atenção personalizada são nossas marcas registradas.
                      </p>
                      <button
                        onClick={() => navigateTo("barbeiros")}
                        className="text-xs text-accent hover:text-accent-hover flex items-center gap-1.5 mt-2 font-medium transition-colors"
                      >
                        Conhecer o time <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>

                    <motion.div variants={fadeUp} className="bg-surface rounded-[28px] p-8 space-y-4">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="font-mono text-xs text-accent/60">03</span>
                        <h3 className="font-serif text-lg font-bold text-text">Localização</h3>
                      </div>
                      <p className="text-sm text-text-muted leading-relaxed">
                        {settings?.about_location ||
                          "Localizada em ponto nobre da cidade, com vagas exclusivas na porta e total acessibilidade para sua comodidade e segurança."}
                      </p>
                    </motion.div>

                    <motion.div variants={fadeUp} className="bg-surface rounded-[28px] p-8 space-y-4">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="font-mono text-xs text-accent/60">04</span>
                        <h3 className="font-serif text-lg font-bold text-text">Formas de Pagamento</h3>
                      </div>
                      <p className="text-sm text-text-muted leading-relaxed">
                        {settings?.about_payment_methods ||
                          "Aceitamos Pix instantâneo, cartões de crédito e débito das principais bandeiras e pagamento presencial no balcão ao término do seu atendimento."}
                      </p>
                    </motion.div>
                  </div>

                  {/* FAQ */}
                  {faq.length > 0 && (
                    <motion.div variants={fadeUp} className="mt-16">
                      <h2 className="font-serif text-2xl font-semibold text-text mb-8 text-center">
                        Perguntas <span className="italic text-accent">Frequentes</span>
                      </h2>
                      <div className="space-y-2 max-w-3xl mx-auto">
                        {faq.map((item) => {
                          const isOpen = openFaqId === item.id;
                          return (
                            <div key={item.id} className="bg-surface rounded-[20px] overflow-hidden">
                              <button
                                onClick={() => setOpenFaqId(isOpen ? null : item.id)}
                                className="w-full flex items-center justify-between text-left px-6 py-4 group"
                              >
                                <span className="font-serif text-sm font-bold text-text group-hover:text-accent transition-colors">
                                  {item.question}
                                </span>
                                <motion.span
                                  className="w-7 h-7 rounded-full bg-surface-2 text-accent flex items-center justify-center text-sm shrink-0 ml-4"
                                  animate={{ rotate: isOpen ? 45 : 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </motion.span>
                              </button>
                              <AnimatePresence>
                                {isOpen && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="px-6 pb-4 text-sm text-text-muted leading-relaxed">
                                      {item.answer}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </section>
            </motion.div>
          )}

          {/* ─── BARBEIROS ─── */}
          {currentPage === "barbeiros" && (
            <motion.div key="barbeiros" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <section className="px-4 md:px-8 py-12 max-w-5xl mx-auto">
                <motion.div variants={staggerContainer} initial="initial" animate="animate">
                  <motion.div variants={fadeUp} className="text-center mb-12">
                    <span className="text-[11px] uppercase tracking-[0.2em] text-accent font-medium block mb-2">
                      Time de Mestres
                    </span>
                    <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-text">
                      Nossos <span className="italic text-accent">Profissionais</span>
                    </h1>
                    <p className="text-xs text-text-muted mt-2">
                      Escolha seu barbeiro de confiança ou agende sem preferência
                    </p>
                  </motion.div>

                  {isLoading ? (
                    <div className="flex justify-center py-16">
                      <span className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : barbers.length === 0 ? (
                    <motion.div variants={fadeUp} className="bg-surface-2 p-12 text-center rounded-[28px] text-xs text-text-muted">
                      Profissionais sendo cadastrados.
                    </motion.div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {barbers.map((b, i) => (
                        <motion.div
                          key={b.id}
                          variants={scaleIn}
                          custom={i}
                          className="bg-surface rounded-[28px] p-8 flex flex-col items-center text-center group cursor-pointer transition-all hover:bg-surface-2/50"
                        >
                          {/* Avatar Circular */}
                          <motion.div
                            className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-surface-2 p-1 mb-5"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          >
                            <div className="w-full h-full rounded-full bg-surface flex items-center justify-center text-accent overflow-hidden font-serif text-2xl font-bold">
                              {b.avatar_url ? (
                                <img src={b.avatar_url} alt={b.name} className="w-full h-full object-cover" />
                              ) : (
                                <span>{b.name.charAt(0)}</span>
                              )}
                            </div>
                          </motion.div>

                          <h3 className="font-serif text-lg font-bold text-text group-hover:text-accent transition-colors">
                            {b.name}
                          </h3>
                          <span className="text-xs text-text-muted mt-1 mb-5">
                            {b.bio || "Especialista em Visagismo"}
                          </span>

                          <Link
                            href={`/agendar?barber=${b.id}`}
                            className="bg-surface-2 hover:bg-accent hover:text-accent-contrast text-text px-5 py-2 rounded-full text-xs font-semibold transition-all"
                          >
                            Agendar com {b.name.split(" ")[0]}
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  <motion.div variants={fadeUp} className="mt-12 text-center">
                    <Link
                      href="/agendar"
                      className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-accent-contrast px-7 py-3.5 rounded-full font-semibold text-sm transition-all active:scale-95"
                    >
                      <Sparkles className="w-4 h-4" />
                      Agendar sem preferência
                    </Link>
                  </motion.div>
                </motion.div>
              </section>
            </motion.div>
          )}

          {/* ─── CONTATO ─── */}
          {currentPage === "contato" && (
            <motion.div key="contato" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <section className="px-4 md:px-8 py-12 max-w-5xl mx-auto">
                <motion.div variants={staggerContainer} initial="initial" animate="animate">
                  <motion.div variants={fadeUp} className="text-center mb-12">
                    <span className="text-[11px] uppercase tracking-[0.2em] text-accent font-medium block mb-2">
                      Fale Conosco
                    </span>
                    <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-text">
                      Contato & <span className="italic text-accent">Localização</span>
                    </h1>
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Horários */}
                    <motion.div variants={fadeUp} className="bg-surface rounded-[28px] p-8">
                      <h3 className="font-serif text-base font-bold text-text mb-6">Horários</h3>
                      <div className="space-y-3 text-xs">
                        <div className="flex justify-between py-2 border-b border-hairline">
                          <span className="text-text-muted">Segunda a Sexta</span>
                          <span className="text-text font-semibold">09:00 — 20:00</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-hairline">
                          <span className="text-text-muted">Sábado</span>
                          <span className="text-text font-semibold">08:30 — 19:00</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-text-muted">Domingo & Feriados</span>
                          <span className="text-danger font-semibold">Fechado</span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Localização */}
                    <motion.div variants={fadeUp} className="bg-surface rounded-[28px] p-8">
                      <h3 className="font-serif text-base font-bold text-text mb-6">Onde Estamos</h3>
                      <p className="text-xs text-text-muted leading-relaxed mb-4">
                        {settings?.about_location || "Rua Augusta, 1500 — Jardins, São Paulo - SP"}
                      </p>
                      <div className="h-28 rounded-[20px] bg-surface-2 flex items-center justify-center text-text-muted/50 text-xs">
                        <MapPin className="w-4 h-4 text-accent mr-2" />
                        Google Maps
                      </div>
                    </motion.div>

                    {/* Redes */}
                    <motion.div variants={fadeUp} className="bg-surface rounded-[28px] p-8">
                      <h3 className="font-serif text-base font-bold text-text mb-6">Conecte-se</h3>
                      <p className="text-xs text-text-muted leading-relaxed mb-5">
                        Acompanhe nossos trabalhos, transformações e dicas no Instagram.
                      </p>
                      <a
                        href={settings?.instagram_url || "https://instagram.com"}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-accent-contrast px-5 py-2.5 rounded-full font-semibold text-xs transition-all active:scale-95"
                      >
                        <Instagram className="w-4 h-4" />
                        Siga no Instagram
                      </a>
                    </motion.div>
                  </div>

                  {/* Linha Final */}
                  <motion.div
                    variants={fadeUp}
                    className="mt-16 pt-8 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-text-muted"
                  >
                    <div>
                      &copy; {new Date().getFullYear()} {settings?.brand_name || "Barbearia"}. Todos os direitos reservados.
                    </div>
                    <div className="flex items-center gap-6">
                      <Link href="/termos" className="hover:text-accent transition-colors">Termos de Uso</Link>
                      <Link href="/privacidade" className="hover:text-accent transition-colors">Privacidade (LGPD)</Link>
                      <Link href="/cancelamento" className="hover:text-accent transition-colors">Cancelamento</Link>
                    </div>
                  </motion.div>
                </motion.div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
