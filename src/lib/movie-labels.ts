/**
 * Nhãn hiển thị cho status và type phim (dùng ở movie-detail, watch).
 */

const STATUS_LABELS: Record<string, string> = {
  ongoing: "Đang chiếu",
  completed: "Hoàn thành",
  trailer: "Trailer",
  upcoming: "Sắp chiếu",
};

const TYPE_LABELS: Record<string, string> = {
  hoathinh: "Hoạt hình",
  "phim-le": "Phim lẻ",
  "phim-bo": "Phim bộ",
  "phim-chieu-rap": "Phim chiếu rạp",
  "tv-shows": "TV Shows",
};

export function formatStatus(status: string): string {
  return STATUS_LABELS[status.toLowerCase()] ?? status;
}

export function formatMovieType(type: string): string {
  return TYPE_LABELS[type.toLowerCase()] ?? type;
}
