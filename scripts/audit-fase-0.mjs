import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const ROOT_DIR = 'C:\\Users\\Windows\\.gemini\\antigravity\\scratch\\barbearia-template\\template-barbearia-cliente';
const OUT_DIR = path.join(ROOT_DIR, 'out');
const ANTES_DIR = path.join(ROOT_DIR, 'docs/redesign-v3/evidencias/00-antes');
const SUMICO_DIR = path.join(ROOT_DIR, 'docs/redesign-v3/evidencias/02-diagnostico-sumico');
const VIDEO_DIR = path.join(ROOT_DIR, 'docs/redesign-v3/evidencias/00-antes/videos');

fs.mkdirSync(ANTES_DIR, { recursive: true });
fs.mkdirSync(SUMICO_DIR, { recursive: true });
fs.mkdirSync(VIDEO_DIR, { recursive: true });

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.glb': 'model/gltf-binary',
  '.mp4': 'video/mp4',
};

const server = http.createServer((req, res) => {
  let reqPath = req.url ? req.url.split('?')[0] : '/';
  if (reqPath.endsWith('/')) reqPath += 'index.html';
  let filePath = path.join(OUT_DIR, reqPath);

  if (!fs.existsSync(filePath)) {
    if (fs.existsSync(filePath + '.html')) {
      filePath += '.html';
    } else {
      filePath = path.join(OUT_DIR, '404.html');
    }
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  try {
    const data = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': contentType, 'Access-Control-Allow-Origin': '*' });
    res.end(data);
  } catch (err) {
    res.writeHead(404);
    res.end('Not found');
  }
});

const PORT = 3010;
await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));
console.log(`[QA Server] Rodando em http://127.0.0.1:${PORT}`);

const browser = await chromium.launch({
  headless: true,
  args: [
    '--enable-webgl',
    '--use-gl=angle',
    '--ignore-gpu-blocklist',
    '--no-sandbox',
  ],
});

try {
  const viewports = [
    { name: '1440', width: 1440, height: 900, isMobile: false },
    { name: '390', width: 390, height: 844, isMobile: true, hasTouch: true },
  ];

  for (const vp of viewports) {
    console.log(`\n=== INICIANDO CAPTURA DE TELAS VIEWPORT ${vp.name} ===`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile,
      hasTouch: vp.hasTouch,
    });

    await context.route('**/*.supabase.co/**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    const page = await context.newPage();
    await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // 1. Capture Hero
    await page.screenshot({ path: path.join(ANTES_DIR, `hero-${vp.name}.png`), timeout: 60000 });
    console.log(`[Screenshot] hero-${vp.name}.png`);

    // 2. Capture 6 Scroll Positions (0%, 20%, 40%, 60%, 80%, 100%)
    const maxScroll = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
    const scrollPercents = [0, 20, 40, 60, 80, 100];
    for (const p of scrollPercents) {
      const targetY = Math.round((p / 100) * maxScroll);
      await page.evaluate((y) => window.scrollTo(0, y), targetY);
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(ANTES_DIR, `maquina-scroll-${p}pct-${vp.name}.png`), timeout: 60000 });
      console.log(`[Screenshot] maquina-scroll-${p}pct-${vp.name}.png`);
    }

    // 3. Capture Specific Sections
    // "Entre. Fique à vontade."
    const galeria = page.locator('#galeria');
    if (await galeria.count() > 0) {
      await galeria.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(ANTES_DIR, `secao-entre-fique-a-vontade-${vp.name}.png`), timeout: 60000 });
      console.log(`[Screenshot] secao-entre-fique-a-vontade-${vp.name}.png`);
    }

    // Vídeos
    const videos = page.locator('.films-section');
    if (await videos.count() > 0) {
      await videos.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(ANTES_DIR, `secao-videos-${vp.name}.png`), timeout: 60000 });
      console.log(`[Screenshot] secao-videos-${vp.name}.png`);
    }

    // Mapa
    const contato = page.locator('#contato');
    if (await contato.count() > 0) {
      await contato.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(ANTES_DIR, `secao-mapa-${vp.name}.png`), timeout: 60000 });
      console.log(`[Screenshot] secao-mapa-${vp.name}.png`);
    }

    // Fotos com faixas decorativas
    const assinatura = page.locator('#assinatura');
    if (await assinatura.count() > 0) {
      await assinatura.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(ANTES_DIR, `fotos-faixas-decorativas-${vp.name}.png`), timeout: 60000 });
      console.log(`[Screenshot] fotos-faixas-decorativas-${vp.name}.png`);
    }

    // Botões
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    const heroBtn = page.locator('.hero-actions');
    if (await heroBtn.count() > 0) {
      await page.screenshot({ path: path.join(ANTES_DIR, `botoes-hero-${vp.name}.png`), timeout: 60000 });
      console.log(`[Screenshot] botoes-hero-${vp.name}.png`);
    }

    await context.close();
  }

  // 4. Video Recording Context (Smooth Scroll Down & Up)
  console.log('\n=== GRAVANDO VÍDEO DE ROLAGEM COMPLETA ===');
  const videoContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: {
      dir: VIDEO_DIR,
      size: { width: 1280, height: 720 },
    },
  });
  await videoContext.route('**/*.supabase.co/**', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
  const videoPage = await videoContext.newPage();
  await videoPage.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'domcontentloaded' });
  await videoPage.waitForTimeout(2000);

  const maxScrollVid = await videoPage.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
  // Scroll down smoothly in 25 increments
  for (let i = 0; i <= 25; i++) {
    const y = Math.round((i / 25) * maxScrollVid);
    await videoPage.evaluate((targetY) => window.scrollTo(0, targetY), y);
    await videoPage.waitForTimeout(120);
  }
  await videoPage.waitForTimeout(500);
  // Scroll up smoothly in 25 increments
  for (let i = 25; i >= 0; i--) {
    const y = Math.round((i / 25) * maxScrollVid);
    await videoPage.evaluate((targetY) => window.scrollTo(0, targetY), y);
    await videoPage.waitForTimeout(120);
  }
  await videoPage.waitForTimeout(500);
  await videoContext.close();
  console.log(`[Vídeo] Gravação salva em ${VIDEO_DIR}`);

  // 5. Detailed 3D Model Inspection & 60-Step Scroll Sweep
  console.log('\n=== REALIZANDO VARREDURA DE 60 PASSOS DO SCROLL E AUDITORIA DO MODELO 3D ===');
  const auditContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const auditPage = await auditContext.newPage();
  await auditPage.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'domcontentloaded' });
  await auditPage.waitForTimeout(2000);

  const sceneAudit = await auditPage.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return { error: 'Canvas não encontrado' };

    const container = canvas.parentElement;
    const computedCanvas = window.getComputedStyle(canvas);
    const computedContainer = container ? window.getComputedStyle(container) : null;

    const ancestors = [];
    let curr = canvas.parentElement;
    while (curr && curr !== document.body) {
      const cs = window.getComputedStyle(curr);
      ancestors.push({
        tag: curr.tagName,
        id: curr.id,
        className: curr.className,
        transform: cs.transform,
        filter: cs.filter,
        perspective: cs.perspective,
        contain: cs.contain,
        backdropFilter: cs.backdropFilter,
        overflow: cs.overflow,
      });
      curr = curr.parentElement;
    }

    return {
      canvasExists: true,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      containerOpacity: computedContainer ? computedContainer.opacity : null,
      containerZIndex: computedContainer ? computedContainer.zIndex : null,
      containerPosition: computedContainer ? computedContainer.position : null,
      ancestorsWithFixedBreakers: ancestors.filter(a => 
        a.transform !== 'none' || a.filter !== 'none' || a.perspective !== 'none' ||
        a.contain !== 'none' || a.backdropFilter !== 'none' || (a.overflow !== 'visible' && a.overflow !== '')
      ),
      allAncestors: ancestors,
    };
  });

  const sweepResults = await auditPage.evaluate(async () => {
    const steps = 60;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;
    const maxScroll = scrollHeight - clientHeight;
    const results = [];

    const canvas = document.querySelector('canvas');
    const container = canvas ? canvas.parentElement : null;

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    for (let i = 0; i <= steps; i++) {
      const pct = (i / steps);
      const scrollY = Math.round(pct * maxScroll);
      window.scrollTo(0, scrollY);
      await new Promise((r) => setTimeout(r, 60));

      const containerOpacity = container ? parseFloat(window.getComputedStyle(container).opacity) : 0;
      const elementsAtCenter = document.elementsFromPoint(cx, cy).map(el => ({
        tag: el.tagName,
        id: el.id,
        className: (el.className || '').toString().slice(0, 50),
        bg: window.getComputedStyle(el).backgroundColor,
      }));

      const sections = Array.from(document.querySelectorAll('section, main > *')).map(s => {
        const r = s.getBoundingClientRect();
        return {
          id: s.id || s.className.split(' ')[0],
          top: Math.round(r.top),
          bottom: Math.round(r.bottom),
          inView: r.top < window.innerHeight && r.bottom > 0,
          bg: window.getComputedStyle(s).backgroundColor,
        };
      }).filter(s => s.inView);

      results.push({
        step: i,
        progressPct: Math.round(pct * 100),
        scrollY,
        containerOpacity,
        canvasVisible: containerOpacity > 0.05,
        elementsAtCenter: elementsAtCenter.slice(0, 4),
        sectionsInView: sections,
      });
    }

    return {
      maxScroll,
      scrollHeight,
      clientHeight,
      results,
    };
  });

  fs.writeFileSync(path.join(SUMICO_DIR, 'sweep-scroll.json'), JSON.stringify({ sceneAudit, sweepResults }, null, 2));
  console.log('[Sweep] Salvo com sucesso!');

  // 6. Button and Gallery Interactions Audit
  const galleryInteractions = await auditPage.evaluate(async () => {
    const sec = document.querySelector('#galeria');
    if (!sec) return { error: 'Seção #galeria não encontrada' };

    const elements = Array.from(sec.querySelectorAll('*')).map(el => {
      const cs = window.getComputedStyle(el);
      return {
        tag: el.tagName,
        className: el.className,
        pointerEvents: cs.pointerEvents,
        cursor: cs.cursor,
      };
    });

    return {
      totalElements: elements.length,
      buttons: sec.querySelectorAll('button').length,
      links: sec.querySelectorAll('a').length,
      images: sec.querySelectorAll('img').length,
      pointerEventsNoneCount: elements.filter(e => e.pointerEvents === 'none').length,
    };
  });

  const buttonAudit = await auditPage.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button, a.cta, a.hero-btn-primary, a.hero-btn-outline, a.button-editorial, a[class*="btn"]')).map(b => {
      const cs = window.getComputedStyle(b);
      return {
        text: (b.innerText || b.getAttribute('aria-label') || '').trim().slice(0, 30),
        tag: b.tagName,
        className: b.className,
        borderRadius: cs.borderRadius,
        padding: cs.padding,
        background: cs.backgroundColor,
        color: cs.color,
      };
    });
    return buttons;
  });

  fs.writeFileSync(path.join(ANTES_DIR, 'button-audit.json'), JSON.stringify(buttonAudit, null, 2));
  fs.writeFileSync(path.join(ANTES_DIR, 'gallery-interactions.json'), JSON.stringify(galleryInteractions, null, 2));

  await auditContext.close();
  console.log('\n[Concluído] Toda a bateria de capturas e auditorias da Fase 0 foi finalizada.');

} finally {
  await browser.close();
  server.close();
}
