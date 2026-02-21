import Link from "next/link";

const MAIN_SECTIONS = [
  { href: "/phim-le", label: "Phim Lẻ" },
  { href: "/phim-bo", label: "Phim Bộ" },
  { href: "/phim-chieu-rap", label: "Phim Chiếu Rạp" },
  { href: "/hoat-hinh", label: "Hoạt Hình" },
  { href: "/phim-ngan", label: "Phim Ngắn" },
  { href: "/danh-sach", label: "Danh Sách Phim" },
];

const POPULAR_GENRES = [
  { href: "/the-loai/hanh-dong", label: "Hành Động" },
  { href: "/the-loai/tinh-cam", label: "Tình Cảm" },
  { href: "/the-loai/hai-huoc", label: "Hài Hước" },
  { href: "/the-loai/kinh-di", label: "Kinh Dị" },
  { href: "/the-loai/vien-tuong", label: "Viễn Tưởng" },
  { href: "/the-loai/tam-ly", label: "Tâm Lý" },
  { href: "/the-loai/phieu-luu", label: "Phiêu Lưu" },
  { href: "/the-loai/co-trang", label: "Cổ Trang" },
];

const POPULAR_COUNTRIES = [
  { href: "/quoc-gia/han-quoc", label: "Phim Hàn Quốc" },
  { href: "/quoc-gia/trung-quoc", label: "Phim Trung Quốc" },
  { href: "/quoc-gia/nhat-ban", label: "Phim Nhật Bản" },
  { href: "/quoc-gia/au-my", label: "Phim Âu Mỹ" },
  { href: "/quoc-gia/thai-lan", label: "Phim Thái Lan" },
  { href: "/quoc-gia/viet-nam", label: "Phim Việt Nam" },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--secondary-bg)]">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2">
              <span
                className="text-xl font-bold tracking-tight"
                style={{
                  background: "linear-gradient(135deg, #f97316, #ea580c, #dc2626)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Rồ Phim
              </span>
            </Link>
            <p className="mt-2 text-[13px] text-[var(--foreground-muted)]">
              Khám phá kho tàng phim trực tuyến. Xem phim hay Vietsub chất lượng 4K/Full HD miễn phí.
            </p>
          </div>

          {/* Danh mục */}
          <div>
            <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-[var(--foreground)]">
              Danh mục
            </h3>
            <ul className="space-y-2">
              {MAIN_SECTIONS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[13px] text-[var(--foreground-muted)] transition-colors hover:text-[var(--accent)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Thể loại */}
          <div>
            <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-[var(--foreground)]">
              Thể loại
            </h3>
            <ul className="space-y-2">
              {POPULAR_GENRES.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[13px] text-[var(--foreground-muted)] transition-colors hover:text-[var(--accent)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quốc gia */}
          <div>
            <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-[var(--foreground)]">
              Quốc gia
            </h3>
            <ul className="space-y-2">
              {POPULAR_COUNTRIES.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[13px] text-[var(--foreground-muted)] transition-colors hover:text-[var(--accent)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-[var(--border)] pt-6 text-center text-[12px] text-[var(--foreground-muted)]">
          <p>&copy; {new Date().getFullYear()} Rồ Phim. Xem phim online miễn phí.</p>
        </div>
      </div>
    </footer>
  );
}
