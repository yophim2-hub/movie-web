"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "theme";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  if (typeof document === "undefined") return "light";
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored === "dark" || stored === "light") return stored;
  return globalThis.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  const html = document.documentElement;
  html.classList.remove("theme-light", "theme-dark");
  html.classList.add(`theme-${theme}`);
  localStorage.setItem(STORAGE_KEY, theme);
}

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(getInitialTheme());
    setMounted(true);
  }, []);

  const setThemeValue = useCallback((next: Theme) => {
    setTheme(next);
    applyTheme(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      applyTheme(next);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!mounted) return;
    applyTheme(theme);
  }, [mounted, theme]);

  const value = useMemo(
    () => ({ theme, setTheme: setThemeValue, toggleTheme }),
    [theme, setThemeValue, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
