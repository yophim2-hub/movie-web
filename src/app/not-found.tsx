import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Không tìm thấy trang",
  description: "Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-20">
      {/* Gradient glow */}
      <div className="pointer-events-none absolute overflow-hidden">
        <div className="h-[400px] w-[400px] rounded-full bg-[var(--accent)] opacity-[0.04] blur-[100px]" />
      </div>

      <div className="relative z-10 flex max-w-md flex-col items-center text-center">
        {/* Logo */}
        <Image
          src="/logo.png"
          alt="Rồ Phim"
          width={48}
          height={48}
          className="mb-8 rounded-xl"
        />

        {/* 404 number */}
        <h1
          className="mb-4 text-[80px] leading-none font-extrabold tracking-tight sm:text-[120px]"
          style={{
            background:
              "linear-gradient(135deg, var(--accent) 0%, var(--accent-orange) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          404
        </h1>

        {/* Title */}
        <h2 className="mb-3 text-xl font-semibold text-[var(--foreground)]">
          Không tìm thấy trang
        </h2>

        {/* Description */}
        <p className="mb-8 text-[var(--foreground-muted)]">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="gradient-accent inline-flex h-9 items-center gap-2 rounded-[var(--radius-button)] border border-white/20 px-5 text-[13px] font-medium text-white shadow-[var(--shadow-sm)] transition-macos hover:opacity-90"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            Về trang chủ
          </Link>

          <Link
            href="/danh-sach"
            className="inline-flex h-9 items-center rounded-[var(--radius-button)] border border-[var(--border)] bg-[var(--secondary-bg-solid)] px-5 text-[13px] font-medium text-[var(--foreground)] transition-macos hover:bg-[var(--secondary-hover)]"
          >
            Danh sách phim
          </Link>
        </div>
      </div>
    </div>
  );
}
