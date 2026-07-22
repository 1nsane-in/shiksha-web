import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { EmailValidationService } from '../common/services/email-validation.service';
import { EmailService } from '../common/services/email.service';
import {
  LoginDto,
  SendOtpDto,
  VerifyOtpDto,
  CompleteRegistrationDto,
  AuthCreateAdminDto,
  GoogleAuthDto,
  GoogleRegisterDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  SocialRole,
} from './auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private redis: RedisService,
    private emailValidation: EmailValidationService,
    private emailService: EmailService,
    private config: ConfigService,
  ) {}

  async sendOtp(dto: SendOtpDto) {
    await this.emailValidation.validateEmailAsync(dto.email);

    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const otpRecord = await this.prisma.otpVerification.create({
      data: {
        email: dto.email,
        name: dto.name,
        otp,
        expiresAt,
      },
    });

    const isDev = this.config.get('NODE_ENV') === 'development';

    try {
      await this.emailService.sendRegistrationOtp(dto.email, otp, dto.name);
    } catch (error) {
      this.logger.error(
        `Failed to send OTP email: ${(error as Error).message}`,
      );
      // Clean up OTP record regardless of env
      await this.prisma.otpVerification.delete({ where: { id: otpRecord.id } });
      if (!isDev) {
        throw error;
      }
      // Dev: log warning but proceed — devOtp returned for testing
      this.logger.warn('Dev mode: continuing without email send');
    }

    if (isDev) {
      return { message: 'OTP sent to your email', devOtp: otp };
    }
    return { message: 'OTP sent to your email' };
  }

  async verifyOtp(dto: VerifyOtpDto) {
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
      throw new BadRequestException('Invalid or expired OTP');
    }

    const token = crypto.randomUUID();

    await this.prisma.otpVerification.update({
      where: { id: record.id },
      data: { verifiedAt: new Date(), token },
    });

    return { message: 'OTP verified successfully', token };
  }

  async completeRegistration(dto: CompleteRegistrationDto) {
    const record = await this.prisma.otpVerification.findFirst({
      where: {
        token: dto.token,
        verifiedAt: { not: null },
        completedAt: null,
        expiresAt: { gte: new Date() },
      },
    });

    if (!record) {
      throw new BadRequestException('Invalid or expired registration token');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: record.email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 8);
    const role = dto.role === 'PARENT' ? 'PARENT' : 'STUDENT';

    const user = await this.prisma.user.create({
      data: {
        email: record.email,
        name: record.name!,
        passwordHash: hashedPassword,
        emailVerified: true,
        role,
      },
    });

    if (role === 'PARENT') {
      await this.prisma.parent.create({
        data: { userId: user.id },
      });
    } else {
      await this.prisma.student.create({
        data: { userId: user.id },
      });
    }

    await this.prisma.otpVerification.update({
      where: { id: record.id },
      data: { completedAt: new Date() },
    });

    // Send welcome email (don't block on failure)
    this.emailService.sendWelcomeEmail(user.email, user.name).catch((err) => {
      this.logger.error(`Failed to send welcome email: ${err.message}`);
    });

    const { accessToken, refreshToken } = await this.generateTokens(user);

    return {
      message: 'Registration successful',
      user,
      accessToken,
      refreshToken,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Account lockout: check failed attempts before comparing password
    const lockoutKey = `lockout:email:${dto.email}`;
    const maxAttempts = 5;
    const lockoutDuration = 15 * 60; // 15 minutes
    const attempts = await this.redis.get<number>(lockoutKey);
    if (attempts && attempts >= maxAttempts) {
      const ttl = await this.redis.ttl(lockoutKey);
      throw new UnauthorizedException(
        `Account temporarily locked. Try again in ${Math.ceil(ttl / 60)} minutes.`,
      );
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      // Increment failed attempt counter; set TTL on first failure
      const newCount = await this.redis.incr(lockoutKey);
      if (newCount === 1) {
        await this.redis.expire(lockoutKey, lockoutDuration);
      }
      throw new UnauthorizedException('Invalid credentials');
    }

    // Successful login — clear lockout counter
    await this.redis.del(lockoutKey);

    const { accessToken, refreshToken } = await this.generateTokens(user);

    return {
      message: 'Login successful',
      user,
      accessToken,
      refreshToken,
    };
  }

  async googleLogin(dto: GoogleAuthDto) {
    this.logger.log(
      `Google login attempt with token: ${dto.accessToken?.substring(0, 20)}...`,
    );

    const userInfo = await this.verifyGoogleToken(dto.accessToken);
    this.logger.debug(
      `Google token verification result: ${JSON.stringify(userInfo)}`,
    );

    if (!userInfo) {
      this.logger.warn('Invalid Google token');
      throw new UnauthorizedException('Invalid Google token');
    }

    this.logger.log(`Google user info: ${userInfo.email}, ${userInfo.name}`);

    let user = await this.prisma.user.findUnique({
      where: { email: userInfo.email },
    });

    if (!user) {
      const requestedRole: SocialRole =
        dto.role === 'PARENT' ? 'PARENT' : 'STUDENT';
      this.logger.log(
        `User not found, auto-registering as ${requestedRole}: ${userInfo.email}`,
      );
      user = await this.prisma.user.create({
        data: {
          email: userInfo.email,
          name: userInfo.name || userInfo.email.split('@')[0],
          emailVerified: true,
          role: requestedRole,
          isActive: true,
        },
      });

      if (requestedRole === 'PARENT') {
        await this.prisma.parent.create({ data: { userId: user.id } });
      } else {
        await this.prisma.student.create({ data: { userId: user.id } });
      }

      this.logger.log(`Auto-registered user: ${user.id}`);
    }

    const { accessToken, refreshToken } = await this.generateTokens(user);
    this.logger.log(`Login successful for user: ${user.id}`);

    return {
      message: 'Google login successful',
      user,
      accessToken,
      refreshToken,
    };
  }

  async googleRegister(dto: GoogleRegisterDto) {
    this.logger.log(`Google register attempt for: ${dto.email}`);
    this.emailValidation.validateEmail(dto.email);

    const existingEmailUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingEmailUser) {
      this.logger.warn(`User already exists: ${dto.email}`);
      throw new BadRequestException('User already registered with this email');
    }

    const role: SocialRole = dto.role === 'PARENT' ? 'PARENT' : 'STUDENT';

    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        phone: dto.phone,
        emailVerified: true,
        role,
        isActive: true,
      },
    });

    if (role === 'PARENT') {
      await this.prisma.parent.create({ data: { userId: newUser.id } });
    } else {
      await this.prisma.student.create({ data: { userId: newUser.id } });
    }

    const { accessToken, refreshToken } = await this.generateTokens(newUser);
    this.logger.log(`Registration successful for user: ${newUser.id}`);

    return {
      message: 'Google registration successful',
      user: newUser,
      accessToken,
      refreshToken,
    };
  }

  async logout(refreshToken: string) {
    const hash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await this.prisma.userSession.deleteMany({ where: { tokenHash: hash } });
    return { message: 'Logged out successfully' };
  }

  async refreshTokens(refreshToken: string) {
    const hash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    const session = await this.prisma.userSession.findUnique({
      where: { tokenHash: hash },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (!session.user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Grace period: keep old session valid for 30s instead of deleting immediately.
    // Prevents multi-tab logout race: if Tab B tries to refresh with the same
    // old token while Tab A's refresh is in-flight, it can still find the session.
    await this.prisma.userSession.update({
      where: { id: session.id },
      data: { expiresAt: new Date(Date.now() + 30 * 1000) },
    });

    // Cleanup: garbage-collect fully expired sessions
    await this.prisma.userSession.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });

    const { accessToken, refreshToken: newRefreshToken } =
      await this.generateTokens(session.user);

    return {
      message: 'Tokens refreshed successfully',
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        student: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async createAdmin(dto: AuthCreateAdminDto) {
    this.emailValidation.validateEmail(dto.email);

    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 8);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        phone: dto.phone,
        passwordHash: hashedPassword,
        role: 'ADMIN',
        emailVerified: true,
        isActive: true,
      },
    });

    return { message: 'Admin created successfully', user };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new BadRequestException('No account found with this email');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const otpRecord = await this.prisma.otpVerification.create({
      data: {
        email: dto.email,
        name: user.name,
        otp,
        expiresAt,
      },
    });

    try {
      await this.emailService.sendPasswordResetOtp(dto.email, otp, user.name);
    } catch (error) {
      this.logger.error(
        `Failed to send password reset OTP email: ${(error as Error).message}`,
      );
      // Clean up the OTP record if email fails
      await this.prisma.otpVerification.delete({ where: { id: otpRecord.id } });
      throw error;
    }

    if (this.config.get('NODE_ENV') === 'development') {
      return { message: 'Password reset OTP sent to your email', devOtp: otp };
    }
    return { message: 'Password reset OTP sent to your email' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const record = await this.prisma.otpVerification.findFirst({
      where: {
        token: dto.token,
        verifiedAt: { not: null },
        completedAt: null,
        expiresAt: { gte: new Date() },
      },
    });

    if (!record) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 8);

    // Get user info for email
    const user = await this.prisma.user.findUnique({
      where: { email: record.email },
    });

    await this.prisma.user.update({
      where: { email: record.email },
      data: { passwordHash: hashedPassword },
    });

    await this.prisma.otpVerification.update({
      where: { id: record.id },
      data: { completedAt: new Date() },
    });

    // Send password changed confirmation (don't block on failure)
    if (user) {
      this.emailService
        .sendPasswordChangedEmail(user.email, user.name)
        .catch((err) => {
          this.logger.error(
            `Failed to send password changed email: ${err.message}`,
          );
        });
    }

    return { message: 'Password reset successful' };
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

  private async verifyGoogleToken(token: string): Promise<any> {
    try {
      this.logger.debug(`Verifying Google token...`);

      let accessToken = token;

      // If it's an authorization code (starts with 4/), exchange it for tokens
      if (token.startsWith('4/') || token.startsWith('1/')) {
        this.logger.debug(
          'Token is an authorization code, exchanging for access token...',
        );

        const tokenResponse = await fetch(
          'https://oauth2.googleapis.com/token',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              code: token,
              client_id: this.config.get<string>('GOOGLE_CLIENT_ID', ''),
              client_secret: this.config.get<string>(
                'GOOGLE_CLIENT_SECRET',
                '',
              ),
              redirect_uri: this.config.get<string>(
                'GOOGLE_REDIRECT_URI',
                'http://localhost:3000/auth/callback',
              ),
              grant_type: 'authorization_code',
            }),
          },
        );

        if (!tokenResponse.ok) {
          const errorData = await tokenResponse.json();
          this.logger.error(
            `Token exchange failed: ${JSON.stringify(errorData)}`,
          );
          return null;
        }

        const tokenData = await tokenResponse.json();
        this.logger.debug(`Token exchange successful`);
        accessToken = tokenData.access_token;

        // If we got an ID token, use it for better user info
        if (tokenData.id_token) {
          this.logger.debug('ID token received, decoding...');
          const idTokenPayload = JSON.parse(
            Buffer.from(tokenData.id_token.split('.')[1], 'base64').toString(),
          );
          return {
            sub: idTokenPayload.sub,
            email: idTokenPayload.email,
            name: idTokenPayload.name,
            picture: idTokenPayload.picture,
            email_verified: idTokenPayload.email_verified,
          };
        }
      }

      // Check if it's an ID token (JWT format)
      const isIdToken = accessToken.split('.').length === 3;

      if (isIdToken) {
        // ID token - verify with Google's tokeninfo endpoint
        this.logger.debug('Token appears to be an ID token, verifying...');
        const response = await fetch(
          `https://oauth2.googleapis.com/tokeninfo?id_token=${accessToken}`,
        );

        if (!response.ok) {
          this.logger.warn(`ID token verification failed: ${response.status}`);
          return null;
        }

        const tokenInfo = await response.json();
        this.logger.debug(`Token info: ${JSON.stringify(tokenInfo)}`);

        // Verify the audience matches our client ID
        const expectedAudience = this.config.get('GOOGLE_CLIENT_ID');
        if (tokenInfo.aud !== expectedAudience) {
          this.logger.warn(
            `Token audience mismatch: ${tokenInfo.aud} !== ${expectedAudience}`,
          );
          return null;
        }

        return {
          sub: tokenInfo.sub,
          email: tokenInfo.email,
          name: tokenInfo.name,
          picture: tokenInfo.picture,
          email_verified: tokenInfo.email_verified,
        };
      } else {
        // Access token - get user info
        this.logger.debug(
          'Token appears to be an access token, fetching user info...',
        );
        const response = await fetch(
          `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (!response.ok) {
          this.logger.warn(
            `Access token verification failed: ${response.status}`,
          );
          return null;
        }

        const userInfo = await response.json();
        this.logger.debug(`User info: ${JSON.stringify(userInfo)}`);
        return userInfo;
      }
    } catch (error) {
      this.logger.error(
        `Google token verification error: ${(error as Error).message}`,
      );
      return null;
    }
  }
}
