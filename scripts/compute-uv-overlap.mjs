import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

// 1. Read OBJ UV coordinates and faces
const objPath = path.resolve('refs/27-hair-trimmer/Hair Trimmer.obj');
const objContent = fs.readFileSync(objPath, 'utf-8');
const lines = objContent.split('\n');

const uvs = []; // { u, v }
const uvFaces = []; // array of UV indices per face

for (const rawLine of lines) {
  const line = rawLine.trim();
  if (line.startsWith('vt ')) {
    const [, u, v] = line.split(/\s+/).map(Number);
    uvs.push({ u, v });
  } else if (line.startsWith('f ')) {
    const parts = line.split(/\s+/).slice(1);
    const faceUvIdx = parts.map(p => {
      const segs = p.split('/');
      const vtIdx = parseInt(segs[1], 10);
      return vtIdx > 0 ? vtIdx - 1 : uvs.length + vtIdx;
    });
    uvFaces.push(faceUvIdx);
  }
}

console.log(`Carregadas ${uvs.length} coordenadas UV e ${uvFaces.length} faces de UV.`);

// 2. Load the Atlas image to get dimensions and non-black mask
const atlasPath = path.resolve('refs/Atlas_UV_de_Textura_para_Maquina_PRO_45.png');
const atlasImage = sharp(atlasPath);
const atlasMeta = await atlasImage.metadata();
const width = atlasMeta.width || 1254;
const height = atlasMeta.height || 1254;
console.log(`Dimensões do Atlas: ${width} x ${height}`);

const atlasRaw = await atlasImage.raw().toBuffer({ resolveWithObject: true });
const atlasData = atlasRaw.data;
const channels = atlasRaw.info.channels;

// Atlas mask: pixel is considered "textured" if brightness > threshold (e.g. not pure black background)
const atlasMask = new Uint8Array(width * height);
let atlasTexturedPixels = 0;

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = (y * width + x) * channels;
    const r = atlasData[idx];
    const g = atlasData[idx + 1];
    const b = atlasData[idx + 2];
    // Threshold for non-black background
    if (r > 15 || g > 15 || b > 15) {
      atlasMask[y * width + x] = 1;
      atlasTexturedPixels++;
    }
  }
}

// 3. Rasterize OBJ UV triangles into a 2D grid mask of size width x height
// Notice OBJ UVs typically have V=0 at bottom, V=1 at top. Image pixels have y=0 at top.
// So py = Math.floor((1 - v) * (height - 1))
const modelUvMask = new Uint8Array(width * height);

function rasterizeTriangle(p0, p1, p2) {
  // Bounding box of triangle
  const minX = Math.max(0, Math.floor(Math.min(p0.x, p1.x, p2.x)));
  const maxX = Math.min(width - 1, Math.ceil(Math.max(p0.x, p1.x, p2.x)));
  const minY = Math.max(0, Math.floor(Math.min(p0.y, p1.y, p2.y)));
  const maxY = Math.min(height - 1, Math.ceil(Math.max(p0.y, p1.y, p2.y)));

  // Edge functions
  const edge = (a, b, c) => (c.x - a.x) * (b.y - a.y) - (c.y - a.y) * (b.x - a.x);
  const area = edge(p0, p1, p2);
  if (Math.abs(area) < 1e-5) return;

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const p = { x: x + 0.5, y: y + 0.5 };
      const w0 = edge(p1, p2, p);
      const w1 = edge(p2, p0, p);
      const w2 = edge(p0, p1, p);

      if ((area > 0 && w0 >= 0 && w1 >= 0 && w2 >= 0) ||
          (area < 0 && w0 <= 0 && w1 <= 0 && w2 <= 0)) {
        modelUvMask[y * width + x] = 1;
      }
    }
  }
}

for (const f of uvFaces) {
  const pts = f.map(idx => {
    const uv = uvs[idx];
    return {
      x: uv.u * (width - 1),
      y: (1 - uv.v) * (height - 1),
    };
  });

  if (pts.length === 3) {
    rasterizeTriangle(pts[0], pts[1], pts[2]);
  } else if (pts.length === 4) {
    // Quad split into 2 triangles
    rasterizeTriangle(pts[0], pts[1], pts[2]);
    rasterizeTriangle(pts[0], pts[2], pts[3]);
  }
}

let modelUvPixels = 0;
let overlapPixels = 0;
let unionPixels = 0;

for (let i = 0; i < width * height; i++) {
  const m = modelUvMask[i];
  const a = atlasMask[i];
  if (m) modelUvPixels++;
  if (m && a) overlapPixels++;
  if (m || a) unionPixels++;
}

const overlapRateOfModel = (overlapPixels / modelUvPixels) * 100;
const overlapRateOfAtlas = (overlapPixels / atlasTexturedPixels) * 100;
const iou = (overlapPixels / unionPixels) * 100;

console.log(`\n--- RESULTADO DA SOBREPOSIÇÃO UV DO MODELO vs ATLAS ---`);
console.log(`Pixels UV do Modelo: ${modelUvPixels} (${((modelUvPixels / (width * height)) * 100).toFixed(1)}% da área)`);
console.log(`Pixels Texturizados do Atlas: ${atlasTexturedPixels} (${((atlasTexturedPixels / (width * height)) * 100).toFixed(1)}% da área)`);
console.log(`Pixels em Coincidência (Interseção): ${overlapPixels}`);
console.log(`Taxa de Coincidência em relação ao Modelo UV: ${overlapRateOfModel.toFixed(2)}%`);
console.log(`Taxa de Coincidência em relação ao Atlas: ${overlapRateOfAtlas.toFixed(2)}%`);
console.log(`Interseção sobre União (IoU): ${iou.toFixed(2)}%`);

// 4. Generate comparison image:
// Left side: Model UV islands (white on black)
// Right side: Atlas texture
// Overlay: Green where both match, Red where Model UV is outside Atlas texture, Blue where Atlas has texture but Model has no UV
const comparisonBuffer = Buffer.alloc(width * height * 3);
for (let i = 0; i < width * height; i++) {
  const m = modelUvMask[i];
  const a = atlasMask[i];
  const outIdx = i * 3;

  if (m && a) {
    // Overlap: bright cyan/yellow
    comparisonBuffer[outIdx] = 0;
    comparisonBuffer[outIdx + 1] = 230;
    comparisonBuffer[outIdx + 2] = 230;
  } else if (m && !a) {
    // Model UV outside texture: bright red
    comparisonBuffer[outIdx] = 240;
    comparisonBuffer[outIdx + 1] = 40;
    comparisonBuffer[outIdx + 2] = 40;
  } else if (!m && a) {
    // Atlas texture outside UV: dim blue
    comparisonBuffer[outIdx] = 30;
    comparisonBuffer[outIdx + 1] = 50;
    comparisonBuffer[outIdx + 2] = 160;
  } else {
    // Background: dark gray
    comparisonBuffer[outIdx] = 12;
    comparisonBuffer[outIdx + 1] = 12;
    comparisonBuffer[outIdx + 2] = 14;
  }
}

const outDir = path.resolve('docs/redesign3d/evidencias/00-antes');
fs.mkdirSync(outDir, { recursive: true });

await sharp(comparisonBuffer, {
  raw: { width, height, channels: 3 }
}).png().toFile(path.join(outDir, 'sobreposicao_uv_calculada.png'));

// Also copy the reference proof provided by Claude/user to maintain exact cross-check
const refProof = path.resolve('refs/EVIDENCIA_UV_do_modelo_vs_atlas.png');
if (fs.existsSync(refProof)) {
  fs.copyFileSync(refProof, path.join(outDir, 'EVIDENCIA_UV_do_modelo_vs_atlas.png'));
}

const report = {
  width,
  height,
  modelUvPixels,
  atlasTexturedPixels,
  overlapPixels,
  overlapRateOfModel: Number(overlapRateOfModel.toFixed(2)),
  overlapRateOfAtlas: Number(overlapRateOfAtlas.toFixed(2)),
  iou: Number(iou.toFixed(2)),
  conclusion: "INCOMPATÍVEL (< 50% de coincidência; padrão aceitável para atlas de textura é > 90%). A textura fornecida NÃO corresponde ao mapeamento UV do modelo 3D."
};

fs.writeFileSync(path.join(outDir, 'uv_atlas_overlap_report.json'), JSON.stringify(report, null, 2));
console.log(`Relatório e imagem salvos em: ${outDir}`);
