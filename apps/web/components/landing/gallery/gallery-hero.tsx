import React from "react";
import Image from "next/image";
import { brand } from "@/lib/brand";

/**
 * Full-width hero banner for the gallery page.
 * Dark overlay with bg image, badge, title, and description.
 */
export function GalleryHero() {
  return (
    <section className="relative pb-20 pt-32 overflow-hidden bg-[#1A153A]">
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <Image
          alt="Medical Campus"
          src="https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=1920&q=80"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#1A153A]/90" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <p
          className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em]"
          style={{ background: brand.goldLight, color: brand.gold }}
        >
          <span
            className="size-1.5 rounded-full"
            style={{ background: brand.gold }}
          />
          Shiksha Global Campus Life
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">
          Our <span style={{ color: brand.gold }}>University Gallery</span>
        </h1>
        <p className="max-w-2xl mx-auto text-base text-gray-300 leading-relaxed">
          Explore our world-class campus infrastructures, modern academic
          libraries, advanced anatomy labs, hostel facilities, and the vibrant
          life of our medical students abroad.
        </p>
      </div>
    </section>
  );
}
