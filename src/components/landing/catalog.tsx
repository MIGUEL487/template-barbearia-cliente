"use client";
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {demoMode,demoServices,demoBarbers} from '@/config/demo';
import {supabase,getBarbershopId} from '@/lib/supabase';
import snapshot from '@/config/snapshot.json';
type Service=Omit<typeof demoServices[number],'description'>&{description:string|null};
type Barber={id:string;name:string;bio:string|null;avatar_url:string|null};
export function Catalog(){
 const [services,setServices]=useState<Service[]>(demoMode?demoServices:snapshot.services);const [barbers,setBarbers]=useState<Barber[]>(demoMode?demoBarbers:snapshot.barbers);const [error,setError]=useState(false);const [loading,setLoading]=useState(!demoMode);
 useEffect(()=>{if(demoMode)return;let alive=true;Promise.all([supabase.from('public_services').select('id,name,description,duration_minutes,price').eq('barbershop_id',getBarbershopId()),supabase.from('public_barbers').select('id,name,bio,avatar_url').eq('barbershop_id',getBarbershopId())]).then(([s,b])=>{if(!alive)return;if(s.error||b.error)setError(true);else{setServices(s.data||[]);setBarbers(b.data||[])}setLoading(false)});return()=>{alive=false}},[]);
 return <><section id="servicos" className="section"><div className="section-heading"><h2>O seu próximo<br/>ritual.</h2><p>{demoMode?'Serviços, preços e durações de exemplo. Confirme os valores reais com a barbearia.':'Escolha o cuidado que combina com você.'}</p></div>{loading&&<p role="status">Carregando serviços…</p>}{error&&<p role="alert">Não foi possível carregar o catálogo. Fale com a barbearia pelo WhatsApp.</p>}<div className="service-list">{services.map(s=><Link className="service-row reveal-mask" href={`/agendar?service=${s.id}`} key={s.id}><h3>{s.name}</h3><p>{s.description}</p><span>{s.duration_minutes} min</span><strong>{Number(s.price).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</strong><span aria-hidden="true">↗</span></Link>)}</div></section><section id="equipe" className="section team-section"><div><h2>Quem cuida<br/>do seu estilo.</h2><p>{demoMode?'Equipe ilustrativa. Nomes e especialidades a confirmar.':'Conheça os profissionais e escolha seu horário.'}</p></div><div className="team-list">{barbers.map((b,i)=><article className="team-member reveal-mask" key={b.id}><div className="portrait-placeholder" aria-hidden="true"><span>{i===0?'AS':'ST'}</span></div><h3>{b.name}</h3><p>{b.bio}</p><Link href="/agendar">Escolher profissional</Link></article>)}</div></section></>;
}
