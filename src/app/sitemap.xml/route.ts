import { NextResponse } from "next/server";
import { fetchLatestMovieList } from "@/lib/api";

const BASE_URL = "https://rophimm.org";

/** Mỗi sitemap batch 20 trang API — phải khớp với api/sitemap-movie/[id]/route.ts */
const API_PAGES_PER_SITEMAP = 20;

/** Sitemap index — trỏ đến các sub-sitemap (page, category, region) + sitemap-movie-1..N */
export async function GET() {
  const now = new Date().toISOString();

  const staticSitemaps = [
    "sitemap-page.xml",
    "sitemap-category.xml",
    "sitemap-region.xml",
  ];

  // Lấy tổng số trang API để tính số lượng batched sitemaps
  let totalApiPages = 0;
  try {
    const firstPage = await fetchLatestMovieList({ page: 1 });
    totalApiPages = firstPage.pagination.totalPages;
  } catch (e) {
    console.error("[sitemap] Failed to get movie pages:", e);
  }

  const totalBatches = Math.ceil(totalApiPages / API_PAGES_PER_SITEMAP);
  const movieSitemaps = Array.from(
    { length: totalBatches },
    (_, i) => `sitemap-movie-${i + 1}.xml`,
  );

  const allSitemaps = [...staticSitemaps, ...movieSitemaps];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allSitemaps.map((s) => `<sitemap><loc>${BASE_URL}/${s}</loc><lastmod>${now}</lastmod></sitemap>`).join("\n")}
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
