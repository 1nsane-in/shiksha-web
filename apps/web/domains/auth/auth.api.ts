import { api } from "@/shared/api/axios";
import type { AuthResponse, LoginDto, GoogleAuthDto, GoogleRegisterDto, RefreshTokenResponse } from "./auth.types";

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

export async function refreshAccessToken(dto: { refreshToken: string }) {
  const { data } = await api.post<RefreshTokenResponse>("/auth/refresh", dto);
  return data;
}

export async function logout(refreshToken: string) {
  await api.post("/auth/logout", { refreshToken });
}
