import { Test, TestingModule } from '@nestjs/testing';
import { ConsultationController } from '../../src/consultation/consultation.controller';
import { ConsultationService } from '../../src/consultation/consultation.service';
import { RolesGuard } from '../../src/auth/guards/roles.guard';

const mockConsultationService = {
  create: jest.fn(),
  getAll: jest.fn(),
  getOne: jest.fn(),
  updateStatus: jest.fn(),
  delete: jest.fn(),
};

describe('ConsultationController', () => {
  let controller: ConsultationController;
  let service: typeof mockConsultationService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsultationController],
      providers: [
        {
          provide: ConsultationService,
          useValue: mockConsultationService,
        },
      ],
    })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<ConsultationController>(ConsultationController);
    service = mockConsultationService;
  });

  describe('POST /consultations (public)', () => {
    it('should create a consultation', async () => {
      const dto = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+911234567890',
        neetScore: 650,
        state: 'Karnataka',
        country: 'India',
      };
      service.create.mockResolvedValue({ id: 'con-1', ...dto });

      const result = await controller.createConsultation(dto as any);

      expect(result).toEqual({ id: 'con-1', ...dto });
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('GET /consultations (admin)', () => {
    it('should return all consultations', async () => {
      service.getAll.mockResolvedValue([{ id: 'con-1' }]);

      const result = await controller.getConsultations();

      expect(result).toEqual([{ id: 'con-1' }]);
      expect(service.getAll).toHaveBeenCalled();
    });
  });

  describe('GET /consultations/:id (admin)', () => {
    it('should return consultation by id', async () => {
      service.getOne.mockResolvedValue({ id: 'con-1' });

      const result = await controller.getConsultation('con-1');

      expect(result).toEqual({ id: 'con-1' });
      expect(service.getOne).toHaveBeenCalledWith('con-1');
    });
  });

  describe('PUT /consultations/:id/status (admin)', () => {
    it('should update status', async () => {
      service.updateStatus.mockResolvedValue({
        id: 'con-1',
        status: 'CONTACTED',
      });

      const result = await controller.updateStatus('con-1', 'CONTACTED');

      expect(result).toEqual({ id: 'con-1', status: 'CONTACTED' });
      expect(service.updateStatus).toHaveBeenCalledWith('con-1', 'CONTACTED');
    });
  });

  describe('DELETE /consultations/:id (admin)', () => {
    it('should delete a consultation', async () => {
      service.delete.mockResolvedValue({ id: 'con-1' });

      const result = await controller.deleteConsultation('con-1');

      expect(result).toEqual({ id: 'con-1' });
      expect(service.delete).toHaveBeenCalledWith('con-1');
    });
  });
});
