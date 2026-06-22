import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite o HMR funcionar quando o dev server é acessado pelo IP da rede
  // local (testando em outro dispositivo, ex: celular) — sem isso o
  // WebSocket de hot-reload é bloqueado por origem cruzada.
  allowedDevOrigins: ['192.168.1.201'],
  experimental: {
    // Default é 1MB; fotos de câmera de celular passam disso fácil. Rota
    // que recebe upload de imagem fica atrás de Basic Auth em /internal/,
    // então não é superfície pública.
    serverActions: {
      bodySizeLimit: '20mb',
    },
  },
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
