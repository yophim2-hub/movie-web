"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { HeaderSearch } from "./header-search";
import { HeaderCategoryMenu } from "./header-category-menu";
import { HeaderCountryMenu } from "./header-country-menu";

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

const CloseIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 384 512"
    className={className}
    aria-hidden
  >
    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
  </svg>
);

const MenuBars = () => (
  <span className="flex flex-col gap-1" aria-hidden>
    <span className="block h-0.5 w-5 rounded-full bg-current" />
    <span className="block h-0.5 w-5 rounded-full bg-current" />
    <span className="block h-0.5 w-5 rounded-full bg-current" />
  </span>
);

const NAV_ITEMS = [
  { href: "/phim-le", label: "Phim lẻ" },
  { href: "/phim-bo", label: "Phim bộ" },
  { href: "/phim-chieu-rap", label: "Phim chiếu rạp" },
  { href: "/hoat-hinh", label: "Hoạt hình" },
  { href: "/phim-ngan", label: "Phim ngắn" },
];

/** Items visible inline at lg; the rest go into "Xem thêm". At xl+ all show. */
const NAV_VISIBLE_LG = 2;

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  const handleSearchOpen = (open: boolean) => {
    setSearchOpen(open);
    if (open) setMobileMenuOpen(false);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen((o) => {
      const next = !o;
      if (next) setSearchOpen(false);
      return next;
    });
  };

  useEffect(() => {
    if (globalThis.window === undefined) return;
    const thresholdPx =
      globalThis.window.innerHeight * (SCROLL_THRESHOLD_VH / 100);
    const check = () => setIsScrolled(globalThis.window.scrollY >= thresholdPx);
    check();
    globalThis.window.addEventListener("scroll", check, { passive: true });
    return () => globalThis.window.removeEventListener("scroll", check);
  }, []);

  // Close "Xem thêm" on click outside
  useEffect(() => {
    if (!moreMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (moreMenuRef.current?.contains(e.target as Node)) return;
      setMoreMenuOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [moreMenuOpen]);

  const headerSolid = isScrolled || mobileMenuOpen;

  const visibleNavItems = NAV_ITEMS.slice(0, NAV_VISIBLE_LG);
  const overflowNavItems = NAV_ITEMS.slice(NAV_VISIBLE_LG);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-10 border-b transition-[background-color,border-color] duration-[var(--duration-normal)] ease-[var(--ease-out-quart)] ${
        headerSolid
          ? "border-[var(--border)] bg-[var(--glass-bg)] backdrop-blur-[var(--blur-amount)]"
          : "border-transparent bg-transparent"
      }`}
      style={
        headerSolid
          ? {
              WebkitBackdropFilter:
                "saturate(200%) blur(var(--blur-amount-strong))",
            }
          : undefined
      }
    >
      <div className="relative flex min-h-[64px] w-full items-center gap-3 px-4 sm:gap-4 sm:px-6">
        {/* ── Mobile: menu | logo | search ── */}
        {/* Menu button – always visible on mobile */}
        <button
          type="button"
          onClick={handleMobileMenuToggle}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-button)] focus-ring lg:hidden ${
            mobileMenuOpen
              ? "bg-[var(--accent-soft)] text-[var(--accent)]"
              : "text-[var(--foreground)] hover:bg-[var(--secondary-bg-solid)]"
          }`}
          aria-label={mobileMenuOpen ? "Đóng menu" : "Mở menu"}
        >
          <MenuBars />
        </button>

        {/* Logo – hidden when mobile search is open */}
        <Link
          href="/"
          id="logo"
          className={`flex shrink-0 items-center transition-[opacity,width] duration-200 lg:opacity-100 lg:w-auto ${
            searchOpen
              ? "w-0 overflow-hidden opacity-0 lg:overflow-visible"
              : "opacity-100"
          }`}
          title="Trang chủ"
        >
          <Image
            src="/logo.png"
            alt="Rồ Phim"
            width={32}
            height={32}
            className="rounded-lg"
            priority
          />
          <div className="ml-1.5 flex flex-col leading-none">
            <span
              className="whitespace-nowrap text-lg font-bold tracking-tight"
              style={{
                background: "linear-gradient(135deg, #f97316, #ea580c, #dc2626)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Rồ Phim
            </span>
            <span className="text-[10px] tracking-wide text-[var(--foreground-muted)]">
              Kho tàng phim
            </span>
          </div>
        </Link>

        {/* ── Mobile search input (animated expand) ── */}
        <div
          className={`flex min-w-0 items-center gap-2 transition-[flex,opacity] duration-200 lg:hidden ${
            searchOpen ? "flex-1 opacity-100" : "flex-none opacity-100"
          }`}
        >
          {searchOpen && (
            <HeaderSearch
              open={searchOpen}
              onOpenChange={handleSearchOpen}
              className="!block !w-full !max-w-none !flex-1"
            />
          )}
        </div>

        {/* Mobile search toggle / close */}
        {!searchOpen ? (
          <button
            type="button"
            onClick={() => handleSearchOpen(true)}
            className="ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-button)] text-[var(--foreground)] hover:bg-[var(--secondary-bg-solid)] focus-ring lg:hidden"
            aria-label="Tìm kiếm"
          >
            <SearchIcon className="h-5 w-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleSearchOpen(false)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-button)] text-[var(--foreground)] hover:bg-[var(--secondary-bg-solid)] focus-ring lg:hidden"
            aria-label="Đóng tìm kiếm"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        )}

        {/* ── Center navigation (single row on desktop) ── */}
        <nav
          id="main_menu"
          className={`absolute left-0 right-0 top-[64px] z-30 flex flex-col gap-0 border-b border-[var(--border)] bg-[var(--glass-bg-solid)] p-4 shadow-[var(--shadow-md)] ${
            mobileMenuOpen ? "flex" : "hidden lg:flex"
          } lg:absolute lg:left-1/2 lg:top-0 lg:z-auto lg:min-h-[64px] lg:-translate-x-1/2 lg:flex-row lg:flex-nowrap lg:items-center lg:justify-center lg:gap-0 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none`}
          aria-label="Menu chính"
        >
          <HeaderCategoryMenu
            onMobileNavClick={() => setMobileMenuOpen(false)}
          />

          {/* Always-visible nav items (on both mobile menu & desktop) */}
          {visibleNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="menu-item shrink-0 rounded-[var(--radius-button)] px-3 py-2 text-sm capitalize text-[var(--foreground)] hover:bg-[var(--secondary-bg-solid)]"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          {/* Overflow items: visible in mobile menu + xl desktop, hidden at lg */}
          {overflowNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="menu-item shrink-0 rounded-[var(--radius-button)] px-3 py-2 text-sm capitalize text-[var(--foreground)] hover:bg-[var(--secondary-bg-solid)] lg:hidden xl:inline-flex"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          <HeaderCountryMenu
            onMobileNavClick={() => setMobileMenuOpen(false)}
          />

          {/* "Xem thêm" – at the end, only at lg, hidden on mobile & xl+ */}
          {overflowNavItems.length > 0 && (
            <div
              ref={moreMenuRef}
              className="relative hidden shrink-0 lg:block xl:hidden"
            >
              <button
                type="button"
                onClick={() => setMoreMenuOpen((o) => !o)}
                className="menu-item inline-flex items-center gap-1 rounded-[var(--radius-button)] px-3 py-2 text-sm capitalize text-[var(--foreground)] hover:bg-[var(--secondary-bg-solid)]"
              >
                Xem thêm
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 320 512"
                  className={`h-3 w-3 shrink-0 transition-transform duration-200 ${moreMenuOpen ? "rotate-180" : ""}`}
                  aria-hidden
                >
                  <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
                </svg>
              </button>
              {moreMenuOpen && (
                <div className="absolute right-0 top-full z-50 mt-1 min-w-[160px] rounded-[var(--radius-panel)] border border-[var(--border)] bg-[var(--glass-bg-solid)] p-1 shadow-[var(--shadow-lg)]">
                  {overflowNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block rounded-[var(--radius-button)] px-3 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--secondary-bg-solid)]"
                      onClick={() => {
                        setMoreMenuOpen(false);
                        setMobileMenuOpen(false);
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </nav>

        {/* ── Desktop: search (right side) ── */}
        <div className="hidden flex-1 items-center justify-end gap-2 lg:flex">
          <HeaderSearch open={false} onOpenChange={handleSearchOpen} />
        </div>
      </div>
    </header>
  );
}
