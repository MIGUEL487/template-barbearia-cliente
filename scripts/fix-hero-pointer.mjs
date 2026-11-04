import fs from 'fs';
import path from 'path';

const landingCssPath = path.resolve('src/styles/landing.css');
let content = fs.readFileSync(landingCssPath, 'utf8');

// Fix pointer events on hero-copy and z-index on hero-skip-intro
content = content.replace(
  `.cinematic .hero-copy {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  max-width: 1240px;
  margin-inline: auto;
  padding-inline: 24px;
  z-index: 10;
}`,
  `.cinematic .hero-copy {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  max-width: 1240px;
  margin-inline: auto;
  padding-inline: 24px;
  z-index: 10;
  pointer-events: none;
}
.cinematic .hero-copy > * {
  pointer-events: auto;
}`
);

content = content.replace(
  `.hero-skip-intro {
  position: fixed;
  top: calc(16px + env(safe-area-inset-top, 0px));
  left: 50%;
  right: auto;
  transform: translateX(-50%);
  z-index: 60;`,
  `.hero-skip-intro {
  position: fixed;
  top: calc(16px + env(safe-area-inset-top, 0px));
  left: 50%;
  right: auto;
  transform: translateX(-50%);
  z-index: 100;
  pointer-events: auto;`
);

fs.writeFileSync(landingCssPath, content, 'utf8');
console.log('Fixed pointer events and z-index in landing.css');
