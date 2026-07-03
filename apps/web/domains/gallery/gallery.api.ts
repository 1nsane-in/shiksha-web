import { client } from "@/shared/api/client";
import type { GalleryImage } from "./gallery.types";

const route = {
  list: "/gallery" as const,
  detail: (id: string) => `/gallery/${id}` as const,
} as const;

export function getGalleryImages() {
  return client.get<GalleryImage[]>(route.list);
}

export function uploadGalleryImage(formData: FormData) {
  return client.post<GalleryImage>(route.list, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function deleteGalleryImage(id: string) {
  return client.delete<{ success: boolean }>(route.detail(id));
}
