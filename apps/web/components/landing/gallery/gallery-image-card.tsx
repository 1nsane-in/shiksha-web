import React from "react";
import Image from "next/image";
import { Maximize2 } from "lucide-react";
import { brand } from "@/lib/brand";
import type { GalleryImage } from "@/domains/gallery";

interface GalleryImageCardProps {
  image: GalleryImage;
  onOpen: () => void;
}

/**
 * A single gallery image card with hover overlay showing title, date,
 * and a zoom icon.
 */
export function GalleryImageCard({ image, onOpen }: GalleryImageCardProps) {
  return (
    <div
      onClick={onOpen}
      className="group relative aspect-video overflow-hidden rounded-2xl border bg-white transition-all duration-300 hover:shadow-xl cursor-pointer"
      style={{ borderColor: brand.hairline }}
    >
      <Image
        src={image.url}
        alt={image.title || "Gallery Image"}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
        <span className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <Maximize2 className="h-4 w-4" />
        </span>
        <h3 className="text-base font-semibold text-white truncate pr-4">
          {image.title || "Campus Life"}
        </h3>
        <p className="text-xs text-gray-300 mt-1">
          Uploaded on {new Date(image.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
