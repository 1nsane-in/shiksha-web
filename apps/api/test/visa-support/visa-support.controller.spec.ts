import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { VisaSupportController } from '../../src/visa-support/visa-support.controller';
import { VisaSupportService } from '../../src/visa-support/visa-support.service';

const mockVisaService = {
  createVisaCenter: jest.fn(),
  getAllVisaCenters: jest.fn(),
  getVisaCenter: jest.fn(),
  updateVisaCenter: jest.fn(),
  deleteVisaCenter: jest.fn(),
  createVisaChecklist: jest.fn(),
  getAllVisaChecklists: jest.fn(),
  getVisaChecklist: jest.fn(),
  updateVisaChecklist: jest.fn(),
  deleteVisaChecklist: jest.fn(),
  createVisaApplication: jest.fn(),
  getStudentVisaApplications: jest.fn(),
  getAllVisaApplications: jest.fn(),
  getVisaApplication: jest.fn(),
  updateVisaApplication: jest.fn(),
  submitVisaApplication: jest.fn(),
  decideVisaApplication: jest.fn(),
  getVisaCountries: jest.fn(),
};

describe('VisaSupportController', () => {
  let controller: VisaSupportController;
  let service: typeof mockVisaService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [VisaSupportController],
      providers: [
        { provide: VisaSupportService, useValue: mockVisaService },
        { provide: JwtService, useValue: { verifyAsync: jest.fn() } },
        { provide: ConfigService, useValue: { get: jest.fn() } },
        Reflector,
      ],
    }).compile();

    controller = module.get<VisaSupportController>(VisaSupportController);
    service = mockVisaService;
  });

  // ===== Centers ===== //
  describe('POST /centers', () => {
    it('should create a visa center', async () => {
      const dto = { name: 'Center', city: 'Mumbai', country: 'India' };
      service.createVisaCenter.mockResolvedValue({ id: 'c-1', ...dto });

      const result = await controller.createCenter(dto);

      expect(service.createVisaCenter).toHaveBeenCalledWith(dto);
      expect(result.id).toBe('c-1');
    });
  });

  describe('GET /centers', () => {
    it('should return all centers', async () => {
      service.getAllVisaCenters.mockResolvedValue([{ id: 'c-1' }]);

      const result = await controller.getAllCenters();

      expect(service.getAllVisaCenters).toHaveBeenCalled();
      expect(result).toEqual([{ id: 'c-1' }]);
    });
  });

  describe('GET /centers/:id', () => {
    it('should return a center by id', async () => {
      service.getVisaCenter.mockResolvedValue({ id: 'c-1' });

      const result = await controller.getCenter('c-1');

      expect(service.getVisaCenter).toHaveBeenCalledWith('c-1');
      expect(result.id).toBe('c-1');
    });
  });

  describe('PATCH /centers/:id', () => {
    it('should update a center', async () => {
      service.updateVisaCenter.mockResolvedValue({ id: 'c-1', name: 'Updated' });

      const result = await controller.updateCenter('c-1', { name: 'Updated' });

      expect(service.updateVisaCenter).toHaveBeenCalledWith('c-1', { name: 'Updated' });
      expect(result.name).toBe('Updated');
    });
  });

  describe('DELETE /centers/:id', () => {
    it('should delete a center', async () => {
      service.deleteVisaCenter.mockResolvedValue({ id: 'c-1' });

      const result = await controller.deleteCenter('c-1');

      expect(service.deleteVisaCenter).toHaveBeenCalledWith('c-1');
      expect(result.id).toBe('c-1');
    });
  });

  // ===== Checklists ===== //
  describe('POST /checklists', () => {
    it('should create a checklist', async () => {
      const dto = { country: 'India', title: 'Docs', documents: ['Passport'] };
      service.createVisaChecklist.mockResolvedValue({ id: 'cl-1', ...dto });

      const result = await controller.createChecklist(dto);

      expect(service.createVisaChecklist).toHaveBeenCalledWith(dto);
      expect(result.id).toBe('cl-1');
    });
  });

  describe('GET /checklists', () => {
    it('should return checklists without country filter', async () => {
      service.getAllVisaChecklists.mockResolvedValue([{ id: 'cl-1' }]);

      const result = await controller.getAllChecklists(undefined);

      expect(service.getAllVisaChecklists).toHaveBeenCalledWith(undefined);
      expect(result).toEqual([{ id: 'cl-1' }]);
    });

    it('should return checklists with country filter', async () => {
      service.getAllVisaChecklists.mockResolvedValue([{ id: 'cl-1', country: 'India' }]);

      const result = await controller.getAllChecklists('India');

      expect(service.getAllVisaChecklists).toHaveBeenCalledWith('India');
      expect(result).toHaveLength(1);
    });
  });

  describe('GET /checklists/:id', () => {
    it('should return a checklist by id', async () => {
      service.getVisaChecklist.mockResolvedValue({ id: 'cl-1' });

      const result = await controller.getChecklist('cl-1');

      expect(service.getVisaChecklist).toHaveBeenCalledWith('cl-1');
    });
  });

  describe('PATCH /checklists/:id', () => {
    it('should update a checklist', async () => {
      service.updateVisaChecklist.mockResolvedValue({ id: 'cl-1', title: 'Updated' });

      const result = await controller.updateChecklist('cl-1', { title: 'Updated' });

      expect(service.updateVisaChecklist).toHaveBeenCalledWith('cl-1', { title: 'Updated' });
    });
  });

  describe('DELETE /checklists/:id', () => {
    it('should delete a checklist', async () => {
      service.deleteVisaChecklist.mockResolvedValue({ id: 'cl-1' });

      await controller.deleteChecklist('cl-1');

      expect(service.deleteVisaChecklist).toHaveBeenCalledWith('cl-1');
    });
  });

  // ===== Applications ===== //
  describe('POST /applications', () => {
    it('should create an application', async () => {
      const dto = { studentId: 'stu-1' };
      service.createVisaApplication.mockResolvedValue({ id: 'va-1', ...dto });

      const result = await controller.createApplication(dto);

      expect(service.createVisaApplication).toHaveBeenCalledWith(dto);
      expect(result.id).toBe('va-1');
    });
  });

  describe('GET /applications/my', () => {
    it('should return student applications', async () => {
      service.getStudentVisaApplications.mockResolvedValue([{ id: 'va-1' }]);

      const result = await controller.getMyApplications('user-1');

      expect(service.getStudentVisaApplications).toHaveBeenCalledWith('user-1');
      expect(result).toEqual([{ id: 'va-1' }]);
    });
  });

  describe('GET /applications/admin/all', () => {
    it('should return all applications with status filter', async () => {
      service.getAllVisaApplications.mockResolvedValue([{ id: 'va-1', status: 'SUBMITTED' }]);

      const result = await controller.getAllApplications('SUBMITTED');

      expect(service.getAllVisaApplications).toHaveBeenCalledWith('SUBMITTED');
      expect(result).toHaveLength(1);
    });
  });

  describe('GET /applications/:id', () => {
    it('should return an application by id', async () => {
      service.getVisaApplication.mockResolvedValue({ id: 'va-1' });

      const result = await controller.getApplication('va-1');

      expect(service.getVisaApplication).toHaveBeenCalledWith('va-1');
    });
  });

  describe('PATCH /applications/:id', () => {
    it('should update an application', async () => {
      service.updateVisaApplication.mockResolvedValue({ id: 'va-1', passportNumber: 'P999' });

      await controller.updateApplication('va-1', { passportNumber: 'P999' });

      expect(service.updateVisaApplication).toHaveBeenCalledWith('va-1', { passportNumber: 'P999' });
    });
  });

  describe('POST /applications/:id/submit', () => {
    it('should submit an application', async () => {
      service.submitVisaApplication.mockResolvedValue({ id: 'va-1', status: 'SUBMITTED' });

      const result = await controller.submitApplication('va-1');

      expect(service.submitVisaApplication).toHaveBeenCalledWith('va-1');
      expect(result.status).toBe('SUBMITTED');
    });
  });

  describe('POST /applications/:id/decide', () => {
    it('should decide an application', async () => {
      const dto = { decision: 'APPROVED' as const, remarks: 'Approved' };
      service.decideVisaApplication.mockResolvedValue({ id: 'va-1', status: 'APPROVED' });

      const result = await controller.decideApplication('va-1', dto, 'admin-1');

      expect(service.decideVisaApplication).toHaveBeenCalledWith('va-1', 'APPROVED', 'admin-1', 'Approved');
      expect(result.status).toBe('APPROVED');
    });
  });

  describe('GET /countries', () => {
    it('should return countries', async () => {
      service.getVisaCountries.mockResolvedValue(['India', 'USA']);

      const result = await controller.getCountries();

      expect(service.getVisaCountries).toHaveBeenCalled();
      expect(result).toEqual(['India', 'USA']);
    });
  });
});
