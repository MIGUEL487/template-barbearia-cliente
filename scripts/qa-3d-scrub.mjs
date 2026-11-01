import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';
import http from 'node:http';

const outDir = path.resolve('out');
const destDir = path.resolve('docs/redesign/evidencias/04-3d');
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

const PORT = 3460;

async function run3DQA() {
  await new Promise(r => server.listen(PORT, r));
  console.log(`Servidor rodando em http://localhost:${PORT}`);

  // 1. Teste Normal com WebGL habilitado
  console.log('\n--- 1. Testando Three.js WebGL e Scroll Scrub ---');
  const browser = await chromium.launch({
    headless: true,
    args: ['--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader'],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  console.log('Acessando /lab/3d...');
  await page.goto(`http://localhost:${PORT}/lab/3d/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Check if Canvas was initialized and WebGL context is active
  const canvasInfo = await page.evaluate(() => {
    const canvas = document.querySelector('#lab-3d-viewport canvas');
    if (!canvas) return null;
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    return {
      width: canvas.width,
      height: canvas.height,
      hasContext: !!gl,
    };
  });
  console.log('Canvas WebGL detectado:', canvasInfo);

  // Scrub points: 0%, 25%, 50%, 75%, 100%
  const scrubPoints = [
    { label: 'clipper_00', pct: 0 },
    { label: 'clipper_25', pct: 0.25 },
    { label: 'clipper_50', pct: 0.50 },
    { label: 'clipper_75', pct: 0.75 },
    { label: 'clipper_100', pct: 1.0 },
  ];

  const scrubResults = [];

  for (const sp of scrubPoints) {
    console.log(`Posicionando scrub em ${(sp.pct * 100).toFixed(0)}%...`);
    await page.evaluate((pct) => {
      const runway = document.querySelector('div[style*="250vh"]');
      if (runway) {
        const totalDistance = runway.scrollHeight - window.innerHeight;
        window.scrollTo({ top: totalDistance * pct, behavior: 'instant' });
      }
    }, sp.pct);

    // Give Three.js render loop a couple of frames to update rotation
    await page.waitForTimeout(400);

    const shotPath = path.join(destDir, `${sp.label}.png`);
    await page.screenshot({ path: shotPath, fullPage: false });
    console.log(`Screenshot capturado: ${shotPath}`);

    const progressValue = await page.evaluate(() => {
      return window.scrollY;
    });

    scrubResults.push({
      label: sp.label,
      targetPercent: `${(sp.pct * 100).toFixed(0)}%`,
      scrollY: progressValue,
    });
  }

  await context.close();
  await browser.close();

  // 2. Teste de Fallback Gracioso com WebGL desabilitado
  console.log('\n--- 2. Testando Fallback Gracioso (Sem WebGL) ---');
  const browserNoGL = await chromium.launch({
    headless: true,
    args: ['--disable-webgl', '--disable-webgl2'],
  });

  const contextNoGL = await browserNoGL.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const pageNoGL = await contextNoGL.newPage();
  await pageNoGL.goto(`http://localhost:${PORT}/lab/3d/`, { waitUntil: 'networkidle' });
  await pageNoGL.waitForTimeout(800);

  const fallbackInfo = await pageNoGL.evaluate(() => {
    const fallbackEl = document.querySelector('.hair-clipper-fallback');
    return {
      hasFallback: !!fallbackEl,
      text: fallbackEl ? fallbackEl.textContent.trim().slice(0, 100) : null,
    };
  });
  console.log('Fallback detectado:', fallbackInfo);

  const fallbackShot = path.join(destDir, 'clipper_fallback.png');
  await pageNoGL.screenshot({ path: fallbackShot, fullPage: false });
  console.log(`Screenshot do fallback salvo: ${fallbackShot}`);

  await contextNoGL.close();
  await browserNoGL.close();
  server.close();

  const finalReport = {
    webglCanvas: canvasInfo,
    scrubTests: scrubResults,
    fallbackTest: fallbackInfo,
    timestamp: new Date().toISOString(),
  };

  fs.writeFileSync(path.join(destDir, 'qa_3d_report.json'), JSON.stringify(finalReport, null, 2), 'utf-8');
  console.log('\nRelatório 3D salvo com sucesso em qa_3d_report.json!');
}

run3DQA().catch(err => {
  console.error('Erro no QA 3D:', err);
  server.close();
});
