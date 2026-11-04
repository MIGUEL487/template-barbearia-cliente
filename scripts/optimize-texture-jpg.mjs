import sharp from 'sharp';
import path from 'node:path';

const destDir = path.resolve('public/models/hair-clipper/textures');
const jpgPath = path.join(destDir, 'auto-stilo-basecolor.jpg');

await sharp(path.join(destDir, 'auto-stilo-basecolor.png'))
  .jpeg({ quality: 92, mozjpeg: true })
  .toFile(jpgPath);

const stat = await sharp(jpgPath).metadata();
console.log('JPEG gerado com sucesso! Tamanho:', (stat.size / 1024).toFixed(1), 'KB');
