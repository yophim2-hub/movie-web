/**
 * Admin config file — đọc/ghi cấu hình trang vào file JSON.
 * Chỉ dùng trên server (API routes).
 * File chính: data/admin-page-configs.json
 * File dự phòng: data/default-page-configs.json — dùng khi file chính không tồn tại hoặc rỗng.
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

export interface AdminConfigPayload {
  pageConfigs: Record<string, unknown>;
  customPages: Array<{ id: string; slug: string; label: string }>;
}

const CONFIG_FILENAME = "admin-page-configs.json";
const DEFAULT_CONFIG_FILENAME = "default-page-configs.json";

function getConfigPath(): string {
  return join(process.cwd(), "data", CONFIG_FILENAME);
}

function getDefaultConfigPath(): string {
  return join(process.cwd(), "data", DEFAULT_CONFIG_FILENAME);
}

function parsePayload(raw: string): AdminConfigPayload {
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
}

async function readDefaultConfig(): Promise<AdminConfigPayload> {
  try {
    const raw = await readFile(getDefaultConfigPath(), "utf-8");
    return parsePayload(raw);
  } catch {
    return { pageConfigs: {}, customPages: [] };
  }
}

export async function readAdminConfigFile(): Promise<AdminConfigPayload> {
  const path = getConfigPath();
  try {
    const raw = await readFile(path, "utf-8");
    const payload = parsePayload(raw);
    if (Object.keys(payload.pageConfigs).length > 0 || payload.customPages.length > 0) {
      return payload;
    }
    return readDefaultConfig();
  } catch (err) {
    const code = err && typeof err === "object" && "code" in err ? (err as NodeJS.ErrnoException).code : null;
    if (code === "ENOENT") {
      return readDefaultConfig();
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
