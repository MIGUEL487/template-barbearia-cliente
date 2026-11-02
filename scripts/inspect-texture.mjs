import sharp from 'sharp';

const metadata = await sharp('refs/27-hair-trimmer/Hairtrimmer_basecolor.jpg').metadata();
console.log('Metadados da textura Hairtrimmer_basecolor.jpg:', metadata);
