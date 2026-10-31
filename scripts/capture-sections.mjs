import { chromium } from 'playwright';
import path from 'path';

const LIVE_URL = 'https://template-barbearia-cliente.mi-c-openheimer.workers.dev';
const ARTIFACTS_DIR = 'C:/Users/Windows/.gemini/antigravity/brain/4ceefa96-88d0-4621-b1fa-b3d647948612';

async function test() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto(LIVE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Click "Pular introdução"
  const skipBtn = await page.locator('a.hero-skip-intro');
  if (await skipBtn.count() > 0) {
    await skipBtn.click();
    await page.waitForTimeout(2000);
  }

  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'screenshot_live_after_skip.png') });

  // Now scroll to services anchor
  await page.evaluate(() => {
    const el = document.querySelector('#servicos');
    if (el) el.scrollIntoView();
  });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'screenshot_live_services.png') });

  // Scroll to footer
  await page.evaluate(() => {
    const el = document.querySelector('footer');
    if (el) el.scrollIntoView();
  });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'screenshot_live_footer.png') });

  console.log('Finished capturing after-skip, services, and footer!');
  await browser.close();
}

test().catch(console.error);
