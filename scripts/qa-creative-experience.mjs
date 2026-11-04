import { chromium } from 'playwright';
import http from 'http';
import fs from 'fs';
import path from 'path';

const OUT_DIR = path.resolve('./out');
const LOCAL_PORT = 3344;
const ARTIFACTS_DIR = 'C:/Users/Windows/.gemini/antigravity/brain/4ceefa96-88d0-4621-b1fa-b3d647948612';

function createStaticServer() {
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.mp4': 'video/mp4',
  };

  const server = http.createServer((req, res) => {
    let reqPath = decodeURI(req.url.split('?')[0]);
    if (reqPath.endsWith('/')) reqPath += 'index.html';
    let filePath = path.join(OUT_DIR, reqPath);
    if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
      filePath += '.html';
    }
    if (!fs.existsSync(filePath)) {
      filePath = path.join(OUT_DIR, '404.html');
    }

    try {
      const ext = path.extname(filePath);
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      const stat = fs.statSync(filePath);
      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': stat.size,
      });
      fs.createReadStream(filePath).pipe(res);
    } catch {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  return new Promise((resolve) => {
    server.listen(LOCAL_PORT, () => {
      console.log(`Local test server listening at http://localhost:${LOCAL_PORT}`);
      resolve(server);
    });
  });
}

async function run() {
  const server = await createStaticServer();
  const browser = await chromium.launch({ headless: true });

  const viewports = [
    { name: 'desktop-1440', width: 1440, height: 900 },
    { name: 'notebook-1280', width: 1280, height: 800 },
    { name: 'tablet-768', width: 768, height: 1024 },
    { name: 'mobile-390', width: 390, height: 844 },
    { name: 'mobile-360', width: 360, height: 740 },
  ];

  const report = {
    viewports: {},
    reducedMotion: false,
    threeJsActive: false,
    lenisAvailable: false,
    errors: [],
  };

  try {
    for (const vp of viewports) {
      console.log(`Auditing viewport: ${vp.name} (${vp.width}x${vp.height})...`);
      const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const page = await context.newPage();

      page.on('pageerror', (err) => report.errors.push(`[${vp.name}] ${err.message}`));

      await page.goto(`http://localhost:${LOCAL_PORT}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(1500);

      // Check skip button and advance
      const skip = page.locator('a.hero-skip-intro');
      if ((await skip.count()) > 0) {
        await skip.click({ force: true });
        await page.waitForTimeout(1000);
      }

      const shotPath = path.join(ARTIFACTS_DIR, `qa_creative_${vp.name}.png`);
      await page.screenshot({ path: shotPath, fullPage: false });

      const metrics = await page.evaluate(() => {
        const bodyStyle = window.getComputedStyle(document.body);
        const sculpture = document.querySelector('.brand-sculpture-canvas canvas');
        const services = document.querySelectorAll('.service-card-item');
        const marquee = document.querySelector('.marquee-track');

        return {
          bodyBg: bodyStyle.backgroundColor,
          bodyColor: bodyStyle.color,
          hasThreeCanvas: !!sculpture,
          serviceCount: services.length,
          hasMarquee: !!marquee,
          hasLenis: !!window.__lenis,
        };
      });

      report.viewports[vp.name] = metrics;
      if (metrics.hasThreeCanvas) report.threeJsActive = true;
      if (metrics.hasLenis) report.lenisAvailable = true;

      await context.close();
    }

    // Test with prefers-reduced-motion
    console.log('Auditing prefers-reduced-motion scenario...');
    const contextReduced = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: 'reduce',
    });
    const pageReduced = await contextReduced.newPage();
    await pageReduced.goto(`http://localhost:${LOCAL_PORT}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await pageReduced.waitForTimeout(1000);

    const reducedMetrics = await pageReduced.evaluate(() => {
      return {
        lenisInitialized: !!window.__lenis,
        fallbackVisible: !!document.querySelector('.sculpture-fallback, .brand-sculpture-canvas'),
      };
    });
    report.reducedMotion = reducedMetrics;
    await contextReduced.close();

    console.log('\n================ QA CREATIVE EXPERIENCE REPORT ================');
    console.log(JSON.stringify(report, null, 2));
    console.log('===============================================================\n');
  } finally {
    await browser.close();
    server.close();
  }
}

run().catch((err) => {
  console.error('QA script error:', err);
  process.exit(1);
});
