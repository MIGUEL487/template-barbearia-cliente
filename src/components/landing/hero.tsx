"use client";
import {useEffect,useRef} from 'react';
import Link from 'next/link';
import {heroPlayer as framePlayer} from '@/lib/cinematic/video-player';
import {createScrollEngine} from '@/lib/cinematic/scroll-engine';
import frames from '@/config/frames.json';
import {useMotionEnabled} from '@/components/motion-preferences';
export function Hero(){
 const track=useRef<HTMLDivElement>(null),root=useRef<HTMLElement>(null),canvas=useRef<HTMLCanvasElement>(null),poster=useRef<HTMLImageElement>(null);
 const enabled=useMotionEnabled();
 useEffect(()=>{
 let saved=null;try{saved=localStorage.getItem('auto-stilo-motion')}catch{}
 const forced=new URLSearchParams(location.search).get('motion');const wanted=forced==='full'?true:forced==='off'?false:saved!==null?saved==='on':!matchMedia('(prefers-reduced-motion:reduce)').matches;
 if(wanted!==enabled)return;
 const surface=root.current!;let stableHeight=innerHeight,landscape=innerWidth>innerHeight;
 const resizeSurface=()=>{const next=innerWidth>innerHeight;stableHeight=next!==landscape?innerHeight:Math.max(stableHeight,innerHeight);landscape=next;surface.style.setProperty('--hero-vh',innerHeight+'px');surface.style.setProperty('--hero-stable-vh',stableHeight+'px')};
 resizeSurface();window.addEventListener('resize',resizeSurface);window.visualViewport?.addEventListener('resize',resizeSurface);
 const engine=createScrollEngine(enabled);
 let generation=0,cleanup=()=>{},pinnedProgress:()=>number|null=()=>null;
 const nav=(visible:boolean)=>document.documentElement.classList.toggle('hero-nav-visible',visible);
 const setup=async(preserveProgress=false)=>{const resume=preserveProgress?pinnedProgress():null;const gen=++generation;cleanup();if(!root.current||!canvas.current||!poster.current)return;const el=root.current,copy=el.querySelector('.hero-copy')!,shade=el.querySelector('.shade')!,cue=el.querySelector('.scroll-cue')!
 engine.gsap.set([copy.children,shade],{clearProps:'all'});el.classList.toggle('native-motion',!enabled)
 let anchor:HTMLElement|null=null;try{anchor=location.hash?document.getElementById(decodeURIComponent(location.hash.slice(1))):null}catch{}
 if(!enabled||(anchor&&!el.contains(anchor))){el.classList.add('native-motion');nav(true);return}
 const mobile=matchMedia('(max-width:768px), (orientation:portrait)').matches
 el.classList.toggle('hero-native',mobile)
 let drawn=-1,scrollProgress=0,finalVisible=false,releaseAt=0,hiddenAt=0,renderCopy=()=>{}
 let endingTimer:ReturnType<typeof engine.gsap.delayedCall>|undefined
 try{const player=await framePlayer(el,canvas.current,poster.current,color=>{const ink=[10,10,12];const out='#'+ink.map((base,c)=>Math.round(base*.96+parseInt(color.slice(1+c*2,3+c*2),16)*.04).toString(16).padStart(2,'0')).join('');el.style.setProperty('--exit-color',out)},index=>{drawn=index;if(index===(mobile?frames.mobile.count:frames.pc.count)-1){if(!finalVisible&&!endingTimer){releaseAt=performance.now()+1000;endingTimer=engine.gsap.delayedCall(.35,()=>{finalVisible=true;endingTimer=undefined;renderCopy()})}}else{endingTimer?.kill();endingTimer=undefined;finalVisible=false;releaseAt=0}renderCopy()});if(gen!==generation){player.dispose();return}
 const tl=engine.gsap.timeline({paused:true}).to(shade,{opacity:1,duration:.7},0).to(copy.children,{opacity:1,y:0,stagger:.12,duration:.6,ease:'power2.out'},.1).to(cue,{opacity:0,duration:.2},0).timeScale(2)
 type Ending='idle'|'waiting'|'reading'|'done'
 let ending:Ending='idle',releaseScroll=()=>{}
 let readingTimer:ReturnType<typeof engine.gsap.delayedCall>|undefined,waitingTimer:ReturnType<typeof engine.gsap.delayedCall>|undefined
 const phase=(value:Ending)=>{ending=value;el.dataset.endingPhase=value};phase('idle')
 const finishReading=()=>{phase('done');readingTimer?.kill();readingTimer=undefined;waitingTimer?.kill();waitingTimer=undefined;releaseScroll();tl.pause();tl.progress(1);nav(true)}
 const navigate=(event:MouseEvent)=>{const a=(event.target as HTMLElement).closest<HTMLAnchorElement>('a[href]');if(!a)return;const url=new URL(a.href,location.href);let target:HTMLElement|null=null;try{target=document.getElementById(decodeURIComponent(url.hash.slice(1)))}catch{}if(url.origin===location.origin&&url.pathname===location.pathname&&target&&!el.contains(target))finishReading();else if(ending==='waiting'||ending==='reading')finishReading()}
 document.addEventListener('click',navigate,true)
 const visibility=()=>{if(document.hidden){hiddenAt=performance.now();if(ending==='reading')tl.pause();readingTimer?.pause();waitingTimer?.pause();endingTimer?.pause()}else{if(hiddenAt&&releaseAt)releaseAt+=performance.now()-hiddenAt;hiddenAt=0;if(ending==='reading'&&!readingTimer)tl.resume();readingTimer?.resume();waitingTimer?.resume();endingTimer?.resume()}}
 document.addEventListener('visibilitychange',visibility)
 const clearReading=()=>{releaseScroll();readingTimer?.kill();waitingTimer?.kill();document.removeEventListener('click',navigate,true);document.removeEventListener('visibilitychange',visibility);delete el.dataset.endingPhase}
 tl.eventCallback('onComplete',()=>{if(ending==='reading')readingTimer=engine.gsap.delayedCall(Math.max(0,(releaseAt-performance.now())/1000),finishReading)})
 let navigation=false
 const screens=mobile?Math.max(4,Math.min(6,Math.ceil(player.count/40)))+1:3
 const videoEnd=.8,copyStart=.86
 el.dataset.videoEnd=String(videoEnd)
 // Copy waits for actual playback to finish, including a fast-scroll backlog.
 renderCopy=()=>{
  const completed=drawn===player.count-1&&finalVisible
  if(ending==='waiting'&&completed){phase('reading');waitingTimer?.kill();waitingTimer=undefined;tl.play(0);navigation=true;return}
  if(ending==='waiting'||ending==='reading')return
  if(ending==='done'){tl.progress(1);return}
  tl.progress(!completed?0:Math.max(0,Math.min(1,(scrollProgress-copyStart)/(1-copyStart))))
  const next=scrollProgress>=videoEnd&&completed;if(next!==navigation){navigation=next;nav(next)}
 }
 const sync=(self:{progress:number})=>{
  scrollProgress=self.progress
  if(ending==='done'&&self.progress<.1)phase('idle')
  if(ending==='idle'&&self.progress>=videoEnd&&!location.hash){
   phase('waiting');tl.pause(0)
   const distance=Number(el.dataset.pinDistance)||el.clientHeight*screens
   const top=window.scrollY+(track.current?.getBoundingClientRect().top||0)+distance*.82
   releaseScroll=engine.lockAt(top)
   // A media failure must not trap the page indefinitely.
   waitingTimer=engine.gsap.delayedCall(15,finishReading)
  }
  player.set(Math.min(1,self.progress/videoEnd));renderCopy()
 }
 el.dataset.count=String(player.count)
 ;(el as HTMLElement&{frameStats?:()=>unknown}).frameStats=()=>({...player.stats(),reactScrollUpdates:0})
 if(mobile&&track.current){
  const runway=track.current,distance=el.clientHeight*screens
  // Older Android Chrome versions retain the pixel fallback if dvh is unsupported.
  runway.style.height=`${distance+el.clientHeight}px`
  runway.style.height=`calc(${distance}px + 100dvh)`
  el.dataset.pinDistance=String(distance);el.dataset.scrollMode='native-sticky'
  let frame:number|undefined
  const update=()=>{frame=undefined;sync({progress:Math.max(0,Math.min(1,-runway.getBoundingClientRect().top/distance))})}
  const schedule=()=>{if(frame===undefined)frame=requestAnimationFrame(update)}
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule,{passive:true});window.visualViewport?.addEventListener('resize',schedule)
  engine.ScrollTrigger.refresh()
  if(resume!==null)engine.jumpTo(window.scrollY+runway.getBoundingClientRect().top+resume*distance)
  update();pinnedProgress=()=>scrollProgress>0&&scrollProgress<1?scrollProgress:null
  cleanup=()=>{pinnedProgress=()=>null;clearReading();window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);window.visualViewport?.removeEventListener('resize',schedule);if(frame!==undefined)cancelAnimationFrame(frame);endingTimer?.kill();tl.kill();player.dispose();runway.style.removeProperty('height');el.classList.remove('hero-native');canvas.current&&(canvas.current.style.opacity='0')}
  return
 }
 el.dataset.scrollMode='gsap-pin'
 const trigger=engine.ScrollTrigger.create({trigger:el,start:'top top',end:()=>`+=${el.clientHeight*screens}`,pin:true,refreshPriority:10,invalidateOnRefresh:true,onUpdate:sync,onRefresh:self=>{el.dataset.pinDistance=String(self.end-self.start);sync(self)}})
 engine.ScrollTrigger.sort();engine.ScrollTrigger.refresh()
 if(resume!==null){engine.jumpTo(trigger.start+resume*(trigger.end-trigger.start));sync({progress:resume})}
 pinnedProgress=()=>trigger.isActive?trigger.progress:null
 cleanup=()=>{pinnedProgress=()=>null;clearReading();endingTimer?.kill();trigger.kill();tl.kill();player.dispose();canvas.current&&(canvas.current.style.opacity='0')}
 }catch{el.classList.add('native-motion');nav(true)}}

 void setup();const mq=matchMedia('(max-width:768px), (orientation:portrait)');const rotate=()=>engine.ScrollTrigger.refresh();mq.addEventListener('change',rotate);
 return ()=>{window.removeEventListener('resize',resizeSurface);window.visualViewport?.removeEventListener('resize',resizeSurface);generation++;cleanup();mq.removeEventListener('change',rotate);engine.dispose();document.documentElement.classList.remove('hero-nav-visible')};
 },[enabled]);
 return <div ref={track} className="hero-track"><section id="inicio" ref={root} className="hero cinematic" aria-labelledby="hero-title">
 <picture className="hero-picture"><source media="(max-width:768px), (orientation:portrait)" srcSet={frames.mobile.poster}/>
 {/* eslint-disable-next-line @next/next/no-img-element */}
 <img ref={poster} className="poster" src={frames.pc.poster} alt="Cena de atendimento em uma barbearia, sequência de demonstração" width={1920} height={1080} fetchPriority="high"/></picture>
 <canvas ref={canvas} aria-hidden="true" style={{opacity:0}}/><div className="shade"/>
 <div className="hero-copy"><p>BARBEARIA · MONTE SIÃO — MG</p><h1 id="hero-title">Seu estilo,<br/>do corte ao <em>detalhe.</em></h1><p>Atendimento sob medida, ambiente confortável e cuidado em cada detalhe. Agende seu horário em poucos toques.</p><div className="hero-buttons"><Link className="cta" href="/agendar">Agendar horário</Link><a className="text-link" href="#servicos">Ver serviços</a></div></div>
 <p className="scroll-cue">O cuidado começa aqui <span aria-hidden="true">↓</span></p>
 <noscript><style>{'.hero-copy > *,.shade{opacity:1!important;transform:none!important}.hero-track{height:auto!important}'}</style></noscript>
 </section></div>;
}
