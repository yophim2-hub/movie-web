/**
 * Chuẩn cấu trúc module (module-base).
 * Mỗi module trong `src/modules/<tên-module>/` cần có:
 *
 * - pages/     → Các page component (export default cho route)
 * - hooks/     → Custom hooks dùng trong module
 * - interfaces → Types, interfaces của module
 * - store/     → State (zustand/slice) nếu cần
 *
 * Đóng gói: mỗi module chỉ export qua file index.ts ở thư mục gốc module.
 */

export type ModulePublicApi = {
  pages: Record<string, unknown>;
  hooks?: Record<string, unknown>;
  interfaces?: Record<string, unknown>;
  store?: Record<string, unknown>;
};
