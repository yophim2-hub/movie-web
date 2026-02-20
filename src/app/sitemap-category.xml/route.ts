import { NextResponse } from "next/server";
import { fetchCategories } from "@/lib/api/categories";

const BASE_URL = "https://rophimm.org";

/** Category sitemap — tất cả thể loại */
export async function GET() {
  const now = new Date().toISOString();

  let categories: { slug: string }[] = [];
  try {
    categories = await fetchCategories();
  } catch {
    console.error("[sitemap-category] Failed to fetch categories");
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${categories
  .map(
    (cat) => `<url>
<loc>${BASE_URL}/the-loai/${cat.slug}</loc>
<lastmod>${now}</lastmod>
<changefreq>weekly</changefreq>
<priority>0.8</priority>
</url>`
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
