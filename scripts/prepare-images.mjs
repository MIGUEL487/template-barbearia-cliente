import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';
const dir='public/demo/auto-stilo';
await mkdir(`${dir}/optimized`,{recursive:true});
for(const name of await readdir(dir)) {
 if(!/\.(jpe?g|png|webp|avif)$/i.test(name)) continue;
 for(const width of [480,960,1600]) for(const format of ['webp','avif']) {
  await sharp(path.join(dir,name)).rotate().resize({width,withoutEnlargement:true}).toFormat(format,{quality:76}).toFile(`${dir}/optimized/${path.parse(name).name}-${width}.${format}`);
 }
 await sharp(path.join(dir,name)).resize(24).webp({quality:30}).toFile(`${dir}/optimized/${path.parse(name).name}-blur.webp`);
}
console.log('Imagens preparadas; SVGs vetoriais de placeholder preservados.');
