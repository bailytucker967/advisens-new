import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed static export to enable SSR and API routes
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
