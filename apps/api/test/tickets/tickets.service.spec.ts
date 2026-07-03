import { Test, TestingModule } from '@nestjs/testing';
import { TicketsService } from '../../src/tickets/tickets.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { TimelineService } from '../../src/common/services/timeline.service';
import { NotificationService } from '../../src/common/services/notification.service';
import {
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import {
  CreateTicketDto,
  AddTicketMessageDto,
  UpdateTicketStatusDto,
  AssignTicketDto,
} from '../../src/tickets/dto/ticket.dto';

const mockPrisma = {
  supportTicket: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
  supportTicketMessage: {
    create: jest.fn(),
  },
};

const mockTimeline = {
  onTicketCreated: jest.fn(),
  onTicketResolved: jest.fn(),
};

const mockNotification = {};

const mockTicket = {
  id: 'ticket-1',
  userId: 'user-1',
  applicationId: 'app-1',
  subject: 'Need help',
  description: 'I need help with my application',
  categoryId: null,
  priority: 'MEDIUM',
  status: 'OPEN',
  assignedTo: null,
  resolvedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  messages: [
    {
      id: 'msg-1',
      ticketId: 'ticket-1',
      senderId: 'user-1',
      senderRole: 'STUDENT',
      content: 'I need help with my application',
      attachments: [],
      createdAt: new Date(),
    },
  ],
};

const mockMessage = {
  id: 'msg-2',
  ticketId: 'ticket-1',
  senderId: 'admin-1',
  senderRole: 'ADMIN',
  content: 'Sure, let me check',
  attachments: [],
  createdAt: new Date(),
};

describe('TicketsService', () => {
  let service: TicketsService;
  let prisma: typeof mockPrisma;
  let timeline: typeof mockTimeline;

  const userId = 'user-1';
  const adminRole = 'ADMIN';
  const studentRole = 'STUDENT';

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: TimelineService, useValue: mockTimeline },
        { provide: NotificationService, useValue: mockNotification },
      ],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
    prisma = mockPrisma;
    timeline = mockTimeline;
  });

  describe('createTicket', () => {
    const createDto: CreateTicketDto = {
      subject: 'Need help',
      description: 'I need help with my application',
      applicationId: 'app-1',
      priority: 'HIGH',
    };

    it('should create ticket with nested message and timeline', async () => {
      prisma.supportTicket.create.mockResolvedValue(mockTicket);
      timeline.onTicketCreated.mockResolvedValue(undefined);

      const result = await service.createTicket(
        userId,
        studentRole,
        'student-1',
        createDto,
      );

      expect(prisma.supportTicket.create).toHaveBeenCalledWith({
        data: {
          userId,
          applicationId: createDto.applicationId,
          subject: createDto.subject,
          description: createDto.description,
          categoryId: undefined,
          priority: 'HIGH',
          status: 'OPEN',
          messages: {
            create: {
              senderId: userId,
              senderRole: studentRole,
              content: createDto.description,
              attachments: [],
            },
          },
        },
        include: { messages: true },
      });
      expect(timeline.onTicketCreated).toHaveBeenCalledWith(
        'app-1',
        'student-1',
        mockTicket.id,
        createDto.subject,
      );
      expect(result).toEqual(mockTicket);
    });

    it('should not create timeline when applicationId absent', async () => {
      const dtoNoApp: CreateTicketDto = {
        subject: 'General help',
        description: 'How does this work?',
      };
      prisma.supportTicket.create.mockResolvedValue({
        ...mockTicket,
        applicationId: null,
        subject: 'General help',
      });

      await service.createTicket(userId, studentRole, 'student-1', dtoNoApp);

      expect(timeline.onTicketCreated).not.toHaveBeenCalled();
    });

    it('should default priority to MEDIUM', async () => {
      const dtoNoPriority: CreateTicketDto = {
        subject: 'General help',
        description: 'How does this work?',
      };
      prisma.supportTicket.create.mockResolvedValue({
        ...mockTicket,
        priority: 'MEDIUM',
      });

      await service.createTicket(userId, studentRole, null, dtoNoPriority);

      expect(prisma.supportTicket.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            priority: 'MEDIUM',
          }),
        }),
      );
    });
  });

  describe('addMessage', () => {
    const msgDto: AddTicketMessageDto = {
      content: 'Sure, let me check',
    };

    it('should throw NotFoundException when ticket missing', async () => {
      prisma.supportTicket.findUnique.mockResolvedValue(null);

      await expect(
        service.addMessage('bad-id', userId, studentRole, null, msgDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when wrong student', async () => {
      prisma.supportTicket.findUnique.mockResolvedValue(mockTicket);

      await expect(
        service.addMessage('ticket-1', 'other-user', 'STUDENT', null, msgDto),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should create message and reopen ticket if WAITING_FOR_CUSTOMER', async () => {
      prisma.supportTicket.findUnique.mockResolvedValue({
        ...mockTicket,
        status: 'WAITING_FOR_CUSTOMER',
      });
      prisma.supportTicketMessage.create.mockResolvedValue(mockMessage);
      prisma.supportTicket.update.mockResolvedValue({
        ...mockTicket,
        status: 'IN_PROGRESS',
      });

      const result = await service.addMessage(
        'ticket-1',
        userId,
        studentRole,
        null,
        msgDto,
      );

      expect(prisma.supportTicketMessage.create).toHaveBeenCalledWith({
        data: {
          ticketId: 'ticket-1',
          senderId: userId,
          senderRole: studentRole,
          content: msgDto.content,
          attachments: [],
        },
      });
      expect(prisma.supportTicket.update).toHaveBeenCalledWith({
        where: { id: 'ticket-1' },
        data: { status: 'IN_PROGRESS' },
      });
      expect(result).toEqual(mockMessage);
    });

    it('should not reopen ticket when admin replies', async () => {
      prisma.supportTicket.findUnique.mockResolvedValue({
        ...mockTicket,
        status: 'WAITING_FOR_CUSTOMER',
      });
      prisma.supportTicketMessage.create.mockResolvedValue(mockMessage);

      await service.addMessage('ticket-1', 'admin-1', adminRole, null, msgDto);

      expect(prisma.supportTicket.update).not.toHaveBeenCalled();
    });
  });

  describe('updateStatus', () => {
    const statusDto: UpdateTicketStatusDto = { status: 'RESOLVED' };

    it('should throw NotFoundException when ticket missing', async () => {
      prisma.supportTicket.findUnique.mockResolvedValue(null);

      await expect(
        service.updateStatus('bad-id', statusDto, adminRole),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update status and set resolvedAt for RESOLVED', async () => {
      prisma.supportTicket.findUnique.mockResolvedValue(mockTicket);
      prisma.supportTicket.update.mockResolvedValue({
        ...mockTicket,
        status: 'RESOLVED',
        resolvedAt: new Date(),
      });
      // For the timeline event, findUnique is called again
      prisma.supportTicket.findUnique.mockResolvedValue({
        ...mockTicket,
        applicationId: 'app-1',
        application: { studentId: 'student-1' },
      });
      timeline.onTicketResolved.mockResolvedValue(undefined);

      const result = await service.updateStatus('ticket-1', statusDto, adminRole);

      expect(prisma.supportTicket.update).toHaveBeenCalledWith({
        where: { id: 'ticket-1' },
        data: {
          status: 'RESOLVED',
          resolvedAt: expect.any(Date),
        },
      });
      expect(timeline.onTicketResolved).toHaveBeenCalledWith(
        'app-1',
        'student-1',
        'ticket-1',
      );
      expect(result.status).toEqual('RESOLVED');
    });

    it('should set resolvedAt for CLOSED status', async () => {
      prisma.supportTicket.findUnique.mockResolvedValue(mockTicket);
      prisma.supportTicket.update.mockResolvedValue({
        ...mockTicket,
        status: 'CLOSED',
        resolvedAt: new Date(),
      });

      await service.updateStatus('ticket-1', { status: 'CLOSED' }, adminRole);

      expect(prisma.supportTicket.update).toHaveBeenCalledWith({
        where: { id: 'ticket-1' },
        data: {
          status: 'CLOSED',
          resolvedAt: expect.any(Date),
        },
      });
    });

    it('should not set resolvedAt for non-terminal statuses', async () => {
      prisma.supportTicket.findUnique.mockResolvedValue(mockTicket);
      prisma.supportTicket.update.mockResolvedValue({
        ...mockTicket,
        status: 'IN_PROGRESS',
      });

      await service.updateStatus(
        'ticket-1',
        { status: 'IN_PROGRESS' },
        adminRole,
      );

      expect(prisma.supportTicket.update).toHaveBeenCalledWith({
        where: { id: 'ticket-1' },
        data: {
          status: 'IN_PROGRESS',
        },
      });
    });
  });

  describe('assignTicket', () => {
    const assignDto: AssignTicketDto = { assignedTo: 'admin-2' };

    it('should throw NotFoundException when ticket missing', async () => {
      prisma.supportTicket.findUnique.mockResolvedValue(null);

      await expect(
        service.assignTicket('bad-id', assignDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should assign ticket', async () => {
      prisma.supportTicket.findUnique.mockResolvedValue(mockTicket);
      prisma.supportTicket.update.mockResolvedValue({
        ...mockTicket,
        assignedTo: 'admin-2',
      });

      const result = await service.assignTicket('ticket-1', assignDto);

      expect(prisma.supportTicket.update).toHaveBeenCalledWith({
        where: { id: 'ticket-1' },
        data: { assignedTo: 'admin-2' },
      });
      expect(result.assignedTo).toEqual('admin-2');
    });
  });

  describe('getMyTickets', () => {
    it('should return tickets with last message', async () => {
      prisma.supportTicket.findMany.mockResolvedValue([mockTicket]);

      const result = await service.getMyTickets(userId);

      expect(prisma.supportTicket.findMany).toHaveBeenCalledWith({
        where: { userId },
        include: { messages: { orderBy: { createdAt: 'desc' }, take: 1 } },
        orderBy: { updatedAt: 'desc' },
      });
      expect(result).toEqual([mockTicket]);
    });
  });

  describe('getApplicationTickets', () => {
    it('should return tickets for admin with no userId filter', async () => {
      prisma.supportTicket.findMany.mockResolvedValue([mockTicket]);

      const result = await service.getApplicationTickets(
        'app-1',
        'admin-1',
        adminRole,
      );

      expect(prisma.supportTicket.findMany).toHaveBeenCalledWith({
        where: { applicationId: 'app-1' },
        include: {
          messages: { orderBy: { createdAt: 'asc' } },
          application: { select: { id: true } },
        },
        orderBy: { updatedAt: 'desc' },
      });
      expect(result).toEqual([mockTicket]);
    });

    it('should filter by userId for students', async () => {
      prisma.supportTicket.findMany.mockResolvedValue([mockTicket]);

      const result = await service.getApplicationTickets(
        'app-1',
        userId,
        studentRole,
      );

      expect(prisma.supportTicket.findMany).toHaveBeenCalledWith({
        where: { applicationId: 'app-1', userId },
        include: expect.any(Object),
        orderBy: { updatedAt: 'desc' },
      });
      expect(result).toEqual([mockTicket]);
    });
  });

  describe('getTicketById', () => {
    it('should throw NotFoundException when ticket missing', async () => {
      prisma.supportTicket.findUnique.mockResolvedValue(null);

      await expect(
        service.getTicketById('bad-id', userId, studentRole),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException for wrong student (not 403)', async () => {
      prisma.supportTicket.findUnique.mockResolvedValue(mockTicket);

      await expect(
        service.getTicketById('ticket-1', 'other-user', studentRole),
      ).rejects.toThrow(NotFoundException);
    });

    it('should return ticket for admin', async () => {
      prisma.supportTicket.findUnique.mockResolvedValue(mockTicket);

      const result = await service.getTicketById('ticket-1', 'admin-1', adminRole);

      expect(result).toEqual(mockTicket);
    });

    it('should return ticket for owner', async () => {
      prisma.supportTicket.findUnique.mockResolvedValue(mockTicket);

      const result = await service.getTicketById('ticket-1', userId, studentRole);

      expect(result).toEqual(mockTicket);
    });
  });

  describe('getAllTickets', () => {
    it('should return paginated result', async () => {
      prisma.supportTicket.findMany.mockResolvedValue([mockTicket]);
      prisma.supportTicket.count.mockResolvedValue(1);

      const result = await service.getAllTickets(1, 20);

      expect(prisma.supportTicket.findMany).toHaveBeenCalledWith({
        include: {
          messages: { orderBy: { createdAt: 'desc' }, take: 1 },
          application: { select: { id: true } },
        },
        orderBy: { updatedAt: 'desc' },
        skip: 0,
        take: 20,
      });
      expect(prisma.supportTicket.count).toHaveBeenCalled();
      expect(result).toEqual({
        items: [mockTicket],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      });
    });

    it('should calculate skip correctly for page 2', async () => {
      prisma.supportTicket.findMany.mockResolvedValue([]);
      prisma.supportTicket.count.mockResolvedValue(25);

      const result = await service.getAllTickets(2, 10);

      expect(prisma.supportTicket.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 10, take: 10 }),
      );
      expect(result.totalPages).toEqual(3);
    });
  });
});
