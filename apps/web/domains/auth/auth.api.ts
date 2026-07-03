import { api } from "@/shared/api/axios";
import type { AuthResponse, LoginDto, GoogleAuthDto, GoogleRegisterDto, RefreshTokenResponse, SendOtpDto, VerifyOtpDto, VerifyOtpResponse, CompleteRegistrationDto, ForgotPasswordDto, ResetPasswordDto } from "./auth.types";

const route = {
  login: "/auth/login" as const,
  googleLogin: "/auth/google-login" as const,
  googleRegister: "/auth/google-register" as const,
  refresh: "/auth/refresh" as const,
  logout: "/auth/logout" as const,
  sendOtp: "/auth/send-otp" as const,
  verifyOtp: "/auth/verify-otp" as const,
  completeRegistration: "/auth/complete-registration" as const,
  forgotPassword: "/auth/forgot-password" as const,
  resetPassword: "/auth/reset-password" as const,
} as const;

export async function login(dto: LoginDto) {
  const { data } = await api.post<AuthResponse>(route.login, dto);
  return data;
}

export async function googleLogin(dto: GoogleAuthDto) {
  const { data } = await api.post<AuthResponse>(route.googleLogin, dto);
  return data;
}

export async function googleRegister(dto: GoogleRegisterDto) {
  const { data } = await api.post<AuthResponse>(route.googleRegister, dto);
  return data;
}

export async function refreshAccessToken() {
  const { data } = await api.post<RefreshTokenResponse>(route.refresh);
  return data;
}

export async function logout() {
  await api.post(route.logout);
}

export async function sendOtp(dto: SendOtpDto) {
  const { data } = await api.post<{ message: string; devOtp?: string }>(route.sendOtp, dto);
  return data;
}

export async function verifyOtp(dto: VerifyOtpDto) {
  const { data } = await api.post<VerifyOtpResponse>(route.verifyOtp, dto);
  return data;
}

export async function completeRegistration(dto: CompleteRegistrationDto) {
  const { data } = await api.post<AuthResponse>(route.completeRegistration, dto);
  return data;
}

export async function forgotPassword(dto: ForgotPasswordDto) {
  const { data } = await api.post<{ message: string; devOtp?: string }>(route.forgotPassword, dto);
  return data;
}

export async function resetPassword(dto: ResetPasswordDto) {
  const { data } = await api.post<{ message: string }>(route.resetPassword, dto);
  return data;
}

