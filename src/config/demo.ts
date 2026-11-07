// Dados de apresentação. Serviços, equipe e horários NÃO representam oferta real.
import { envFlag } from '@/lib/env-flag';
export const demoMode = envFlag(process.env.NEXT_PUBLIC_DEMO_MODE);

export const shop = {
  name: "Barbearia Modelo",
  city: "Atendimento Exclusivo",
  address: "Av. Principal, 1000 – Centro · Demonstração",
  whatsapp: "https://wa.me/5511999999999",
  phone: "(11) 99999-9999",
  rating: "5,0",
  reviews: 48,
  hours: "Terça a Sábado: 09h às 19h · Hora marcada",
  instagram: null,
};

export const demoServices = [
  { id: "33333333-3333-4333-8333-333333333331", name: "Corte de assinatura", description: "Acabamento preciso, do clássico ao degradê.", duration_minutes: 40, price: 45 },
  { id: "33333333-3333-4333-8333-333333333332", name: "Ritual da barba", description: "Desenho, alinhamento e toalha quente.", duration_minutes: 30, price: 35 },
  { id: "33333333-3333-4333-8333-333333333333", name: "Corte + barba", description: "Um tempo só seu. A experiência completa.", duration_minutes: 70, price: 75 },
  { id: "33333333-3333-4333-8333-333333333334", name: "Sobrancelha", description: "Precisão nos detalhes.", duration_minutes: 10, price: 15 },
];

export const demoBarbers = [
  { id: "22222222-2222-4222-8222-222222222221", name: "Barbeiro Master", bio: "Especialista em cortes clássicos e visagismo masculino.", avatar_url: null },
  { id: "22222222-2222-4222-8222-222222222222", name: "Barbeiro Especialista", bio: "Barba terapia, toalha quente e acabamento milimétrico.", avatar_url: null },
];

export const demoFaq = [
  { id: "1", question: "Este agendamento é real?", answer: "No modo demonstração, nenhum horário é reservado ou cobrado. Este template serve de apresentação e validação do fluxo." },
  { id: "2", question: "Os preços e profissionais são reais?", answer: "Não. São exemplos demonstrativos que podem ser facilmente customizados pelo proprietário no painel de gestão." },
  { id: "3", question: "Como chegar?", answer: shop.address },
];

export const reviews = [
  "Excelente trabalho, pontualidade britânica e profissionais muito qualificados.",
  "Estrutura impecável e elegante, produtos de qualidade e atendimento nota 10.",
  "Excelente profissional, ambiente muito confortável e climatizado.",
  "Ótimo atendimento, lugar aconchegante e acabamento impecável, recomendo a todos.",
  "Atendimento de primeira, tanto para corte quanto para barba com toalha quente.",
];
