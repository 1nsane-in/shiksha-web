import { client } from "@/shared/api/client";
import type { GalleryImage } from "./gallery.types";

export function getGalleryImages() {
  return client.get<GalleryImage[]>("/gallery");
}

export function uploadGalleryImage(formData: FormData) {
  return client.post<GalleryImage>("/gallery", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function deleteGalleryImage(id: string) {
  return client.delete<{ success: boolean }>("/gallery/" + id);
}
