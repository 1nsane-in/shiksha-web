"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import { useGalleryImages } from "@/domains/gallery";
import type { GalleryPage } from "@/domains/gallery";
import { GalleryGrid } from "@/components/landing/gallery/gallery-grid";
import { GalleryLightbox } from "@/components/landing/gallery/gallery-lightbox";
import { brand } from "@/lib/brand";
import {
  galleryHref,
  galleryViewKeys,
  galleryViews,
  matchesGalleryView,
  type GalleryView,
} from "@/lib/gallery-views";

/**
 * Interactive part of the gallery page.
 * Receives the SSR-fetched first page — the grid renders on first paint.
 */
export function GalleryClient({
  view,
  initialPage,
}: {
  view: GalleryView;
  initialPage: GalleryPage | null;
}) {
  const router = useRouter();
  const config = galleryViews[view];

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  } = useGalleryImages(initialPage);
  const allImages = useMemo(() => data?.interleaved ?? [], [data]);

  const matchedImages = useMemo(
    () => allImages.filter((image) => matchesGalleryView(image, view)),
    [allImages, view],
  );
  const usingFallback =
    view !== "all" && matchedImages.length === 0 && allImages.length > 0;
  const images = matchedImages.length > 0 ? matchedImages : allImages;

  const [lightbox, setLightbox] = useState<{
    view: GalleryView;
    index: number;
  } | null>(null);
  const activeIndex = lightbox?.view === view ? lightbox.index : null;

  const openLightbox = (index: number) => setLightbox({ view, index });
  const closeLightbox = () => setLightbox(null);

  const showNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIndex !== null && images.length > 0) {
      setLightbox({ view, index: (activeIndex + 1) % images.length });
    }
  };

  const showPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIndex !== null && images.length > 0) {
      setLightbox({
        view,
        index: (activeIndex - 1 + images.length) % images.length,
      });
    }
  };

  // Sentinel for infinite scroll
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sentinelRef.current || !hasNextPage || isFetchingNextPage) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) fetchNextPage();
      },
      { rootMargin: "300px" },
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const selectView = useCallback(
    (next: (typeof galleryViewKeys)[number]) =>
      router.replace(galleryHref(next), { scroll: false }),
    [router],
  );

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-5">
          {galleryViewKeys.map((key) => {
            const active = key === view;
            return (
              <button
                key={key}
                type="button"
                onClick={() => selectView(key)}
                aria-pressed={active}
                className="rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60"
                style={{
                  borderColor: active ? brand.ink : brand.hairline,
                  background: active ? brand.ink : "#fff",
                  color: active ? "#fff" : brand.inkMuted,
                }}
              >
                {galleryViews[key].label}
              </button>
            );
          })}
        </div>

        {usingFallback && (
          <p
            className="pt-4 text-sm"
            style={{ color: brand.inkMuted }}
          >
            No images tagged for {config.label.toLowerCase()} yet. Showing the
            full gallery.
          </p>
        )}
      </div>

      <GalleryGrid
        images={images}
        isLoading={isLoading}
        error={error}
        onOpenLightbox={openLightbox}
        emptyTitle={`No ${config.label} images yet`}
        emptyDescription="Images added with a matching title will appear in this view."
      />
      <div ref={sentinelRef} className="h-4" />
      {isFetchingNextPage && (
        <div className="py-8 text-center text-sm text-gray-600">
          Loading more...
        </div>
      )}
      <GalleryLightbox
        images={images}
        activeIndex={activeIndex}
        onClose={closeLightbox}
        onNext={showNext}
        onPrev={showPrev}
      />
    </>
  );
}
