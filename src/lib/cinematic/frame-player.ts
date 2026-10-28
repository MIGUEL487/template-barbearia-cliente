// Ported from MIGUEL487/Template-padaria @ 9e3ee14. Framework-independent player.
type Set={width:number;height:number;count:number;bottomColor:string;poster:string;frames:string[]}
type Manifest={pc:Set;mobile:Set}
export async function framePlayer(root:HTMLElement,canvas:HTMLCanvasElement,poster:HTMLImageElement,onReady:(exit:string)=>void,onDraw:(index:number)=>void=()=>{}){
 const controller=new AbortController();let disposed=false
 const manifest:Manifest=await fetch('/frames/manifest.json',{signal:controller.signal}).then(r=>{if(!r.ok)throw Error('Manifest unavailable');return r.json()})
 const mobile=matchMedia('(max-width: 768px), (orientation: portrait)').matches;const set=mobile?manifest.mobile:manifest.pc
 onReady(set.bottomColor);poster.src=set.poster
 const context=canvas.getContext('2d',{alpha:false});if(!context)throw Error('Canvas unavailable');const ctx=context
 type Decoded=ImageBitmap|HTMLImageElement
 const close=(image:Decoded)=>{if('close'in image)image.close()}
 const compressed=new Map<number,Blob>(),bitmaps=new Map<number,Decoded>(),pending=new Set<number>(),fetching=new Set<number>(),failed=new Set<number>(),attempts=new Map<number,number>();let target=0,drawn=-1,dirty=true,dimensionsDirty=true,rect=[0,0,1,1],active=0,direction=1,fetchQueue:number[]=[],decoding=0,frame:number|undefined,due=0,painted=0
 function invalidate(){dirty=true;if(frame===undefined&&!disposed&&!document.hidden)frame=requestAnimationFrame(tick)}
 const indices=Array.from({length:set.count},(_,i)=>i)
 const cursor=()=>Math.max(0,drawn)
 const priority=(i:number)=>Math.abs(i-cursor())+(direction*(i-cursor())<0?set.count:0)
 const resize=()=>{
  const w=root.clientWidth,h=mobile?canvas.clientHeight:root.clientHeight;if(!w||!h)return
  const ratio=Math.min(mobile?1:1.25,devicePixelRatio,set.width/w,set.height/h)
  const width=Math.max(1,Math.round(w*ratio)),height=Math.max(1,Math.round(h*ratio))
  if(canvas.width===width&&canvas.height===height&&!dimensionsDirty)return
  canvas.width=width;canvas.height=height
  const scale=Math.max(width/set.width,height/set.height);rect=[(width-set.width*scale)/2,(height-set.height*scale)/2,set.width*scale,set.height*scale];invalidate();dimensionsDirty=true
  // Resizing clears a canvas. Repaint the retained bitmap before the browser paints,
  // rather than showing a black/empty surface while waiting for the next ticker.
  const retained=bitmaps.get(drawn)
  if(retained){ctx.drawImage(retained,rect[0]!,rect[1]!,rect[2]!,rect[3]!);canvas.style.opacity='1';dimensionsDirty=false}
  else canvas.style.opacity='0'
 }
 const ro=new ResizeObserver(resize);ro.observe(canvas);resize()
 const visibility=()=>{due=0;if(!document.hidden)invalidate()};document.addEventListener('visibilitychange',visibility)
 const radius=4,ahead=mobile?8:6
 const inWindow=(i:number)=>Math.abs(i-cursor())<=radius||(direction>0?i>cursor()&&i-cursor()<=ahead:i<cursor()&&cursor()-i<=ahead)
 function trim(){for(const [i,b]of bitmaps){if(!inWindow(i)&&i!==drawn){close(b);bitmaps.delete(i)}}}
 async function decodeBlob(blob:Blob):Promise<Decoded>{
  // Safari and older WebViews may reject createImageBitmap for an otherwise valid image.
  try{if(typeof createImageBitmap==='function')return await createImageBitmap(blob)}catch{}
  const url=URL.createObjectURL(blob),image=new Image()
  try{await new Promise<void>((resolve,reject)=>{image.onload=()=>resolve();image.onerror=()=>reject(Error('Image unavailable'));image.src=url});return image}finally{URL.revokeObjectURL(url)}
 }
 function decode(i:number){if(disposed||failed.has(i)||bitmaps.has(i)||pending.has(i)||!compressed.has(i)||!inWindow(i)||decoding>=2)return;pending.add(i);decoding++;decodeBlob(compressed.get(i)!).then(b=>{if(disposed||!inWindow(i)){close(b);return}bitmaps.set(i,b);invalidate()}).catch(()=>{failed.add(i)}).finally(()=>{pending.delete(i);decoding--;if(!disposed){trim();warm()}})}
 function warm(){
  // Buffer around the frame actually on screen, never the distant scroll target.
  const near=indices.filter(inWindow).sort((a,b)=>priority(a)-priority(b))
  for(const i of near)decode(i)
 }
 function pump(){if(disposed)return;while(active<4&&fetchQueue.length){const i=fetchQueue.shift()!;if(compressed.has(i)||fetching.has(i)||(attempts.get(i)||0)>=3)continue;active++;fetching.add(i);attempts.set(i,(attempts.get(i)||0)+1);fetch(set.frames[i]!,{signal:controller.signal}).then(r=>{if(!r.ok)throw Error('Frame unavailable');return r.blob()}).then(blob=>{if(!disposed){compressed.set(i,blob);warm()}}).catch(()=>{if(!disposed&&(attempts.get(i)||0)<3)fetchQueue.unshift(i)}).finally(()=>{fetching.delete(i);active--;pump()})}}
 function queueCurrent(){
  const near=indices.filter(inWindow).sort((a,b)=>priority(a)-priority(b))
  const rest=indices.filter(i=>!inWindow(i)).sort((a,b)=>priority(a)-priority(b))
  fetchQueue=[...near,...rest].filter(i=>!compressed.has(i)&&!fetching.has(i));pump();warm()
 }
 queueCurrent()
 function tick(now:number){
  frame=undefined;if(disposed||document.hidden||!dirty)return
  // One adjacent frame per presentation. Never convert missed time into a seek.
  const next=drawn<0?0:drawn+Math.sign(target-drawn),bitmap=bitmaps.get(next)
  if(!bitmap)return // A download/decode completion wakes us when this frame is ready.
  if(next!==drawn&&now+.5<due){invalidate();return}
  if(next!==drawn||dimensionsDirty){
   const changed=next!==drawn
   ctx.drawImage(bitmap,rect[0]!,rect[1]!,rect[2]!,rect[3]!);drawn=next;canvas.style.opacity='1';canvas.dataset.frame=String(next);dimensionsDirty=false
   if(changed){painted++;due=Math.max(due+1000/30,now+1000/30-2);onDraw(next);direction=target<drawn?-1:1;trim();queueCurrent()}
  }
  dirty=false;if(drawn!==target)invalidate()
 }
 return {count:set.count,set(progress:number){const next=Math.max(0,Math.min(set.count-1,Math.round(progress*(set.count-1))));if(next===target)return;target=next;direction=target<cursor()?-1:1;invalidate();trim();queueCurrent()},dispose(){disposed=true;controller.abort();ro.disconnect();document.removeEventListener('visibilitychange',visibility);if(frame!==undefined)cancelAnimationFrame(frame);for(const b of bitmaps.values())close(b);bitmaps.clear();compressed.clear()},stats(){return{decoded:bitmaps.size,compressed:compressed.size,target,drawn,painted,backlog:Math.abs(target-Math.max(0,drawn)),width:canvas.width,height:canvas.height,sourceWidth:set.width,sourceHeight:set.height}}}
}
