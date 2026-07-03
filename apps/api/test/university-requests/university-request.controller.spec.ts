import { Test, TestingModule } from '@nestjs/testing';
import { UniversityRequestController } from '../../src/university-requests/university-request.controller';
import { UniversityRequestService } from '../../src/university-requests/university-request.service';
import { JwtAuthGuard } from '../../src/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../src/auth/guards/roles.guard';

enum UniversityRequestStatus {
  PENDING = 'PENDING',
}

const mockService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  getStats: jest.fn(),
};

describe('UniversityRequestController', () => {
  let controller: UniversityRequestController;
  let service: typeof mockService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UniversityRequestController],
      providers: [
        { provide: UniversityRequestService, useValue: mockService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<UniversityRequestController>(
      UniversityRequestController,
    );
    service = mockService;
  });

  describe('POST /university-requests (public)', () => {
    it('should create a request', async () => {
      const dto = {
        universityName: 'Test University',
        country: 'India',
        type: 'GOVERNMENT',
        programs: ['MBBS'],
        contactEmail: 'admin@test.edu',
        contactPhone: '+911234567890',
      };
      service.create.mockResolvedValue({ id: 'req-1', ...dto });

      const result = await controller.create(dto as any);

      expect(result).toEqual({ id: 'req-1', ...dto });
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('GET /university-requests (admin)', () => {
    it('should return all requests without status filter', async () => {
      service.findAll.mockResolvedValue([{ id: 'req-1' }]);

      const result = await controller.findAll();

      expect(result).toEqual([{ id: 'req-1' }]);
      expect(service.findAll).toHaveBeenCalledWith(undefined);
    });

    it('should filter by status when provided', async () => {
      service.findAll.mockResolvedValue([{ id: 'req-1' }]);

      const result = await controller.findAll(UniversityRequestStatus.PENDING);

      expect(result).toEqual([{ id: 'req-1' }]);
      expect(service.findAll).toHaveBeenCalledWith(UniversityRequestStatus.PENDING);
    });
  });

  describe('GET /university-requests/stats (admin)', () => {
    it('should return stats', async () => {
      const stats = { total: 10, pending: 4 };
      service.getStats.mockResolvedValue(stats);

      const result = await controller.getStats();

      expect(result).toEqual(stats);
      expect(service.getStats).toHaveBeenCalled();
    });
  });

  describe('GET /university-requests/:id (admin)', () => {
    it('should return a request by id', async () => {
      service.findOne.mockResolvedValue({ id: 'req-1' });

      const result = await controller.findOne('req-1');

      expect(result).toEqual({ id: 'req-1' });
      expect(service.findOne).toHaveBeenCalledWith('req-1');
    });
  });

  describe('PATCH /university-requests/:id (admin)', () => {
    it('should update a request', async () => {
      const dto = { status: UniversityRequestStatus.PENDING };
      service.update.mockResolvedValue({ id: 'req-1', ...dto });

      const result = await controller.update('req-1', dto as any);

      expect(result).toEqual({ id: 'req-1', ...dto });
      expect(service.update).toHaveBeenCalledWith('req-1', dto);
    });
  });

  describe('DELETE /university-requests/:id (admin)', () => {
    it('should delete a request', async () => {
      service.remove.mockResolvedValue({ id: 'req-1' });

      const result = await controller.remove('req-1');

      expect(result).toEqual({ id: 'req-1' });
      expect(service.remove).toHaveBeenCalledWith('req-1');
    });
  });
});
