import fs from 'fs';
import path from 'path';

const landingCssPath = path.resolve('src/styles/landing.css');
let content = fs.readFileSync(landingCssPath, 'utf8');

content = content.replace(
  `.cinematic .hero-picture,
.cinematic canvas,
.cinematic .shade {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}`,
  `.cinematic .hero-picture,
.cinematic canvas,
.cinematic .shade {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
}`
);

fs.writeFileSync(landingCssPath, content, 'utf8');
console.log('Added pointer-events: none to .cinematic canvas');
