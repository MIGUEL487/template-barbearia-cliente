import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const destDir = path.resolve('public/models/hair-clipper');
fs.mkdirSync(destDir, { recursive: true });

const rar1 = 'C:/Users/Windows/.gemini/antigravity/brain/4ceefa96-88d0-4621-b1fa-b3d647948612/.user_uploaded/media_1793493175248_dfcce451.rar';
const rar2 = 'C:/Users/Windows/.gemini/antigravity/brain/4ceefa96-88d0-4621-b1fa-b3d647948612/.user_uploaded/media_1793493513787_db5d8690.rar';

console.log('Extracting rar1 into', destDir);
execSync(`tar -xf "${rar1}" -C "${destDir}"`, { stdio: 'inherit' });

console.log('Extracting rar2 into', destDir);
execSync(`tar -xf "${rar2}" -C "${destDir}"`, { stdio: 'inherit' });

console.log('Extraction complete! Files in destination:');
const files = fs.readdirSync(destDir);
for (const f of files) {
  const stat = fs.statSync(path.join(destDir, f));
  console.log(` - ${f} (${(stat.size / 1024).toFixed(1)} KB)`);
}
