"use client";

interface MovieDetailHeroProps {
  readonly imageUrl: string;
}

export function MovieDetailHero({ imageUrl }: MovieDetailHeroProps) {
  const src = imageUrl.startsWith("http")
    ? imageUrl
    : `https://phimimg.com/${imageUrl}`;

  return (
    <div className="top-detail-wrap relative z-[1] -mx-6 w-[calc(100%+3rem)] overflow-hidden aspect-[21/6] min-h-[160px] sm:-mx-8 sm:min-h-[200px] sm:w-[calc(100%+4rem)]">
      <div
        className="background-fade absolute inset-0 bg-cover bg-top bg-no-repeat"
        style={{ backgroundImage: `url("${src}")` }}
      />
      <div
        className="cover-image absolute inset-0 bg-cover bg-top bg-no-repeat opacity-40"
        style={{ backgroundImage: `url("${src}")` }}
      />
      <div
        className="absolute inset-0"
        style={{ backgroundImage: "url('/images/dotted.png')", backgroundRepeat: "repeat" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
      <div className="cover-fade absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--background)]" />
    </div>
  );
}
