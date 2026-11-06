'use client';
import {useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {BarberPhoto} from '@/components/barber-photo';
import {jumpLandingTo} from './scroll-manager';
import {ShopImage} from './shop-image';
import {getMissingClientEnvVars,getBarbershopId,supabase} from '@/lib/supabase';
import {reportSupabaseError} from '@/lib/booking-diagnostics';
import {useMotionEnabled} from '@/components/motion-preferences';
type Barber={id:string;name:string;bio:string|null;avatar_url:string|null};
export function TeamJourney(){
 const root=useRef<HTMLElement>(null),track=useRef<HTMLDivElement>(null),enabled=useMotionEnabled();
 const [services,setServices]=useState<{id:string;name:string;description:string|null}[]>([]);
 const [barbers,setBarbers]=useState<Barber[]>([]);
 useEffect(()=>{if(getMissingClientEnvVars().length)return;let alive=true;Promise.resolve(supabase.from('public_barbers').select('id,name,bio,avatar_url').eq('barbershop_id',getBarbershopId())).then(({data,error})=>{if(error)reportSupabaseError('Team journey',error);else if(alive)setBarbers(data||[])}).catch(error=>reportSupabaseError('Team journey',error));return()=>{alive=false}},[]);
 useEffect(()=>{if(getMissingClientEnvVars().length)return;let alive=true;Promise.resolve(supabase.from('public_services').select('id,name,description').eq('barbershop_id',getBarbershopId()).order('name').limit(3)).then(({data,error})=>{if(error)reportSupabaseError('Serviços da experiência',error);else if(alive)setServices(data||[])});return()=>{alive=false}},[]);
 useEffect(()=>{
  if(!enabled||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  gsap.registerPlugin(ScrollTrigger);const el=root.current!,rail=track.current!;
  let focus=(_event:FocusEvent)=>{};
  const context=gsap.context(()=>{
   el.classList.add('journey-animated');
   const distance=()=>Math.max(0,rail.scrollWidth-el.clientWidth);
   const tween=gsap.to(rail,{x:()=>-distance(),ease:'none',scrollTrigger:{id:'team-journey',refreshPriority:50,pinSpacing:true,trigger:el,start:'top top',end:()=>`+=${distance()}`,pin:true,scrub:true,anticipatePin:1,invalidateOnRefresh:true,onRefresh:self=>{if(new URLSearchParams(location.search).has('debug-hero'))(window as Window&{__JOURNEY__?:unknown}).__JOURNEY__={start:self.start,end:self.end,progress:self.progress,x:Number(gsap.getProperty(rail,'x')),distance:distance(),panels:rail.children.length}},onUpdate:self=>{el.style.setProperty('--journey-progress',String(self.progress));if(new URLSearchParams(location.search).has('debug-hero'))(window as Window&{__JOURNEY__?:unknown}).__JOURNEY__={start:self.start,end:self.end,progress:self.progress,x:Number(gsap.getProperty(rail,'x')),distance:distance(),panels:rail.children.length}}}});
   focus=(event:FocusEvent)=>{const panel=(event.target as HTMLElement).closest('.journey-panel');if(!panel||!tween.scrollTrigger)return;const index=Array.from(rail.children).indexOf(panel);el.scrollLeft=0;jumpLandingTo(tween.scrollTrigger.start+index*el.clientWidth)};el.addEventListener('focusin',focus);
   gsap.utils.toArray<HTMLElement>('.journey-panel .journey-content').forEach(content=>gsap.fromTo(content,{y:16},{y:0,ease:'none',scrollTrigger:{trigger:content,containerAnimation:tween,start:'left right',end:'center center',scrub:true}}));
   gsap.utils.toArray<HTMLElement>('.journey-panel figure,.journey-photo').forEach(image=>{gsap.fromTo(image,{y:24,scale:.98},{y:-24,scale:1.03,ease:'none',scrollTrigger:{trigger:image.closest('.journey-panel'),containerAnimation:tween,start:'left right',end:'right left',scrub:true}})});
  },el);
  let disposed=false,lastWidth=0,lastHeight=0;const refresh=()=>{if(disposed)return;ScrollTrigger.sort();ScrollTrigger.refresh()};document.fonts.ready.then(refresh);const resize=new ResizeObserver(()=>{const w=el.clientWidth,h=el.clientHeight;if(w===lastWidth&&h===lastHeight)return;lastWidth=w;lastHeight=h;refresh()});resize.observe(el);refresh();
  return()=>{disposed=true;el.removeEventListener('focusin',focus);resize.disconnect();context.revert();el.classList.remove('journey-animated');el.style.removeProperty('--journey-progress');delete (window as Window&{__JOURNEY__?:unknown}).__JOURNEY__};
 },[enabled,barbers,services]);
 return <section ref={root} id="equipe" className="team-journey" aria-label="Conheça a equipe e escolha seu profissional"><div ref={track} className="journey-track"><article className="journey-panel journey-intro"><div className="journey-content"><p className="journey-eyebrow">01 / A experiência</p><h2>{barbers.length===1?<>Cuidado em<br/>cada detalhe.</>:<>Quem cuida<br/>do seu estilo.</>}</h2><p>{barbers.length===1?"Conheça o espaço, os serviços e o profissional que cuida do seu estilo.":"Conheça os profissionais e escolha seu próximo horário."}</p><Link className="text-link" href="/agendar">Agendar horário ↗</Link></div><figure><ShopImage name="espaco" alt="Ambiente da Auto Stilo"/></figure></article>{barbers.map((b,index)=><article key={b.id} className="journey-panel journey-professional"><BarberPhoto name={b.name} url={b.avatar_url} className="journey-photo"/><div className="journey-content"><p className="journey-eyebrow">{String(index+2).padStart(2,'0')} / Profissional Auto Stilo</p><h2>{b.name}</h2>{b.bio&&<p>{b.bio}</p>}<Link className="cta" href="/agendar">Agendar horário ↗</Link></div></article>)}{barbers.length===1&&services.length>0&&<article className="journey-panel"><div className="journey-content"><p className="journey-eyebrow">03 / Serviços da casa</p><h2>Escolha seu cuidado.</h2>{services.map(service=><div key={service.id}><h3>{service.name}</h3>{service.description&&<p>{service.description}</p>}</div>)}<Link className="cta" href="/agendar">Ver serviços e horários ↗</Link></div><figure><ShopImage name="acabamento" alt="Detalhes do atendimento na Auto Stilo"/></figure></article>}<article className="journey-panel journey-final"><div className="journey-content"><p className="journey-eyebrow">{String(barbers.length+2+(barbers.length===1&&services.length?1:0)).padStart(2,'0')} / No seu tempo.</p><h2>Seu próximo corte<br/>começa aqui.</h2><p>{barbers.length===1?"Escolha o serviço e um horário disponível.":"Escolha o serviço, o profissional e um horário disponível."}</p><Link className="cta" href="/agendar">Agendar horário ↗</Link></div></article></div><div className="journey-progress" aria-hidden="true"><span/></div></section>;
}
