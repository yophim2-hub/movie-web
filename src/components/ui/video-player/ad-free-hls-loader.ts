/**
 * Custom HLS.js playlist loader:
 * 1) Ưu tiên fetch M3U8 TRỰC TIẾP từ CDN (browser VN IP → CDN chấp nhận)
 * 2) Fallback qua /api/stream proxy nếu direct bị CORS chặn
 * 3) Clean quảng cáo hoàn toàn trên client
 *
 * Segments được HLS.js default loader fetch trực tiếp từ CDN
 * → giảm ~99% bandwidth server, bypass geo-block (server nước ngoài).
 */
import type {
  Loader,
  LoaderCallbacks,
  LoaderConfiguration,
  LoaderStats,
  PlaylistLoaderContext,
} from "hls.js";
import {
  cleanMediaPlaylistClient,
  isMasterPlaylist,
  rewriteMasterPlaylistUrls,
} from "@/lib/client-m3u8-cleaner";

function getProxyUrl(originalUrl: string): string {
  const path = `/api/stream?url=${encodeURIComponent(originalUrl)}&raw=1`;
  const origin = globalThis.window?.location?.origin;
  return origin ? `${origin}${path}` : path;
}

function createStats(): LoaderStats {
  return {
    aborted: false,
    loaded: 0,
    retry: 0,
    total: 0,
    chunkCount: 0,
    bwEstimate: 0,
    loading: { start: 0, first: 0, end: 0 },
    parsing: { start: 0, end: 0 },
    buffering: { start: 0, first: 0, end: 0 },
  };
}

/**
 * Fetch M3U8: thử trực tiếp CDN trước, fallback qua server proxy.
 *
 * Direct fetch dùng:
 * - credentials: "omit" → không gửi cookie
 * - referrerPolicy: "no-referrer" → CDN không thấy Referer lạ
 * - mode: "cors" → browser enforce CORS, nhưng nhiều CDN cho phép
 */
async function fetchM3u8WithFallback(
  originalUrl: string,
  signal: AbortSignal
): Promise<{ text: string; ok: boolean; via: "direct" | "proxy" }> {
  // 1) Direct fetch — browser ở VN, IP Việt Nam → CDN chấp nhận
  try {
    const res = await fetch(originalUrl, {
      mode: "cors",
      credentials: "omit",
      referrerPolicy: "no-referrer",
      signal,
    });
    if (res.ok) {
      const text = await res.text();
      return { text, ok: true, via: "direct" };
    }
  } catch (e) {
    // Nếu bị abort (timeout) thì throw luôn, không thử proxy
    if (signal.aborted) throw e;
    // CORS hoặc network error → thử proxy
  }

  // 2) Proxy fallback — /api/stream fetch M3U8 rồi trả về client
  try {
    const proxyUrl = getProxyUrl(originalUrl);
    const res = await fetch(proxyUrl, {
      credentials: "omit",
      signal,
    });
    if (res.ok) {
      const text = await res.text();
      return { text, ok: true, via: "proxy" };
    }
  } catch (e) {
    if (signal.aborted) throw e;
  }

  return { text: "", ok: false, via: "proxy" };
}

export class AdFreePlaylistLoader
  implements Loader<PlaylistLoaderContext>
{
  public context: PlaylistLoaderContext | null = null;
  public stats: LoaderStats = createStats();

  private abortController: AbortController | null = null;
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  destroy(): void {
    this.abort();
  }

  abort(): void {
    this.abortController?.abort();
    this.abortController = null;
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  load(
    context: PlaylistLoaderContext,
    config: LoaderConfiguration,
    callbacks: LoaderCallbacks<PlaylistLoaderContext>
  ): void {
    this.context = context;
    this.stats = createStats();
    this.stats.loading.start = performance.now();

    const originalUrl = context.url;
    const ac = new AbortController();
    this.abortController = ac;

    const timeoutMs =
      config.loadPolicy?.maxLoadTimeMs ?? config.timeout ?? 20000;
    this.timeoutId = setTimeout(() => {
      ac.abort();
      callbacks.onTimeout(this.stats, context, null);
    }, timeoutMs);

    fetchM3u8WithFallback(originalUrl, ac.signal)
      .then(({ text, ok, via }) => {
        if (this.timeoutId !== null) {
          clearTimeout(this.timeoutId);
          this.timeoutId = null;
        }

        this.stats.loading.first = performance.now();
        this.stats.loading.end = performance.now();
        this.stats.loaded = text.length;
        this.stats.total = text.length;

        if (!ok) {
          callbacks.onError(
            { code: 0, text: "All fetch attempts failed" },
            context,
            null,
            this.stats
          );
          return;
        }

        if (process.env.NODE_ENV === "development") {
          console.log(`[AdFreeLoader] M3U8 loaded via ${via}: ${originalUrl.slice(0, 80)}…`);
        }

        // Clean M3U8 trên client
        let cleaned = text;
        if (isMasterPlaylist(cleaned)) {
          cleaned = rewriteMasterPlaylistUrls(cleaned, originalUrl);
        } else {
          cleaned = cleanMediaPlaylistClient(cleaned, originalUrl);
        }

        callbacks.onSuccess(
          { url: originalUrl, data: cleaned, code: 200 },
          this.stats,
          context,
          null
        );
      })
      .catch(() => {
        if (this.timeoutId !== null) {
          clearTimeout(this.timeoutId);
          this.timeoutId = null;
        }
        this.stats.loading.end = performance.now();
        callbacks.onError(
          { code: 0, text: "Network error" },
          context,
          null,
          this.stats
        );
      });
  }

  getCacheAge(): number | null {
    return null;
  }

  getResponseHeader(): string | null {
    return null;
  }
}
