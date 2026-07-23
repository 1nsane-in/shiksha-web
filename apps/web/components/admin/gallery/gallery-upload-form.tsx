"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label } from "@repo/ui";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useUploadGalleryImage } from "@/domains/gallery";

export function GalleryUploadForm() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadGalleryImage();
  const isVideo = file?.type.startsWith("video/");

  const handleSubmit = async (e: React.FormEvent) => {
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
    if (isVideo && duration.trim()) {
      formData.append("duration", duration.trim());
    }

    try {
      await uploadMutation.mutateAsync(formData);
      toast.success(isVideo ? "Video uploaded successfully" : "Image uploaded successfully");
      setTitle("");
      setFile(null);
      setDuration("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to upload");
    }
  };

  return (
    <Card className="md:col-span-1 border-[#ECEAE6] bg-[#FAFAF8]">
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Upload to Gallery
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-xs font-semibold uppercase tracking-wider text-[#666]">
              Title (Optional)
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
              Select File
            </Label>
            <Input
              id="file"
              type="file"
              accept="image/*,video/*"
              ref={fileInputRef}
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="bg-white border-[#E5E7EB] cursor-pointer text-sm"
              required
            />
          </div>

          {isVideo && (
            <div className="space-y-1.5">
              <Label htmlFor="duration" className="text-xs font-semibold uppercase tracking-wider text-[#666]">
                Duration (seconds, optional)
              </Label>
              <Input
                id="duration"
                type="number"
                min="1"
                placeholder="e.g., 120"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="bg-white border-[#E5E7EB]"
              />
            </div>
          )}

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
                Upload {isVideo ? "Video" : "Image"}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
