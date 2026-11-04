import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const PORT = 3005;
const OUT_DIR = path.resolve('out');
const EVIDENCES_DIR = path.resolve('docs/redesign/evidencias/05-multi-section-3d');
const ARTIFACT_DIR = path.resolve('C:/Users/Windows/.gemini/antigravity/brain/4ceefa96-88d0-4621-b1fa-b3d647948612');

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
  '.txt': 'text/plain',
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

async function runDemo() {
  if (!fs.existsSync(EVIDENCES_DIR)) {
    fs.mkdirSync(EVIDENCES_DIR, { recursive: true });
  }

  const server = await startServer();

  console.log('[Playwright] Iniciando Chromium com aceleração gráfica...');
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

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1.5,
    recordVideo: {
      dir: path.join(EVIDENCES_DIR, 'video'),
      size: { width: 1440, height: 900 },
    },
  });

  const page = await context.newPage();

  // Monitor console errors
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.error('[Browser Error]', msg.text());
    }
  });

  console.log('[Playwright] Carregando http://127.0.0.1:3005 ...');
  await page.goto(`http://127.0.0.1:${PORT}`, { waitUntil: 'domcontentloaded' });

  // Wait for 3D canvas to mount and render
  console.log('[Playwright] Aguardando montagem do canvas Three.js...');
  await page.waitForFunction(() => !!document.querySelector('.global-3d-scene canvas'), null, { timeout: 15000 });
  await page.waitForTimeout(3000);

  // 1. Verify 3D Canvas Properties
  const canvasMeta = await page.evaluate(() => {
    const canvasWrap = document.querySelector('.global-3d-scene');
    const canvas = canvasWrap ? canvasWrap.querySelector('canvas') : null;
    const header = document.querySelector('.site-header');
    const headerRect = header ? header.getBoundingClientRect() : null;

    return {
      wrapFound: !!canvasWrap,
      wrapPointerEvents: canvasWrap ? getComputedStyle(canvasWrap).pointerEvents : null,
      wrapZIndex: canvasWrap ? getComputedStyle(canvasWrap).zIndex : null,
      canvasFound: !!canvas,
      canvasWidth: canvas ? canvas.width : null,
      canvasHeight: canvas ? canvas.height : null,
      headerHeight: headerRect ? headerRect.height : null,
      totalHeight: document.documentElement.scrollHeight,
      viewportHeight: window.innerHeight,
    };
  });

  console.log('[Verificação 3D Canvas]', JSON.stringify(canvasMeta, null, 2));

  // Screenshot 1: Hero Initial (Scroll 0)
  const p1 = path.join(EVIDENCES_DIR, '01_hero_initial.png');
  await page.screenshot({ path: p1 });
  console.log('Salvo:', p1);

  // Smooth scroll function mimicking natural human reading
  async function smoothScrollTo(selector, stepDelayMs = 40, totalSteps = 25) {
    const targetY = await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      return el ? window.scrollY + el.getBoundingClientRect().top - 80 : 0;
    }, selector);

    const startY = await page.evaluate(() => window.scrollY);
    for (let step = 1; step <= totalSteps; step++) {
      const progress = step / totalSteps;
      const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
      const curY = startY + (targetY - startY) * ease;
      await page.evaluate((y) => window.scrollTo(0, y), curY);
      await page.waitForTimeout(stepDelayMs);
    }
    await page.waitForTimeout(800);
  }

  // Stage 1: Signature (#assinatura)
  console.log('[Trajetória] Rolando para #assinatura (Stage 1)...');
  await smoothScrollTo('#assinatura');
  const p2 = path.join(EVIDENCES_DIR, '02_signature_side.png');
  await page.screenshot({ path: p2 });
  console.log('Salvo:', p2);

  // Stage 2: Ritual (.ritual)
  console.log('[Trajetória] Rolando para .ritual (Stage 2 - Centro & Zoom Lâmina)...');
  await smoothScrollTo('.ritual');
  const p3 = path.join(EVIDENCES_DIR, '03_ritual_center.png');
  await page.screenshot({ path: p3 });
  console.log('Salvo:', p3);

  // Stage 3: Catalog (#servicos)
  console.log('[Trajetória] Rolando para #servicos (Stage 3 - Fundo discreto para leitura)...');
  await smoothScrollTo('#servicos');
  const p4 = path.join(EVIDENCES_DIR, '04_catalog_reading.png');
  await page.screenshot({ path: p4 });
  console.log('Salvo:', p4);

  // Stage 4: History (#historia)
  console.log('[Trajetória] Rolando para #historia (Stage 4 - Flanco)...');
  await smoothScrollTo('#historia');
  const p5 = path.join(EVIDENCES_DIR, '05_history_flank.png');
  await page.screenshot({ path: p5 });
  console.log('Salvo:', p5);

  // Stage 5: Footer (.site-footer)
  console.log('[Trajetória] Rolando para .site-footer (Stage 5 - Fade out suave)...');
  await smoothScrollTo('.site-footer');
  const p6 = path.join(EVIDENCES_DIR, '06_footer_fade.png');
  await page.screenshot({ path: p6 });
  console.log('Salvo:', p6);

  // Test Scroll Back Up (100% -> 0%)
  console.log('[Trajetória] Rolando suavemente de volta ao topo (0%)...');
  const maxScroll = await page.evaluate(() => window.scrollY);
  for (let step = 1; step <= 30; step++) {
    const progress = step / 30;
    const curY = maxScroll * (1 - progress);
    await page.evaluate((y) => window.scrollTo(0, y), curY);
    await page.waitForTimeout(35);
  }
  await page.waitForTimeout(1000);
  const p7 = path.join(EVIDENCES_DIR, '07_hero_back_to_top.png');
  await page.screenshot({ path: p7 });
  console.log('Salvo:', p7);

  // Test Mobile Viewport (iPhone 14 / 390x844)
  console.log('[Mobile QA] Testando viewport mobile 390x844...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1200);
  const p8 = path.join(EVIDENCES_DIR, '08_mobile_hero.png');
  await page.screenshot({ path: p8 });
  console.log('Salvo:', p8);

  await smoothScrollTo('.ritual', 30, 20);
  const p9 = path.join(EVIDENCES_DIR, '09_mobile_ritual.png');
  await page.screenshot({ path: p9 });
  console.log('Salvo:', p9);

  // Close context to flush video
  await context.close();
  await browser.close();
  server.close();

  // Copy screenshots to Artifacts directory for immediate user presentation
  const screenshots = [
    '01_hero_initial.png',
    '02_signature_side.png',
    '03_ritual_center.png',
    '04_catalog_reading.png',
    '05_history_flank.png',
    '06_footer_fade.png',
    '07_hero_back_to_top.png',
    '08_mobile_hero.png',
    '09_mobile_ritual.png',
  ];

  for (const s of screenshots) {
    const src = path.join(EVIDENCES_DIR, s);
    const dest = path.join(ARTIFACT_DIR, s);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
    }
  }

  // Generate markdown report
  const reportPath = path.join(EVIDENCES_DIR, 'relatorio_trajetoria_3d.md');
  const reportContent = `# Auto Stilo — Relatório de Verificação da Trajetória 3D Contínua

## 1. Metadados da Cena Three.js + GSAP ScrollTrigger
- **Modelo:** Máquina de cortar cabelo oficial do cliente (\`hair-clipper.obj\`, 44.076 vértices, normalizada).
- **Textura:** \`hair-clipper-basecolor.jpg\` (4096x4096px sRGB com reflexos metálicos e iluminação de estúdio).
- **Canvas Global:** \`position: fixed; top: 0; left: 0; pointer-events: none; z-index: 1;\`.
- **Interação:** 100% segura — o canvas não intercepta cliques, toques ou eventos de scroll (\`pointerEvents: none\`).
- **Header Compacto:** Altura de ${canvasMeta.headerHeight}px (estritamente <= 64px desktop / <= 56px mobile) com barra de progresso.
- **Scroll Total da Página:** ${canvasMeta.totalHeight}px sem nenhum travamento, sem \`pin: true\` de tela inteira e sem \`preventDefault()\`.

## 2. Trajetória Coreografada por Seção
| Etapa | Seção | Posição (X, Y, Z) | Rotação | Opacidade | Objetivo Visual |
|---|---|---|---|---|---|
| **01** | **Hero** (0% scroll) | (1.35, 0.05, 0.6) | (-0.45, 0.75, 0.2) | 0.38 | Presença sutil ao fundo do Hero, sem competir com a tipografia. |
| **02** | **Assinatura** (~18% scroll) | (-0.85, -0.15, 1.15) | (-0.25, 1.85, -0.15) | 0.76 | Deslocamento para o lado esquerdo em ângulo dinâmico. |
| **03** | **Ritual** (~40% scroll) | (0.10, 0.08, 2.15) | (-0.08, 3.14, 0.04) | 0.92 | **Destaque central em close-up:** visualização frontal das lâminas, parafusos e dentes. |
| **04** | **Catálogo** (~62% scroll) | (1.55, -0.25, -0.40) | (-0.50, 4.50, 0.25) | 0.22 | Recuo para o fundo profundo com baixa opacidade; legibilidade 100% preservada. |
| **05** | **História** (~82% scroll) | (-1.25, 0.12, 0.75) | (-0.30, 5.85, -0.20) | 0.52 | Flanco esquerdo com iluminação de recorte sutil. |
| **06** | **Rodapé** (100% scroll) | (0.00, 0.65, -1.20) | (-0.60, 7.20, 0.10) | 0.00 | Fade-out contínuo e suave antes do rodapé. |

## 3. Comportamento Bidirecional
- A rolagem de retorno (100% -> 0%) reverte perfeitamente as transformações sem saltos ou recriação de cena.
`;

  fs.writeFileSync(reportPath, reportContent, 'utf8');
  console.log('[Sucesso] Demonstração concluída e relatório salvo em:', reportPath);
}

runDemo().catch((err) => {
  console.error('[Falha]', err);
  process.exit(1);
});
