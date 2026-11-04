import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.resolve('out');
const PORT = 3009;
const TARGET_DIR = path.resolve('docs/redesign3d/evidencias/00-antes');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.obj': 'text/plain',
  '.mtl': 'text/plain',
};

function startServer() {
  const server = http.createServer((req, res) => {
    let cleanUrl = req.url.split('?')[0];
    if (cleanUrl.endsWith('/')) cleanUrl += 'index.html';
    let filePath = path.join(OUT_DIR, cleanUrl);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    if (!fs.existsSync(filePath)) {
      filePath = path.join(OUT_DIR, '404.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    try {
      const data = fs.readFileSync(filePath);
      res.writeHead(200, {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
      });
      res.end(data);
    } catch (err) {
      res.writeHead(500);
      res.end('Error loading file: ' + err.message);
    }
  });

  return new Promise((resolve) => {
    server.listen(PORT, '127.0.0.1', () => {
      console.log(`[Server] Rodando em http://127.0.0.1:${PORT}`);
      resolve(server);
    });
  });
}

async function run() {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
  const server = await startServer();

  console.log('[Playwright] Iniciando Chromium...');
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--enable-webgl',
      '--use-gl=angle',
      '--ignore-gpu-blocklist',
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  });

  const viewports = [
    { name: '1440', width: 1440, height: 900 },
    { name: '390', width: 390, height: 844 },
  ];

  const scrollSteps = [
    { ratio: 0.00, label: '0' },
    { ratio: 0.25, label: '25' },
    { ratio: 0.50, label: '50' },
    { ratio: 0.75, label: '75' },
    { ratio: 1.00, label: '100' },
  ];

  const auditData = [];

  try {
    for (const vp of viewports) {
      console.log(`\n=== Capturando Viewport ${vp.name} (${vp.width}x${vp.height}) ===`);
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 1,
      });

      const page = await context.newPage();

      // Intercept any Supabase requests (R3)
      await page.route('**/rest/v1/**', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        });
      });

      await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => !!document.querySelector('.global-3d-scene canvas'), null, { timeout: 15000 });
      await page.waitForTimeout(2000);

      const totalScrollHeight = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
      console.log(`Altura rolável total: ${totalScrollHeight}px`);

      // 1. Full page screenshot
      const fullPath = path.join(TARGET_DIR, `home_${vp.name}_full.png`);
      try {
        await page.screenshot({ path: fullPath, fullPage: true, timeout: 60000 });
        console.log(`Salvo: home_${vp.name}_full.png`);
      } catch (err) {
        console.warn(`Aviso: fullPage screenshot demorou, capturando viewport inicial: ${err.message}`);
        await page.screenshot({ path: fullPath, fullPage: false });
      }

      // 2. Step Screenshots at 0%, 25%, 50%, 75%, 100%
      for (const step of scrollSteps) {
        const targetY = Math.round(totalScrollHeight * step.ratio);
        await page.evaluate((y) => window.scrollTo(0, y), targetY);
        await page.waitForTimeout(600);

        const stepPath = path.join(TARGET_DIR, `home_${vp.name}_scroll_${step.label}.png`);
        await page.screenshot({ path: stepPath, fullPage: false });
        console.log(`Salvo: home_${vp.name}_scroll_${step.label}.png (y=${targetY}px)`);

        // Measure canvas, viewport overlap with headings and interactive controls
        const frameData = await page.evaluate((ratio) => {
          const canvas = document.querySelector('.global-3d-scene canvas');
          const canvasRect = canvas ? canvas.getBoundingClientRect() : null;
          
          // Headings and CTA buttons
          const texts = Array.from(document.querySelectorAll('h1, h2, h3, p, a.btn, button')).map(el => {
            const r = el.getBoundingClientRect();
            return {
              tag: el.tagName,
              text: el.textContent?.slice(0, 30)?.trim(),
              top: r.top,
              bottom: r.bottom,
              left: r.left,
              right: r.right,
              visible: r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight
            };
          }).filter(t => t.visible);

          return {
            ratio,
            canvasRect: canvasRect ? {
              width: canvasRect.width,
              height: canvasRect.height,
              top: canvasRect.top,
              left: canvasRect.left
            } : null,
            visibleTextsCount: texts.length,
            sampleTexts: texts.slice(0, 5)
          };
        }, step.ratio);

        auditData.push({
          viewport: vp.name,
          step: `${step.label}%`,
          targetY,
          ...frameData
        });
      }

      await context.close();
    }

    fs.writeFileSync(
      path.join(TARGET_DIR, 'auditoria_baseline_medicoes.json'),
      JSON.stringify(auditData, null, 2)
    );
    console.log('\n[Concluído] Todas as capturas de baseline e medições salvas com sucesso.');
  } finally {
    await browser.close();
    server.close();
  }
}

run().catch((err) => {
  console.error('Erro na captura do baseline:', err);
  process.exit(1);
});
