import { Test, TestingModule } from '@nestjs/testing';
import {
  AdminUniversitiesController,
  UniversitiesController,
} from '../../src/universities/universities.controller';
import { UniversitiesService } from '../../src/universities/universities.service';
import { JwtAuthGuard } from '../../src/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../src/auth/guards/roles.guard';
import { NotFoundException } from '@nestjs/common';
import { UniversityStatus } from '../../src/universities/universities.dto';

const mockUniversitiesService = {
  findAll: jest.fn(),
  findAllAdmin: jest.fn(),
  findOne: jest.fn(),
  findOneAdmin: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  updateStatus: jest.fn(),
  uploadDocument: jest.fn(),
  getDocuments: jest.fn(),
  deleteDocument: jest.fn(),
  addCourse: jest.fn(),
  updateCourse: jest.fn(),
  deleteCourse: jest.fn(),
  getCountries: jest.fn(),
  getSignedBrochureUrl: jest.fn(),
  getStatistics: jest.fn(),
};

function createTestModule(controller: any) {
  return Test.createTestingModule({
    controllers: [controller],
    providers: [
      { provide: UniversitiesService, useValue: mockUniversitiesService },
    ],
  })
    .overrideGuard(JwtAuthGuard)
    .useValue({ canActivate: jest.fn(() => true) })
    .overrideGuard(RolesGuard)
    .useValue({ canActivate: jest.fn(() => true) });
}

describe('AdminUniversitiesController', () => {
  let controller: AdminUniversitiesController;
  let service: typeof mockUniversitiesService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await createTestModule(
      AdminUniversitiesController,
    ).compile();

    controller = module.get<AdminUniversitiesController>(
      AdminUniversitiesController,
    );
    service = mockUniversitiesService;
  });

  describe('GET /admin/universities', () => {
    it('should return all universities', async () => {
      const result = { data: [{ id: 'uni-1' }], meta: {} };
      service.findAllAdmin.mockResolvedValue(result);

      const res = await controller.findAll({ page: '1', limit: '10' } as any);

      expect(res).toEqual(result);
      expect(service.findAllAdmin).toHaveBeenCalledWith({ page: '1', limit: '10' });
    });
  });

  describe('GET /admin/universities/statistics', () => {
    it('should return statistics', async () => {
      const stats = { total: 10, active: 5 };
      service.getStatistics.mockResolvedValue(stats);

      const res = await controller.getStatistics();

      expect(res).toEqual(stats);
      expect(service.getStatistics).toHaveBeenCalled();
    });
  });

  describe('GET /admin/universities/countries', () => {
    it('should return countries', async () => {
      service.getCountries.mockResolvedValue(['India', 'Russia']);

      const res = await controller.getCountries();

      expect(res).toEqual(['India', 'Russia']);
      expect(service.getCountries).toHaveBeenCalled();
    });
  });

  describe('GET /admin/universities/:id', () => {
    it('should return university by id', async () => {
      service.findOneAdmin.mockResolvedValue({ id: 'uni-1' });

      const res = await controller.findOne('uni-1');

      expect(res).toEqual({ id: 'uni-1' });
      expect(service.findOneAdmin).toHaveBeenCalledWith('uni-1');
    });
  });

  describe('POST /admin/universities', () => {
    it('should create a university', async () => {
      const dto = { name: 'New University' };
      service.create.mockResolvedValue({ id: 'uni-1', ...dto });

      const res = await controller.create(dto as any);

      expect(res).toEqual({ id: 'uni-1', ...dto });
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('PUT /admin/universities/:id', () => {
    it('should update a university', async () => {
      const dto = { name: 'Updated' };
      service.update.mockResolvedValue({ id: 'uni-1', ...dto });

      const res = await controller.update('uni-1', dto as any);

      expect(res).toEqual({ id: 'uni-1', ...dto });
      expect(service.update).toHaveBeenCalledWith('uni-1', dto);
    });
  });

  describe('PATCH /admin/universities/:id/status', () => {
    it('should update status', async () => {
      service.updateStatus.mockResolvedValue({ id: 'uni-1', status: UniversityStatus.ACTIVE });

      const res = await controller.updateStatus('uni-1', UniversityStatus.ACTIVE);

      expect(res).toEqual({ id: 'uni-1', status: UniversityStatus.ACTIVE });
      expect(service.updateStatus).toHaveBeenCalledWith('uni-1', UniversityStatus.ACTIVE);
    });
  });

  describe('DELETE /admin/universities/:id', () => {
    it('should delete a university', async () => {
      service.delete.mockResolvedValue({ message: 'Deleted' });

      const res = await controller.delete('uni-1');

      expect(res).toEqual({ message: 'Deleted' });
      expect(service.delete).toHaveBeenCalledWith('uni-1');
    });
  });

  describe('POST /admin/universities/:id/documents', () => {
    it('should upload a document', async () => {
      const dto = { type: 'BROCHURE', fileUrl: 'https://r2.example.com/doc.pdf', fileName: 'doc.pdf', fileSize: 1024 };
      service.uploadDocument.mockResolvedValue({ id: 'doc-1', ...dto });

      const res = await controller.uploadDocument('uni-1', dto);

      expect(res).toEqual({ id: 'doc-1', ...dto });
      expect(service.uploadDocument).toHaveBeenCalledWith('uni-1', dto);
    });
  });

  describe('GET /admin/universities/:id/documents', () => {
    it('should return documents', async () => {
      service.getDocuments.mockResolvedValue([{ id: 'doc-1' }]);

      const res = await controller.getDocuments('uni-1');

      expect(res).toEqual([{ id: 'doc-1' }]);
      expect(service.getDocuments).toHaveBeenCalledWith('uni-1');
    });
  });

  describe('DELETE /admin/universities/documents/:documentId', () => {
    it('should delete a document', async () => {
      service.deleteDocument.mockResolvedValue({ message: 'Deleted' });

      const res = await controller.deleteDocument('doc-1');

      expect(res).toEqual({ message: 'Deleted' });
      expect(service.deleteDocument).toHaveBeenCalledWith('doc-1');
    });
  });

  describe('POST /admin/universities/:id/courses', () => {
    it('should add a course', async () => {
      const dto = { name: 'MBBS', duration: '5 years' };
      service.addCourse.mockResolvedValue({ id: 'course-1', ...dto });

      const res = await controller.addCourse('uni-1', dto as any);

      expect(res).toEqual({ id: 'course-1', ...dto });
      expect(service.addCourse).toHaveBeenCalledWith('uni-1', dto);
    });
  });

  describe('PUT /admin/universities/courses/:courseId', () => {
    it('should update a course', async () => {
      const dto = { fees: 60000 };
      service.updateCourse.mockResolvedValue({ id: 'course-1', ...dto });

      const res = await controller.updateCourse('course-1', dto as any);

      expect(res).toEqual({ id: 'course-1', ...dto });
      expect(service.updateCourse).toHaveBeenCalledWith('course-1', dto);
    });
  });

  describe('DELETE /admin/universities/courses/:courseId', () => {
    it('should delete a course', async () => {
      service.deleteCourse.mockResolvedValue({ message: 'Deleted' });

      const res = await controller.deleteCourse('course-1');

      expect(res).toEqual({ message: 'Deleted' });
      expect(service.deleteCourse).toHaveBeenCalledWith('course-1');
    });
  });
});

describe('UniversitiesController (Public)', () => {
  let controller: UniversitiesController;
  let service: typeof mockUniversitiesService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await createTestModule(
      UniversitiesController,
    ).compile();

    controller = module.get<UniversitiesController>(UniversitiesController);
    service = mockUniversitiesService;
  });

  describe('GET /universities', () => {
    it('should return active universities with ACTIVE status filter', async () => {
      const result = { data: [{ id: 'uni-1' }], meta: {} };
      service.findAll.mockResolvedValue(result);

      const query = { page: '1', limit: '10' } as any;
      const res = await controller.findAll(query);

      expect(res).toEqual(result);
      expect(service.findAll).toHaveBeenCalledWith({
        ...query,
        status: UniversityStatus.ACTIVE,
      });
    });
  });

  describe('GET /universities/countries', () => {
    it('should return countries', async () => {
      service.getCountries.mockResolvedValue(['India']);

      const res = await controller.getCountries();

      expect(res).toEqual(['India']);
      expect(service.getCountries).toHaveBeenCalled();
    });
  });

  describe('GET /universities/:identifier/brochure', () => {
    it('should return signed brochure URL', async () => {
      service.getSignedBrochureUrl.mockResolvedValue({
        url: 'https://signed.r2.dev/brochure.pdf',
        expiresIn: 900,
      });

      const res = await controller.getBrochureUrl('uni-1');

      expect(res).toEqual({ url: 'https://signed.r2.dev/brochure.pdf', expiresIn: 900 });
      expect(service.getSignedBrochureUrl).toHaveBeenCalledWith('uni-1');
    });
  });

  describe('GET /universities/:identifier', () => {
    it('should return active university details', async () => {
      service.findOne.mockResolvedValue({
        id: 'uni-1',
        status: UniversityStatus.ACTIVE,
      });

      const res = await controller.findOne('uni-1');

      expect(res).toEqual({ id: 'uni-1', status: UniversityStatus.ACTIVE });
      expect(service.findOne).toHaveBeenCalledWith('uni-1');
    });

    it('should throw NotFoundException when university is not active', async () => {
      service.findOne.mockResolvedValue({
        id: 'uni-1',
        status: UniversityStatus.DRAFT,
      });

      await expect(controller.findOne('uni-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
