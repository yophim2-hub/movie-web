/**
 * Custom HLS.js playlist loader: fetch M3U8 qua proxy (CORS bypass),
 * clean quảng cáo trên client, trả về CDN URLs trực tiếp cho segments.
 *
 * Segments sẽ được HLS.js default loader fetch trực tiếp từ CDN
 * → giảm ~99% bandwidth server.
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

export class AdFreePlaylistLoader
  implements Loader<PlaylistLoaderContext>
{
  public context: PlaylistLoaderContext | null = null;
  public stats: LoaderStats = createStats();

  private xhr: XMLHttpRequest | null = null;
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  destroy(): void {
    this.abort();
  }

  abort(): void {
    if (this.xhr) {
      this.xhr.abort();
      this.xhr = null;
    }
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
    const proxyUrl = getProxyUrl(originalUrl);

    const xhr = new XMLHttpRequest();
    this.xhr = xhr;

    xhr.open("GET", proxyUrl, true);
    xhr.responseType = "text";
    xhr.withCredentials = false;

    if (context.headers) {
      for (const [key, value] of Object.entries(context.headers)) {
        xhr.setRequestHeader(key, value);
      }
    }

    const timeoutMs =
      config.loadPolicy?.maxLoadTimeMs ?? config.timeout ?? 20000;
    this.timeoutId = setTimeout(() => {
      xhr.abort();
      callbacks.onTimeout(this.stats, context, xhr);
    }, timeoutMs);

    xhr.onload = () => {
      if (this.timeoutId !== null) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }

      this.stats.loading.first = performance.now();
      this.stats.loading.end = performance.now();
      this.stats.loaded = xhr.responseText?.length ?? 0;
      this.stats.total = this.stats.loaded;

      if (xhr.status >= 200 && xhr.status < 300) {
        let text = xhr.responseText;

        // Clean M3U8 trên client
        if (isMasterPlaylist(text)) {
          text = rewriteMasterPlaylistUrls(text, originalUrl);
        } else {
          text = cleanMediaPlaylistClient(text, originalUrl);
        }

        callbacks.onSuccess(
          { url: originalUrl, data: text, code: xhr.status },
          this.stats,
          context,
          xhr
        );
      } else {
        callbacks.onError(
          { code: xhr.status, text: xhr.statusText },
          context,
          xhr,
          this.stats
        );
      }
    };

    xhr.onerror = () => {
      if (this.timeoutId !== null) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
      this.stats.loading.end = performance.now();
      callbacks.onError(
        { code: xhr.status, text: "Network error" },
        context,
        xhr,
        this.stats
      );
    };

    xhr.send();
  }

  getCacheAge(): number | null {
    if (!this.xhr) return null;
    const age = this.xhr.getResponseHeader("age");
    return age ? parseInt(age, 10) : null;
  }

  getResponseHeader(name: string): string | null {
    return this.xhr?.getResponseHeader(name) ?? null;
  }
}
