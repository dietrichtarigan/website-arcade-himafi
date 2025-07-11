import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable static export when deploying to platforms that support server functions
  // Only use export for pure static sites
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
