import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "phimimg.com", pathname: "/**" },
      { protocol: "http", hostname: "phimimg.com", pathname: "/**" },
    ],
  },
  async rewrites() {
    return [
      {
        // Fix: Next.js không xử lý dynamic segment [id] trong folder có .xml
        // Rewrite /sitemap-movie-{id}.xml → /api/sitemap-movie/{id}
        source: String.raw`/sitemap-movie-:id(\d+).xml`,
        destination: "/api/sitemap-movie/:id",
      },
    ];
  },
};

export default nextConfig;
