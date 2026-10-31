import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Los precios son referencias internas de Jimmy, no un tarifario público.
      // La ruta se retira y redirige al contacto.
      { source: "/precios", destination: "/#contact", statusCode: 301 },
    ];
  },
};

export default nextConfig;
