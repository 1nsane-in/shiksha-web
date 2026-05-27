import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/queryKeys";
import type { TicketFilters, UpdateTicketStatusPayload } from "./tickets.types";

export function useAllTickets(filters: TicketFilters = {}) {
  return useQuery({
    queryKey: [...queryKeys.tickets.all, "admin", filters] as const,
    queryFn: async () => {
      const { getAllTickets } = await import("./tickets.api");
      return getAllTickets(filters);
    },
  });
}

export function useAdminTicketDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.tickets.detail(id),
    queryFn: async () => {
      const { getTicketById } = await import("./tickets.api");
      return getTicketById(id);
    },
    enabled: !!id,
  });
}

export function useUpdateTicketStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTicketStatusPayload }) => {
      const { updateTicketStatus } = await import("./tickets.api");
      return updateTicketStatus(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.all });
    },
  });
}

export function useAssignTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, assignedTo }: { id: string; assignedTo: string }) => {
      const { assignTicket } = await import("./tickets.api");
      return assignTicket(id, { assignedTo });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.all });
    },
  });
}
