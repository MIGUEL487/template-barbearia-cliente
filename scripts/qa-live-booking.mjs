// Build de teste: DEMO_MODE=false, WATERMARK=true e chave pública fictícia.
// Todas as requisições Supabase são interceptadas; não escreve no banco real.
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const shop='11111111-1111-1111-1111-111111111111', barber='22222222-2222-2222-2222-222222222221', service='33333333-3333-3333-3333-333333333331';
const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
try {
for(const [width,height,timeZone] of [[1440,900,'Asia/Tokyo'],[390,844,'America/Los_Angeles']]){
 const p=await b.newPage({viewport:{width,height},timezoneId:timeZone,reducedMotion:process.env.QA_REDUCED_MOTION==='1'?'reduce':'no-preference'});await p.clock.setFixedTime(new Date('2026-10-29T12:00:00Z'));let last,hold,closed=false,failDay=true;const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.route('https://*.supabase.co/**',async route=>{
  const req=route.request(),url=new URL(req.url()),name=url.pathname.split('/').pop();let data=[];
  if(name==='public_barbers')data=[{id:barber,name:'Carlos',bio:null,avatar_url:null}];
  if(name==='public_services')data=[{id:service,name:'Corte real fixture',description:'Fixture',price:60,duration_minutes:40}];
  if(name==='public_site_settings')data={deposit_percentage:50};
  if(name==='get_availability'){last=req.postDataJSON();if(failDay&&last.p_date==='2026-11-03'){await route.fulfill({status:400,json:{code:'PGRST202',message:'RPC fixture indisponível',details:'fixture details',hint:'fixture hint'}});return;}data=['2026-11-01','2026-11-04'].includes(last.p_date)||(closed&&last.p_date==='2026-11-02')?[]:[{barber_id:barber,start_time:`${last.p_date}T09:00:00-03:00`,end_time:`${last.p_date}T09:45:00-03:00`}];}
  if(name==='create_booking_hold'){hold=req.postDataJSON();data={booking_id:'local-booking',cancellation_token:'local-token',hold_expires_at:new Date(Date.now()+900000).toISOString()};}
  await route.fulfill({json:data});
 });
 await p.goto('http://localhost:8787/agendar?debug=1');
 await p.getByText('Carlos',{exact:true}).click();
 await p.getByRole('button',{name:'Continuar',exact:true}).click();
 await p.getByRole('group',{name:'Serviços'}).getByRole('checkbox',{name:/Corte real fixture/}).check();
 await p.getByRole('button',{name:'Continuar',exact:true}).click();
 await p.getByRole('button',{name:'Próximo mês'}).click();
 await p.getByRole('button',{name:'02/11/2026',exact:true}).waitFor();
 assert(await p.getByRole('button',{name:'01/11/2026 · indisponível',exact:true}).isDisabled());
 assert(await p.getByRole('button',{name:'03/11/2026 · indisponível',exact:true}).isDisabled());
 assert(await p.getByRole('button',{name:'04/11/2026 · indisponível',exact:true}).isDisabled());
 await p.getByRole('button',{name:'02/11/2026',exact:true}).click();await p.getByRole('button',{name:'09:00',exact:true}).click();
 assert.deepEqual(last,{p_barbershop_id:shop,p_barber_id:barber,p_date:'2026-11-02',p_service_ids:[service]});
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 closed=true;await p.getByRole('button',{name:'02/11/2026',exact:true}).click();
 await p.getByRole('button',{name:'02/11/2026 · indisponível',exact:true}).waitFor();
 assert(await p.getByRole('button',{name:'Continuar',exact:true}).isDisabled());assert.equal(await p.getByRole('button',{name:'09:00',exact:true}).count(),0);
 closed=false;failDay=false;await p.getByRole('button',{name:'Atualizar calendário'}).click();await p.getByRole('button',{name:'02/11/2026',exact:true}).click();await p.getByRole('button',{name:'09:00',exact:true}).click();
 await fs.mkdir('docs/booking-calendar',{recursive:true});await p.locator('.booking-calendar').screenshot({path:`docs/booking-calendar/${width}-calendar.jpg`});
 await p.getByRole('button',{name:'Continuar',exact:true}).click();
 await p.getByPlaceholder('Seu nome').fill('Fixture');await p.getByPlaceholder('(11) 99999-9999').fill('11999999999');await p.locator('input[type=checkbox]').first().check();
 await p.locator('button').filter({hasText:/Confirmar|Reservar|Finalizar/}).last().click();
 await p.getByText('Pré-reserva criada').waitFor();assert.equal(hold.p_barbershop_id,shop);assert.equal(hold.p_starts_at,'2026-11-02T09:00:00-03:00');
 assert.equal(errors.length,0,errors.join('\n'));assert.match(await p.getByRole('complementary',{name:'Diagnóstico de agendamento'}).innerText(),/Simulação: não/);
 if(process.env.QA_REDUCED_MOTION==='1')assert(await p.evaluate(()=>document.documentElement.classList.contains('motion-off')));
 console.log({width,timeZone,realFlowWithWatermark:true,parameters:last,hold:true});await p.close();
}
} finally {await b.close()}
