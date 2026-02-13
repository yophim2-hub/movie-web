/**
 * Xử lý m3u8: cắt quảng cáo (adjump, segment lạc thư mục, watermark)
 * và rewrite URI sang URL proxy.
 */

const PROXY_PREFIX = "/api/stream?url=";

/**
 * Encode URL để dùng trong query proxy.
 */
export function toProxyUrl(segmentUrl: string): string {
  return `${PROXY_PREFIX}${encodeURIComponent(segmentUrl)}`;
}

/**
 * Lấy base directory từ URL (path không gồm filename).
 * VD: https://cdn.example.com/vod/123/720p/seg-1.ts -> https://cdn.example.com/vod/123/720p
 */
export function getBaseDirectory(url: string): string {
  try {
    const u = new URL(url);
    const path = u.pathname;
    const lastSlash = path.lastIndexOf("/");
    if (lastSlash <= 0) return u.origin + path;
    return u.origin + path.slice(0, lastSlash);
  } catch {
    return "";
  }
}

/**
 * Resolve URI có thể relative so với baseUrl.
 */
export function resolveUrl(uri: string, baseUrl: string): string {
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
 * Kiểm tra segment có thuộc thư mục watermark (chứa "convert") không.
 */
function isWatermarkSegment(uri: string): string | null {
  if (uri.includes("convert")) return uri;
  return null;
}

/**
 * HEAD request để kiểm tra file gốc (cùng tên ở root) có tồn tại không.
 */
async function headOriginalExists(segmentUrl: string): Promise<boolean> {
  try {
    const res = await fetch(segmentUrl, { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Tạo URL file gốc (bỏ phần convert): từ path có .../convert/... sang path gốc (cùng tên file ở root của variant).
 * Ví dụ: base https://x.com/vod/720p/convert/seg-1.ts -> https://x.com/vod/720p/seg-1.ts
 */
function getOriginalSegmentUrl(watermarkSegmentUrl: string): string {
  try {
    const u = new URL(watermarkSegmentUrl);
    const path = u.pathname;
    const convertIndex = path.indexOf("/convert/");
    if (convertIndex === -1) return watermarkSegmentUrl;
    const beforeConvert = path.slice(0, convertIndex);
    const afterConvert = path.slice(convertIndex + "/convert/".length);
    const originalPath = `${beforeConvert}/${afterConvert}`;
    u.pathname = originalPath;
    return u.href;
  } catch {
    return watermarkSegmentUrl;
  }
}

const seenSegmentNames = new Set<string>();

async function processSegmentUri(
  absoluteUri: string,
  baseDirectory: string | null
): Promise<{ action: "skip" } | { action: "push"; url: string }> {
  if (isAdSegment(absoluteUri)) return { action: "skip" };
  const segDir = getBaseDirectory(absoluteUri);
  const dir = baseDirectory ?? segDir;
  if (segDir !== dir) return { action: "skip" };

  if (isWatermarkSegment(absoluteUri)) {
    const originalUrl = getOriginalSegmentUrl(absoluteUri);
    const exists = await headOriginalExists(originalUrl);
    const fileName = absoluteUri.split("/").pop() ?? "";
    if (exists && !seenSegmentNames.has(fileName)) {
      seenSegmentNames.add(fileName);
      return { action: "push", url: toProxyUrl(originalUrl) };
    }
    return { action: "skip" };
  }

  return { action: "push", url: toProxyUrl(absoluteUri) };
}

/**
 * Clean media playlist: bỏ adjump, bỏ segment khác base_directory, xử lý watermark, rewrite URI qua proxy.
 * baseUrl: URL của chính file m3u8 này (để resolve relative URI).
 */
export async function cleanMediaPlaylist(
  m3u8Content: string,
  baseUrl: string
): Promise<string> {
  const lines = m3u8Content.split(/\r?\n/);
  const out: string[] = [];
  let baseDirectory: string | null = null;
  seenSegmentNames.clear();

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("#") || !trimmed) {
      out.push(line);
      continue;
    }

    const absoluteUri = resolveUrl(trimmed, baseUrl);
    baseDirectory ??= getBaseDirectory(absoluteUri);
    const result = await processSegmentUri(absoluteUri, baseDirectory);
    if (result.action === "push") out.push(result.url);
  }

  if (out.length > 0 && !out.some((l) => l.includes("#EXT-X-ENDLIST"))) {
    out.push("#EXT-X-ENDLIST");
  }

  return out.join("\n");
}

/**
 * Transform master playlist: chỉ rewrite URI từng variant thành URL proxy.
 */
export function transformMasterPlaylist(
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
    out.push(toProxyUrl(resolveUrl(trimmed, baseUrl)));
  }

  return out.join("\n");
}

/**
 * Kiểm tra nội dung có phải master playlist (có #EXT-X-STREAM-INF) không.
 */
export function isMasterPlaylist(content: string): boolean {
  return content.includes("#EXT-X-STREAM-INF");
}
