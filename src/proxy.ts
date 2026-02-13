import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Khi request /_next/image có query f=webp → ép Accept: image/webp
 * để Next.js Image Optimization trả về WebP thay vì theo Accept mặc định.
 */
export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  if (pathname !== "/_next/image" || searchParams.get("f") !== "webp") {
    return NextResponse.next();
  }
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("accept", "image/webp");
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: "/_next/image",
};
