"use client";

import React, { useState } from "react";
import { useGalleryImages } from "@/domains/gallery";
import { GalleryHero } from "@/components/gallery/gallery-hero";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { GalleryLightbox } from "@/components/gallery/gallery-lightbox";

export default function GalleryPage() {
  const { data: images = [], isLoading } = useGalleryImages();
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

  return (
    <>
      <GalleryHero />
      <GalleryGrid
        images={images}
        isLoading={isLoading}
        onOpenLightbox={openLightbox}
      />
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
