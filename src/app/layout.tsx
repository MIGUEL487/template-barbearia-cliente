import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
const display = localFont({ src: "../../fonts/display.woff2", variable: "--font-serif", display: "swap" });
const manrope = localFont({ src: "../../fonts/body.woff2", variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://auto-stilo.example"),
  openGraph: { title: "Auto Stilo — Barbearia", description: "Seu estilo. Sua assinatura. Monte Sião, MG.", locale: "pt_BR", type: "website" },
  title: "Auto Stilo — Barbearia em Monte Sião",
  description: "Auto Stilo em Monte Sião: corte, barba e cuidado nos detalhes. Conheça o espaço e experimente o agendamento.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${manrope.variable}`}>
      <body className="min-h-screen bg-bg text-text antialiased selection:bg-accent selection:text-accent-contrast font-sans">
        {children}
      </body>
    </html>
  );
}
