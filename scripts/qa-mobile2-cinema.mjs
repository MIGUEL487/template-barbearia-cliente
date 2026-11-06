import {staticTestServer} from './lib/static-test-server.mjs';
import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const server=process.env.QA_BASE?null:await staticTestServer();
const out='docs/mobile2/evidencias',base=process.env.QA_BASE||server.base;await fs.mkdir(out,{recursive:true});
const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});const results=[];
try{
 for(const [width,height]of [[1920,1080],[1366,768],[820,1180],[430,932],[390,844],[360,800]].filter(([width])=>!process.env.QA_WIDTHS||process.env.QA_WIDTHS.split(',').map(Number).includes(width))){
  const context=await b.newContext({viewport:{width,height},isMobile:width<=430,hasTouch:width<=430});const p=await context.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.route('https://*.supabase.co/**',r=>{const n=new URL(r.request().url()).pathname.split('/').pop();return r.fulfill({json:n==='public_barbers'?[{id:'a',name:'Carlos',bio:'Profissional de teste',avatar_url:null},{id:'b',name:'Jeronimo',bio:'Profissional de teste',avatar_url:null}]:n==='public_services'?[{id:'s',name:'Corte de teste',description:'Corte e acabamento'}]:[]})});
  await p.addInitScript(()=>{window.__metrics={cls:0,lcp:0,longTasks:0};try{new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.__metrics.cls+=e.value}).observe({type:'layout-shift',buffered:true});new PerformanceObserver(list=>{window.__metrics.lcp=list.getEntries().at(-1)?.startTime||0}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(list=>{window.__metrics.longTasks+=list.getEntries().length}).observe({type:'longtask',buffered:true})}catch{}});
  await p.goto(base+'/?debug-hero=1');await p.waitForFunction(()=>window.__HERO__?.displayedFrame===1);await p.waitForTimeout(300);
  const initialMetrics=await p.evaluate(()=>({...window.__metrics}));
  const logo=await p.locator('.cue-0 .cinema-brand').boundingBox(),cta=await p.locator('.cue-0 .cta').boundingBox();assert(Math.abs(logo.x+logo.width/2-width/2)<2);assert(Math.abs(cta.x+cta.width/2-width/2)<2);assert(cta.y>=logo.y+logo.height);
  assert.equal((await p.locator('.cue-0 .cta').getAttribute('href')).replace(/\/$/,''),'/agendar');
  await p.mouse.wheel(0,1600);await p.waitForTimeout(250);let h=await p.evaluate(()=>window.__HERO__);assert(h.displayedFrame<50,'single wheel too fast');
  const limit=await p.evaluate(()=>window.__HERO_GATE__.limit);await p.mouse.wheel(0,100000);await p.waitForTimeout(300);assert((await p.evaluate(()=>scrollY))<=limit+3);assert((await p.evaluate(()=>window.__HERO__)).displayedFrame<239);
  await p.waitForFunction(()=>window.__HERO__?.displayedFrame===239,null,{timeout:30000});await p.waitForFunction(()=>window.__HERO_GATE__?.phase==='complete');
  h=await p.evaluate(()=>window.__HERO__);const forward=h.trace.slice(0,h.trace.indexOf(239)+1);assert.deepEqual(forward,Array.from({length:239},(_,i)=>i+1));assert(h.decoded<=h.limit);assert(h.loaded<=h.compressedLimit+3);
  await p.mouse.wheel(0,800);await p.waitForTimeout(450);assert((await p.evaluate(()=>scrollY))>limit);
  await p.mouse.wheel(0,-100000);await p.waitForFunction(()=>window.__HERO__?.displayedFrame===1,null,{timeout:30000});const reverse=(await p.evaluate(()=>window.__HERO__)).trace;const from=reverse.indexOf(239);assert.deepEqual(reverse.slice(from),Array.from({length:239},(_,i)=>239-i));
  // Complete again before testing downstream sections and vertical-to-horizontal touch.
  await p.mouse.wheel(0,100000);await p.waitForFunction(()=>window.__HERO_GATE__?.phase==='complete',null,{timeout:30000});
  await p.locator('.journey-intro .text-link').focus();await p.waitForFunction(()=>!!window.__JOURNEY__);const j=await p.evaluate(()=>window.__JOURNEY__);await p.evaluate(y=>scrollTo(0,y),j.start+80);await p.waitForTimeout(300);
  const before=await p.evaluate(()=>window.__JOURNEY__.progress);
  if(width<=430){const cdp=await context.newCDPSession(p);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:width/2,y:height*.75}]});for(let i=1;i<=12;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:width/2,y:height*.75-i*16}]});await p.waitForTimeout(20)}await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]})}else await p.mouse.wheel(0,500);
  await p.waitForTimeout(500);assert((await p.evaluate(()=>window.__JOURNEY__.progress))>before,'vertical input advances horizontal narrative');
  await p.locator('.journey-final .cta').focus();await p.waitForTimeout(400);assert((await p.evaluate(()=>window.__JOURNEY__.progress))>.95);
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await p.screenshot({path:`${out}/journey-${width}.jpg`,quality:75});
  for(const id of ['servicos','espaco','avaliacoes','contato']){const section=p.locator('#'+id);if(await section.count()){await section.evaluate(el=>el.scrollIntoView({behavior:'instant'}));await p.waitForTimeout(120);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'section overflow '+id)}}
  const metrics=await p.evaluate(()=>({...window.__metrics,heap:performance.memory?.usedJSHeapSize||null,decoded:window.__HERO__?.decoded,compressed:window.__HERO__?.loaded,scrollInstances:window.__LANDING_SCROLL__?.instances}));assert.equal(metrics.scrollInstances,1);assert.deepEqual(errors,[]);results.push({width,height,all239Sequential:true,reverse:true,fastScrollGate:true,centeredLogoCta:true,nativeTouch:width<=430,horizontalInput:true,noOverflow:true,metrics:{...metrics,initial:initialMetrics,clsIncludesScriptedPinJumps:true}});console.log('Passed cinematic interactions',width);await context.close();
 }
 const p=await b.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});await p.route('https://*.supabase.co/**',r=>r.fulfill({json:[]}));await p.goto(base);await p.waitForTimeout(500);assert.equal(await p.locator('.cinema-static').count(),1);assert.equal(await p.locator('.cinema .pin-spacer').count(),0);assert(await p.locator('.cinema-still-story').isVisible());results.push({reducedMotion:true});await p.close();
}finally{await b.close();await server?.close();await fs.writeFile(out+'/cinema-results.json',JSON.stringify(results,null,2))}
console.log(results);
