import type { ImageLoaderProps } from "next/image";

const PHIMIMG_HOST = "phimimg.com";

export function isPhimimgUrl(url: string): boolean {
  return url.includes(PHIMIMG_HOST);
}

/** Loader thêm f=webp → middleware ép Accept → ảnh trả về WebP. */
export function webpLoader({ src, width, quality }: ImageLoaderProps): string {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality ?? 75}&f=webp`;
}
