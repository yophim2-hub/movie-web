/**
 * Custom HLS.js fragment loader: fetch segments trực tiếp từ CDN
 * bằng fetch() với referrerPolicy: "no-referrer".
 *
 * XHR mặc định không hỗ trợ referrerPolicy → CDN có thể chặn
 * vì thấy Referer = website của mình (không nằm trong whitelist).
 *
 * Loader này đảm bảo segments cũng được fetch giống playlist loader:
 * - credentials: "omit"
 * - referrerPolicy: "no-referrer"
 * - mode: "cors"
 */
import type {
  Loader,
  LoaderCallbacks,
  LoaderConfiguration,
  LoaderStats,
  FragmentLoaderContext,
} from "hls.js";

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

export class DirectCDNFragmentLoader
  implements Loader<FragmentLoaderContext>
{
  public context: FragmentLoaderContext | null = null;
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
    context: FragmentLoaderContext,
    config: LoaderConfiguration,
    callbacks: LoaderCallbacks<FragmentLoaderContext>
  ): void {
    this.context = context;
    this.stats = createStats();
    this.stats.loading.start = performance.now();

    const url = context.url;
    const ac = new AbortController();
    this.abortController = ac;

    const timeoutMs =
      config.loadPolicy?.maxLoadTimeMs ?? config.timeout ?? 30000;
    this.timeoutId = setTimeout(() => {
      ac.abort();
      callbacks.onTimeout(this.stats, context, null);
    }, timeoutMs);

    const headers: Record<string, string> = {};
    if (context.rangeStart !== undefined && context.rangeEnd !== undefined) {
      headers.Range = `bytes=${context.rangeStart}-${context.rangeEnd - 1}`;
    }

    fetch(url, {
      mode: "cors",
      credentials: "omit",
      referrerPolicy: "no-referrer",
      signal: ac.signal,
      headers,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        this.stats.loading.first = performance.now();
        return res.arrayBuffer();
      })
      .then((data) => {
        if (this.timeoutId !== null) {
          clearTimeout(this.timeoutId);
          this.timeoutId = null;
        }

        this.stats.loading.end = performance.now();
        this.stats.loaded = data.byteLength;
        this.stats.total = data.byteLength;

        callbacks.onSuccess(
          { url, data, code: 200 },
          this.stats,
          context,
          null
        );
      })
      .catch((err) => {
        if (this.timeoutId !== null) {
          clearTimeout(this.timeoutId);
          this.timeoutId = null;
        }
        this.stats.loading.end = performance.now();

        if (ac.signal.aborted) return;

        callbacks.onError(
          { code: 0, text: err?.message ?? "Network error" },
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
