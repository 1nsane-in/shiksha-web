import { Test, TestingModule } from '@nestjs/testing';
import { LettersService } from '../../src/letters/letters.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { TimelineService } from '../../src/common/services/timeline.service';
import { NotificationService } from '../../src/common/services/notification.service';
import {
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { UploadLetterDto, UpdateLetterDto } from '../../src/letters/dto/letter.dto';

const mockPrisma = {
  universityApplication: {
    findUnique: jest.fn(),
  },
  admissionLetter: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    upsert: jest.fn(),
    update: jest.fn(),
  },
  student: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  payment: {
    findFirst: jest.fn(),
  },
  invitationLetter: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    upsert: jest.fn(),
    update: jest.fn(),
  },
};

const mockTimeline = {
  onStageAdvanced: jest.fn(),
  onAdmissionLetterUploaded: jest.fn(),
  onInvitationLetterUploaded: jest.fn(),
  onVisaSupportStarted: jest.fn(),
};

const mockNotification = {
  create: jest.fn(),
};

const mockStudent = {
  id: 'student-1',
  userId: 'user-1',
  currentStage: 1,
  applicationStatus: 'STAGE_1_PENDING',
};

const mockUser = { id: 'user-1', email: 'test@test.com' };

const mockApplication = {
  id: 'app-1',
  studentId: 'student-1',
  status: 'approved',
  student: { ...mockStudent, user: { id: 'user-1', email: 'test@test.com' } },
};

const mockAdmissionLetter = {
  id: 'letter-1',
  studentId: 'student-1',
  applicationId: 'app-1',
  fileUrl: 'https://example.com/letter.pdf',
  fileName: 'admission.pdf',
  uploadedBy: 'admin-1',
  uploadedAt: new Date(),
  viewCount: 0,
  downloadCount: 0,
  application: { id: 'app-1', student: { userId: 'user-1' } },
  student: mockStudent,
};

const mockInvitationLetter = {
  id: 'inv-1',
  studentId: 'student-1',
  applicationId: 'app-1',
  fileUrl: 'https://example.com/invitation.pdf',
  fileName: 'invitation.pdf',
  uploadedBy: 'admin-1',
  isDownloadable: false,
  uploadedAt: new Date(),
  viewCount: 0,
  downloadCount: 0,
  application: { id: 'app-1', student: { userId: 'user-1', currentStage: 3 } },
  student: mockStudent,
};

describe('LettersService', () => {
  let service: LettersService;
  let prisma: typeof mockPrisma;
  let timeline: typeof mockTimeline;
  let notification: typeof mockNotification;

  const adminId = 'admin-1';
  const dto: UploadLetterDto = {
    applicationId: 'app-1',
    fileUrl: 'https://example.com/letter.pdf',
    fileName: 'admission.pdf',
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LettersService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: TimelineService, useValue: mockTimeline },
        { provide: NotificationService, useValue: mockNotification },
      ],
    }).compile();

    service = module.get<LettersService>(LettersService);
    prisma = mockPrisma;
    timeline = mockTimeline;
    notification = mockNotification;
  });

  describe('uploadAdmissionLetter', () => {
    it('should throw NotFoundException when application not found', async () => {
      prisma.universityApplication.findUnique.mockResolvedValue(null);

      await expect(
        service.uploadAdmissionLetter(adminId, dto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when application not approved', async () => {
      prisma.universityApplication.findUnique.mockResolvedValue({
        ...mockApplication,
        status: 'pending',
      });

      await expect(
        service.uploadAdmissionLetter(adminId, dto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should upsert letter, advance stage, create timeline + notification', async () => {
      prisma.universityApplication.findUnique.mockResolvedValue(
        mockApplication,
      );
      prisma.admissionLetter.upsert.mockResolvedValue(mockAdmissionLetter);
      prisma.student.update.mockResolvedValue(mockStudent);
      timeline.onStageAdvanced.mockResolvedValue(undefined);
      timeline.onAdmissionLetterUploaded.mockResolvedValue(undefined);
      notification.create.mockResolvedValue(undefined);

      const result = await service.uploadAdmissionLetter(adminId, dto);

      expect(prisma.admissionLetter.upsert).toHaveBeenCalledWith({
        where: { applicationId: dto.applicationId },
        update: {
          fileUrl: dto.fileUrl,
          fileName: dto.fileName,
          uploadedBy: adminId,
          uploadedAt: expect.any(Date),
        },
        create: {
          studentId: mockApplication.studentId,
          applicationId: dto.applicationId,
          fileUrl: dto.fileUrl,
          fileName: dto.fileName,
          uploadedBy: adminId,
        },
      });
      expect(prisma.student.update).toHaveBeenCalledWith({
        where: { id: mockStudent.id },
        data: { currentStage: 2, applicationStatus: 'STAGE_2_PENDING' },
      });
      expect(timeline.onStageAdvanced).toHaveBeenCalledWith(
        dto.applicationId,
        mockStudent.id,
        1,
        2,
      );
      expect(timeline.onAdmissionLetterUploaded).toHaveBeenCalledWith(
        dto.applicationId,
        mockStudent.id,
      );
      expect(notification.create).toHaveBeenCalledWith({
        userId: mockUser.id,
        type: 'ADMISSION_LETTER',
        title: 'Admission Letter Issued',
        message: expect.any(String),
        data: { applicationId: dto.applicationId, letterId: mockAdmissionLetter.id },
      });
      expect(result).toEqual(mockAdmissionLetter);
    });

    it('should not advance stage if student is already past stage 1', async () => {
      prisma.universityApplication.findUnique.mockResolvedValue({
        ...mockApplication,
        student: { ...mockStudent, user: { id: 'user-1' }, currentStage: 2 },
      });
      prisma.admissionLetter.upsert.mockResolvedValue(mockAdmissionLetter);
      timeline.onAdmissionLetterUploaded.mockResolvedValue(undefined);
      notification.create.mockResolvedValue(undefined);

      await service.uploadAdmissionLetter(adminId, dto);

      expect(prisma.student.update).not.toHaveBeenCalled();
      expect(timeline.onStageAdvanced).not.toHaveBeenCalled();
    });
  });

  describe('getAdmissionLetter', () => {
    it('should throw NotFoundException when letter missing', async () => {
      prisma.admissionLetter.findUnique.mockResolvedValue(null);

      await expect(
        service.getAdmissionLetter('app-1', 'user-1', 'STUDENT'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException for wrong user (non-admin)', async () => {
      prisma.admissionLetter.findUnique.mockResolvedValue(mockAdmissionLetter);

      await expect(
        service.getAdmissionLetter('app-1', 'other-user', 'STUDENT'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should return letter for admin', async () => {
      prisma.admissionLetter.findUnique.mockResolvedValue(mockAdmissionLetter);
      prisma.admissionLetter.update.mockResolvedValue(mockAdmissionLetter);

      const result = await service.getAdmissionLetter(
        'app-1',
        'admin-1',
        'ADMIN',
      );

      expect(prisma.admissionLetter.update).toHaveBeenCalledWith({
        where: { id: mockAdmissionLetter.id },
        data: { viewCount: { increment: 1 } },
      });
      expect(result).toEqual(mockAdmissionLetter);
    });

    it('should return letter for letter owner', async () => {
      prisma.admissionLetter.findUnique.mockResolvedValue(mockAdmissionLetter);
      prisma.admissionLetter.update.mockResolvedValue(mockAdmissionLetter);

      const result = await service.getAdmissionLetter(
        'app-1',
        'user-1',
        'STUDENT',
      );

      expect(result).toEqual(mockAdmissionLetter);
    });
  });

  describe('getMyAdmissionLetter', () => {
    it('should throw NotFoundException when student not found', async () => {
      prisma.student.findUnique.mockResolvedValue(null);

      await expect(
        service.getMyAdmissionLetter('user-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when letter not found', async () => {
      prisma.student.findUnique.mockResolvedValue(mockStudent);
      prisma.admissionLetter.findFirst.mockResolvedValue(null);

      await expect(
        service.getMyAdmissionLetter('user-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should return locked letter (no fileUrl) when payment not complete', async () => {
      prisma.student.findUnique.mockResolvedValue(mockStudent);
      prisma.admissionLetter.findFirst.mockResolvedValue(mockAdmissionLetter);
      prisma.payment.findFirst.mockResolvedValue(null);

      const result = await service.getMyAdmissionLetter('user-1');

      expect(result.fileUrl).toBeNull();
      expect(result.isLocked).toBe(true);
    });

    it('should return unlocked letter when paid', async () => {
      prisma.student.findUnique.mockResolvedValue(mockStudent);
      prisma.admissionLetter.findFirst.mockResolvedValue(mockAdmissionLetter);
      prisma.payment.findFirst.mockResolvedValue({
        id: 'pay-1',
        stage: 2,
        status: 'SUCCESS',
      });
      prisma.admissionLetter.update.mockResolvedValue(mockAdmissionLetter);

      const result = await service.getMyAdmissionLetter('user-1');

      expect(result.isLocked).toBe(false);
      expect(prisma.admissionLetter.update).toHaveBeenCalledWith({
        where: { id: mockAdmissionLetter.id },
        data: { viewCount: { increment: 1 } },
      });
    });
  });

  describe('downloadAdmissionLetter', () => {
    it('should throw NotFoundException when letter not found', async () => {
      prisma.admissionLetter.findUnique.mockResolvedValue(null);

      await expect(
        service.downloadAdmissionLetter('app-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should return letter and increment downloadCount', async () => {
      prisma.admissionLetter.findUnique.mockResolvedValue(mockAdmissionLetter);
      prisma.admissionLetter.update.mockResolvedValue(mockAdmissionLetter);

      const result = await service.downloadAdmissionLetter('app-1');

      expect(prisma.admissionLetter.update).toHaveBeenCalledWith({
        where: { id: mockAdmissionLetter.id },
        data: { downloadCount: { increment: 1 } },
      });
      expect(result).toEqual(mockAdmissionLetter);
    });
  });

  describe('uploadInvitationLetter', () => {
    it('should throw NotFoundException when application not found', async () => {
      prisma.universityApplication.findUnique.mockResolvedValue(null);

      await expect(
        service.uploadInvitationLetter(adminId, dto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should upsert invitation letter and advance stage', async () => {
      const application = {
        id: 'app-1',
        studentId: 'student-1',
        status: 'approved',
        student: { ...mockStudent, user: { id: 'user-1' }, currentStage: 3 },
      };
      prisma.universityApplication.findUnique.mockResolvedValue(application);
      prisma.invitationLetter.upsert.mockResolvedValue({
        ...mockInvitationLetter,
        application: undefined,
      });
      prisma.student.update.mockResolvedValue(mockStudent);
      timeline.onStageAdvanced.mockResolvedValue(undefined);
      timeline.onInvitationLetterUploaded.mockResolvedValue(undefined);
      notification.create.mockResolvedValue(undefined);

      const result = await service.uploadInvitationLetter(adminId, dto);

      expect(prisma.invitationLetter.upsert).toHaveBeenCalledWith({
        where: { applicationId: dto.applicationId },
        update: {
          fileUrl: dto.fileUrl,
          fileName: dto.fileName,
          uploadedBy: adminId,
          uploadedAt: expect.any(Date),
        },
        create: {
          studentId: application.studentId,
          applicationId: dto.applicationId,
          fileUrl: dto.fileUrl,
          fileName: dto.fileName,
          uploadedBy: adminId,
        },
      });
      expect(prisma.student.update).toHaveBeenCalledWith({
        where: { id: mockStudent.id },
        data: { currentStage: 4, applicationStatus: 'STAGE_4_PENDING' },
      });
      expect(timeline.onStageAdvanced).toHaveBeenCalledWith(
        dto.applicationId,
        mockStudent.id,
        3,
        4,
      );
      expect(timeline.onInvitationLetterUploaded).toHaveBeenCalledWith(
        dto.applicationId,
        mockStudent.id,
      );
      expect(notification.create).toHaveBeenCalledWith({
        userId: mockUser.id,
        type: 'INVITATION_LETTER',
        title: 'Invitation Letter Issued',
        message: expect.any(String),
        data: {
          applicationId: dto.applicationId,
          letterId: mockInvitationLetter.id,
        },
      });
      expect(result).toEqual({
        ...mockInvitationLetter,
        application: undefined,
      });
    });
  });

  describe('getInvitationLetter', () => {
    it('should throw NotFoundException when letter missing', async () => {
      prisma.invitationLetter.findUnique.mockResolvedValue(null);

      await expect(
        service.getInvitationLetter('app-1', 'user-1', 'STUDENT'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException for wrong user', async () => {
      prisma.invitationLetter.findUnique.mockResolvedValue(mockInvitationLetter);

      await expect(
        service.getInvitationLetter('app-1', 'other-user', 'STUDENT'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should return letter for admin', async () => {
      prisma.invitationLetter.findUnique.mockResolvedValue(mockInvitationLetter);
      prisma.invitationLetter.update.mockResolvedValue(mockInvitationLetter);

      const result = await service.getInvitationLetter(
        'app-1',
        'admin-1',
        'ADMIN',
      );

      expect(prisma.invitationLetter.update).toHaveBeenCalledWith({
        where: { id: mockInvitationLetter.id },
        data: { viewCount: { increment: 1 } },
      });
      expect(result).toEqual(mockInvitationLetter);
    });

    it('should return letter for owner', async () => {
      prisma.invitationLetter.findUnique.mockResolvedValue(mockInvitationLetter);
      prisma.invitationLetter.update.mockResolvedValue(mockInvitationLetter);

      const result = await service.getInvitationLetter(
        'app-1',
        'user-1',
        'STUDENT',
      );

      expect(result).toEqual(mockInvitationLetter);
    });
  });

  describe('getMyInvitationLetter', () => {
    it('should throw NotFoundException when student not found', async () => {
      prisma.student.findUnique.mockResolvedValue(null);

      await expect(
        service.getMyInvitationLetter('user-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when letter not found', async () => {
      prisma.student.findUnique.mockResolvedValue(mockStudent);
      prisma.invitationLetter.findFirst.mockResolvedValue(null);

      await expect(
        service.getMyInvitationLetter('user-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when not downloadable', async () => {
      prisma.student.findUnique.mockResolvedValue(mockStudent);
      prisma.invitationLetter.findFirst.mockResolvedValue({
        ...mockInvitationLetter,
        isDownloadable: false,
      });

      await expect(
        service.getMyInvitationLetter('user-1'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should return letter when downloadable', async () => {
      const downloadable = {
        ...mockInvitationLetter,
        isDownloadable: true,
      };
      prisma.student.findUnique.mockResolvedValue(mockStudent);
      prisma.invitationLetter.findFirst.mockResolvedValue(downloadable);
      prisma.invitationLetter.update.mockResolvedValue(downloadable);

      const result = await service.getMyInvitationLetter('user-1');

      expect(prisma.invitationLetter.update).toHaveBeenCalledWith({
        where: { id: downloadable.id },
        data: { viewCount: { increment: 1 } },
      });
      expect(result).toEqual(downloadable);
    });
  });

  describe('downloadInvitationLetter', () => {
    it('should throw NotFoundException when letter not found', async () => {
      prisma.invitationLetter.findUnique.mockResolvedValue(null);

      await expect(
        service.downloadInvitationLetter('app-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when not downloadable and stage < 4', async () => {
      prisma.invitationLetter.findUnique.mockResolvedValue({
        ...mockInvitationLetter,
        isDownloadable: false,
        application: {
          ...mockInvitationLetter.application,
          student: { currentStage: 3 },
        },
      });

      await expect(
        service.downloadInvitationLetter('app-1'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should return letter and increment downloadCount', async () => {
      const downloadable = {
        ...mockInvitationLetter,
        isDownloadable: true,
      };
      prisma.invitationLetter.findUnique.mockResolvedValue(downloadable);
      prisma.invitationLetter.update.mockResolvedValue(downloadable);

      const result = await service.downloadInvitationLetter('app-1');

      expect(prisma.invitationLetter.update).toHaveBeenCalledWith({
        where: { id: downloadable.id },
        data: { downloadCount: { increment: 1 } },
      });
      expect(result).toEqual(downloadable);
    });
  });

  describe('updateInvitationLetter', () => {
    it('should update letter', async () => {
      const updateDto: UpdateLetterDto = {
        fileName: 'updated.pdf',
        isDownloadable: true,
      };
      const updated = { ...mockInvitationLetter, ...updateDto };
      prisma.invitationLetter.update.mockResolvedValue(updated);

      const result = await service.updateInvitationLetter('inv-1', updateDto);

      expect(prisma.invitationLetter.update).toHaveBeenCalledWith({
        where: { id: 'inv-1' },
        data: updateDto,
      });
      expect(result).toEqual(updated);
    });
  });

  describe('approveInvitationLetterAccess', () => {
    it('should throw NotFoundException when letter not found', async () => {
      prisma.invitationLetter.findUnique.mockResolvedValue(null);

      await expect(
        service.approveInvitationLetterAccess('app-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should set isDownloadable, advance stage to 5, create timeline', async () => {
      const letter = {
        ...mockInvitationLetter,
        application: {
          ...mockInvitationLetter.application,
          student: { id: 'student-1' },
        },
      };
      prisma.invitationLetter.findUnique.mockResolvedValue(letter);
      prisma.invitationLetter.update.mockResolvedValue(letter);
      prisma.student.update.mockResolvedValue(mockStudent);
      timeline.onStageAdvanced.mockResolvedValue(undefined);
      timeline.onVisaSupportStarted.mockResolvedValue(undefined);

      const result = await service.approveInvitationLetterAccess('app-1');

      expect(prisma.invitationLetter.update).toHaveBeenCalledWith({
        where: { id: letter.id },
        data: { isDownloadable: true },
      });
      expect(prisma.student.update).toHaveBeenCalledWith({
        where: { id: 'student-1' },
        data: {
          currentStage: 5,
          applicationStatus: 'STAGE_5_UNLOCKED',
        },
      });
      expect(timeline.onStageAdvanced).toHaveBeenCalledWith(
        'app-1',
        'student-1',
        4,
        5,
      );
      expect(timeline.onVisaSupportStarted).toHaveBeenCalledWith(
        'app-1',
        'student-1',
      );
      expect(result).toEqual({
        message: 'Invitation letter access approved. Stage 5 unlocked.',
      });
    });
  });
});
