import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve('docs/redesign/evidencias/01-referencia');
fs.mkdirSync(outDir, { recursive: true });

async function inspectReference() {
  console.log('Iniciando inspeção da referência externa Lovable...');
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    console.log('Navegando para https://screenshot-to-silhouette-861.lovable.app/ ...');
    const response = await page.goto('https://screenshot-to-silhouette-861.lovable.app/', {
      waitUntil: 'networkidle',
      timeout: 25000,
    }).catch(err => {
      console.warn('Aviso ao navegar (pode ser timeout ou sem conexão):', err.message);
      return null;
    });

    if (!response || !response.ok()) {
      console.log('Não foi possível carregar via HTTP direto (status code ou rede). Analisando status:', response?.status());
    }

    // Capture desktop screenshot
    await page.screenshot({ path: path.join(outDir, 'ref_1440.png'), fullPage: false });
    console.log('Screenshot 1440 salvo em ref_1440.png');

    // Extract metrics from the page
    const metrics = await page.evaluate(() => {
      const header = document.querySelector('header') || document.querySelector('nav');
      const headerRect = header ? header.getBoundingClientRect() : null;
      const headerStyles = header ? window.getComputedStyle(header) : null;

      const h1 = document.querySelector('h1');
      const h1Styles = h1 ? window.getComputedStyle(h1) : null;

      const bodyStyles = window.getComputedStyle(document.body);

      const canvases = Array.from(document.querySelectorAll('canvas')).map(c => ({
        width: c.width,
        height: c.height,
        className: c.className,
        hasWebgl: !!(c.getContext('webgl2') || c.getContext('webgl')),
      }));

      const buttons = Array.from(document.querySelectorAll('button, a[href*="agenda"], a[class*="btn"], a[class*="button"]')).slice(0, 5).map(b => {
        const s = window.getComputedStyle(b);
        return {
          text: b.textContent?.trim(),
          borderRadius: s.borderRadius,
          backgroundColor: s.backgroundColor,
          color: s.color,
          padding: s.padding,
          fontSize: s.fontSize,
        };
      });

      return {
        title: document.title,
        header: headerRect ? {
          height: headerRect.height,
          position: headerStyles?.position,
          backgroundColor: headerStyles?.backgroundColor,
          borderBottom: headerStyles?.borderBottom,
          backdropFilter: headerStyles?.backdropFilter,
        } : null,
        h1: h1Styles ? {
          text: h1.textContent?.trim(),
          fontFamily: h1Styles.fontFamily,
          fontSize: h1Styles.fontSize,
          fontWeight: h1Styles.fontWeight,
          lineHeight: h1Styles.lineHeight,
          letterSpacing: h1Styles.letterSpacing,
          color: h1Styles.color,
        } : null,
        body: {
          backgroundColor: bodyStyles.backgroundColor,
          color: bodyStyles.color,
          fontFamily: bodyStyles.fontFamily,
        },
        canvases,
        buttons,
        hasThreeJs: !!(window.THREE),
        hasGsap: !!(window.gsap),
        hasLenis: !!(window.Lenis),
        scripts: Array.from(document.querySelectorAll('script[src]')).map(s => s.src).slice(0, 20),
      };
    });

    fs.writeFileSync(path.join(outDir, 'ref_metrics.json'), JSON.stringify(metrics, null, 2), 'utf-8');
    console.log('Métricas salvas com sucesso em ref_metrics.json');

    // Mobile inspection
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto('https://screenshot-to-silhouette-861.lovable.app/', { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => {});
    await mobilePage.screenshot({ path: path.join(outDir, 'ref_390.png'), fullPage: false });
    console.log('Screenshot 390 salvo em ref_390.png');

    await mobileContext.close();
    await context.close();
    await browser.close();
  } catch (error) {
    console.error('Erro na inspeção Playwright da referência:', error);
    if (browser) await browser.close();
  }
}

inspectReference();
