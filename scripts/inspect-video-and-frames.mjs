import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';
import http from 'node:http';

const refDir = path.resolve('docs/redesign/evidencias/01-referencia');

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(refDir, reqPath);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.statusCode = 404;
    return res.end('Not found');
  }
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.webm': 'video/webm',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
  };
  res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
  fs.createReadStream(filePath).pipe(res);
});

const PORT = 3457;

async function run() {
  await new Promise(resolve => server.listen(PORT, resolve));
  console.log(`Server listening on http://localhost:${PORT}`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(`http://localhost:${PORT}/video-test.html`);
  const actualDuration = await page.evaluate(async () => {
    const vid = document.getElementById('vid');
    if (!isFinite(vid.duration)) {
      vid.currentTime = 1e101;
      await new Promise(r => { vid.ontimeupdate = r; });
      vid.currentTime = 0;
      await new Promise(r => { vid.ontimeupdate = r; });
    }
    return vid.duration;
  });
  console.log('Duração real do vídeo calculada:', actualDuration);

  const dur = isFinite(actualDuration) && actualDuration > 0 ? actualDuration : 24;
  const samplePoints = [
    { label: '01_inicio', t: 0.5 },
    { label: '02_primeiro_scroll', t: dur * 0.15 },
    { label: '03_hero_transicao', t: dur * 0.30 },
    { label: '04_meio_catalogo', t: dur * 0.50 },
    { label: '05_detalhes_ritmo', t: dur * 0.70 },
    { label: '06_fim_rodape', t: dur * 0.92 }
  ];

  for (const s of samplePoints) {
    await page.evaluate(async (time) => {
      const vid = document.getElementById('vid');
      vid.currentTime = time;
      await new Promise(r => { vid.onseeked = r; });
    }, s.t);
    const outImg = path.join(refDir, `sample_${s.label}.png`);
    const vidHandle = await page.$('#vid');
    if (vidHandle) {
      await vidHandle.screenshot({ path: outImg });
      console.log(`Frame capturado: ${s.label} em t=${s.t.toFixed(1)}s -> ${outImg}`);
    }
  }

  // Also check contact sheet
  await page.goto(`http://localhost:${PORT}/cs-test.html`);
  const csInfo = await page.evaluate(() => {
    const img = document.getElementById('cs');
    return { naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight };
  });
  console.log('Contact Sheet Info:', csInfo);

  // Write video & contact sheet report
  const summaryReport = {
    videoWidth: 1920,
    videoHeight: 922,
    aspectRatio: (1920 / 922).toFixed(2),
    actualDuration: dur,
    contactSheet: csInfo,
    samplesCaptured: samplePoints.map(p => ({ label: p.label, timestamp: p.t.toFixed(1) })),
  };

  fs.writeFileSync(path.join(refDir, 'video_analysis.json'), JSON.stringify(summaryReport, null, 2), 'utf-8');

  await browser.close();
  server.close();
  console.log('Análise do vídeo finalizada com sucesso!');
}

run().catch(err => {
  console.error('Erro na análise:', err);
  server.close();
});
