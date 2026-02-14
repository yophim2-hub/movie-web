/**
 * Chuyển URL m3u8 gốc thành URL proxy (cắt quảng cáo qua server).
 * Khi useAdRemoval = true, player nhận URL này thay vì m3u8 gốc.
 * Dùng absolute URL trên client để đảm bảo đúng origin trên prod (Vercel, subdomain...).
 */
export function getStreamProxyUrl(m3u8Url: string): string {
  const path = `/api/stream?url=${encodeURIComponent(m3u8Url)}`;
  const origin =
    globalThis.window === undefined ? undefined : globalThis.window?.location?.origin;
  return origin ? `${origin}${path}` : path;
}
