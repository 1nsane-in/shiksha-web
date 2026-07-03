import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/queryKeys";
import { getGalleryImages, uploadGalleryImage, deleteGalleryImage } from "./gallery.api";

export function useGalleryImages() {
  return useQuery({
    queryKey: queryKeys.gallery.all,
    queryFn: () => getGalleryImages(),
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
