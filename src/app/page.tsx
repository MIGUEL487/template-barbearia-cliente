"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Scissors,
  Calendar,
  Clock,
  ShieldCheck,
  ChevronRight,
  User,
  HelpCircle,
  MapPin,
  Instagram,
  AlertCircle,
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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const missingEnv = getMissingClientEnvVars();

  useEffect(() => {
    if (missingEnv.length > 0) {
      setErrorMsg(`Configuração pendente no .env.local: ${missingEnv.join(", ")}`);
      setIsLoading(false);
      return;
    }

    async function loadData() {
      try {
        const shopId = getBarbershopId();

        // 1. Carregar Configurações Públicas
        const { data: setRes } = await supabase
          .from("public_site_settings")
          .select("*")
          .eq("barbershop_id", shopId)
          .maybeSingle();

        if (setRes) setSettings(setRes);

        // 2. Carregar Serviços Ativos
        const { data: srvRes } = await supabase
          .from("public_services")
          .select("*")
          .eq("barbershop_id", shopId);

        if (srvRes) setServices(srvRes);

        // 3. Carregar Barbeiros Ativos
        const { data: barbRes } = await supabase
          .from("public_barbers")
          .select("*")
          .eq("barbershop_id", shopId);

        if (barbRes) setBarbers(barbRes);

        // 4. Carregar FAQ
        const { data: faqRes } = await supabase
          .from("public_faq_items")
          .select("id, question, answer")
          .eq("barbershop_id", shopId)
          .order("sort_order", { ascending: true });

        if (faqRes) setFaq(faqRes);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Erro ao carregar dados";
        console.error(msg);
        setErrorMsg(msg);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <main className="min-h-screen flex flex-col bg-bg text-text">
      {/* Aviso de Configuração Pendente */}
      {missingEnv.length > 0 && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 p-3 text-center text-xs text-amber-300">
          <strong>⚠️ Instalação em modo de configuração:</strong> Crie o arquivo <code className="bg-black/40 px-1 py-0.5 rounded">.env.local</code> preenchendo as variáveis: {missingEnv.join(", ")}
        </div>
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-bg/90 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-surface border border-accent/30 flex items-center justify-center text-accent">
              <Scissors className="w-5 h-5 rotate-45" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-text">
                {settings?.brand_name || "Barbearia"} <span className="italic text-accent">Premium</span>
              </span>
              <p className="text-[10px] tracking-widest uppercase text-text-muted">
                {settings?.brand_tagline || "Tradição & Estilo"}
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-text-muted">
            <a href="#inicio" className="hover:text-accent transition-colors">Início</a>
            <a href="#servicos" className="hover:text-accent transition-colors">Serviços</a>
            <a href="#barbeiros" className="hover:text-accent transition-colors">Profissionais</a>
            <a href="#faq" className="hover:text-accent transition-colors">Dúvidas</a>
            <Link href="/meu-agendamento" className="hover:text-accent transition-colors">Meu Agendamento</Link>
          </nav>

          <Link
            href="/agendar"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-accent-contrast px-5 py-2.5 rounded-sm font-semibold text-sm transition-all shadow-premium"
          >
            <Calendar className="w-4 h-4" />
            <span>Agendar Horário</span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="relative py-24 md:py-32 px-4 border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-surface text-accent text-xs font-semibold mb-6">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Agendamento 100% Online e Seguro</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-tight text-text mb-6">
            {settings?.hero_title || "Redefinindo o Estilo Masculino"}
          </h1>

          <p className="text-text-muted text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            {settings?.hero_subtitle || "Cortes clássicos, alinhamento de barba com toalha quente e atendimento com pontualidade."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/agendar"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-accent-contrast px-8 py-4 rounded-sm font-bold text-base transition-all shadow-premium"
            >
              <Calendar className="w-5 h-5" />
              <span>Agendar Agora</span>
            </Link>
            <a
              href="#servicos"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-surface hover:bg-surface-2 border border-border text-text px-8 py-4 rounded-sm font-semibold text-base transition-colors"
            >
              <span>Ver Serviços & Preços</span>
              <ChevronRight className="w-4 h-4 text-text-muted" />
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicos" className="py-20 px-4 border-b border-border bg-surface/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs uppercase tracking-widest text-accent font-semibold">Tabela de Atendimento</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-2 text-text">
              Serviços <span className="italic text-accent">Disponíveis</span>
            </h2>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <span className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-12 text-sm text-text-muted border border-dashed border-border rounded-md">
              Nenhum serviço cadastrado no momento.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map((srv) => (
                <div key={srv.id} className="bg-surface border border-border p-6 rounded-md hover:border-accent/50 transition-colors flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-serif text-xl font-bold text-text">{srv.name}</h3>
                      <span className="font-bold text-accent">{formatCurrency(srv.price)}</span>
                    </div>
                    {srv.description && (
                      <p className="text-sm text-text-muted mb-4">{srv.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-muted font-medium pt-3 border-t border-border">
                    <Clock className="w-4 h-4 text-accent" />
                    <span>Duração: {formatDuration(srv.duration_minutes)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Barbers Section */}
      <section id="barbeiros" className="py-20 px-4 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs uppercase tracking-widest text-accent font-semibold">Equipe Especialista</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-2 text-text">
              Nossos <span className="italic text-accent">Barbeiros</span>
            </h2>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <span className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : barbers.length === 0 ? (
            <div className="text-center py-12 text-sm text-text-muted border border-dashed border-border rounded-md">
              Nenhum profissional cadastrado no momento.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {barbers.map((b) => (
                <div key={b.id} className="bg-surface border border-border p-6 rounded-md text-center">
                  <div className="w-16 h-16 rounded-full bg-surface-2 border border-accent/40 flex items-center justify-center text-accent mx-auto mb-4">
                    <User className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-text">{b.name}</h3>
                  {b.bio && <p className="text-xs text-text-muted mt-2">{b.bio}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      {faq.length > 0 && (
        <section id="faq" className="py-20 px-4 border-b border-border bg-surface/30">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-xs uppercase tracking-widest text-accent font-semibold">Tire suas Dúvidas</span>
              <h2 className="font-serif text-3xl font-bold mt-2 text-text">Perguntas Frequentes</h2>
            </div>

            <div className="space-y-4">
              {faq.map((item) => (
                <div key={item.id} className="bg-surface border border-border p-5 rounded-md">
                  <h3 className="font-serif font-bold text-base text-text mb-2 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-accent" />
                    <span>{item.question}</span>
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-auto py-12 px-4 border-t border-border bg-bg text-text-muted text-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Scissors className="w-4 h-4 text-accent" />
            <span className="font-serif font-bold text-text">{settings?.brand_name || "Barbearia"}</span>
            <span>&copy; {new Date().getFullYear()} — Todos os direitos reservados.</span>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <Link href="/termos" className="hover:text-accent transition-colors">Termos de Uso</Link>
            <Link href="/privacidade" className="hover:text-accent transition-colors">Privacidade (LGPD)</Link>
            <Link href="/cancelamento" className="hover:text-accent transition-colors">Política de Cancelamento</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
