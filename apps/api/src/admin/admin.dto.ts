import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  IsEnum,
  IsBoolean,
} from 'class-validator';

export enum AdminRole {
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export class CreateAdminDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsEnum(AdminRole)
  role!: AdminRole;
}

export class UpdateAdminDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(AdminRole)
  role?: AdminRole;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ChangePasswordDto {
  @IsString()
  @MinLength(8)
  currentPassword!: string;

  @IsString()
  @MinLength(8)
  newPassword!: string;
}

export class ResetAdminPasswordDto {
  @IsString()
  @MinLength(8)
  newPassword!: string;
}

export class AdminQueryDto {
  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;

  @IsOptional()
  @IsEnum(AdminRole)
  role?: AdminRole;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
