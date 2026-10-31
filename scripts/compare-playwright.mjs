import { chromium } from 'playwright';
import http from 'http';
import fs from 'fs';
import path from 'path';

const OUT_DIR = path.resolve('./out');
const LIVE_URL = 'https://template-barbearia-cliente.mi-c-openheimer.workers.dev';
const LOCAL_PORT = 3333;
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
    '.mp4': 'video/mp4'
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
        'Content-Length': stat.size
      });
      fs.createReadStream(filePath).pipe(res);
    } catch (e) {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  return new Promise((resolve) => {
    server.listen(LOCAL_PORT, () => {
      console.log(`Local static server listening at http://localhost:${LOCAL_PORT}`);
      resolve(server);
    });
  });
}

async function run() {
  const server = await createStaticServer();

  console.log('Launching Chromium...');
  const browser = await chromium.launch({ headless: true });
  
  const report = {};

  try {
    // --- 1. Check Live URL ---
    console.log(`Navigating to Live URL: ${LIVE_URL}`);
    const contextLive = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const pageLive = await contextLive.newPage();
    
    let swRegisteredLive = false;
    pageLive.on('request', req => {
      if (req.url().includes('sw.js') || req.url().includes('service-worker')) {
        swRegisteredLive = true;
      }
    });

    await pageLive.goto(LIVE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    
    const liveScreenshot = path.join(ARTIFACTS_DIR, 'screenshot_live_desktop.png');
    await pageLive.screenshot({ path: liveScreenshot, fullPage: false });
    console.log(`Live screenshot saved: ${liveScreenshot}`);

    report.live = await pageLive.evaluate(() => {
      const body = document.body;
      const heroH1 = document.querySelector('h1')?.innerText?.trim();
      const heroP = document.querySelector('.hero p')?.innerText?.trim();
      const computedBody = window.getComputedStyle(body);
      const marquee = document.querySelector('.marquee-track') || document.querySelector('[class*="marquee"]');
      const ctaBtn = document.querySelector('.cta, [class*="cta"]');
      const ctaComputed = ctaBtn ? window.getComputedStyle(ctaBtn) : null;
      
      return {
        title: document.title,
        h1: heroH1,
        heroSnippet: heroP?.slice(0, 80),
        bodyBg: computedBody.backgroundColor,
        bodyColor: computedBody.color,
        hasMarquee: !!marquee,
        ctaBg: ctaComputed ? ctaComputed.backgroundColor : null,
        ctaRadius: ctaComputed ? ctaComputed.borderRadius : null,
        serviceWorker: 'serviceWorker' in navigator && !!navigator.serviceWorker.controller
      };
    });
    report.live.swRequested = swRegisteredLive;
    await contextLive.close();

    // --- 2. Check Local URL ---
    console.log(`Navigating to Local URL: http://localhost:${LOCAL_PORT}`);
    const contextLocal = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const pageLocal = await contextLocal.newPage();

    await pageLocal.goto(`http://localhost:${LOCAL_PORT}`, { waitUntil: 'networkidle', timeout: 30000 });
    
    const localScreenshot = path.join(ARTIFACTS_DIR, 'screenshot_local_desktop.png');
    await pageLocal.screenshot({ path: localScreenshot, fullPage: false });
    console.log(`Local screenshot saved: ${localScreenshot}`);

    report.local = await pageLocal.evaluate(() => {
      const body = document.body;
      const heroH1 = document.querySelector('h1')?.innerText?.trim();
      const heroP = document.querySelector('.hero p')?.innerText?.trim();
      const computedBody = window.getComputedStyle(body);
      const marquee = document.querySelector('.marquee-track') || document.querySelector('[class*="marquee"]');
      const ctaBtn = document.querySelector('.cta, [class*="cta"]');
      const ctaComputed = ctaBtn ? window.getComputedStyle(ctaBtn) : null;

      return {
        title: document.title,
        h1: heroH1,
        heroSnippet: heroP?.slice(0, 80),
        bodyBg: computedBody.backgroundColor,
        bodyColor: computedBody.color,
        hasMarquee: !!marquee,
        ctaBg: ctaComputed ? ctaComputed.backgroundColor : null,
        ctaRadius: ctaComputed ? ctaComputed.borderRadius : null,
        serviceWorker: 'serviceWorker' in navigator && !!navigator.serviceWorker.controller
      };
    });
    await contextLocal.close();

    // --- 3. Mobile Viewport Comparison ---
    const contextMobileLive = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const pageMobileLive = await contextMobileLive.newPage();
    await pageMobileLive.goto(LIVE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await pageMobileLive.screenshot({ path: path.join(ARTIFACTS_DIR, 'screenshot_live_mobile.png'), fullPage: false });
    await contextMobileLive.close();

    const contextMobileLocal = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const pageMobileLocal = await contextMobileLocal.newPage();
    await pageMobileLocal.goto(`http://localhost:${LOCAL_PORT}`, { waitUntil: 'networkidle', timeout: 30000 });
    await pageMobileLocal.screenshot({ path: path.join(ARTIFACTS_DIR, 'screenshot_local_mobile.png'), fullPage: false });
    await contextMobileLocal.close();

    console.log('\n================ PLAYWRIGHT COMPARISON REPORT ================');
    console.log(JSON.stringify(report, null, 2));

  } finally {
    await browser.close();
    server.close();
  }
}

run().catch(console.error);
