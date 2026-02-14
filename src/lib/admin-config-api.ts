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

export async function fetchAdminConfig(): Promise<AdminConfigPayload> {
  const res = await fetch("/api/admin/config", {
    method: "GET",
    headers: getHeaders(),
    cache: "no-store",
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error("Unauthorized");
    throw new Error(`Failed to fetch config: ${res.status}`);
  }
  return res.json() as Promise<AdminConfigPayload>;
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
}
