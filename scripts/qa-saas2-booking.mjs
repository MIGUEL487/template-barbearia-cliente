import { chromium } from "playwright";
import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
const root = path.resolve("out"),
  out = "docs/saas-2/evidencias";
await fs.mkdir(out, { recursive: true });
const server = http.createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(new URL(req.url, "http://fixture").pathname);
    let file = path.resolve(root, "." + p);
    if (!file.startsWith(root + "/")) throw Error();
    if ((await fs.stat(file)).isDirectory())
      file = path.join(file, "index.html");
    const data = await fs.readFile(file);
    res.setHeader(
      "Content-Type",
      {
        ".html": "text/html",
        ".js": "application/javascript",
        ".css": "text/css",
        ".webp": "image/webp",
        ".png": "image/png",
        ".woff2": "font/woff2",
        ".ttf": "font/ttf",
      }[path.extname(file)] || "application/octet-stream",
    );
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end();
  }
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}`,
  b = await chromium.launch({
    executablePath: "/usr/bin/chromium",
    args: ["--no-sandbox"],
  });
const shop = "11111111-1111-1111-1111-111111111111",
  barber = "22222222-2222-2222-2222-222222222221",
  service = "33333333-3333-3333-3333-333333333331",
  results = [];
try {
  for (const [width, pct] of [
    [1440, 0],
    [1024, 50],
    [820, 100],
    [390, 33.33],
  ]) {
    const p = await b.newPage({
      viewport: { width, height: 900 },
      timezoneId: width === 820 ? "Asia/Tokyo" : "America/Sao_Paulo",
      reducedMotion: width === 820 ? "reduce" : "no-preference",
    });
    await p.clock.setFixedTime(new Date("2026-10-29T12:00Z"));
    let bars = 1,
      closed = false,
      hold = null,
      joined = null,
      failHold = false,
      settingsMissing = false;
    const errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    await p.route("https://*.supabase.co/**", async (r) => {
      const name = new URL(r.request().url()).pathname.split("/").pop(),
        args = r.request().postDataJSON() || {};
      let data = [];
      if (name === "public_barbers")
        data = Array.from({ length: bars }, (_, i) => ({
          id: i ? barber.slice(0, -1) + "2" : barber,
          name: i ? "Jeronimo" : "Carlos",
          bio: "Profissional cadastrado",
          avatar_url: null,
        }));
      if (name === "public_services")
        data = [
          {
            id: service,
            name: "Corte cadastrado",
            description: null,
            price: 50,
            duration_minutes: 30,
          },
        ];
      if (name === "public_site_settings")
        data = settingsMissing ? null : { deposit_percentage: pct };
      if (name === "get_availability" || name === "get_group_availability")
        data =
          closed || args.p_date === "2026-11-01"
            ? []
            : [
                {
                  barber_id: barber,
                  start_time: args.p_date + "T09:00:00-03:00",
                  end_time: args.p_date + "T09:35:00-03:00",
                },
              ];
      if (
        name === "create_booking_hold" ||
        name === "create_group_booking_hold"
      ) {
        hold = args;
        if (failHold) {
          await r.fulfill({
            status: 400,
            json: {
              code: "P0001",
              message: "Horário reservado",
              details: "Fixture local",
              hint: "Escolha outro",
            },
          });
          return;
        }
        data = {
          booking_id: "fixture",
          cancellation_token: "fixture-token",
          hold_expires_at: "2026-10-29T12:15:00Z",
          total_price: 50 * args.p_service_ids.length,
          deposit_amount:
            Math.round(
              50 * args.p_service_ids.length * (width === 1024 ? 25 : pct),
            ) / 100,
        };
      }
      if (name === "join_waitlist") {
        joined = args;
        data = "fixture-waitlist";
      }
      await r.fulfill({ json: data });
    });
    await p.goto(base + "/agendar/");
    await p.getByRole("heading", { name: "Serviço", exact: true }).waitFor();
    assert.equal(
      await p.getByRole("button", { name: "Voltar", exact: true }).count(),
      0,
    );
    await p.getByRole("checkbox", { name: /Corte cadastrado/ }).check();
    if (width === 1024)
      await p
        .getByRole("button", { name: "Aumentar pessoas para Corte cadastrado" })
        .click();
    await p.screenshot({
      path: `${out}/services-${width}.png`,
      fullPage: true,
    });
    await p.getByRole("button", { name: "Continuar", exact: true }).click();
    await p.getByRole("button", { name: "09:00", exact: true }).click();
    await p.waitForTimeout(250);
    const calendar = await p.locator(".booking-calendar").boundingBox(),
      panel = await p.locator(".booking-time-panel").boundingBox();
    if (width >= 768) assert(panel.x > calendar.x + calendar.width);
    else assert(panel.y > calendar.y + calendar.height);
    await p.screenshot({
      path: `${out}/calendar-${width}.png`,
      fullPage: true,
    });
    await p.getByRole("button", { name: "Continuar", exact: true }).click();
    await p.getByText(`Sinal calculado (${pct}%)`, { exact: true }).waitFor();
    await p.getByPlaceholder("Seu nome").fill("Fixture local");
    await p.getByPlaceholder("(11) 99999-9999").fill("11999999999");
    await p.locator("input[type=checkbox]").first().check();
    await p.screenshot({
      path: `${out}/confirmation-${width}.png`,
      fullPage: true,
    });
    assert.equal(
      await p.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false,
    );
    await p
      .getByRole("button", { name: "Confirmar reserva", exact: true })
      .click();
    await p
      .getByRole("heading", { name: "Pré-reserva criada", exact: true })
      .waitFor();
    assert(hold);
    assert.equal(hold.p_barber_id, barber);
    assert.equal(hold.p_barbershop_id, shop);
    assert(!Object.hasOwn(hold, "deposit_amount"));
    await p.getByText(/Sinal solicitado:/).waitFor();
    if (pct === 0)
      await p
        .getByText(
          "Nenhum sinal foi solicitado. Aguarde a confirmação da barbearia.",
          { exact: false },
        )
        .waitFor();
    if (width === 1024) {
      const requested=await p.getByText(/Sinal solicitado:/).innerText();
      assert(requested.includes('25,00'),requested);
    }
    assert.deepEqual(errors, []);
    results.push({
      width,
      pct,
      singleBarberSkipped: true,
      serverHold: true,
      calendarLayout: true,
      timezone: width === 820 ? "Asia/Tokyo" : "America/Sao_Paulo",
    });
    // Two active professionals preserve the original choice.
    bars = 2;
    await p.reload();
    await p
      .getByRole("heading", { name: "Profissional", exact: true })
      .waitFor();
    await p.getByText("Jeronimo", { exact: true }).click();
    await p.getByRole("button", { name: "Continuar", exact: true }).click();
    await p.getByRole("heading", { name: "Serviço", exact: true }).waitFor();
    // No barber is never replaced by a fake choice.
    bars = 0;
    await p.reload();
    await p
      .getByRole("alert")
      .filter({ hasText: "Nenhum profissional ativo" })
      .waitFor();
    assert(
      await p
        .getByRole("button", { name: "Continuar", exact: true })
        .isDisabled(),
    );
    // Missing policy must block real booking instead of assuming an example percentage.
    bars = 1;
    settingsMissing = true;
    await p.reload();
    await p
      .getByRole("alert")
      .filter({ hasText: "Não foi possível carregar o agendamento" })
      .waitFor();
    assert(
      await p
        .getByRole("button", { name: "Continuar", exact: true })
        .isDisabled(),
    );
    settingsMissing = false;
    // No slots offers a private, consented waitlist request (no hold).
    bars = 1;
    closed = true;
    hold = null;
    await p.reload();
    await p.getByRole("heading", { name: "Serviço", exact: true }).waitFor();
    await p.getByRole("button", { name: "Continuar", exact: true }).click();
    await p
      .getByRole("button", { name: "Entrar na lista de espera" })
      .waitFor();
    await p.getByRole("button", { name: "Entrar na lista de espera" }).click();
    await p.getByLabel("Nome", { exact: true }).fill("Ana Fixture");
    await p.getByLabel("Telefone", { exact: true }).fill("11911111111");
    if (width === 390)
      await p.getByLabel("Data desejada para a fila").fill("2026-11-02");
    await p.getByRole("checkbox", { name: /Autorizo contato manual/ }).check();
    await p.getByRole("button", { name: "Registrar preferência" }).click();
    await p
      .getByText(/Solicitação registrada. Nenhum horário está reservado/)
      .waitFor();
    assert(joined?.p_consent);
    assert.equal(joined.p_barber_id, barber);
    if (width === 390) assert.equal(joined.p_date, "2026-11-02");
    assert.equal(hold, null);
    await p.screenshot({
      path: `${out}/waitlist-${width}.png`,
      fullPage: true,
    });
    results.push({
      width,
      multipleBarbers: true,
      zeroBarbers: true,
      waitlistConsent: true,
      noAutomaticBooking: true,
    });
    await p.close();
  }
  console.log(results);
} finally {
  await b.close();
  await new Promise((r) => server.close(r));
  await fs.writeFile(
    `${out}/booking-results.json`,
    JSON.stringify(results, null, 2),
  );
}
