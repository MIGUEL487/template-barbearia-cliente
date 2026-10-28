import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const base=process.env.QA_BASE_URL || 'http://127.0.0.1:8787';
const root='docs/logo-auto-stilo';await fs.mkdir(root,{recursive:true});
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});const results=[];
try{
 for(const [width,height] of [[1440,900],[1366,768],[390,844]]){
  const p=await browser.newPage({viewport:{width,height}}),errors=[];
  p.on('pageerror',e=>errors.push(e.message));p.on('console',e=>{if(e.type()==='error')errors.push(e.text())});
  await p.goto(base);await p.waitForLoadState('networkidle');
  for(let i=0;i<500;i++){
   const delta=await p.locator('#servicos').evaluate(e=>e.getBoundingClientRect().top-128);
   if(Math.abs(delta)<6)break;
   await p.mouse.wheel(0,Math.max(-480,Math.min(480,delta)));await p.waitForTimeout(75);
  }
  await p.waitForFunction(()=>getComputedStyle(document.querySelector('.site-header')).visibility==='visible');
  await p.waitForTimeout(900);
  const header=await p.locator('.site-header').evaluate(e=>{const i=e.querySelector('img'),s=getComputedStyle(i);return{height:e.getBoundingClientRect().height,src:i.getAttribute('src'),width:i.clientWidth,heightImage:i.clientHeight,borderRadius:s.borderRadius,background:s.backgroundColor,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth}});
  assert.equal(header.src,'/brand/auto-stilo/logo-on-light.png');assert.equal(header.height,81);assert.equal(header.borderRadius,'0px');assert.equal(header.overflow,0);
  await p.screenshot({path:`${root}/${width}-header.jpg`,type:'jpeg',quality:88});
  for(let i=0;i<220;i++){
   const delta=await p.locator('.site-footer').evaluate(e=>e.getBoundingClientRect().top-110);
   if(Math.abs(delta)<6)break;
   await p.mouse.wheel(0,Math.max(-480,Math.min(480,delta)));await p.waitForTimeout(65);
  }
  await p.waitForTimeout(900);
  assert.equal(await p.locator('.footer-brand-mark img').getAttribute('src'),'/brand/auto-stilo/logo-on-dark.png');
  await p.screenshot({path:`${root}/${width}-footer.jpg`,type:'jpeg',quality:88});
  const icons=await p.locator('link[rel=icon]').evaluateAll(es=>es.map(e=>({href:e.getAttribute('href'),media:e.getAttribute('media'),type:e.type})));
  assert(!icons.some(i=>i.href.includes('marca-203')||i.href.startsWith('/icon.png')));
  assert(icons.some(i=>i.href==='/favicon-auto-stilo.svg'));assert(icons.some(i=>i.media?.includes(': dark')));
  for(const icon of icons){const r=await p.request.get(base+icon.href);assert(r.ok(),`Missing ${icon.href}`)}
  assert.equal(errors.length,0,errors.join('\n'));results.push({width,height,header,icons,errors});await p.close();
 }
 // Rasterize the actual adaptive SVG in both browser preferences and inspect ink.
 for(const scheme of ['light','dark']){
  const p=await browser.newPage({viewport:{width:900,height:460},colorScheme:scheme});
  await p.goto(base);await p.waitForLoadState('networkidle');
  await p.setContent(`<body style="margin:0;background:${scheme==='dark'?'#0a0a0c':'#fff'};color:${scheme==='dark'?'white':'black'};font:16px sans-serif;padding:32px;display:flex;align-items:center;gap:48px"><div><img src="${base}/brand/auto-stilo/logo-on-${scheme}.png" width="288" alt="Auto Stilo"></div><div><p>Favicon · ${scheme}</p><div style="display:flex;align-items:center;gap:32px">${[16,32,48,96].map(n=>`<img class="icon" src="${base}/favicon-auto-stilo.svg" width="${n}" height="${n}">`).join('')}</div></div></body>`);
  await p.locator('.icon').first().evaluate(i=>i.decode());await p.waitForTimeout(400);
  const pixels=await p.locator('.icon').last().evaluate(img=>{
   const c=document.createElement('canvas');c.width=c.height=96;const ctx=c.getContext('2d');ctx.drawImage(img,0,0,96,96);const d=ctx.getImageData(0,0,96,96).data;let ink=0,sum=0,clear=0,purple=0;
   for(let i=0;i<d.length;i+=4){if(d[i+3]<20){clear++;continue}if(d[i+3]<180)continue;const [r,g,b]=d.slice(i,i+3);if(b>g+15&&r>g+5){purple++;continue}ink++;sum+=(r+g+b)/3}return{brightness:sum/ink,ink,clear,purple};
  });
  assert(pixels.clear>96*96*.3,'Favicon background must remain transparent');assert(pixels.purple>0,'Purple crowns missing');
  assert(scheme==='dark'?pixels.brightness>220:pixels.brightness<35,'Favicon does not follow browser color scheme');
  await p.screenshot({path:`${root}/marca-e-favicon-${scheme}.png`});results.push({scheme,pixels});await p.close();
 }
 await fs.writeFile(`${root}/results.json`,JSON.stringify(results,null,2));console.log('Brand variants, headers, footers and adaptive favicons passed.');
}finally{await browser.close()}
