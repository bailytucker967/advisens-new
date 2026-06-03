import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed static export to enable SSR and API routes
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Allow the public review tunnel (cloudflared quick tunnel) to reach the dev
  // server without Next.js dev blocking the external origin.
  allowedDevOrigins: ["*.trycloudflare.com"],
};

export default nextConfig;
