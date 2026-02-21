import { NextResponse } from "next/server";
import { fetchCountries } from "@/lib/api/countries";

const BASE_URL = "https://rophimm.org";

/** Region sitemap — tất cả quốc gia */
export async function GET() {
  let countries: { slug: string }[] = [];
  try {
    countries = await fetchCountries();
  } catch {
    console.error("[sitemap-region] Failed to fetch countries");
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${countries
  .map(
    (c) => `<url>
<loc>${BASE_URL}/quoc-gia/${c.slug}</loc>
<changefreq>weekly</changefreq>
<priority>0.8</priority>
</url>`,
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
