import { chromium } from 'playwright';

const LIVE_URL = 'https://template-barbearia-cliente.mi-c-openheimer.workers.dev/agendar';

async function test() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(LIVE_URL, { waitUntil: 'networkidle', timeout: 30000 });

  const result = await page.evaluate(() => {
    const barberPill = document.querySelector('button.group, [class*="bg-surface"]');
    const computed = barberPill ? window.getComputedStyle(barberPill) : null;
    return {
      barberPillFound: !!barberPill,
      bg: computed ? computed.backgroundColor : null,
      color: computed ? computed.color : null,
      borderRadius: computed ? computed.borderRadius : null
    };
  });

  console.log('Barber Pill in /agendar:', result);
  await browser.close();
}

test().catch(console.error);
