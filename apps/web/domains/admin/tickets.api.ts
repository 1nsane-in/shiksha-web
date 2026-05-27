import { client } from "@/shared/api/client";
import type { TicketResponse, PaginatedResponse, UpdateTicketStatusPayload, AssignTicketPayload, TicketFilters } from "./tickets.types";

export function getAllTickets(filters: TicketFilters = {}) {
  return client.get<PaginatedResponse<TicketResponse>>("/tickets/admin/all", {
    params: filters,
  });
}

export function getTicketById(id: string) {
  return client.get<TicketResponse>("/tickets/" + id);
}

export function updateTicketStatus(id: string, data: UpdateTicketStatusPayload) {
  return client.patch<TicketResponse>("/tickets/" + id + "/status", data);
}

export function assignTicket(id: string, data: AssignTicketPayload) {
  return client.patch<TicketResponse>("/tickets/" + id + "/assign", data);
}
