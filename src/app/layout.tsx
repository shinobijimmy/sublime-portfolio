import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sublime Design — Design, Product, Code",
  description: "Sublime Design turns ideas into identities, digital experiences and systems that work.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
