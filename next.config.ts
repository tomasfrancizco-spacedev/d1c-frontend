import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://content.sportslogos.net/logos/**')],
  },
};

export default nextConfig;
