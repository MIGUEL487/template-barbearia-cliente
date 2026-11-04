'use client';
import {useEffect,useRef} from 'react';
import Link from 'next/link';
import {BrandLogo} from '@/components/brand-logo';
import {sequentialFrames} from '@/lib/cinematic/sequential-frames';
import {subscribeLandingFrame,jumpLandingTo,registerScrollBoundary} from './scroll-manager';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {useMotionEnabled} from '@/components/motion-preferences';
const cues=[{frame:1,start:1,in:1,out:38,end:46,title:'Auto Stilo',copy:'Barbearia em Monte Sião'}, {frame:73,start:56,in:66,out:96,end:106,title:'Precisão em cada detalhe.'}, {frame:121,start:114,in:122,out:154,end:164,title:'Mais que um corte. Uma experiência.'}, {frame:193,start:176,in:184,out:195,end:201,title:'Seu estilo, nas mãos certas.'}, {frame:217,start:208,in:216,out:239,end:240,title:'Seu próximo corte começa aqui.'}];
const path=(v:string,i:number)=>`/frames/${v}/frame_${String(i+1).padStart(4,'0')}.webp`;
export function CinematicHero(){
 const root=useRef<HTMLElement>(null),surface=useRef<HTMLDivElement>(null),canvas=useRef<HTMLCanvasElement>(null);const enabled=useMotionEnabled();
 useEffect(()=>{
  const el=root.current!,cv=canvas.current!,box=surface.current!;
  const mq=matchMedia('(max-width: 768px) and (orientation: portrait)');let dispose=()=>{},completedBeforeResize=false;
  const setup=()=>{
   dispose();const reduced=!enabled||matchMedia('(prefers-reduced-motion: reduce)').matches;let savedOff=false;try{savedOff=localStorage.getItem('auto-stilo-motion')==='off'}catch{}el.closest('.cinematic-site')?.classList.remove('past-cinema');el.classList.toggle('cinema-static',reduced&&(savedOff||matchMedia('(prefers-reduced-motion: reduce)').matches||new URLSearchParams(location.search).get('motion')==='off'));if(reduced){if(el.classList.contains('cinema-static'))el.closest('.cinematic-site')?.classList.add('past-cinema');return;}
   gsap.registerPlugin(ScrollTrigger);ScrollTrigger.config({ignoreMobileResize:true});
   const texts=Array.from(el.querySelectorAll<HTMLElement>('.cinema-cue'));const timeline=gsap.timeline({paused:true});
   cues.forEach((cue,i)=>{const node=texts[i];gsap.set(node,{autoAlpha:i===0?1:0,y:i===0?0:16});if(i)timeline.to(node,{autoAlpha:1,y:0,duration:cue.in-cue.start,ease:'none'},cue.start-1);if(i<4)timeline.to(node,{autoAlpha:0,y:-16,duration:cue.end-cue.out,ease:'none'},cue.out-1)});timeline.to({}, {duration:1},237);
   type Phase='tracking'|'catching-up'|'complete';
   let phase:Phase=completedBeforeResize?'complete':'tracking',displayed=-1,completionPending=false,correcting=false;
   const debug=new URLSearchParams(location.search).has('debug-hero');
   let trigger:ScrollTrigger|undefined;
   const limit=()=>trigger?trigger.end-2:Infinity;
   const siblings=Array.from(el.parentElement?.children||[]).filter((node):node is HTMLElement=>node instanceof HTMLElement&&node!==el).map(node=>({node,inert:node.inert}));
   const setInert=(held:boolean)=>siblings.forEach(({node,inert})=>{node.inert=held||inert});setInert(phase!=='complete');
   const publish=()=>{el.dataset.phase=phase;if(debug)(window as Window&{__HERO_GATE__?:unknown}).__HERO_GATE__={phase,displayedFrame:displayed+1,limit:limit(),position:scrollY}};
   const updateHeader=()=>el.closest('.cinematic-site')?.classList.toggle('past-cinema',phase==='complete'&&!!trigger&&scrollY>=trigger.end);
   const player=sequentialFrames(cv,box,mq.matches?'mobile':'desktop',index=>{displayed=index;timeline.time(index);if(index===238)completionPending=true;else{completionPending=false;if(!completedBeforeResize||!trigger||scrollY<trigger.end){phase='tracking';completedBeforeResize=false;setInert(true)}}publish();updateHeader()});
   if(!player){setInert(false);el.classList.add('cinema-static');el.closest('.cinematic-site')?.classList.add('past-cinema');return;}
   const constrain=(position:number)=>{if(phase==='complete'||position<=limit())return position;phase='catching-up';player.setTarget(238);publish();return limit()};
   const guard=()=>{if(correcting||!trigger)return;const top=constrain(scrollY);if(top<scrollY){correcting=true;jumpLandingTo(top);correcting=false}publish();updateHeader()};
   const stopBoundary=registerScrollBoundary(constrain);
   const stop=subscribeLandingFrame(time=>{if(completionPending){completionPending=false;phase='complete';completedBeforeResize=true;setInert(false);publish();updateHeader()}player.tick(time);guard()});
   trigger=ScrollTrigger.create({id:'cinematic-hero',refreshPriority:100,trigger:el,start:'top top',end:()=>`+=${innerHeight*(mq.matches?3.5:4.5)}`,pin:box,pinSpacing:true,anticipatePin:1,invalidateOnRefresh:true,onUpdate:self=>{player.setTarget(self.progress*238);guard()}});
   const keydown=(event:KeyboardEvent)=>{if(event.altKey||event.ctrlKey||event.metaKey||event.shiftKey||!(event.target instanceof HTMLElement)||event.target.closest('input,textarea,select,[contenteditable=true],button,a'))return;const distance=event.key==='End'?Infinity:['PageDown',' '].includes(event.key)?innerHeight:event.key==='ArrowDown'?64:0;if(!distance)return;const requested=scrollY+distance,allowed=constrain(requested);if(allowed<requested){event.preventDefault();jumpLandingTo(allowed)}};
   window.addEventListener('scroll',guard,{passive:true});window.addEventListener('keydown',keydown);guard();
   dispose=()=>{window.removeEventListener('scroll',guard);window.removeEventListener('keydown',keydown);stopBoundary();stop();setInert(false);trigger?.kill(true);player.dispose();timeline.kill();gsap.set(texts,{clearProps:'all'});cv.style.opacity='0';delete el.dataset.phase;if(debug)delete (window as Window&{__HERO_GATE__?:unknown}).__HERO_GATE__};
  };setup();mq.addEventListener('change',setup);return()=>{dispose();mq.removeEventListener('change',setup)};
 },[enabled]);
 return <section ref={root} className="cinema" aria-label="Auto Stilo, o cuidado em movimento"><div ref={surface} className="cinema-surface"><picture className="cinema-poster"><source media="(max-width:768px) and (orientation:portrait)" srcSet={path('mobile',0)}/>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={path('desktop',0)} width="1920" height="1080" fetchPriority="high" alt="Barbeiro da Auto Stilo cortando o cabelo de um cliente"/></picture><canvas ref={canvas} aria-hidden="true"/><div className="cinema-scrim"/>{cues.map((cue,i)=><div className={`cinema-cue cue-${i}`} key={cue.frame} data-reference={cue.frame}>{i===0?<><h1 className="sr-only">Auto Stilo — Barbearia em Monte Sião</h1><BrandLogo tone="dark" className="cinema-brand"/></>:<h2>{cue.title}</h2>}{(i===0||i===4)&&<Link className="cta" href="/agendar">Agendar horário <span aria-hidden="true">↗</span></Link>}</div>)}<div className="cinema-alternatives"><button className="hero-motion-alternative" type="button" onClick={()=>{try{localStorage.setItem('auto-stilo-motion','off')}catch{}window.dispatchEvent(new Event('auto-stilo-motion'))}}>Versão sem animação</button></div></div><div className="cinema-still-story">{cues.slice(1).map(c=><article key={c.frame}><picture><source media="(max-width:768px) and (orientation:portrait)" srcSet={path('mobile',c.frame-1)}/>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={path('desktop',c.frame-1)} alt="Detalhe do atendimento na Auto Stilo" width="1920" height="1080" loading="lazy"/></picture><h2>{c.title}</h2></article>)}</div></section>;
}
