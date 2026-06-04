"use client";

import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Skeleton } from "@repo/ui";
import { toast } from "sonner";
import { Plus, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
import { useGalleryImages, useUploadGalleryImage, useDeleteGalleryImage } from "@/domains/gallery";
import type { GalleryImage } from "@/domains/gallery";

export default function GalleryPage() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: images = [], isLoading, error } = useGalleryImages();
  const uploadMutation = useUploadGalleryImage();
  const deleteMutation = useDeleteGalleryImage();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    if (title.trim()) {
      formData.append("title", title.trim());
    }

    try {
      await uploadMutation.mutateAsync(formData);
      toast.success("Image uploaded successfully");
      setTitle("");
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to upload image");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Image deleted successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete image");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-[#111]">Gallery Management</h1>
        <p className="text-sm text-[#666]">Upload images and manage the global website gallery.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Upload Form Card */}
        <Card className="md:col-span-1 border-[#ECEAE6] bg-[#FAFAF8]">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Upload New Image
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-xs font-semibold uppercase tracking-wider text-[#666]">
                  Image Title (Optional)
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Campus Library"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-white border-[#E5E7EB]"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="file" className="text-xs font-semibold uppercase tracking-wider text-[#666]">
                  Select Image File
                </Label>
                <Input
                  id="file"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="bg-white border-[#E5E7EB] cursor-pointer text-sm"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={uploadMutation.isPending}
                className="w-full bg-[#3730A3] hover:bg-[#2e288a] text-white font-medium"
              >
                {uploadMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Upload Image
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Gallery Grid Card */}
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
                {images.map((img: GalleryImage) => (
                  <div
                    key={img.id}
                    className="group relative aspect-video overflow-hidden rounded-lg border border-[#ECEAE6] bg-white transition-shadow hover:shadow-md"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={img.title || "Gallery Image"}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2.5">
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          disabled={deleteMutation.isPending}
                          onClick={() => handleDelete(img.id)}
                          className="h-7 w-7 bg-red-600 hover:bg-red-700 text-white"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <p className="text-xs font-medium text-white truncate w-full pr-6" title={img.title || ""}>
                        {img.title || "Untitled Image"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
