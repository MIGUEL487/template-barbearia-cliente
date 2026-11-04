'use client';
import {useEffect,useRef} from 'react';
import Link from 'next/link';
import {BrandLogo} from '@/components/brand-logo';
import {sequentialFrames} from '@/lib/cinematic/sequential-frames';
import {subscribeLandingFrame} from './scroll-manager';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {useMotionEnabled} from '@/components/motion-preferences';
const cues=[{frame:1,start:1,in:1,out:38,end:46,title:'Auto Stilo',copy:'Barbearia em Monte Sião'}, {frame:73,start:56,in:66,out:96,end:106,title:'Precisão em cada detalhe.'}, {frame:121,start:114,in:122,out:154,end:164,title:'Mais que um corte. Uma experiência.'}, {frame:193,start:176,in:184,out:195,end:201,title:'Seu estilo, nas mãos certas.'}, {frame:217,start:208,in:216,out:239,end:240,title:'Seu próximo corte começa aqui.'}];
const path=(v:string,i:number)=>`/frames/${v}/frame_${String(i+1).padStart(4,'0')}.webp`;
export function CinematicHero(){
 const root=useRef<HTMLElement>(null),surface=useRef<HTMLDivElement>(null),canvas=useRef<HTMLCanvasElement>(null);const enabled=useMotionEnabled();
 useEffect(()=>{
  const el=root.current!,cv=canvas.current!,box=surface.current!;
  const mq=matchMedia('(max-width: 768px) and (orientation: portrait)');let dispose=()=>{};
  const setup=()=>{
   dispose();const reduced=!enabled||matchMedia('(prefers-reduced-motion: reduce)').matches;let savedOff=false;try{savedOff=localStorage.getItem('auto-stilo-motion')==='off'}catch{}el.closest('.cinematic-site')?.classList.remove('past-cinema');el.classList.toggle('cinema-static',reduced&&(savedOff||matchMedia('(prefers-reduced-motion: reduce)').matches||new URLSearchParams(location.search).get('motion')==='off'));if(reduced){if(el.classList.contains('cinema-static'))el.closest('.cinematic-site')?.classList.add('past-cinema');return;}
   gsap.registerPlugin(ScrollTrigger);ScrollTrigger.config({ignoreMobileResize:true});
   const texts=Array.from(el.querySelectorAll<HTMLElement>('.cinema-cue'));const timeline=gsap.timeline({paused:true});
   cues.forEach((cue,i)=>{const node=texts[i];gsap.set(node,{autoAlpha:i===0?1:0,y:i===0?0:16});if(i)timeline.to(node,{autoAlpha:1,y:0,duration:cue.in-cue.start,ease:'none'},cue.start-1);if(i<4)timeline.to(node,{autoAlpha:0,y:-16,duration:cue.end-cue.out,ease:'none'},cue.out-1)});timeline.to({}, {duration:1},237);
   const player=sequentialFrames(cv,box,mq.matches?'mobile':'desktop',index=>timeline.time(index));if(!player){el.closest('.cinematic-site')?.classList.add('past-cinema');return;}
   const stop=subscribeLandingFrame(time=>player.tick(time));
   const trigger=ScrollTrigger.create({id:'cinematic-hero',refreshPriority:100,trigger:el,start:'top top',end:()=>`+=${innerHeight*(mq.matches?3.5:4.5)}`,pin:box,pinSpacing:true,anticipatePin:1,invalidateOnRefresh:true,onUpdate:self=>{player.setTarget(self.progress*238);el.closest('.cinematic-site')?.classList.toggle('past-cinema',self.progress>=1)}});
   dispose=()=>{stop();trigger.kill(true);player.dispose();timeline.kill();gsap.set(texts,{clearProps:'all'});cv.style.opacity='0'};
  };setup();mq.addEventListener('change',setup);return()=>{dispose();mq.removeEventListener('change',setup)};
 },[enabled]);
 return <section ref={root} className="cinema" aria-label="Auto Stilo, o cuidado em movimento"><div ref={surface} className="cinema-surface"><picture className="cinema-poster"><source media="(max-width:768px) and (orientation:portrait)" srcSet={path('mobile',0)}/>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={path('desktop',0)} width="1920" height="1080" fetchPriority="high" alt="Barbeiro da Auto Stilo cortando o cabelo de um cliente"/></picture><canvas ref={canvas} aria-hidden="true"/><div className="cinema-scrim"/>{cues.map((cue,i)=><div className={`cinema-cue cue-${i}`} key={cue.frame} data-reference={cue.frame}>{i===0?<><p>{cue.copy}</p><h1 className="sr-only">Auto Stilo — Barbearia em Monte Sião</h1><BrandLogo tone="dark" className="cinema-brand"/></>:<h2>{cue.title}</h2>}{(i===0||i===4)&&<Link className="cta" href="/agendar">Agendar horário <span aria-hidden="true">↗</span></Link>}</div>)}<a className="cinema-skip" href="#assinatura">Pular introdução ↓</a></div><div className="cinema-still-story">{cues.slice(1).map(c=><article key={c.frame}><picture><source media="(max-width:768px) and (orientation:portrait)" srcSet={path('mobile',c.frame-1)}/>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={path('desktop',c.frame-1)} alt="Detalhe do atendimento na Auto Stilo" width="1920" height="1080" loading="lazy"/></picture><h2>{c.title}</h2></article>)}</div></section>;
}
