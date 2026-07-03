import { Test, TestingModule } from '@nestjs/testing';
import { ParentsService } from '../../src/parents/parents.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../../src/common/services/email.service';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

// crypto.randomUUID and bcrypt.hash are non-writable in Node 22
jest.mock('crypto', () => {
  const actual = jest.requireActual('crypto');
  return { ...actual, randomUUID: jest.fn() };
});
jest.mock('bcryptjs', () => ({ hash: jest.fn().mockResolvedValue('hashed-pw') }));

/* ── Mock prisma models ── */
const mockPrisma = {
  student: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    upsert: jest.fn(),
  },
  parentInvite: {
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
  parentStudent: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
  parent: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  otpVerification: {
    create: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  userSession: {
    create: jest.fn(),
  },
};

const mockConfig = { get: jest.fn() };
const mockJwt = { sign: jest.fn(), verifyAsync: jest.fn() };
const mockEmail = { sendRegistrationOtp: jest.fn() };

describe('ParentsService', () => {
  let service: ParentsService;
  let prisma: typeof mockPrisma;
  let config: typeof mockConfig;
  let email: typeof mockEmail;

  /* Shared fixtures */
  const userId = 'user-1';
  const studentId = 'student-1';
  const parentId = 'parent-1';

  const mockStudent = {
    id: studentId,
    userId,
    familyCode: 'ABC123',
    currentStage: 'DOCUMENTS',
    applicationStatus: 'IN_PROGRESS',
    createdAt: new Date(),
    updatedAt: new Date(),
    user: { id: userId, name: 'S', email: 'student@test.com', phone: '+911234567890' },
  };

  const mockStudentNoCode = {
    ...mockStudent,
    familyCode: null,
  };

  const mockParent = {
    id: parentId,
    userId: 'parent-user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUser = {
    id: 'parent-user-1',
    email: 'parent@example.com',
    name: 'Parent Name',
    phone: '+919876543210',
    role: 'PARENT',
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockParentStudent = {
    id: 'link-1',
    parentId,
    studentId,
    status: 'APPROVED',
    invitedBy: 'STUDENT',
    relation: 'FATHER',
    createdAt: new Date(),
    updatedAt: new Date(),
    parent: {
      ...mockParent,
      user: { id: 'pu-1', email: 'p@e.com', name: 'P', phone: '+91' },
    },
    student: {
      ...mockStudent,
      user: { id: 'su-1', email: 's@e.com', name: 'S' },
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    (crypto.randomUUID as jest.Mock).mockReturnValue('fixed-uuid');
    jest.spyOn(Math, 'random').mockReturnValue(0.5);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParentsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: ConfigService, useValue: mockConfig },
        { provide: JwtService, useValue: mockJwt },
        { provide: EmailService, useValue: mockEmail },
      ],
    }).compile();

    service = module.get<ParentsService>(ParentsService);
    prisma = mockPrisma;
    config = mockConfig;
    email = mockEmail;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // ──────────────────────────────────────────────
  // validateInviteCode
  // ──────────────────────────────────────────────
  describe('validateInviteCode', () => {
    it('should return valid=true for a pending, non-expired invite', async () => {
      const future = new Date(Date.now() + 86400000);
      prisma.parentInvite.findFirst.mockResolvedValue({
        code: 'inv-code',
        status: 'PENDING',
        expiresAt: future,
        email: 'p@e.com',
        relation: 'FATHER',
        student: { user: { name: 'Student Name' } },
      });

      const result = await service.validateInviteCode('inv-code');

      expect(result).toEqual({
        valid: true,
        email: 'p@e.com',
        studentName: 'Student Name',
        relation: 'FATHER',
      });
    });

    it('should return alreadyUsed for ACCEPTED invite', async () => {
      prisma.parentInvite.findFirst.mockResolvedValue({
        code: 'inv-code',
        status: 'ACCEPTED',
        student: { user: { name: 'S' } },
      });

      const result = await service.validateInviteCode('inv-code');

      expect(result).toEqual({
        valid: false,
        alreadyUsed: true,
        message: 'This invite link has already been used.',
      });
    });

    it('should return expired for expired invite', async () => {
      const past = new Date(Date.now() - 86400000);
      prisma.parentInvite.findFirst.mockResolvedValue({
        code: 'inv-code',
        status: 'PENDING',
        expiresAt: past,
        student: { user: { name: 'S' } },
      });

      const result = await service.validateInviteCode('inv-code');

      expect(result).toEqual({
        valid: false,
        expired: true,
        message: 'This invite link has expired.',
      });
    });

    it('should return valid=true with isFamilyCode when code matches a student familyCode', async () => {
      prisma.parentInvite.findFirst.mockResolvedValue(null);
      prisma.student.findUnique.mockResolvedValue({
        familyCode: 'ABC123',
        user: { name: 'Student Name' },
      });

      const result = await service.validateInviteCode('ABC123');

      expect(result).toEqual({
        valid: true,
        email: '',
        studentName: 'Student Name',
        relation: null,
        isFamilyCode: true,
      });
    });

    it('should return valid=false when nothing matches', async () => {
      prisma.parentInvite.findFirst.mockResolvedValue(null);
      prisma.student.findUnique.mockResolvedValue(null);

      const result = await service.validateInviteCode('garbage');

      expect(result).toEqual({
        valid: false,
        message: 'Invalid invite link or code.',
      });
    });
  });

  // ──────────────────────────────────────────────
  // createInviteLink
  // ──────────────────────────────────────────────
  describe('createInviteLink', () => {
    it('should upsert student, create parentInvite, and return inviteUrl', async () => {
      prisma.student.upsert.mockResolvedValue(mockStudent);
      prisma.parentInvite.create.mockResolvedValue({ id: 'inv-1' });

      const dto = {
        email: 'parent@example.com',
        phone: '+919876543210',
        relation: 'FATHER',
      };
      const result = await service.createInviteLink(userId, dto);

      expect(prisma.student.upsert).toHaveBeenCalledWith({
        where: { userId },
        create: { userId },
        update: {},
      });
      expect(prisma.parentInvite.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            studentId,
            email: dto.email,
            phone: dto.phone,
            relation: dto.relation,
            code: 'fixed-uuid',
            method: 'LINK',
            expiresAt: expect.any(Date),
          }),
        }),
      );
      expect(result.inviteUrl).toContain('/invite/fixed-uuid');
      expect(result.code).toBe('fixed-uuid');
    });
  });

  // ──────────────────────────────────────────────
  // getFamilyCode
  // ──────────────────────────────────────────────
  describe('getFamilyCode', () => {
    it('should return existing family code', async () => {
      prisma.student.upsert.mockResolvedValue(mockStudent);

      const result = await service.getFamilyCode(userId);

      expect(result).toEqual({ familyCode: 'ABC123' });
      expect(prisma.student.update).not.toHaveBeenCalled();
    });

    it('should generate a new code when student has none', async () => {
      prisma.student.upsert.mockResolvedValue(mockStudentNoCode);
      prisma.student.findUnique.mockResolvedValue(null); // generateUniqueFamilyCode loop
      prisma.student.update.mockResolvedValue({
        ...mockStudentNoCode,
        familyCode: 'XYZ789',
      });

      const result = await service.getFamilyCode(userId);

      expect(result.familyCode).toBeTruthy();
      expect(prisma.student.update).toHaveBeenCalled();
    });
  });

  // ──────────────────────────────────────────────
  // regenerateFamilyCode
  // ──────────────────────────────────────────────
  describe('regenerateFamilyCode', () => {
    it('should generate and save a new family code', async () => {
      prisma.student.upsert.mockResolvedValue(mockStudent);
      prisma.student.findUnique.mockResolvedValue(null); // generateUniqueFamilyCode loop
      prisma.student.update.mockResolvedValue({
        ...mockStudent,
        familyCode: 'NEW456',
      });

      const result = await service.regenerateFamilyCode(userId);

      expect(result.familyCode).toBeTruthy();
      expect(result.familyCode).not.toBe('ABC123');
      expect(prisma.student.update).toHaveBeenCalled();
    });
  });

  // ──────────────────────────────────────────────
  // getMyLinks
  // ──────────────────────────────────────────────
  describe('getMyLinks', () => {
    it('should return parent links for the student', async () => {
      prisma.student.upsert.mockResolvedValue(mockStudent);
      const links = [mockParentStudent];
      prisma.parentStudent.findMany.mockResolvedValue(links);

      const result = await service.getMyLinks(userId);

      expect(prisma.parentStudent.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { studentId },
          orderBy: { createdAt: 'desc' },
        }),
      );
      expect(result).toEqual(links);
    });
  });

  // ──────────────────────────────────────────────
  // removeParentLink
  // ──────────────────────────────────────────────
  describe('removeParentLink', () => {
    it('should throw NotFoundException when link not found', async () => {
      prisma.student.upsert.mockResolvedValue(mockStudent);
      prisma.parentStudent.findFirst.mockResolvedValue(null);

      await expect(
        service.removeParentLink(userId, 'bad-link'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should delete the link when found and owned', async () => {
      prisma.student.upsert.mockResolvedValue(mockStudent);
      prisma.parentStudent.findFirst.mockResolvedValue(mockParentStudent);
      prisma.parentStudent.delete.mockResolvedValue(mockParentStudent);

      const result = await service.removeParentLink(userId, 'link-1');

      expect(prisma.parentStudent.delete).toHaveBeenCalledWith({
        where: { id: 'link-1' },
      });
      expect(result).toEqual({ message: 'Parent link removed successfully' });
    });
  });

  // ──────────────────────────────────────────────
  // linkByCode
  // ──────────────────────────────────────────────
  describe('linkByCode', () => {
    const parentUserId = 'parent-user-1';

    it('should throw BadRequestException when parent profile not found', async () => {
      prisma.parent.findUnique.mockResolvedValue(null);

      await expect(
        service.linkByCode(parentUserId, { familyCode: 'ABC123' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when student not found by code', async () => {
      prisma.parent.findUnique.mockResolvedValue(mockParent);
      prisma.student.findUnique.mockResolvedValue(null);

      await expect(
        service.linkByCode(parentUserId, { familyCode: 'INVALID' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when already linked', async () => {
      prisma.parent.findUnique.mockResolvedValue(mockParent);
      prisma.student.findUnique.mockResolvedValue(mockStudent);
      prisma.parentStudent.findUnique.mockResolvedValue(mockParentStudent);

      await expect(
        service.linkByCode(parentUserId, { familyCode: 'ABC123' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create a link successfully', async () => {
      prisma.parent.findUnique.mockResolvedValue(mockParent);
      prisma.student.findUnique.mockResolvedValue(mockStudent);
      prisma.parentStudent.findUnique.mockResolvedValue(null);
      prisma.parentStudent.create.mockResolvedValue(mockParentStudent);

      const result = await service.linkByCode(parentUserId, {
        familyCode: 'ABC123',
      });

      expect(prisma.parentStudent.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            parentId,
            studentId,
            status: 'APPROVED',
            invitedBy: 'PARENT',
          }),
        }),
      );
      expect(result).toEqual(mockParentStudent);
    });
  });

  // ──────────────────────────────────────────────
  // getChildren
  // ──────────────────────────────────────────────
  describe('getChildren', () => {
    const parentUserId = 'parent-user-1';

    it('should throw BadRequestException when parent profile not found', async () => {
      prisma.parent.findUnique.mockResolvedValue(null);

      await expect(service.getChildren(parentUserId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return mapped children list', async () => {
      prisma.parent.findUnique.mockResolvedValue(mockParent);
      const link = {
        ...mockParentStudent,
        student: {
          ...mockStudent,
          user: { name: 'Child Name', email: 'child@e.com' },
          documents: [{ id: 'd1', status: 'APPROVED' }],
          payments: [{ id: 'p1', status: 'SUCCESS', amount: 1000 }],
        },
        relation: 'FATHER',
      };
      prisma.parentStudent.findMany.mockResolvedValue([link]);

      const result = await service.getChildren(parentUserId);

      expect(result).toEqual([
        {
          id: studentId,
          name: 'Child Name',
          email: 'child@e.com',
          relation: 'FATHER',
          currentStage: mockStudent.currentStage,
          applicationStatus: mockStudent.applicationStatus,
          documentsCount: 1,
          paymentsCount: 1,
        },
      ]);
    });
  });

  // ──────────────────────────────────────────────
  // sendEmailOtp
  // ──────────────────────────────────────────────
  describe('sendEmailOtp', () => {
    const dto = { email: 'parent@example.com', name: 'Parent' };

    it('should create OTP record and send email, return devOtp in development', async () => {
      config.get.mockReturnValue('development');
      prisma.otpVerification.create.mockResolvedValue({ id: 'otp-1' });
      email.sendRegistrationOtp.mockResolvedValue(undefined);

      const result = await service.sendEmailOtp(dto);

      expect(prisma.otpVerification.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            email: dto.email,
            name: dto.name,
            otp: expect.any(String),
            expiresAt: expect.any(Date),
          }),
        }),
      );
      expect(email.sendRegistrationOtp).toHaveBeenCalledWith(
        dto.email,
        expect.any(String),
        dto.name,
      );
      expect(result.devOtp).toBeDefined();
      expect(result.message).toBe('OTP sent to your email');
    });

    it('should not return devOtp in production', async () => {
      config.get.mockReturnValue('production');
      prisma.otpVerification.create.mockResolvedValue({ id: 'otp-1' });
      email.sendRegistrationOtp.mockResolvedValue(undefined);

      const result = await service.sendEmailOtp(dto);

      expect(result.devOtp).toBeUndefined();
    });

    it('should re-throw if email sending fails', async () => {
      config.get.mockReturnValue('development');
      prisma.otpVerification.create.mockResolvedValue({ id: 'otp-1' });
      email.sendRegistrationOtp.mockRejectedValue(
        new Error('SMTP error'),
      );

      await expect(service.sendEmailOtp(dto)).rejects.toThrow('SMTP error');
    });
  });

  // ──────────────────────────────────────────────
  // sendPhoneOtp
  // ──────────────────────────────────────────────
  describe('sendPhoneOtp', () => {
    const dto = { phone: '+919876543210' };

    it('should store OTP in memory and return devOtp in development', async () => {
      config.get.mockReturnValue('development');

      const result = await service.sendPhoneOtp(dto);

      expect(result.devOtp).toBeDefined();
      expect(result.message).toBe('OTP sent to your phone');
    });

    it('should not return devOtp in production', async () => {
      config.get.mockReturnValue('production');

      const result = await service.sendPhoneOtp(dto);

      expect(result.devOtp).toBeUndefined();
    });
  });

  // ──────────────────────────────────────────────
  // verifyEmailOtp
  // ──────────────────────────────────────────────
  describe('verifyEmailOtp', () => {
    const dto = { email: 'parent@example.com', otp: '123456' };
    const mockOtpRecord = {
      id: 'otp-1',
      email: 'parent@example.com',
      otp: '123456',
      verifiedAt: null,
      completedAt: null,
      createdAt: new Date(),
    };

    it('should throw BadRequestException when OTP is invalid or expired', async () => {
      prisma.otpVerification.findFirst.mockResolvedValue(null);

      await expect(service.verifyEmailOtp(dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should verify OTP and return token', async () => {
      prisma.otpVerification.findFirst.mockResolvedValue(mockOtpRecord);
      prisma.otpVerification.update.mockResolvedValue({
        ...mockOtpRecord,
        verifiedAt: new Date(),
        token: 'fixed-uuid',
      });

      const result = await service.verifyEmailOtp(dto);

      expect(prisma.otpVerification.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'otp-1' },
          data: expect.objectContaining({
            verifiedAt: expect.any(Date),
            token: 'fixed-uuid',
          }),
        }),
      );
      expect(result).toEqual({
        message: 'Email OTP verified successfully',
        token: 'fixed-uuid',
      });
    });
  });

  // ──────────────────────────────────────────────
  // verifyPhoneOtp
  // ──────────────────────────────────────────────
  describe('verifyPhoneOtp', () => {
    const dto = { phone: '+919876543210', otp: '550000' }; // Math.random()=0.5 → 100000 + 0.5*900000 = 550000

    it('should throw BadRequestException when no OTP sent', async () => {
      await expect(
        service.verifyPhoneOtp({ phone: '+919999999999', otp: '123456' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should verify OTP and return token', async () => {
      // Send OTP first to populate the in-memory map
      config.get.mockReturnValue('development');
      await service.sendPhoneOtp({ phone: dto.phone });

      const result = await service.verifyPhoneOtp(dto);

      expect(result.message).toBe('Phone OTP verified successfully');
      expect(result.token).toBe('fixed-uuid');
    });

    it('should throw when sending wrong OTP', async () => {
      config.get.mockReturnValue('development');
      await service.sendPhoneOtp({ phone: dto.phone });

      await expect(
        service.verifyPhoneOtp({ phone: dto.phone, otp: '000000' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ──────────────────────────────────────────────
  // parentRegister
  // ──────────────────────────────────────────────
  describe('parentRegister', () => {
    const registerDto = {
      email: 'parent@example.com',
      name: 'Parent Name',
      phone: '+919876543210',
      password: 'password123',
      confirmPassword: 'password123',
    };

    beforeEach(() => {
      config.get.mockReturnValue('development');
    });

    it('should throw when email not verified', async () => {
      prisma.otpVerification.findFirst.mockResolvedValue(null);

      await expect(service.parentRegister(registerDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw when phone not verified', async () => {
      prisma.otpVerification.findFirst.mockResolvedValue({
        id: 'otp-1',
        verifiedAt: new Date(),
        completedAt: null,
      });

      // Don't send phone OTP — phone map will be empty
      await expect(service.parentRegister(registerDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw when email already registered', async () => {
      // Verify email OTP
      prisma.otpVerification.findFirst.mockResolvedValueOnce({
        id: 'otp-1',
        verifiedAt: new Date(),
        completedAt: null,
      });
      // Send and verify phone OTP
      await service.sendPhoneOtp({ phone: registerDto.phone });
      await service.verifyPhoneOtp({ phone: registerDto.phone, otp: '550000' });
      // Existing user
      prisma.user.findUnique.mockResolvedValue(mockUser);

      await expect(service.parentRegister(registerDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should register successfully without invite code', async () => {
      prisma.otpVerification.findFirst.mockResolvedValue({
        id: 'otp-1',
        verifiedAt: new Date(),
        completedAt: null,
      });
      await service.sendPhoneOtp({ phone: registerDto.phone });
      await service.verifyPhoneOtp({ phone: registerDto.phone, otp: '550000' });
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(mockUser);
      prisma.parent.create.mockResolvedValue(mockParent);
      prisma.otpVerification.update.mockResolvedValue({});
      mockJwt.sign.mockReturnValue('access-token');
      prisma.userSession.create.mockResolvedValue({});

      const result = await service.parentRegister(registerDto);

      expect(result.message).toBe('Parent registration successful');
      expect(result.user).toBeDefined();
      expect(result.accessToken).toBe('access-token');
      expect(result.linkedStudent).toBeNull();
    });

    it('should register and link via family code when inviteCode matches', async () => {
      const dto = { ...registerDto, inviteCode: 'ABC123', relation: 'FATHER' };

      prisma.otpVerification.findFirst.mockResolvedValue({
        id: 'otp-1',
        verifiedAt: new Date(),
        completedAt: null,
      });
      await service.sendPhoneOtp({ phone: dto.phone });
      await service.verifyPhoneOtp({ phone: dto.phone, otp: '550000' });
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(mockUser);
      prisma.parent.create.mockResolvedValue(mockParent);
      prisma.otpVerification.update.mockResolvedValue({});
      // processInviteCode via family code path
      prisma.student.findUnique.mockResolvedValue(mockStudent);
      prisma.parentStudent.findUnique.mockResolvedValue(null);
      prisma.parentStudent.create.mockResolvedValue(mockParentStudent);
      mockJwt.sign.mockReturnValue('access-token');
      prisma.userSession.create.mockResolvedValue({});

      const result = await service.parentRegister(dto);

      expect(result.message).toBe('Parent registration successful');
      expect(result.linkedStudent).toEqual({
        id: studentId,
        name: 'S',
      });
    });
  });

  // ──────────────────────────────────────────────
  // adminFindAll
  // ──────────────────────────────────────────────
  describe('adminFindAll', () => {
    it('should return paginated results', async () => {
      const items = [mockParentStudent];
      prisma.parentStudent.findMany.mockResolvedValue(items);
      prisma.parentStudent.count.mockResolvedValue(1);

      const result = await service.adminFindAll({ page: '1', limit: '20' });

      expect(result.data).toEqual(items);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
      expect(result.totalPages).toBe(1);
    });

    it('should filter by status when provided', async () => {
      prisma.parentStudent.findMany.mockResolvedValue([]);
      prisma.parentStudent.count.mockResolvedValue(0);

      await service.adminFindAll({
        status: 'APPROVED',
        page: '1',
        limit: '10',
      });

      expect(prisma.parentStudent.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: 'APPROVED' },
        }),
      );
    });
  });

  // ──────────────────────────────────────────────
  // adminCreateLink
  // ──────────────────────────────────────────────
  describe('adminCreateLink', () => {
    const dto = {
      parentEmail: 'parent@example.com',
      studentEmail: 'student@example.com',
      relation: 'FATHER',
    };

    it('should throw when parent user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.adminCreateLink(dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw when parent user is not PARENT role', async () => {
      prisma.user.findUnique.mockResolvedValue({
        ...mockUser,
        role: 'STUDENT',
      });

      await expect(service.adminCreateLink(dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw when parent profile not found', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.parent.findUnique.mockResolvedValue(null);

      await expect(service.adminCreateLink(dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw when student user not found', async () => {
      prisma.user.findUnique
        .mockResolvedValueOnce(mockUser) // parent user
        .mockResolvedValueOnce(null); // student user
      prisma.parent.findUnique.mockResolvedValue(mockParent);

      await expect(service.adminCreateLink(dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw when link already exists', async () => {
      prisma.user.findUnique
        .mockResolvedValueOnce(mockUser) // parent user
        .mockResolvedValueOnce({ ...mockUser, id: 'stu-user', role: 'STUDENT' }); // student user
      prisma.parent.findUnique.mockResolvedValue(mockParent);
      prisma.student.upsert.mockResolvedValue(mockStudent);
      prisma.parentStudent.findUnique.mockResolvedValue(mockParentStudent);

      await expect(service.adminCreateLink(dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create link successfully', async () => {
      prisma.user.findUnique
        .mockResolvedValueOnce(mockUser) // parent user
        .mockResolvedValueOnce({ ...mockUser, id: 'stu-user', role: 'STUDENT' }); // student user
      prisma.parent.findUnique.mockResolvedValue(mockParent);
      prisma.student.upsert.mockResolvedValue(mockStudent);
      prisma.parentStudent.findUnique.mockResolvedValue(null);
      prisma.parentStudent.create.mockResolvedValue(mockParentStudent);

      const result = await service.adminCreateLink(dto);

      expect(result).toEqual(mockParentStudent);
    });
  });

  // ──────────────────────────────────────────────
  // adminUpdateLinkStatus
  // ──────────────────────────────────────────────
  describe('adminUpdateLinkStatus', () => {
    it('should throw NotFoundException when link not found', async () => {
      prisma.parentStudent.findUnique.mockResolvedValue(null);

      await expect(
        service.adminUpdateLinkStatus('bad-id', { status: 'APPROVED' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update link status', async () => {
      prisma.parentStudent.findUnique.mockResolvedValue(mockParentStudent);
      prisma.parentStudent.update.mockResolvedValue({
        ...mockParentStudent,
        status: 'REJECTED',
      });

      const result = await service.adminUpdateLinkStatus('link-1', {
        status: 'REJECTED',
      });

      expect(prisma.parentStudent.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'link-1' },
          data: { status: 'REJECTED' },
        }),
      );
      expect(result.status).toBe('REJECTED');
    });
  });

  // ──────────────────────────────────────────────
  // adminDeleteLink
  // ──────────────────────────────────────────────
  describe('adminDeleteLink', () => {
    it('should throw NotFoundException when link not found', async () => {
      prisma.parentStudent.findUnique.mockResolvedValue(null);

      await expect(service.adminDeleteLink('bad-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should delete link', async () => {
      prisma.parentStudent.findUnique.mockResolvedValue(mockParentStudent);
      prisma.parentStudent.delete.mockResolvedValue(mockParentStudent);

      const result = await service.adminDeleteLink('link-1');

      expect(prisma.parentStudent.delete).toHaveBeenCalledWith({
        where: { id: 'link-1' },
      });
      expect(result).toEqual({ message: 'Parent link removed successfully' });
    });
  });
});
