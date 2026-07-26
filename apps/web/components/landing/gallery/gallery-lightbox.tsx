"use client";

import React from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { GalleryImage } from "@/domains/gallery";

interface GalleryLightboxProps {
  images: GalleryImage[];
  activeIndex: number | null;
  onClose: () => void;
  onNext: (e: React.MouseEvent) => void;
  onPrev: (e: React.MouseEvent) => void;
}

export function GalleryLightbox({
  images,
  activeIndex,
  onClose,
  onNext,
  onPrev,
}: GalleryLightboxProps) {
  return (
    <AnimatePresence>
      {activeIndex !== null && images[activeIndex] && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 p-4 sm:p-6"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-[110] flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close lightbox"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            onClick={onPrev}
            className="absolute left-4 sm:left-6 z-[110] flex h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div className="relative max-h-[80vh] max-w-full overflow-hidden flex items-center justify-center">
            {images[activeIndex].type === "VIDEO" ? (
              <motion.video
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                src={images[activeIndex].url}
                controls
                autoPlay
                className="max-h-[80vh] max-w-full rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
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
            )}
          </div>

          <div className="mt-4 text-center text-white max-w-2xl px-4 select-none">
            <h4 className="text-lg font-semibold">
              {images[activeIndex].title || (images[activeIndex].type === "VIDEO" ? "Campus Video" : "Campus Image")}
            </h4>
            <p className="text-xs text-gray-400 mt-1">
              {images[activeIndex].type === "VIDEO" ? "Video" : "Image"} {activeIndex + 1} of {images.length}
            </p>
          </div>

          <button
            onClick={onNext}
            className="absolute right-4 sm:right-6 z-[110] flex h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
