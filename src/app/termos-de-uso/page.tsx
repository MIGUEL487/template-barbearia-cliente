import Link from "next/link";
import { ChevronLeft, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso e Agendamento — Barbearia Auto Stilo",
  description:
    "Condições de uso, regras de agendamento, prazos de cancelamento e tolerância da Barbearia Auto Stilo em Monte Sião - MG.",
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
            <span>Auto Stilo · Termos</span>
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
            Última atualização: Novembro de 2026 · Versão 2026.11
          </p>
        </div>

        <section className="space-y-4 text-sm leading-relaxed text-text/90">
          <h2 className="font-serif text-xl font-bold text-text border-b border-hairline pb-2">
            1. Finalidade e Abrangência
          </h2>
          <p>
            Estes Termos de Uso regem a utilização da plataforma online de agendamentos da <strong>Barbearia Auto Stilo</strong>, localizada na <em>Rua do Tanque, 395 – Bela Vista, Monte Sião - MG</em>. Ao concluir um agendamento, você concorda com as condições descritas neste documento.
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
              Ao selecionar uma data e horário disponíveis, o sistema bloqueia temporariamente a vaga por <strong className="text-text">15 minutos</strong> (status <em>hold</em>) para que você preencha seus dados de identificação com calma.
            </li>
            <li>
              Caso o agendamento não seja confirmado dentro deste intervalo, a vaga é automaticamente liberada de volta para o público.
            </li>
          </ul>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-text/90">
          <h2 className="font-serif text-xl font-bold text-text border-b border-hairline pb-2">
            3. Cancelamento e Remanejamento de Horários
          </h2>
          <div className="bg-surface p-5 rounded-2xl border border-hairline space-y-3">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <strong className="block text-text font-serif text-base">
                  Prazo Recomendado: Mínimo de 2 horas de antecedência
                </strong>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  Para que possamos remanejar nossa equipe e disponibilizar o horário a outros clientes, solicitamos que cancelamentos ou alterações sejam realizados com pelo menos 2 horas de antecedência.
                </p>
              </div>
            </div>
            <p className="text-xs text-text-muted pt-2 border-t border-hairline">
              Você pode gerenciar ou cancelar seu agendamento a qualquer momento pela página{" "}
              <Link href="/meu-agendamento" className="text-accent underline hover:text-accent-hover">
                Consultar Meu Agendamento
              </Link>{" "}
              inserindo seu código de reserva, ou entrando em contato pelo WhatsApp (35) 99737-4960.
            </p>
          </div>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-text/90">
          <h2 className="font-serif text-xl font-bold text-text border-b border-hairline pb-2">
            4. Pontualidade e Tolerância de Chegada
          </h2>
          <p>
            Trabalhamos com pontualidade rigorosa para respeitar o tempo de cada cliente atendido.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-text-muted">
            <li>
              <strong className="text-text">Tolerância de Atraso:</strong> Estabelecemos uma tolerância máxima de 10 minutos após o horário agendado.
            </li>
            <li>
              Atrasos superiores a 10 minutos poderão demandar ajuste no escopo do serviço ou reagendamento para um novo horário, evitando atrasos em cascata para os clientes subsequentes.
            </li>
          </ul>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-text/90">
          <h2 className="font-serif text-xl font-bold text-text border-b border-hairline pb-2">
            5. Veracidade dos Dados Informados
          </h2>
          <p>
            O cliente compromete-se a fornecer informações verdadeiras e atualizadas (nome e número de WhatsApp válido). A Auto Stilo não se responsabiliza pelo não recebimento de lembretes em decorrência de números de telefone incorretos.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-text/90">
          <h2 className="font-serif text-xl font-bold text-text border-b border-hairline pb-2">
            6. Foro e Disposições Finais
          </h2>
          <p>
            Estes Termos são regidos pelas leis da República Federativa do Brasil. Para dirimir quaisquer controvérsias decorrentes destes Termos, elege-se o foro da Comarca de Monte Sião, Estado de Minas Gerais.
          </p>
        </section>

        <div className="pt-8 border-t border-hairline flex flex-wrap gap-4 items-center justify-between text-xs text-text-muted">
          <span>Barbearia Auto Stilo · Monte Sião - MG</span>
          <Link href="/politica-de-privacidade" className="text-accent underline hover:text-accent-hover">
            Ver Política de Privacidade (LGPD) ↗
          </Link>
        </div>
      </main>
    </div>
  );
}
