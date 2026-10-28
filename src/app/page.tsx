import {Navigation} from '@/components/landing/navigation';
import {Hero} from '@/components/landing/hero';
import {Catalog} from '@/components/landing/catalog';
import {Gallery,Reviews,Details} from '@/components/landing/sections';
import {LandingMotion} from '@/components/landing/motion';
import {Signature,Ritual,History,MarqueeFooter} from '@/components/landing/editorial';
export default function Page(){return <><Navigation/><main id="conteudo"><Hero/><Signature/><Ritual/><Catalog/><History/><Gallery/><Reviews/><Details/><MarqueeFooter/></main><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":"BarberShop",name:"Barbearia Auto Stilo",telephone:"+5535997374960",address:{"@type":"PostalAddress",streetAddress:"R. do Tanque, 395 – Bela Vista",addressLocality:"Monte Sião",addressRegion:"MG",postalCode:"37580-000",addressCountry:"BR"}})}}/><LandingMotion/></>}
