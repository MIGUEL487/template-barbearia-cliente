import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
export function createScrollEngine(enabled:boolean){
 gsap.registerPlugin(ScrollTrigger);ScrollTrigger.config({ignoreMobileResize:true});gsap.ticker.lagSmoothing(0)
 const query=matchMedia('(prefers-reduced-motion: reduce)');let lenis:Lenis|undefined
 const forced=new URLSearchParams(location.search).get('motion');let saved:string|null=null;try{saved=localStorage.getItem('auto-stilo-motion')}catch{}
 const initialPreference=forced==='full'?true:forced==='off'?false:saved!==null?saved==='on':!query.matches
 document.documentElement.classList.toggle('motion-off',!initialPreference)
 const tick=(time:number)=>{if(!document.hidden)lenis?.raf(time*1000)};gsap.ticker.add(tick)
 const configure=()=>{lenis?.destroy();lenis=undefined;if(enabled&&!matchMedia('(pointer: coarse)').matches&&new URLSearchParams(location.search).get('lenis')!=='off'){lenis=new Lenis({autoRaf:false,syncTouch:false});lenis.on('scroll',ScrollTrigger.update)}document.documentElement.classList.toggle('motion-off',!enabled);ScrollTrigger.refresh()}
 configure()
 const visibility=()=>document.documentElement.classList.toggle('page-hidden',document.hidden);document.addEventListener('visibilitychange',visibility)
 const preference=()=>{try{if(localStorage.getItem('auto-stilo-motion')===null&&forced===null)enabled=!query.matches}catch{enabled=!query.matches}};query.addEventListener('change',preference)
 let releaseScroll=()=>{}
 const scrollTo=(target:string)=>{releaseScroll();let el:HTMLElement|null=null;try{el=document.getElementById(decodeURIComponent(target.slice(1)))}catch{return}if(!el)return;const offset=(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h'))||80)+16;const top=window.scrollY+el.getBoundingClientRect().top-offset;if(lenis)lenis.scrollTo(top,{immediate:true,force:true});else window.scrollTo({top,behavior:'instant'});ScrollTrigger.update()}
 const jumpTo=(top:number)=>{if(lenis)lenis.scrollTo(top,{immediate:true,force:true});else window.scrollTo({top,behavior:'instant'});ScrollTrigger.update()}
 const lockAt=(top:number)=>{
  releaseScroll();const pausedLenis=lenis;pausedLenis?.stop()
  const prevent=(event:Event)=>event.preventDefault()
  const key=(event:KeyboardEvent)=>{if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(event.key)&&!(event.target as HTMLElement).closest('a,button,input,select,textarea,[contenteditable]'))event.preventDefault()}
  const clamp=()=>{if(Math.abs(window.scrollY-top)>1)jumpTo(top)}
  window.addEventListener('wheel',prevent,{passive:false,capture:true});window.addEventListener('touchmove',prevent,{passive:false,capture:true});window.addEventListener('keydown',key,true);window.addEventListener('scroll',clamp,{passive:true})
  let active=true
  const release=()=>{if(!active)return;active=false;window.removeEventListener('wheel',prevent,true);window.removeEventListener('touchmove',prevent,true);window.removeEventListener('keydown',key,true);window.removeEventListener('scroll',clamp);if(lenis===pausedLenis)pausedLenis?.start();if(releaseScroll===release)releaseScroll=()=>{}}
  releaseScroll=release;jumpTo(top);return release
 }
 const click=(event:MouseEvent)=>{if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;const a=(event.target as HTMLElement).closest<HTMLAnchorElement>('a[href]');if(!a||a.target||a.hasAttribute('download'))return;const url=new URL(a.href,location.href);if(url.origin!==location.origin||url.pathname!==location.pathname||url.search!==location.search||url.hash.length<2)return;let el:HTMLElement|null=null;try{el=document.getElementById(decodeURIComponent(url.hash.slice(1)))}catch{return}if(!el)return;event.preventDefault();if(location.hash!==url.hash)history.pushState(null,'',url.hash);scrollTo(url.hash)};document.addEventListener('click',click)
 let frame=0,disposed=false
 const restore=()=>{if(!location.hash)return;cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>scrollTo(location.hash))}
 window.addEventListener('hashchange',restore);window.addEventListener('popstate',restore)
 restore();void document.fonts.ready.then(()=>{if(!disposed)restore()})


 return {gsap,ScrollTrigger,scrollTo,jumpTo,lockAt,dispose(){disposed=true;cancelAnimationFrame(frame);window.removeEventListener('hashchange',restore);window.removeEventListener('popstate',restore);releaseScroll();lenis?.destroy();gsap.ticker.remove(tick);document.removeEventListener('visibilitychange',visibility);query.removeEventListener('change',preference);document.removeEventListener('click',click)}}
}
