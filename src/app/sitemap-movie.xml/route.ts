import { NextResponse } from "next/server";
import { fetchLatestMovieList } from "@/lib/api";

const BASE_URL = "https://rophimm.org";
const BATCH_SIZE = 5;

/** Movie sitemap — tất cả phim từ API phim-mới-cập-nhật */
export async function GET() {
  try {
    const firstPage = await fetchLatestMovieList({ page: 1 });
    const totalPages = firstPage.pagination.totalPages;

    const allItems: { slug: string; modified: string }[] = [];

    // Thêm items từ page 1
    for (const item of firstPage.items) {
      allItems.push({
        slug: item.slug,
        modified: item.modified?.time
          ? new Date(item.modified.time).toISOString()
          : new Date().toISOString(),
      });
    }

    // Fetch các page còn lại theo batch
    const pagesToFetch: number[] = [];
    for (let p = 2; p <= totalPages; p++) {
      pagesToFetch.push(p);
    }

    for (let i = 0; i < pagesToFetch.length; i += BATCH_SIZE) {
      const batch = pagesToFetch.slice(i, i + BATCH_SIZE);
      const results = await Promise.allSettled(
        batch.map((p) => fetchLatestMovieList({ page: p })),
      );
      for (const result of results) {
        if (result.status === "fulfilled") {
          for (const item of result.value.items) {
            allItems.push({
              slug: item.slug,
              modified: item.modified?.time
                ? new Date(item.modified.time).toISOString()
                : new Date().toISOString(),
            });
          }
        }
      }
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allItems
  .map(
    (item) => `<url>
<loc>${BASE_URL}/phim/${item.slug}</loc>
<lastmod>${item.modified}</lastmod>
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
