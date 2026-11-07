import Link from "next/link";
import { ChevronLeft, ShieldCheck, Lock, FileText } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade (LGPD) — Barbearia Auto Stilo",
  description:
    "Transparência, proteção de dados e conformidade com a LGPD na Barbearia Auto Stilo em Monte Sião - MG.",
};

export default function PoliticaPrivacidadePage() {
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
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span>Auto Stilo · LGPD</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 space-y-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>Conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018)</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
            Política de Privacidade
          </h1>
          <p className="text-sm text-text-muted leading-relaxed">
            Última atualização: Novembro de 2026 · Versão 2026.11
          </p>
        </div>

        <section className="space-y-4 text-sm leading-relaxed text-text/90">
          <h2 className="font-serif text-xl font-bold text-text border-b border-hairline pb-2">
            1. Identificação do Controlador
          </h2>
          <p>
            O tratamento dos seus dados pessoais é realizado pela <strong>Barbearia Auto Stilo</strong>,
            estabelecida em Monte Sião - MG, endereço: <em>Rua do Tanque, 395 – Bela Vista, CEP 37580-000</em>.
          </p>
          <p>
            Canal de atendimento e privacidade (Encarregado / DPO): WhatsApp oficial{" "}
            <a
              href="https://wa.me/5535997374960"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline hover:text-accent-hover"
            >
              (35) 99737-4960
            </a>.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-text/90">
          <h2 className="font-serif text-xl font-bold text-text border-b border-hairline pb-2">
            2. Quais Dados Coletamos e Para Quê
          </h2>
          <p>
            Coletamos apenas os dados estritamente necessários para a prestação dos serviços de barbearia e a gestão segura dos agendamentos:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-text-muted">
            <li>
              <strong className="text-text">Dados de Identificação e Contato:</strong> Nome completo e número de WhatsApp/Telefone, além de e-mail opcional. Finalidade: identificar você, confirmar sua reserva e enviar lembretes sobre seu horário.
            </li>
            <li>
              <strong className="text-text">Dados do Agendamento:</strong> Serviço solicitado, profissional de preferência, data e horário escolhidos, observações e histórico de atendimentos. Finalidade: execução do serviço contratado e controle operacional.
            </li>
            <li>
              <strong className="text-text">Dados Técnicos e de Segurança:</strong> Endereço IP anonimizado, carimbo de data/hora da reserva, versão dos termos aceitos e token único de consulta. Finalidade: prevenção a fraudes e garantia da integridade do sistema.
            </li>
          </ul>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-text/90">
          <h2 className="font-serif text-xl font-bold text-text border-b border-hairline pb-2">
            3. Bases Legais para o Tratamento (LGPD Art. 7º)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-surface p-5 rounded-2xl border border-hairline space-y-2">
              <strong className="block text-accent font-serif text-base">
                Execução de Contrato (Art. 7º, V)
              </strong>
              <p className="text-xs text-text-muted leading-relaxed">
                Utilizado para processar, validar e efetivar sua reserva de corte, barba ou pacote de atendimento na Auto Stilo.
              </p>
            </div>
            <div className="bg-surface p-5 rounded-2xl border border-hairline space-y-2">
              <strong className="block text-accent font-serif text-base">
                Legítimo Interesse (Art. 7º, IX)
              </strong>
              <p className="text-xs text-text-muted leading-relaxed">
                Utilizado para segurança da plataforma, controle de disponibilidade da barbearia e prevenção contra no-show abusivo.
              </p>
            </div>
            <div className="bg-surface p-5 rounded-2xl border border-hairline space-y-2 sm:col-span-2">
              <strong className="block text-accent font-serif text-base">
                Consentimento Específico (Art. 7º, I)
              </strong>
              <p className="text-xs text-text-muted leading-relaxed">
                Apenas caso você marque a opção correspondente no agendamento, enviaremos novidades e ofertas exclusivas via WhatsApp. O consentimento pode ser revogado a qualquer momento mediante simples mensagem.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-text/90">
          <h2 className="font-serif text-xl font-bold text-text border-b border-hairline pb-2">
            4. Compartilhamento e Subprocessadores Seguros
          </h2>
          <p>
            A Auto Stilo <strong>não vende, não aluga e não comercializa</strong> seus dados pessoais com terceiros.
            O compartilhamento de dados ocorre exclusivamente com provedores de infraestrutura essenciais:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-text-muted">
            <li>
              <strong className="text-text">Supabase Inc.:</strong> Provedor de banco de dados e autenticação segura com isolamento de tenant, criptografia TLS 1.3 em trânsito e AES-256 em repouso.
            </li>
            <li>
              <strong className="text-text">Cloudflare, Inc. / Vercel Inc.:</strong> Distribuição global, mitigação de DDoS e segurança perimetral.
            </li>
          </ul>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-text/90">
          <h2 className="font-serif text-xl font-bold text-text border-b border-hairline pb-2">
            5. Seus Direitos como Titular de Dados (LGPD Art. 18)
          </h2>
          <p>
            Você possui direitos garantidos por lei sobre seus dados pessoais, incluindo:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-text-muted">
            <li>Confirmação da existência de tratamento dos dados;</li>
            <li>Acesso aos seus dados cadastrais e agendamentos realizados;</li>
            <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
            <li>Anonimização, bloqueio ou eliminação de dados tratados em desconformidade;</li>
            <li>Revogação do consentimento para mensagens de marketing a qualquer momento.</li>
          </ul>
          <p className="pt-2">
            Para exercer qualquer um dos seus direitos, basta entrar em contato conosco pelo WhatsApp{" "}
            <strong>(35) 99737-4960</strong>. Responderemos sua solicitação prontamente.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-text/90">
          <h2 className="font-serif text-xl font-bold text-text border-b border-hairline pb-2">
            6. Retenção e Segurança dos Dados
          </h2>
          <p>
            Seus dados são armazenados apenas pelo período estritamente necessário para cumprir com as finalidades de atendimento e obrigações fiscais/legais vigentes. Adotamos padrões técnicos avançados de segurança, controle restrito de acesso e criptografia.
          </p>
        </section>

        <div className="pt-8 border-t border-hairline flex flex-wrap gap-4 items-center justify-between text-xs text-text-muted">
          <span>Auto Stilo · Barbearia Monte Sião - MG</span>
          <Link href="/termos-de-uso" className="text-accent underline hover:text-accent-hover">
            Ver Termos de Uso ↗
          </Link>
        </div>
      </main>
    </div>
  );
}
