export interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_CUSTOMER' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  createdBy: string;
  assignedTo?: string;
  applicationId?: string;
  createdAt: string;
  updatedAt: string;
  messages?: TicketMessage[];
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  content: string;
  senderId: string;
  senderRole: string;
  attachments?: string[];
  createdAt: string;
}

export interface CreateTicketDto {
  subject: string;
  description: string;
  applicationId?: string;
  categoryId?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}

export interface AddMessageDto {
  content: string;
  attachments?: string[];
}
