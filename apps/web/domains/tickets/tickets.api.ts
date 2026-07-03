import { client } from "@/shared/api/client";
import type { Ticket, TicketMessage, CreateTicketDto, AddMessageDto } from "./tickets.types";

const route = {
  my: "/tickets/my" as const,
  byApplication: (applicationId: string) => `/tickets/application/${applicationId}` as const,
  detail: (id: string) => `/tickets/${id}` as const,
  create: "/tickets" as const,
  messages: (ticketId: string) => `/tickets/${ticketId}/messages` as const,
} as const;

export function getMyTickets() {
  return client.get<Ticket[]>(route.my);
}

export function getApplicationTickets(applicationId: string) {
  return client.get<Ticket[]>(route.byApplication(applicationId));
}

export function getTicketById(id: string) {
  return client.get<Ticket>(route.detail(id));
}

export function createTicket(dto: CreateTicketDto) {
  return client.post<Ticket>(route.create, dto);
}

export function addTicketMessage(ticketId: string, dto: AddMessageDto) {
  return client.post<TicketMessage>(route.messages(ticketId), dto);
}
