import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export configuration untuk Netlify compatibility
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
