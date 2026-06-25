"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { useGalleryImages, GalleryImage } from "@/domains/gallery";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const theme = {
  ink: "#1A153A",
  inkMuted: "#6B6599",
  gold: "#C4953B",
  goldLight: "rgba(196, 149, 59, 0.10)",
  canvas: "#FAF9F6",
  surface: "#FFFFFF",
  hairline: "rgba(26, 21, 58, 0.08)",
};

export default function GalleryPage() {
  const { data: images = [], isLoading } = useGalleryImages();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setActiveIndex(index);
  };

  const closeLightbox = () => {
    setActiveIndex(null);
  };

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
        {/* Hero Banner Section */}
        <section className="relative py-20 overflow-hidden bg-[#1A153A]">
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
              style={{ background: theme.goldLight, color: theme.gold }}
            >
              <span className="size-1.5 rounded-full" style={{ background: theme.gold }} />
              Shiksha Global Campus Life
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">
              Our <span style={{ color: theme.gold }}>University Gallery</span>
            </h1>
            <p className="max-w-2xl mx-auto text-base text-gray-300 leading-relaxed">
              Explore our world-class campus infrastructures, modern academic libraries, advanced anatomy labs, 
              hostel facilities, and the vibrant life of our medical students abroad.
            </p>
          </div>
        </section>

        {/* Gallery Grid Section */}
        <section className="py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-video relative rounded-2xl bg-[#EEEDE9] animate-pulse border border-[#ECEAE6]"
                />
              ))}
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400 mb-4">
                <Maximize2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium" style={{ color: theme.ink }}>
                No Gallery Images Yet
              </h3>
              <p className="text-sm mt-1 max-w-md mx-auto" style={{ color: theme.inkMuted }}>
                The global gallery is currently empty. Administrative staff will upload university campus, academic, and lab facilities photos soon.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((img: GalleryImage, index: number) => (
                <div
                  key={img.id}
                  onClick={() => openLightbox(index)}
                  className="group relative aspect-video overflow-hidden rounded-2xl border bg-white transition-all duration-300 hover:shadow-xl cursor-pointer"
                  style={{ borderColor: theme.hairline }}
                >
                  <Image
                    src={img.url}
                    alt={img.title || "Gallery Image"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5"
                  >
                    <span
                      className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </span>
                    <h3 className="text-base font-semibold text-white truncate pr-4">
                      {img.title || "Campus Life"}
                    </h3>
                    <p className="text-xs text-gray-300 mt-1">
                      Uploaded on {new Date(img.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Lightbox / Slideshow Modal */}
      <AnimatePresence>
        {activeIndex !== null && images[activeIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 p-4 sm:p-6"
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-[110] flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close lightbox"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Left Navigation Arrow */}
            <button
              onClick={showPrev}
              className="absolute left-4 sm:left-6 z-[110] flex h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Main Image Container */}
            <div className="relative max-h-[80vh] max-w-full overflow-hidden flex items-center justify-center">
              <motion.img
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                src={images[activeIndex].url}
                alt={images[activeIndex].title || "Gallery image"}
                className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Image Details at Bottom */}
            <div className="mt-4 text-center text-white max-w-2xl px-4 select-none">
              <h4 className="text-lg font-semibold">
                {images[activeIndex].title || "Untitled Campus Image"}
              </h4>
              <p className="text-xs text-gray-400 mt-1">
                Image {activeIndex + 1} of {images.length}
              </p>
            </div>

            {/* Right Navigation Arrow */}
            <button
              onClick={showNext}
              className="absolute right-4 sm:right-6 z-[110] flex h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
