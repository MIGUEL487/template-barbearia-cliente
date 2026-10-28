// Ported from MIGUEL487/Template-padaria @ 9e3ee14. Framework-independent player.
import manifest from '../../config/frames.json'
import {framePlayer} from './frame-player'
import {desktopPlayer} from './desktop-player'

// Native H.264 decoding replaces per-image JS decoding on the normal path.
// The original sequential canvas player remains available if video is unsupported.
export async function heroPlayer(root:HTMLElement,canvas:HTMLCanvasElement,poster:HTMLImageElement,onReady:(color:string)=>void,onDraw:(index:number)=>void){
 if(new URLSearchParams(location.search).get('renderer')!=='video')return framePlayer(root,canvas,poster,onReady,onDraw)
 const mobile=matchMedia('(max-width:768px), (orientation:portrait)').matches,key=mobile?'mobile':'pc',set=manifest[key],fps=30
 if(!mobile)return desktopPlayer(root,canvas,poster,onReady,onDraw)
 const videos=[document.createElement('video'),document.createElement('video')]
 let disposed=false,failed=false,active=0,switching=false,playing=false,target=0,drawn=-1,painted=0,waiting=0,raf:number|undefined
 let fallback:Awaited<ReturnType<typeof framePlayer>>|undefined
 const handles:(number|undefined)[]=[],removers:(()=>void)[]=[]
 const listen=(v:HTMLVideoElement,event:string,fn:()=>void)=>{v.addEventListener(event,fn);removers.push(()=>v.removeEventListener(event,fn))}
 const logical=(i:number,time:number)=>Math.max(0,Math.min(set.count-1,i===0?Math.round(time*fps):set.count-1-Math.round(time*fps)))
 function present(i:number,index:number){if(disposed||failed||i!==active||switching||videos[i]!.readyState<2)return;videos[i]!.style.opacity='1';videos[1-i]!.style.opacity='0';if(drawn!==index){drawn=index;painted++;canvas.dataset.frame=String(index);onDraw(index)}}
 function needed(){return active===0?drawn<target:drawn>target}
 function stop(){videos[active]!.pause()}
 function check(i:number,time:number){if(i!==active||switching)return;present(i,logical(i,time));if(!needed())stop()}
 function play(){
  if(disposed||failed||document.hidden||switching||playing)return
  const v=videos[active]!
  if(!needed()){stop();return}
  if(v.readyState<3||!v.paused)return
  playing=true
  void v.play().catch(error=>{if(!disposed&&error.name!=='AbortError')void fail()}).finally(()=>{playing=false;if(!disposed&&!failed&&needed()&&videos[active]!.paused)play()})
 }
 function observe(i:number){
  const v=videos[i]!
  if('requestVideoFrameCallback'in v){handles[i]=v.requestVideoFrameCallback((_,metadata)=>{handles[i]=undefined;if(disposed||failed)return;check(i,metadata.mediaTime);observe(i)})}
 }
 function poll(){raf=undefined;if(disposed||failed)return;const v=videos[active]!;if(typeof v.requestVideoFrameCallback!=='function')check(active,v.currentTime);if(!v.paused)raf=requestAnimationFrame(poll)}
 function setSource(i:number){const v=videos[i]!;if(!v.getAttribute('src')){v.src=`/video/${key}${i?'-reverse':''}.mp4`;v.load()}}
 function seekCurrent(){const v=videos[active]!;if(!switching||v.readyState<1)return;const time=(active===0?Math.max(0,drawn):set.count-1-Math.max(0,drawn))/fps;if(Math.abs(v.currentTime-time)<.001&&v.readyState>=2){switching=false;present(active,logical(active,v.currentTime));play()}else v.currentTime=time}
 function changeDirection(i:number){videos[active]!.pause();active=i;switching=true;setSource(i);seekCurrent()}
 function teardownVideo(){if(raf!==undefined)cancelAnimationFrame(raf);removers.forEach(remove=>remove());for(const [i,v]of videos.entries()){if(handles[i]!==undefined)v.cancelVideoFrameCallback(handles[i]!);v.pause();v.removeAttribute('src');v.load();v.remove()}}
 async function fail(){
  if(failed||disposed)return;failed=true;teardownVideo();root.dataset.renderer='canvas-fallback'
  try{const p=await framePlayer(root,canvas,poster,onReady,onDraw);if(disposed){p.dispose();return}fallback=p;p.set(target/(set.count-1))}catch{root.classList.add('native-motion')}
 }
 onReady(set.bottomColor);poster.src=set.poster;root.dataset.renderer='native-video'
 for(const [i,v]of videos.entries()){
  v.className='hero-video';v.muted=true;v.defaultMuted=true;v.playsInline=true;v.preload=i===0?'auto':'none';v.disablePictureInPicture=true;v.disableRemotePlayback=true;v.setAttribute('aria-hidden','true');v.style.opacity='0';root.insertBefore(v,canvas)
  listen(v,'error',()=>void fail())
  listen(v,'loadedmetadata',()=>{if(i===active)seekCurrent()})
  listen(v,'loadeddata',()=>{if(i===active&&!switching){present(i,logical(i,v.currentTime));play()}})
  listen(v,'canplay',()=>{if(i===active){if(switching)seekCurrent();else play()}})
  listen(v,'seeked',()=>{if(i===active){switching=false;present(i,logical(i,v.currentTime));play()}})
  listen(v,'playing',()=>{if(raf===undefined)raf=requestAnimationFrame(poll)})
  listen(v,'waiting',()=>{waiting++})
  listen(v,'ended',()=>check(i,(set.count-1)/fps))
  observe(i)
 }
 const visibility=()=>{if(document.hidden)videos.forEach(v=>v.pause());else play()};document.addEventListener('visibilitychange',visibility)
 if(!videos[0]!.canPlayType('video/mp4; codecs="avc1.64001f"'))void fail();else setSource(0)
 return {count:set.count,set(progress:number){target=Math.max(0,Math.min(set.count-1,Math.round(progress*(set.count-1))));if(fallback){fallback.set(progress);return}if(failed||disposed)return;if(drawn<0)return;const direction=target<drawn?1:target>drawn?0:active;if(direction!==active)changeDirection(direction);else play()},dispose(){disposed=true;document.removeEventListener('visibilitychange',visibility);teardownVideo();fallback?.dispose()},stats(){if(fallback)return{...fallback.stats(),renderer:'canvas-fallback'};const v=videos[active]!,quality=v.getVideoPlaybackQuality();return{renderer:'native-video',target,drawn,painted,backlog:Math.abs(target-Math.max(0,drawn)),waiting,droppedFrames:quality.droppedVideoFrames,totalVideoFrames:quality.totalVideoFrames,width:v.videoWidth,height:v.videoHeight,sourceWidth:set.width,sourceHeight:set.height,decoded:0,compressed:0}}}
}
