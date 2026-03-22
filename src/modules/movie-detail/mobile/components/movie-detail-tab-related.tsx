"use client";

import { TabsContent } from "@/components/ui/tabs";
import { MovieDetailRelated } from "../../web/components/movie-detail-related";

export interface MovieDetailTabRelatedProps {
  readonly currentSlug: string;
  readonly categorySlug: string;
  readonly relatedLimit?: number;
}

export function MovieDetailTabRelated({
  currentSlug,
  categorySlug,
  relatedLimit = 12,
}: Readonly<MovieDetailTabRelatedProps>) {
  return (
    <TabsContent value="related" className="mt-4 min-w-0 overflow-hidden">
      <MovieDetailRelated
        currentSlug={currentSlug}
        categorySlug={categorySlug}
        limit={relatedLimit}
      />
    </TabsContent>
  );
}
