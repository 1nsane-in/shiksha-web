import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import {
  RegisterDto,
  LoginDto,
  SendOtpDto,
  VerifyOtpDto,
  CreateAdminDto,
  GoogleAuthDto,
  GoogleRegisterDto,
} from "./auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async sendOtp(dto: SendOtpDto) {
    // TODO: Implement OTP sending with email service (ZeptoMail/Twilio)
    return { message: "OTP sent to your email" };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    // TODO: Implement OTP verification
    return { message: "OTP verified successfully" };
  }

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException("User already exists");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        phone: dto.phone,
        passwordHash: hashedPassword,
        emailVerified: true,
        role: "STUDENT",
      },
    });

    await this.prisma.student.create({
      data: {
        userId: newUser.id,
      },
    });

    const token = this.generateToken(newUser);

    return { message: "Registration successful", user: newUser, token };
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

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const token = this.generateToken(user);

    return {
      message: "Login successful",
      user,
      token,
    };
  }

  async googleLogin(dto: GoogleAuthDto) {
    // Verify Google token
    const userInfo = await this.verifyGoogleToken(dto.accessToken);

    if (!userInfo) {
      throw new UnauthorizedException("Invalid Google token");
    }

    // Find or create user
    let user = await this.prisma.user.findUnique({
      where: { email: userInfo.email },
    });

    if (!user) {
      throw new BadRequestException(
        "User not registered. Please register first."
      );
    }

    const token = this.generateToken(user);

    return {
      message: "Google login successful",
      user,
      token,
    };
  }

  async googleRegister(dto: GoogleRegisterDto) {
    const existingEmailUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingEmailUser) {
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

    const token = this.generateToken(newUser);

    return {
      message: "Google registration successful",
      user: newUser,
      token,
    };
  }

  async logout(token: string) {
    // TODO: Add token to blacklist if needed
    return { message: "Logged out successfully" };
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

  async forgotPassword(email: string) {
    // TODO: Implement password reset email
    return { message: "Password reset email sent" };
  }

  async resetPassword(token: string, newPassword: string) {
    // TODO: Implement password reset with token verification
    return { message: "Password reset successful" };
  }

  private generateToken(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }

  private async verifyGoogleToken(accessToken: string): Promise<any> {
    try {
      // Verify token with Google's API
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        return null;
      }

      const userInfo = await response.json();
      return userInfo;
    } catch (error) {
      return null;
    }
  }
}
