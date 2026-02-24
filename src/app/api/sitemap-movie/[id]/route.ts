import { NextResponse } from "next/server";
import { fetchLatestMovieList } from "@/lib/api";

const BASE_URL = "https://rophimm.org";

/**
 * Mỗi sitemap batch 20 trang API (≈480 URLs).
 * /sitemap-movie-1.xml → API pages 1–20
 * /sitemap-movie-2.xml → API pages 21–40
 * ...
 */
const API_PAGES_PER_SITEMAP = 20;

export async function GET(
  _request: Request,
  { params }: { params: Promise<Record<string, string>> },
) {
  try {
    const { id } = (await params) as { id: string };
    const batchId = Number.parseInt(id, 10);
    if (Number.isNaN(batchId) || batchId < 1) {
      return new NextResponse("Not found", { status: 404 });
    }

    const startPage = (batchId - 1) * API_PAGES_PER_SITEMAP + 1;
    const endPage = batchId * API_PAGES_PER_SITEMAP;

    // Fetch multiple API pages in parallel
    const pageNumbers = Array.from(
      { length: API_PAGES_PER_SITEMAP },
      (_, i) => startPage + i,
    );

    const results = await Promise.allSettled(
      pageNumbers.map((page) => fetchLatestMovieList({ page })),
    );

    const allItems = results.flatMap((r) =>
      r.status === "fulfilled" ? r.value.items : [],
    );

    if (allItems.length === 0) {
      return new NextResponse("Not found", { status: 404 });
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allItems
  .map(
    (item) => `<url>
<loc>${BASE_URL}/phim/${item.slug}</loc>
<lastmod>${
      item.modified?.time
        ? new Date(item.modified.time).toISOString()
        : new Date().toISOString()
    }</lastmod>
<changefreq>weekly</changefreq>
<priority>0.9</priority>
</url>`,
  )
  .join("\n")}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (e) {
    console.error("[sitemap-movie] Failed:", e);
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`,
      { headers: { "Content-Type": "application/xml" } },
    );
  }
}
