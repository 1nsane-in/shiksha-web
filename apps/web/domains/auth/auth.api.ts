import { api } from "@/shared/api/axios";
import type { AuthResponse, LoginDto, GoogleAuthDto, GoogleRegisterDto, RefreshTokenResponse, SendOtpDto, VerifyOtpDto, VerifyOtpResponse, CompleteRegistrationDto, ForgotPasswordDto, ResetPasswordDto } from "./auth.types";

export async function login(dto: LoginDto) {
  const { data } = await api.post<AuthResponse>("/auth/login", dto);
  return data;
}

export async function googleLogin(dto: GoogleAuthDto) {
  const { data } = await api.post<AuthResponse>("/auth/google-login", dto);
  return data;
}

export async function googleRegister(dto: GoogleRegisterDto) {
  const { data } = await api.post<AuthResponse>("/auth/google-register", dto);
  return data;
}

export async function refreshAccessToken() {
  const { data } = await api.post<RefreshTokenResponse>("/auth/refresh");
  return data;
}

export async function logout() {
  await api.post("/auth/logout");
}

export async function sendOtp(dto: SendOtpDto) {
  const { data } = await api.post<{ message: string; devOtp?: string }>("/auth/send-otp", dto);
  return data;
}

export async function verifyOtp(dto: VerifyOtpDto) {
  const { data } = await api.post<VerifyOtpResponse>("/auth/verify-otp", dto);
  return data;
}

export async function completeRegistration(dto: CompleteRegistrationDto) {
  const { data } = await api.post<AuthResponse>("/auth/complete-registration", dto);
  return data;
}

export async function forgotPassword(dto: ForgotPasswordDto) {
  const { data } = await api.post<{ message: string; devOtp?: string }>("/auth/forgot-password", dto);
  return data;
}

export async function resetPassword(dto: ResetPasswordDto) {
  const { data } = await api.post<{ message: string }>("/auth/reset-password", dto);
  return data;
}

