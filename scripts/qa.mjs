import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
const base = process.env.TEST_BASE_URL || "http://127.0.0.1:8787",
  out = "docs/qa";
await mkdir(out, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const results = [];
try {
  for (const [width, height] of [
    [360, 800],
    [390, 844],
    [768, 1024],
    [1024, 768],
    [1440, 900],
    [844, 390],
    [800, 360],
  ]) {
    const context = await browser.newContext({ viewport: { width, height } }),
      page = await context.newPage();
    const errors = [],
      csp = [];
    let remote = 0;
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (/Content Security Policy|Refused to execute/i.test(m.text()))
        csp.push(m.text());
    });
    await page.route("**/*.supabase.co/**", (r) => {
      remote++;
      r.abort();
    });
    await page.addInitScript(() => {
      window.__lcp = 0;
      window.__cls = 0;
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) window.__lcp = e.startTime;
      }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((list) => {
        for (const e of list.getEntries())
          if (!e.hadRecentInput) window.__cls += e.value;
      }).observe({ type: "layout-shift", buffered: true });
    });
    await page.goto(base);
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => document.fonts.ready);
    const client = await context.newCDPSession(page);
    await client.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await page.screenshot({
      path: `${out}/landing-${width}x${height}-fold.jpg`,
      type: "jpeg",
      quality: 78,
    });
    await page.evaluate(() => {
      window.__frames = [];
      window.__running = true;
      let last = performance.now();
      function frame(t) {
        if (!window.__running) return;
        window.__frames.push(t - last);
        last = t;
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    });
    for (
      let y = 0;
      y < (await page.evaluate(() => document.body.scrollHeight));
      y += 280
    ) {
      await page.mouse.wheel(0, 280);
      await page.waitForTimeout(100);
    }
    await page.waitForTimeout(250);
    const metrics = await page.evaluate(() => {
      window.__running = false;
      const f = window.__frames.slice(2).sort((a, b) => a - b);
      return {
        frameCount: f.length,
        median: f[Math.floor(f.length * 0.5)],
        p95: f[Math.floor(f.length * 0.95)],
        max: f.at(-1),
        lcp: window.__lcp,
        cls: window.__cls,
        overflow: document.documentElement.scrollWidth > innerWidth,
      };
    });
    await client.send("Emulation.setCPUThrottlingRate", { rate: 1 });
    await page.screenshot({
      path: `${out}/landing-${width}x${height}-full.jpg`,
      type: "jpeg",
      quality: 72,
      fullPage: true,
    });
    assert.equal(metrics.overflow, false);
    assert.equal(errors.length, 0, JSON.stringify(errors));
    assert.equal(csp.length, 0, JSON.stringify(csp));
    await page.goto(base + "/agendar/");
    await page.getByRole("button", { name: "Continuar" }).click();
    await page.getByRole("button", { name: "Continuar" }).click();
    assert.equal(
      await page.getByRole("button", { name: "Continuar" }).isDisabled(),
      true,
    );
    await page.getByLabel("Data", { exact: true }).fill("2026-12-15");
    await page.getByRole("button", { name: "14:00", exact: true }).click();
    await page.getByRole("button", { name: "Continuar" }).click();
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Concluir simulação" }).click();
    await page
      .getByRole("heading", { name: "Tudo certo na simulação." })
      .waitFor();
    await page.screenshot({
      path: `${out}/confirmation-${width}x${height}.jpg`,
      type: "jpeg",
      quality: 80,
    });
    assert.equal(remote, 0);
    await page.goto(base + "/meu-agendamento/?token=demo");
    await page
      .getByRole("button", { name: "Cancelar exemplo", exact: true })
      .click();
    await page.getByRole("button", { name: "Confirmar simulação" }).click();
    await page
      .getByRole("heading", { name: "Cancelamento simulado" })
      .waitFor();
    await page.goto(base);
    await page.keyboard.press("Tab");
    assert.equal(
      await page.locator(":focus").innerText(),
      "Pular para o conteúdo",
    );
    if (width < 768) {
      await page.getByRole("button", { name: "Abrir menu" }).click();
      await page
        .getByRole("navigation", { name: "Navegação principal" })
        .getByRole("link", { name: "Serviços" })
        .click();
      assert.match(page.url(), /#servicos/);
    }
    results.push({
      width,
      height,
      metrics,
      errors,
      csp,
      bookingPassed: true,
      managementPassed: true,
      remoteCalls: remote,
    });
    await context.close();
  }
  const p = await browser.newPage({
    reducedMotion: "reduce",
    viewport: { width: 390, height: 844 },
  });
  await p.goto(base);
  await p.waitForLoadState("networkidle");
  const reduced = await p
    .locator(".ambient-loop")
    .evaluate((e) => getComputedStyle(e).animationName);
  assert.equal(reduced, "none");
  await p.screenshot({
    path: `${out}/reduced-motion.jpg`,
    type: "jpeg",
    fullPage: true,
    quality: 72,
  });
  await writeFile(
    `${out}/results.json`,
    JSON.stringify(
      {
        runtime: "Wrangler local, production export",
        cpuThrottle: 4,
        results,
        reducedMotionPassed: true,
      },
      null,
      2,
    ),
  );
  console.log(
    JSON.stringify(
      results.map((r) => ({ width: r.width, height: r.height, ...r.metrics })),
    ),
  );
} finally {
  await browser.close();
}
