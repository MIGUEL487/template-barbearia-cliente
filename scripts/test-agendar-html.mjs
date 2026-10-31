import { chromium } from 'playwright';

const LIVE_URL = 'https://template-barbearia-cliente.mi-c-openheimer.workers.dev/agendar';

async function test() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  await page.goto(LIVE_URL, { waitUntil: 'networkidle', timeout: 30000 });

  const htmlSnippet = await page.evaluate(() => {
    return {
      bodyText: document.body.innerText.slice(0, 300),
      mainHtml: document.querySelector('main')?.outerHTML?.slice(0, 500) || document.body.innerHTML.slice(0, 500)
    };
  });

  console.log('Page content:', htmlSnippet);
  await browser.close();
}

test().catch(console.error);
