import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';
import http from 'node:http';

const repoRoot = path.resolve('.');
const outDir = path.resolve('docs/redesign/evidencias');
fs.mkdirSync(outDir, { recursive: true });

// Server to serve fonts and assets
const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/specimen.html';
  const filePath = path.join(repoRoot, reqPath);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.statusCode = 404;
    return res.end('Not found');
  }
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
  };
  res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
  fs.createReadStream(filePath).pipe(res);
});

const PORT = 3458;

async function run() {
  await new Promise(r => server.listen(PORT, r));

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="utf-8">
      <title>Auto Stilo — Tipografia & Design System Specimen</title>
      <style>
        @font-face {
          font-family: 'Fraunces';
          src: url('/src/app/fonts/fraunces-latin-400-normal.woff2') format('woff2');
          font-weight: 400;
          font-style: normal;
        }
        @font-face {
          font-family: 'Fraunces';
          src: url('/src/app/fonts/fraunces-latin-500-normal.woff2') format('woff2');
          font-weight: 500;
          font-style: normal;
        }
        @font-face {
          font-family: 'Fraunces';
          src: url('/src/app/fonts/fraunces-latin-400-italic.woff2') format('woff2');
          font-weight: 400;
          font-style: italic;
        }
        @font-face {
          font-family: 'Manrope';
          src: url('/src/app/fonts/Manrope-400.ttf') format('truetype');
          font-weight: 400;
          font-style: normal;
        }

        :root {
          --bg: #FFFFFF;
          --bg-soft: #FBFAF8;
          --surface: #F6F5F8;
          --text: #0A0A0C;
          --text-secondary: #4A4A52;
          --text-muted: #7A7A85;
          --accent: #7C3AED;
          --accent-hover: #6D28D9;
          --border: rgba(10, 10, 12, 0.08);
          --radius-subtle: 2px;
        }

        body {
          margin: 0;
          padding: 48px;
          background: var(--bg);
          color: var(--text);
          font-family: 'Manrope', system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .header-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border);
          padding-bottom: 24px;
          margin-bottom: 48px;
        }

        .brand-logo {
          height: 28px;
          width: auto;
        }

        .tag {
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--accent);
          font-weight: 600;
        }

        .grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 64px;
        }

        h1.display {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 64px;
          line-height: 1.08;
          font-weight: 400;
          letter-spacing: -0.03em;
          margin: 0 0 16px;
        }

        h1.display em {
          font-style: italic;
          color: var(--accent);
        }

        p.lead {
          font-size: 18px;
          line-height: 1.6;
          color: var(--text-secondary);
          margin: 0 0 32px;
          max-width: 540px;
        }

        .actions {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .btn-primary {
          background: var(--text);
          color: #FFFFFF;
          padding: 12px 24px;
          border-radius: var(--radius-subtle);
          font-size: 14px;
          font-weight: 500;
          border: none;
          letter-spacing: 0.02em;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-outline {
          background: transparent;
          color: var(--text);
          padding: 12px 24px;
          border-radius: var(--radius-subtle);
          font-size: 14px;
          font-weight: 500;
          border: 1px solid var(--border);
        }

        .card {
          background: var(--bg-soft);
          border: 1px solid var(--border);
          padding: 32px;
          border-radius: 4px;
        }

        .card-title {
          font-family: 'Fraunces', serif;
          font-size: 24px;
          font-weight: 400;
          margin: 0 0 16px;
        }

        .tokens-spec {
          margin-top: 48px;
          border-top: 1px solid var(--border);
          padding-top: 32px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        .token-item {
          padding: 16px;
          background: var(--surface);
          border-radius: 4px;
        }

        .token-label {
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }

        .token-swatch {
          height: 36px;
          border-radius: 2px;
          margin-bottom: 8px;
          border: 1px solid rgba(0,0,0,0.06);
        }

        .token-val {
          font-size: 12px;
          font-family: monospace;
          color: var(--text);
        }
      </style>
    </head>
    <body>
      <div class="header-meta">
        <img class="brand-logo" src="/public/brand/auto-stilo/logo-on-light.png" alt="Auto Stilo" />
        <span class="tag">Studio 3D Design Tokens · Tema Claro</span>
      </div>

      <div class="grid">
        <div>
          <div class="tag" style="margin-bottom: 12px;">Barbearia em Monte Sião, MG</div>
          <h1 class="display">Seu estilo. Sua <em>assinatura</em>. Precisão em cada detalhe.</h1>
          <p class="lead">Experiência autoral com acabamento de alta costura, corte sob medida e respeito absoluto ao seu tempo.</p>
          <div class="actions">
            <button class="btn-primary">Agendar Horário &rarr;</button>
            <button class="btn-outline">Conhecer Serviços</button>
          </div>
        </div>

        <div>
          <div class="card">
            <div class="tag" style="margin-bottom: 8px;">01 · Entender</div>
            <h3 class="card-title">Antes da navalha, uma conversa.</h3>
            <p style="font-size: 14px; color: var(--text-secondary); line-height: 1.6; margin: 0;">
              Seu estilo, sua rotina e a textura do seu cabelo orientam a escolha do corte ideal. Atendimento com tempo reservado para fazer bem feito.
            </p>
          </div>
        </div>
      </div>

      <div class="tokens-spec">
        <div class="token-item">
          <div class="token-label">Fundo Primário</div>
          <div class="token-swatch" style="background: #FFFFFF;"></div>
          <div class="token-val">#FFFFFF (100% Branco)</div>
        </div>
        <div class="token-item">
          <div class="token-label">Texto / Ink</div>
          <div class="token-swatch" style="background: #0A0A0C;"></div>
          <div class="token-val">#0A0A0C (Preto Grafite)</div>
        </div>
        <div class="token-item">
          <div class="token-label">Acento Auto Stilo</div>
          <div class="token-swatch" style="background: #7C3AED;"></div>
          <div class="token-val">#7C3AED (Violeta Marca &le;8%)</div>
        </div>
        <div class="token-item">
          <div class="token-label">Bordas / Linha Navalha</div>
          <div class="token-swatch" style="background: rgba(10,10,12,0.08);"></div>
          <div class="token-val">1px rgba(10,10,12,0.08)</div>
        </div>
      </div>
    </body>
    </html>
  `;

  fs.writeFileSync(path.join(repoRoot, 'specimen.html'), html, 'utf-8');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 800 }, deviceScaleFactor: 2 });
  await page.goto(`http://localhost:${PORT}/specimen.html`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(outDir, '02-tipografia.png') });
  console.log('Evidência 02-tipografia.png salva com sucesso!');

  await browser.close();
  server.close();
  fs.unlinkSync(path.join(repoRoot, 'specimen.html'));
}

run().catch(err => {
  console.error(err);
  server.close();
});
