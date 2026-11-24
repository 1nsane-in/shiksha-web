import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/queryKeys";
import { getGalleryImages, uploadGalleryImage, deleteGalleryImage } from "./gallery.api";
import type {
  GalleryImage,
  GalleryInfiniteData,
  GalleryPage,
} from "./gallery.types";

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

export function useGalleryImages(initialPage?: GalleryPage | null) {
  return useInfiniteQuery<GalleryPage, Error, GalleryInfiniteData>({
    queryKey: queryKeys.gallery.all,
    queryFn: ({ pageParam }) => getGalleryImages(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    // SSR-provided first page — grid paints on first paint, no client fetch
    initialData: initialPage
      ? { pages: [initialPage], pageParams: [1] }
      : undefined,
    select: (data): GalleryInfiniteData => {
      const items = data.pages.flatMap((page) => page.items);
      return {
        pages: items,
        pageParams: data.pageParams,
        // ponytail: interleave full list from all loaded pages
        interleaved: interleave(items),
      };
    },
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
