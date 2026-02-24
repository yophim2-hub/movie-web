import Image from "next/image";

export default function BaoTriPage() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--background)]">
      {/* Gradient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-[var(--accent)] opacity-[0.04] blur-[120px]" />
        <div className="absolute -bottom-1/4 right-0 h-[500px] w-[500px] rounded-full bg-[var(--accent-orange)] opacity-[0.03] blur-[100px]" />
      </div>

      <div className="relative z-10 mx-4 flex max-w-md flex-col items-center text-center">
        {/* Logo */}
        <Image
          src="/logo.png"
          alt="Rồ Phim"
          width={64}
          height={64}
          className="mb-6 rounded-2xl"
          priority
        />

        {/* Gear icon */}
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--accent)]/10">
          <svg
            className="h-10 w-10 animate-[spin_3s_linear_infinite] text-[var(--accent)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="mb-3 text-2xl font-bold text-[var(--foreground)]">
          Đang Bảo Trì Hệ Thống
        </h1>

        {/* Description */}
        <p className="mb-8 leading-relaxed text-[var(--foreground-muted)]">
          Chúng tôi đang nâng cấp hệ thống để mang đến trải nghiệm tốt hơn.
          Vui lòng quay lại sau ít phút.
        </p>

        {/* Animated dots */}
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-[pulse_1.4s_ease-in-out_infinite] rounded-full bg-[var(--accent)]" />
          <span className="h-2 w-2 animate-[pulse_1.4s_ease-in-out_0.2s_infinite] rounded-full bg-[var(--accent)]" />
          <span className="h-2 w-2 animate-[pulse_1.4s_ease-in-out_0.4s_infinite] rounded-full bg-[var(--accent)]" />
        </div>

        {/* Footer text */}
        <p className="mt-8 text-[13px] text-[var(--foreground-subtle)]">
          — Rồ Phim —
        </p>
      </div>
    </div>
  );
}
