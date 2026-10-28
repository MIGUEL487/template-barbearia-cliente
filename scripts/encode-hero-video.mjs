import {readFile,mkdir,mkdtemp,symlink,rm,writeFile,stat} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve,extname} from 'node:path';
import {execFileSync} from 'node:child_process';
const manifest=JSON.parse(await readFile('public/frames/manifest.json','utf8')),report={};
const desktop=process.argv.includes('--desktop-gsap');
await mkdir('public/video',{recursive:true});
for(const key of desktop?['pc']:['mobile','pc']){
 const set=manifest[key],ext=extname(set.frames[0]),stage=await mkdtemp(join(tmpdir(),'refugio-video-'));
 try{
  for(const reverse of [false,true]){
   const folder=join(stage,reverse?'reverse':'forward');await mkdir(folder);
   const files=reverse?[...set.frames].reverse():set.frames;
   for(let i=0;i<files.length;i++)await symlink(resolve('public'+files[i]),join(folder,`${String(i+1).padStart(3,'0')}${ext}`));
   const name=`${key}${desktop?'-gsap':''}${reverse?'-reverse':''}.mp4`,out=`public/video/${name}`;
   execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-framerate','30','-i',join(folder,`%03d${ext}`),'-an','-c:v','libx264','-preset','medium','-crf','23','-pix_fmt','yuv420p','-profile:v','high',...(desktop?['-g','15','-keyint_min','15','-sc_threshold','0','-bf','0']:[]),'-movflags','+faststart',out]);
   const probe=JSON.parse(execFileSync('ffprobe',['-v','error','-select_streams','v:0','-show_entries','stream=nb_frames,width,height,r_frame_rate','-of','json',out],{encoding:'utf8'})).streams[0];
   if(Number(probe.nb_frames)!==set.count||probe.width!==set.width||probe.height!==set.height)throw Error('Video differs from source sequence');
   report[name]={...probe,bytes:(await stat(out)).size};console.log(name,report[name]);
  }
 }finally{await rm(stage,{recursive:true,force:true})}
}
await writeFile(desktop?'docs/desktop-video-assets.json':'docs/video-assets.json',JSON.stringify(report,null,2));
