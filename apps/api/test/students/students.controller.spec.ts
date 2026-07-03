import { Test, TestingModule } from '@nestjs/testing';
import { StudentController, AdminStudentsController } from '../../src/students/students.controller';
import { StudentsService } from '../../src/students/students.service';
import { JwtAuthGuard } from '../../src/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../src/auth/guards/roles.guard';
import type { AuthenticatedRequest } from '../../src/common/types/request.type';

const mockStudentsService = {
  getProfile: jest.fn(),
  updateProfile: jest.fn(),
  getStageInfo: jest.fn(),
  submitApplication: jest.fn(),
  getMyApplications: jest.fn(),
  getMyApplicationById: jest.fn(),
  checkApplication: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  adminUpdate: jest.fn(),
  updateStage: jest.fn(),
  assignUniversity: jest.fn(),
  getStats: jest.fn(),
};

const mockRequest = {
  user: { id: 'user-1', sub: 'user-1', email: 'test@test.com', role: 'STUDENT' },
} as AuthenticatedRequest;

describe('StudentController', () => {
  let controller: StudentController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentController],
      providers: [
        { provide: StudentsService, useValue: mockStudentsService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<StudentController>(StudentController);
  });

  describe('GET /student/profile', () => {
    it('should return student profile', async () => {
      const mockProfile = { id: 'student-1', userId: 'user-1' };
      mockStudentsService.getProfile.mockResolvedValue(mockProfile);

      const result = await controller.getProfile(mockRequest);

      expect(mockStudentsService.getProfile).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(mockProfile);
    });
  });

  describe('PUT /student/profile', () => {
    it('should update student profile', async () => {
      const dto = { fatherName: 'New Father' };
      mockStudentsService.updateProfile.mockResolvedValue({ ...dto, id: 'student-1' });

      const result = await controller.updateProfile(mockRequest, dto);

      expect(mockStudentsService.updateProfile).toHaveBeenCalledWith('user-1', dto);
      expect(result).toEqual({ ...dto, id: 'student-1' });
    });
  });

  describe('PUT /student/profile/academic', () => {
    it('should update academic info', async () => {
      const dto = { neetScore: 700 };
      mockStudentsService.updateProfile.mockResolvedValue({ ...dto, id: 'student-1' });

      const result = await controller.updateAcademic(mockRequest, dto);

      expect(mockStudentsService.updateProfile).toHaveBeenCalledWith('user-1', dto);
      expect(result).toEqual({ ...dto, id: 'student-1' });
    });
  });

  describe('GET /student/stage', () => {
    it('should return stage info', async () => {
      const mockStage = { currentStage: 1, applicationStatus: 'STAGE_1_PENDING' };
      mockStudentsService.getStageInfo.mockResolvedValue(mockStage);

      const result = await controller.getStageInfo(mockRequest);

      expect(mockStudentsService.getStageInfo).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(mockStage);
    });
  });

  describe('POST /student/apply', () => {
    it('should submit application', async () => {
      const dto = { universityId: 'uni-1', firstName: 'John', lastName: 'Doe' };
      mockStudentsService.submitApplication.mockResolvedValue({
        message: 'Application submitted successfully',
        applicationId: 'app-1',
      });

      const result = await controller.submitApplication(mockRequest, dto as any);

      expect(mockStudentsService.submitApplication).toHaveBeenCalledWith('user-1', dto);
      expect(result).toEqual({ message: 'Application submitted successfully', applicationId: 'app-1' });
    });
  });

  describe('GET /student/applications', () => {
    it('should return applications with default pagination', async () => {
      const mockResult = { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } };
      mockStudentsService.getMyApplications.mockResolvedValue(mockResult);

      const result = await controller.getMyApplications(mockRequest, undefined, undefined);

      expect(mockStudentsService.getMyApplications).toHaveBeenCalledWith('user-1', 1, 10);
      expect(result).toEqual(mockResult);
    });

    it('should parse pagination params', async () => {
      await controller.getMyApplications(mockRequest, '2', '20');

      expect(mockStudentsService.getMyApplications).toHaveBeenCalledWith('user-1', 2, 20);
    });
  });

  describe('GET /student/applications/check/:universityId', () => {
    it('should check application status', async () => {
      mockStudentsService.checkApplication.mockResolvedValue({ applied: false });

      const result = await controller.checkApplication(mockRequest, 'uni-1');

      expect(mockStudentsService.checkApplication).toHaveBeenCalledWith('user-1', 'uni-1');
      expect(result).toEqual({ applied: false });
    });
  });

  describe('GET /student/applications/:id', () => {
    it('should return application by id', async () => {
      mockStudentsService.getMyApplicationById.mockResolvedValue({ id: 'app-1' });

      const result = await controller.getMyApplicationById(mockRequest, 'app-1');

      expect(mockStudentsService.getMyApplicationById).toHaveBeenCalledWith('user-1', 'app-1');
      expect(result).toEqual({ id: 'app-1' });
    });
  });
});

describe('AdminStudentsController', () => {
  let controller: AdminStudentsController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminStudentsController],
      providers: [
        { provide: StudentsService, useValue: mockStudentsService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<AdminStudentsController>(AdminStudentsController);
  });

  describe('GET /admin/students', () => {
    it('should return paginated students with defaults', async () => {
      const mockResult = { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } };
      mockStudentsService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll(undefined, undefined, undefined, undefined, undefined);

      expect(mockStudentsService.findAll).toHaveBeenCalledWith(1, 10, undefined, undefined, undefined);
      expect(result).toEqual(mockResult);
    });

    it('should parse query params', async () => {
      await controller.findAll('2', '20', 'APPROVED', '3', 'id,user.name');

      expect(mockStudentsService.findAll).toHaveBeenCalledWith(2, 20, 'APPROVED', 3, 'id,user.name');
    });
  });

  describe('GET /admin/students/stats', () => {
    it('should return stats', async () => {
      const mockStats = { total: 10, byStage: { 1: 5 }, byStatus: { APPROVED: 5 } };
      mockStudentsService.getStats.mockResolvedValue(mockStats);

      const result = await controller.getStats();

      expect(mockStudentsService.getStats).toHaveBeenCalled();
      expect(result).toEqual(mockStats);
    });
  });

  describe('GET /admin/students/:id', () => {
    it('should return student by id', async () => {
      mockStudentsService.findOne.mockResolvedValue({ id: 'student-1' });

      const result = await controller.findOne('student-1', undefined);

      expect(mockStudentsService.findOne).toHaveBeenCalledWith('student-1', undefined);
      expect(result).toEqual({ id: 'student-1' });
    });

    it('should pass fields param', async () => {
      await controller.findOne('student-1', 'id,user.name');

      expect(mockStudentsService.findOne).toHaveBeenCalledWith('student-1', 'id,user.name');
    });
  });

  describe('PUT /admin/students/:id', () => {
    it('should update student', async () => {
      const dto = { currentStage: 2 };
      mockStudentsService.adminUpdate.mockResolvedValue({ id: 'student-1', currentStage: 2 });

      const result = await controller.update('student-1', dto);

      expect(mockStudentsService.adminUpdate).toHaveBeenCalledWith('student-1', dto);
      expect(result).toEqual({ id: 'student-1', currentStage: 2 });
    });
  });

  describe('PUT /admin/students/:id/stage', () => {
    it('should update stage', async () => {
      mockStudentsService.updateStage.mockResolvedValue({ id: 'student-1', currentStage: 3 });

      const result = await controller.updateStage('student-1', 3, 'STAGE_3_ACTIVE');

      expect(mockStudentsService.updateStage).toHaveBeenCalledWith('student-1', 3, 'STAGE_3_ACTIVE');
      expect(result).toEqual({ id: 'student-1', currentStage: 3 });
    });

    it('should update stage without status', async () => {
      mockStudentsService.updateStage.mockResolvedValue({ id: 'student-1', currentStage: 2 });

      const result = await controller.updateStage('student-1', 2, undefined);

      expect(mockStudentsService.updateStage).toHaveBeenCalledWith('student-1', 2, undefined);
      expect(result).toEqual({ id: 'student-1', currentStage: 2 });
    });
  });

  describe('POST /admin/students/:id/assign-university', () => {
    it('should assign university', async () => {
      const dto = { courseId: 'course-1' };
      mockStudentsService.assignUniversity.mockResolvedValue({
        message: 'University assigned successfully',
        application: { id: 'app-1' },
        university: { id: 'uni-1', name: 'Test Uni' },
        course: { id: 'course-1' },
      });

      const result = await controller.assignUniversity('student-1', dto);

      expect(mockStudentsService.assignUniversity).toHaveBeenCalledWith('student-1', dto);
      expect(result).toEqual({
        message: 'University assigned successfully',
        application: { id: 'app-1' },
        university: { id: 'uni-1', name: 'Test Uni' },
        course: { id: 'course-1' },
      });
    });
  });
});
