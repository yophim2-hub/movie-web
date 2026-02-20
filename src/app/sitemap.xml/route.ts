import { NextResponse } from "next/server";

const BASE_URL = "https://rophimm.org";

/** Sitemap index — trỏ đến các sub-sitemap */
export async function GET() {
  const now = new Date().toISOString();

  const sitemaps = ["sitemap-page.xml", "sitemap-category.xml", "sitemap-region.xml"];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map((s) => `<sitemap><loc>${BASE_URL}/${s}</loc><lastmod>${now}</lastmod></sitemap>`).join("\n")}
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
