import {Navigation} from '@/components/landing/navigation';
import {Hero} from '@/components/landing/hero';
import {Catalog} from '@/components/landing/catalog';
import {Proof,Gallery,Reviews,Details} from '@/components/landing/sections';
import {LandingMotion} from '@/components/landing/motion';
export default function Page(){return <><Navigation/><main id="conteudo"><Hero/><Proof/><Catalog/><Gallery/><Reviews/><Details/></main><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":"HairSalon",name:"Barbearia Auto Stilo",telephone:"+5535997374960",address:{"@type":"PostalAddress",streetAddress:"R. do Tanque, 395 – Bela Vista",addressLocality:"Monte Sião",addressRegion:"MG",postalCode:"37580-000",addressCountry:"BR"}})}}/><LandingMotion/></>}
