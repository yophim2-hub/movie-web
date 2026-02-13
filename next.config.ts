import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Ảnh qua next/image sẽ được trả về WebP (kiểm tra: DevTools → Network → request _next/image → Response headers → Content-Type: image/webp)
    formats: ["image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      { protocol: "https", hostname: "phimimg.com", pathname: "/**" },
      { protocol: "http", hostname: "phimimg.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
