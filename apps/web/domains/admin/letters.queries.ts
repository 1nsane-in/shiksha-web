import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/queryKeys";
import type { UploadLetterPayload } from "./letters.types";

export function useUploadAdmissionLetter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UploadLetterPayload) => {
      const { uploadAdmissionLetter } = await import("./letters.api");
      return uploadAdmissionLetter(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.letters.all });
    },
  });
}

export function useUploadInvitationLetter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UploadLetterPayload) => {
      const { uploadInvitationLetter } = await import("./letters.api");
      return uploadInvitationLetter(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.letters.all });
    },
  });
}

export function useApproveInvitationLetterAccess() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (applicationId: string) => {
      const { approveInvitationLetterAccess } = await import("./letters.api");
      return approveInvitationLetterAccess(applicationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.letters.all });
    },
  });
}
