/**
 * API Admin Config — đọc/ghi cấu hình trang từ file.
 * Bảo mật: Production yêu cầu header X-Admin-Secret trùng ADMIN_SECRET (env).
 * Development: không cần secret nếu ADMIN_SECRET chưa set.
 */

import { NextResponse } from "next/server";
import { readAdminConfigFile, writeAdminConfigFile } from "@/lib/admin-config-file";

/** Cho phép khi: dev không set secret, HOẶC header X-Admin-Secret trùng ADMIN_SECRET (prod). */
function isAuthorized(request: Request): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    return process.env.NODE_ENV === "development";
  }
  const header = request.headers.get("x-admin-secret");
  return header === secret;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const payload = await readAdminConfigFile();
    return NextResponse.json(payload);
  } catch (err) {
    console.error("[admin/config] GET error:", err);
    return NextResponse.json({ error: "Failed to read config" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as unknown;
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }
    const obj = body as Record<string, unknown>;
    const pageConfigs =
      obj.pageConfigs && typeof obj.pageConfigs === "object" && !Array.isArray(obj.pageConfigs)
        ? (obj.pageConfigs as Record<string, unknown>)
        : {};
    const customPages = Array.isArray(obj.customPages)
      ? (obj.customPages as Array<{ id: string; slug: string; label: string }>).filter(
          (p) => p && typeof p.id === "string" && typeof p.slug === "string" && typeof p.label === "string"
        )
      : [];
    await writeAdminConfigFile({ pageConfigs, customPages });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/config] PATCH error:", err);
    return NextResponse.json({ error: "Failed to write config" }, { status: 500 });
  }
}
