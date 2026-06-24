import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const parentsKeys = {
  all: ["parents"] as const,
  inviteLink: () => [...parentsKeys.all, "invite-link"] as const,
  familyCode: () => [...parentsKeys.all, "family-code"] as const,
  myLinks: () => [...parentsKeys.all, "my-links"] as const,
  children: () => [...parentsKeys.all, "children"] as const,
  inviteDetails: (code: string) => [...parentsKeys.all, "invite", code] as const,
};

export function useInviteLink() {
  return useQuery({
    queryKey: parentsKeys.inviteLink(),
    queryFn: async () => {
      const { generateInviteLink } = await import("./parents.api");
      return generateInviteLink();
    },
    enabled: false, // Only fetch on demand
    staleTime: 0,
  });
}

export function useFamilyCode() {
  return useQuery({
    queryKey: parentsKeys.familyCode(),
    queryFn: async () => {
      const { getFamilyCode } = await import("./parents.api");
      return getFamilyCode();
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useMyParentLinks() {
  return useQuery({
    queryKey: parentsKeys.myLinks(),
    queryFn: async () => {
      const { getMyParentLinks } = await import("./parents.api");
      return getMyParentLinks();
    },
  });
}

export function useGenerateInviteLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { generateInviteLink } = await import("./parents.api");
      return generateInviteLink();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(parentsKeys.inviteLink(), data);
    },
  });
}

export function useRegenerateFamilyCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { regenerateFamilyCode } = await import("./parents.api");
      return regenerateFamilyCode();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(parentsKeys.familyCode(), data);
    },
  });
}

export function useRemoveParentLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { removeParentLink } = await import("./parents.api");
      return removeParentLink(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: parentsKeys.myLinks() });
    },
  });
}

/* ─── Parent-side queries ─── */

export function useValidateInviteCode(code: string) {
  return useQuery({
    queryKey: parentsKeys.inviteDetails(code),
    queryFn: async () => {
      const { validateInviteCode } = await import("./parents.api");
      return validateInviteCode(code);
    },
    enabled: !!code,
    retry: false,
  });
}

export function useLinkedChildren() {
  return useQuery({
    queryKey: parentsKeys.children(),
    queryFn: async () => {
      const { getLinkedChildren } = await import("./parents.api");
      return getLinkedChildren();
    },
  });
}

export function useParentRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: import("./parents.types").ParentRegisterRequest) => {
      const { parentRegister } = await import("./parents.api");
      return parentRegister(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: parentsKeys.all });
    },
  });
}

export function useLinkByFamilyCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: import("./parents.types").LinkByCodeRequest) => {
      const { linkByFamilyCode } = await import("./parents.api");
      return linkByFamilyCode(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: parentsKeys.children() });
    },
  });
}

/* ─── Admin hooks ─── */

const adminParentLinksKeys = {
  all: ["admin", "parent-links"] as const,
  list: (params?: Record<string, unknown>) =>
    [...adminParentLinksKeys.all, "list", params] as const,
};

export function useAdminParentLinks(params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: adminParentLinksKeys.list(params as Record<string, unknown>),
    queryFn: async () => {
      const { getAdminParentLinks } = await import("./parents.api");
      return getAdminParentLinks(params);
    },
  });
}

export function useCreateAdminParentLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      data: import("./parents.types").CreateParentLinkRequest
    ) => {
      const { createAdminParentLink } = await import("./parents.api");
      return createAdminParentLink(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminParentLinksKeys.all,
      });
    },
  });
}

export function useUpdateAdminParentLinkStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: import("./parents.types").UpdateParentLinkStatusRequest;
    }) => {
      const { updateAdminParentLinkStatus } = await import("./parents.api");
      return updateAdminParentLinkStatus(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminParentLinksKeys.all,
      });
    },
  });
}

export function useDeleteAdminParentLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { deleteAdminParentLink } = await import("./parents.api");
      return deleteAdminParentLink(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminParentLinksKeys.all,
      });
    },
  });
}

export { parentsKeys };
