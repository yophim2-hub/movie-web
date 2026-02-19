/**
 * Client-side M3U8 cleaner: cắt quảng cáo trên browser.
 * Khác server-side (m3u8-ad-remove.ts):
 * - Synchronous (không HEAD request)
 * - Giữ CDN URLs trực tiếp (không wrap proxy)
 * - Watermark segments (/convert/): giữ nguyên phát as-is
 */

/**
 * Lấy base directory từ URL (path không gồm filename).
 */
function getBaseDirectory(url: string): string {
  try {
    const u = new URL(url);
    const lastSlash = u.pathname.lastIndexOf("/");
    if (lastSlash <= 0) return u.origin + u.pathname;
    return u.origin + u.pathname.slice(0, lastSlash);
  } catch {
    return "";
  }
}

/**
 * Resolve URI có thể relative so với baseUrl.
 */
function resolveUrl(uri: string, baseUrl: string): string {
  if (uri.startsWith("http://") || uri.startsWith("https://")) return uri;
  try {
    return new URL(uri, baseUrl).href;
  } catch {
    return uri;
  }
}

/**
 * Kiểm tra segment có phải quảng cáo (adjump) không.
 */
function isAdSegment(uri: string): boolean {
  return uri.includes("/adjump/");
}

/**
 * Clean media playlist trên client: bỏ adjump, bỏ segment khác base directory.
 * Giữ CDN URLs trực tiếp (không rewrite qua proxy).
 * Watermark segments (/convert/): giữ nguyên.
 */
export function cleanMediaPlaylistClient(
  m3u8Content: string,
  baseUrl: string
): string {
  const lines = m3u8Content.split(/\r?\n/);
  const out: string[] = [];
  let baseDirectory: string | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("#") || !trimmed) {
      out.push(line);
      continue;
    }

    const absoluteUri = resolveUrl(trimmed, baseUrl);
    baseDirectory ??= getBaseDirectory(absoluteUri);

    // Skip ad segments
    if (isAdSegment(absoluteUri)) continue;

    // Skip segments from different directory (injected ads)
    const segDir = getBaseDirectory(absoluteUri);
    if (segDir !== baseDirectory) continue;

    // Keep segment with direct CDN URL
    out.push(absoluteUri);
  }

  if (out.length > 0 && !out.some((l) => l.includes("#EXT-X-ENDLIST"))) {
    out.push("#EXT-X-ENDLIST");
  }

  return out.join("\n");
}

/**
 * Rewrite master playlist: resolve relative variant URLs thành absolute.
 * Không wrap proxy — HLS.js sẽ load variant playlists qua custom pLoader.
 */
export function rewriteMasterPlaylistUrls(
  m3u8Content: string,
  baseUrl: string
): string {
  const lines = m3u8Content.split(/\r?\n/);
  const out: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("#") || !trimmed) {
      out.push(line);
      continue;
    }
    out.push(resolveUrl(trimmed, baseUrl));
  }

  return out.join("\n");
}

/**
 * Kiểm tra nội dung có phải master playlist không.
 */
export function isMasterPlaylist(content: string): boolean {
  return content.includes("#EXT-X-STREAM-INF");
}
