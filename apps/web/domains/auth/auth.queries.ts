import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "./auth.store";
import type { LoginDto, GoogleAuthDto, GoogleRegisterDto } from "./auth.types";

export function useLogin() {
  const loginStore = useAuthStore((s) => s.login);
  return useMutation({
    mutationFn: async (dto: LoginDto) => {
      const { login } = await import("./auth.api");
      return login(dto);
    },
    onSuccess: (data) => {
      loginStore(data.user, data.accessToken, data.refreshToken);
    },
  });
}

export function useGoogleLogin() {
  const loginStore = useAuthStore((s) => s.login);
  return useMutation({
    mutationFn: async (dto: GoogleAuthDto) => {
      const { googleLogin } = await import("./auth.api");
      return googleLogin(dto);
    },
    onSuccess: (data) => {
      loginStore(data.user, data.accessToken, data.refreshToken);
    },
  });
}

export function useGoogleRegister() {
  const loginStore = useAuthStore((s) => s.login);
  return useMutation({
    mutationFn: async (dto: GoogleRegisterDto) => {
      const { googleRegister } = await import("./auth.api");
      return googleRegister(dto);
    },
    onSuccess: (data) => {
      loginStore(data.user, data.accessToken, data.refreshToken);
    },
  });
}

export function useLogout() {
  const logoutStore = useAuthStore((s) => s.logout);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  return useMutation({
    mutationFn: async () => {
      if (!refreshToken) return;
      const { logout } = await import("./auth.api");
      await logout(refreshToken);
    },
    onSuccess: () => {
      logoutStore();
    },
  });
}
