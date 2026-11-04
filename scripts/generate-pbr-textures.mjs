import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const TEXTURES_DIR = path.resolve('public/models/hair-clipper/textures');
fs.mkdirSync(TEXTURES_DIR, { recursive: true });

const SIZE = 512;

// 1. Generate Polymer Micro-grain Normal Map (fine pebble texture for body shell)
console.log('Gerando textura de micro-grão de polímero (polymer_normal.png)...');
const polymerNormalBuffer = Buffer.alloc(SIZE * SIZE * 3);

// Deterministic pseudo-random / simplex-style noise
function hash2d(x, y) {
  let h = (x * 374761393 + y * 668265263) ^ 0x5bf03635;
  h = (h ^ (h >> 13)) * 1274126177;
  return ((h ^ (h >> 16)) & 0x7fffffff) / 0x7fffffff;
}

// Generate height map with 2 octaves of fine grain
const heightMap = new Float32Array(SIZE * SIZE);
for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    const n1 = hash2d(x, y);
    const n2 = hash2d(Math.floor(x / 2), Math.floor(y / 2));
    const h = (n1 * 0.7 + n2 * 0.3);
    heightMap[y * SIZE + x] = h;
  }
}

// Sobel-like filter to convert height to normal map [R, G, B] -> [X, Y, Z]
const STRENGTH = 1.8;
for (let y = 0; y < SIZE; y++) {
  const yPrev = (y - 1 + SIZE) % SIZE;
  const yNext = (y + 1) % SIZE;
  for (let x = 0; x < SIZE; x++) {
    const xPrev = (x - 1 + SIZE) % SIZE;
    const xNext = (x + 1) % SIZE;

    const dx = (heightMap[y * SIZE + xNext] - heightMap[y * SIZE + xPrev]) * STRENGTH;
    const dy = (heightMap[yNext * SIZE + x] - heightMap[yPrev * SIZE + x]) * STRENGTH;
    const dz = 1.0;

    // Normalize
    const len = Math.hypot(dx, dy, dz);
    const nx = dx / len;
    const ny = dy / len;
    const nz = dz / len;

    const idx = (y * SIZE + x) * 3;
    // Map [-1, 1] to [0, 255]
    polymerNormalBuffer[idx] = Math.round((nx * 0.5 + 0.5) * 255);
    polymerNormalBuffer[idx + 1] = Math.round((ny * 0.5 + 0.5) * 255);
    polymerNormalBuffer[idx + 2] = Math.round((nz * 0.5 + 0.5) * 255);
  }
}

await sharp(polymerNormalBuffer, { raw: { width: SIZE, height: SIZE, channels: 3 } })
  .png()
  .toFile(path.join(TEXTURES_DIR, 'polymer_normal.png'));

// 2. Generate Brushed Steel Normal Map (fine horizontal streaks for CNC blades)
console.log('Gerando textura de fresagem de aço escovado (brushed_steel_normal.png)...');
const brushedNormalBuffer = Buffer.alloc(SIZE * SIZE * 3);
const brushedRoughBuffer = Buffer.alloc(SIZE * SIZE * 3);

// 1D horizontal noise stretched across X
const lineNoise = new Float32Array(SIZE);
for (let y = 0; y < SIZE; y++) {
  lineNoise[y] = hash2d(y * 13, 999);
}

for (let y = 0; y < SIZE; y++) {
  const yPrev = (y - 1 + SIZE) % SIZE;
  const yNext = (y + 1) % SIZE;
  const hCurr = lineNoise[y];
  const hPrev = lineNoise[yPrev];
  const hNext = lineNoise[yNext];

  const dy = (hNext - hPrev) * 2.2;
  const dx = (hash2d(y, 111) - 0.5) * 0.2;
  const dz = 1.0;
  const len = Math.hypot(dx, dy, dz);

  const nx = dx / len;
  const ny = dy / len;
  const nz = dz / len;

  const rVal = Math.round(nx * 127 + 128);
  const gVal = Math.round(ny * 127 + 128);
  const bVal = Math.round(nz * 127 + 128);

  const roughVal = Math.round(50 + hCurr * 40); // 0.20 to 0.35 roughness range

  for (let x = 0; x < SIZE; x++) {
    const idx = (y * SIZE + x) * 3;
    brushedNormalBuffer[idx] = rVal;
    brushedNormalBuffer[idx + 1] = gVal;
    brushedNormalBuffer[idx + 2] = bVal;

    brushedRoughBuffer[idx] = roughVal;
    brushedRoughBuffer[idx + 1] = roughVal;
    brushedRoughBuffer[idx + 2] = roughVal;
  }
}

await sharp(brushedNormalBuffer, { raw: { width: SIZE, height: SIZE, channels: 3 } })
  .png()
  .toFile(path.join(TEXTURES_DIR, 'brushed_steel_normal.png'));

await sharp(brushedRoughBuffer, { raw: { width: SIZE, height: SIZE, channels: 3 } })
  .png()
  .toFile(path.join(TEXTURES_DIR, 'brushed_steel_roughness.png'));

console.log('Texturas PBR procedurais de alta fidelidade geradas com sucesso em:', TEXTURES_DIR);
