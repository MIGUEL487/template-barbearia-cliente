// Ported from MIGUEL487/Template-padaria @ 9e3ee14. Framework-independent player.
import gsap from 'gsap'
import manifest from '../../config/frames.json'
import {framePlayer} from './frame-player'

/** One desktop decoder. GSAP smooths demand; it never seeks per tick. */
export function desktopPlayer(root:HTMLElement,canvas:HTMLCanvasElement,poster:HTMLImageElement,onReady:(color:string)=>void,onDraw:(index:number)=>void){
 const set=manifest.pc,video=document.createElement('video'),demand={progress:0}
 let disposed=false,failed=false,target=0,drawn=-1,painted=0,intent=1,direction=1,switching=false,pendingPlay=false,lastInput=0,waiting=0,switches=0
 let handle:number|undefined,fallback:Awaited<ReturnType<typeof framePlayer>>|undefined
 const listeners:(()=>void)[]=[]
 const listen=(event:string,fn:()=>void)=>{video.addEventListener(event,fn);listeners.push(()=>video.removeEventListener(event,fn))}
 const follow=gsap.quickTo(demand,'progress',{duration:.18,ease:'power2.out'})
 const logical=(time:number)=>Math.max(0,Math.min(set.count-1,direction>0?Math.round(time*30):set.count-1-Math.round(time*30)))
 const goal=()=>Math.round(demand.progress*(set.count-1))
 const remaining=()=>direction*(goal()-drawn)
 function present(time:number){
  if(disposed||failed||switching||video.readyState<2)return
  if(video.style.opacity!=='1'){video.style.opacity='1';canvas.style.opacity='0'}
  const index=logical(time)
  if(index!==drawn){drawn=index;painted++;canvas.dataset.frame=String(index);onDraw(index)}
  if(remaining()<=0&&!video.paused)video.pause()
 }
 function observe(){if(typeof video.requestVideoFrameCallback==='function')handle=video.requestVideoFrameCallback((_,metadata)=>{handle=undefined;if(disposed||failed)return;present(metadata.mediaTime);observe()})}
 function settleSeek(){if(!switching||video.readyState<1)return;const time=(direction>0?Math.max(0,drawn):set.count-1-Math.max(0,drawn))/30;if(Math.abs(video.currentTime-time)<.001&&video.readyState>=2){switching=false;present(video.currentTime)}else video.currentTime=time}
 function changeDirection(next:number){
  // Retain one static frame while the single decoder changes source.
  if(video.readyState>=2){try{canvas.width=set.width;canvas.height=set.height;canvas.getContext('2d')?.drawImage(video,0,0);canvas.style.opacity='1'}catch{}}
  video.pause();video.style.opacity='0';direction=next;switching=true;switches++
  video.src=`/video/pc-gsap${direction<0?'-reverse':''}.mp4`;video.load()
 }
 function play(){if(pendingPlay||!video.paused||video.readyState<3)return;pendingPlay=true;void video.play().catch(error=>{if(!disposed&&error.name!=='AbortError')void fail()}).finally(()=>{pendingPlay=false})}
 function tick(){
  if(disposed||failed||document.hidden)return
  if(switching)return
  if(drawn<0||video.readyState<2)return
  // Direction comes from input, not a one-frame decoder overshoot.
  const reverseGap=intent*(goal()-drawn)
  if(intent!==direction&&reverseGap>0&&(reverseGap>=2||performance.now()-lastInput>160)){changeDirection(intent);return}
  const gap=remaining()
  if(gap<=0){if(!video.paused)video.pause();return}
  // Keep the decoder at its native 30fps; changing playbackRate while playing
  // can discard presentation frames on integrated GPUs.
  play()
  if(typeof video.requestVideoFrameCallback!=='function')present(video.currentTime)
 }
 function detach(){gsap.ticker.remove(tick);follow.tween.kill();listeners.forEach(remove=>remove());if(handle!==undefined)video.cancelVideoFrameCallback(handle);video.pause();video.removeAttribute('src');video.load();video.remove()}
 async function fail(){if(failed||disposed)return;failed=true;detach();root.dataset.renderer='canvas-fallback';try{const p=await framePlayer(root,canvas,poster,onReady,onDraw);if(disposed){p.dispose();return}fallback=p;p.set(target/(set.count-1))}catch{root.classList.add('native-motion')}}
 const visibility=()=>{if(document.hidden)video.pause()};document.addEventListener('visibilitychange',visibility)
 onReady(set.bottomColor);poster.src=set.poster;root.dataset.renderer='gsap-desktop'
 video.className='hero-video';video.muted=true;video.defaultMuted=true;video.playsInline=true;video.preload='auto';video.disablePictureInPicture=true;video.disableRemotePlayback=true;video.setAttribute('aria-hidden','true');video.style.opacity='0';root.insertBefore(video,canvas)
 listen('error',()=>void fail());listen('loadedmetadata',settleSeek);listen('canplay',settleSeek)
 listen('loadeddata',()=>{if(!switching)present(video.currentTime)})
 listen('seeked',()=>{switching=false;present(video.currentTime)})
 listen('waiting',()=>{waiting++});listen('ended',()=>present((set.count-1)/30))
 observe();gsap.ticker.add(tick)
 if(video.canPlayType('video/mp4; codecs="avc1.640028"')){video.src='/video/pc-gsap.mp4';video.load()}else void fail()
 return {count:set.count,set(progress:number){const value=Math.max(0,Math.min(1,progress)),next=Math.round(value*(set.count-1));if(fallback){fallback.set(value);return}if(disposed||failed)return;if(next!==target){intent=next>target?1:-1;lastInput=performance.now()}target=next;follow(value)},dispose(){disposed=true;document.removeEventListener('visibilitychange',visibility);detach();fallback?.dispose()},stats(){if(fallback)return{...fallback.stats(),renderer:'canvas-fallback'};const quality=video.getVideoPlaybackQuality();return{renderer:'gsap-desktop',target,drawn,painted,backlog:Math.abs(target-Math.max(0,drawn)),waiting,switches,playbackRate:video.playbackRate,droppedFrames:quality.droppedVideoFrames,totalVideoFrames:quality.totalVideoFrames,width:video.videoWidth,height:video.videoHeight,sourceWidth:set.width,sourceHeight:set.height,decoded:0,compressed:0}}}
}
