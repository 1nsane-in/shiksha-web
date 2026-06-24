import {
  IsEmail,
  IsString,
  IsOptional,
  MinLength,
  IsIn,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Match } from '../../common/decorators/match.decorator';

/* ---------- Student Endpoint DTOs ---------- */

export class CreateInviteLinkDto {
  @ApiPropertyOptional({ example: 'parent@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '+919876543210' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'FATHER' })
  @IsOptional()
  @IsString()
  relation?: string;
}

export class LinkByCodeDto {
  @ApiProperty({ example: 'AB12CD' })
  @IsString()
  familyCode!: string;
}

/* ---------- Parent Registration DTOs ---------- */

export class ParentSendEmailOtpDto {
  @ApiProperty({ example: 'parent@example.com' })
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({ example: 'Anita Sharma' })
  @IsOptional()
  @IsString()
  name?: string;
}

export class ParentSendPhoneOtpDto {
  @ApiProperty({ example: '+919876543210' })
  @IsString()
  phone!: string;
}

export class ParentVerifyEmailOtpDto {
  @ApiProperty({ example: 'parent@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  otp!: string;
}

export class ParentVerifyPhoneOtpDto {
  @ApiProperty({ example: '+919876543210' })
  @IsString()
  phone!: string;

  @ApiProperty({ example: '654321' })
  @IsString()
  otp!: string;
}

export class ParentRegisterDto {
  @ApiPropertyOptional({ description: 'Invite code from invite link' })
  @IsOptional()
  @IsString()
  inviteCode?: string;

  @ApiProperty({ example: 'anita@email.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Anita Sharma' })
  @IsString()
  name!: string;

  @ApiProperty({ example: '+919876543210' })
  @IsString()
  phone!: string;

  @ApiProperty({ example: 'securePass123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ example: 'securePass123' })
  @IsString()
  @Match('password', { message: 'Passwords do not match' })
  confirmPassword!: string;

  @ApiPropertyOptional({ example: 'FATHER' })
  @IsOptional()
  @IsString()
  relation?: string;
}

/* ---------- Admin DTOs ---------- */

export class AdminCreateParentLinkDto {
  @ApiProperty({ example: 'parent@example.com', description: 'Parent email address' })
  @IsEmail()
  parentEmail!: string;

  @ApiProperty({ example: 'student@example.com', description: 'Student email address' })
  @IsEmail()
  studentEmail!: string;

  @ApiPropertyOptional({ example: 'FATHER' })
  @IsOptional()
  @IsString()
  relation?: string;
}

export class AdminUpdateParentLinkStatusDto {
  @ApiProperty({ enum: ['APPROVED', 'REJECTED'] })
  @IsString()
  @IsIn(['APPROVED', 'REJECTED'])
  status!: string;
}

export class AdminParentLinksQueryDto {
  @ApiPropertyOptional({ enum: ['PENDING', 'APPROVED', 'REJECTED'] })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: '1' })
  @IsOptional()
  @IsString()
  page?: string;

  @ApiPropertyOptional({ example: '20' })
  @IsOptional()
  @IsString()
  limit?: string;
}

/* ---------- Response Types ---------- */

export class InviteLinkResponseDto {
  @ApiProperty({ example: 'https://shiksha.study/invite/uuid-code' })
  inviteUrl!: string;

  @ApiProperty({ example: 'uuid-code' })
  code!: string;

  @ApiProperty()
  expiresAt!: Date;
}

export class FamilyCodeResponseDto {
  @ApiProperty({ example: 'AB12CD' })
  familyCode!: string;
}

export class MessageResponseDto {
  @ApiProperty({ example: 'Operation successful' })
  message!: string;
}
