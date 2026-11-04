import { createExtractorFromData } from 'node-unrar-js';
import fs from 'node:fs';
import path from 'node:path';

const rar1 = 'C:/Users/Windows/.gemini/antigravity/brain/4ceefa96-88d0-4621-b1fa-b3d647948612/.user_uploaded/media_1793493175248_dfcce451.rar';
const rar2 = 'C:/Users/Windows/.gemini/antigravity/brain/4ceefa96-88d0-4621-b1fa-b3d647948612/.user_uploaded/media_1793493513787_db5d8690.rar';

const destDir = path.resolve('public/models/hair-clipper');
fs.mkdirSync(destDir, { recursive: true });

async function extractRar(rarPath, name) {
  console.log(`\n--- Extraindo ${name} ---`);
  const buf = fs.readFileSync(rarPath);
  const extractor = await createExtractorFromData({ data: buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) });
  const list = extractor.getFileList();
  console.log('Arquivos no arquivo RAR:');
  for (const h of list.fileHeaders) {
    console.log(` - ${h.name} (${h.unpSize} bytes)`);
  }

  const extracted = extractor.extract();
  for (const file of extracted.files) {
    if (file.fileHeader.flags.directory) continue;
    const outPath = path.join(destDir, file.fileHeader.name);
    fs.writeFileSync(outPath, Buffer.from(file.extraction));
    console.log(`Extraído: ${file.fileHeader.name} -> ${file.extraction.length} bytes`);
  }
}

async function main() {
  await extractRar(rar1, '27-hair-trimmer.rar');
  await extractRar(rar2, '11-hairtrimmer_textures_reduzido.rar');

  console.log('\n--- Verificação pós-extração ---');
  const files = fs.readdirSync(destDir);
  for (const f of files) {
    const p = path.join(destDir, f);
    const stat = fs.statSync(p);
    console.log(`${f}: ${stat.size} bytes`);
  }

  // Verificar o JPG
  const jpgPath = path.join(destDir, 'Hairtrimmer_basecolor.jpg');
  if (fs.existsSync(jpgPath)) {
    const buf = fs.readFileSync(jpgPath);
    console.log(`\nJPG Header: ${buf[0].toString(16)} ${buf[1].toString(16)} (deve ser ff d8)`);
    console.log(`JPG Trailer: ${buf[buf.length-2].toString(16)} ${buf[buf.length-1].toString(16)} (deve ser ff d9)`);
  }
}

main().catch(console.error);
