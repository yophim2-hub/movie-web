/**
 * Admin config file — đọc/ghi cấu hình trang vào file JSON.
 * Chỉ dùng trên server (API routes).
 * File: data/admin-page-configs.json — commit để deploy lên prod.
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

export interface AdminConfigPayload {
  pageConfigs: Record<string, unknown>;
  customPages: Array<{ id: string; slug: string; label: string }>;
}

const CONFIG_FILENAME = "admin-page-configs.json";

function getConfigPath(): string {
  return join(process.cwd(), "data", CONFIG_FILENAME);
}

export async function readAdminConfigFile(): Promise<AdminConfigPayload> {
  const path = getConfigPath();
  try {
    const raw = await readFile(path, "utf-8");
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") {
      return { pageConfigs: {}, customPages: [] };
    }
    const obj = parsed as Record<string, unknown>;
    const pageConfigs =
      obj.pageConfigs && typeof obj.pageConfigs === "object" && !Array.isArray(obj.pageConfigs)
        ? (obj.pageConfigs as Record<string, unknown>)
        : {};
    const customPages = Array.isArray(obj.customPages)
      ? (obj.customPages as Array<{ id: string; slug: string; label: string }>).filter(
          (p) => p && typeof p.id === "string" && typeof p.slug === "string" && typeof p.label === "string"
        )
      : [];
    return { pageConfigs, customPages };
  } catch (err) {
    const code = err && typeof err === "object" && "code" in err ? (err as NodeJS.ErrnoException).code : null;
    if (code === "ENOENT") {
      return { pageConfigs: {}, customPages: [] };
    }
    throw err;
  }
}

export async function writeAdminConfigFile(payload: AdminConfigPayload): Promise<void> {
  const path = getConfigPath();
  const dir = join(process.cwd(), "data");
  await mkdir(dir, { recursive: true });
  const content = JSON.stringify(
    {
      pageConfigs: payload.pageConfigs,
      customPages: payload.customPages,
    },
    null,
    2
  );
  await writeFile(path, content, "utf-8");
}
