"use client";
import {useEffect,useRef} from 'react';
import confetti from 'canvas-confetti';
import {useMotionEnabled} from '@/components/motion-preferences';
export function Celebration(){const ref=useRef<HTMLCanvasElement>(null),enabled=useMotionEnabled();useEffect(()=>{if(!enabled||document.hidden||!ref.current)return;const fire=confetti.create(ref.current,{resize:true,useWorker:false});void fire({particleCount:72,spread:70,origin:{y:.65},colors:['#7C3AED','#0A0A0C','#FFFFFF'],disableForReducedMotion:true,ticks:100});const stop=()=>{if(document.hidden)fire.reset()};document.addEventListener('visibilitychange',stop);return()=>{fire.reset();document.removeEventListener('visibilitychange',stop)}},[enabled]);return <canvas ref={ref} aria-hidden="true" className="celebration"/>}
