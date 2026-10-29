import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
await fs.mkdir('docs/intro-notice',{recursive:true});
try{for(const width of [1440,390]){
 const page=await browser.newPage({viewport:{width,height:width===1440?800:900},deviceScaleFactor:width===1440?2:1}),errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.route('https://*.supabase.co/**',route=>route.fulfill({json:[]}));
 await page.goto('http://localhost:8787/?motion=full');
 const skip=page.getByRole('link',{name:/Pular introdução/});await skip.waitFor();
 await page.waitForFunction(()=>document.querySelector('.cinematic')?.dataset.count);
 await skip.evaluate(el=>Promise.all(el.getAnimations().map(animation=>animation.finished)));
 assert.equal(await page.locator('.scroll-cue').count(),0);
 const box=await skip.boundingBox();assert(box.y>=15&&box.y<32);assert(Math.abs(box.x+box.width/2-width/2)<2);
 await page.screenshot({path:`docs/intro-notice/${width}-notice.png`});
 if(width===1440){
  await page.mouse.wheel(0,400);
  await page.waitForFunction(()=>Number(document.querySelector('.cinematic canvas')?.dataset.frame)>0);
  assert.equal(await page.locator('.cinematic canvas').evaluate(el=>el.width),1920);
 }
 await skip.click();await page.waitForFunction(()=>location.hash==='#assinatura'&&document.documentElement.classList.contains('hero-nav-visible'));
 assert(await skip.isHidden());assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);
 console.log({width,topNotice:true,removedCue:true,skipWorks:true,desktopPlayback:width===1440});await page.close();
}}finally{await browser.close();}
