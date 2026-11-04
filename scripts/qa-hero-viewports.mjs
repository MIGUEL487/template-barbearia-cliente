import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';
import http from 'node:http';

const outDir = path.resolve('out');
const destDir = path.resolve('docs/redesign/evidencias/03-hero');
fs.mkdirSync(destDir, { recursive: true });

// Static server for the generated 'out' folder
const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';
  let filePath = path.join(outDir, reqPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }
  if (!fs.existsSync(filePath)) {
    res.statusCode = 404;
    return res.end('Not found');
  }
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
  };
  res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
  fs.createReadStream(filePath).pipe(res);
});

const PORT = 3459;

const viewports = [
  { name: 'hero_360', width: 360, height: 640, isMobile: true, maxHeader: 56 },
  { name: 'hero_390', width: 390, height: 844, isMobile: true, maxHeader: 56 },
  { name: 'hero_768', width: 768, height: 1024, isMobile: false, maxHeader: 64 },
  { name: 'hero_1280', width: 1280, height: 800, isMobile: false, maxHeader: 64 },
  { name: 'hero_1440', width: 1440, height: 900, isMobile: false, maxHeader: 64 },
];

async function runQA() {
  await new Promise(r => server.listen(PORT, r));
  console.log(`Servidor de teste rodando em http://localhost:${PORT}`);

  const browser = await chromium.launch({ headless: true });
  const report = [];

  for (const vp of viewports) {
    console.log(`\nTestando viewport ${vp.name} (${vp.width}x${vp.height})...`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
      isMobile: vp.isMobile,
      hasTouch: vp.isMobile,
    });
    const page = await context.newPage();

    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });

    // Wait for GSAP entrance animation to finish
    await page.waitForTimeout(800);

    // Make sure we are at top (scrollY === 0)
    await page.evaluate(() => window.scrollTo(0, 0));

    // Measure metrics at top
    const metricsAtTop = await page.evaluate((maxAllowedHeader) => {
      const header = document.querySelector('header');
      const headerRect = header ? header.getBoundingClientRect() : null;
      const logo = document.querySelector('.header-brand-logo');
      const logoRect = logo ? logo.getBoundingClientRect() : null;
      const body = document.body;
      const html = document.documentElement;

      const hasHorizontalOverflow = html.scrollWidth > window.innerWidth || body.scrollWidth > window.innerWidth;
      const headerBg = header ? window.getComputedStyle(header).backgroundColor : null;

      return {
        headerHeight: headerRect ? Math.round(headerRect.height) : 0,
        headerPasses: headerRect ? headerRect.height <= maxAllowedHeader : false,
        headerBg,
        logoHeight: logoRect ? Math.round(logoRect.height) : 0,
        logoPasses: logoRect ? logoRect.height <= 28 : false,
        hasHorizontalOverflow,
      };
    }, vp.maxHeader);

    // Take screenshot at TOP (Hero initial view)
    const screenshotPath = path.join(destDir, `${vp.name}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`Screenshot inicial salvo: ${screenshotPath}`);

    // Now test scrollability down 300px
    const scrollResult = await page.evaluate(() => {
      const initialScroll = window.scrollY;
      window.scrollBy(0, 300);
      const afterScroll = window.scrollY;
      return {
        initialScroll,
        afterScroll,
        scrollable: afterScroll > initialScroll,
      };
    });

    const result = {
      viewport: vp.name,
      dimensions: `${vp.width}x${vp.height}`,
      ...metricsAtTop,
      scrollTest: scrollResult,
    };
    report.push(result);
    console.log(`Resultados ${vp.name}:`, result);

    await context.close();
  }

  await browser.close();
  server.close();

  fs.writeFileSync(path.join(destDir, 'qa_hero_report.json'), JSON.stringify(report, null, 2), 'utf-8');
  console.log('\nRelatório de QA atualizado com sucesso em qa_hero_report.json!');
}

runQA().catch(err => {
  console.error('Erro no QA:', err);
  server.close();
});
