import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/quan-ly-admin", "/api/", "/tim-kiem", "/xem-phim/"],
      },
    ],
    sitemap: "https://rophimm.org/sitemap.xml",
  };
}
