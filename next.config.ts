import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "phimimg.com", pathname: "/**" },
      { protocol: "http", hostname: "phimimg.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
