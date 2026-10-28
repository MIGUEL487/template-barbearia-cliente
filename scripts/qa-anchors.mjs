import {chromium} from 'playwright';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});const results=[];
try{for(const [width,height] of [[1440,900],[1366,768],[390,844]]){
 const p=await b.newPage({viewport:{width,height},isMobile:width<768,hasTouch:width<768}),errors=[];let frames=0;
 p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(r.url().includes('/frames/')&&r.resourceType()==='fetch')frames++});
 for(const id of ['servicos','galeria','contato']){await p.goto('http://127.0.0.1:8787/#'+id);await p.waitForLoadState('networkidle');await p.waitForTimeout(900);const top=await p.locator('#'+id).evaluate(e=>e.getBoundingClientRect().top);assert(top>=80&&top<125,`${width} ${id} top ${top}`);assert.equal(frames,0,'Deep link should skip frame loading');}
 if(width<768)await p.getByRole('button',{name:'Abrir menu'}).click();
 await p.locator('.site-nav a').filter({hasText:'Serviços'}).click();await p.waitForTimeout(500);
 assert((await p.locator('#servicos').boundingBox()).y<125);assert.equal(new URL(p.url()).hash,'#servicos');
 await p.goBack();await p.waitForTimeout(600);assert.equal(new URL(p.url()).hash,'#contato');assert((await p.locator('#contato').boundingBox()).y<125);
 assert.equal(errors.length,0,errors.join('\n'));results.push({width,height,deepLinks:true,menuNavigation:true,history:true,frameFetches:frames,errors});await p.close();
}
const normal=await b.newPage({viewport:{width:1440,height:900}});
await normal.goto('http://127.0.0.1:8787/');await normal.waitForFunction(()=>document.querySelector('.cinematic')?.frameStats?.().drawn>=0);
assert.equal(await normal.locator('.cinematic').getAttribute('data-scroll-mode'),'gsap-pin');
for(let i=0;i<500;i++){const delta=await normal.locator('#contato').evaluate(e=>e.getBoundingClientRect().top-128);if(Math.abs(delta)<6)break;await normal.mouse.wheel(0,Math.max(-480,Math.min(480,delta)));await normal.waitForTimeout(80)}
await normal.waitForFunction(()=>document.querySelector('.cinematic').dataset.endingPhase==='done');
const boundary=await normal.locator('.hero-track').evaluate(e=>scrollY+e.getBoundingClientRect().bottom);await normal.evaluate(()=>{window.__anchorPositions=[];window.addEventListener('scroll',()=>window.__anchorPositions.push(scrollY))});
await normal.locator('.site-nav a').filter({hasText:'Serviços'}).click();await normal.waitForTimeout(600);
assert((await normal.locator('#servicos').boundingBox()).y<125);
assert(await normal.evaluate(boundary=>window.__anchorPositions.every(y=>y>=boundary),boundary),'Navigation returned into hero');
results.push({normalIntroPreserved:true,navigationAfterIntroSkipsFrames:true});await normal.close();
await fs.mkdir('docs/anchor-navigation',{recursive:true});await fs.writeFile('docs/anchor-navigation/results.json',JSON.stringify(results,null,2));console.log(results)}finally{await b.close()}
