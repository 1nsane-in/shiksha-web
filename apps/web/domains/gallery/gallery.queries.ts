import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/queryKeys";
import { getGalleryImages, uploadGalleryImage, deleteGalleryImage } from "./gallery.api";
import type { GalleryImage, GalleryPage } from "./gallery.types";

function interleave(items: GalleryImage[]): GalleryImage[] {
  const images = items.filter((i) => i.type === "IMAGE");
  const videos = items.filter((i) => i.type === "VIDEO");
  const result: GalleryImage[] = [];
  let i = 0, j = 0;
  let toggle = true;
  while (i < images.length || j < videos.length) {
    if (toggle && i < images.length) result.push(images[i++]);
    else if (j < videos.length) result.push(videos[j++]);
    else if (i < images.length) result.push(images[i++]);
    else if (j < videos.length) result.push(videos[j++]);
    toggle = !toggle;
  }
  return result;
}

export function useGalleryImages() {
  return useInfiniteQuery<GalleryPage>({
    queryKey: queryKeys.gallery.all,
    queryFn: ({ pageParam }) => getGalleryImages(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    select: (data) => ({
      ...data,
      pages: data.pages.flatMap((p) => p.items),
      // ponytail: interleave full list from all loaded pages
      interleaved: interleave(data.pages.flatMap((p) => p.items)),
    }),
  });
}

export function useUploadGalleryImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => uploadGalleryImage(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all });
    },
  });
}

export function useDeleteGalleryImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteGalleryImage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all });
    },
  });
}
