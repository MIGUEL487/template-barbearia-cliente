import { DemoWatermark, watermarkEnabled } from "@/components/demo-watermark";
import { MotionPreferences } from "@/components/motion-preferences";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
const display=localFont({src:[{path:"./fonts/fraunces-latin-400-normal.woff2",weight:"400",style:"normal"},{path:"./fonts/fraunces-latin-500-normal.woff2",weight:"500",style:"normal"},{path:"./fonts/fraunces-latin-400-italic.woff2",weight:"400",style:"italic"}],variable:"--font-serif",display:"swap"});
const manrope=localFont({src:"./fonts/Manrope-400.ttf",weight:"400",variable:"--font-sans",display:"swap"});

export const metadata: Metadata = {
  icons:{icon:"/media/auto-stilo/marca-203.webp"},
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://auto-stilo.example",
  ),
  openGraph: {
    title: "Auto Stilo — Barbearia" + (watermarkEnabled ? " (Demo)" : ""),
    description: "Seu estilo. Sua assinatura. Monte Sião, MG.",
    images: ["/media/auto-stilo/espaco-1360.webp"],
    locale: "pt_BR",
    type: "website",
  },
  robots: watermarkEnabled ? { index: false, follow: false } : undefined,
  title:
    "Auto Stilo — Barbearia em Monte Sião" +
    (watermarkEnabled ? " (Demo)" : ""),
  description:
    "Auto Stilo em Monte Sião: corte, barba e cuidado nos detalhes. Conheça o espaço e experimente o agendamento.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${manrope.variable}`}>
      <body className="min-h-screen bg-bg text-text antialiased selection:bg-accent selection:text-accent-contrast font-sans">
        <MotionPreferences>{children}</MotionPreferences>
        <DemoWatermark />
      </body>
    </html>
  );
}
