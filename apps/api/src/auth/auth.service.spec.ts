import { Test, TestingModule } from '@nestjs/testing';
import {
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmailValidationService } from '../common/services/email-validation.service';

/**
 * Unit tests for the Google social auth flow.
 * Covers the parent/Student role split added so the UI can prompt for a role.
 */
describe('AuthService - Google social auth', () => {
  let service: AuthService;
  let prisma: any;
  let jwt: any;

  const fakeGoogleUser = {
    sub: 'google-sub-123',
    email: 'newuser@example.com',
    name: 'New User',
    email_verified: true,
  };

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
      student: { create: jest.fn() },
      parent: { create: jest.fn() },
      userSession: {
        create: jest.fn(),
        deleteMany: jest.fn(),
        findUnique: jest.fn(),
      },
    };
    jwt = {
      sign: jest.fn().mockReturnValue('signed-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwt },
        {
          provide: EmailValidationService,
          useValue: { validateEmail: jest.fn(), validateEmailAsync: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    // Stub out the private token verifier so tests don't hit the network.
    (service as any).verifyGoogleToken = jest.fn();
  });

  const stubVerify = (info: any) => {
    (service as any).verifyGoogleToken.mockResolvedValue(info);
  };

  describe('googleLogin', () => {
    it('auto-registers a new user as STUDENT by default', async () => {
      stubVerify(fakeGoogleUser);
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: 'u1',
        email: fakeGoogleUser.email,
        name: fakeGoogleUser.name,
        role: 'STUDENT',
        isActive: true,
      });
      prisma.student.create.mockResolvedValue({ id: 's1', userId: 'u1' });
      prisma.userSession.create.mockResolvedValue({});

      const result = await service.googleLogin({ accessToken: 'tok' });

      expect(result.message).toBe('Google login successful');
      expect(result.user.role).toBe('STUDENT');
      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ role: 'STUDENT' }) }),
      );
      expect(prisma.student.create).toHaveBeenCalledWith({ data: { userId: 'u1' } });
      expect(prisma.parent.create).not.toHaveBeenCalled();
    });

    it('auto-registers a new user as PARENT when role=PARENT', async () => {
      stubVerify(fakeGoogleUser);
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: 'u2',
        email: fakeGoogleUser.email,
        name: fakeGoogleUser.name,
        role: 'PARENT',
        isActive: true,
      });
      prisma.parent.create.mockResolvedValue({ id: 'p1', userId: 'u2' });
      prisma.userSession.create.mockResolvedValue({});

      const result = await service.googleLogin({ accessToken: 'tok', role: 'PARENT' });

      expect(result.user.role).toBe('PARENT');
      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ role: 'PARENT' }) }),
      );
      expect(prisma.parent.create).toHaveBeenCalledWith({ data: { userId: 'u2' } });
      expect(prisma.student.create).not.toHaveBeenCalled();
    });

    it('returns the existing user without creating new records on second login', async () => {
      stubVerify(fakeGoogleUser);
      prisma.user.findUnique.mockResolvedValue({
        id: 'existing',
        email: fakeGoogleUser.email,
        name: fakeGoogleUser.name,
        role: 'STUDENT',
        isActive: true,
      });
      prisma.userSession.create.mockResolvedValue({});

      const result = await service.googleLogin({ accessToken: 'tok', role: 'PARENT' });

      expect(result.user.id).toBe('existing');
      // role param is ignored for existing accounts
      expect(prisma.user.create).not.toHaveBeenCalled();
      expect(prisma.parent.create).not.toHaveBeenCalled();
      expect(prisma.student.create).not.toHaveBeenCalled();
    });

    it('throws UnauthorizedException on invalid Google token', async () => {
      stubVerify(null);
      await expect(service.googleLogin({ accessToken: 'bad' })).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('falls back to STUDENT when role is something other than PARENT', async () => {
      stubVerify(fakeGoogleUser);
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: 'u3',
        email: fakeGoogleUser.email,
        name: fakeGoogleUser.name,
        role: 'STUDENT',
        isActive: true,
      });
      prisma.student.create.mockResolvedValue({});
      prisma.userSession.create.mockResolvedValue({});

      const result = await service.googleLogin({ accessToken: 'tok', role: 'ADMIN' as any });
      expect(result.user.role).toBe('STUDENT');
    });
  });

  describe('googleRegister', () => {
    it('creates a PARENT account with the Parent record', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: 'pr1',
        email: 'parent@example.com',
        name: 'Pat Parent',
        phone: '+1234567890',
        role: 'PARENT',
        isActive: true,
      });
      prisma.parent.create.mockResolvedValue({ id: 'p1', userId: 'pr1' });
      prisma.userSession.create.mockResolvedValue({});

      const result = await service.googleRegister({
        email: 'parent@example.com',
        name: 'Pat Parent',
        phone: '+1234567890',
        googleId: 'g1',
        accessToken: 'tok',
        role: 'PARENT',
      });

      expect(result.message).toBe('Google registration successful');
      expect(result.user.role).toBe('PARENT');
      expect(prisma.parent.create).toHaveBeenCalledWith({ data: { userId: 'pr1' } });
      expect(prisma.student.create).not.toHaveBeenCalled();
    });

    it('creates a STUDENT account with the Student record', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: 'st1',
        email: 'student@example.com',
        name: 'Sam Student',
        role: 'STUDENT',
        isActive: true,
      });
      prisma.student.create.mockResolvedValue({ id: 's1', userId: 'st1' });
      prisma.userSession.create.mockResolvedValue({});

      const result = await service.googleRegister({
        email: 'student@example.com',
        name: 'Sam Student',
        googleId: 'g2',
        accessToken: 'tok',
        role: 'STUDENT',
      });

      expect(result.user.role).toBe('STUDENT');
      expect(prisma.student.create).toHaveBeenCalledWith({ data: { userId: 'st1' } });
      expect(prisma.parent.create).not.toHaveBeenCalled();
    });

    it('rejects when email already exists', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'existing' });
      await expect(
        service.googleRegister({
          email: 'dup@example.com',
          name: 'Dup',
          googleId: 'g3',
          accessToken: 'tok',
          role: 'STUDENT',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
