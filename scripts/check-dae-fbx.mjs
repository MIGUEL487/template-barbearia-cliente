import fs from 'node:fs';

const dae = fs.readFileSync('refs/27-hair-trimmer/Hair Trimmer.dae', 'utf8');
console.log('DAE size:', dae.length);
console.log('DAE has NORMAL:', dae.includes('semantic="NORMAL"'));
console.log('DAE has TEXCOORD:', dae.includes('semantic="TEXCOORD"'));
console.log('DAE has materials:', dae.includes('<library_materials>'));

const fbxStat = fs.statSync('refs/27-hair-trimmer/Hair Trimmer.fbx');
console.log('FBX size:', fbxStat.size);
