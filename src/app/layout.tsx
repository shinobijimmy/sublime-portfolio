import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Las fuentes se descargan en BUILD y se sirven desde el propio dominio.
// Antes venían de un @import a Google Fonts que el build descartaba: el CSS
// declaraba familias que nunca existían y el navegador caía al fallback del
// sistema (en Linux, DejaVu/Liberation: otra tipografía, otras métricas).
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-hanken",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["600", "800", "900"],
  display: "swap",
  variable: "--font-inter-tight",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-mono",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sublime-portfolio.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sublime Lab — Design, Product, Code",
    template: "%s · Sublime Lab",
  },
  description:
    "Sublime Lab turns ideas into identities, digital experiences and systems that work. Estudio de identidad, producto y tecnología.",
  applicationName: "Sublime Lab",
  authors: [{ name: "Sublime Lab" }],
  creator: "Sublime Lab",
  alternates: {
    canonical: "/",
    languages: { "es-AR": "/", en: "/" },
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Sublime Lab",
    title: "Sublime Lab — Design, Product, Code",
    description:
      "Identidad, producto y tecnología en una misma práctica. Brand → Identity → Interface → Product → Technology.",
    locale: "es_AR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sublime Lab — Design, Product, Code",
    description:
      "Identidad, producto y tecnología en una misma práctica.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
    { media: "(prefers-color-scheme: light)", color: "#ffaaa0" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // lang="es" es el idioma de render del servidor. El toggle ES/EN del cliente
    // sincroniza este atributo en tiempo de ejecución.
    <html
      lang="es"
      className={`${hanken.variable} ${interTight.variable} ${jetbrains.variable}`}
    >
      <body>
        <a className="skip-link" href="#main">
          Saltar al contenido
        </a>
        {children}
      </body>
    </html>
  );
}
