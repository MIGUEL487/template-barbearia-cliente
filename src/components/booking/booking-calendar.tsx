"use client";
import {useEffect,useId,useState} from 'react';
import {ChevronLeft,ChevronRight} from 'lucide-react';
import {AnimatePresence,motion} from 'motion/react';
import {useMotionEnabled} from '@/components/motion-preferences';
import {supabase,getBarbershopId,getMissingClientEnvVars} from '@/lib/supabase';
import {reportSupabaseError} from '@/lib/booking-diagnostics';

const dayKey=(year:number,month:number,day:number)=>`${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
const todayInBrazil=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
export function BookingCalendar({value,barberId,serviceIds,onChange,onAvailability}:{value:string;barberId:string|null;serviceIds:string[];onChange:(date:string)=>void;onAvailability:(available:boolean)=>void}){
 const id=useId(),today=todayInBrazil();
 const enabled=useMotionEnabled(),[direction,setDirection]=useState(1);
 const [month,setMonth]=useState(()=>value.slice(0,7)||today.slice(0,7));
 const [days,setDays]=useState<Record<string,boolean>>({}),[loading,setLoading]=useState(true),[failed,setFailed]=useState(false),[revision,setRevision]=useState(0);
 const [checking,setChecking]=useState(false);
 const services=serviceIds.join(',');
 const [year,index]=month.split('-').map(Number),monthIndex=index-1;
 const firstDay=new Date(Date.UTC(year,monthIndex,1)),count=new Date(Date.UTC(year,monthIndex+1,0)).getUTCDate();
 const title=firstDay.toLocaleDateString('pt-BR',{timeZone:'UTC',month:'long'});
 useEffect(()=>{const refresh=()=>setRevision(n=>n+1);window.addEventListener('focus',refresh);return()=>window.removeEventListener('focus',refresh)},[]);
 useEffect(()=>{
  let cancelled=false;setLoading(true);setFailed(false);setDays({});
  if(getMissingClientEnvVars().length||!services){setFailed(true);setLoading(false);return}
  const dates=Array.from({length:count},(_,i)=>dayKey(year,monthIndex,i+1)).filter(date=>date>=today),result:Record<string,boolean>={};let cursor=0;
  const worker=async()=>{while(!cancelled&&cursor<dates.length){const date=dates[cursor++];try{
   const {data,error}=await supabase.rpc('get_availability',{p_barbershop_id:getBarbershopId(),p_barber_id:barberId,p_date:date,p_service_ids:services.split(',')});
   if(cancelled)return;if(error)throw error;result[date]=Array.isArray(data)&&data.length>0;
  }catch(error){if(cancelled)return;reportSupabaseError('Calendário/get_availability',error);result[date]=false;setFailed(true)}}};
  void Promise.all(Array.from({length:3},worker)).then(()=>{if(!cancelled){setDays(result);setLoading(false)}});
  return()=>{cancelled=true};
 },[month,barberId,services,revision,today,count,year,monthIndex]);
 useEffect(()=>onAvailability(!loading&&days[value]===true),[loading,days,value,onAvailability]);
 const move=(delta:number)=>{setDirection(delta);const d=new Date(Date.UTC(year,monthIndex+delta,1));setMonth(dayKey(d.getUTCFullYear(),d.getUTCMonth(),1).slice(0,7))};
 const choose=async(date:string)=>{
  if(checking)return;setChecking(true);onAvailability(false);
  try{const {data,error}=await supabase.rpc('get_availability',{p_barbershop_id:getBarbershopId(),p_barber_id:barberId,p_date:date,p_service_ids:services.split(',')});if(error)throw error;
   const available=Array.isArray(data)&&data.length>0;setDays(current=>({...current,[date]:available}));if(available)onChange(date);
  }catch(error){reportSupabaseError('Calendário/selecionar dia',error);setDays(current=>({...current,[date]:false}));setFailed(true)}finally{setChecking(false)}
 };
 return <section className="booking-calendar" aria-labelledby={id} aria-busy={loading||checking}>
  <div className="booking-calendar-heading"><button type="button" aria-label="Mês anterior" disabled={month<=today.slice(0,7)} onClick={()=>move(-1)}><ChevronLeft size={20}/></button><h2 id={id}>{title}<span>{year}</span></h2><button type="button" aria-label="Próximo mês" onClick={()=>move(1)}><ChevronRight size={20}/></button></div>
  <div className="booking-calendar-grid" aria-hidden="true">{['D','S','T','Q','Q','S','S'].map((d,i)=><span className="booking-calendar-weekday" key={i}>{d}</span>)}</div>
  <AnimatePresence mode="wait" initial={false}><motion.div key={month} initial={{opacity:0,x:enabled?direction*16:0}} animate={{opacity:1,x:0}} exit={{opacity:0,x:enabled?-direction*16:0}} transition={{duration:enabled?0.2:0,ease:[.22,1,.36,1]}} className="booking-calendar-grid" role="group" aria-label="Escolher data">
   {Array.from({length:firstDay.getUTCDay()},(_,i)=><span key={`empty-${i}`} aria-hidden="true"/>)}
   {Array.from({length:count},(_,i)=>{const day=i+1,date=dayKey(year,monthIndex,day),available=!loading&&days[date]===true;return <motion.button type="button" key={date} disabled={!available||checking} whileTap={enabled?{scale:.92}:undefined} aria-label={`${String(day).padStart(2,'0')}/${String(index).padStart(2,'0')}/${year}${available?'':loading?' · consultando':' · indisponível'}`} aria-pressed={date===value&&available} aria-current={date===today?'date':undefined} onClick={()=>void choose(date)}>{date===value&&available&&<motion.span aria-hidden="true" className="calendar-selection" layoutId={id+'-selection'} transition={enabled?{type:'spring',stiffness:420,damping:34}:{duration:0}}/>}<span className="calendar-day-number">{day}</span></motion.button>})}
  </motion.div></AnimatePresence>
  <p className="booking-calendar-note" role="status">{loading||checking?'Consultando os dias disponíveis…':'Dias apagados não estão disponíveis para agendamento.'}</p>
  {failed&&<div className="booking-calendar-error"><p role="alert">Não foi possível consultar todos os dias. Tente novamente.</p><button type="button" className="button-secondary" onClick={()=>setRevision(n=>n+1)}>Atualizar calendário</button></div>}
 </section>;
}
