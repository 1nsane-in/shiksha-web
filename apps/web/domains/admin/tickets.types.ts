export interface TicketResponse {
  id: string;
  subject: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_CUSTOMER' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  applicationId?: string;
  assignedTo?: string;
  createdBy: string;
  createdAt: string;
  resolvedAt?: string;
  messages?: TicketMessage[];
  student?: { id: string; user: { name: string; email: string } };
  assignedAdmin?: { name: string; email: string };
  latestMessage?: { content: string; createdAt: string };
}

export interface TicketMessage {
  id: string;
  content: string;
  senderId: string;
  senderRole: string;
  createdAt: string;
  attachments?: string[];
}

export interface UpdateTicketStatusPayload {
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_CUSTOMER' | 'RESOLVED' | 'CLOSED';
  note?: string;
}

export interface AssignTicketPayload {
  assignedTo: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TicketFilters {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
}