import { useQuery, useMutation } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/queryKeys";

export function useMyAdmissionLetter() {
  return useQuery({
    queryKey: queryKeys.letters.admission(),
    queryFn: async () => {
      const { getMyAdmissionLetter } = await import("./letters.api");
      return getMyAdmissionLetter();
    },
    retry: false,
  });
}

export function useMyInvitationLetter() {
  return useQuery({
    queryKey: queryKeys.letters.invitation(),
    queryFn: async () => {
      const { getMyInvitationLetter } = await import("./letters.api");
      return getMyInvitationLetter();
    },
    retry: false,
  });
}

export function useDownloadAdmissionLetter() {
  return useMutation({
    mutationFn: async (applicationId: string) => {
      const { downloadAdmissionLetter } = await import("./letters.api");
      return downloadAdmissionLetter(applicationId);
    },
  });
}

export function useDownloadInvitationLetter() {
  return useMutation({
    mutationFn: async (applicationId: string) => {
      const { downloadInvitationLetter } = await import("./letters.api");
      return downloadInvitationLetter(applicationId);
    },
  });
}
