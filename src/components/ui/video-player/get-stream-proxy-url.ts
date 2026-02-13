/**
 * Chuyển URL m3u8 gốc thành URL proxy (cắt quảng cáo qua server).
 * Khi useAdRemoval = true, player nhận URL này thay vì m3u8 gốc.
 */
export function getStreamProxyUrl(m3u8Url: string): string {
  return `/api/stream?url=${encodeURIComponent(m3u8Url)}`;
}
