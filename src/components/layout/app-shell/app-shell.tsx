"use client";

import { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
  /** Nội dung thanh toolbar (trái). VD: logo, title */
  toolbar?: ReactNode;
  /** Optional class cho wrapper */
  className?: string;
}

export function AppShell({
  children,
  toolbar,
  className = "",
}: Readonly<AppShellProps>) {
  return (
    <div className={`min-h-screen flex flex-col bg-background ${className}`}>
      {toolbar != null && (
        <header
          className="sticky top-0 z-10 glass-strong border-b border-[var(--border)]"
          style={{ minHeight: "52px" }}
        >
          <div className="mx-auto flex h-full max-w-5xl items-center px-4 sm:px-6">
            {toolbar}
          </div>
        </header>
      )}
      <main className="flex-1">{children}</main>
    </div>
  );
}
