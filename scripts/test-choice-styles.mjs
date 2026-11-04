import { chromium } from 'playwright';

const LIVE_URL = 'https://template-barbearia-cliente.mi-c-openheimer.workers.dev/agendar';

async function test() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(LIVE_URL, { waitUntil: 'networkidle', timeout: 30000 });

  const result = await page.evaluate(() => {
    const shell = document.querySelector('.booking-shell');
    const shellComputed = shell ? window.getComputedStyle(shell) : null;
    const choice = document.querySelector('label.choice');
    const choiceComputed = choice ? window.getComputedStyle(choice) : null;
    const progressStep = document.querySelector('.step-progress li[aria-current="step"]');
    const progressComputed = progressStep ? window.getComputedStyle(progressStep) : null;
    const cta = document.querySelector('.booking-actions .cta, button.cta, .cta');
    const ctaComputed = cta ? window.getComputedStyle(cta) : null;

    return {
      shellBg: shellComputed?.backgroundColor,
      choiceBg: choiceComputed?.backgroundColor,
      choiceBorder: choiceComputed?.borderColor,
      choiceColor: choiceComputed?.color,
      progressStepBg: progressComputed?.backgroundColor,
      progressStepColor: progressComputed?.color,
      progressStepBorder: progressComputed?.borderColor,
      ctaBg: ctaComputed?.backgroundColor,
      ctaColor: ctaComputed?.color
    };
  });

  console.log('Agendar Computed Styles on Production:', result);
  await browser.close();
}

test().catch(console.error);
