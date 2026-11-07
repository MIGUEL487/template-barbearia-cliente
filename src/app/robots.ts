import { envFlag } from "@/lib/env-flag";
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const isDemo = envFlag(process.env.NEXT_PUBLIC_DEMO_WATERMARK);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://auto-stilo.example";

  if (isDemo) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/agendar", "/politica-de-privacidade", "/termos-de-uso"],
      disallow: ["/meu-agendamento*", "/api/*"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
