import { client } from "@/shared/api/client";
import type { TicketResponse, PaginatedResponse, UpdateTicketStatusPayload, AssignTicketPayload, TicketFilters } from "./tickets.types";

const route = {
  all: "/tickets/admin/all" as const,
  detail: (id: string) => `/tickets/${id}` as const,
  status: (id: string) => `/tickets/${id}/status` as const,
  assign: (id: string) => `/tickets/${id}/assign` as const,
} as const;

export function getAllTickets(filters: TicketFilters = {}) {
  return client.get<PaginatedResponse<TicketResponse>>(route.all, {
    params: filters,
  });
}

export function getTicketById(id: string) {
  return client.get<TicketResponse>(route.detail(id));
}

export function updateTicketStatus(id: string, data: UpdateTicketStatusPayload) {
  return client.patch<TicketResponse>(route.status(id), data);
}

export function assignTicket(id: string, data: AssignTicketPayload) {
  return client.patch<TicketResponse>(route.assign(id), data);
}
