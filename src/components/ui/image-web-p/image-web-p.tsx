"use client";

import NextImage, { ImageProps } from "next/image";

/**
 * Tất cả ảnh trong dự án dùng component này.
 * Next.js Image (với next.config images.formats: ['image/webp']) sẽ tự động phục vụ WebP.
 */
export function ImageWebP(props: ImageProps) {
  return <NextImage {...props} alt={props.alt || ""} />;
}

export default ImageWebP;
