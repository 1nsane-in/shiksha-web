import {
  IsEmail,
  IsString,
  IsOptional,
  MinLength,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Match } from '../common/decorators/match.decorator';

export const SOCIAL_ROLES = ['STUDENT', 'PARENT'] as const;
export type SocialRole = (typeof SOCIAL_ROLES)[number];

/* ---------- Request DTOs ---------- */

export class RefreshDto {
  @ApiPropertyOptional({ description: 'Refresh token (required for mobile)' })
  @IsOptional()
  @IsString()
  refreshToken?: string;
}

export class LogoutDto {
  @ApiPropertyOptional({ description: 'Refresh token (required for mobile)' })
  @IsOptional()
  @IsString()
  refreshToken?: string;
}

export class LoginDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'securePass123' })
  @IsString()
  password!: string;
}

export class SendOtpDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name!: string;
}

export class VerifyOtpDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  otp!: string;
}

export class CompleteRegistrationDto {
  @ApiProperty({ description: 'Token from verify-otp response' })
  @IsString()
  token!: string;

  @ApiProperty({ example: 'securePass123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ example: 'securePass123' })
  @IsString()
  @Match('password', { message: 'Passwords do not match' })
  confirmPassword!: string;

  @ApiProperty({ example: 'STUDENT', enum: ['STUDENT', 'PARENT'] })
  @IsString()
  role!: string;
}

export class CreateAdminDto {
  @ApiProperty({ example: 'admin@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Admin User' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'adminPass123' })
  @IsString()
  password!: string;

  @ApiProperty({ example: 'adminPass123' })
  @IsString()
  @Match('password', { message: 'Passwords do not match' })
  confirmPassword!: string;

  @ApiPropertyOptional({ example: '+1234567890' })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class GoogleAuthDto {
  @ApiProperty({ description: 'Google ID token or access token' })
  @IsString()
  accessToken!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description:
      'Requested role for new accounts (STUDENT or PARENT). Defaults to STUDENT.',
    enum: SOCIAL_ROLES,
    example: 'STUDENT',
  })
  @IsOptional()
  @IsIn(SOCIAL_ROLES)
  role?: SocialRole;
}

export class GoogleRegisterDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: '+1234567890' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty()
  @IsString()
  googleId!: string;

  @ApiProperty()
  @IsString()
  accessToken!: string;

  @ApiProperty({
    description: 'Account role. STUDENT or PARENT only for social signup.',
    enum: SOCIAL_ROLES,
    example: 'STUDENT',
  })
  @IsIn(SOCIAL_ROLES)
  role!: SocialRole;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email!: string;
}

export class ResetPasswordDto {
  @ApiProperty({ description: 'Token from verify-otp response' })
  @IsString()
  token!: string;

  @ApiProperty({ example: 'newSecurePass123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string;
}

/* ---------- Response DTOs ---------- */

export class UserResponseDto {
  @ApiProperty({ example: 'uuid-string' })
  id!: string;

  @ApiProperty({ example: 'john@example.com' })
  email!: string;

  @ApiProperty({ example: 'John Doe' })
  name!: string;

  @ApiProperty({
    example: 'STUDENT',
    enum: ['STUDENT', 'PARENT', 'ADMIN', 'SUPER_ADMIN'],
  })
  role!: string;

  @ApiProperty({ example: true })
  isActive!: boolean;
}

export class AuthResponseDto {
  @ApiProperty({ example: 'Login successful' })
  message!: string;

  @ApiProperty({ type: UserResponseDto })
  user!: UserResponseDto;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIs...' })
  accessToken!: string;

  @ApiPropertyOptional({
    example: 'uuid-refresh-token',
    description: 'Only returned when ?mobile=true',
  })
  refreshToken?: string;
}

export class MessageResponseDto {
  @ApiProperty({ example: 'OTP sent to your email' })
  message!: string;

  @ApiPropertyOptional({ example: '123456', description: 'Only in dev mode' })
  devOtp?: string;
}

export class VerifyOtpResponseDto {
  @ApiProperty({ example: 'OTP verified successfully' })
  message!: string;

  @ApiProperty({ example: 'uuid-registration-token' })
  token!: string;
}

export class RefreshResponseDto {
  @ApiProperty({ example: 'Tokens refreshed successfully' })
  message!: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIs...' })
  accessToken!: string;

  @ApiPropertyOptional({
    example: 'uuid-refresh-token',
    description: 'Only returned when ?mobile=true',
  })
  refreshToken?: string;
}

export class LogoutResponseDto {
  @ApiProperty({ example: 'Logged out successfully' })
  message!: string;
}

export class CreateAdminResponseDto {
  @ApiProperty({ example: 'Admin created successfully' })
  message!: string;

  @ApiProperty({ type: UserResponseDto })
  user!: UserResponseDto;
}
