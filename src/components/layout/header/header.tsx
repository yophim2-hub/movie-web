"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { HeaderSearch } from "./header-search";
import { HeaderCategoryMenu } from "./header-category-menu";
import { HeaderCountryMenu } from "./header-country-menu";
import { Modal } from "@/components/ui/modal";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const isDev = process.env.NODE_ENV === "development";

const SCROLL_THRESHOLD_VH = 40;

const SearchIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 512 512"
    className={className}
    aria-hidden
  >
    <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
  </svg>
);

const UserIcon = () => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 448 512"
    className="mr-1.5 h-4 w-4 shrink-0"
    aria-hidden
  >
    <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z" />
  </svg>
);

const MenuBars = () => (
  <span className="flex flex-col gap-1" aria-hidden>
    <span className="block h-0.5 w-5 rounded-full bg-current" />
    <span className="block h-0.5 w-5 rounded-full bg-current" />
    <span className="block h-0.5 w-5 rounded-full bg-current" />
  </span>
);

export function Header() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (globalThis.window === undefined) return;
    const thresholdPx = globalThis.window.innerHeight * (SCROLL_THRESHOLD_VH / 100);
    const check = () => setIsScrolled(globalThis.window.scrollY >= thresholdPx);
    check();
    globalThis.window.addEventListener("scroll", check, { passive: true });
    return () => globalThis.window.removeEventListener("scroll", check);
  }, []);

  const headerSolid = isScrolled || mobileMenuOpen;

  if (pathname === "/quan-ly-admin") {
    return null;
  }

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-10 border-b transition-[background-color,border-color] duration-[var(--duration-normal)] ease-[var(--ease-out-quart)] ${
        headerSolid
          ? "border-[var(--border)] bg-[var(--glass-bg)] backdrop-blur-[var(--blur-amount)]"
          : "border-transparent bg-transparent"
      }`}
      style={
        headerSolid
          ? { WebkitBackdropFilter: "saturate(200%) blur(var(--blur-amount-strong))" }
          : undefined
      }
    >
      <div className="relative flex min-h-[64px] w-full items-center gap-3 px-4 sm:gap-4 sm:px-6">
        {/* Trái: mobile toggles + logo */}
        <div className="flex flex-1 items-center gap-3 lg:gap-4">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-button)] focus-ring lg:hidden ${
              mobileMenuOpen
                ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                : "text-[var(--foreground)] hover:bg-[var(--secondary-bg-solid)]"
            }`}
            aria-label={mobileMenuOpen ? "Đóng menu" : "Mở menu"}
          >
            <MenuBars />
          </button>
          <button
            type="button"
            onClick={() => setSearchOpen((o) => !o)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-button)] text-[var(--foreground)] hover:bg-[var(--secondary-bg-solid)] focus-ring lg:hidden"
            aria-label="Tìm kiếm"
          >
            <SearchIcon className="h-5 w-5" />
          </button>
          <Link
            href="/"
            id="logo"
            className="flex shrink-0 items-center"
            title="Trang chủ"
          >
            <span className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
              Bỏng Phim
            </span>
          </Link>
        </div>

        {/* Giữa: navigation luôn căn giữa header (desktop) */}
        <nav
          id="main_menu"
          className={`absolute left-0 right-0 top-[64px] flex flex-col gap-0 border-b border-[var(--border)] bg-[var(--glass-bg-solid)] p-4 shadow-[var(--shadow-md)] ${
            mobileMenuOpen ? "flex" : "hidden lg:flex"
          } lg:absolute lg:left-1/2 lg:top-0 lg:min-h-[64px] lg:-translate-x-1/2 lg:flex-row lg:items-center lg:justify-center lg:gap-0 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none`}
          aria-label="Menu chính"
        >
          <HeaderCategoryMenu onMobileNavClick={() => setMobileMenuOpen(false)} />
          <Link
            href="/phim-le"
            className="menu-item rounded-[var(--radius-button)] px-3 py-2 text-sm capitalize text-[var(--foreground)] hover:bg-[var(--secondary-bg-solid)]"
            onClick={() => setMobileMenuOpen(false)}
          >
            Phim lẻ
          </Link>
          <Link
            href="/phim-bo"
            className="menu-item rounded-[var(--radius-button)] px-3 py-2 text-sm capitalize text-[var(--foreground)] hover:bg-[var(--secondary-bg-solid)]"
            onClick={() => setMobileMenuOpen(false)}
          >
            Phim bộ
          </Link>
          <Link
            href="/phim-chieu-rap"
            className="menu-item rounded-[var(--radius-button)] px-3 py-2 text-sm capitalize text-[var(--foreground)] hover:bg-[var(--secondary-bg-solid)]"
            onClick={() => setMobileMenuOpen(false)}
          >
            Phim chiếu rạp
          </Link>
          <Link
            href="/hoat-hinh"
            className="menu-item rounded-[var(--radius-button)] px-3 py-2 text-sm capitalize text-[var(--foreground)] hover:bg-[var(--secondary-bg-solid)]"
            onClick={() => setMobileMenuOpen(false)}
          >
            Hoạt hình
          </Link>
          <HeaderCountryMenu onMobileNavClick={() => setMobileMenuOpen(false)} />
        </nav>

        {/* Phải: search + theme + profile */}
        <div className="flex flex-1 items-center justify-end gap-2">
          <HeaderSearch open={searchOpen} onOpenChange={setSearchOpen} />
          <ThemeToggle variant="both" className="shrink-0" />
          <div className="flex shrink-0 items-center">
            {isDev ? (
              <Link
                href="/quan-ly-admin"
                className="button-user button-login inline-flex items-center rounded-[var(--radius-button)] px-3 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--secondary-bg-solid)] focus-ring"
                aria-label="Quản lý admin (chỉ debug)"
              >
                <span className="line-center flex items-center">
                  <UserIcon />
                  <span className="hidden sm:inline">Quản lý admin</span>
                </span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setMemberModalOpen(true)}
                className="button-user button-login inline-flex items-center rounded-[var(--radius-button)] px-3 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--secondary-bg-solid)] focus-ring"
                aria-label="Thành viên"
              >
                <span className="line-center flex items-center">
                  <UserIcon />
                  <span className="hidden sm:inline">Thành viên</span>
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {!isDev && (
        <Modal
          open={memberModalOpen}
          onClose={() => setMemberModalOpen(false)}
          title="Thành viên"
          panelClassName="!max-w-[80vw] w-[80vw] h-[80vh] max-h-[80vh]"
        >
          <div className="py-4 text-[13px] text-[var(--foreground-muted)]">
            Đăng nhập / Đăng ký — sẽ kết nối backend sau.
          </div>
        </Modal>
      )}
    </header>
  );
}
