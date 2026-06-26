"use client";

import React, { useState } from "react";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { useGalleryImages } from "@/domains/gallery";
import { brand as theme } from "@/lib/brand";
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
    <div className="min-h-screen flex flex-col" style={{ background: theme.canvas }}>
      <Header />

      <main className="flex-1">
        <GalleryHero />
        <GalleryGrid
          images={images}
          isLoading={isLoading}
          onOpenLightbox={openLightbox}
        />
      </main>

      <GalleryLightbox
        images={images}
        activeIndex={activeIndex}
        onClose={closeLightbox}
        onNext={showNext}
        onPrev={showPrev}
      />

      <Footer />
    </div>
  );
}
