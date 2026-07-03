"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { ImageIcon } from "lucide-react";
import { GalleryImageCard } from "./gallery-image-card";
import type { GalleryImage } from "@/domains/gallery";

interface Props {
  images: GalleryImage[];
  isLoading: boolean;
  error: Error | null;
  onDelete: (id: string) => void;
  deletePending?: boolean;
}

export function GalleryGrid({ images, isLoading, error, onDelete, deletePending }: Props) {
  return (
    <Card className="md:col-span-2 border-[#ECEAE6] bg-[#FAFAF8]">
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <ImageIcon className="h-4 w-4" />
          Uploaded Gallery ({images.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-video relative rounded-lg bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500 text-sm">
            Failed to load gallery images. Please try again.
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-12 text-[#888] text-sm">
            No images uploaded yet. Use the upload panel to add your first gallery image.
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
            {images.map((img) => (
              <GalleryImageCard key={img.id} image={img} onDelete={onDelete} disabled={deletePending} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
