import fs from 'fs';

const files = [
  'src/components/landing/catalog.tsx',
  'src/components/landing/editorial.tsx',
  'src/components/landing/sections.tsx'
];

for (const f of files) {
  let text = fs.readFileSync(f, 'utf8');
  text = text.replaceAll('>//<', ">{'//'}<");
  text = text.replaceAll('>02 // TRADIÇÃO & ATENÇÃO<', ">02 {'//'} TRADIÇÃO &amp; ATENÇÃO<");
  fs.writeFileSync(f, text, 'utf8');
}
console.log('Fixed JSX comments successfully.');
