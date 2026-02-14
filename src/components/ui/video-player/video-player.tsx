"use client";

import { useEffect, useRef, useState } from "react";
import { getStreamProxyUrl } from "./get-stream-proxy-url";

function createM3u8Handler(
  Hls: typeof import("hls.js").default,
  onError?: (error: unknown) => void,
  onFatalSoFallback?: () => void
) {
  return (video: HTMLVideoElement, url: string, art: { on: (e: string, fn: () => void) => void }) => {
    if (Hls.isSupported()) {
      const hls = new Hls({ xhrSetup: (xhr) => { xhr.withCredentials = false; } });
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
  /** true: phát qua proxy (cắt quảng cáo), false: phát trực tiếp */
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
  const [fallbackToDirect, setFallbackToDirect] = useState(false);

  onTimeUpdateRef.current = onTimeUpdate;
  onErrorRef.current = onError;
  const useProxy = useAdRemoval && !fallbackToDirect;
  const streamUrl = useProxy ? getStreamProxyUrl(m3u8Url) : m3u8Url;

  // Chỉ re-mount player khi đổi stream (đổi tập) hoặc poster, KHÔNG khi initialTime/onError thay đổi (tránh destroy/recreate mỗi lần lưu tiến độ).
  useEffect(() => {
    if (!containerRef.current || !m3u8Url) return;

    let destroyed = false;
    const container = containerRef.current;
    const startTime = Math.max(0, Number(initialTime) || 0);

    void (async () => {
      const Artplayer = (await import("artplayer")).default;
      const Hls = (await import("hls.js")).default;

      if (destroyed) return;

      const isProxyUrl = useProxy;
      const art = new Artplayer({
        container,
        url: streamUrl,
        type: "m3u8",
        poster,
        lang: "vi",
        customType: {
          m3u8: createM3u8Handler(Hls, (e) => onErrorRef.current?.(e), () => {
            if (isProxyUrl) setFallbackToDirect(true);
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
  }, [streamUrl, m3u8Url, poster]);

  return (
    <div className={`relative z-0 isolate ${className}`}>
      <div ref={containerRef} className="aspect-video w-full bg-black rounded-[var(--radius-card)] overflow-hidden" />
    </div>
  );
}
