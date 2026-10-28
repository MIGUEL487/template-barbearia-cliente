import sharp from 'sharp';
import assert from 'node:assert/strict';
import {readdir,readFile,writeFile,mkdtemp,copyFile,stat,rm,cp} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';

const source=process.argv[2];
if(!source)throw Error('Informe a pasta dos novos JPEGs de PC.');
const names=(await readdir(source)).filter(n=>/^ezgif-frame-\d+\.jpg$/i.test(n)).sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));
assert(names.length>0,'Nenhum frame JPEG encontrado');
const manifest=JSON.parse(await readFile('public/frames/manifest.json','utf8'));
const previousMobile=JSON.stringify(manifest.mobile);
const stage=await mkdtemp(join(tmpdir(),'refugio-pc-import-'));
try{
 let width=0,height=0,bytes=0,maxBytes=0;
 for(const name of names){
  const path=join(source,name),meta=await sharp(path).metadata();
  if(!width){width=meta.width;height=meta.height}
  assert(meta.width===width&&meta.height===height,'Frames com dimensões diferentes');
  assert(width>height,'O conjunto PC precisa ser paisagem');
  const size=(await stat(path)).size;bytes+=size;maxBytes=Math.max(maxBytes,size);
  // Preserve the supplied JPEG bytes: no upscaling or extra lossy conversion.
  await copyFile(path,join(stage,name));
 }
 const buf=await sharp(join(source,names.at(-1))).extract({left:0,top:height-16,width,height:16}).resize(1,1).removeAlpha().raw().toBuffer();
 const bottomColor='#'+[...buf].slice(0,3).map(n=>n.toString(16).padStart(2,'0')).join('');
 await copyFile(join(source,names[0]),join(stage,'poster-hq.jpg'));
 await rm('public/frames/pc',{recursive:true,force:true});
 await cp(stage,'public/frames/pc',{recursive:true});
 manifest.pc={width,height,count:names.length,format:'jpeg',bytes,maxBytes,bottomColor,dimensions:[`${width}×${height}`],poster:'/frames/pc/poster-hq.jpg',frames:names.map(n=>`/frames/pc/${n}`)};
 assert.equal(JSON.stringify(manifest.mobile),previousMobile,'O conjunto móvel foi alterado');
 await writeFile('public/frames/manifest.json',JSON.stringify(manifest,null,2));
 await writeFile('docs/assets-measured.json',JSON.stringify(manifest,null,2));
 console.log({...manifest.pc,frames:`${names.length} JPEGs preservados`,mobile:'inalterado'});
}finally{await rm(stage,{recursive:true,force:true})}
