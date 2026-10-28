import {readdir,readFile,writeFile} from 'node:fs/promises';import {createHash} from 'node:crypto';
async function html(dir){let out=[];for(const e of await readdir(dir,{withFileTypes:true})){const p=dir+'/'+e.name;if(e.isDirectory())out.push(...await html(p));else if(p.endsWith('.html'))out.push(p)}return out}
const hashes=new Set();for(const f of await html('out')){const s=await readFile(f,'utf8');for(const m of s.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))if(m[1])hashes.add("'sha256-"+createHash('sha256').update(m[1]).digest('base64')+"'")}
const url=process.env.NEXT_PUBLIC_SUPABASE_URL;let connect="'self'";if(url){const u=new URL(url);if(!['https:','http:'].includes(u.protocol))throw new Error('Supabase URL inválida');connect+=' '+u.origin+' '+u.origin.replace(/^http/,'ws')}
const csp=`default-src 'self'; script-src 'self' ${[...hashes].join(' ')}; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; media-src 'self'; font-src 'self'; connect-src ${connect}; frame-src https://www.google.com; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'`;
const text=`/*
  Content-Security-Policy: ${csp}
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  X-Frame-Options: DENY
${process.env.NEXT_PUBLIC_DEMO_WATERMARK==='true'?'  X-Robots-Tag: noindex, nofollow\n':''}
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
await writeFile('out/_headers',text);console.log('Cabeçalhos gerados com hashes CSP e indexação condicional');
