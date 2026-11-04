import sharp from 'sharp';

// Let's crop the center front body of Hairtrimmer_basecolor.jpg
// 4096 x 4096
// Front body is in center: around x=2048, y=1500, w=1000, h=2000
const metadata = await sharp('refs/27-hair-trimmer/Hairtrimmer_basecolor.jpg').metadata();
console.log('Size:', metadata.width, metadata.height);

await sharp('refs/27-hair-trimmer/Hairtrimmer_basecolor.jpg')
  .extract({ left: 2200, top: 500, width: 800, height: 1200 })
  .toFile('docs/redesign3d/evidencias/02-stills/crop_texture_front.jpg');

console.log('Crop salvo!');
