import sharp from 'sharp';
import {readdir,readFile,writeFile,mkdir,copyFile,rm,stat} from 'node:fs/promises';
const root=process.argv[2];if(!root)throw Error('Informe a pasta atualizada dos dois conjuntos e fotos. Para substituir só PC, use replace-pc-frames.mjs.');
const manifest={};await mkdir('public/images',{recursive:true});
for(const [set,folder]of [['pc','pc/pc'],['mobile','mobile/celular']]){
 const dir=`${root}/${folder}`;const names=(await readdir(dir)).filter(n=>/^frame_\d+\.webp$/.test(n)).sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));
 await rm(`public/frames/${set}`,{recursive:true,force:true});await mkdir(`public/frames/${set}`,{recursive:true});
 const dimensions=new Set();let bytes=0,maxBytes=0;
 for(const name of names){const p=`${dir}/${name}`,meta=await sharp(p).metadata();dimensions.add(`${meta.width}×${meta.height}`);const size=(await stat(p)).size;bytes+=size;maxBytes=Math.max(size,maxBytes);await copyFile(p,`public/frames/${set}/${name}`)}
 const {width,height}=await sharp(`${dir}/${names[0]}`).metadata();
 const buf=await sharp(`${dir}/${names.at(-1)}`).extract({left:0,top:height-16,width,height:16}).resize(1,1).removeAlpha().raw().toBuffer();
 const bottomColor='#'+[...buf].slice(0,3).map(x=>x.toString(16).padStart(2,'0')).join('');
 await copyFile(`${dir}/${names[0]}`,`public/frames/${set}/poster.webp`);
 manifest[set]={width,height,count:names.length,bytes,maxBytes,bottomColor,dimensions:[...dimensions],poster:`/frames/${set}/poster.webp`,frames:names.map(n=>`/frames/${set}/${n}`)};
}
await writeFile('public/frames/manifest.json',JSON.stringify(manifest,null,2));await writeFile('docs/assets-measured.json',JSON.stringify(manifest,null,2));
const photos=[];
for(const n of await readdir(`${root}/photos/Imagem`)){if(!n.endsWith('.webp'))continue;const id=n.replace('.webp','');const input=`${root}/photos/Imagem/${n}`;const m=await sharp(input).metadata();for(const w of [640,960,1440]){await sharp(input).resize({width:w,withoutEnlargement:true}).webp({quality:80}).toFile(`public/images/${id}-${w}.webp`);await sharp(input).resize({width:w,withoutEnlargement:true}).avif({quality:48,effort:2}).toFile(`public/images/${id}-${w}.avif`)}photos.push({file:n,width:m.width,height:m.height,bytes:(await stat(input)).size})}
await writeFile('docs/photo-measured.json',JSON.stringify(photos,null,2));console.log(Object.fromEntries(Object.entries(manifest).map(([k,v])=>[k,{...v,frames:`${v.count} real frames`}])));console.log(photos);
