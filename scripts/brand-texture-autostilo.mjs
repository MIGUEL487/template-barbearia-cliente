import sharp from 'sharp';
import path from 'node:path';

// Let's create the official Auto Stilo custom texture atlas
// 1024 x 1024 base from media_1793569212048_8d4b7270.jpg
const srcPath = 'C:/Users/Windows/.gemini/antigravity/brain/4ceefa96-88d0-4621-b1fa-b3d647948612/.user_uploaded/media_1793569212048_8d4b7270.jpg';
const destDir = path.resolve('public/models/hair-clipper/textures');

// We create an SVG overlay that cleanly masks the third-party logos:
// "PRO 45" is at x: 145..185, y: 220..315 (in 1024 space)
// "Life ByBaByLiss" is at x: 130..195, y: 470..640 (in 1024 space)
// "PROFESSIONAL" in red is at x: 285..295, y: 865..940 (in 1024 space)
// In the 1024 texture:
// Let's create a clean dark patch with subtle Auto Stilo branding:

const svgOverlay = Buffer.from(`
<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
  <!-- Clean patch over PRO 45 -->
  <rect x="140" y="215" width="48" height="110" rx="4" fill="#141416" />
  
  <!-- Clean patch over Life by BaByliss with Auto Stilo subtle typography -->
  <rect x="125" y="470" width="70" height="175" rx="6" fill="#141416" />
  <text x="160" y="555" 
        font-family="system-ui, -apple-system, sans-serif" 
        font-size="13" 
        font-weight="700" 
        letter-spacing="2"
        fill="#e2e8f0" 
        text-anchor="middle" 
        transform="rotate(-90 160 555)">AUTO STILO</text>

  <!-- Clean patch over red text -->
  <rect x="280" y="865" width="20" height="80" rx="2" fill="#141416" />
  <text x="290" y="905" 
        font-family="system-ui, -apple-system, sans-serif" 
        font-size="8" 
        font-weight="600" 
        letter-spacing="1"
        fill="#a855f7" 
        text-anchor="middle" 
        transform="rotate(-90 290 905)">EDITION</text>
</svg>
`);

await sharp(srcPath)
  .composite([{ input: svgOverlay, blend: 'over' }])
  .png({ quality: 100 })
  .toFile(path.join(destDir, 'auto-stilo-basecolor.png'));

console.log('Textura Auto Stilo gerada com sucesso em: auto-stilo-basecolor.png');
