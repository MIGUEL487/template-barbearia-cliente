import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const ROOT_DIR = 'C:\\Users\\Windows\\.gemini\\antigravity\\scratch\\barbearia-template\\template-barbearia-cliente';
const OUT_DIR = path.join(ROOT_DIR, 'out');
const SCREENSHOTS_DIR = path.join(ROOT_DIR, 'docs/recuperacao-branco/screenshots');

fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

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
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
};

const server = http.createServer((req, res) => {
  let reqPath = req.url ? req.url.split('?')[0] : '/';
  let filePath = path.join(OUT_DIR, reqPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  } else if (!fs.existsSync(filePath)) {
    if (fs.existsSync(path.join(filePath, 'index.html'))) {
      filePath = path.join(filePath, 'index.html');
    } else if (fs.existsSync(filePath + '.html')) {
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

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const PORT = server.address().port;
console.log(`[Static Server] Rodando em http://127.0.0.1:${PORT}`);

const browser = await chromium.launch({
  headless: true,
  args: ['--no-sandbox'],
});

const report = {
  timestamp: new Date().toISOString(),
  pages: {},
  visualChecks: {},
};

try {
  // 1. Home Desktop (1440x900)
  console.log('\n--- Testando Home Desktop (1440x900) ---');
  const contextDesktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const pageDesktop = await contextDesktop.newPage();
  const consoleErrors = [];
  pageDesktop.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await pageDesktop.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle' });
  await pageDesktop.waitForTimeout(500);

  const heroScreenshot = path.join(SCREENSHOTS_DIR, '01-home-desktop-hero.png');
  await pageDesktop.screenshot({ path: heroScreenshot, fullPage: false });
  console.log(`[Screenshot] Hero desktop salvo em: ${heroScreenshot}`);

  const fullHomeScreenshot = path.join(SCREENSHOTS_DIR, '02-home-desktop-full.png');
  await pageDesktop.screenshot({ path: fullHomeScreenshot, fullPage: true });
  console.log(`[Screenshot] Home fullpage desktop salvo em: ${fullHomeScreenshot}`);

  const desktopInfo = await pageDesktop.evaluate(() => {
    const bodyStyle = window.getComputedStyle(document.body);
    const htmlStyle = window.getComputedStyle(document.documentElement);
    const heroH1 = document.querySelector('h1')?.textContent?.trim();
    const heroP = document.querySelector('.hero-copy p')?.textContent?.trim();
    const has3D = !!window.__AS3D__ || !!document.querySelector('canvas[data-engine]');
    const header = document.querySelector('.site-header');
    const headerHeight = header ? Math.round(header.getBoundingClientRect().height) : 0;
    const navLinks = Array.from(document.querySelectorAll('.site-nav a')).map(a => a.textContent?.trim());

    return {
      bodyBg: bodyStyle.backgroundColor,
      bodyColor: bodyStyle.color,
      colorScheme: htmlStyle.colorScheme,
      heroH1,
      heroP,
      has3D,
      headerHeight,
      navLinks,
    };
  });

  report.pages.homeDesktop = desktopInfo;
  console.log('Dados Home Desktop:', JSON.stringify(desktopInfo, null, 2));

  // 2. Home Mobile (390x844)
  console.log('\n--- Testando Home Mobile (390x844) ---');
  const contextMobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const pageMobile = await contextMobile.newPage();
  await pageMobile.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle' });
  await pageMobile.waitForTimeout(500);

  const mobileHeroScreenshot = path.join(SCREENSHOTS_DIR, '03-home-mobile-hero.png');
  await pageMobile.screenshot({ path: mobileHeroScreenshot, fullPage: false });
  console.log(`[Screenshot] Hero mobile salvo em: ${mobileHeroScreenshot}`);

  const mobileFullScreenshot = path.join(SCREENSHOTS_DIR, '04-home-mobile-full.png');
  await pageMobile.screenshot({ path: mobileFullScreenshot, fullPage: true });
  console.log(`[Screenshot] Home fullpage mobile salvo em: ${mobileFullScreenshot}`);

  const mobileInfo = await pageMobile.evaluate(() => {
    const heroH1 = document.querySelector('h1')?.textContent?.trim();
    const mobileActions = !!document.querySelector('.mobile-actions');
    const menuToggle = !!document.querySelector('.menu-toggle');
    return { heroH1, mobileActions, menuToggle };
  });
  report.pages.homeMobile = mobileInfo;
  console.log('Dados Home Mobile:', JSON.stringify(mobileInfo, null, 2));

  // 3. /agendar Desktop (1440x900)
  console.log('\n--- Testando /agendar Desktop (1440x900) ---');
  const pageAgendar = await contextDesktop.newPage();
  await pageAgendar.goto(`http://127.0.0.1:${PORT}/agendar`, { waitUntil: 'networkidle' });
  await pageAgendar.waitForTimeout(500);

  const agendarScreenshot = path.join(SCREENSHOTS_DIR, '05-agendar-desktop.png');
  await pageAgendar.screenshot({ path: agendarScreenshot, fullPage: true });
  console.log(`[Screenshot] /agendar desktop salvo em: ${agendarScreenshot}`);

  const agendarInfo = await pageAgendar.evaluate(() => {
    const shell = document.querySelector('.booking-shell') || document.querySelector('main');
    const h1 = document.querySelector('h1')?.textContent?.trim();
    const cta = document.querySelector('button, .cta');
    const ctaStyle = cta ? window.getComputedStyle(cta) : null;
    return {
      hasBookingShell: !!shell,
      title: h1,
      ctaRadius: ctaStyle ? ctaStyle.borderRadius : null,
      ctaBg: ctaStyle ? ctaStyle.backgroundColor : null,
    };
  });
  report.pages.agendarDesktop = agendarInfo;
  console.log('Dados /agendar:', JSON.stringify(agendarInfo, null, 2));

  // 4. /meu-agendamento Desktop (1440x900)
  console.log('\n--- Testando /meu-agendamento Desktop ---');
  const pageGestao = await contextDesktop.newPage();
  await pageGestao.goto(`http://127.0.0.1:${PORT}/meu-agendamento`, { waitUntil: 'networkidle' });
  await pageGestao.waitForTimeout(500);

  const gestaoScreenshot = path.join(SCREENSHOTS_DIR, '06-meu-agendamento-desktop.png');
  await pageGestao.screenshot({ path: gestaoScreenshot, fullPage: false });
  console.log(`[Screenshot] /meu-agendamento salvo em: ${gestaoScreenshot}`);

  // Visual Assertions
  const isWhiteBg = desktopInfo.bodyBg.includes('255, 255, 255') || desktopInfo.bodyBg.includes('246, 245, 248');
  const hasNo3D = !desktopInfo.has3D;
  const isOriginalHero = desktopInfo.heroH1?.includes('Seu estilo') || desktopInfo.heroP?.includes('BARBEARIA');
  const isCompactHeader = desktopInfo.headerHeight > 0 && desktopInfo.headerHeight <= 80;

  report.visualChecks = {
    fundoPredominantementeBranco: { ok: isWhiteBg, value: desktopInfo.bodyBg },
    sem3DResidual: { ok: hasNo3D },
    heroOriginalAprovado: { ok: isOriginalHero, h1: desktopInfo.heroH1 },
    headerCompacto: { ok: isCompactHeader, height: desktopInfo.headerHeight },
    saasAgendamentoAtivo: { ok: agendarInfo.hasBookingShell },
    consoleErrors: { ok: consoleErrors.length === 0, count: consoleErrors.length, errors: consoleErrors },
  };

  console.log('\n================ RESULTADO DA VERIFICAÇÃO VISUAL ================');
  console.log(JSON.stringify(report.visualChecks, null, 2));

  fs.writeFileSync(
    path.join(ROOT_DIR, 'docs/recuperacao-branco/relatorio-verificacao.json'),
    JSON.stringify(report, null, 2),
    'utf8'
  );

  await contextDesktop.close();
  await contextMobile.close();
} finally {
  await browser.close();
  server.close();
}
