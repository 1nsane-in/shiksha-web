export interface User {
  id: string;
  email: string;
  name: string;
  role: "STUDENT" | "PARENT" | "ADMIN" | "SUPER_ADMIN";
  isActive: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface GoogleAuthDto {
  accessToken: string;
}

export interface GoogleRegisterDto extends GoogleAuthDto {
  name: string;
  email?: string;
  phone?: string;
  googleId?: string;
  role?: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface SendOtpDto {
  email: string;
  name: string;
}

export interface VerifyOtpDto {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  message: string;
  token: string;
}

export interface CompleteRegistrationDto {
  token: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  password: string;
}

