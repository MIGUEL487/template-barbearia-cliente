import Link from "next/link";
import { ChevronLeft, FileText, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import { shop } from "@/config/demo";

export const metadata: Metadata = {
  title: "Termos de Uso e Agendamento — Barbearia Modelo",
  description:
    "Condições de uso, regras de agendamento, prazos de cancelamento e tolerância da Barbearia Modelo.",
};

export default function TermosUsoPage() {
  return (
    <div className="min-h-screen bg-bg text-text selection:bg-accent selection:text-accent-contrast">
      <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur-xl border-b border-hairline">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-text-muted hover:text-text text-xs font-medium transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Voltar ao início</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-serif font-bold text-text">
            <FileText className="w-4 h-4 text-accent" />
            <span>{shop.name} · Termos (Demo)</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 space-y-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Regras do Serviço de Agendamento Online</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
            Termos de Uso e Agendamento
          </h1>
          <p className="text-sm text-text-muted leading-relaxed">
            Última atualização: Novembro de 2026 · Modelo Demonstrativo
          </p>
        </div>

        <section className="space-y-4 text-sm leading-relaxed text-text/90">
          <h2 className="font-serif text-xl font-bold text-text border-b border-hairline pb-2">
            1. Finalidade e Abrangência
          </h2>
          <p>
            Estes Termos de Uso regem a utilização da plataforma online de agendamentos da <strong>{shop.name}</strong>, endereço de demonstração: <em>{shop.address}</em>. Ao concluir um agendamento, você concorda com as condições descritas neste documento.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-text/90">
          <h2 className="font-serif text-xl font-bold text-text border-b border-hairline pb-2">
            2. Como Funciona a Reserva (Hold Temporário)
          </h2>
          <p>
            Para garantir que dois clientes não selecionem o mesmo horário simultaneamente:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-text-muted">
            <li>
              Ao escolher uma data e hora, o sistema cria uma reserva temporária (hold de 10 minutos) que bloqueia aquele horário para outros usuários enquanto você preenche seus dados.
            </li>
            <li>
              Caso o agendamento não seja concluído dentro do prazo do hold, o horário é automaticamente liberado para a agenda geral.
            </li>
          </ul>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-text/90">
          <h2 className="font-serif text-xl font-bold text-text border-b border-hairline pb-2">
            3. Responsabilidades do Cliente
          </h2>
          <p>
            O cliente compromete-se a fornecer informações verdadeiras e atualizadas (nome e número de WhatsApp válido). A {shop.name} não se responsabiliza pelo não recebimento de lembretes em decorrência de números de telefone incorretos.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-text/90">
          <h2 className="font-serif text-xl font-bold text-text border-b border-hairline pb-2">
            4. Política de Tolerância e Cancelamento
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-text-muted">
            <li>
              <strong className="text-text">Tolerância de atraso:</strong> Há uma tolerância máxima de 10 minutos após o início do horário reservado. Após esse período, o profissional poderá atender outro cliente para não comprometer os agendamentos seguintes.
            </li>
            <li>
              <strong className="text-text">Cancelamento ou Reagendamento:</strong> Pedimos a gentileza de cancelar ou reagendar com no mínimo 2 horas de antecedência através do link de consulta recebido ou diretamente via WhatsApp oficial.
            </li>
          </ul>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-text/90">
          <h2 className="font-serif text-xl font-bold text-text border-b border-hairline pb-2">
            5. Disposições Finais
          </h2>
          <p>
            Este template tem finalidade demonstrativa. Dúvidas ou solicitações podem ser encaminhadas ao canal oficial de atendimento via WhatsApp no número <strong>{shop.phone}</strong>.
          </p>
        </section>

        <div className="pt-8 border-t border-hairline flex flex-wrap gap-4 items-center justify-between text-xs text-text-muted">
          <span>{shop.name} · Template Demonstrativo</span>
          <Link href="/politica-de-privacidade" className="text-accent underline hover:text-accent-hover">
            Ver Política de Privacidade ↗
          </Link>
        </div>
      </main>
    </div>
  );
}
