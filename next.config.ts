import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite o HMR funcionar quando o dev server é acessado pelo IP da rede
  // local (testando em outro dispositivo, ex: celular) — sem isso o
  // WebSocket de hot-reload é bloqueado por origem cruzada.
  allowedDevOrigins: ['192.168.1.201'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
