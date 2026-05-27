import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/queryKeys";
import type { CreateTicketDto, AddMessageDto } from "./tickets.types";

export function useMyTickets() {
  return useQuery({
    queryKey: queryKeys.tickets.my(),
    queryFn: async () => {
      const { getMyTickets } = await import("./tickets.api");
      return getMyTickets();
    },
  });
}

export function useApplicationTickets(applicationId: string) {
  return useQuery({
    queryKey: queryKeys.tickets.byApplication(applicationId),
    queryFn: async () => {
      const { getApplicationTickets } = await import("./tickets.api");
      return getApplicationTickets(applicationId);
    },
    enabled: !!applicationId,
  });
}

export function useTicket(ticketId: string) {
  return useQuery({
    queryKey: queryKeys.tickets.detail(ticketId),
    queryFn: async () => {
      const { getTicketById } = await import("./tickets.api");
      return getTicketById(ticketId);
    },
    enabled: !!ticketId,
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: CreateTicketDto) => {
      const { createTicket } = await import("./tickets.api");
      return createTicket(dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.all });
    },
  });
}

export function useAddTicketMessage(ticketId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: AddMessageDto) => {
      const { addTicketMessage } = await import("./tickets.api");
      return addTicketMessage(ticketId, dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.detail(ticketId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.my() });
    },
  });
}
