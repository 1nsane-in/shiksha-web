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
      loginStore(data.user, data.accessToken);
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
      loginStore(data.user, data.accessToken);
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
      loginStore(data.user, data.accessToken);
    },
  });
}

export function useLogout() {
  const logoutStore = useAuthStore((s) => s.logout);
  return useMutation({
    mutationFn: async () => {
      const { logout } = await import("./auth.api");
      await logout();
    },
    onSuccess: () => {
      logoutStore();
    },
  });
}
