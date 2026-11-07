import { TransitionMarquee } from "@/components/landing/transition-marquee";
import { LandingScroll } from "@/components/landing/scroll-manager";
import { TeamJourney } from "@/components/landing/team-journey";
import localFont from "next/font/local";
import { Immersive } from "@/components/landing/immersive";
import { Navigation } from "@/components/landing/navigation";
import { CinematicHero } from "@/components/landing/cinematic-hero";
import "./cinematic.css";
import { Catalog } from "@/components/landing/catalog";
import { Reviews, Details } from "@/components/landing/sections";
import { LandingMotion } from "@/components/landing/motion";
import {
  Signature,
  Ritual,
  History,
  MarqueeFooter,
} from "@/components/landing/editorial";

const cinzel = localFont({
  src: "./fonts/cinzel.ttf",
  variable: "--font-cinema-title",
  display: "swap",
});
const outfit = localFont({
  src: "./fonts/outfit.ttf",
  variable: "--font-cinema-body",
  display: "swap",
});

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BarberShop",
    name: "Barbearia Modelo",
    image: "/img/template/full/01_barbearia_interior.webp",
    telephone: "+5511999999999",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. Principal, 1000 – Centro",
      addressLocality: "São Paulo",
      addressRegion: "SP",
      postalCode: "01000-000",
      addressCountry: "BR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "-23.5505",
      longitude: "-46.6333",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:00",
        closes: "19:00",
      },
    ],
  };

  return (
    <div className={`cinematic-site ${cinzel.variable} ${outfit.variable}`}>
      <LandingScroll />
      <Navigation />
      <main id="conteudo">
        <CinematicHero />
        <TransitionMarquee />
        <Immersive />
        <Signature />
        <TeamJourney />
        <Ritual />
        <Catalog />
        <History />
        <Reviews />
        <Details />
        <MarqueeFooter />
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingMotion />
    </div>
  );
}
