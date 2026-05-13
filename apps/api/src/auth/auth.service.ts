import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto, SendOtpDto, VerifyOtpDto, CreateAdminDto } from './auth.dto';

@Injectable()
export class AuthService {
  private supabase;

  constructor(private prisma: PrismaService) {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!,
    );
  }

  async sendOtp(dto: SendOtpDto) {
    const { error } = await this.supabase.auth.signInWithOtp({
      email: dto.email,
      options: {
        shouldCreateUser: true,
      },
    });

    if (error) {
      throw new BadRequestException(error.message);
    }

    return { message: 'OTP sent to your email' };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const { data, error } = await this.supabase.auth.verifyOtp({
      email: dto.email,
      token: dto.otp,
      type: 'email',
    });

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    return {
      message: 'OTP verified successfully',
      session: data.session,
    };
  }

  async register(dto: RegisterDto, token: string) {
    const {
      data: { user },
      error,
    } = await this.supabase.auth.getUser(token);

    if (error || !user || user.email !== dto.email) {
      throw new UnauthorizedException('Invalid token or email mismatch');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const newUser = await this.prisma.user.create({
      data: {
        id: user.id,
        email: dto.email,
        name: dto.name,
        phone: dto.phone,
        emailVerified: true,
        role: 'STUDENT',
      },
    });

    await this.prisma.student.create({
      data: {
        userId: newUser.id,
      },
    });

    return { message: 'Registration successful', user: newUser };
  }

  async login(dto: LoginDto) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    });

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return {
      message: 'Login successful',
      session: data.session,
      user,
    };
  }

  async logout(token: string) {
    const { error } = await this.supabase.auth.admin.signOut(token);

    if (error) {
      throw new BadRequestException(error.message);
    }

    return { message: 'Logged out successfully' };
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

  async createAdmin(dto: CreateAdminDto) {
    const { data, error } = await this.supabase.auth.admin.createUser({
      email: dto.email,
      password: dto.password,
      email_confirm: true,
      user_metadata: {
        name: dto.name,
        role: 'ADMIN',
      },
    });

    if (error) {
      throw new BadRequestException(error.message);
    }

    const user = await this.prisma.user.create({
      data: {
        id: data.user.id,
        email: dto.email,
        name: dto.name,
        phone: dto.phone,
        role: 'ADMIN',
        emailVerified: true,
      },
    });

    return { message: 'Admin created successfully', user };
  }

  async forgotPassword(email: string) {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL}/reset-password`,
    });

    if (error) {
      throw new BadRequestException(error.message);
    }

    return { message: 'Password reset email sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    const { error } = await this.supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw new BadRequestException(error.message);
    }

    return { message: 'Password reset successful' };
  }
}
