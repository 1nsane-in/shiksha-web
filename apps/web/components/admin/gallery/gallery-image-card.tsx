"use client";

import { Button } from "@repo/ui";
import { Trash2, Play } from "lucide-react";
import type { GalleryImage } from "@/domains/gallery";

interface Props {
  image: GalleryImage;
  onDelete: (id: string) => void;
  disabled?: boolean;
}

export function GalleryImageCard({ image, onDelete, disabled }: Props) {
  const isVideo = image.type === "VIDEO";

  return (
    <div className="group relative aspect-video overflow-hidden rounded-lg border border-[#ECEAE6] bg-gray-900 transition-shadow hover:shadow-md">
      {isVideo ? (
        <video
          src={image.url}
          className="h-full w-full object-cover"
          preload="metadata"
          muted
          playsInline
        />
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={image.url}
          alt={image.title || "Gallery Image"}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      )}

      {isVideo && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-12 w-12 rounded-full bg-black/60 flex items-center justify-center">
            <Play className="h-6 w-6 text-white fill-white ml-0.5" />
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2.5">
        <div className="flex justify-end">
          <Button
            type="button"
            variant="destructive"
            size="icon"
            disabled={disabled}
            onClick={() => onDelete(image.id)}
            className="h-7 w-7 bg-red-600 hover:bg-red-700 text-white"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
        <p
          className="text-xs font-medium text-white truncate w-full pr-6"
          title={image.title || ""}
        >
          {image.title || (isVideo ? "Untitled Video" : "Untitled Image")}
        </p>
      </div>
    </div>
  );
}
