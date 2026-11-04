import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

async function html(dir) {
  let out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = dir + '/' + e.name;
    if (e.isDirectory()) out.push(...await html(p));
    else if (p.endsWith('.html')) out.push(p);
  }
  return out;
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
let connect = "'self'";
if (url) {
  const u = new URL(url);
  if (!['https:', 'http:'].includes(u.protocol)) throw new Error('Supabase URL inválida');
  connect += ' ' + u.origin + ' ' + u.origin.replace(/^http/, 'ws');
}

function buildCsp(hashes) {
  const hashList = [...hashes].join(' ');
  return `default-src 'self'; script-src 'self' ${hashList}; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; media-src 'self'; font-src 'self'; connect-src ${connect}; frame-src https://www.google.com; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'`;
}

// Calculate hashes per HTML file
const pageFiles = await html('out');
const routeMap = new Map();

for (const file of pageFiles) {
  const content = await readFile(file, 'utf8');
  const hashes = new Set();
  for (const m of content.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)) {
    if (m[1]) {
      hashes.add("'sha256-" + createHash('sha256').update(m[1]).digest('base64') + "'");
    }
  }

  // Derive route pattern
  let route = file.replace(/^out/, '').replace(/\/index\.html$/, '').replace(/\.html$/, '');
  if (route === '') route = '/';
  routeMap.set(route, hashes);
}

// Global fallback hashes (from 404 or index)
const defaultHashes = routeMap.get('/') || new Set();

let text = `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  X-Frame-Options: DENY
${['true', '1'].includes(process.env.NEXT_PUBLIC_DEMO_WATERMARK?.trim().toLowerCase()) ? '  X-Robots-Tag: noindex, nofollow\n' : ''}
/
  Content-Security-Policy: ${buildCsp(routeMap.get('/') || defaultHashes)}
`;

for (const [route, hashes] of routeMap.entries()) {
  if (route === '/') continue;
  text += `\n${route}\n  Content-Security-Policy: ${buildCsp(hashes)}\n${route}/*\n  Content-Security-Policy: ${buildCsp(hashes)}\n`;
}

text += `
/frames/desktop/*
  Cache-Control: public, max-age=31536000, immutable
/frames/hero-manifest.json
  Cache-Control: no-cache
/frames/pc/*
  Cache-Control: public, max-age=31536000, immutable
/frames/mobile/*
  Cache-Control: public, max-age=31536000, immutable
/frames/manifest.json
  Cache-Control: no-cache
/video/*
  Cache-Control: public, max-age=3600
/_next/static/*
  Cache-Control: public, max-age=31536000, immutable
`;

if (text.split('\n').some((line) => line.length > 2000)) {
  throw Error('Cloudflare _headers: linha excede 2000 caracteres; reduza ou separe a CSP por rota.');
}

await writeFile('out/_headers', text);
console.log('Cabeçalhos gerados com hashes CSP por rota e indexação condicional');
