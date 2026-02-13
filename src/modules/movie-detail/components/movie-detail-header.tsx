"use client";

interface MovieDetailHeaderProps {
  title: string;
  originName: string;
  year: number;
  episodeCurrent: string;
}

export function MovieDetailHeader({
  title,
  originName,
  year,
  episodeCurrent,
}: MovieDetailHeaderProps) {
  return (
    <header className="mb-8">
      <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
        {title}
      </h1>
      <p className="mt-1 text-[13px] text-[var(--foreground-muted)]">
        {originName} · {year} · {episodeCurrent}
      </p>
    </header>
  );
}
