import { createExtractorFromFile } from 'node-unrar-js';
import path from 'node:path';
import fs from 'node:fs';

const rarPath = 'C:/Users/Windows/.gemini/antigravity/brain/4ceefa96-88d0-4621-b1fa-b3d647948612/.user_uploaded/media_1793493513787_db5d8690.rar';
const targetDir = path.resolve('refs/27-hair-trimmer');

async function extract() {
  console.log('Extraindo rar...');
  const extractor = await createExtractorFromFile({ filepath: rarPath, targetPath: targetDir });
  const list = extractor.getFileList();
  const fileHeaders = [...list.fileHeaders];
  console.log('Arquivos encontrados no RAR:', fileHeaders.map(h => h.name));
  const extracted = extractor.extract({ files: ['Hairtrimmer_basecolor.jpg'] });
  for (const f of [...extracted.files]) {
    console.log('Props de f:', Object.keys(f), 'extraction type:', typeof f.extraction);
    if (f.extraction) {
      fs.writeFileSync(path.join(targetDir, f.fileHeader.name), Buffer.from(f.extraction));
      console.log('Salvo com sucesso!');
    }
  }
}

extract().catch(console.error);
