"use client";

import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export function PageLayout({
  children,
  className = "",
}: Readonly<PageLayoutProps>) {
  return (
    <div className={`min-w-0 w-full px-6 py-20 sm:px-8 sm:py-24 ${className}`}>
      {children}
    </div>
  );
}
