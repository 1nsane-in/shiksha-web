"use client";

import React, { useState } from "react";
import { brand as theme } from "@/lib/brand";
import Image from "next/image";
import { SectionCard } from "../common/ui";
import { GalleryLightbox } from "@/components/landing/gallery/gallery-lightbox";
import type { UniversityContent } from "@/domains/universities/universities.types";

export function AboutSection({
  content,
  uniName,
}: {
  content: UniversityContent | null;
  uniName: string;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const hasGallery = content?.gallery && content.gallery.length > 0;
  if (!content?.shortDescription && !content?.longDescription && !hasGallery) return null;

  const openLightbox = (index: number) => setActiveIndex(index);
  const closeLightbox = () => setActiveIndex(null);
  const showNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIndex !== null && content?.gallery && content.gallery.length > 0) {
      setActiveIndex((activeIndex + 1) % content.gallery.length);
    }
  };
  const showPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIndex !== null && content?.gallery && content.gallery.length > 0) {
      setActiveIndex((activeIndex - 1 + content.gallery.length) % content.gallery.length);
    }
  };

  return (
    <SectionCard title="About & Gallery">
      {content?.shortDescription && (
        <p
          className="mb-4 text-sm leading-relaxed"
          style={{ color: theme.inkMuted }}
        >
          {content.shortDescription}
        </p>
      )}
      {content?.longDescription && (
        <div
          className="mb-6 text-sm leading-relaxed whitespace-pre-wrap"
          style={{ color: theme.inkMuted }}
        >
          {content.longDescription}
        </div>
      )}
      {hasGallery && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {content!.gallery.slice(0, 6).map((img: string, i: number) => (
            <button
              key={i}
              onClick={() => openLightbox(i)}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl cursor-pointer"
              style={{ border: "1px solid " + theme.hairline }}
            >
              <Image
                src={img}
                alt={`${uniName} gallery ${i + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
            </button>
          ))}
          {content!.gallery.length > 6 && (
            <div
              className="flex aspect-[4/3] items-center justify-center rounded-xl"
              style={{
                background: theme.goldLight,
                border: "1px solid " + theme.goldBorder,
              }}
            >
              <p className="text-sm font-medium" style={{ color: theme.gold }}>
                +{content!.gallery.length - 6} more
              </p>
            </div>
          )}
        </div>
      )}
      {hasGallery && content?.gallery && (
        <GalleryLightbox
          images={content.gallery}
          activeIndex={activeIndex}
          onClose={closeLightbox}
          onNext={showNext}
          onPrev={showPrev}
        />
      )}
    </SectionCard>
  );
}
