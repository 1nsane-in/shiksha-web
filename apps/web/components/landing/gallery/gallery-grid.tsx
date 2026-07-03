"use client";

import React from "react";
import { Maximize2 } from "lucide-react";
import { brand } from "@/lib/brand";
import type { GalleryImage } from "@/domains/gallery";
import { GalleryImageCard } from "@/components/landing/gallery/gallery-image-card";

interface GalleryGridProps {
  images: GalleryImage[];
  isLoading: boolean;
  onOpenLightbox: (index: number) => void;
}

/**
 * Gallery grid with three states: loading (skeleton), empty,
 * and populated grid of image cards.
 */
export function GalleryGrid({ images, isLoading, onOpenLightbox }: GalleryGridProps) {
  return (
    <section className="py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {isLoading ? (
        /* ── Skeleton loading state ── */
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="aspect-video relative rounded-2xl bg-[#EEEDE9] animate-pulse border border-[#ECEAE6]"
            />
          ))}
        </div>
      ) : images.length === 0 ? (
        /* ── Empty state ── */
        <div className="text-center py-20">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400 mb-4">
            <Maximize2 className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-medium" style={{ color: brand.ink }}>
            No Gallery Images Yet
          </h3>
          <p className="text-sm mt-1 max-w-md mx-auto" style={{ color: brand.inkMuted }}>
            The global gallery is currently empty. Administrative staff will upload university campus,
            academic, and lab facilities photos soon.
          </p>
        </div>
      ) : (
        /* ── Image grid ── */
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img: GalleryImage, index: number) => (
            <GalleryImageCard
              key={img.id}
              image={img}
              onOpen={() => onOpenLightbox(index)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
