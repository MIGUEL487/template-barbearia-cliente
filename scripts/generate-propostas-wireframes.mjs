import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const root = 'C:\\Users\\Windows\\.gemini\\antigravity\\scratch\\barbearia-template\\template-barbearia-cliente';
const propDir = path.join(root, 'docs/redesign-v3/evidencias/00-propostas');
fs.mkdirSync(propDir, { recursive: true });

const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #FBFAF8; color: #141416; }
  
  /* 1. Wireframe Hero Desktop 1440 */
  .wireframe-box { padding: 48px; border: 2px dashed #D4D4D8; border-radius: 12px; margin-bottom: 48px; background: #FFFFFF; }
  .grid-hero { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 48px; align-items: center; min-height: 520px; }
  .tag { display: inline-block; padding: 6px 12px; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; border: 1px solid #E4E4E7; border-radius: 12px; color: #71717A; margin-bottom: 24px; }
  h1 { font-family: "Playfair Display", Georgia, serif; font-size: 44px; line-height: 1.15; margin-bottom: 20px; font-weight: 700; }
  h1 span.italic { font-style: italic; color: #7C3AED; }
  p.lead { font-size: 16px; line-height: 1.6; color: #52525B; max-width: 480px; margin-bottom: 32px; }
  .cta-group { display: flex; gap: 16px; margin-bottom: 40px; }
  .btn-primary { background: #141416; color: #FFFFFF; padding: 14px 28px; border-radius: 12px; font-weight: 600; font-size: 14px; text-decoration: none; }
  .btn-outline { background: transparent; color: #141416; border: 1px solid #D4D4D8; padding: 14px 24px; border-radius: 12px; font-weight: 600; font-size: 14px; }
  
  .meta-pills { display: flex; gap: 20px; border-top: 1px solid #F4F4F5; padding-top: 24px; font-size: 12px; color: #71717A; }
  
  .visual-block { position: relative; height: 500px; border-radius: 16px; border: 1px solid #E4E4E7; background: #F4F4F5; overflow: hidden; display: flex; align-items: center; justify-content: center; }
  .photo-mock { width: 100%; height: 100%; object-fit: cover; opacity: 0.85; }
  
  /* 3D Trimmer Slot */
  .trimmer-slot-standing {
    position: absolute; right: 24px; top: 50%; transform: translateY(-50%);
    width: 140px; height: 380px; border: 2px dashed #7C3AED; border-radius: 20px;
    background: rgba(124, 58, 237, 0.08); display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 12px;
  }
  .trimmer-slot-standing span { font-size: 11px; font-weight: 700; color: #7C3AED; }
  
  /* 2. Wireframe Storytelling */
  .story-wrap { min-height: 480px; border: 2px dashed #A855F7; border-radius: 16px; padding: 40px; background: #FAF5FF; position: relative; }
  .story-title { font-family: "Playfair Display", Georgia, serif; font-size: 32px; margin-bottom: 16px; }
  .svg-wave-mock { width: 100%; height: 120px; margin: 24px 0; border: 1px solid #E9D5FF; border-radius: 8px; background: #FFFFFF; display: flex; align-items: center; justify-content: center; }
  
  /* 3. Wireframe Single Video Player */
  .player-mock { max-width: 960px; margin: 0 auto; border: 1px solid #E4E4E7; border-radius: 16px; overflow: hidden; background: #141416; color: #FFFFFF; }
  .player-screen { height: 480px; display: flex; align-items: center; justify-content: center; position: relative; background: #1C1917; }
  .player-bar { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; background: #141416; border-top: 1px solid #27272A; }
  .btn-player { background: #27272A; color: #FFFFFF; border: none; padding: 8px 16px; border-radius: 12px; font-size: 13px; font-weight: 600; cursor: pointer; }
</style>
</head>
<body>

<!-- HERO 1440 -->
<div id="hero-1440" style="width: 1440px; padding: 64px 80px;">
  <div class="wireframe-box">
    <div style="font-size: 12px; color: #7C3AED; font-weight: bold; margin-bottom: 12px;">PROPOSTA WIREFRAME: HERO DESKTOP (1440×900)</div>
    <div class="grid-hero">
      <div class="hero-text-col">
        <div class="tag">Auto Stilo · Monte Sião, MG</div>
        <h1>Seu estilo. Sua <span class="italic">assinatura.</span><br><span style="font-size: 34px; color: #52525B; font-weight: 400;">Precisão em cada detalhe.</span></h1>
        <p class="lead">Experiência autoral de barbearia com pontualidade rigorosa, atendimento com tempo reservado e acabamento de alta costura.</p>
        <div class="cta-group">
          <div class="btn-primary">Agendar Horário &rarr;</div>
          <div class="btn-outline">Conhecer Serviços</div>
        </div>
        <div class="meta-pills">
          <div>• R. do Tanque, 395 · Bela Vista</div>
          <div>• Sem filas · Horário individual</div>
          <div>• Ter–Sáb das 09h às 19h</div>
        </div>
      </div>
      <div class="visual-block">
        <div style="font-size: 13px; color: #71717A; font-weight: 600; text-align: center;">[ Fotografia Real do Espaço sem Faixa Decorativa ]</div>
        <div class="trimmer-slot-standing">
          <span>MÁQUINA 3D EM PÉ<br>(Vertical rz 0°)<br><br>Lâmina para cima<br>Sem sobrepor a foto</span>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- HERO 390 -->
<div id="hero-390" style="width: 390px; padding: 24px 20px;">
  <div class="wireframe-box" style="padding: 24px;">
    <div style="font-size: 11px; color: #7C3AED; font-weight: bold; margin-bottom: 12px;">HERO MOBILE (390×844)</div>
    <div class="tag" style="margin-bottom: 16px;">Auto Stilo · Monte Sião</div>
    <h1 style="font-size: 28px; margin-bottom: 16px;">Seu estilo.<br>Sua <span class="italic">assinatura.</span></h1>
    <p class="lead" style="font-size: 14px; margin-bottom: 24px;">Pontualidade rigorosa e atendimento individual em Monte Sião.</p>
    <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
      <div class="btn-primary" style="text-align: center;">Agendar Horário &rarr;</div>
      <div class="btn-outline" style="text-align: center;">Conhecer Serviços</div>
    </div>
    <div class="visual-block" style="height: 320px;">
      <div style="font-size: 11px; color: #71717A; text-align: center;">[ Foto Real ]</div>
      <div class="trimmer-slot-standing" style="width: 90px; height: 240px; right: 12px;">
        <span style="font-size: 9px;">3D EM PÉ<br>Vertical<br>Lateral</span>
      </div>
    </div>
  </div>
</div>

<!-- STORYTELLING 1440 -->
<div id="story-1440" style="width: 1440px; padding: 64px 80px;">
  <div class="story-wrap">
    <div style="font-size: 12px; color: #7C3AED; font-weight: bold; margin-bottom: 8px;">PROPOSTA WIREFRAME: STORYTELLING NA SEÇÃO "ENTRE. FIQUE À VONTADE." (1440×900)</div>
    <h2 class="story-title">Entre. Fique à <span style="font-style: italic; color: #7C3AED;">vontade.</span></h2>
    <p style="color: #52525B; max-width: 600px; font-size: 15px;">Concreto aparente, iluminação pontual e acabamentos escuros. Acompanhe a transformação visual no scroll.</p>
    
    <div class="svg-wave-mock">
      <span style="color: #7C3AED; font-size: 13px; font-weight: 600;">[ Linha Roxa Ondulada SVG (stroke-dashoffset desenhado pelo scroll) ]</span>
    </div>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-top: 24px;">
      <div style="border: 1px solid #E4E4E7; border-radius: 12px; padding: 20px; background: #FFFFFF;">
        <h4 style="font-size: 14px; margin-bottom: 8px; color: #141416;">1. Entrada da Tesoura (p: 0.25 &rarr; 0.45)</h4>
        <p style="font-size: 13px; color: #71717A;">Lâminas abrem e fecham sincronizadas ao traço da linha roxa sem cobrir texto.</p>
      </div>
      <div style="border: 1px solid #E4E4E7; border-radius: 12px; padding: 20px; background: #FFFFFF;">
        <h4 style="font-size: 14px; margin-bottom: 8px; color: #141416;">2. Entrada da Navalha (p: 0.55 &rarr; 0.78)</h4>
        <p style="font-size: 13px; color: #71717A;">Lâmina de aço se desdobra do cabo conforme o scroll progride com reversibilidade total.</p>
      </div>
    </div>
  </div>
</div>

<!-- VIDEO PLAYER 1440 -->
<div id="video-1440" style="width: 1440px; padding: 64px 80px;">
  <div style="font-size: 12px; color: #7C3AED; font-weight: bold; margin-bottom: 12px;">PROPOSTA WIREFRAME: PLAYER DE VÍDEO ÚNICO COM PLAYLIST (1440×900)</div>
  <div class="player-mock">
    <div class="player-screen">
      <div style="text-align: center;">
        <div style="font-size: 18px; font-weight: 700; margin-bottom: 8px;">[ Reproduzindo Vídeo 01/02: Uma Visita à Auto Stilo ]</div>
        <div style="font-size: 13px; color: #A1A1AA;">Buffer Duplo A/B · Crossfade suave de 250ms · Sem tela preta</div>
      </div>
    </div>
    <div class="player-bar">
      <div style="font-size: 13px; font-weight: 600; color: #E4E4E7;">01 / 02 · Uma Visita à Auto Stilo</div>
      <div style="display: flex; gap: 12px;">
        <button class="btn-player">&larr; Anterior</button>
        <button class="btn-player">Pausar ||</button>
        <button class="btn-player">Próximo &rarr;</button>
        <button class="btn-player">Som 🔊</button>
      </div>
    </div>
  </div>
</div>

</body>
</html>
`;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1600, height: 2600 } });
await page.setContent(html);
await page.waitForTimeout(500);

// Capture elements
const hero1440 = page.locator('#hero-1440');
await hero1440.screenshot({ path: path.join(propDir, 'wireframe-hero-1440.png') });

const hero390 = page.locator('#hero-390');
await hero390.screenshot({ path: path.join(propDir, 'wireframe-hero-390.png') });

const story1440 = page.locator('#story-1440');
await story1440.screenshot({ path: path.join(propDir, 'wireframe-storytelling-1440.png') });

const video1440 = page.locator('#video-1440');
await video1440.screenshot({ path: path.join(propDir, 'wireframe-video-player-1440.png') });

await browser.close();
console.log('Wireframes de propostas gerados com sucesso!');
