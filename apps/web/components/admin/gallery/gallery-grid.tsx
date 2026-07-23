"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { ImageIcon } from "lucide-react";
import { GalleryImageCard } from "./gallery-image-card";
import type { GalleryImage } from "@/domains/gallery";

interface Props {
  images: GalleryImage[];
  isLoading: boolean;
  error: Error | null;
  onDelete: (id: string) => void;
  deletePending?: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}

export function GalleryGrid({ images, isLoading, error, onDelete, deletePending, hasNextPage, isFetchingNextPage, onLoadMore }: Props) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sentinelRef.current || !hasNextPage || isFetchingNextPage) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onLoadMore(); },
      { rootMargin: "300px" },
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  return (
    <Card className="md:col-span-2 border-[#ECEAE6] bg-[#FAFAF8]">
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <ImageIcon className="h-4 w-4" />
          Uploaded Gallery ({images.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-center py-8 text-red-500 text-sm">
            Failed to load gallery. Please try again.
          </div>
        ) : isLoading ? (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-video relative rounded-lg bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-12 text-[#888] text-sm">
            No items yet. Use the upload panel to add photos or videos.
          </div>
        ) : (
          <>
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
              {images.map((img) => (
                <GalleryImageCard key={img.id} image={img} onDelete={onDelete} disabled={deletePending} />
              ))}
            </div>
            <div ref={sentinelRef} className="h-4" />
            {isFetchingNextPage && (
              <div className="py-4 text-center text-sm text-gray-400">Loading more...</div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
