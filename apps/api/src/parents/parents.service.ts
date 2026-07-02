import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../common/services/email.service';
import {
  CreateInviteLinkDto,
  LinkByCodeDto,
  ParentSendEmailOtpDto,
  ParentSendPhoneOtpDto,
  ParentVerifyEmailOtpDto,
  ParentVerifyPhoneOtpDto,
  ParentRegisterDto,
  AdminCreateParentLinkDto,
  AdminUpdateParentLinkStatusDto,
  AdminParentLinksQueryDto,
} from './dto/parents.dto';

@Injectable()
export class ParentsService {
  private readonly logger = new Logger(ParentsService.name);
  // In-memory store for phone OTPs: phone -> { otp, expiresAt, verified }
  private readonly phoneOtps = new Map<
    string,
    { otp: string; expiresAt: Date; verified: boolean }
  >();

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  /** Ensure Student record exists for a user, creating if missing. */
  private async ensureStudent(userId: string) {
    return this.prisma.student.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });
  }

  // ──────────────────────────────────────────────
  // Public endpoints
  // ──────────────────────────────────────────────

  async validateInviteCode(code: string) {
    // Try invite link token first
    const invite = await this.prisma.parentInvite.findFirst({
      where: { code },
      include: {
        student: {
          include: { user: { select: { name: true } } },
        },
      },
    });

    if (invite) {
      if (invite.status !== 'PENDING') {
        return { valid: false, alreadyUsed: true, message: 'This invite link has already been used.' };
      }
      if (invite.expiresAt && new Date() > invite.expiresAt) {
        return { valid: false, expired: true, message: 'This invite link has expired.' };
      }
      return {
        valid: true,
        email: invite.email,
        studentName: invite.student.user.name,
        relation: invite.relation,
      };
    }

    // Try family code
    const student = await this.prisma.student.findUnique({
      where: { familyCode: code },
      include: { user: { select: { name: true } } },
    });

    if (student) {
      return {
        valid: true,
        email: '',
        studentName: student.user.name,
        relation: null,
        isFamilyCode: true,
      };
    }

    return { valid: false, message: 'Invalid invite link or code.' };
  }

  // ──────────────────────────────────────────────
  // Student endpoints
  // ──────────────────────────────────────────────

  async createInviteLink(userId: string, dto: CreateInviteLinkDto) {
    const student = await this.ensureStudent(userId);

    const code = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await this.prisma.parentInvite.create({
      data: {
        studentId: student.id,
        email: dto.email,
        phone: dto.phone,
        relation: dto.relation,
        code,
        method: 'LINK',
        expiresAt,
      },
    });

    return {
      inviteUrl: `https://shiksha.study/invite/${code}`,
      code,
      expiresAt,
    };
  }

  async getFamilyCode(userId: string) {
    const student = await this.ensureStudent(userId);

    if (!student.familyCode) {
      const familyCode = await this.generateUniqueFamilyCode();
      await this.prisma.student.update({
        where: { id: student.id },
        data: { familyCode },
      });
      return { familyCode };
    }

    return { familyCode: student.familyCode };
  }

  async regenerateFamilyCode(userId: string) {
    const student = await this.ensureStudent(userId);

    const familyCode = await this.generateUniqueFamilyCode();
    await this.prisma.student.update({
      where: { id: student.id },
      data: { familyCode },
    });

    return { familyCode };
  }

  async getMyLinks(userId: string) {
    const student = await this.ensureStudent(userId);

    const links = await this.prisma.parentStudent.findMany({
      where: { studentId: student.id },
      include: {
        parent: {
          include: {
            user: {
              select: { id: true, email: true, name: true, phone: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return links;
  }

  async removeParentLink(userId: string, linkId: string) {
    const student = await this.ensureStudent(userId);

    const link = await this.prisma.parentStudent.findFirst({
      where: { id: linkId, studentId: student.id },
    });
    if (!link) {
      throw new NotFoundException('Parent link not found');
    }

    await this.prisma.parentStudent.delete({ where: { id: linkId } });
    return { message: 'Parent link removed successfully' };
  }

  // ──────────────────────────────────────────────
  // Parent endpoints
  // ──────────────────────────────────────────────

  async linkByCode(userId: string, dto: LinkByCodeDto) {
    const parent = await this.prisma.parent.findUnique({
      where: { userId },
    });
    if (!parent) {
      throw new BadRequestException('Parent profile not found');
    }

    const student = await this.prisma.student.findUnique({
      where: { familyCode: dto.familyCode },
    });
    if (!student) {
      throw new BadRequestException(
        'Code not found. Please check with your child.',
      );
    }

    // Check if already linked
    const existing = await this.prisma.parentStudent.findUnique({
      where: {
        parentId_studentId: {
          parentId: parent.id,
          studentId: student.id,
        },
      },
    });
    if (existing) {
      throw new BadRequestException('You are already linked to this student');
    }

    const link = await this.prisma.parentStudent.create({
      data: {
        parentId: parent.id,
        studentId: student.id,
        status: 'APPROVED',
        invitedBy: 'PARENT',
      },
    });

    return link;
  }

  async getChildren(userId: string) {
    const parent = await this.prisma.parent.findUnique({
      where: { userId },
    });
    if (!parent) {
      throw new BadRequestException('Parent profile not found');
    }

    const links = await this.prisma.parentStudent.findMany({
      where: { parentId: parent.id, status: 'APPROVED' },
      include: {
        student: {
          include: {
            user: { select: { name: true, email: true } },
            documents: { select: { id: true, status: true } },
            payments: { select: { id: true, status: true, amount: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return links.map((link) => ({
      id: link.student.id,
      name: link.student.user.name,
      email: link.student.user.email,
      relation: link.relation,
      currentStage: link.student.currentStage,
      applicationStatus: link.student.applicationStatus,
      documentsCount: link.student.documents.length,
      paymentsCount: link.student.payments.length,
    }));
  }

  // ──────────────────────────────────────────────
  // Parent Auth / Registration endpoints
  // ──────────────────────────────────────────────

  async sendEmailOtp(dto: ParentSendEmailOtpDto) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.prisma.otpVerification.create({
      data: {
        email: dto.email,
        name: dto.name,
        otp,
        expiresAt,
      },
    });

    try {
      await this.emailService.sendRegistrationOtp(dto.email, otp, dto.name);
    } catch (error) {
      this.logger.error(`Failed to send parent email OTP: ${(error as Error).message}`);
      throw error;
    }

    if (this.config.get('NODE_ENV') === 'development') {
      return { message: 'OTP sent to your email', devOtp: otp };
    }
    return { message: 'OTP sent to your email' };
  }

  async sendPhoneOtp(dto: ParentSendPhoneOtpDto) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Store phone OTP in-memory (V1 approach — can be moved to DB later)
    this.phoneOtps.set(dto.phone, { otp, expiresAt, verified: false });

    // In production, integrate with SMS provider (e.g., Twilio)
    this.logger.log(`Phone OTP for ${dto.phone}: ${otp}`);

    if (this.config.get('NODE_ENV') === 'development') {
      return { message: 'OTP sent to your phone', devOtp: otp };
    }
    return { message: 'OTP sent to your phone' };
  }

  async verifyEmailOtp(dto: ParentVerifyEmailOtpDto) {
    const record = await this.prisma.otpVerification.findFirst({
      where: {
        email: dto.email,
        otp: dto.otp,
        verifiedAt: null,
        completedAt: null,
        expiresAt: { gte: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) {
      throw new BadRequestException('Invalid or expired email OTP');
    }

    const token = crypto.randomUUID();

    await this.prisma.otpVerification.update({
      where: { id: record.id },
      data: { verifiedAt: new Date(), token },
    });

    return { message: 'Email OTP verified successfully', token };
  }

  async verifyPhoneOtp(dto: ParentVerifyPhoneOtpDto) {
    const stored = this.phoneOtps.get(dto.phone);
    if (!stored) {
      throw new BadRequestException('No OTP sent to this phone number');
    }

    if (new Date() > stored.expiresAt) {
      this.phoneOtps.delete(dto.phone);
      throw new BadRequestException('Phone OTP has expired');
    }

    if (stored.otp !== dto.otp) {
      throw new BadRequestException('Invalid phone OTP');
    }

    // Mark as verified
    stored.verified = true;
    this.phoneOtps.set(dto.phone, stored);

    const token = crypto.randomUUID();
    return { message: 'Phone OTP verified successfully', token };
  }

  async parentRegister(dto: ParentRegisterDto) {
    // Verify email OTP was completed
    const emailOtpRecord = await this.prisma.otpVerification.findFirst({
      where: {
        email: dto.email,
        verifiedAt: { not: null },
        completedAt: null,
        expiresAt: { gte: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!emailOtpRecord) {
      throw new BadRequestException(
        'Email not verified. Please verify your email OTP first.',
      );
    }

    // Verify phone OTP was completed
    const phoneStored = this.phoneOtps.get(dto.phone);
    if (!phoneStored || !phoneStored.verified) {
      throw new BadRequestException(
        'Phone not verified. Please verify your phone OTP first.',
      );
    }

    // Check existing user
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    // Create user with PARENT role
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        phone: dto.phone,
        passwordHash: hashedPassword,
        role: 'PARENT',
        emailVerified: true,
      },
    });

    // Create parent record
    const parent = await this.prisma.parent.create({
      data: { userId: user.id },
    });

    // Mark email OTP as completed
    await this.prisma.otpVerification.update({
      where: { id: emailOtpRecord.id },
      data: { completedAt: new Date() },
    });

    // Clean up phone OTP
    this.phoneOtps.delete(dto.phone);

    // Handle invite code if provided
    let linkedStudent: { id: string; name: string } | null = null;
    if (dto.inviteCode) {
      linkedStudent = await this.processInviteCode(
        parent.id,
        dto.inviteCode,
        dto.relation,
      );
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return {
      message: 'Parent registration successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      ...tokens,
      linkedStudent,
    };
  }

  private async processInviteCode(
    parentId: string,
    code: string,
    relation?: string,
  ) {
    // Try family code first
    const studentByCode = await this.prisma.student.findUnique({
      where: { familyCode: code },
      include: { user: { select: { name: true } } },
    });

    if (studentByCode) {
      // Check existing link
      const existing = await this.prisma.parentStudent.findUnique({
        where: {
          parentId_studentId: {
            parentId,
            studentId: studentByCode.id,
          },
        },
      });
      if (!existing) {
        await this.prisma.parentStudent.create({
          data: {
            parentId,
            studentId: studentByCode.id,
            relation,
            status: 'APPROVED',
            invitedBy: 'STUDENT',
          },
        });
      }
      return { id: studentByCode.id, name: studentByCode.user.name };
    }

    // Try invite link token
    const invite = await this.prisma.parentInvite.findFirst({
      where: {
        code,
        status: 'PENDING',
        expiresAt: { gte: new Date() },
      },
      include: {
        student: {
          include: { user: { select: { name: true } } },
        },
      },
    });

    if (invite) {
      const existing = await this.prisma.parentStudent.findUnique({
        where: {
          parentId_studentId: {
            parentId,
            studentId: invite.studentId,
          },
        },
      });
      if (!existing) {
        await this.prisma.parentStudent.create({
          data: {
            parentId,
            studentId: invite.studentId,
            relation: relation || invite.relation,
            status: 'APPROVED',
            invitedBy: 'STUDENT',
          },
        });
      }

      // Mark invite as accepted
      await this.prisma.parentInvite.update({
        where: { id: invite.id },
        data: { status: 'ACCEPTED' },
      });

      return { id: invite.student.id, name: invite.student.user.name };
    }

    // Code not found — not an error during registration, they can link later
    return null;
  }

  // ──────────────────────────────────────────────
  // Admin endpoints
  // ──────────────────────────────────────────────

  async adminFindAll(query: AdminParentLinksQueryDto) {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '20', 10);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.status) {
      where.status = query.status;
    }

    const [items, total] = await Promise.all([
      this.prisma.parentStudent.findMany({
        where,
        skip,
        take: limit,
        include: {
          parent: {
            include: {
              user: { select: { id: true, email: true, name: true } },
            },
          },
          student: {
            include: {
              user: { select: { id: true, email: true, name: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.parentStudent.count({ where }),
    ]);

    return {
      data: items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async adminCreateLink(dto: AdminCreateParentLinkDto) {
    // Resolve parent by email
    const parentUser = await this.prisma.user.findUnique({
      where: { email: dto.parentEmail },
    });
    if (!parentUser || parentUser.role !== 'PARENT') {
      throw new BadRequestException(
        `Parent not found with email: ${dto.parentEmail}`,
      );
    }
    const parent = await this.prisma.parent.findUnique({
      where: { userId: parentUser.id },
    });
    if (!parent) {
      throw new BadRequestException('Parent profile not found');
    }

    // Resolve student by email
    const studentUser = await this.prisma.user.findUnique({
      where: { email: dto.studentEmail },
    });
    if (!studentUser || studentUser.role !== 'STUDENT') {
      throw new BadRequestException(
        `Student not found with email: ${dto.studentEmail}`,
      );
    }
    const student = await this.ensureStudent(studentUser.id);

    // Check existing
    const existing = await this.prisma.parentStudent.findUnique({
      where: {
        parentId_studentId: {
          parentId: parent.id,
          studentId: student.id,
        },
      },
    });
    if (existing) {
      throw new BadRequestException('Link already exists between this parent and student');
    }

    const link = await this.prisma.parentStudent.create({
      data: {
        parentId: parent.id,
        studentId: student.id,
        relation: dto.relation,
        status: 'APPROVED',
        invitedBy: 'ADMIN',
      },
      include: {
        parent: {
          include: { user: { select: { name: true, email: true } } },
        },
        student: {
          include: { user: { select: { name: true, email: true } } },
        },
      },
    });

    return link;
  }

  async adminUpdateLinkStatus(id: string, dto: AdminUpdateParentLinkStatusDto) {
    const link = await this.prisma.parentStudent.findUnique({
      where: { id },
    });
    if (!link) {
      throw new NotFoundException('Parent link not found');
    }

    const updated = await this.prisma.parentStudent.update({
      where: { id },
      data: { status: dto.status as any },
      include: {
        parent: {
          include: { user: { select: { name: true, email: true } } },
        },
        student: {
          include: { user: { select: { name: true, email: true } } },
        },
      },
    });

    return updated;
  }

  async adminDeleteLink(id: string) {
    const link = await this.prisma.parentStudent.findUnique({
      where: { id },
    });
    if (!link) {
      throw new NotFoundException('Parent link not found');
    }

    await this.prisma.parentStudent.delete({ where: { id } });
    return { message: 'Parent link removed successfully' };
  }

  // ──────────────────────────────────────────────
  // Helpers
  // ──────────────────────────────────────────────

  private async generateUniqueFamilyCode(): Promise<string> {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let attempt = 0; attempt < 10; attempt++) {
      let code = '';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      const existing = await this.prisma.student.findUnique({
        where: { familyCode: code },
        select: { id: true },
      });
      if (!existing) return code;
    }
    // Extremely unlikely — fallback to 7-char
    let code = '';
    for (let i = 0; i < 7; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  private async generateTokens(user: any) {
    const payload = {
      sub: user.id,
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = crypto.randomUUID();
    const refreshHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    await this.prisma.userSession.create({
      data: {
        userId: user.id,
        tokenHash: refreshHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken, refreshToken };
  }
}
