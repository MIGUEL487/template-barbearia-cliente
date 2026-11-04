import sharp from 'sharp';

const p = 'C:/Users/Windows/.gemini/antigravity/brain/4ceefa96-88d0-4621-b1fa-b3d647948612/.user_uploaded/media_1793569212048_8d4b7270.jpg';
const meta = await sharp(p).metadata();
console.log('User image 3 metadata:', meta);
