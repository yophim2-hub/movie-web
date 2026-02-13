"use client";

import { formatStatus } from "@/lib/movie-labels";

export interface MovieStatusBlockProps {
  /** Mã trạng thái: ongoing, completed, trailer, upcoming */
  readonly status: string;
  /** Tập hiện tại (vd. "20") */
  readonly episodeCurrent?: string;
  /** Tổng số tập (vd. "32") */
  readonly episodeTotal?: string;
  readonly className?: string;
}

/** Spinner nhỏ Tailwind (thay spinner-border Bootstrap) */
function SmallSpinner() {
  return (
    <span
      className="inline-block h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-[var(--foreground-muted)] border-t-[var(--accent)]"
      aria-hidden
    />
  );
}

export function MovieStatusBlock({
  status,
  episodeCurrent,
  episodeTotal,
  className = "",
}: MovieStatusBlockProps) {
  const label = formatStatus(status);
  const isOngoing = status.toLowerCase() === "ongoing";
  const hasEpisodeProgress =
    (episodeCurrent != null && episodeCurrent !== "") || (episodeTotal != null && episodeTotal !== "");

  const progressText =
    hasEpisodeProgress && (episodeCurrent != null || episodeTotal != null)
      ? `Đã chiếu: Tập ${episodeCurrent ?? "?"} / ${episodeTotal ?? "?"}`
      : label;

  return (
    <div
      className={`mb-4 flex items-center justify-center gap-2 rounded-[var(--radius-button)] py-2 text-[12px] ${
        isOngoing
          ? "bg-[var(--accent-soft)] text-[var(--foreground)]"
          : "bg-[var(--secondary-bg-solid)] text-[var(--foreground-muted)]"
      } ${className}`}
      data-status={status.toLowerCase()}
    >
      {isOngoing && <SmallSpinner />}
      <span className="font-medium">{progressText}</span>
    </div>
  );
}
