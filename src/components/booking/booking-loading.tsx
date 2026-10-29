import Image from 'next/image';

// Native transparent composition inspired by the supplied MP4, using our approved logo.
export function BrandLoading({label='Consultando disponibilidade',compact=false}:{label?:string;compact?:boolean}){
 return <span className={compact?'brand-loading is-compact':'brand-loading'} role="status" aria-label={label}>
  <svg viewBox="0 0 96 96" aria-hidden="true"><circle className="brand-loading-track" cx="48" cy="48" r="44"/><circle className="brand-loading-arc" cx="48" cy="48" r="44"/></svg>
  <Image src="/brand/auto-stilo/logo-on-light.png" alt="" width={64} height={52} unoptimized/>
 </span>;
}
export function BookingSkeleton({kind='professionals'}:{kind?:'professionals'|'slots'}){
 return <div className={`booking-skeleton booking-skeleton-${kind}`} aria-busy="true" data-booking-skeleton={kind}>
  <div className="booking-skeleton-heading"><span className="skeleton-block skeleton-caption" aria-hidden="true"/><BrandLoading label={kind==='professionals'?'Consultando equipe e serviços':'Consultando horários disponíveis'}/></div>
  {kind==='professionals'?<div aria-hidden="true">{[0,1,2].map(i=><div className="booking-skeleton-person" key={i}><span className="skeleton-block skeleton-avatar"/><div><span className="skeleton-block skeleton-name"/><span className="skeleton-block skeleton-description"/></div></div>)}</div>:<div className="booking-skeleton-slots-grid" aria-hidden="true">{[0,1,2,3,4,5].map(i=><span className="skeleton-block skeleton-slot" key={i}/>)}</div>}
 </div>;
}
