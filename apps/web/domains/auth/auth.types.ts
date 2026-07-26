export type SocialRole = "STUDENT" | "PARENT";
export type UserRole = "STUDENT" | "PARENT" | "ADMIN" | "SUPER_ADMIN";

export interface User {
  id: string;
  email?: string | null;
  phone?: string | null;
  name: string;
  role: UserRole;
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
  /**
   * Requested role for new auto-registered accounts. Ignored if the
   * email already exists. Defaults to STUDENT on the server.
   */
  role?: SocialRole;
}

export interface GoogleRegisterDto extends GoogleAuthDto {
  name: string;
  email?: string;
  phone?: string;
  googleId?: string;
  role: SocialRole;
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

/* ---------- Phone OTP DTOs ---------- */

export interface PhoneSendOtpDto {
  phone: string;
}

export interface PhoneVerifyOtpDto {
  phone: string;
  otp: string;
}

export interface PhoneRegisterDto {
  token: string;
  name: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export interface PhoneLoginDto {
  phone: string;
  password: string;
}

export interface PhoneLoginResponse {
  message: string;
  user: User;
  accessToken: string;
}

export interface PhoneAuthResponse {
  message: string;
  user: User;
  accessToken: string;
}

