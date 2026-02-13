import axios from "axios";

const PHIM_API_BASE_URL = "https://phimapi.com/v1/api";
const PHIM_API_ROOT_URL = "https://phimapi.com";

export const phimApiClient = axios.create({
  baseURL: PHIM_API_BASE_URL,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/** Client for root-level endpoints e.g. /danh-sach/phim-moi-cap-nhat-v3 */
export const phimApiRootClient = axios.create({
  baseURL: PHIM_API_ROOT_URL,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const handleError = (error: unknown) => {
  if (error && typeof error === "object" && "response" in error) {
    const res = (error as { response?: { status?: number; data?: unknown } }).response;
    if (res) console.error("[phimApi] Error:", res.status, res.data);
  } else {
    console.error("[phimApi] Request error:", (error as Error)?.message);
  }
  return Promise.reject(error);
};

phimApiClient.interceptors.response.use((response) => response, handleError);
phimApiRootClient.interceptors.response.use((response) => response, handleError);
