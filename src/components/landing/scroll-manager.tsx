'use client';
import {useEffect} from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {useMotionEnabled} from '@/components/motion-preferences';
import 'lenis/dist/lenis.css';

const frameTasks=new Set<(time:number)=>void>();
export function subscribeLandingFrame(task:(time:number)=>void){frameTasks.add(task);return()=>{frameTasks.delete(task)}}
let activeScroll:Lenis|null=null;
export function jumpLandingTo(top:number){if(activeScroll)activeScroll.scrollTo(top,{immediate:true});else window.scrollTo({top,behavior:'instant'})}

// Mounted once by the landing route. Booking routes keep their native scrolling.
export function LandingScroll(){
 const enabled=useMotionEnabled();
 useEffect(()=>{
  if(!enabled||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  gsap.registerPlugin(ScrollTrigger);
  const lenis=new Lenis({lerp:.14,smoothWheel:true,syncTouch:false,autoRaf:false,anchors:{offset:-112}});
  activeScroll=lenis;
  let ticks=0;
  const update=(time:number)=>{ticks++;lenis.raf(time*1000);for(const task of frameTasks)task(time)};
  lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(update);
  // Keep GSAP's normal lag recovery; Lenis receives the same clock as all timelines.
  const refresh=()=>{ScrollTrigger.sort();ScrollTrigger.refresh()};
  document.fonts.ready.then(()=>{if(!disposed)refresh()});
  let disposed=false;
  window.addEventListener('auto-stilo-header-resize',refresh);
  if(new URLSearchParams(location.search).has('debug-hero'))(window as Window&{__LANDING_SCROLL__?:unknown}).__LANDING_SCROLL__={instances:1,autoRaf:false,syncTouch:false,get ticks(){return ticks}};
  return()=>{disposed=true;gsap.ticker.remove(update);lenis.off('scroll',ScrollTrigger.update);lenis.destroy();if(activeScroll===lenis)activeScroll=null;window.removeEventListener('auto-stilo-header-resize',refresh);delete (window as Window&{__LANDING_SCROLL__?:unknown}).__LANDING_SCROLL__};
 },[enabled]);return null;
}
