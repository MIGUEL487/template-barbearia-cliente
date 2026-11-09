"use client";
import {RegionalText,useRegional} from '@/components/regional/provider';
import {useEffect,useState,useRef} from 'react';
import Link from 'next/link';
import {motion,AnimatePresence,animate} from 'motion/react';
import {useMotionEnabled} from '@/components/motion-preferences';
import {demoMode,demoServices} from '@/config/demo';
import {supabase,getBarbershopId} from '@/lib/supabase';
import {getMissingClientEnvVars} from '@/lib/supabase';
import {reportSupabaseError} from '@/lib/booking-diagnostics';
type Service=Omit<typeof demoServices[number],'description'>&{description:string|null};
const category=(name:string)=>name.includes('+')?'Combos':/barba/i.test(name)?'Barba':/corte/i.test(name)?'Cabelo':'Cuidados';
function Price({value}:{value:number}){const {money}=useRegional();const ref=useRef<HTMLElement>(null),enabled=useMotionEnabled();useEffect(()=>{if(!enabled)return;const io=new IntersectionObserver(([e])=>{if(!e.isIntersecting)return;io.disconnect();const control=animate(0,value,{duration:.8,onUpdate:n=>{if(ref.current)ref.current.textContent=money(n)}});stop=()=>control.stop()});let stop=()=>{};if(ref.current)io.observe(ref.current);return()=>{io.disconnect();stop()}},[value,enabled,money]);return <strong ref={ref} aria-label={money(value)}>{money(value)}</strong>}
export function Catalog(){
const {t}=useRegional();

 const [filter,setFilter]=useState('Todos'),[expanded,setExpanded]=useState<string|null>(null);
 const [services,setServices]=useState<Service[]>(demoMode?demoServices:[]);const [error,setError]=useState(false);const [loading,setLoading]=useState(!demoMode);
 useEffect(()=>{if(demoMode)return;if(getMissingClientEnvVars().length){setError(true);setLoading(false);return;}let alive=true;Promise.resolve(supabase.from('public_services').select('id,name,description,duration_minutes,price').eq('barbershop_id',getBarbershopId())).then(s=>{if(!alive)return;if(s.error){reportSupabaseError("Catalogue",s.error);setError(true);}else{setServices(s.data||[])}setLoading(false)}).catch(e=>{reportSupabaseError("Catalogue",e);if(alive){setError(true);setLoading(false)}});return()=>{alive=false}},[]);
 return <><section id="servicos" className="section"><div className="section-heading"><h2><RegionalText text="O seu próximo"/><br/><RegionalText text="ritual."/></h2><p>{demoMode?'Serviços, preços e durações de exemplo. Confirme os valores reais com a barbearia.':t('Escolha o cuidado que combina com você.')}</p></div>{loading&&<p role="status"><RegionalText text="Carregando serviços…"/></p>}{error&&<p role="alert"><RegionalText text="Não foi possível carregar o catálogo. Fale com a barbearia pelo WhatsApp."/></p>}<div className="filters" role="group" aria-label={t("Categorias de serviços")}>{['Todos','Cabelo','Barba','Combos','Cuidados'].map(c=><button key={c} aria-pressed={filter===c} onClick={()=>setFilter(c)}>{t(c)}</button>)}</div><motion.div layout className="service-list"><AnimatePresence initial={false}>{services.filter(s=>filter==='Todos'||category(s.name)===filter).map(s=><motion.article layout initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0}} key={s.id} className="service-item">
<button type="button" className="service-row" aria-expanded={expanded===s.id} onClick={()=>setExpanded(expanded===s.id?null:s.id)}><h3>{s.name}</h3><p>{s.description}</p><span>{s.duration_minutes}<RegionalText text="min"/></span><Price value={Number(s.price)}/><span aria-hidden="true">+</span></button>
{expanded===s.id&&<div className="service-actions"><Link className="cta" href={`/agendar?service=${s.id}`}><RegionalText text="Agendar este serviço"/></Link><a className="text-link" href="https://wa.me/5535997374960?text=Ol%C3%A1%21%20Gostaria%20de%20informa%C3%A7%C3%B5es."><RegionalText text="WhatsApp"/></a></div>}
</motion.article>)}</AnimatePresence></motion.div></section></>;
}
