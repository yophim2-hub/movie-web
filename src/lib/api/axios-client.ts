import axios from "axios";

const DIRECT_PHIM_API_BASE = "https://phimapi.com/v1/api";
const DIRECT_PHIM_API_ROOT = "https://phimapi.com";

function trimTrailingSlash(s: string): string {
  return s.replace(/\/$/, "");
}

const envOverrideBase =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_PHIM_API_BASE_URL
    ? trimTrailingSlash(process.env.NEXT_PUBLIC_PHIM_API_BASE_URL)
    : "";
const envOverrideRoot =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_PHIM_API_ROOT_URL
    ? trimTrailingSlash(process.env.NEXT_PUBLIC_PHIM_API_ROOT_URL)
    : "";

const phimApiBaseUrl = envOverrideBase || DIRECT_PHIM_API_BASE;
const phimApiRootUrl = envOverrideRoot || DIRECT_PHIM_API_ROOT;

export const phimApiClient = axios.create({
  baseURL: phimApiBaseUrl,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/** Client for root-level endpoints e.g. /danh-sach/phim-moi-cap-nhat-v3 */
export const phimApiRootClient = axios.create({
  baseURL: phimApiRootUrl,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**
 * Trên trình duyệt: dùng proxy same-origin (next.config rewrites) trừ khi ghi đè URL
 * hoặc bật NEXT_PUBLIC_PHIM_API_USE_DIRECT=true.
 */
if (typeof window !== "undefined" && !envOverrideBase && !envOverrideRoot) {
  const useDirect =
    process.env.NEXT_PUBLIC_PHIM_API_USE_DIRECT === "1" ||
    process.env.NEXT_PUBLIC_PHIM_API_USE_DIRECT === "true";
  if (!useDirect) {
    const origin = window.location.origin;
    phimApiClient.interceptors.request.use((config) => {
      config.baseURL = `${origin}/api/phim-proxy/v1/api`;
      return config;
    });
    phimApiRootClient.interceptors.request.use((config) => {
      config.baseURL = `${origin}/api/phim-proxy`;
      return config;
    });
  }
}

const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      console.error("[phimApi] Error:", error.response.status, error.response.data);
    } else {
      const detail = [error.message, error.code].filter(Boolean).join(" ");
      const url = [error.config?.baseURL, error.config?.url].filter(Boolean).join("");
      console.error("[phimApi] Request error:", detail, url ? `(${url})` : "");
    }
  } else if (error && typeof error === "object" && "response" in error) {
    const res = (error as { response?: { status?: number; data?: unknown } }).response;
    if (res) console.error("[phimApi] Error:", res.status, res.data);
  } else {
    console.error("[phimApi] Request error:", (error as Error)?.message);
  }
  return Promise.reject(error);
};

phimApiClient.interceptors.response.use((response) => response, handleError);
phimApiRootClient.interceptors.response.use((response) => response, handleError);
