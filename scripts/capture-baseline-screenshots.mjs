import { chromium } from 'playwright';
import http from 'http';
import fs from 'fs';
import path from 'path';

const OUT_DIR = path.resolve('./out');
const LOCAL_PORT = 3366;
const TARGET_DIR = path.resolve('docs/redesign/evidencias/00-antes');

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
    let filePath = path.join(OUT_DIR, reqPath);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    } else if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
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
      resolve(server);
    });
  });
}

async function run() {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
  const server = await createStaticServer();
  const browser = await chromium.launch({ headless: true });

  const routes = [
    { path: '/', name: 'home' },
    { path: '/agendar', name: 'agendar' },
    { path: '/meu-agendamento', name: 'meu-agendamento' },
  ];

  const viewports = [
    { width: 1440, height: 900, name: '1440' },
    { width: 390, height: 844, name: '390' },
  ];

  try {
    for (const r of routes) {
      for (const vp of viewports) {
        console.log(`Capturing ${r.name} at ${vp.name}...`);
        const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
        const page = await context.newPage();
        await page.goto(`http://localhost:${LOCAL_PORT}${r.path}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(1500);

        const filename = `${r.name}_${vp.name}.png`;
        const outPath = path.join(TARGET_DIR, filename);
        await page.screenshot({ path: outPath, fullPage: false });
        console.log(`Saved: ${outPath}`);
        await context.close();
      }
    }
  } finally {
    await browser.close();
    server.close();
  }
}

run().catch((err) => {
  console.error('Error capturing baseline screenshots:', err);
  process.exit(1);
});
