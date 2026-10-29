// Fixtures locais: nenhuma consulta ou gravação no Supabase real.
import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const stage=process.env.SCREENSHOT_STAGE || 'after',folder=`docs/booking-visual/${stage}`;
await fs.mkdir(folder,{recursive:true});
const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
try {for(const [width,height] of [[1440,900],[390,844]]){
 const p=await b.newPage({viewport:{width,height}});
 await p.route('https://*.supabase.co/**',async route=>{
  const name=new URL(route.request().url()).pathname.split('/').pop();
  const data=name==='public_barbers'?[{id:'22222222-2222-2222-2222-222222222221',name:'Carlos',bio:'Corte e barba',avatar_url:null}]:name==='public_services'?[{id:'33333333-3333-3333-3333-333333333331',name:'Corte clássico',description:'Corte e acabamento.',duration_minutes:40,price:60}]:name==='public_site_settings'?{deposit_percentage:50}:name==='get_availability'?['09','10','14'].map(h=>({barber_id:'22222222-2222-2222-2222-222222222221',start_time:`2026-11-02T${h}:00:00-03:00`,end_time:`2026-11-02T${h}:45:00-03:00`})):{id:'fixture',status:'hold',starts_at:'2026-11-02T09:00:00-03:00',ends_at:'2026-11-02T09:45:00-03:00',barber_name:'Carlos',customer_name:'Cliente de teste',services:['Corte clássico'],total_price:60,deposit_amount:30,can_cancel:false,can_reschedule:false};
  await route.fulfill({json:data});
 });
 await p.goto('http://localhost:8787/agendar');await p.getByText('Carlos',{exact:true}).waitFor();await p.waitForTimeout(600);
 await p.screenshot({path:`${folder}/${width}-agendar-profissional.jpg`,fullPage:true});
 await p.getByText('Carlos',{exact:true}).click();await p.getByRole('button',{name:'Continuar',exact:true}).click();await p.waitForTimeout(600);await p.screenshot({path:`${folder}/${width}-agendar-servicos.jpg`,fullPage:true});
 await p.getByRole('button',{name:'Continuar',exact:true}).click();await p.waitForTimeout(600);await p.screenshot({path:`${folder}/${width}-agendar-horarios.jpg`,fullPage:true});
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await p.goto('http://localhost:8787/meu-agendamento?token=fixture');await p.getByText('Cliente de teste',{exact:true}).waitFor();await p.waitForTimeout(600);await p.screenshot({path:`${folder}/${width}-meu-agendamento.jpg`,fullPage:true});
 console.log({stage,width,noOverflow:true});await p.close();
}} finally {await b.close()}
