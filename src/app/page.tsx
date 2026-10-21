"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Scissors,
  Calendar,
  Clock,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  User,
  Plus,
  MapPin,
  Instagram,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { supabase, getBarbershopId, getMissingClientEnvVars } from "@/lib/supabase";
import { formatCurrency, formatDuration } from "@/lib/utils";

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

export default function HomePage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [faq, setFaq] = useState<FaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados Interativos de Redesign
  const [aboutTab, setAboutTab] = useState<"historia" | "barbeiros" | "localizacao" | "pagamento">("historia");
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(1);

  const missingEnv = getMissingClientEnvVars();

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

        if (setRes) setSettings(setRes);

        const { data: srvRes } = await supabase
          .from("public_services")
          .select("*")
          .eq("barbershop_id", shopId)
          .order("price", { ascending: true });

        if (srvRes) setServices(srvRes);

        const { data: barbRes } = await supabase
          .from("public_barbers")
          .select("*")
          .eq("barbershop_id", shopId);

        if (barbRes) setBarbers(barbRes);

        const { data: faqRes } = await supabase
          .from("public_faq_items")
          .select("id, question, answer")
          .eq("barbershop_id", shopId)
          .order("sort_order", { ascending: true });

        if (faqRes) setFaq(faqRes);
      } catch (err: unknown) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [missingEnv]);

  const galleryItems = [
    { title: "Corte Clássico & Fade", tag: "Cabelo" },
    { title: "Barboterapia com Toalha Quente", tag: "Barba" },
    { title: "Penteado Executivo & Navalhado", tag: "Estilo" },
    { title: "Alinhamento & Pigmentação", tag: "Tratamento" },
  ];

  return (
    <main className="min-h-screen bg-bg text-text selection:bg-accent selection:text-accent-contrast">
      {/* Aviso de Configuração Pendente */}
      {missingEnv.length > 0 && (
        <div className="bg-amber-500/10 p-3 text-center text-xs text-accent">
          Configuração pendente no .env.local: {missingEnv.join(", ")}
        </div>
      )}

      {/* 1. NAVEGAÇÃO: Barra Flutuante em Pílula */}
      <header className="fixed top-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
        <div className="w-full max-w-5xl bg-surface/85 backdrop-blur-xl rounded-full px-6 py-3 flex items-center justify-between shadow-soft pointer-events-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-accent-soft text-accent flex items-center justify-center transition-transform group-hover:scale-105">
              <Scissors className="w-4 h-4 rotate-45" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold text-text">
                {settings?.brand_name || "Barbearia"}
              </span>
              <p className="text-[10px] uppercase tracking-wider text-text-muted">
                {settings?.brand_tagline || "Estilo Masculino"}
              </p>
            </div>
          </Link>

          {/* Links Centrais */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-text-muted">
            <a href="#inicio" className="hover:text-accent transition-colors">Início</a>
            <a href="#galeria" className="hover:text-accent transition-colors">Galeria</a>
            <a href="#servicos" className="hover:text-accent transition-colors">Serviços</a>
            <a href="#sobre" className="hover:text-accent transition-colors">Sobre</a>
            <a href="#barbeiros" className="hover:text-accent transition-colors">Profissionais</a>
            <Link href="/meu-agendamento" className="hover:text-accent transition-colors">Meu Agendamento</Link>
          </nav>

          {/* Botão de Destaque Pílula */}
          <Link
            href="/agendar"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-accent-contrast px-5 py-2.5 rounded-full font-bold text-xs shadow-glow transition-all active:scale-95"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Agendar horário</span>
          </Link>
        </div>
      </header>

      {/* 2. HERO: Inset com Cantos Arredondados e Destaque em Itálico */}
      <section id="inicio" className="pt-28 md:pt-36 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-[36px] md:rounded-[44px] overflow-hidden bg-gradient-to-b from-surface-2/90 via-surface/60 to-surface p-8 sm:p-14 md:p-24 text-center shadow-soft">
          {/* Brilho radial âmbar suave */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent-glow rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto">
            {/* Selo pílula */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-soft text-accent text-xs font-semibold mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Experiência & Pontualidade Britânica</span>
            </div>

            {/* Título com Serifa e Itálico Âmbar */}
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-text leading-[1.1] mb-6">
              Redefinindo o <span className="italic text-accent">Estilo Masculino</span>
            </h1>

            <p className="text-text-muted text-base sm:text-lg max-w-xl mx-auto mb-10 font-normal leading-relaxed">
              {settings?.hero_subtitle || "Cortes clássicos e modernos, toalha aromática quente e agendamento online instantâneo sem filas."}
            </p>

            {/* Ações em Pílula */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/agendar"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-accent hover:bg-accent-hover text-accent-contrast px-8 py-4 rounded-full font-bold text-sm shadow-glow transition-transform active:scale-95"
              >
                <Calendar className="w-4 h-4" />
                <span>Agendar horário</span>
              </Link>
              <a
                href="#servicos"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-surface-2 hover:bg-surface-3 text-text px-8 py-4 rounded-full font-semibold text-sm transition-all"
              >
                <span>Ver serviços</span>
                <ChevronRight className="w-4 h-4 text-accent" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. GALERIA: Carrossel com Raio Grande e Contador */}
      <section id="galeria" className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-accent font-semibold block mb-2">
              Galeria Visual
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-text">
              Ambiente & <span className="italic text-accent underline decoration-accent/40 decoration-2 underline-offset-8">Trabalhos</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-text-muted bg-surface-2 px-4 py-2 rounded-full">
              {galleryIndex} / {galleryItems.length}
            </span>
            <button
              onClick={() => setGalleryIndex((prev) => (prev > 1 ? prev - 1 : galleryItems.length))}
              className="w-10 h-10 rounded-full bg-surface-2 hover:bg-surface-3 text-text flex items-center justify-center transition-colors active:scale-95"
              title="Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setGalleryIndex((prev) => (prev < galleryItems.length ? prev + 1 : 1))}
              className="w-10 h-10 rounded-full bg-surface-2 hover:bg-surface-3 text-text flex items-center justify-center transition-colors active:scale-95"
              title="Próximo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Fotos Verticais com Raio Grande */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleryItems.map((item, idx) => {
            const isCurrent = idx + 1 === galleryIndex;
            return (
              <div
                key={item.title}
                onClick={() => setGalleryIndex(idx + 1)}
                className={`relative rounded-[32px] overflow-hidden bg-gradient-to-b from-surface-2 to-surface p-8 h-80 flex flex-col justify-end transition-all duration-300 cursor-pointer ${
                  isCurrent ? "ring-2 ring-accent shadow-glow" : "opacity-80 hover:opacity-100"
                }`}
              >
                <div className="absolute top-6 left-6">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-accent bg-accent-soft px-3 py-1 rounded-full">
                    {item.tag}
                  </span>
                </div>
                <div className="relative z-10">
                  <h3 className="font-serif text-lg font-bold text-text mb-1">{item.title}</h3>
                  <p className="text-xs text-text-muted">Acabamento com precisão milimétrica</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. SERVIÇOS: Linhas Respiradas e Preço em Âmbar (Sem grade de caixas) */}
      <section id="servicos" className="py-24 px-4 md:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-accent font-semibold block mb-2">
            Cardápio Exclusivo
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-text">
            Nossos <span className="italic text-accent">Serviços</span>
          </h2>
          <p className="text-xs text-text-muted mt-3">Escolha os procedimentos desejados para o seu agendamento</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : services.length === 0 ? (
          <div className="bg-surface-2 p-12 text-center rounded-[32px] text-xs text-text-muted">
            Nenhum serviço disponível no momento.
          </div>
        ) : (
          <div className="space-y-3">
            {services.map((srv) => (
              <div
                key={srv.id}
                className="bg-surface hover:bg-surface-2/70 rounded-2xl md:rounded-full px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center text-accent shrink-0">
                    <Scissors className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-text">{srv.name}</h3>
                    <p className="text-xs text-text-muted line-clamp-1">
                      {srv.description || "Atendimento completo com produtos de linha premium."}
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
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. SOBRE A BARBEARIA: Lista Numerada à Esquerda e Conteúdo Dinâmico */}
      <section id="sobre" className="py-24 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="rounded-[36px] bg-surface p-8 sm:p-12 md:p-16 shadow-soft">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-10 pb-6 border-b border-hairline">
            <div>
              <span className="text-xs uppercase tracking-widest text-accent font-semibold block mb-1">
                Sobre a Casa
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-semibold text-text">
                Tradição & <span className="italic text-accent">Hospitalidade</span>
              </h2>
            </div>
            {/* Selo pílula 24h */}
            <div className="inline-flex items-center gap-2 bg-surface-2 px-4 py-2 rounded-full text-xs text-text-muted font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
              <span>Agendamento online 24h, sem ligação e sem espera</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Lista Numerada à Esquerda */}
            <div className="md:col-span-4 flex flex-col gap-2">
              {[
                { id: "historia", num: "01", label: "História" },
                { id: "barbeiros", num: "02", label: "Barbeiros" },
                { id: "localizacao", num: "03", label: "Localização" },
                { id: "pagamento", num: "04", label: "Formas de Pagamento" },
              ].map((item) => {
                const isActive = aboutTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setAboutTab(item.id as any)}
                    className={`flex items-center gap-3 px-5 py-3.5 rounded-full text-xs font-bold transition-all text-left ${
                      isActive
                        ? "bg-accent-soft text-accent shadow-sm"
                        : "text-text-muted hover:text-text hover:bg-surface-2"
                    }`}
                  >
                    <span className="font-mono text-accent/70">{item.num}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Conteúdo ao Lado com Transição */}
            <div className="md:col-span-8 bg-surface-2 rounded-[28px] p-8 md:p-10 leading-relaxed">
              {aboutTab === "historia" && (
                <div className="space-y-4">
                  <h3 className="font-serif text-xl font-bold text-text">Mais que um corte, um ritual</h3>
                  <p className="text-sm text-text-muted">
                    {settings?.about_history ||
                      "Nascemos do desejo de resgatar o ambiente clássico das barbearias com a agilidade do mundo contemporâneo. Cada cliente é recebido com café fresco, ambiente climatizado e atendimento exclusivo focado na sua melhor versão."}
                  </p>
                </div>
              )}

              {aboutTab === "barbeiros" && (
                <div className="space-y-4">
                  <h3 className="font-serif text-xl font-bold text-text">Mestres das Lâminas</h3>
                  <p className="text-sm text-text-muted">
                    Nossos profissionais passam por constantes especializações nas academias de visagismo mais conceituadas do país. Pontualidade e atenção personalizada são nossas marcas registradas.
                  </p>
                </div>
              )}

              {aboutTab === "localizacao" && (
                <div className="space-y-4">
                  <h3 className="font-serif text-xl font-bold text-text">Fácil Acesso & Estacionamento</h3>
                  <p className="text-sm text-text-muted">
                    {settings?.about_location ||
                      "Localizada em ponto nobre da cidade, com vagas exclusivas na porta e total acessibilidade para sua comodidade e segurança."}
                  </p>
                </div>
              )}

              {aboutTab === "pagamento" && (
                <div className="space-y-4">
                  <h3 className="font-serif text-xl font-bold text-text">Transparência & Praticidade</h3>
                  <p className="text-sm text-text-muted">
                    {settings?.about_payment_methods ||
                      "Aceitamos Pix instantâneo, cartões de crédito e débito das principais bandeiras e pagamento presencial no balcão ao término do seu atendimento."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 6. BARBEIROS: Círculos Grandes com Nome Embaixo (Sem cartões) */}
      <section id="barbeiros" className="py-24 px-4 md:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-accent font-semibold block mb-2">
            Time de Mestres
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-text">
            Nossos <span className="italic text-accent">Profissionais</span>
          </h2>
          <p className="text-xs text-text-muted mt-2">Escolha seu barbeiro de confiança ou agende sem preferência</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : barbers.length === 0 ? (
          <div className="bg-surface-2 p-12 text-center rounded-[32px] text-xs text-text-muted">
            Profissionais sendo cadastrados.
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-14">
            {barbers.map((b) => (
              <div key={b.id} className="flex flex-col items-center text-center group cursor-pointer">
                {/* Círculo Grande */}
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-surface-2 p-1 shadow-soft transition-transform group-hover:scale-105">
                  <div className="w-full h-full rounded-full bg-surface flex items-center justify-center text-accent overflow-hidden font-serif text-2xl font-bold">
                    {b.avatar_url ? (
                      <img src={b.avatar_url} alt={b.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{b.name.charAt(0)}</span>
                    )}
                  </div>
                </div>
                <h3 className="font-serif text-base font-bold text-text mt-4 group-hover:text-accent transition-colors">
                  {b.name}
                </h3>
                <span className="text-xs text-text-muted mt-0.5">{b.bio || "Especialista em Visagismo"}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 7. FAQ: Acordeão em Linhas com Botão Circular + */}
      {faq.length > 0 && (
        <section id="faq" className="py-24 px-4 md:px-8 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-widest text-accent font-semibold block mb-2">
              Dúvidas Comuns
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-text">
              Perguntas <span className="italic text-accent">Frequentes</span>
            </h2>
          </div>

          <div className="divide-y divide-hairline">
            {faq.map((item) => {
              const isOpen = openFaqId === item.id;
              return (
                <div key={item.id} className="py-5">
                  <button
                    onClick={() => setOpenFaqId(isOpen ? null : item.id)}
                    className="w-full flex items-center justify-between text-left group"
                  >
                    <span className="font-serif text-base md:text-lg font-bold text-text group-hover:text-accent transition-colors">
                      {item.question}
                    </span>
                    <span
                      className={`w-8 h-8 rounded-full bg-surface-2 text-accent flex items-center justify-center text-sm font-bold transition-transform duration-300 shrink-0 ml-4 ${
                        isOpen ? "rotate-45 bg-accent text-accent-contrast" : ""
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                    </span>
                  </button>
                  {isOpen && (
                    <div className="pt-3 pb-2 text-sm text-text-muted leading-relaxed animate-in fade-in">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 8. RODAPÉ: 3 Blocos sem cartões + Mapa Arredondado + Instagram em Pílula */}
      <footer className="mt-20 pt-16 pb-12 px-4 md:px-8 bg-surface text-text-muted text-xs">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Horários */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-text mb-4">Horários de Atendimento</h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-hairline">
                <span>Segunda a Sexta</span>
                <span className="text-text font-semibold">09:00 — 20:00</span>
              </div>
              <div className="flex justify-between py-1 border-b border-hairline">
                <span>Sábado</span>
                <span className="text-text font-semibold">08:30 — 19:00</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Domingo & Feriados</span>
                <span className="text-danger font-semibold">Fechado</span>
              </div>
            </div>
          </div>

          {/* Localização */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-text mb-4">Onde Estamos</h4>
            <p className="text-xs leading-relaxed">
              {settings?.about_location || "Rua Augusta, 1500 — Jardins, São Paulo - SP"}
            </p>
            <div className="h-32 rounded-[24px] bg-surface-2 flex items-center justify-center text-text-muted/60 text-xs mt-3">
              <MapPin className="w-4 h-4 text-accent mr-2" />
              <span>Mapa integrado via Google Maps</span>
            </div>
          </div>

          {/* Redes Sociais */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-bold text-text mb-4">Conecte-se</h4>
            <p className="text-xs leading-relaxed">
              Acompanhe nossos trabalhos diários, transformações e dicas de cuidados masculinos no Instagram.
            </p>
            <a
              href={settings?.instagram_url || "https://instagram.com"}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black px-6 py-3 rounded-full font-bold text-xs shadow-glow transition-transform active:scale-95"
            >
              <Instagram className="w-4 h-4" />
              <span>Siga no Instagram</span>
            </a>
          </div>
        </div>

        {/* Linha Final */}
        <div className="max-w-6xl mx-auto pt-8 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} {settings?.brand_name || "Barbearia"}. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/termos" className="hover:text-accent transition-colors">Termos de Uso</Link>
            <Link href="/privacidade" className="hover:text-accent transition-colors">Privacidade (LGPD)</Link>
            <Link href="/cancelamento" className="hover:text-accent transition-colors">Cancelamento</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
