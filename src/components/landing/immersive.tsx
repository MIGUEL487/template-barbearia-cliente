'use client';
import {useEffect,useRef} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {ShopImage} from './shop-image';
import {useMotionEnabled} from '@/components/motion-preferences';
export function Immersive(){const ref=useRef<HTMLElement>(null),enabled=useMotionEnabled();useEffect(()=>{if(!enabled)return;gsap.registerPlugin(ScrollTrigger);const ctx=gsap.context(()=>{gsap.utils.toArray<HTMLElement>('.immersive-image').forEach((el,i)=>{gsap.fromTo(el,{y:40,rotation:i?1:-1,scale:.98},{y:-24,rotation:0,scale:1,ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:.4}})})},ref);return()=>ctx.revert()},[enabled]);return <section ref={ref} id="assinatura" className="section immersive"><div id="galeria" className="immersive-heading"><p>Auto Stilo · Monte Sião</p><h2>Entre.<br/>Fique à vontade.</h2><p>O espaço, o cuidado e a atenção aos detalhes.</p></div><figure className="immersive-image"><ShopImage name="espaco" alt="Interior da barbearia Auto Stilo, com iluminação hexagonal"/><figcaption>Um espaço para o seu momento.</figcaption></figure><figure className="immersive-image immersive-detail"><ShopImage name="acabamento" alt="Detalhe de acabamento de um corte realizado na Auto Stilo"/><figcaption>Precisão, do corte ao acabamento.</figcaption></figure></section>}
