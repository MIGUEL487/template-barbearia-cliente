"use client";
import {RegionalText,useRegional} from '@/components/regional/provider';

import type {useLiveBooking} from './use-live-booking';

import {motion} from 'motion/react';

// Same entrance used by the existing booking steps; styling comes from landing.css.
const entrance = {initial:{opacity:0,y:24},animate:{opacity:1,y:0},exit:{opacity:0,y:-16},transition:{duration:.45,ease:[.22,1,.36,1] as [number,number,number,number]}};
export function LiveChoices({state}: {state: ReturnType<typeof useLiveBooking>}) {
const {t,locale,profile,money:formatCurrency}=useRegional();

  if(state.step===2)return <motion.section {...entrance} aria-label={t("Serviços")} className="space-y-8">
    <div className="text-center"><h1><RegionalText text="Escolha os serviços"/></h1></div>
    {state.services.length===0 && <p><RegionalText text="Nenhum serviço disponível. Fale com a barbearia."/></p>}
    <fieldset><legend className="sr-only"><RegionalText text="Serviços disponíveis"/></legend>{state.services.map(s=><label key={s.id} className="choice">
      <input type="checkbox" checked={state.selectedServices.some(x=>x.id===s.id)} onChange={()=>state.toggleService(s)}/>
      <span><strong>{s.name}</strong><small>{s.description}</small><small>{s.duration_minutes}<RegionalText text="min ·"/>{formatCurrency(Number(s.price))}</small></span>
    </label>)}</fieldset>
  </motion.section>;
  return <motion.section {...entrance} aria-label={t("Horários")} className="space-y-8">
    <div className="text-center"><h1><RegionalText text="Escolha a data e o horário"/></h1><p className="text-text-muted">{profile.timezone}</p></div>
    <label className="field-label"><RegionalText text="Data"/><input type="date" value={state.selectedDate} min={state.upcomingDays[0]?.iso} onChange={e=>state.setSelectedDate(e.target.value)}/></label>
    {state.isLoadingSlots?<p role="status"><RegionalText text="Consultando horários…"/></p>:state.availableSlots.length===0?<p role="status"><RegionalText text="Não há horários disponíveis nesta data."/></p>:<div className="time-choices">{state.availableSlots.map(slot=><button type="button" key={`${slot.barber_id}-${slot.start_time}`} aria-pressed={state.selectedSlot?.start_time===slot.start_time && state.selectedSlot?.barber_id===slot.barber_id} onClick={()=>state.setSelectedSlot(slot)}>{new Date(slot.start_time).toLocaleTimeString(locale,{timeZone:profile.timezone,hour:'2-digit',minute:'2-digit'})} · {state.barbers.find(b=>b.id===slot.barber_id)?.name || 'Profissional disponível'}</button>)}</div>}
  </motion.section>;
}
