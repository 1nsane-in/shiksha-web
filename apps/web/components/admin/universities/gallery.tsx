"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";

export function GalleryGrid({ images, onDelete }: { images: string[]; onDelete?: (i: number) => void }) {
  const [showAll, setShowAll] = useState(false);
  const isVideo = (url: string) => /\.(mp4|webm|mov|avi|mkv)(\?|$)/i.test(url);

  if (!images?.length) return <p className="text-xs text-gray-400 italic">No media in gallery yet.</p>;

  const displayed = showAll ? images : images.slice(0, 6);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {displayed.map((src, i) => (
          <div key={i} className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-gray-200 bg-white">
            {isVideo(src) ? (
              <video src={src} className="h-full w-full object-cover" controls />
            ) : (
              <Image src={src} alt={`Gallery ${i + 1}`} fill unoptimized className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
            )}
            {onDelete && (
              <button onClick={() => onDelete(i)} className="absolute top-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100" title="Remove">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>
      {images.length > 6 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-3 text-sm font-medium text-brand-gold hover:opacity-80 transition-colors"
        >
          {showAll ? "Show less" : `Show all (${images.length})`}
        </button>
      )}
    </>
  );
}
