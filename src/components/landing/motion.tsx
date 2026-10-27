"use client";
import {useEffect} from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
gsap.registerPlugin(ScrollTrigger);
export function LandingMotion(){useEffect(()=>{
 const mm=gsap.matchMedia(); let dispose=()=>{};
 mm.add('(prefers-reduced-motion: no-preference)',()=>{
  const lenis=new Lenis({autoRaf:false,anchors:true});lenis.on('scroll',ScrollTrigger.update);
  const tick=(t:number)=>lenis.raf(t*1000);gsap.ticker.add(tick);gsap.ticker.lagSmoothing(0);
  const ctx=gsap.context(()=>{
   gsap.to('.hero-art',{yPercent:12,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:.2}});
   gsap.utils.toArray<HTMLElement>('.reveal-mask').forEach(el=>gsap.fromTo(el,{opacity:.35,y:32},{opacity:1,y:0,scrollTrigger:{trigger:el,start:'top 92%',end:'top 55%',scrub:.2}}));
  });
  const desktop=gsap.matchMedia();desktop.add('(min-width: 1024px)',()=>{
   const rail=document.querySelector<HTMLElement>('.gallery-rail');if(!rail)return;
   gsap.to(rail,{x:()=>-Math.max(0,rail.scrollWidth-innerWidth+80),ease:'none',scrollTrigger:{trigger:'.gallery-stage',start:'top 110px',end:()=>`+=${rail.scrollWidth/2}`,pin:true,scrub:.2,invalidateOnRefresh:true}});
  });
  const observer=new IntersectionObserver(es=>es.forEach(e=>{(e.target as HTMLElement).style.setProperty('--play',e.isIntersecting?'running':'paused')}));document.querySelectorAll('.ambient-loop').forEach(e=>observer.observe(e));
  const hero=document.querySelector<HTMLElement>('.hero'); const light=document.querySelector<HTMLElement>('.cursor-light');
  const pointer=(e:PointerEvent)=>{if(e.pointerType==='mouse'&&light&&hero){const box=hero.getBoundingClientRect();light.style.transform=`translate(${e.clientX-box.left-150}px,${e.clientY-box.top-150}px)`;}};
  hero?.addEventListener('pointermove',pointer); document.fonts.ready.then(()=>ScrollTrigger.refresh());
  dispose=()=>{hero?.removeEventListener('pointermove',pointer);observer.disconnect();desktop.revert();ctx.revert();gsap.ticker.remove(tick);lenis.destroy()};return dispose;
 });return()=>{mm.revert()};
},[]);return null}
