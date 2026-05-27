import { client } from "@/shared/api/client";
import type { Ticket, TicketMessage, CreateTicketDto, AddMessageDto } from "./tickets.types";

export function getMyTickets() {
  return client.get<Ticket[]>("/tickets/my");
}

export function getApplicationTickets(applicationId: string) {
  return client.get<Ticket[]>("/tickets/application/" + applicationId);
}

export function getTicketById(id: string) {
  return client.get<Ticket>("/tickets/" + id);
}

export function createTicket(dto: CreateTicketDto) {
  return client.post<Ticket>("/tickets", dto);
}

export function addTicketMessage(ticketId: string, dto: AddMessageDto) {
  return client.post<TicketMessage>("/tickets/" + ticketId + "/messages", dto);
}
