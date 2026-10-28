// Dados de apresentação. Serviços, equipe e horários NÃO representam oferta real.
export const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE?.trim().toLowerCase() === 'true' || !(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
export const shop = {
 name: "Auto Stilo", city: "Monte Sião · MG", address: "R. do Tanque, 395 – Bela Vista, Monte Sião – MG, 37580-000",
 whatsapp: "https://wa.me/5535997374960", phone: "(35) 99737-4960", rating: "5,0", reviews: 53,
 hours: "TODO confirmar com o dono · informação disponível: terça a partir das 09h", instagram: null,
};
export const demoServices = [
 {id:"33333333-3333-4333-8333-333333333331", name:"Corte de assinatura", description:"Acabamento preciso, do clássico ao degradê.", duration_minutes:40, price:45},
 {id:"33333333-3333-4333-8333-333333333332", name:"Ritual da barba", description:"Desenho, alinhamento e cuidado.", duration_minutes:30, price:35},
 {id:"33333333-3333-4333-8333-333333333333", name:"Corte + barba", description:"Um tempo só seu. A experiência completa.", duration_minutes:70, price:75},
 {id:"33333333-3333-4333-8333-333333333334", name:"Sobrancelha", description:"Precisão nos detalhes.", duration_minutes:10, price:15},
];
export const demoBarbers = [
 {id:"22222222-2222-4222-8222-222222222221",name:"Profissional 01",bio:"Cortes e acabamentos · exemplo",avatar_url:null},
 {id:"22222222-2222-4222-8222-222222222222",name:"Profissional 02",bio:"Barba e estilo · exemplo",avatar_url:null},
];
export const demoFaq = [
 {id:"1",question:"Este agendamento é real?",answer:"No modo demonstração, nada é reservado ou cobrado. Para um horário real, fale com a barbearia pelo WhatsApp."},
 {id:"2",question:"Os preços e profissionais são reais?",answer:"Não. São exemplos de apresentação e precisam ser confirmados com o proprietário."},
 {id:"3",question:"Como chegar?",answer:shop.address},
];
export const reviews = ["Top trabalho irmão sem dúvidas o melhor de Monte Sião 😎", "Barbearia estrutura e elegante, produtos de qualidade, e excelente atendimento.", "Excelente profissional, ambiente muito confortável.", "Ótimo atendimento, lugar muito top, o profissional com um trabalho muito bom, recomendo demais", "Atendimento impecável, tanto corte quanto barba"];
