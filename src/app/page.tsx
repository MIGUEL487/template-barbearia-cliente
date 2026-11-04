import localFont from 'next/font/local';
import {Navigation} from '@/components/landing/navigation';
import {CinematicHero} from '@/components/landing/cinematic-hero';
import './cinematic.css';
import {Catalog} from '@/components/landing/catalog';
import {Gallery,Reviews,Details} from '@/components/landing/sections';
import {LandingMotion} from '@/components/landing/motion';
import {Signature,Ritual,History,MarqueeFooter} from '@/components/landing/editorial';
const cinzel=localFont({src:'./fonts/cinzel.ttf',variable:'--font-cinema-title',display:'swap'});
const outfit=localFont({src:'./fonts/outfit.ttf',variable:'--font-cinema-body',display:'swap'});
export default function Page(){return <div className={`cinematic-site ${cinzel.variable} ${outfit.variable}`}><Navigation/><main id="conteudo"><CinematicHero/><Signature/><Ritual/><Catalog/><History/><Gallery/><Reviews/><Details/><MarqueeFooter/></main><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":"BarberShop",name:"Barbearia Auto Stilo",telephone:"+5535997374960",address:{"@type":"PostalAddress",streetAddress:"R. do Tanque, 395 – Bela Vista",addressLocality:"Monte Sião",addressRegion:"MG",postalCode:"37580-000",addressCountry:"BR"}})}}/><LandingMotion/></div>}
