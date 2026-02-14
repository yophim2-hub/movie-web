import {
  cleanMediaPlaylist,
  transformMasterPlaylist,
  isMasterPlaylist,
} from "@/lib/m3u8-ad-remove";
import { NextRequest, NextResponse } from "next/server";

const M3U8_CONTENT_TYPES = [
  "application/vnd.apple.mpegurl",
  "application/x-mpegurl",
  "audio/mpegurl",
  "text/plain",
];

function isM3u8Request(url: string, contentType: string | null): boolean {
  if (url.includes(".m3u8") || url.includes(".m8u8")) return true;
  if (contentType) {
    const lower = contentType.split(";")[0].trim().toLowerCase();
    if (M3U8_CONTENT_TYPES.some((t) => lower.includes(t))) return true;
  }
  return false;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "Thiếu query url" },
      { status: 400 }
    );
  }

  let decodedUrl: string;
  try {
    decodedUrl = decodeURIComponent(url);
  } catch {
    return NextResponse.json(
      { error: "URL không hợp lệ" },
      { status: 400 }
    );
  }

  // Nhiều CDN (kkphimplayer6, v.v.) trả 404 nếu thiếu Referer hoặc Referer không phải domain của họ (đặc biệt khi request từ server Vercel). Gửi Referer = origin upstream để CDN chấp nhận.
  const userAgent =
    request.headers.get("user-agent") ||
    "Mozilla/5.0 (Windows NT 10.0; rv:109.0) Gecko/20100101 Firefox/115.0";
  let referer: string | null = null;
  try {
    const upstreamOrigin = new URL(decodedUrl).origin;
    referer = `${upstreamOrigin}/`;
  } catch {
    referer = request.headers.get("referer");
  }
  const fetchHeaders: Record<string, string> = {
    Accept: "*/*",
    "User-Agent": userAgent,
  };
  if (referer) fetchHeaders.Referer = referer;

  let res: Response;
  try {
    res = await fetch(decodedUrl, {
      headers: fetchHeaders,
      // Vercel serverless có thể bị upstream cắt kết nối; tăng timeout.
      signal: AbortSignal.timeout(25000),
    });
  } catch (e) {
    console.error("[stream] fetch error:", e);
    return NextResponse.json(
      { error: "Không thể tải tài nguyên" },
      { status: 502 }
    );
  }

  if (!res.ok) {
    return NextResponse.json(
      { error: `Upstream ${res.status}` },
      { status: res.status }
    );
  }

  const contentType = res.headers.get("content-type") ?? "";
  const isM3u8 = isM3u8Request(decodedUrl, contentType);

  if (isM3u8) {
    const text = await res.text();
    const isMaster = isMasterPlaylist(text);

    if (isMaster) {
      const transformed = transformMasterPlaylist(text, decodedUrl);
      return new NextResponse(transformed, {
        headers: {
          "Content-Type": "application/vnd.apple.mpegurl; charset=utf-8",
          "Cache-Control": "private, max-age=60",
        },
      });
    }

    const cleaned = await cleanMediaPlaylist(text, decodedUrl);
    return new NextResponse(cleaned, {
      headers: {
        "Content-Type": "application/vnd.apple.mpegurl; charset=utf-8",
        "Cache-Control": "private, max-age=60",
      },
    });
  }

  // Segment hoặc file khác: stream thẳng
  const headers = new Headers();
  const contentLength = res.headers.get("content-length");
  if (contentLength) headers.set("Content-Length", contentLength);
  const contentTypeOut = res.headers.get("content-type");
  if (contentTypeOut) headers.set("Content-Type", contentTypeOut);

  return new NextResponse(res.body, {
    status: res.status,
    headers,
  });
}
