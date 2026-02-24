/**
 * Factory tạo custom playlist loader wrap default loader HLS.js.
 * - Dùng XHR transport mặc định (giống mode "off" — đã hoạt động)
 * - Intercept response M3U8 → clean quảng cáo client-side
 * - 100% client-side, không phụ thuộc server proxy
 */
import type {
  LoaderCallbacks,
  LoaderConfiguration,
  LoaderContext,
} from "hls.js";
import {
  cleanMediaPlaylistClient,
  isMasterPlaylist,
  rewriteMasterPlaylistUrls,
} from "@/lib/client-m3u8-cleaner";

type HlsType = typeof import("hls.js").default;

export function createAdFreePlaylistLoader(Hls: HlsType) {
  const DefaultLoader = Hls.DefaultConfig.loader;

  return class AdFreePlaylistLoader extends DefaultLoader {
    load(
      context: LoaderContext,
      config: LoaderConfiguration,
      callbacks: LoaderCallbacks<LoaderContext>
    ): void {
      const originalOnSuccess = callbacks.onSuccess;
      const playlistUrl = context.url;

      callbacks.onSuccess = (response, stats, ctx, networkDetails) => {
        if (typeof response.data === "string") {
          const url = ctx?.url || playlistUrl;
          if (isMasterPlaylist(response.data)) {
            response.data = rewriteMasterPlaylistUrls(response.data, url);
          } else {
            response.data = cleanMediaPlaylistClient(response.data, url);
          }
        }
        originalOnSuccess(response, stats, ctx, networkDetails);
      };

      super.load(context, config, callbacks);
    }
  };
}
