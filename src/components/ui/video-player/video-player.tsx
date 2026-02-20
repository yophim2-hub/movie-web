"use client";

import { useEffect, useRef, useState } from "react";
import { getStreamProxyUrl } from "./get-stream-proxy-url";
import { AdFreePlaylistLoader } from "./ad-free-hls-loader";
import { DirectCDNFragmentLoader } from "./direct-cdn-fragment-loader";

type HlsType = typeof import("hls.js").default;

/**
 * Tạo HLS handler cho Artplayer.
 * - adRemovalMode = "client": dùng custom pLoader (client-side ad removal, segments từ CDN)
 * - adRemovalMode = "server": dùng server proxy URL (cũ, segments qua server)
 * - adRemovalMode = "off": phát trực tiếp, không cắt quảng cáo
 */
function createM3u8Handler(
  Hls: HlsType,
  adRemovalMode: "client" | "server" | "off",
  onError?: (error: unknown) => void,
  onFatalSoFallback?: () => void
) {
  return (video: HTMLVideoElement, url: string, art: { on: (e: string, fn: () => void) => void }) => {
    if (Hls.isSupported()) {
      const hlsConfig: ConstructorParameters<HlsType>[0] = {
        xhrSetup: (xhr) => { xhr.withCredentials = false; },
      };

      // Client-side ad removal: custom loaders fetch trực tiếp từ CDN
      // → bypass server proxy (server nước ngoài bị CDN chặn)
      if (adRemovalMode === "client") {
        hlsConfig.pLoader = AdFreePlaylistLoader as never;
        hlsConfig.fLoader = DirectCDNFragmentLoader as never;
      }

      const hls = new Hls(hlsConfig);
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          onError?.(data);
          onFatalSoFallback?.();
        }
      });
      art.on("destroy", () => hls.destroy());
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
    }
  };
}

export interface VideoPlayerProps {
  /** URL file m3u8 gốc */
  m3u8Url: string;
  /** true: cắt quảng cáo (client-side), false: phát trực tiếp */
  useAdRemoval?: boolean;
  /** Poster image URL */
  poster?: string;
  /** Css class cho container */
  className?: string;
  /** Callback khi có lỗi */
  onError?: (error: unknown) => void;
  /** Thời điểm bắt đầu (giây) — xem tiếp */
  initialTime?: number;
  /** Gọi khi tiến độ phát thay đổi (lưu đang xem dở) */
  onTimeUpdate?: (currentTime: number, duration: number) => void;
}

const TIME_UPDATE_THROTTLE_MS = 3000;

/**
 * Fallback levels:
 * 1. "client" — client-side ad removal, segments trực tiếp từ CDN
 * 2. "server" — server proxy (cũ), segments qua /api/stream
 * 3. "off"    — phát trực tiếp, không xử lý
 */
type AdRemovalMode = "client" | "server" | "off";

export function VideoPlayer({
  m3u8Url,
  useAdRemoval = true,
  poster,
  className = "",
  onError,
  initialTime = 0,
  onTimeUpdate,
}: Readonly<VideoPlayerProps>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const artRef = useRef<{ destroy: (v: boolean) => void; video?: HTMLVideoElement } | null>(null);
  const destroyRef = useRef<(() => void) | null>(null);
  const onTimeUpdateRef = useRef(onTimeUpdate);
  const onErrorRef = useRef(onError);
  const lastSaveRef = useRef(0);
  const [adMode, setAdMode] = useState<AdRemovalMode>(
    useAdRemoval ? "client" : "off"
  );

  onTimeUpdateRef.current = onTimeUpdate;
  onErrorRef.current = onError;

  // Xác định stream URL dựa trên mode
  const streamUrl =
    adMode === "server"
      ? getStreamProxyUrl(m3u8Url)
      : m3u8Url; // "client" và "off" đều dùng URL gốc (client mode xử lý qua pLoader)

  useEffect(() => {
    if (!containerRef.current || !m3u8Url) return;

    let destroyed = false;
    const container = containerRef.current;
    const startTime = Math.max(0, Number(initialTime) || 0);
    const currentMode = adMode;

    void (async () => {
      const Artplayer = (await import("artplayer")).default;
      const Hls = (await import("hls.js")).default;

      if (destroyed) return;

      const art = new Artplayer({
        container,
        url: streamUrl,
        type: "m3u8",
        poster,
        lang: "vi",
        customType: {
          m3u8: createM3u8Handler(Hls, currentMode, (e) => onErrorRef.current?.(e), () => {
            // Fallback chain: client → server → off
            if (currentMode === "client") {
              setAdMode("server");
            } else if (currentMode === "server") {
              setAdMode("off");
            }
          }),
        },
        setting: true,
        playbackRate: true,
        aspectRatio: true,
        fullscreen: true,
        fullscreenWeb: false,
        pip: true,
        hotkey: true,
        mutex: true,
        plugins: [],
      });

      art.on("ready", () => {
        if (destroyed) return;
        if (startTime > 0) {
          const seek = (art as unknown as { seek?: ((t: number) => void) }).seek;
          if (typeof seek === "function") seek(startTime);
        }
      });

      if (onTimeUpdateRef.current && art.video) {
        const video = art.video;
        const handleTimeUpdate = () => {
          const now = Date.now();
          if (now - lastSaveRef.current < TIME_UPDATE_THROTTLE_MS) return;
          lastSaveRef.current = now;
          const current = video.currentTime;
          const duration = video.duration;
          if (Number.isFinite(current)) onTimeUpdateRef.current?.(current, duration ?? 0);
        };
        art.on("video:timeupdate", handleTimeUpdate);
        art.on("video:ended", () => {
          if (Number.isFinite(video.currentTime) && Number.isFinite(video.duration)) {
            onTimeUpdateRef.current?.(video.currentTime, video.duration);
          }
        });
      }

      artRef.current = art;
      destroyRef.current = () => {
        if (onTimeUpdateRef.current && art.video) {
          const v = art.video as HTMLVideoElement;
          if (Number.isFinite(v.currentTime)) {
            onTimeUpdateRef.current(v.currentTime, v.duration ?? 0);
          }
        }
        art.destroy(false);
        artRef.current = null;
        destroyRef.current = null;
      };
    })();

    return () => {
      destroyed = true;
      destroyRef.current?.();
    };
  }, [streamUrl, m3u8Url, poster, adMode]);

  return (
    <div className={`relative z-0 isolate ${className}`}>
      <div ref={containerRef} className="aspect-video w-full bg-black rounded-[var(--radius-card)] overflow-hidden" />
    </div>
  );
}
