"use client";

import { useState, useEffect } from "react";

/**
 * True sau khi component đã mount trên client.
 * Dùng để tránh hydration mismatch khi render phụ thuộc localStorage / window.
 */
export function useHasMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}
