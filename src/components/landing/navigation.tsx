"use client";
import { useEffect, useRef, useState } from 'react';
import {DemoBadge} from '@/components/demo-watermark';
import Link from 'next/link';
import {BrandLogo} from '@/components/brand-logo';
import { shop } from '@/config/demo';
const links=[['servicos','Serviços'],['equipe','Equipe'],['galeria','Espaço'],['avaliacoes','Avaliações'],['contato','Contato']];
export function Navigation(){
 const [open,setOpen]=useState(false); const nav=useRef<HTMLElement>(null),header=useRef<HTMLElement>(null);
 useEffect(()=>{const el=header.current;if(!el)return;let previous=0,frame=0;const measure=()=>{const height=Math.ceil(el.getBoundingClientRect().height);if(height===previous)return;previous=height;document.documentElement.style.setProperty('--header-h',`${height}px`);cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>window.dispatchEvent(new Event('auto-stilo-header-resize')))};measure();const observer=new ResizeObserver(measure);observer.observe(el);return()=>{observer.disconnect();cancelAnimationFrame(frame);document.documentElement.style.removeProperty('--header-h')}},[]);
 useEffect(()=>{const io=new IntersectionObserver(es=>{for(const e of es) if(e.isIntersecting){nav.current?.querySelectorAll('a').forEach(a=>{if(a.hash===`#${e.target.id}`)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}},{rootMargin:'-20% 0px -55% 0px'});links.forEach(([id])=>{const el=document.getElementById(id);if(el)io.observe(el)});return()=>io.disconnect()},[]);
 return <><a className="skip" href="#assinatura">Pular para o conteúdo</a><header ref={header} className="site-header"><Link className="brand brand-with-logo" href="/" aria-label="Auto Stilo, início"><BrandLogo/><span className="brand-copy"><span className="brand-name">Auto Stilo</span><span className="brand-tagline">Barbearia <DemoBadge/></span></span></Link><nav ref={nav} aria-label="Navegação principal" className={open?'site-nav is-open':'site-nav'}>{links.map(([id,label])=><a key={id} href={`/#${id}`} onClick={()=>setOpen(false)}>{label}</a>)}</nav><Link className="cta small" href="/agendar">Agendar horário</Link><button className="menu-toggle" aria-expanded={open} aria-label={open?'Fechar menu':'Abrir menu'} onClick={()=>setOpen(!open)} onKeyDown={e=>{if(e.key==='Escape')setOpen(false)}}>{open?'Fechar':'Menu'}</button></header><nav className="mobile-actions" aria-label="Ações rápidas"><Link href="/agendar">Agendar horário</Link><a href={shop.whatsapp}>WhatsApp</a></nav></>;
}
