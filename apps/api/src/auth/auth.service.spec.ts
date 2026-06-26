import { Test, TestingModule } from '@nestjs/testing';
import type { Mock } from 'jest-mock';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { EmailValidationService } from '../common/services/email-validation.service';
import { EmailService } from '../common/services/email.service';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
  genSalt: jest.fn(),
}));
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let module: TestingModule;
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    passwordHash: 'hashedPassword',
    role: 'STUDENT',
    isActive: true,
    emailVerified: true,
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-jwt-token'),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
            student: {
              create: jest.fn(),
            },
            parent: {
              create: jest.fn(),
            },
            otpVerification: {
              create: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
            },
            userSession: {
              create: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              deleteMany: jest.fn(),
            },
            $transaction: jest.fn(),
          },
        },
        {
          provide: EmailValidationService,
          useValue: {
            validateEmailAsync: jest.fn().mockResolvedValue(true),
            validateEmail: jest.fn().mockReturnValue(true),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendRegistrationOtp: jest.fn().mockResolvedValue(undefined),
            sendPasswordResetOtp: jest.fn().mockResolvedValue(undefined),
            sendWelcomeEmail: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: RedisService,
          useValue: {
            get: jest.fn().mockResolvedValue(null),
            incr: jest.fn().mockResolvedValue(1),
            expire: jest.fn().mockResolvedValue(undefined),
            del: jest.fn().mockResolvedValue(undefined),
            ttl: jest.fn().mockResolvedValue(600),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('development'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('login', () => {
    it('should return tokens for valid credentials', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'correctpassword',
      };

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser as any);

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user).toEqual(mockUser);
    });

    it('should throw UnauthorizedException for invalid email', async () => {
      const loginDto = {
        email: 'nonexistent@example.com',
        password: 'password',
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for inactive user', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password',
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
        ...mockUser,
        isActive: false,
      } as any);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser as any);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for user without password', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password',
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
        ...mockUser,
        passwordHash: null,
      } as any);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when account is locked', async () => {
      const loginDto = {
        email: 'locked@example.com',
        password: 'password',
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Override Redis mock to simulate 5 failed attempts
      const redisService = module.get<RedisService>(RedisService);
      jest.spyOn(redisService, 'get').mockResolvedValue(5);
      jest.spyOn(redisService, 'ttl').mockResolvedValue(600);

      await expect(service.login(loginDto)).rejects.toThrow(
        'Account temporarily locked',
      );
    });
  });

  describe('completeRegistration', () => {
    it('should create user and return tokens', async () => {
      const dto = {
        token: 'valid-token',
        password: 'securePassword123',
        confirmPassword: 'securePassword123',
        role: 'STUDENT' as const,
      };

      const otpRecord = {
        id: 'otp-123',
        email: 'new@example.com',
        name: 'New User',
        verifiedAt: new Date(),
        completedAt: null,
        expiresAt: new Date(Date.now() + 3600000),
      };

      jest
        .spyOn(prisma.otpVerification, 'findFirst')
        .mockResolvedValue(otpRecord as any);
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prisma.user, 'create').mockResolvedValue(mockUser as any);
      jest
        .spyOn(prisma.student, 'create')
        .mockResolvedValue({ id: 'student-123' } as any);
      jest.spyOn(prisma.otpVerification, 'update').mockResolvedValue({} as any);
      jest.spyOn(prisma.userSession, 'create').mockResolvedValue({} as any);

      const result = await service.completeRegistration(dto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('user');
    });

    it('should throw BadRequestException for invalid token', async () => {
      const dto = {
        token: 'invalid-token',
        password: 'password',
        confirmPassword: 'password',
        role: 'STUDENT' as const,
      };

      jest.spyOn(prisma.otpVerification, 'findFirst').mockResolvedValue(null);

      await expect(service.completeRegistration(dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for existing email', async () => {
      const dto = {
        token: 'valid-token',
        password: 'password',
        confirmPassword: 'password',
        role: 'STUDENT' as const,
      };

      const otpRecord = {
        id: 'otp-123',
        email: 'existing@example.com',
        name: 'New User',
        verifiedAt: new Date(),
        completedAt: null,
        expiresAt: new Date(Date.now() + 3600000),
      };

      jest
        .spyOn(prisma.otpVerification, 'findFirst')
        .mockResolvedValue(otpRecord as any);
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser as any);

      await expect(service.completeRegistration(dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('logout', () => {
    it('should delete session for valid refresh token', async () => {
      const refreshToken = 'valid-refresh-token';

      jest
        .spyOn(prisma.userSession, 'deleteMany')
        .mockResolvedValue({ count: 1 });

      const result = await service.logout(refreshToken);

      expect(result).toEqual({ message: 'Logged out successfully' });
      expect(prisma.userSession.deleteMany).toHaveBeenCalled();
    });
  });

  describe('refreshTokens', () => {
    it('should return new tokens for valid refresh token', async () => {
      const refreshToken = 'valid-refresh-token';
      const session = {
        id: 'session-123',
        userId: 'user-123',
        tokenHash: crypto
          .createHash('sha256')
          .update(refreshToken)
          .digest('hex'),
        expiresAt: new Date(Date.now() + 3600000),
        user: mockUser,
      };

      jest
        .spyOn(prisma.userSession, 'findUnique')
        .mockResolvedValue(session as any);
      jest.spyOn(prisma.userSession, 'update').mockResolvedValue({} as any);
      jest
        .spyOn(prisma.userSession, 'deleteMany')
        .mockResolvedValue({ count: 0 });
      jest.spyOn(prisma.userSession, 'create').mockResolvedValue({} as any);

      const result = await service.refreshTokens(refreshToken);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw UnauthorizedException for expired token', async () => {
      const refreshToken = 'expired-token';
      const session = {
        id: 'session-123',
        userId: 'user-123',
        tokenHash: crypto
          .createHash('sha256')
          .update(refreshToken)
          .digest('hex'),
        expiresAt: new Date(Date.now() - 3600000),
        user: mockUser,
      };

      jest
        .spyOn(prisma.userSession, 'findUnique')
        .mockResolvedValue(session as any);

      await expect(service.refreshTokens(refreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for inactive user', async () => {
      const refreshToken = 'valid-token';
      const session = {
        id: 'session-123',
        userId: 'user-123',
        tokenHash: crypto
          .createHash('sha256')
          .update(refreshToken)
          .digest('hex'),
        expiresAt: new Date(Date.now() + 3600000),
        user: { ...mockUser, isActive: false },
      };

      jest
        .spyOn(prisma.userSession, 'findUnique')
        .mockResolvedValue(session as any);

      await expect(service.refreshTokens(refreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('getCurrentUser', () => {
    it('should return user for valid userId', async () => {
      const userId = 'user-123';

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser as any);

      const result = await service.getCurrentUser(userId);

      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException for non-existent user', async () => {
      const userId = 'non-existent';

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      await expect(service.getCurrentUser(userId)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('forgotPassword', () => {
    it('should create OTP for existing user', async () => {
      const dto = { email: 'test@example.com' };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser as any);
      jest.spyOn(prisma.otpVerification, 'create').mockResolvedValue({} as any);

      const result = await service.forgotPassword(dto);

      expect(result).toHaveProperty('message');
      expect(prisma.otpVerification.create).toHaveBeenCalled();
    });

    it('should throw BadRequestException for non-existent user', async () => {
      const dto = { email: 'nonexistent@example.com' };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      await expect(service.forgotPassword(dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('resetPassword', () => {
    it('should reset password with valid token', async () => {
      const dto = {
        token: 'valid-token',
        password: 'newSecurePassword123',
        confirmPassword: 'newSecurePassword123',
      };

      const otpRecord = {
        id: 'otp-123',
        email: 'test@example.com',
        verifiedAt: new Date(),
        completedAt: null,
        expiresAt: new Date(Date.now() + 3600000),
      };

      jest
        .spyOn(prisma.otpVerification, 'findFirst')
        .mockResolvedValue(otpRecord as any);
      jest.spyOn(prisma.user, 'update').mockResolvedValue({} as any);
      jest.spyOn(prisma.otpVerification, 'update').mockResolvedValue({} as any);

      const result = await service.resetPassword(dto);

      expect(result).toEqual({ message: 'Password reset successful' });
      expect(prisma.user.update).toHaveBeenCalled();
    });

    it('should throw BadRequestException for invalid token', async () => {
      const dto = {
        token: 'invalid-token',
        password: 'password',
        confirmPassword: 'password',
      };

      jest.spyOn(prisma.otpVerification, 'findFirst').mockResolvedValue(null);

      await expect(service.resetPassword(dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
