/** Giới hạn độ dài title SEO (~55 ký tự) để tổng với " | Bỏng Phim" không vượt ~70. */
const SEO_TITLE_MAX_LENGTH = 55;

/**
 * Rút gọn title cho SEO: ưu tiên tên chính (trước " - "), bỏ phần trùng (tên gốc, năm, chất lượng),
 * cắt tối đa SEO_TITLE_MAX_LENGTH ký tự.
 */
export function shortenTitleForSeo(fullTitle: string): string {
  const trimmed = fullTitle.trim();
  if (!trimmed) return trimmed;
  // Chỉ lấy phần đầu (thường là tên tiếng Việt) trước " - "
  const main = trimmed.split(/\s*-\s*/)[0]?.trim() || trimmed;
  if (main.length <= SEO_TITLE_MAX_LENGTH) return main;
  return main.slice(0, SEO_TITLE_MAX_LENGTH - 1).trimEnd() + "…";
}
