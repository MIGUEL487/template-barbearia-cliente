import { chromium } from 'playwright';
import path from 'path';

const LIVE_URL = 'https://template-barbearia-cliente.mi-c-openheimer.workers.dev';
const ARTIFACTS_DIR = 'C:/Users/Windows/.gemini/antigravity/brain/4ceefa96-88d0-4621-b1fa-b3d647948612';

async function run() {
  console.log('🚀 Verificando Creative Experience 2.0 em PRODUÇÃO...');
  console.log(`URL: ${LIVE_URL}\n`);

  const browser = await chromium.launch({ headless: true });

  try {
    // 1. Desktop 1440px
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto(LIVE_URL, { waitUntil: 'domcontentloaded', timeout: 35000 });
    await page.waitForTimeout(2000);

    const audit = await page.evaluate(() => {
      const bodyStyle = window.getComputedStyle(document.body);
      const canvas3D = document.querySelector('.brand-sculpture-canvas canvas');
      const marquee = document.querySelector('.marquee-track');
      const serviceCards = document.querySelectorAll('.service-card-item');

      return {
        title: document.title,
        bodyBg: bodyStyle.backgroundColor,
        bodyColor: bodyStyle.color,
        hasThreeJs: !!canvas3D,
        hasMarquee: !!marquee,
        hasLenis: !!window.__lenis,
        servicesFound: serviceCards.length,
      };
    });

    console.log('--- Produção Desktop Audit ---');
    console.log(JSON.stringify(audit, null, 2));

    // Capture initial production hero
    const shotHeroInitial = path.join(ARTIFACTS_DIR, 'production_creative_hero_initial.png');
    await page.screenshot({ path: shotHeroInitial });
    console.log(`📸 Screenshot Gravado: ${shotHeroInitial}`);

    // Click Skip Intro to reveal sections smoothly
    const skip = page.locator('a.hero-skip-intro');
    if ((await skip.count()) > 0) {
      await skip.click({ force: true });
      await page.waitForTimeout(1500);
    }

    const shotEditorial = path.join(ARTIFACTS_DIR, 'production_creative_signature.png');
    await page.screenshot({ path: shotEditorial });
    console.log(`📸 Screenshot Gravado: ${shotEditorial}`);

    // Scroll to catalog
    await page.evaluate(() => {
      const s = document.querySelector('#servicos');
      if (s) s.scrollIntoView();
    });
    await page.waitForTimeout(1500);
    const shotCatalog = path.join(ARTIFACTS_DIR, 'production_creative_catalog.png');
    await page.screenshot({ path: shotCatalog });
    console.log(`📸 Screenshot Gravado: ${shotCatalog}`);

    // Scroll to marquee and footer
    await page.evaluate(() => {
      const f = document.querySelector('footer');
      if (f) f.scrollIntoView();
    });
    await page.waitForTimeout(1500);
    const shotFooter = path.join(ARTIFACTS_DIR, 'production_creative_footer.png');
    await page.screenshot({ path: shotFooter });
    console.log(`📸 Screenshot Gravado: ${shotFooter}`);

    // 2. Mobile 390px
    const contextMobile = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const pageMobile = await contextMobile.newPage();
    await pageMobile.goto(LIVE_URL, { waitUntil: 'domcontentloaded', timeout: 35000 });
    await pageMobile.waitForTimeout(2000);

    const shotMobile = path.join(ARTIFACTS_DIR, 'production_creative_mobile.png');
    await pageMobile.screenshot({ path: shotMobile });
    console.log(`📸 Screenshot Gravado: ${shotMobile}`);

    await context.close();
    await contextMobile.close();
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error('Erro na auditoria de produção:', err);
  process.exit(1);
});
