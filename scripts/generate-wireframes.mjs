import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';

const TARGET_DIR = path.resolve('docs/redesign3d/evidencias/01-contraste');
fs.mkdirSync(TARGET_DIR, { recursive: true });

// HTML template for 1440px desktop wireframe
const htmlDesktop = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; background: #fdfcfb; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #111; }
    .header { height: 72px; border-bottom: 1px solid #e5e5e7; display: flex; align-items: center; justify-content: space-between; padding: 0 48px; background: #fff; }
    .page { width: 1440px; margin: 0 auto; border: 1px solid #ddd; background: #faf9f6; position: relative; }
    .legend { display: flex; gap: 24px; padding: 16px 48px; background: #fff; border-bottom: 1px solid #e5e5e7; font-size: 13px; font-weight: 600; }
    .legend-item { display: flex; align-items: center; gap: 8px; }
    .swatch { width: 16px; height: 16px; border-radius: 4px; }
    .sw-stage { background: rgba(59, 130, 246, 0.25); border: 2px dashed #2563eb; }
    .sw-avoid { background: rgba(239, 68, 68, 0.18); border: 2px solid #dc2626; }
    .sw-corridor { background: rgba(168, 85, 247, 0.15); border: 1px dotted #9333ea; }

    .section { position: relative; padding: 48px; border-bottom: 1px solid #eae9e5; min-height: 480px; display: grid; }
    .sec-title { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #666; margin-bottom: 16px; }

    .avoid { background: rgba(239, 68, 68, 0.12); border: 1.5px solid #dc2626; border-radius: 6px; padding: 16px; position: relative; font-size: 13px; font-weight: 600; color: #991b1b; }
    .avoid::after { content: " [data-3d-avoid]"; font-size: 11px; opacity: 0.7; font-family: monospace; }

    .stage { background: rgba(59, 130, 246, 0.20); border: 2px dashed #2563eb; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: #1d4ed8; text-align: center; padding: 16px; z-index: 5; }
    .stage span { font-size: 11px; font-family: monospace; font-weight: 500; color: #1e40af; margin-top: 4px; }

    .corridor { background: rgba(168, 85, 247, 0.12); border: 1.5px dotted #9333ea; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; color: #6b21a8; font-family: monospace; }

    /* Layout specific */
    .hero-sec { grid-template-columns: 7fr 5fr; gap: 48px; min-height: 640px; }
    .sig-sec { grid-template-columns: 5fr 7fr; gap: 48px; min-height: 520px; }
    .ritual-sec { grid-template-columns: 6fr 6fr; gap: 48px; min-height: 560px; }
    .cat-sec { grid-template-columns: 8fr 4fr; gap: 48px; min-height: 620px; }
    .cta-sec { grid-template-columns: 7fr 5fr; gap: 48px; min-height: 480px; }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div style="font-weight: 800; letter-spacing: 0.05em;">AUTO STILO — WIREFRAME ARQUITETURA DE PALCOS 3D (DESKTOP 1440px)</div>
      <div style="font-size: 12px; color: #666;">Fase 1: Direção Artística & Storyboard</div>
    </div>
    <div class="legend">
      <div class="legend-item"><div class="swatch sw-stage"></div> Palco Reservado (Área Livre [data-3d-stage])</div>
      <div class="legend-item"><div class="swatch sw-corridor"></div> Corredor de Transição (Vão Lateral)</div>
      <div class="legend-item"><div class="swatch sw-avoid"></div> Conteúdo Crítico Intocável ([data-3d-avoid])</div>
    </div>

    <!-- 1. Hero Section -->
    <div class="section hero-sec">
      <div>
        <div class="sec-title">1. Seção Hero (0px a ~840px)</div>
        <div class="avoid" style="height: 380px;">
          HEADLINE EDITORIAL + SUBTÍTULO + CTAs AGENDAMENTO<br>
          <span style="font-weight: 400; color: #666; font-size: 12px;">Texto nunca intersectado pela máquina. Botão primário com clique 100% desobstruído.</span>
        </div>
      </div>
      <div class="stage" style="height: 480px;">
        PALCO HERO: Marco 1
        <span>data-3d-stage="hero"<br>Tamanho ≤ 34% vh | ry: -38° | Opacidade: 0.55</span>
      </div>
    </div>

    <!-- Corredor 1 -->
    <div style="padding: 12px 48px; background: #fff;">
      <div class="corridor" style="height: 64px;">CORREDOR 1: Transição diagonal rápida logo nos primeiros 10-40px de scroll até o Marquee</div>
    </div>

    <!-- 2. Assinatura -->
    <div class="section sig-sec">
      <div class="stage" style="height: 420px;">
        PALCO ASSINATURA: Marco 3
        <span>data-3d-stage="detalhe-01"<br>Perfil 90° | Tamanho ≤ 55% vh | ry: +90°</span>
      </div>
      <div>
        <div class="sec-title">2. Seção Assinatura (Marca & Filosofia)</div>
        <div class="avoid" style="height: 360px;">
          FOTO COM ARCO + MANIFESTO + SELOS DE QUALIDADE<br>
          <span style="font-weight: 400; color: #666; font-size: 12px;">Área nobre à direita protegida contra qualquer sobreposição do objeto.</span>
        </div>
      </div>
    </div>

    <!-- 3. Ritual & Detalhes -->
    <div class="section ritual-sec">
      <div>
        <div class="sec-title">3. Seção Ritual (Precisão e Lâminas)</div>
        <div class="avoid" style="height: 420px;">
          ETAPAS DO ATENDIMENTO + LINHA DE TEMPO EDITORIAL<br>
          <span style="font-weight: 400; color: #666; font-size: 12px;">Texto e passos descritivos à esquerda.</span>
        </div>
      </div>
      <div class="stage" style="height: 460px;">
        PALCO RITUAL: Marco 4 (MACRO CLOSE-UP)
        <span>data-3d-stage="detalhe-02"<br>Câmera aproxima (lâminas de aço) | Tamanho ≤ 110% (recorte lateral) | ry: 140°</span>
      </div>
    </div>

    <!-- 4. Catálogo de Serviços -->
    <div class="section cat-sec">
      <div>
        <div class="sec-title">4. Catálogo de Serviços & Valores</div>
        <div class="avoid" style="height: 480px;">
          TABELA DE PREÇOS + CARDS DE SERVIÇOS + SELEÇÃO<br>
          <span style="font-weight: 400; color: #666; font-size: 12px;">Máxima legibilidade comercial. Objeto recua para a borda lateral.</span>
        </div>
      </div>
      <div class="stage" style="height: 480px;">
        PALCO SERVIÇOS: Marco 6
        <span>data-3d-stage="servicos"<br>Tamanho ≤ 22% vh | Discreto no vão lateral direito | Opacidade: 0.40</span>
      </div>
    </div>

    <!-- 5. Chamada de Agendamento Final -->
    <div class="section cta-sec">
      <div>
        <div class="sec-title">5. Chamada Final de Agendamento</div>
        <div class="avoid" style="height: 320px;">
          HEADLINE DE AGENDAMENTO + BOTÃO DE RESERVA DIRETO<br>
          <span style="font-weight: 400; color: #666; font-size: 12px;">CTA com contraste máximo.</span>
        </div>
      </div>
      <div class="stage" style="height: 340px;">
        PALCO AGENDAR: Marco 8
        <span>data-3d-stage="agendar"<br>Máquina aponta sutilmente para o CTA | ry: 330° | Opacidade: 0.90</span>
      </div>
    </div>
  </div>
</body>
</html>`;

// HTML template for 390px mobile wireframe
const htmlMobile = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 24px 0; background: #e5e5e7; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    .page { width: 390px; margin: 0 auto; background: #faf9f6; border-radius: 36px; border: 8px solid #111; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
    .header { height: 56px; background: #fff; border-bottom: 1px solid #eee; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; letter-spacing: 0.05em; }
    .section { padding: 20px 16px; border-bottom: 1px solid #eae9e5; }
    .sec-title { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #666; margin-bottom: 10px; }

    .avoid { background: rgba(239, 68, 68, 0.12); border: 1.5px solid #dc2626; border-radius: 6px; padding: 12px; font-size: 11px; font-weight: 600; color: #991b1b; margin-bottom: 12px; }
    .avoid::after { content: " [data-3d-avoid]"; font-size: 10px; font-family: monospace; opacity: 0.7; }

    .stage-spacer { background: rgba(59, 130, 246, 0.22); border: 2px dashed #2563eb; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #1d4ed8; text-align: center; padding: 12px; min-height: 180px; margin: 12px 0; }
    .stage-spacer span { font-size: 10px; font-family: monospace; font-weight: 500; color: #1e40af; margin-top: 4px; }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">AUTO STILO — PALCOS & ESPAÇADORES (MOBILE 390px)</div>

    <!-- Hero Mobile -->
    <div class="section">
      <div class="sec-title">1. Hero Mobile</div>
      <div class="avoid" style="height: 180px;">HEADLINE + AVISO + BOTÃO AGENDAR</div>
      <div class="stage-spacer" style="min-height: 160px;">
        PALCO ESPAÇADOR HERO
        <span>data-3d-stage="hero"<br>Tamanho ≤ 24% vh | Objeto no vão sob os botões</span>
      </div>
    </div>

    <!-- Assinatura Mobile -->
    <div class="section">
      <div class="sec-title">2. Assinatura Mobile</div>
      <div class="avoid" style="height: 140px;">TEXTO EDITORIAL + MANIFESTO</div>
      <div class="stage-spacer" style="min-height: 200px;">
        PALCO ESPAÇADOR 1: PERFIL
        <span>data-3d-stage="detalhe-01"<br>Tamanho ≤ 40% vh | Objeto mora no espaçador</span>
      </div>
    </div>

    <!-- Ritual Mobile -->
    <div class="section">
      <div class="sec-title">3. Ritual Mobile</div>
      <div class="avoid" style="height: 160px;">PASSOS DO ATENDIMENTO</div>
      <div class="stage-spacer" style="min-height: 260px;">
        PALCO ESPAÇADOR 2: MACRO LÂMINA
        <span>data-3d-stage="detalhe-02"<br>Espaçador dedicado para aproximação sem encavalar texto</span>
      </div>
    </div>

    <!-- Catálogo Mobile -->
    <div class="section">
      <div class="sec-title">4. Catálogo Mobile</div>
      <div class="avoid" style="height: 220px;">SERVIÇOS & PREÇOS (100% LIVRE DE 3D)</div>
      <div style="font-size: 10px; color: #888; text-align: center; padding: 8px;">* Máquina recuada em opacidade ≤ 0.15 ou recolhida à lateral</div>
    </div>
  </div>
</body>
</html>`;

const pathDesktopHtml = path.resolve('public/temp_wireframe_desktop.html');
const pathMobileHtml = path.resolve('public/temp_wireframe_mobile.html');
fs.writeFileSync(pathDesktopHtml, htmlDesktop);
fs.writeFileSync(pathMobileHtml, htmlMobile);

const browser = await chromium.launch({ headless: true });

// Capture Desktop Wireframe
const pageD = await browser.newPage({ viewport: { width: 1440, height: 2600 } });
await pageD.goto(`file://${pathDesktopHtml.replace(/\\\\/g, '/')}`, { waitUntil: 'load' });
const outDesktop = path.join(TARGET_DIR, 'wireframe_palcos_1440.png');
await pageD.screenshot({ path: outDesktop, fullPage: true });
console.log(`[Salvo] Wireframe Desktop: ${outDesktop}`);

// Capture Mobile Wireframe
const pageM = await browser.newPage({ viewport: { width: 450, height: 1600 } });
await pageM.goto(`file://${pathMobileHtml.replace(/\\\\/g, '/')}`, { waitUntil: 'load' });
const outMobile = path.join(TARGET_DIR, 'wireframe_palcos_390.png');
await pageM.screenshot({ path: outMobile, fullPage: true });
console.log(`[Salvo] Wireframe Mobile: ${outMobile}`);

await browser.close();
fs.unlinkSync(pathDesktopHtml);
fs.unlinkSync(pathMobileHtml);

// Copy to artifact directory for embedding in artifact
const artifactDir = path.resolve('C:/Users/Windows/.gemini/antigravity/brain/4ceefa96-88d0-4621-b1fa-b3d647948612');
fs.copyFileSync(outDesktop, path.join(artifactDir, 'wireframe_palcos_1440.png'));
fs.copyFileSync(outMobile, path.join(artifactDir, 'wireframe_palcos_390.png'));
console.log('[Concluído] Wireframes salvos e copiados para artefato.');
