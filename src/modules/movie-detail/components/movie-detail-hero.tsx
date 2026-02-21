"use client";

interface MovieDetailHeroProps {
  /** Poster or thumb URL for the background. */
  readonly imageUrl: string;
}

export function MovieDetailHero({ imageUrl }: MovieDetailHeroProps) {
  const src = imageUrl.startsWith("http")
    ? imageUrl
    : `https://phimimg.com/${imageUrl}`;

  return (
    <div className="top-detail-wrap relative z-[1] -mx-6 w-[calc(100%+3rem)] overflow-hidden aspect-[21/6] min-h-[160px] sm:-mx-8 sm:min-h-[200px] sm:w-[calc(100%+4rem)]">
      {/* Background image */}
      <div
        className="background-fade absolute inset-0 bg-cover bg-top bg-no-repeat"
        style={{ backgroundImage: `url("${src}")` }}
      />
      <div
        className="cover-image absolute inset-0 bg-cover bg-top bg-no-repeat opacity-40"
        style={{ backgroundImage: `url("${src}")` }}
      />
      {/* Dark overlay on top of image (lớp phủ) */}
      <div
        className="overlay absolute inset-0"
        style={{ backgroundColor: "rgba(32, 35, 49, 0.55)" }}
      />
      {/* Dotted texture — lớp phủ dùng dotted.png làm mask (vignette: tối giữa, nhạt ra viền) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.35)",
          maskImage: "url(/images/dotted.png)",
          maskSize: "cover",
          maskPosition: "center",
          WebkitMaskImage: "url(/images/dotted.png)",
          WebkitMaskSize: "cover",
          WebkitMaskPosition: "center",
        }}
      />
      {/* Gradient fade to page background */}
      <div className="cover-fade absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--background)]" />
    </div>
  );
}
