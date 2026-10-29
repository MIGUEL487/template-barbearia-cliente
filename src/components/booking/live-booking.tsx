"use client";
import Link from 'next/link';
import {useCallback,useState} from 'react';
import {BookingCalendar} from './booking-calendar';
import {BarberPhoto} from '@/components/barber-photo';
import {BookingSkeleton,BrandLoading} from './booking-loading';
import {AnimatePresence,motion,useReducedMotion} from 'motion/react';
import {DemoBadge} from '@/components/demo-watermark';
import {formatCurrency} from '@/lib/utils';
import {useLiveBooking} from './use-live-booking';

const titles=['Profissional','Serviço','Horário','Confira','Concluído'];
const time=(iso:string)=>new Date(iso).toLocaleTimeString('pt-BR',{timeZone:'America/Sao_Paulo',hour:'2-digit',minute:'2-digit'});
export default function LiveBooking(){
 const s=useLiveBooking(),reduced=useReducedMotion();
 const serviceSummary=s.selectedServices.map(service=>`${s.serviceQuantities[service.id]||1}× ${service.name}`).join(', ');
 const [calendarAvailable,setCalendarAvailable]=useState(false);
 const [calendarLoading,setCalendarLoading]=useState(true);
 const loadingTimes=s.isLoadingSlots||calendarLoading;
 const {setSelectedSlot}=s;
 const onCalendarAvailability=useCallback((available:boolean)=>{setCalendarAvailable(available);if(!available)setSelectedSlot(null)},[setSelectedSlot]);
 const disabled=s.isLoadingInitial||s.missingEnv.length>0||s.isSubmitting||(s.step===1&&!s.selectedBarber)||(s.step===2&&!s.selectedServices.length)||(s.step===3&&(!calendarAvailable||!s.selectedSlot||s.isLoadingSlots))||(s.step===4&&(!s.acceptedTerms||!s.customerName.trim()||!s.customerPhone.trim()));
 return <main className="booking-shell">
  <Link className="brand" href="/">Auto Stilo<span>Voltar ao início</span></Link>
  <ol className="step-progress" aria-label="Etapas">{titles.slice(0,4).map((title,i)=><li key={title} aria-current={i===s.step-1?'step':undefined}>{i+1}<span>{title}</span></li>)}</ol>
  <h1>{s.step===5?'Pré-reserva criada':titles[s.step-1]}</h1>
  {s.errorBanner&&<p className="demo-alert" role="alert">{s.errorBanner}</p>}
  <AnimatePresence mode="wait"><motion.div key={s.isLoadingInitial?'initial':s.step} initial={{opacity:0,x:reduced?0:16}} animate={{opacity:1,x:0}} exit={{opacity:0,x:reduced?0:-16}} transition={{duration:.18}}>
   {s.isLoadingInitial&&<BookingSkeleton/>}
   {!s.isLoadingInitial&&s.step===1&&<fieldset><legend>Com quem você quer cortar?</legend>
    {s.barbers.map(b=><label className="choice" key={b.id}><input type="radio" name="barber" checked={s.selectedBarber?.id===b.id} onChange={()=>s.setSelectedBarber(b)}/><BarberPhoto url={b.avatar_url||null} name={b.name}/><span><strong>{b.name}</strong><small>{b.bio}</small></span></label>)}
    {!!s.barbers.length&&<label className="choice"><input type="radio" name="barber" checked={s.selectedBarber!==null&&s.selectedBarber.id===null} onChange={()=>s.setSelectedBarber({id:null,name:'Primeiro disponível',bio:null})}/><span><strong>Sem preferência</strong><small>Escolher o primeiro profissional disponível.</small></span></label>}
   </fieldset>}
   {s.step===2&&<fieldset aria-label="Serviços"><legend>Escolha os serviços</legend><p>Escolha quantas pessoas farão cada serviço. Os atendimentos serão seguidos, com o mesmo profissional.</p>{s.services.map(service=>{const selected=s.selectedServices.some(x=>x.id===service.id),quantity=s.serviceQuantities[service.id]||1;return <div className="choice service-choice" key={service.id}><label className="service-choice-main"><input type="checkbox" checked={selected} onChange={()=>s.toggleService(service)}/><span><strong>{service.name}</strong><small>{service.duration_minutes} min · {formatCurrency(Number(service.price))} por pessoa</small></span></label>{selected&&<div className="service-quantity" role="group" aria-label={'Pessoas para '+service.name}><button type="button" aria-label={'Diminuir pessoas para '+service.name} disabled={quantity<=1} onClick={()=>s.setServiceQuantity(service.id,quantity-1)}>−</button><output aria-live="polite" aria-label={'Quantidade de pessoas para '+service.name}>{quantity}</output><button type="button" aria-label={'Aumentar pessoas para '+service.name} disabled={quantity>=6} onClick={()=>s.setServiceQuantity(service.id,quantity+1)}>+</button><small>{quantity===1?'pessoa':'pessoas'}</small></div>}</div>})}<p>Total de serviços: {s.totalDuration} min · {formatCurrency(s.totalPrice)}. O tempo de preparação, se houver, também será reservado.</p>{!s.services.length&&<p>Nenhum serviço disponível. Fale com a barbearia.</p>}</fieldset>}
   {s.step===3&&<fieldset aria-label="Horários"><legend>Data e horário</legend>
    <div className="booking-date-layout">
    <BookingCalendar value={s.selectedDate} barberId={s.selectedBarberId} serviceIds={s.requestedServiceIds} onChange={date=>{if(date===s.selectedDate)void s.fetchAvailability();else s.setSelectedDate(date)}} onAvailability={onCalendarAvailability} onLoadingChange={setCalendarLoading}/>
    <section className="booking-time-panel" aria-label="Horários disponíveis"><h2>Horários disponíveis</h2><p>{s.selectedDate.split('-').reverse().join('/')}</p>
    <div className="booking-slots-region" aria-busy={loadingTimes}><AnimatePresence mode="wait" initial={false}>{loadingTimes?<motion.div key="loading" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:reduced?0:.15}}><BookingSkeleton kind="slots"/></motion.div>:<motion.div key={s.selectedDate} className="time-choices" initial={{opacity:0,y:reduced?0:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:reduced?0:-8,pointerEvents:'none'}} transition={{duration:reduced?0:.22}}>{calendarAvailable&&s.availableSlots.map(slot=><motion.button type="button" whileTap={reduced?undefined:{scale:.96}} aria-pressed={s.selectedSlot?.start_time===slot.start_time&&s.selectedSlot?.barber_id===slot.barber_id} key={slot.barber_id+slot.start_time} onClick={()=>s.setSelectedSlot(slot)}>{time(slot.start_time)}{s.selectedBarber?.id===null&&(' · '+(s.barbers.find(b=>b.id===slot.barber_id)?.name || 'Profissional disponível'))}</motion.button>)}</motion.div>}</AnimatePresence>
    {!loadingTimes&&!s.availableSlots.length&&<p role="status">Não há horários disponíveis nesta data.</p>}</div>
    <p>Horários de Brasília · America/Sao_Paulo.</p>
    </section></div>
   </fieldset>}
   {s.step===4&&<form id="booking-confirmation" onSubmit={e=>{e.preventDefault();void s.handleConfirmBooking()}}>
    <h2>Resumo do agendamento</h2><dl className="booking-summary"><dt>Serviço</dt><dd>{serviceSummary}</dd><dt>Profissional</dt><dd>{s.barbers.find(b=>b.id===s.selectedSlot?.barber_id)?.name || s.selectedBarber?.name}</dd><dt>Quando</dt><dd>{s.selectedDate.split('-').reverse().join('/')} às {s.selectedSlot&&time(s.selectedSlot.start_time)}</dd><dt>Valor</dt><dd>{formatCurrency(s.totalPrice)}</dd><dt>Sinal ({s.depositPct}%)</dt><dd>{formatCurrency(s.depositAmount)}</dd></dl>
    <label className="field-label">Nome completo<input value={s.customerName} onChange={e=>s.setCustomerName(e.target.value)} placeholder="Seu nome" autoComplete="name" required/></label>
    <label className="field-label">WhatsApp<input type="tel" value={s.customerPhone} onChange={e=>s.setCustomerPhone(e.target.value)} placeholder="(11) 99999-9999" autoComplete="tel" required/></label>
    <label className="field-label">E-mail (opcional)<input type="email" value={s.customerEmail} onChange={e=>s.setCustomerEmail(e.target.value)} placeholder="seuemail@exemplo.com" autoComplete="email"/></label>
    <label className="choice"><input type="checkbox" checked={s.acceptedTerms} onChange={e=>s.setAcceptedTerms(e.target.checked)} required/>Concordo com os Termos de Uso e a Política de Cancelamento.</label>
    <label className="choice"><input type="checkbox" checked={s.marketingConsent} onChange={e=>s.setMarketingConsent(e.target.checked)}/>Aceito receber lembretes e promoções via WhatsApp.</label>
   </form>}
   {s.step===5&&<div className="demo-success" role="status"><DemoBadge/><span aria-hidden="true">✓</span><p>Seu horário está separado por 15 minutos.<br/>A confirmação do pagamento ainda está pendente.</p>{s.holdExpiresAt&&<p>Pré-reserva ativa: {Math.floor(s.countdownSeconds/60)}:{String(s.countdownSeconds%60).padStart(2,'0')}</p>}<Link className="cta" href={'/meu-agendamento?token='+encodeURIComponent(s.bookingToken)}>Ver meu agendamento</Link><p>Fale com a barbearia para concluir.</p></div>}
  </motion.div></AnimatePresence>
  {s.step<5&&<div className="booking-actions"><p>{serviceSummary || 'Selecione um serviço'}<strong>{formatCurrency(s.totalPrice)}</strong></p><div className="booking-action-buttons">{s.step>1&&<button type="button" className="button-secondary" disabled={s.isSubmitting} onClick={()=>s.setStep((s.step-1) as 1|2|3|4)}>Voltar</button>}{s.step===4?<button className="cta" type="submit" form="booking-confirmation" disabled={Boolean(disabled)} aria-busy={s.isSubmitting}>{s.isSubmitting?<><BrandLoading compact label="Criando sua pré-reserva"/><span>Confirmar reserva</span></>:'Confirmar reserva'}</button>:<button className="cta" type="button" disabled={Boolean(disabled)} onClick={()=>s.setStep((s.step+1) as 2|3|4)}>Continuar</button>}</div></div>}
 </main>;
}
