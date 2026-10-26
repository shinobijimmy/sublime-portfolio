import type { MetadataRoute } from "next";

// La URL pública del sitio: si se define NEXT_PUBLIC_SITE_URL en Vercel, manda esa.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sublime-portfolio.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
