import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL('https://example.com/storage/products/**')],
  },
};

export default nextConfig;
