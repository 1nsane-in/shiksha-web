import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { ParentsController } from '../../src/parents/parents.controller';
import { ParentsAuthController } from '../../src/parents/parents-auth.controller';
import { ParentsAdminController } from '../../src/parents/parents-admin.controller';
import { ParentsService } from '../../src/parents/parents.service';

/* ── Mock service ── */
const mockParentsService = {
  validateInviteCode: jest.fn(),
  createInviteLink: jest.fn(),
  getFamilyCode: jest.fn(),
  regenerateFamilyCode: jest.fn(),
  getMyLinks: jest.fn(),
  removeParentLink: jest.fn(),
  linkByCode: jest.fn(),
  getChildren: jest.fn(),
  sendEmailOtp: jest.fn(),
  sendPhoneOtp: jest.fn(),
  verifyEmailOtp: jest.fn(),
  verifyPhoneOtp: jest.fn(),
  parentRegister: jest.fn(),
  adminFindAll: jest.fn(),
  adminCreateLink: jest.fn(),
  adminUpdateLinkStatus: jest.fn(),
  adminDeleteLink: jest.fn(),
};

/* ── Mock guard dependencies (JwtAuthGuard is global) ── */
const mockJwtService = { verifyAsync: jest.fn(), sign: jest.fn() };
const mockConfigService = { get: jest.fn() };

/* ── Shared fixtures ── */
const userId = 'user-1';
const linkId = 'link-1';

// ──────────────────────────────────────────────
// ParentsController
// ──────────────────────────────────────────────
describe('ParentsController', () => {
  let controller: ParentsController;
  let service: typeof mockParentsService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParentsController],
      providers: [
        { provide: ParentsService, useValue: mockParentsService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        Reflector,
      ],
    }).compile();

    controller = module.get<ParentsController>(ParentsController);
    service = mockParentsService;
  });

  describe('GET invite/:code (Public)', () => {
    it('should validate an invite code', async () => {
      const result = { valid: true, studentName: 'S' };
      service.validateInviteCode.mockResolvedValue(result);

      const res = await controller.validateInviteCode('abc-123');

      expect(service.validateInviteCode).toHaveBeenCalledWith('abc-123');
      expect(res).toEqual(result);
    });
  });

  describe('POST invite-link (STUDENT)', () => {
    it('should create an invite link', async () => {
      const dto = { email: 'p@e.com', relation: 'FATHER' };
      const result = { inviteUrl: 'https://shiksha.study/invite/uuid' };
      service.createInviteLink.mockResolvedValue(result);

      const res = await controller.createInviteLink(userId, dto);

      expect(service.createInviteLink).toHaveBeenCalledWith(userId, dto);
      expect(res).toEqual(result);
    });
  });

  describe('GET family-code (STUDENT)', () => {
    it('should return family code', async () => {
      service.getFamilyCode.mockResolvedValue({ familyCode: 'ABC123' });

      const res = await controller.getFamilyCode(userId);

      expect(service.getFamilyCode).toHaveBeenCalledWith(userId);
      expect(res.familyCode).toBe('ABC123');
    });
  });

  describe('POST regenerate-family-code (STUDENT)', () => {
    it('should regenerate family code', async () => {
      service.regenerateFamilyCode.mockResolvedValue({ familyCode: 'NEW456' });

      const res = await controller.regenerateFamilyCode(userId);

      expect(service.regenerateFamilyCode).toHaveBeenCalledWith(userId);
      expect(res.familyCode).toBe('NEW456');
    });
  });

  describe('GET my-links (STUDENT)', () => {
    it('should return linked parents', async () => {
      const links = [{ id: 'l-1', status: 'APPROVED' }];
      service.getMyLinks.mockResolvedValue(links);

      const res = await controller.getMyLinks(userId);

      expect(service.getMyLinks).toHaveBeenCalledWith(userId);
      expect(res).toEqual(links);
    });
  });

  describe('DELETE link/:id (STUDENT)', () => {
    it('should remove a parent link', async () => {
      service.removeParentLink.mockResolvedValue({
        message: 'Parent link removed successfully',
      });

      const res = await controller.removeLink(userId, linkId);

      expect(service.removeParentLink).toHaveBeenCalledWith(userId, linkId);
      expect(res.message).toBe('Parent link removed successfully');
    });
  });

  describe('POST link-by-code (PARENT)', () => {
    it('should link parent to student via family code', async () => {
      const dto = { familyCode: 'ABC123' };
      const result = { id: 'link-1', status: 'APPROVED' };
      service.linkByCode.mockResolvedValue(result);

      const res = await controller.linkByCode(userId, dto);

      expect(service.linkByCode).toHaveBeenCalledWith(userId, dto);
      expect(res).toEqual(result);
    });
  });

  describe('GET children (PARENT)', () => {
    it('should return children list', async () => {
      const children = [{ id: 's-1', name: 'Kid' }];
      service.getChildren.mockResolvedValue(children);

      const res = await controller.getChildren(userId);

      expect(service.getChildren).toHaveBeenCalledWith(userId);
      expect(res).toEqual(children);
    });
  });
});

// ──────────────────────────────────────────────
// ParentsAuthController
// ──────────────────────────────────────────────
describe('ParentsAuthController', () => {
  let controller: ParentsAuthController;
  let service: typeof mockParentsService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParentsAuthController],
      providers: [
        { provide: ParentsService, useValue: mockParentsService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        Reflector,
      ],
    }).compile();

    controller = module.get<ParentsAuthController>(ParentsAuthController);
    service = mockParentsService;
  });

  describe('POST parent-send-email-otp (Public)', () => {
    it('should send email OTP', async () => {
      const dto = { email: 'p@e.com', name: 'Parent' };
      service.sendEmailOtp.mockResolvedValue({ message: 'OTP sent' });

      const res = await controller.sendEmailOtp(dto);

      expect(service.sendEmailOtp).toHaveBeenCalledWith(dto);
      expect(res.message).toBe('OTP sent');
    });
  });

  describe('POST parent-send-phone-otp (Public)', () => {
    it('should send phone OTP', async () => {
      const dto = { phone: '+919876543210' };
      service.sendPhoneOtp.mockResolvedValue({ message: 'OTP sent' });

      const res = await controller.sendPhoneOtp(dto);

      expect(service.sendPhoneOtp).toHaveBeenCalledWith(dto);
      expect(res.message).toBe('OTP sent');
    });
  });

  describe('POST parent-verify-email-otp (Public)', () => {
    it('should verify email OTP', async () => {
      const dto = { email: 'p@e.com', otp: '123456' };
      service.verifyEmailOtp.mockResolvedValue({
        message: 'Verified',
        token: 'tok',
      });

      const res = await controller.verifyEmailOtp(dto);

      expect(service.verifyEmailOtp).toHaveBeenCalledWith(dto);
      expect(res.token).toBe('tok');
    });
  });

  describe('POST parent-verify-phone-otp (Public)', () => {
    it('should verify phone OTP', async () => {
      const dto = { phone: '+919876543210', otp: '654321' };
      service.verifyPhoneOtp.mockResolvedValue({
        message: 'Verified',
        token: 'tok',
      });

      const res = await controller.verifyPhoneOtp(dto);

      expect(service.verifyPhoneOtp).toHaveBeenCalledWith(dto);
      expect(res.token).toBe('tok');
    });
  });

  describe('POST parent-register (Public)', () => {
    it('should register parent', async () => {
      const dto = {
        email: 'p@e.com',
        name: 'Parent',
        phone: '+919876543210',
        password: 'pass123',
        confirmPassword: 'pass123',
      };
      service.parentRegister.mockResolvedValue({
        message: 'Registration successful',
        user: { id: 'u-1' },
        accessToken: 'at',
        refreshToken: 'rt',
      });

      const res = await controller.parentRegister(dto);

      expect(service.parentRegister).toHaveBeenCalledWith(dto);
      expect(res.accessToken).toBe('at');
    });
  });
});

// ──────────────────────────────────────────────
// ParentsAdminController
// ──────────────────────────────────────────────
describe('ParentsAdminController', () => {
  let controller: ParentsAdminController;
  let service: typeof mockParentsService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParentsAdminController],
      providers: [
        { provide: ParentsService, useValue: mockParentsService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        Reflector,
      ],
    }).compile();

    controller = module.get<ParentsAdminController>(ParentsAdminController);
    service = mockParentsService;
  });

  describe('GET / (ADMIN)', () => {
    it('should return paginated links with query', async () => {
      const query = { page: '1', limit: '10', status: 'APPROVED' };
      const paginated = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };
      service.adminFindAll.mockResolvedValue(paginated);

      const res = await controller.findAll(query);

      expect(service.adminFindAll).toHaveBeenCalledWith(query);
      expect(res).toEqual(paginated);
    });
  });

  describe('POST / (ADMIN)', () => {
    it('should create a parent-student link', async () => {
      const dto = {
        parentEmail: 'p@e.com',
        studentEmail: 's@e.com',
        relation: 'FATHER',
      };
      const result = { id: 'link-1', status: 'APPROVED' };
      service.adminCreateLink.mockResolvedValue(result);

      const res = await controller.create(dto);

      expect(service.adminCreateLink).toHaveBeenCalledWith(dto);
      expect(res).toEqual(result);
    });
  });

  describe('PATCH :id (ADMIN)', () => {
    it('should update link status', async () => {
      const dto = { status: 'REJECTED' };
      const updated = { id: 'link-1', status: 'REJECTED' };
      service.adminUpdateLinkStatus.mockResolvedValue(updated);

      const res = await controller.updateStatus('link-1', dto);

      expect(service.adminUpdateLinkStatus).toHaveBeenCalledWith(
        'link-1',
        dto,
      );
      expect(res.status).toBe('REJECTED');
    });
  });

  describe('DELETE :id (ADMIN)', () => {
    it('should delete a link', async () => {
      service.adminDeleteLink.mockResolvedValue({
        message: 'Parent link removed successfully',
      });

      const res = await controller.remove('link-1');

      expect(service.adminDeleteLink).toHaveBeenCalledWith('link-1');
      expect(res.message).toBe('Parent link removed successfully');
    });
  });
});
