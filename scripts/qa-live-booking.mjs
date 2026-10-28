// Build de teste: DEMO_MODE=false, WATERMARK=true e chave pública fictícia.
// Todas as requisições Supabase são interceptadas; não escreve no banco real.
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const shop='11111111-1111-1111-1111-111111111111', barber='22222222-2222-2222-2222-222222222221', service='33333333-3333-3333-3333-333333333331';
const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
try {
for(const [width,height,timeZone] of [[1440,900,'Asia/Tokyo'],[390,844,'America/Los_Angeles']]){
 const p=await b.newPage({viewport:{width,height},timezoneId:timeZone});let last,hold;const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.route('https://*.supabase.co/**',async route=>{
  const req=route.request(),url=new URL(req.url()),name=url.pathname.split('/').pop();let data=[];
  if(name==='public_barbers')data=[{id:barber,name:'Carlos',bio:null,avatar_url:null}];
  if(name==='public_services')data=[{id:service,name:'Corte real fixture',description:'Fixture',price:60,duration_minutes:40}];
  if(name==='public_site_settings')data={deposit_percentage:50};
  if(name==='get_availability'){last=req.postDataJSON();if(last.p_date==='2026-11-03'){await route.fulfill({status:400,json:{code:'PGRST202',message:'RPC fixture indisponível',details:'fixture details',hint:'fixture hint'}});return;}data=last.p_date==='2026-11-01'?[]:[{barber_id:barber,start_time:`${last.p_date}T09:00:00-03:00`,end_time:`${last.p_date}T09:45:00-03:00`}];}
  if(name==='create_booking_hold'){hold=req.postDataJSON();data={booking_id:'local-booking',cancellation_token:'local-token',hold_expires_at:new Date(Date.now()+900000).toISOString()};}
  await route.fulfill({json:data});
 });
 await p.goto('http://localhost:8787/agendar?debug=1');
 await p.getByText('Carlos',{exact:true}).click();
 await p.getByRole('region',{name:'Serviços'}).getByRole('button',{name:/Corte real fixture/}).click();
 await p.getByRole('button',{name:'Continuar',exact:true}).click();
 const date=p.locator('input[type=date]');await date.fill('2026-11-01');
 await p.getByRole('status').filter({hasText:'Não há horários disponíveis nesta data.'}).waitFor();
 assert.equal(last.p_date,'2026-11-01');
 await date.fill('2026-11-03');await p.getByText('Não foi possível consultar horários. Tente novamente ou fale com a barbearia.').waitFor();
 assert.match(await p.getByRole('complementary',{name:'Diagnóstico de agendamento'}).innerText(),/PGRST202/);
 await date.fill('2026-11-02');await p.getByRole('button',{name:/09:00 · Carlos/}).click();
 assert.deepEqual(last,{p_barbershop_id:shop,p_barber_id:barber,p_date:'2026-11-02',p_service_ids:[service]});
 await p.getByRole('button',{name:'Confirmar',exact:true}).click();
 await p.getByPlaceholder('Seu nome').fill('Fixture');await p.getByPlaceholder('(11) 99999-9999').fill('11999999999');await p.locator('input[type=checkbox]').first().check();
 await p.locator('button').filter({hasText:/Confirmar|Reservar|Finalizar/}).last().click();
 await p.getByText('Pré-reserva criada').waitFor();assert.equal(hold.p_barbershop_id,shop);assert.equal(hold.p_starts_at,'2026-11-02T09:00:00-03:00');
 assert.equal(errors.length,0,errors.join('\n'));assert.match(await p.getByRole('complementary',{name:'Diagnóstico de agendamento'}).innerText(),/Simulação: não/);
 console.log({width,timeZone,realFlowWithWatermark:true,parameters:last,hold:true});await p.close();
}
} finally {await b.close()}
