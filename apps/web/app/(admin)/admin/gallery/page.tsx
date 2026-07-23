"use client";

import { useGalleryImages, useDeleteGalleryImage } from "@/domains/gallery";
import { GalleryGrid } from "@/components/admin/gallery/gallery-grid";
import { GalleryUploadForm } from "@/components/admin/gallery/gallery-upload-form";

export default function GalleryPage() {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error } = useGalleryImages();
  const images = data?.interleaved ?? [];
  const deleteMutation = useDeleteGalleryImage();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch {
      // toast handled by mutation
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-[#111]">Gallery Management</h1>
        <p className="text-sm text-[#666]">Upload photos, videos and manage the website gallery.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <GalleryUploadForm />
        <GalleryGrid
          images={images}
          isLoading={isLoading}
          error={error}
          onDelete={handleDelete}
          deletePending={deleteMutation.isPending}
          hasNextPage={hasNextPage ?? false}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={fetchNextPage}
        />
      </div>
    </div>
  );
}
