import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",          // 👈 THIS is the key
  images: {
    unoptimized: true,       // 👈 cPanel can’t optimize images
  },
  trailingSlash: true,       // 👈 avoids 404s on refresh
};

export default nextConfig;
