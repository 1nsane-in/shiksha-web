import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthStore } from "./auth.store";
import type { LoginDto, GoogleAuthDto, GoogleRegisterDto, AuthResponse } from "./auth.types";

export function useLogin() {
  const router = typeof window !== "undefined" ? useRouter() : null;
  const loginStore = useAuthStore((s) => s.login);
  return useMutation<AuthResponse, Error, LoginDto>({
    mutationFn: async (dto: LoginDto) => {
      const { login } = await import("./auth.api");
      return login(dto);
    },
    onSuccess: (data) => {
      const { passwordHash, refreshToken, ...safeUser } = data.user as any;
      loginStore(safeUser as any, data.accessToken);
      const role = safeUser.role;
      if (role === "ADMIN" || role === "SUPER_ADMIN") {
        router?.push("/admin/dashboard");
      } else if (role === "STUDENT") {
        router?.push("/student/dashboard");
      } else {
        router?.push("/parents/dashboard");
      }
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
