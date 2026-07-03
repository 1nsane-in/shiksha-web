import { Test, TestingModule } from '@nestjs/testing';
import { TicketsController } from '../../src/tickets/tickets.controller';
import { TicketsService } from '../../src/tickets/tickets.service';
import {
  CreateTicketDto,
  AddTicketMessageDto,
  UpdateTicketStatusDto,
  AssignTicketDto,
} from '../../src/tickets/dto/ticket.dto';

const mockTicketsService = {
  createTicket: jest.fn(),
  getMyTickets: jest.fn(),
  getApplicationTickets: jest.fn(),
  getTicketById: jest.fn(),
  addMessage: jest.fn(),
  updateStatus: jest.fn(),
  assignTicket: jest.fn(),
  getAllTickets: jest.fn(),
};

describe('TicketsController', () => {
  let controller: TicketsController;
  let service: typeof mockTicketsService;

  const mockUser = { id: 'user-1', role: 'STUDENT' };
  const mockAdminUser = { id: 'admin-1', role: 'ADMIN' };
  const mockTicket = { id: 'ticket-1', subject: 'Need help' };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketsController],
      providers: [
        { provide: TicketsService, useValue: mockTicketsService },
      ],
    }).compile();

    controller = module.get<TicketsController>(TicketsController);
    service = mockTicketsService;
  });

  describe('POST /', () => {
    it('should call createTicket with user data', async () => {
      const dto: CreateTicketDto = {
        subject: 'Need help',
        description: 'Help me',
      };
      service.createTicket.mockResolvedValue(mockTicket);

      const result = await controller.create(dto, mockUser);

      expect(service.createTicket).toHaveBeenCalledWith(
        mockUser.id,
        mockUser.role,
        null,
        dto,
      );
      expect(result).toEqual(mockTicket);
    });
  });

  describe('GET my', () => {
    it('should call getMyTickets', async () => {
      service.getMyTickets.mockResolvedValue([mockTicket]);

      const result = await controller.getMy(mockUser);

      expect(service.getMyTickets).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual([mockTicket]);
    });
  });

  describe('GET application/:applicationId', () => {
    it('should call getApplicationTickets', async () => {
      service.getApplicationTickets.mockResolvedValue([mockTicket]);

      const result = await controller.getByApplication('app-1', mockUser);

      expect(service.getApplicationTickets).toHaveBeenCalledWith(
        'app-1',
        mockUser.id,
        mockUser.role,
      );
      expect(result).toEqual([mockTicket]);
    });
  });

  describe('GET :id', () => {
    it('should call getTicketById', async () => {
      service.getTicketById.mockResolvedValue(mockTicket);

      const result = await controller.getById('ticket-1', mockUser);

      expect(service.getTicketById).toHaveBeenCalledWith(
        'ticket-1',
        mockUser.id,
        mockUser.role,
      );
      expect(result).toEqual(mockTicket);
    });
  });

  describe('POST :id/messages', () => {
    it('should call addMessage', async () => {
      const dto: AddTicketMessageDto = { content: 'Reply' };
      service.addMessage.mockResolvedValue({ id: 'msg-1' });

      const result = await controller.addMessage('ticket-1', dto, mockUser);

      expect(service.addMessage).toHaveBeenCalledWith(
        'ticket-1',
        mockUser.id,
        mockUser.role,
        null,
        dto,
      );
      expect(result).toEqual({ id: 'msg-1' });
    });
  });

  describe('PATCH :id/status', () => {
    it('should call updateStatus with ADMIN role', async () => {
      const dto: UpdateTicketStatusDto = { status: 'RESOLVED' };
      const updated = { ...mockTicket, status: 'RESOLVED' };
      service.updateStatus.mockResolvedValue(updated);

      const result = await controller.updateStatus('ticket-1', dto);

      expect(service.updateStatus).toHaveBeenCalledWith('ticket-1', dto, 'ADMIN');
      expect(result).toEqual(updated);
    });
  });

  describe('PATCH :id/assign', () => {
    it('should call assignTicket', async () => {
      const dto: AssignTicketDto = { assignedTo: 'admin-2' };
      const assigned = { ...mockTicket, assignedTo: 'admin-2' };
      service.assignTicket.mockResolvedValue(assigned);

      const result = await controller.assign('ticket-1', dto);

      expect(service.assignTicket).toHaveBeenCalledWith('ticket-1', dto);
      expect(result).toEqual(assigned);
    });
  });

  describe('GET admin/all', () => {
    it('should call getAllTickets with page and limit', async () => {
      const paginated = {
        items: [mockTicket],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      };
      service.getAllTickets.mockResolvedValue(paginated);

      const result = await controller.getAll('1', '20');

      expect(service.getAllTickets).toHaveBeenCalledWith(1, 20);
      expect(result).toEqual(paginated);
    });

    it('should default to page 1, limit 20 when no query params', async () => {
      service.getAllTickets.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0 });

      await controller.getAll(undefined, undefined);

      expect(service.getAllTickets).toHaveBeenCalledWith(1, 20);
    });
  });
});
