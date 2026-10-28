import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:8787';
const root = 'docs/bugs-visuais/depois';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
const results = [];
async function wheelTo(page, selector, offset = 120) {
  for (let i=0;i<180;i++) {
    const delta = await page.locator(selector).first().evaluate((el,y)=>el.getBoundingClientRect().top-y, offset);
    if (Math.abs(delta)<6) break;
    await page.mouse.wheel(0,Math.max(-360,Math.min(360,delta)));
    await page.waitForTimeout(70);
  }
  await page.waitForTimeout(750);
}
const group = locator => locator.evaluate(el => {
  const buttons = [...el.querySelectorAll('button,a.cta,a.text-link')].filter(e=>e.getBoundingClientRect().width>0);
  const rects=buttons.map(b=>b.getBoundingClientRect());
  return { gap:rects.length<2?null:Math.min(...rects.slice(1).map((b,i)=>b.top>=rects[i].bottom-1?b.top-rects[i].bottom:b.left-rects[i].right)), heights:rects.map(b=>b.height), labels:buttons.map(b=>b.textContent), direction:getComputedStyle(el).flexDirection };
});
try {
 for(const [width,height] of [[1440,900],[1366,768],[390,844]]) {
  const context=await browser.newContext({viewport:{width,height},isMobile:width<768,hasTouch:width<768});
  const page=await context.newPage(), errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('console',e=>{if(e.type()==='error')errors.push(e.text())});
  await page.goto(`${base}/#galeria`);await page.waitForLoadState('networkidle');
  await wheelTo(page,'.films-grid',110);
  const first=page.locator('.shop-film').first(),video=first.locator('video');
  await page.waitForFunction(()=>[...document.querySelectorAll('.shop-film video')].every(v=>!v.paused && v.currentTime>0));
  await first.locator('.film-toggle').click();await page.waitForTimeout(600);assert(await video.evaluate(v=>v.paused));
  const manualPause=true;
  await first.locator('.film-toggle').click();await page.waitForFunction(()=>!document.querySelector('.shop-film video').paused);
  await first.locator('.film-sound').click();assert.equal(await video.evaluate(v=>v.muted),false);
  await first.locator('.film-sound').click();assert.equal(await video.evaluate(v=>v.muted),true);
  await wheelTo(page,'.reviews-section',110);assert(await video.evaluate(v=>v.paused));
  await wheelTo(page,'.films-grid',110);await page.waitForFunction(()=>!document.querySelector('.shop-film video').paused);
  const viewportPauseResume=true;
  await page.screenshot({path:`${root}/${width}-4-video-interacao.jpg`,type:'jpeg',quality:84});
  await page.goto(`${base}/#servicos`);await page.waitForLoadState('networkidle');
  await wheelTo(page,'.filters',130);
  const filters=await group(page.locator('.filters'));assert(filters.gap>=16);
  await page.locator('.service-row').first().click();
  await page.waitForTimeout(900);
  const actions=await group(page.locator('.service-actions'));assert(actions.gap>=16&&actions.heights.every(h=>h>=44));
  const serviceBox=await page.locator('.service-row').first().boundingBox();
  if(width>767){await page.mouse.move(serviceBox.x+20,serviceBox.y+20);await page.mouse.move(serviceBox.x+serviceBox.width-20,serviceBox.y+30)}
  assert.equal(await page.locator('.service-preview,.cursor-halo').count(),0);
  await page.goto(`${base}/agendar/`);await page.waitForLoadState('networkidle');
  const booking=[];
  await page.getByRole('button',{name:'Continuar',exact:true}).click();
  await page.getByRole('heading',{name:'Serviço',exact:true}).waitFor();await page.waitForTimeout(800);
  booking.push(await group(page.locator('.booking-action-buttons')));
  await page.screenshot({path:`${root}/${width}-6-agendar.jpg`,type:'jpeg',quality:84});
  await page.getByRole('button',{name:'Continuar',exact:true}).click();
  await page.getByRole('heading',{name:'Horário',exact:true}).waitFor();await page.waitForTimeout(500);
  await page.locator('input[type=date]').fill('2030-12-10');await page.getByRole('button',{name:'09:00',exact:true}).click();
  booking.push(await group(page.locator('.time-choices')));
  booking.push(await group(page.locator('.booking-action-buttons')));
  await page.getByRole('button',{name:'Continuar',exact:true}).click();await page.getByRole('heading',{name:'Confira',exact:true}).waitFor();
  await page.getByRole('checkbox').check();await page.getByRole('button',{name:'Concluir simulação'}).click();
  await page.getByRole('heading',{name:'Tudo certo na simulação.'}).waitFor();
  assert(booking.every(g=>(g.gap===null||g.gap>=16)&&g.heights.every(h=>h>=44)));
  if(width<768)assert.equal(booking[0].direction,'column');
  await context.close();
  const reduced=await browser.newContext({viewport:{width,height},reducedMotion:'reduce',isMobile:width<768,hasTouch:width<768});
  const p=await reduced.newPage();p.on('pageerror',e=>errors.push(e.message));p.on('console',e=>{if(e.type()==='error')errors.push(e.text())});
  await p.goto(`${base}/#galeria`);await p.waitForLoadState('networkidle');await wheelTo(p,'.films-grid',110);
  assert(await p.locator('.shop-film video').evaluateAll(vs=>vs.every(v=>v.paused&&v.currentTime===0)));
  await p.screenshot({path:`${root}/${width}-4-video-movimento-reduzido.jpg`,type:'jpeg',quality:84});
  await p.locator('.film-toggle').first().click();await p.waitForFunction(()=>!document.querySelector('.shop-film video').paused);
  await p.locator('.film-toggle').first().click();assert(await p.locator('.shop-film video').first().evaluate(v=>v.paused));
  await wheelTo(p,'.ritual',110);
  const reducedRitual=await p.locator('.ritual').evaluate(e=>({height:e.clientHeight,content:e.scrollHeight,steps:[...e.querySelectorAll('.ritual-step')].map(s=>getComputedStyle(s).visibility)}));
  assert(reducedRitual.content<=reducedRitual.height+1&&reducedRitual.steps.every(s=>s==='visible'));
  await p.screenshot({path:`${root}/${width}-2-ritual-reduzido.jpg`,type:'jpeg',quality:84});
  assert.equal(errors.length,0,errors.join('\n'));
  results.push({width,height,manualPause,viewportPauseResume,audioToggle:true,reducedAutoplay:false,reducedManualPlay:true,filters,actions,booking,reducedRitual,errors});
  await fs.writeFile(`${root}/interactions.json`,JSON.stringify(results,null,2));console.log(JSON.stringify(results.at(-1)));
  await reduced.close();
 }
}finally{await browser.close()}
