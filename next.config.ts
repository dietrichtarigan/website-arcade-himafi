import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Only use export for production build
  ...(process.env.NODE_ENV === 'production' && { output: 'export' }),
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
