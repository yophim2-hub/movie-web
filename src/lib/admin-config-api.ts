/**
 * Admin config API client — gọi API đọc/ghi cấu hình từ file.
 * Gửi X-Admin-Secret nếu có ADMIN_SECRET (env) để bảo mật khi chạy prod.
 */

export interface AdminConfigPayload {
  pageConfigs: Record<string, unknown>;
  customPages: Array<{ id: string; slug: string; label: string }>;
}

function getAdminSecret(): string | undefined {
  if (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_ADMIN_SECRET) {
    return process.env.NEXT_PUBLIC_ADMIN_SECRET;
  }
  return undefined;
}

function getHeaders(): HeadersInit {
  const secret = getAdminSecret();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (secret) {
    (headers as Record<string, string>)["X-Admin-Secret"] = secret;
  }
  return headers;
}

let _configCache: { data: AdminConfigPayload; ts: number } | null = null;
let _inflight: Promise<AdminConfigPayload> | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 phút

export async function fetchAdminConfig(): Promise<AdminConfigPayload> {
  if (_configCache && Date.now() - _configCache.ts < CACHE_TTL) {
    return _configCache.data;
  }
  // Dedup: nếu đang fetch thì chờ kết quả chung
  if (_inflight) return _inflight;

  _inflight = (async () => {
    try {
      const res = await fetch("/api/admin/config", {
        method: "GET",
        headers: getHeaders(),
        cache: "no-store",
      });
      if (!res.ok) {
        if (res.status === 401) throw new Error("Unauthorized");
        throw new Error(`Failed to fetch config: ${res.status}`);
      }
      const data = (await res.json()) as AdminConfigPayload;
      _configCache = { data, ts: Date.now() };
      return data;
    } finally {
      _inflight = null;
    }
  })();

  return _inflight;
}

export function invalidateAdminConfigCache() {
  _configCache = null;
}

export async function saveAdminConfig(payload: AdminConfigPayload): Promise<void> {
  const res = await fetch("/api/admin/config", {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error("Unauthorized");
    throw new Error(`Failed to save config: ${res.status}`);
  }
  invalidateAdminConfigCache();
}
