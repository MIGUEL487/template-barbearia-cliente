import type { CSSProperties } from 'react';
import {envFlag} from '@/lib/env-flag';
export const watermarkEnabled=envFlag(process.env.NEXT_PUBLIC_DEMO_WATERMARK);
const text=process.env.NEXT_PUBLIC_WATERMARK_TEXT||'DEMONSTRAÇÃO · SUA MARCA';
const contact=process.env.NEXT_PUBLIC_WATERMARK_CONTACT;
const escape=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]!));
export function DemoWatermark(){if(!watermarkEnabled)return null;const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="520" height="300"><text x="20" y="150" transform="rotate(-25 260 150)" fill="#77717e" font-family="sans-serif" font-size="18">${escape(text)}</text></svg>`;return <><div className="watermark-pattern" aria-hidden="true" style={{backgroundImage:`url("data:image/svg+xml,${encodeURIComponent(svg)}")`} as CSSProperties}/><aside className="watermark-badge" aria-label="Versão de demonstração"><strong>Versão de demonstração</strong><span>{text}</span>{contact&&<span>{contact}</span>}</aside><p className="watermark-footer">{text}{contact&&` · ${contact}`}</p></>}
export function PhotoWatermark(){
 if(!watermarkEnabled)return null;
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="360" height="240"><text x="24" y="120" transform="rotate(-25 180 120)" fill="white" stroke="#0a0a0c" stroke-width=".5" paint-order="stroke" font-family="sans-serif" font-size="14">${escape(text)}</text></svg>`;
 return <span className="photo-watermark" aria-hidden="true" style={{backgroundImage:`url("data:image/svg+xml,${encodeURIComponent(svg)}")`}}/>;
}
export function DemoBadge(){return watermarkEnabled?<span className="demo-badge">DEMO</span>:null}
