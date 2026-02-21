import { NextResponse } from "next/server";
import { fetchLatestMovieList } from "@/lib/api";

const BASE_URL = "https://rophimm.org";

/** Sitemap index — trỏ đến các sub-sitemap (page, category, region) + sitemap-movie-1..N */
export async function GET() {
  const now = new Date().toISOString();

  const staticSitemaps = ["sitemap-page.xml", "sitemap-category.xml", "sitemap-region.xml"];

  // Lấy tổng số trang phim để sinh sitemap-movie-1.xml ... sitemap-movie-N.xml
  let moviePages = 0;
  try {
    const firstPage = await fetchLatestMovieList({ page: 1 });
    moviePages = firstPage.pagination.totalPages;
  } catch (e) {
    console.error("[sitemap] Failed to get movie pages:", e);
  }

  const movieSitemaps = Array.from({ length: moviePages }, (_, i) => `sitemap-movie-${i + 1}.xml`);

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
