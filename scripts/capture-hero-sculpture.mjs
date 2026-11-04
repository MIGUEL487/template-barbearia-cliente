import { chromium } from 'playwright';
import http from 'http';
import fs from 'fs';
import path from 'path';

const OUT_DIR = path.resolve('./out');
const LOCAL_PORT = 3355;
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
      resolve(server);
    });
  });
}

async function test() {
  const server = await createStaticServer();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  try {
    await page.goto(`http://localhost:${LOCAL_PORT}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2500);

    // Initial hero shot
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'qa_creative_hero_initial.png') });

    // Reveal hero copy and Three.js sculpture frame
    await page.evaluate(() => {
      const el = document.querySelector('.hero-copy');
      if (el) {
        el.style.opacity = '1';
        Array.from(el.children).forEach((c) => {
          c.style.opacity = '1';
          c.style.transform = 'none';
        });
      }
      const shade = document.querySelector('.shade');
      if (shade) shade.style.opacity = '1';
    });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'qa_creative_hero_sculpture.png') });

    // Scroll to catalog services
    await page.evaluate(() => {
      const s = document.querySelector('#servicos');
      if (s) s.scrollIntoView();
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'qa_creative_catalog.png') });

    console.log('Saved hero initial, hero sculpture, and catalog screenshots!');
  } finally {
    await browser.close();
    server.close();
  }
}

test().catch(console.error);
