// Production-only regression evidence. Run before/after against preview:cf.
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';

const phase = process.argv[2] || 'depois';
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:8787';
const root = `docs/bugs-visuais/${phase}`;
await fs.mkdir(root, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
const results = [];
async function wheelTo(page, selector, offset = 120) {
  for (let i = 0; i < 500; i++) {
    const delta = await page.locator(selector).first().evaluate((el, y) => el.getBoundingClientRect().top - y, offset);
    if (Math.abs(delta) < 8) break;
    if (await page.evaluate(d => (scrollY < 1 && d < 0) || (scrollY+innerHeight >= document.documentElement.scrollHeight-1 && d > 0), delta)) break;
    await page.mouse.wheel(0, Math.max(-480, Math.min(480, delta)));
    await page.waitForTimeout(65);
  }
  await page.waitForTimeout(850);
}
try {
  for (const [width, height] of [[1440, 900], [1366, 768], [390, 844]]) {
    const context = await browser.newContext({ viewport: { width, height }, isMobile: width < 768, hasTouch: width < 768 });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', e => { if (e.type() === 'error') errors.push(e.text()); });
    await page.addInitScript(() => {
      window.__cls = 0;
      new PerformanceObserver(list => { for (const e of list.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
    });
    await page.goto(base);
    await page.waitForLoadState('networkidle');
    const shot = async name => page.screenshot({ path: `${root}/${width}-${name}.jpg`, type: 'jpeg', quality: 84 });
    await wheelTo(page, '.signature', 160);
    await shot('1-degrade');
    const transition = await page.locator('.signature').evaluate(el => {
      const r = el.getBoundingClientRect(), s = getComputedStyle(el);
      return { left: r.left, width: r.width, viewport: innerWidth, background: s.backgroundImage };
    });
    await wheelTo(page, '.ritual', 80);
    const ritual = [];
    for (let i = 0; i < 5; i++) {
      ritual.push(await page.evaluate(() => {
        const p = document.querySelector('.ritual-photo').getBoundingClientRect(), h = document.querySelector('.site-header').getBoundingClientRect();
        return { photoTop: p.top, photoBottom: p.bottom, headerBottom: h.bottom, photoHeight: p.height, viewportHeight: innerHeight, cssHeader: getComputedStyle(document.documentElement).getPropertyValue('--header-h') };
      }));
      if (i === (phase === 'antes' ? 1 : 0)) await shot('2-ritual');
      await page.mouse.wheel(0, 240); await page.waitForTimeout(500);
    }
    await wheelTo(page, '#servicos', 128);
    const service = page.locator('.service-row').first();
    await service.hover({ force: true }); await page.waitForTimeout(900);
    await shot('7-cursor-servicos');
    const previewCount = await page.locator('.service-preview').count();
    await wheelTo(page, '#galeria', 112);
    if (await page.locator('.space-window').count()) await wheelTo(page, '.space-window', 144);
    await shot('3-fotos-legendas');
    const watermarkOverlap = await page.evaluate(() => [...document.querySelectorAll('figure')].flatMap(f => {
      const caption = f.querySelector('figcaption'), mark = f.querySelector('.photo-watermark');
      if (!caption || !mark) return [];
      const a = caption.getBoundingClientRect(), b = mark.getBoundingClientRect();
      const intersection = a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
      return [{ caption: caption.textContent, intersection, overlap: intersection && (Number(getComputedStyle(mark).zIndex) || 0) >= (Number(getComputedStyle(caption).zIndex) || 0) }];
    }));
    await wheelTo(page, '.films-grid', 136);
    await shot('4-videos');
    const videos = await page.locator('.shop-film video').evaluateAll(els => els.map(v => ({ src: v.currentSrc, controls: v.hasAttribute('controls'), paused: v.paused, muted: v.muted, playsInline: v.playsInline, loop: v.loop, radius: getComputedStyle(v.parentElement).borderRadius, overflow: getComputedStyle(v.parentElement).overflow, poster: v.poster })));
    const media = await page.evaluate(() => {
      const canonical = src => new URL(src, location.href).pathname.replace(/-\d+\.(avif|webp|jpe?g)$/, '').replace(/\.(webp|avif|jpe?g)$/, '');
      const images = [...document.images].map(i => ({ src: i.currentSrc || i.src, alt: i.alt, canonical: canonical(i.currentSrc || i.src), sources: [...(i.closest('picture')?.querySelectorAll('source') || [])].map(s => s.srcset) }));
      const videos = [...document.querySelectorAll('video')].map(v => ({ src: v.currentSrc || v.src, sources: [...v.querySelectorAll('source')].map(s => s.src), poster: v.poster }));
      return { images, videos, duplicates: images.filter((i, index) => images.findIndex(x => x.canonical === i.canonical) !== index).map(i => i.canonical) };
    });
    await wheelTo(page, '.final-cta', 240);
    await shot('5-emenda');
    const seams = await page.evaluate(() => ['.final-cta', '.site-footer', '.faq-section'].map(sel => { const e = document.querySelector(sel), s = getComputedStyle(e); return { selector: sel, topBorder: s.borderTopWidth, bottomBorder: s.borderBottomWidth, shadow: s.boxShadow }; }));
    const cta = page.locator('.final-cta .cta');
    await cta.scrollIntoViewIfNeeded(); await page.waitForTimeout(900);
    const box = await cta.boundingBox(), boxes = box ? [box] : [];
    if (box && width > 767) {
      await page.mouse.move(box.x + box.width * .25, box.y + box.height / 2);
      for (let i = 0; i < 20; i++) { boxes.push(await cta.boundingBox()); await page.waitForTimeout(60); }
      await page.mouse.move(2, 2); await page.waitForTimeout(600);
    }
    await shot('6-botao');
    const buttonDrift = boxes.length ? Math.max(...boxes.map(b => b.x)) - Math.min(...boxes.map(b => b.x)) + Math.max(...boxes.map(b => b.y)) - Math.min(...boxes.map(b => b.y)) : 0;
    const home = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth, headerHeight: document.querySelector('.site-header').getBoundingClientRect().height, cls: window.__cls,
      surfaces: ['.hero-track','.signature','.ritual','.team-section','.gallery-section','.final-cta','.site-footer'].map(selector => {const r=document.querySelector(selector).getBoundingClientRect();return {selector,left:r.left,width:r.width};}) }));
    await page.goto(`${base}/meu-agendamento/`); await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Reagendar exemplo' }).click();
    await page.getByRole('button', { name: 'Confirmar simulação' }).scrollIntoViewIfNeeded(); await page.waitForTimeout(800);
    if (phase === 'depois') await wheelTo(page, '.confirmation-actions', Math.max(120, height-224));
    await shot('6-confirmacao');
    const management = await page.evaluate(() => {
      const d = document.querySelector('[role=dialog]'), buttons = [...d.querySelectorAll('button')], [a,b] = buttons.map(e => e.getBoundingClientRect());
      return { gap: b.top >= a.bottom ? b.top - a.bottom : b.left - a.right, heights: buttons.map(e => e.getBoundingClientRect().height) };
    });
    results.push({ width, height, transition, ritual, previewCount, watermarkOverlap, videos, media, seams, buttonDrift, home, management, errors });
    await fs.writeFile(`${root}/results.json`, JSON.stringify(results, null, 2));
    console.log(JSON.stringify(results.at(-1)));
    if (phase === 'depois') {
      assert.equal(home.scrollWidth, home.clientWidth, 'Horizontal overflow');
      assert.equal(transition.width, width, 'Transition must bleed across viewport');
      assert(home.surfaces.every(s => Math.abs(s.left) < 1 && Math.abs(s.width-width) < 1), 'Full-width surface');
      assert(ritual.every(r => r.photoTop >= r.headerBottom - 1 && r.photoBottom <= r.viewportHeight), 'Ritual photo obscured');
      assert(!watermarkOverlap.some(x => x.overlap), 'Watermark over caption');
      assert.equal(previewCount, 0);
      assert.equal(media.duplicates.length, 0, 'Repeated photo');
      const sources = [...media.images.map(i => i.src), ...media.videos.flatMap(v => [v.src, v.poster])];
      assert.equal(new Set(sources).size, sources.length, 'Repeated image, video or poster source');
      assert(videos.every(v => !v.controls && v.loop && v.playsInline && v.radius !== '0px' && v.overflow === 'hidden'));
      assert(seams.filter(s => s.selector !== '.faq-section').every(s => s.topBorder === '0px'));
      assert(buttonDrift < 1, `Button drift: ${buttonDrift}`);
      assert(management.gap >= 16 && management.heights.every(h => h >= 44));
      assert.equal(errors.length, 0, errors.join('\n'));
    }
    await context.close();
  }
} finally { await browser.close(); }
