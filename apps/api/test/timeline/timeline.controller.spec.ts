import { Test, TestingModule } from '@nestjs/testing';
import { TimelineController } from '../../src/modules/timeline/timeline.controller';
import { TimelineService } from '../../src/common/services/timeline.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

const mockPrisma = {
  student: {
    findUnique: jest.fn(),
  },
  universityApplication: {
    findUnique: jest.fn(),
  },
};

const mockTimelineService = {
  getApplicationTimeline: jest.fn(),
  getStudentTimeline: jest.fn(),
};

describe('TimelineController', () => {
  let controller: TimelineController;
  let prisma: typeof mockPrisma;
  let timelineService: typeof mockTimelineService;

  const mockAdminUser = { id: 'admin-1', role: 'ADMIN' };
  const mockStudentUser = { id: 'user-1', role: 'STUDENT' };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimelineController],
      providers: [
        { provide: TimelineService, useValue: mockTimelineService },
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    controller = module.get<TimelineController>(TimelineController);
    prisma = mockPrisma;
    timelineService = mockTimelineService;
  });

  describe('GET /application/:applicationId', () => {
    it('should allow admin to view any application timeline', async () => {
      timelineService.getApplicationTimeline.mockResolvedValue([{ id: 'evt-1' }]);

      const result = await controller.getApplicationTimeline('app-1', mockAdminUser);

      expect(prisma.student.findUnique).not.toHaveBeenCalled();
      expect(prisma.universityApplication.findUnique).not.toHaveBeenCalled();
      expect(timelineService.getApplicationTimeline).toHaveBeenCalledWith('app-1');
      expect(result).toEqual([{ id: 'evt-1' }]);
    });

    it('should allow SUPER_ADMIN to view any application timeline', async () => {
      const superAdmin = { id: 'super-1', role: 'SUPER_ADMIN' };
      timelineService.getApplicationTimeline.mockResolvedValue([]);

      const result = await controller.getApplicationTimeline('app-1', superAdmin);

      expect(timelineService.getApplicationTimeline).toHaveBeenCalledWith('app-1');
      expect(result).toEqual([]);
    });

    it('should allow student to view their own application timeline', async () => {
      prisma.student.findUnique.mockResolvedValue({ id: 'stu-1' });
      prisma.universityApplication.findUnique.mockResolvedValue({ studentId: 'stu-1' });
      timelineService.getApplicationTimeline.mockResolvedValue([{ id: 'evt-1' }]);

      const result = await controller.getApplicationTimeline('app-1', mockStudentUser);

      expect(prisma.student.findUnique).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        select: { id: true },
      });
      expect(prisma.universityApplication.findUnique).toHaveBeenCalledWith({
        where: { id: 'app-1' },
        select: { studentId: true },
      });
      expect(result).toEqual([{ id: 'evt-1' }]);
    });

    it('should throw NotFoundException when student profile not found', async () => {
      prisma.student.findUnique.mockResolvedValue(null);

      await expect(
        controller.getApplicationTimeline('app-1', mockStudentUser),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when application does not belong to student', async () => {
      prisma.student.findUnique.mockResolvedValue({ id: 'stu-1' });
      prisma.universityApplication.findUnique.mockResolvedValue(null);

      await expect(
        controller.getApplicationTimeline('app-1', mockStudentUser),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when application belongs to a different student', async () => {
      prisma.student.findUnique.mockResolvedValue({ id: 'stu-1' });
      prisma.universityApplication.findUnique.mockResolvedValue({ studentId: 'stu-2' });

      await expect(
        controller.getApplicationTimeline('app-1', mockStudentUser),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('GET /my', () => {
    it('should return student timeline', async () => {
      prisma.student.findUnique.mockResolvedValue({ id: 'stu-1', userId: 'user-1' });
      timelineService.getStudentTimeline.mockResolvedValue([{ id: 'evt-1' }]);

      const result = await controller.getMyTimeline(mockStudentUser);

      expect(prisma.student.findUnique).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
      });
      expect(timelineService.getStudentTimeline).toHaveBeenCalledWith('stu-1');
      expect(result).toEqual([{ id: 'evt-1' }]);
    });

    it('should throw NotFoundException when student not found', async () => {
      prisma.student.findUnique.mockResolvedValue(null);

      await expect(controller.getMyTimeline(mockStudentUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
