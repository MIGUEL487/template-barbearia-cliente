// Local intercepted responses only: no real Supabase reads or writes.
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
const barber='22222222-2222-2222-2222-222222222221',service='33333333-3333-3333-3333-333333333331';
const people=process.env.QA_PEOPLE==='2'?2:1,captureDir=people>1?'docs/group-booking':'docs/booking-glass';
async function assertSelectors(page){
 const boxes=await page.locator('.choice input:is([type="radio"],[type="checkbox"])').evaluateAll(inputs=>inputs.map(input=>{const box=input.getBoundingClientRect();return {width:box.width,height:box.height};}));
 assert(boxes.length>0);for(const box of boxes)assert(Math.abs(box.width-24)<.1&&Math.abs(box.height-24)<.1,JSON.stringify(box));
}
await fs.mkdir(captureDir,{recursive:true});
try{
 for(const width of [1440,390,320]){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:process.env.QA_REDUCED_MOTION==='1'?'reduce':'no-preference'});
  await page.clock.setFixedTime(new Date('2026-10-29T12:00:00Z'));
  let releaseCatalog,releaseSlots,hold=false;
  const catalogGate=new Promise(resolve=>releaseCatalog=resolve),slotsGate=new Promise(resolve=>releaseSlots=resolve);
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.route('**/qa-barber.svg',route=>route.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500"><rect width="400" height="500" fill="#eee5fa"/><circle cx="200" cy="160" r="64" fill="#7954b5"/><path d="M80 400a120 120 0 0 1 240 0" fill="#7954b5"/></svg>'}));
  await page.route('https://*.supabase.co/**',async route=>{
   const name=new URL(route.request().url()).pathname.split('/').pop();let data=[];
   if(name==='public_barbers'){await catalogGate;data=[{id:barber,name:'Carlos',bio:'Corte e barba',avatar_url:people>1?'/qa-barber.svg':null}];}
   if(name==='public_services')data=[{id:service,name:'Corte fixture',price:60,duration_minutes:30}];
   if(name==='public_site_settings')data={deposit_percentage:50};
   if(name==='get_availability'||name==='get_group_availability'){await slotsGate;const {p_date,p_service_ids}=route.request().postDataJSON();assert.deepEqual(p_service_ids,Array(people).fill(service));assert.equal(name,people>1?'get_group_availability':'get_availability');data=[{barber_id:barber,start_time:`${p_date}T09:00:00-03:00`,end_time:`${p_date}T${people>1?'10:00':'09:30'}:00-03:00`}];}
   if(name==='create_booking_hold'||name==='create_group_booking_hold'){assert.equal(name,people>1?'create_group_booking_hold':'create_booking_hold');assert.deepEqual(route.request().postDataJSON().p_service_ids,Array(people).fill(service));hold=true;data={booking_id:'fixture',cancellation_token:'fixture-token',hold_expires_at:'2026-10-29T12:15:00Z'};}
   await route.fulfill({json:data});
  });
  await page.goto('http://localhost:8787/agendar');
  await page.locator('[data-booking-skeleton="professionals"]').waitFor();
  await page.waitForFunction(()=>getComputedStyle(document.querySelector('.booking-shell > div')).opacity==='1');
  if(process.env.QA_REDUCED_MOTION==='1')assert.equal(await page.locator('.brand-loading-arc').evaluate(el=>getComputedStyle(el).animationName),'none');
  assert(await page.getByRole('button',{name:'Continuar',exact:true}).isDisabled());
  assert.equal(await page.getByText(/carregando/i).count(),0);
  assert.deepEqual(await page.locator('.brand-loading').first().evaluate(el=>({ring:el.getBoundingClientRect().width,logo:el.querySelector('img').getBoundingClientRect().width})),{ring:80,logo:48});
  await page.screenshot({path:`${captureDir}/${width}-loading.png`,fullPage:true});
  releaseCatalog();await page.getByText('Carlos',{exact:true}).click();
  if(people>1)assert.equal(new URL(await page.locator('.barber-photo img').getAttribute('src'),'http://localhost:8787').pathname,'/qa-barber.svg');
  await assertSelectors(page);
  await page.locator('fieldset').screenshot({path:`${captureDir}/${width}-professionals.png`});
  assert.match(await page.locator('.choice').first().evaluate(el=>getComputedStyle(el).backgroundImage),/linear-gradient/);
  await page.getByRole('button',{name:'Continuar',exact:true}).click();
  await page.getByRole('checkbox',{name:/Corte fixture/}).check();
  if(people>1){await page.getByRole('button',{name:'Aumentar pessoas para Corte fixture',exact:true}).click();assert.equal(await page.getByLabel('Quantidade de pessoas para Corte fixture',{exact:true}).innerText(),'2');assert.match(await page.locator('.booking-actions').innerText(),/120,00/);}
  await assertSelectors(page);
  await page.locator('fieldset').screenshot({path:`${captureDir}/${width}-services.png`});
  assert.match(await page.locator('.choice').first().evaluate(el=>getComputedStyle(el).backgroundImage),/linear-gradient/);
  await page.getByRole('button',{name:'Continuar',exact:true}).click();
  await page.locator('[data-booking-skeleton="slots"]').waitFor();
  await page.waitForFunction(()=>getComputedStyle(document.querySelector('.booking-shell > div')).opacity==='1');
  assert(await page.locator('.skeleton-day').count()>0);
  assert.deepEqual(await page.locator('.booking-skeleton-slots .brand-loading').evaluate(el=>({ring:el.getBoundingClientRect().width,logo:el.querySelector('img').getBoundingClientRect().width})),{ring:32,logo:16});
  await page.screenshot({path:`${captureDir}/${width}-calendar-loading.png`,fullPage:true});
  releaseSlots();await page.getByRole('button',{name:'29/10/2026',exact:true}).waitFor();
  await page.getByRole('button',{name:'09:00',exact:true}).click();
  const controls=await page.locator('.booking-shell button').evaluateAll(elements=>elements.map(el=>({label:el.getAttribute('aria-label')||el.textContent,glass:getComputedStyle(el).backgroundImage!=='none'})));
  assert(controls.every(control=>control.glass),JSON.stringify(controls.filter(control=>!control.glass)));
  const primary=await page.getByRole('button',{name:'Continuar',exact:true}).evaluate(el=>({color:getComputedStyle(el).color,fill:getComputedStyle(el).backgroundImage}));
  assert.equal(primary.color,'rgb(255, 255, 255)');assert.match(primary.fill,/120, 72, 184/);
  assert.equal(await page.locator('[data-booking-skeleton]').count(),0);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  const fonts=await page.locator('h1').evaluate(async el=>{await document.fonts.ready;const family=getComputedStyle(el).getPropertyValue('--font-booking-display').trim();return {family,used:getComputedStyle(el).fontFamily,loaded:document.fonts.check('500 48px '+family.split(',')[0])};});
  assert(fonts.family.includes('bookingCormorant')&&fonts.used.includes('bookingCormorant')&&fonts.loaded,JSON.stringify(fonts));
  const glass=await page.locator('.booking-actions').evaluate(el=>getComputedStyle(el).backdropFilter);
  assert.match(glass,/blur/);
  await page.screenshot({path:`${captureDir}/${width}-calendar.png`,fullPage:true});
  await page.getByRole('button',{name:'Continuar',exact:true}).focus();
  await page.keyboard.press('Shift+Tab');await page.keyboard.press('Tab');
  assert.equal(await page.getByRole('button',{name:'Continuar',exact:true}).evaluate(el=>getComputedStyle(el).outlineStyle),'solid');
  await page.getByRole('button',{name:'Continuar',exact:true}).click();
  await page.getByPlaceholder('Seu nome').fill('Fixture');await page.getByPlaceholder('(11) 99999-9999').fill('11999999999');await page.locator('input[type=checkbox]').first().check();
  await assertSelectors(page);
  await page.locator('#booking-confirmation').screenshot({path:`${captureDir}/${width}-confirmation.png`});
  await page.getByRole('button',{name:'Confirmar reserva',exact:true}).click();
  await page.getByText('Pré-reserva criada',{exact:true}).waitFor();assert(hold);assert.deepEqual(errors,[]);
  if(people>1){await page.goto('http://localhost:8787/?motion=off#equipe');const photo=page.locator('#equipe').getByRole('img',{name:'Foto de Carlos',exact:true});await photo.waitFor();assert.equal(new URL(await photo.getAttribute('src'),'http://localhost:8787').pathname,'/qa-barber.svg');await page.waitForFunction(()=>document.querySelector('#equipe img')?.naturalWidth>0);await page.locator('#equipe').screenshot({path:`${captureDir}/${width}-team.png`});}
  console.log({width,skeletons:true,glass:true,localFonts:true,hold:true,people});await page.close();
 }
 const errorPage=await browser.newPage();
 await errorPage.route('https://*.supabase.co/**',route=>route.fulfill({status:500,json:{code:'FIXTURE_ERROR',message:'Catalog unavailable',details:'QA only',hint:'Retry'}}));
 await errorPage.goto('http://localhost:8787/agendar');
 await errorPage.getByRole('alert').waitFor();
 await errorPage.waitForFunction(()=>!document.querySelector('[data-booking-skeleton]'));
 assert(await errorPage.getByRole('button',{name:'Continuar',exact:true}).isDisabled());
 await errorPage.emulateMedia({contrast:'more'});
 assert.equal(await errorPage.locator('.booking-actions').evaluate(el=>getComputedStyle(el).backdropFilter),'none');
 await errorPage.emulateMedia({forcedColors:'active'});
 assert.equal(await errorPage.locator('.booking-actions').evaluate(el=>getComputedStyle(el).backdropFilter),'none');
 console.log({failedRequestExitsLoading:true,contrastFallback:true,forcedColors:true});await errorPage.close();
}finally{await browser.close();}
