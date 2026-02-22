import { NextResponse } from "next/server";
import { fetchLatestMovieList } from "@/lib/api";

const BASE_URL = "https://rophimm.org";

/** Sub-sitemap phim theo trang: /sitemap-movie-1.xml, /sitemap-movie-2.xml, ... */
export async function GET(
  _request: Request,
  { params }: { params: Promise<Record<string, string>> },
) {
  try {
    const { id } = (await params) as { id: string };
    const page = Number.parseInt(id, 10);
    if (Number.isNaN(page) || page < 1) {
      return new NextResponse("Not found", { status: 404 });
    }

    const data = await fetchLatestMovieList({ page });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${data.items
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
    console.error("[sitemap-movie-page] Failed:", e);
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`,
      { headers: { "Content-Type": "application/xml" } },
    );
  }
}
