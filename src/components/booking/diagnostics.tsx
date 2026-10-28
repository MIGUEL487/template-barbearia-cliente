"use client";
import {useEffect, useState} from 'react';
import {demoMode} from '@/config/demo';
import {getBarbershopId, getMissingClientEnvVars} from '@/lib/supabase';
import type {AvailabilityDiagnostic} from '@/lib/booking-diagnostics';
export function BookingDiagnostics() {
  const [visible,setVisible]=useState(false);
  const [last,setLast]=useState<AvailabilityDiagnostic | null>(null);
  useEffect(()=>{
    setVisible(new URLSearchParams(location.search).get('debug')==='1');
    const onResult=(e:Event)=>setLast((e as CustomEvent<AvailabilityDiagnostic>).detail);
    window.addEventListener('booking-availability',onResult);
    return()=>window.removeEventListener('booking-availability',onResult);
  },[]);
  if(!visible)return null;
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const ref=url?.match(/^https:\/\/([a-z0-9-]+)\.supabase\.co\/?$/i)?.[1] || 'ausente ou inválido';
  return <aside aria-label="Diagnóstico de agendamento" className="booking-shell text-text bg-bg break-words">
    <h2>Diagnóstico de agendamento</h2>
    <p>Simulação: {demoMode?'sim':'não'} · Projeto: {ref}</p>
    <p>Barbearia: {getBarbershopId() || 'ausente'}</p>
    <p>Configuração pendente: {getMissingClientEnvVars().join(', ') || 'nenhuma'}</p>
    <p>Última consulta: {last ? last.error ? `${last.error.code || ''} ${last.error.message}` : `${last.slots} horários` : 'ainda não consultada'}</p>
    {last?.parameters && <p>Data: {last.parameters.p_date} · Profissional: {last.parameters.p_barber_id || 'sem preferência'}</p>}
  </aside>;
}
