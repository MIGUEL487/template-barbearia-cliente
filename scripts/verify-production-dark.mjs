import { chromium } from 'playwright';
import path from 'path';

const LIVE_URL = 'https://template-barbearia-cliente.mi-c-openheimer.workers.dev';
const ARTIFACTS_DIR = 'C:/Users/Windows/.gemini/antigravity/brain/4ceefa96-88d0-4621-b1fa-b3d647948612';

async function run() {
  console.log('🚀 Verificação detalhada de Produção:');
  console.log(`URL: ${LIVE_URL}\n`);

  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto(LIVE_URL, { waitUntil: 'networkidle', timeout: 45000 });

    const audit = await page.evaluate(() => {
      const getBg = (sel) => {
        const el = document.querySelector(sel);
        return el ? window.getComputedStyle(el).backgroundColor : 'NOT_FOUND';
      };
      const getColor = (sel) => {
        const el = document.querySelector(sel);
        return el ? window.getComputedStyle(el).color : 'NOT_FOUND';
      };
      const getBorder = (sel) => {
        const el = document.querySelector(sel);
        return el ? window.getComputedStyle(el).borderColor : 'NOT_FOUND';
      };

      return {
        bodyBg: getBg('body'),
        bodyColor: getColor('body'),
        headerBg: getBg('.site-header'),
        logoSrc: document.querySelector('.brand-logo img, header img')?.getAttribute('src'),
        pillarsCardBg: getBg('.pillars li'),
        pillarsCardBorder: getBorder('.pillars li'),
        serviceItemBg: getBg('.service-item'),
        serviceItemBorder: getBorder('.service-item'),
        teamMemberBg: getBg('.team-member'),
        teamMemberBorder: getBorder('.team-member'),
        marqueeTrackBg: getBg('.marquee-window'),
        footerBg: getBg('.site-footer')
      };
    });

    console.log('--- Landing Elements ---');
    console.log(JSON.stringify(audit, null, 2));

    // Agendar page
    await page.goto(`${LIVE_URL}/agendar`, { waitUntil: 'networkidle', timeout: 45000 });
    const agendarAudit = await page.evaluate(() => {
      const getBg = (sel) => {
        const el = document.querySelector(sel);
        return el ? window.getComputedStyle(el).backgroundColor : 'NOT_FOUND';
      };
      const getBorder = (sel) => {
        const el = document.querySelector(sel);
        return el ? window.getComputedStyle(el).borderColor : 'NOT_FOUND';
      };
      return {
        bookingScopeBg: getBg('.booking-scope'),
        cardBg: getBg('.step-card, .service-card, .choice-card, .barber-card, fieldset, form'),
        cardBorder: getBorder('.step-card, .service-card, .choice-card, .barber-card, fieldset, form'),
        submitBtnBg: getBg('button[type="submit"], .cta, .booking-btn-primary')
      };
    });

    console.log('\n--- Agendar Elements ---');
    console.log(JSON.stringify(agendarAudit, null, 2));

    await context.close();
  } finally {
    await browser.close();
  }
}

run().catch(console.error);
