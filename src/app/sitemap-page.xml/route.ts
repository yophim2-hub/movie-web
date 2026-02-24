import { NextResponse } from "next/server";

const BASE_URL = "https://rophimm.org";

/** Page sitemap — các trang chính */
export async function GET() {
  const now = new Date().toISOString();
  const pages = [
    { loc: "/", changefreq: "daily", priority: "1" },
    { loc: "/danh-sach", changefreq: "daily", priority: "0.8" },
    { loc: "/phim-le", changefreq: "daily", priority: "0.8" },
    { loc: "/phim-bo", changefreq: "daily", priority: "0.8" },
    { loc: "/phim-chieu-rap", changefreq: "weekly", priority: "0.8" },
    { loc: "/hoat-hinh", changefreq: "daily", priority: "0.8" },
    { loc: "/phim-ngan", changefreq: "weekly", priority: "0.7" },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) => `<url>
<loc>${BASE_URL}${p.loc}</loc>
<lastmod>${now}</lastmod>
<changefreq>${p.changefreq}</changefreq>
<priority>${p.priority}</priority>
</url>`,
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
