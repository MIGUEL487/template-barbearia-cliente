import { DemoWatermark, watermarkEnabled } from "@/components/demo-watermark";
import { MotionPreferences } from "@/components/motion-preferences";
import { BookingDiagnostics } from "@/components/booking/diagnostics";
import { CookieBanner } from "@/components/privacy/cookie-banner";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./mobile-experience.css";

const display = localFont({
  src: [
    { path: "./fonts/fraunces-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/fraunces-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/fraunces-latin-400-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-serif",
  display: "swap",
});

const manrope = localFont({
  src: "./fonts/Manrope-400.ttf",
  weight: "400",
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      {
        url: "/brand/template/logo-on-light.png",
        type: "image/png",
        sizes: "32x32",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/brand/template/logo-on-dark.png",
        type: "image/png",
        sizes: "32x32",
        media: "(prefers-color-scheme: dark)",
      },
      { url: "/brand/template/logo-on-dark.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/brand/template/logo-on-dark.png", sizes: "180x180", type: "image/png" }],
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://barbearia-template.example"
  ),
  openGraph: {
    title: "Barbearia Modelo — Corte, Barba & Estilo" + (watermarkEnabled ? " (Demo)" : ""),
    description: "Corte, barba e cuidado artesanal no seu tempo. Agendamento online e atendimento exclusivo.",
    images: ["/img/template/full/01_barbearia_interior.webp"],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Barbearia Modelo — Corte, Barba & Estilo",
    description: "Corte, barba e cuidado artesanal no seu tempo. Agendamento online e atendimento exclusivo.",
    images: ["/img/template/full/01_barbearia_interior.webp"],
  },
  robots: watermarkEnabled ? { index: false, follow: false } : undefined,
  title:
    "Barbearia Modelo — Corte, Barba & Estilo" +
    (watermarkEnabled ? " (Demo)" : ""),
  description:
    "Barbearia Modelo: corte de alta precisão, barba terapia com toalha quente e atendimento com hora marcada.",
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
        <CookieBanner />
        <DemoWatermark />
        <BookingDiagnostics />
      </body>
    </html>
  );
}
