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

async function fetchWithTimeout(
  url: string,
  headers: Record<string, string>,
  timeoutMs: number
): Promise<Response> {
  return fetch(url, { headers, signal: AbortSignal.timeout(timeoutMs) });
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

  // CDN (kkphimplayer6) có thể chặn request từ server (Vercel IP). Thử nhiều Referer:
  // 1) Referer từ client (trang của user) — CDN có thể whitelist domain của chúng ta
  // 2) Referer = origin upstream — fallback chuẩn
  const userAgent =
    request.headers.get("user-agent") ||
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
  const clientReferer = request.headers.get("referer");
  const clientOrigin = request.headers.get("origin");
  let referer: string | null = clientReferer || clientOrigin;
  if (!referer) {
    try {
      const upstreamOrigin = new URL(decodedUrl).origin;
      referer = `${upstreamOrigin}/`;
    } catch {
      referer = null;
    }
  }
  const buildHeaders = (ref: string | null): Record<string, string> => {
    const h: Record<string, string> = {
      Accept: "*/*",
      "User-Agent": userAgent,
      "Accept-Language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7",
    };
    if (ref) h.Referer = ref;
    return h;
  };

  const timeout = 25000;
  let res: Response;
  try {
    res = await fetchWithTimeout(decodedUrl, buildHeaders(referer), timeout);
    if (res.status === 404 && referer) {
      try {
        const upstreamRef = `${new URL(decodedUrl).origin}/`;
        if (referer !== upstreamRef) {
          const retryRes = await fetchWithTimeout(decodedUrl, buildHeaders(upstreamRef), timeout);
          if (retryRes.ok) res = retryRes;
        }
      } catch {
        /* ignore retry */
      }
    }
  } catch (e) {
    console.error("[stream] fetch error:", e);
    return NextResponse.json(
      { error: "Không thể tải tài nguyên" },
      { status: 502 }
    );
  }

  if (!res.ok) {
    const is404 = res.status === 404;
    return NextResponse.json(
      {
        error: is404
          ? "Upstream 404 (nội dung có thể chỉ khả dụng tại Việt Nam)"
          : `Upstream ${res.status}`,
        code: is404 ? "GEO_BLOCKED" : "UPSTREAM_ERROR",
        directUrl: decodedUrl,
      },
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
  const outHeaders = new Headers();
  const contentLength = res.headers.get("content-length");
  if (contentLength) outHeaders.set("Content-Length", contentLength);
  const contentTypeOut = res.headers.get("content-type");
  if (contentTypeOut) outHeaders.set("Content-Type", contentTypeOut);

  return new NextResponse(res.body, {
    status: res.status,
    headers: outHeaders,
  });
}
