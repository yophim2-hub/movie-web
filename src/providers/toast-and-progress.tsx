"use client";

import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";

/**
 * Thanh tiến trình + Toast — vàng đậm (kim loại) + đen
 */
export function ToastAndProgress() {
  return (
    <>
      <NextTopLoader
        color="#d4af37"
        height={3}
        showSpinner={false}
        easing="ease"
        speed={300}
        shadow="0 0 14px rgba(212, 175, 55, 0.4)"
        zIndex={1600}
      />
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={12}
        containerClassName="!top-14"
        toastOptions={{
          duration: 4000,
          className: "toast-movie",
          style: {
            background: "var(--glass-bg)",
            color: "var(--foreground)",
            border: "1px solid var(--glass-border)",
            borderRadius: "var(--radius-panel)",
            boxShadow: "var(--shadow-lg)",
            backdropFilter: "saturate(180%) blur(20px)",
            WebkitBackdropFilter: "saturate(180%) blur(20px)",
          },
          success: {
            iconTheme: {
              primary: "var(--accent)",
              secondary: "var(--foreground)",
            },
          },
          error: {
            iconTheme: {
              primary: "#e74c3c",
              secondary: "var(--foreground)",
            },
          },
          loading: {
            iconTheme: {
              primary: "var(--accent)",
              secondary: "var(--foreground-muted)",
            },
          },
        }}
      />
    </>
  );
}
