/** Khớp `globals.css`: `html.theme-dark` / `:root` --background */
export const THEME_COLOR_DARK = "#191b24";
export const THEME_COLOR_LIGHT = "#fafaf8";

export type ThemeChromeMode = "light" | "dark";

/** theme-color + thanh trạng thái iOS Safari / PWA */
export function syncMobileChromeFromTheme(theme: ThemeChromeMode): void {
  if (typeof document === "undefined") return;
  const color = theme === "dark" ? THEME_COLOR_DARK : THEME_COLOR_LIGHT;
  document.getElementById("theme-color-meta")?.setAttribute("content", color);
  document
    .getElementById("apple-status-bar-style")
    ?.setAttribute(
      "content",
      theme === "dark" ? "black-translucent" : "default",
    );
  document.documentElement.style.colorScheme =
    theme === "dark" ? "dark" : "light";
}
