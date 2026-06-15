import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import * as crypto from "crypto";
import { Resend } from "resend";
import { PrismaService } from "../prisma/prisma.service";
import { EmailValidationService } from "../common/services/email-validation.service";
import {
  LoginDto,
  SendOtpDto,
  VerifyOtpDto,
  CompleteRegistrationDto,
  CreateAdminDto,
  GoogleAuthDto,
  GoogleRegisterDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from "./auth.dto";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  private resend: Resend;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailValidation: EmailValidationService
  ) {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendOtp(dto: SendOtpDto) {
    await this.emailValidation.validateEmailAsync(dto.email);

    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new BadRequestException("Email already registered");
    }

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
      await this.resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
        to: dto.email,
        subject: "Your OTP for Study Hire Global",
        html: `<p>Your OTP is: <strong>${otp}</strong></p><p>This OTP expires in 10 minutes.</p>`,
      });
    } catch (error) {
      this.logger.error(`Failed to send OTP email: ${error.message}`);
      throw new BadRequestException("Failed to send OTP email");
    }

    if (process.env.NODE_ENV === "development") {
      return { message: "OTP sent to your email", devOtp: otp };
    }
    return { message: "OTP sent to your email" };
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
      orderBy: { createdAt: "desc" },
    });

    if (!record) {
      throw new BadRequestException("Invalid or expired OTP");
    }

    const token = crypto.randomUUID();

    await this.prisma.otpVerification.update({
      where: { id: record.id },
      data: { verifiedAt: new Date(), token },
    });

    return { message: "OTP verified successfully", token };
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
      throw new BadRequestException("Invalid or expired registration token");
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: record.email },
    });
    if (existingUser) {
      throw new BadRequestException("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const role = dto.role === "PARENT" ? "PARENT" : "STUDENT";

    const user = await this.prisma.user.create({
      data: {
        email: record.email,
        name: record.name!,
        passwordHash: hashedPassword,
        emailVerified: true,
        role,
      },
    });

    if (role === "PARENT") {
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

    const { accessToken, refreshToken } = await this.generateTokens(user);

    return {
      message: "Registration successful",
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
      throw new UnauthorizedException("Invalid credentials");
    }

    if (!user.passwordHash) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const { accessToken, refreshToken } = await this.generateTokens(user);

    return {
      message: "Login successful",
      user,
      accessToken,
      refreshToken,
    };
  }

  async googleLogin(dto: GoogleAuthDto) {
    this.logger.log(
      `Google login attempt with token: ${dto.accessToken?.substring(0, 20)}...`
    );

    const userInfo = await this.verifyGoogleToken(dto.accessToken);
    this.logger.debug(
      `Google token verification result: ${JSON.stringify(userInfo)}`
    );

    if (!userInfo) {
      this.logger.warn("Invalid Google token");
      throw new UnauthorizedException("Invalid Google token");
    }

    this.logger.log(`Google user info: ${userInfo.email}, ${userInfo.name}`);

    let user = await this.prisma.user.findUnique({
      where: { email: userInfo.email },
    });

    if (!user) {
      this.logger.log(`User not found, auto-registering: ${userInfo.email}`);
      user = await this.prisma.user.create({
        data: {
          email: userInfo.email,
          name: userInfo.name || userInfo.email.split("@")[0],
          emailVerified: true,
          role: "STUDENT",
          isActive: true,
        },
      });

      await this.prisma.student.create({
        data: {
          userId: user.id,
        },
      });

      this.logger.log(`Auto-registered user: ${user.id}`);
    }

    const { accessToken, refreshToken } = await this.generateTokens(user);
    this.logger.log(`Login successful for user: ${user.id}`);

    return {
      message: "Google login successful",
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
      throw new BadRequestException("User already registered with this email");
    }

    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        phone: dto.phone,
        emailVerified: true,
        role: "STUDENT",
        isActive: true,
      },
    });

    await this.prisma.student.create({
      data: {
        userId: newUser.id,
      },
    });

    const { accessToken, refreshToken } = await this.generateTokens(newUser);
    this.logger.log(`Registration successful for user: ${newUser.id}`);

    return {
      message: "Google registration successful",
      user: newUser,
      accessToken,
      refreshToken,
    };
  }

  async logout(refreshToken: string) {
    const hash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    await this.prisma.userSession.deleteMany({ where: { tokenHash: hash } });
    return { message: "Logged out successfully" };
  }

  async refreshTokens(refreshToken: string) {
    const hash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    const session = await this.prisma.userSession.findUnique({
      where: { tokenHash: hash },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }

    if (!session.user.isActive) {
      throw new UnauthorizedException("Account is deactivated");
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
      message: "Tokens refreshed successfully",
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
      throw new UnauthorizedException("User not found");
    }

    return user;
  }

  async createAdmin(dto: CreateAdminDto) {
    this.emailValidation.validateEmail(dto.email);

    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException("User already exists");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        phone: dto.phone,
        passwordHash: hashedPassword,
        role: "ADMIN",
        emailVerified: true,
        isActive: true,
      },
    });

    return { message: "Admin created successfully", user };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new BadRequestException("No account found with this email");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.prisma.otpVerification.create({
      data: {
        email: dto.email,
        name: user.name,
        otp,
        expiresAt,
      },
    });

    try {
      await this.resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
        to: dto.email,
        subject: "Password Reset OTP - Study Hire Global",
        html: `<p>Your password reset OTP is: <strong>${otp}</strong></p><p>This OTP expires in 10 minutes.</p>`,
      });
    } catch (error) {
      this.logger.error(`Failed to send password reset OTP email: ${error.message}`);
      throw new BadRequestException("Failed to send OTP email");
    }

    if (process.env.NODE_ENV === "development") {
      return { message: "Password reset OTP sent to your email", devOtp: otp };
    }
    return { message: "Password reset OTP sent to your email" };
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
      throw new BadRequestException("Invalid or expired reset token");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    await this.prisma.user.update({
      where: { email: record.email },
      data: { passwordHash: hashedPassword },
    });

    await this.prisma.otpVerification.update({
      where: { id: record.id },
      data: { completedAt: new Date() },
    });

    return { message: "Password reset successful" };
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
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

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
      if (token.startsWith("4/") || token.startsWith("1/")) {
        this.logger.debug(
          "Token is an authorization code, exchanging for access token..."
        );

        const tokenResponse = await fetch(
          "https://oauth2.googleapis.com/token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              code: token,
              client_id: process.env.GOOGLE_CLIENT_ID || "",
              client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
              redirect_uri: "http://localhost:3000/auth/callback",
              grant_type: "authorization_code",
            }),
          }
        );

        if (!tokenResponse.ok) {
          const errorData = await tokenResponse.json();
          this.logger.error(
            `Token exchange failed: ${JSON.stringify(errorData)}`
          );
          return null;
        }

        const tokenData = await tokenResponse.json();
        this.logger.debug(`Token exchange successful`);
        accessToken = tokenData.access_token;

        // If we got an ID token, use it for better user info
        if (tokenData.id_token) {
          this.logger.debug("ID token received, decoding...");
          const idTokenPayload = JSON.parse(
            Buffer.from(tokenData.id_token.split(".")[1], "base64").toString()
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
      const isIdToken = accessToken.split(".").length === 3;

      if (isIdToken) {
        // ID token - verify with Google's tokeninfo endpoint
        this.logger.debug("Token appears to be an ID token, verifying...");
        const response = await fetch(
          `https://oauth2.googleapis.com/tokeninfo?id_token=${accessToken}`
        );

        if (!response.ok) {
          this.logger.warn(`ID token verification failed: ${response.status}`);
          return null;
        }

        const tokenInfo = await response.json();
        this.logger.debug(`Token info: ${JSON.stringify(tokenInfo)}`);

        // Verify the audience matches our client ID
        const expectedAudience = process.env.GOOGLE_CLIENT_ID;
        if (tokenInfo.aud !== expectedAudience) {
          this.logger.warn(
            `Token audience mismatch: ${tokenInfo.aud} !== ${expectedAudience}`
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
          "Token appears to be an access token, fetching user info..."
        );
        const response = await fetch(
          `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          this.logger.warn(
            `Access token verification failed: ${response.status}`
          );
          return null;
        }

        const userInfo = await response.json();
        this.logger.debug(`User info: ${JSON.stringify(userInfo)}`);
        return userInfo;
      }
    } catch (error) {
      this.logger.error(`Google token verification error: ${error.message}`);
      return null;
    }
  }
}
