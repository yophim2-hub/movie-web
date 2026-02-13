"use client";

import Link from "next/link";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { useCountries } from "@/hooks";

const ChevronDown = () => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 320 512"
    className="ml-1 h-3.5 w-3.5 shrink-0"
    aria-hidden
  >
    <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
  </svg>
);

const DROPDOWN_CLASS =
  "z-50 mt-1 max-h-[70vh] min-w-[200px] overflow-auto rounded-[var(--radius-panel)] border border-[var(--border)] bg-[var(--glass-bg-solid)] p-1 shadow-[var(--shadow-lg)] focus:outline-none sm:min-w-[320px]";

const DROPDOWN_GRID_CLASS = "grid grid-cols-2 gap-0.5 sm:grid-cols-4";

const MENU_ITEM_CLASS =
  "menu-item rounded-[var(--radius-button)] px-3 py-2 text-sm capitalize text-[var(--foreground)] hover:bg-[var(--secondary-bg-solid)]";

export function HeaderCountryMenu({
  onMobileNavClick,
}: Readonly<{ onMobileNavClick?: () => void }>) {
  const { data: countries } = useCountries();

  return (
    <>
      {/* Mobile: link điều hướng thẳng tới trang danh sách quốc gia */}
      <Link
        href="/quoc-gia"
        className={`${MENU_ITEM_CLASS} inline-flex w-full lg:hidden`}
        onClick={onMobileNavClick}
      >
        Quốc gia
      </Link>
      {/* Desktop: dropdown */}
      <Menu as="div" className="menu-item menu-item-sub relative z-50 hidden lg:block">
        <MenuButton className="dropdown inline-flex w-full items-center justify-between rounded-[var(--radius-button)] px-3 py-2 text-left text-sm capitalize text-[var(--foreground)] hover:bg-[var(--secondary-bg-solid)] focus:outline-none focus-visible:outline-none focus:ring-0 lg:inline-flex lg:w-auto">
          Quốc gia
          <ChevronDown />
        </MenuButton>
        <MenuItems anchor="bottom start" className={DROPDOWN_CLASS}>
          <div className={DROPDOWN_GRID_CLASS}>
            {countries?.map((c) => (
              <MenuItem key={c._id}>
                <Link
                  href={`/quoc-gia/${c.slug}`}
                  className="block rounded-[var(--radius-button)] px-3 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--secondary-bg-solid)] data-[focus]:bg-[var(--secondary-bg-solid)]"
                >
                  {c.name}
                </Link>
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Menu>
    </>
  );
}
