import { Test, TestingModule } from '@nestjs/testing';
import { StudentDashboardController } from '../../src/students/dashboard.controller';
import { DashboardService } from '../../src/students/dashboard.service';
import { JwtAuthGuard } from '../../src/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../src/auth/guards/roles.guard';
import type { AuthenticatedRequest } from '../../src/common/types/request.type';

const mockDashboardService = {
  getOverview: jest.fn(),
  getActivity: jest.fn(),
  getNextSteps: jest.fn(),
};

const mockRequest = {
  user: { id: 'user-1', sub: 'user-1', email: 'test@test.com', role: 'STUDENT' },
} as AuthenticatedRequest;

describe('StudentDashboardController', () => {
  let controller: StudentDashboardController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentDashboardController],
      providers: [
        { provide: DashboardService, useValue: mockDashboardService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<StudentDashboardController>(StudentDashboardController);
  });

  describe('GET /student/dashboard/overview', () => {
    it('should return dashboard overview', async () => {
      const mockOverview = {
        profile: { studentId: 'student-1' },
        stage: { currentStage: 1 },
        documentStats: { total: 4, approved: 3, pending: 1, rejected: 0 },
        paymentStats: { totalPaid: 5000, pendingAmount: 0, totalPayments: 2 },
      };
      mockDashboardService.getOverview.mockResolvedValue(mockOverview);

      const result = await controller.getOverview(mockRequest);

      expect(mockDashboardService.getOverview).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(mockOverview);
    });
  });

  describe('GET /student/dashboard/activity', () => {
    it('should return activity data', async () => {
      const mockActivity = {
        recentEvents: [],
        unreadNotifications: 3,
        upcomingDeadlines: [],
      };
      mockDashboardService.getActivity.mockResolvedValue(mockActivity);

      const result = await controller.getActivity(mockRequest);

      expect(mockDashboardService.getActivity).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(mockActivity);
    });
  });

  describe('GET /student/dashboard/next-steps', () => {
    it('should return next steps', async () => {
      const mockNextSteps = {
        nextActions: [{ type: 'profile', title: 'Complete your profile', priority: 'high', completed: true }],
        completionPercentage: 50,
        pendingItems: ['Upload documents'],
      };
      mockDashboardService.getNextSteps.mockResolvedValue(mockNextSteps);

      const result = await controller.getNextSteps(mockRequest);

      expect(mockDashboardService.getNextSteps).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(mockNextSteps);
    });
  });
});
