'use client';
import {regionalTheme} from '@/lib/regional/theme';

import {createContext,useContext,useMemo,useEffect,useState,type ReactNode} from 'react';
import {defaultRegion,intlLocale,regionalMoney,parseProfile,type RegionalProfile} from '@/lib/regional/profile';
import {translate} from '@/lib/regional/strings';
const Context=createContext<RegionalProfile>(defaultRegion);
export function RegionalProvider({profile,children}:{profile:RegionalProfile;children:ReactNode}){
 const [current,setCurrent]=useState(profile),[failed,setFailed]=useState(false);
 useEffect(()=>{let alive=true;const controller=new AbortController();
  const refresh=async()=>{try{const response=await fetch('/__openpage/region',{cache:'no-store',credentials:'omit',signal:controller.signal});if(response.status===204||response.status===404)return;if(!response.ok)throw new Error('Region unavailable');const raw=await response.json();if(!raw||typeof raw!=='object'||!('slug' in raw)||typeof raw.slug!=='string')throw new Error('Invalid region');const region=parseProfile(raw,raw.slug,location.origin);if(alive){setCurrent(region);setFailed(false);}}catch{if(alive)setFailed(true);}};
  void refresh();const timer=setInterval(()=>void refresh(),60000);window.addEventListener('focus',refresh);
  return()=>{alive=false;controller.abort();clearInterval(timer);window.removeEventListener('focus',refresh);};
 },[]);
 useEffect(()=>{if(!current.slug)return;document.documentElement.lang=intlLocale(current);document.documentElement.dataset.regional=current.slug;document.title=current.name;for(const [key,value] of Object.entries(regionalTheme(current)))document.documentElement.style.setProperty(key,value);},[current]);
 if(failed)return <main role="alert"><p>Não foi possível carregar a configuração. Atualize a página.</p><button onClick={()=>location.reload()}>Atualizar</button></main>;
 return <Context.Provider value={current}>{children}</Context.Provider>;
}
export function useRegional(){const profile=useContext(Context);return useMemo(()=>({profile,locale:intlLocale(profile),money:(value:number)=>regionalMoney(value,profile),t:(text:string)=>translate(text,profile.locale).replaceAll('Barbearia Modelo',profile.name)}),[profile]);}
/** Renders text directly: no toolbar, DOM observer, external translation service or new layout wrapper. */
export function RegionalText({text}:{text:string}){const {t}=useRegional();return t(text);}
