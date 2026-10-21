import Link from "next/link";
import { Scissors, Calendar, Clock, MapPin, Instagram, ShieldCheck, ChevronRight } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-bg text-text">
      {/* Top Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-bg/90 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-surface border border-accent/30 flex items-center justify-center text-accent">
              <Scissors className="w-5 h-5 rotate-45" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-text">
                Barbearia <span className="italic text-accent">Premium</span>
              </span>
              <p className="text-[10px] tracking-widest uppercase text-text-muted">Tradição & Estilo</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-text-muted">
            <a href="#inicio" className="hover:text-accent transition-colors">Início</a>
            <a href="#servicos" className="hover:text-accent transition-colors">Serviços</a>
            <a href="#barbeiros" className="hover:text-accent transition-colors">Profissionais</a>
            <a href="#sobre" className="hover:text-accent transition-colors">Sobre</a>
            <a href="#faq" className="hover:text-accent transition-colors">Dúvidas</a>
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
            Redefinindo o <span className="italic text-accent underline decoration-accent/40 underline-offset-8">Estilo Masculino</span>
          </h1>

          <p className="text-text-muted text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Cortes clássicos e modernos, alinhamento de barba com toalha quente e atendimento com pontualidade britânica. Escolha seu barbeiro e garanta seu horário.
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

      {/* Services Overview */}
      <section id="servicos" className="py-20 px-4 border-b border-border bg-surface/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs uppercase tracking-widest text-accent font-semibold">Tabela de Atendimento</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-2 text-text">
              Nossos Serviços <span className="italic text-accent">Exclusivos</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface border border-border p-6 rounded-md hover:border-accent/50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-serif text-xl font-bold text-text">Corte Clássico</h3>
                <span className="font-bold text-accent">R$ 60,00</span>
              </div>
              <p className="text-sm text-text-muted mb-4">
                Lavagem especial, corte na tesoura ou máquina com acabamento em navalha descartável.
              </p>
              <div className="flex items-center gap-2 text-xs text-text-muted font-medium">
                <Clock className="w-4 h-4 text-accent" />
                <span>Duração: 40 minutos</span>
              </div>
            </div>

            <div className="bg-surface border border-accent/40 p-6 rounded-md shadow-card relative">
              <div className="absolute -top-3 right-4 bg-accent text-accent-contrast text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider rounded-sm">
                Mais Popular
              </div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-serif text-xl font-bold text-text">Barba Terapia Completa</h3>
                <span className="font-bold text-accent">R$ 55,00</span>
              </div>
              <p className="text-sm text-text-muted mb-4">
                Toalha quente, óleos essenciais, massagem facial e navalhete de precisão.
              </p>
              <div className="flex items-center gap-2 text-xs text-text-muted font-medium">
                <Clock className="w-4 h-4 text-accent" />
                <span>Duração: 35 minutos</span>
              </div>
            </div>

            <div className="bg-surface border border-border p-6 rounded-md hover:border-accent/50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-serif text-xl font-bold text-text">Combo Cabelo + Barba</h3>
                <span className="font-bold text-accent">R$ 105,00</span>
              </div>
              <p className="text-sm text-text-muted mb-4">
                A experiência completa de cuidado masculino com corte personalizado e barba alinhada.
              </p>
              <div className="flex items-center gap-2 text-xs text-text-muted font-medium">
                <Clock className="w-4 h-4 text-accent" />
                <span>Duração: 70 minutos</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 px-4 border-t border-border bg-bg text-text-muted text-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Scissors className="w-4 h-4 text-accent" />
            <span className="font-serif font-bold text-text">Barbearia Premium</span>
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
