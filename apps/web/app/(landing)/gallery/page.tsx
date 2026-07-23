"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useGalleryImages } from "@/domains/gallery";
import { GalleryHero } from "@/components/landing/gallery/gallery-hero";
import { GalleryGrid } from "@/components/landing/gallery/gallery-grid";
import { GalleryLightbox } from "@/components/landing/gallery/gallery-lightbox";

export default function GalleryPage() {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error } = useGalleryImages();
  const images = data?.interleaved ?? [];
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setActiveIndex(index);
  const closeLightbox = () => setActiveIndex(null);

  const showNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIndex !== null && images.length > 0) {
      setActiveIndex((activeIndex + 1) % images.length);
    }
  };

  const showPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIndex !== null && images.length > 0) {
      setActiveIndex((activeIndex - 1 + images.length) % images.length);
    }
  };

  // Sentinel for infinite scroll
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sentinelRef.current || !hasNextPage || isFetchingNextPage) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) fetchNextPage(); },
      { rootMargin: "300px" },
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      <GalleryHero />
      <GalleryGrid
        images={images}
        isLoading={isLoading}
        error={error}
        onOpenLightbox={openLightbox}
      />
      <div ref={sentinelRef} className="h-4" />
      {isFetchingNextPage && (
        <div className="py-8 text-center text-sm text-gray-400">Loading more...</div>
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
