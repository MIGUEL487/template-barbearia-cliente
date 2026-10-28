// Validate the whole cutout, not an image zoom, against the production preview.
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const root = 'docs/ritual-movimento';
await fs.mkdir(root, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:8787';
const results = [];
async function wheelTo(page, y) {
  for (let i=0;i<280;i++) {
    const delta = y-await page.evaluate(()=>scrollY);
    if (Math.abs(delta)<2) break;
    await page.mouse.wheel(0,Math.max(-240,Math.min(240,delta)));
    await page.waitForTimeout(70);
  }
  await page.waitForTimeout(750);
}
try {
  for (const [width,height] of [[1920,920],[1440,900],[1366,768],[390,844]]) {
    const context=await browser.newContext({ viewport:{width,height},isMobile:width<768,hasTouch:width<768 });
    const page=await context.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',e=>{if(e.type()==='error')errors.push(e.text())});
    await page.goto(`${base}/#assinatura`);await page.waitForLoadState('networkidle');await page.waitForTimeout(900);
    const start=await page.locator('.ritual').evaluate(el=>scrollY+el.parentElement.getBoundingClientRect().top-parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')));
    const samples=[];
    for (const progress of [0,.5,1]) {
      await wheelTo(page,start+height*2*progress+(progress===0?2:progress===1?-2:0));
      const sample=await page.evaluate(()=>{
        const el=document.querySelector('.ritual'),photo=el.querySelector('.ritual-photo'),img=photo.querySelector('img');
        const rect=photo.getBoundingClientRect(),section=el.getBoundingClientRect(),header=document.querySelector('.site-header').getBoundingClientRect();
        const matrix=new DOMMatrixReadOnly(getComputedStyle(photo).transform),imageStyle=getComputedStyle(img);
        return {scrollY,photo:{left:rect.left,right:rect.right,top:rect.top,bottom:rect.bottom,width:rect.width,height:rect.height},section:{top:section.top,height:section.height},headerBottom:header.bottom,scale:Math.hypot(matrix.a,matrix.b),angle:Math.atan2(matrix.b,matrix.a)*180/Math.PI,centerOffset:(rect.top+rect.bottom)/2-(section.top+section.height/2),imageTransform:imageStyle.transform,imageFit:imageStyle.objectFit,imagePosition:imageStyle.objectPosition,imageWidth:img.clientWidth,imageHeight:img.clientHeight,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth};
      });
      samples.push({progress,...sample});
      assert.equal(sample.imageTransform,'none','The bitmap must not zoom inside the cutout');
      assert.equal(sample.overflow,0,'Horizontal overflow');
      assert(sample.photo.top>=sample.headerBottom-1 && sample.photo.bottom<=height+1,'Photo clipped by header/viewport');
      assert(sample.photo.left>=0 && sample.photo.right<=width,'Rotation clipped horizontally');
      if(width>767) {
        assert(Math.abs(sample.centerOffset)<1,'Cutout is not centered in the black band');
        assert(sample.photo.top>=sample.section.top+sample.section.height*.12-1 && sample.photo.bottom<=sample.section.top+sample.section.height*.88+1,'Cutout reaches the gradient');
      }
      await page.screenshot({path:`${root}/${width}-${progress===0?'inicio':progress===1?'fim':'meio'}.jpg`,type:'jpeg',quality:88});
    }
    assert(samples[2].scale>samples[0].scale+.1,'Cutout should grow during scroll');
    assert(samples[2].angle>samples[0].angle+3,'Cutout should rotate during scroll');
    assert(samples.every(s=>s.imageWidth===samples[0].imageWidth&&s.imageHeight===samples[0].imageHeight&&s.imagePosition===samples[0].imagePosition),'Crop should remain constant');
    // Reverse scroll restores the initial pose.
    await wheelTo(page,start+2);
    const reverse=await page.locator('.ritual-photo').evaluate(el=>{const m=new DOMMatrixReadOnly(getComputedStyle(el).transform);return{scale:Math.hypot(m.a,m.b),angle:Math.atan2(m.b,m.a)*180/Math.PI}});
    assert(Math.abs(reverse.scale-samples[0].scale)<.005&&Math.abs(reverse.angle-samples[0].angle)<.1);
    await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(900);
    const reduced=await page.locator('.ritual-photo').evaluate(el=>({transform:getComputedStyle(el).transform,imageTransform:getComputedStyle(el.querySelector('img')).transform}));
    assert.equal(reduced.transform,'none');assert.equal(reduced.imageTransform,'none');
    assert.equal(errors.length,0,errors.join('\n'));
    results.push({width,height,samples,reverse,reduced,errors});
    await fs.writeFile(`${root}/results.json`,JSON.stringify(results,null,2));
    console.log(`${width}x${height}: center, scale, rotation, fixed crop, reverse and reduced motion passed.`);
    await context.close();
  }
}finally{await browser.close()}
