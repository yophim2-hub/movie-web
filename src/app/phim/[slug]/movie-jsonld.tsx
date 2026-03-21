import { fetchMovieDetail } from "@/lib/api";
import { JsonLd } from "@/components/seo";

const POSTER_BASE = "https://phimimg.com";

function buildImageUrl(path: string): string {
  return path.startsWith("http") ? path : `${POSTER_BASE}/${path}`;
}

/** Parse "104 phút" → "PT1H44M" (ISO 8601 duration) */
function parseDuration(timeStr: string): string | undefined {
  const match = /(\d+)\s*phút/i.exec(timeStr);
  if (!match) return undefined;
  const totalMins = parseInt(match[1], 10);
  if (!totalMins) return undefined;
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  if (h > 0 && m > 0) return `PT${h}H${m}M`;
  if (h > 0) return `PT${h}H`;
  return `PT${m}M`;
}

/** Strip HTML tags */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

/** YouTube video id from watch, embed, short, or youtu.be URLs */
function extractYoutubeVideoId(url: string): string | null {
  const trimmed = url.trim();
  const m =
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/.exec(
      trimmed
    );
  return m?.[1] ?? null;
}

/** Prefer /embed/ URL — Google Video rich results expect a player URL, not /watch */
function normalizeTrailerEmbedUrl(url: string): string {
  const id = extractYoutubeVideoId(url);
  if (id) return `https://www.youtube.com/embed/${id}`;
  return url;
}

/** Thumbnail Google can crawl reliably for YouTube trailers */
function trailerThumbnailUrl(trailerUrl: string, fallbackThumb: string): string {
  const id = extractYoutubeVideoId(trailerUrl);
  /** hqdefault is always present; maxresdefault can 404 and fail validation */
  if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  return fallbackThumb;
}

function safeToIsoDate(value: string | undefined): string | undefined {
  if (!value?.trim()) return undefined;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString();
}

/**
 * Google VideoObject yêu cầu uploadDate (ISO 8601). Luôn trả về chuỗi hợp lệ, không throw.
 */
function resolveVideoUploadIsoDate(item: {
  created?: { time?: string };
  modified?: { time?: string };
  year?: number;
}): string {
  const fromCreated = safeToIsoDate(item.created?.time);
  if (fromCreated) return fromCreated;
  const fromModified = safeToIsoDate(item.modified?.time);
  if (fromModified) return fromModified;
  const y = item.year;
  if (y != null && Number.isFinite(Number(y)) && Number(y) > 0) {
    const d = new Date(Number(y), 0, 1);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  }
  return new Date().toISOString();
}

export async function MovieJsonLd({ slug }: { slug: string }) {
  try {
    const res = await fetchMovieDetail(slug);
    const item = res?.data?.item;
    if (!item) return null;

    const isSeries = item.type === "series";
    const posterUrl = buildImageUrl(item.poster_url);
    const thumbUrl = buildImageUrl(item.thumb_url || item.poster_url);
    const descriptionRaw = item.content
      ? stripHtml(item.content).slice(0, 200).trim()
      : "";
    const description =
      descriptionRaw || item.origin_name || item.name || "Trailer";
    const duration = parseDuration(item.time);
    const datePublished = safeToIsoDate(item.created?.time);
    const dateModified = safeToIsoDate(item.modified?.time);

    /** Bắt buộc cho VideoObject (trailer): uploadDate + datePublished đồng bộ */
    const videoUploadDate = resolveVideoUploadIsoDate(item);

    const trailerEmbedUrl = item.trailer_url?.trim()
      ? normalizeTrailerEmbedUrl(item.trailer_url.trim())
      : "";
    const trailerThumbUrl = item.trailer_url?.trim()
      ? trailerThumbnailUrl(item.trailer_url.trim(), thumbUrl)
      : thumbUrl;

    const movieSchema: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": isSeries ? "TVSeries" : "Movie",
      name: item.name,
      ...(item.origin_name && { alternateName: item.origin_name }),
      url: `https://rophimm.org/phim/${item.slug}`,
      image: [posterUrl, thumbUrl],
      description,
      ...(item.category?.length > 0 && {
        genre: item.category.map((c) => c.name),
      }),
      inLanguage: item.lang || "vi",
      ...(datePublished && { datePublished }),
      ...(dateModified && { dateModified }),
      ...(duration && { duration }),
      ...(item.director?.length > 0 && {
        director: item.director.map((d) => ({
          "@type": "Person",
          name: d,
        })),
      }),
      ...(item.actor?.length > 0 && {
        actor: item.actor.map((a) => ({ "@type": "Person", name: a })),
      }),
      ...(item.country?.length > 0 && {
        countryOfOrigin: item.country.map((c) => ({
          "@type": "Country",
          name: c.name,
        })),
      }),
      ...(item.tmdb?.vote_average > 0 && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: item.tmdb.vote_average,
          ratingCount: item.tmdb.vote_count || 1,
          bestRating: 10,
          worstRating: 0,
        },
      }),
      ...(item.trailer_url?.trim() && {
        trailer: {
          "@type": "VideoObject",
          name: `Trailer - ${item.name}`,
          description,
          thumbnailUrl: trailerThumbUrl,
          uploadDate: videoUploadDate,
          datePublished: videoUploadDate,
          embedUrl: trailerEmbedUrl,
        },
      }),
    };

    const firstCategory = item.category?.[0];
    const breadcrumbItems = [
      {
        "@type": "ListItem" as const,
        position: 1,
        name: "Trang chủ",
        item: "https://rophimm.org",
      },
      ...(firstCategory
        ? [
            {
              "@type": "ListItem" as const,
              position: 2,
              name: firstCategory.name,
              item: `https://rophimm.org/the-loai/${firstCategory.slug}`,
            },
          ]
        : []),
      {
        "@type": "ListItem" as const,
        position: firstCategory ? 3 : 2,
        name: item.name,
        item: `https://rophimm.org/phim/${item.slug}`,
      },
    ];

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbItems,
    };

    return (
      <>
        <JsonLd data={movieSchema} />
        <JsonLd data={breadcrumbSchema} />
      </>
    );
  } catch {
    return null;
  }
}
