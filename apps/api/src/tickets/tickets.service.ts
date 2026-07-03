import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TimelineService } from '../common/services/timeline.service';
import { NotificationService } from '../common/services/notification.service';
import {
  CreateTicketDto,
  AddTicketMessageDto,
  UpdateTicketStatusDto,
  AssignTicketDto,
} from './dto/ticket.dto';

@Injectable()
export class TicketsService {
  constructor(
    private prisma: PrismaService,
    private timeline: TimelineService,
    private notification: NotificationService,
  ) {}

  async createTicket(
    userId: string,
    userRole: string,
    studentId: string | null,
    dto: CreateTicketDto,
  ) {
    const ticket = await this.prisma.supportTicket.create({
      data: {
        userId,
        applicationId: dto.applicationId || null,
        subject: dto.subject,
        description: dto.description,
        categoryId: dto.categoryId,
        priority: (dto.priority as any) || 'MEDIUM',
        status: 'OPEN',
        messages: {
          create: {
            senderId: userId,
            senderRole: userRole,
            content: dto.description,
            attachments: [],
          },
        },
      },
      include: { messages: true },
    });

    // Only create timeline event if linked to an application
    if (dto.applicationId && studentId) {
      await this.timeline.onTicketCreated(
        dto.applicationId,
        studentId,
        ticket.id,
        dto.subject,
      );
    }

    return ticket;
  }

  async addMessage(
    ticketId: string,
    userId: string,
    userRole: string,
    studentId: string | null,
    dto: AddTicketMessageDto,
  ) {
    const ticket = await this.prisma.supportTicket.findUnique({
      where: { id: ticketId },
    });
    if (!ticket) throw new NotFoundException('Ticket not found');

    // Check access
    if (ticket.userId !== userId && userRole === 'STUDENT') {
      throw new ForbiddenException('Access denied');
    }

    const message = await this.prisma.supportTicketMessage.create({
      data: {
        ticketId,
        senderId: userId,
        senderRole: userRole,
        content: dto.content,
        attachments: dto.attachments || [],
      },
    });

    // If customer replies, reopen the ticket
    if (userRole === 'STUDENT' && ticket.status === 'WAITING_FOR_CUSTOMER') {
      await this.prisma.supportTicket.update({
        where: { id: ticketId },
        data: { status: 'IN_PROGRESS' },
      });
    }

    return message;
  }

  async updateStatus(
    ticketId: string,
    dto: UpdateTicketStatusDto,
    userRole: string,
  ) {
    const ticket = await this.prisma.supportTicket.findUnique({
      where: { id: ticketId },
    });
    if (!ticket) throw new NotFoundException('Ticket not found');

    const updated = await this.prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        status: dto.status as any,
        ...(dto.status === 'RESOLVED' || dto.status === 'CLOSED'
          ? { resolvedAt: new Date() }
          : {}),
      },
    });

    if (
      (dto.status === 'RESOLVED' || dto.status === 'CLOSED') &&
      ticket.applicationId
    ) {
      const app = await this.prisma.supportTicket.findUnique({
        where: { id: ticketId },
        include: { application: { select: { studentId: true } } },
      });
      if (app?.application?.studentId) {
        await this.timeline.onTicketResolved(
          ticket.applicationId,
          app.application.studentId,
          ticketId,
        );
      }
    }

    return updated;
  }

  async assignTicket(ticketId: string, dto: AssignTicketDto) {
    const ticket = await this.prisma.supportTicket.findUnique({
      where: { id: ticketId },
    });
    if (!ticket) throw new NotFoundException('Ticket not found');

    return this.prisma.supportTicket.update({
      where: { id: ticketId },
      data: { assignedTo: dto.assignedTo },
    });
  }

  async getMyTickets(userId: string) {
    return this.prisma.supportTicket.findMany({
      where: { userId },
      include: { messages: { orderBy: { createdAt: 'desc' }, take: 1 } },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getApplicationTickets(
    applicationId: string,
    userId: string,
    userRole: string,
  ) {
    const where: any = { applicationId };
    if (userRole === 'STUDENT') {
      where.userId = userId;
    }
    return this.prisma.supportTicket.findMany({
      where,
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
        application: { select: { id: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getTicketById(ticketId: string, userId: string, userRole: string) {
    const ticket = await this.prisma.supportTicket.findUnique({
      where: { id: ticketId },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
        application: { select: { id: true } },
      },
    });
    if (!ticket) throw new NotFoundException('Ticket not found');
    if (userRole === 'STUDENT' && ticket.userId !== userId) {
      throw new NotFoundException('Ticket not found');
    }
    return ticket;
  }

  async getAllTickets(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.supportTicket.findMany({
        include: {
          messages: { orderBy: { createdAt: 'desc' }, take: 1 },
          application: { select: { id: true } },
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.supportTicket.count(),
    ]);
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
