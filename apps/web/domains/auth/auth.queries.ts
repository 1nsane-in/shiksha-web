import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import type {
  LoginDto,
  GoogleAuthDto,
  GoogleRegisterDto,
  AuthResponse,
  User,
} from "./auth.types";

// Make sure useRouter is available for useLogout

function sanitizeUser(user: User): User {
  // Drop sensitive fields that may leak via the auth response.
  const safe = { ...user } as User & Record<string, unknown>;
  delete safe.passwordHash;
  delete safe.refreshToken;
  return safe;
}

function getDashboardForRole(role: string, router: ReturnType<typeof useRouter>) {
  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    router.push("/admin/dashboard");
  } else if (role === "PARENT") {
    router.push("/parents/dashboard");
  } else {
    router.push("/student/dashboard");
  }
}

export function useLogin(redirectUrl?: string) {
  const router = useRouter();
  const loginStore = useAuthStore((s) => s.login);
  return useMutation<AuthResponse, Error, LoginDto>({
    mutationFn: async (dto: LoginDto) => {
      const { login } = await import("./auth.api");
      return login(dto);
    },
    onSuccess: (data) => {
      const safeUser = sanitizeUser(data.user);
      loginStore(safeUser, data.accessToken);

      if (redirectUrl && redirectUrl !== "/") {
        router.push(redirectUrl);
        return;
      }
      getDashboardForRole(safeUser.role, router);
    },
  });
}

export function useGoogleLogin(redirectUrl?: string) {
  const router = useRouter();
  const loginStore = useAuthStore((s) => s.login);
  return useMutation<AuthResponse, Error, GoogleAuthDto>({
    mutationFn: async (dto: GoogleAuthDto) => {
      const { googleLogin } = await import("./auth.api");
      return googleLogin(dto);
    },
    onSuccess: (data) => {
      const safeUser = sanitizeUser(data.user);
      loginStore(safeUser, data.accessToken);

      if (redirectUrl && redirectUrl !== "/") {
        router.push(redirectUrl);
        return;
      }
      getDashboardForRole(safeUser.role, router);
    },
  });
}

export function useGoogleRegister(redirectUrl?: string) {
  const router = useRouter();
  const loginStore = useAuthStore((s) => s.login);
  return useMutation<AuthResponse, Error, GoogleRegisterDto>({
    mutationFn: async (dto: GoogleRegisterDto) => {
      const { googleRegister } = await import("./auth.api");
      return googleRegister(dto);
    },
    onSuccess: (data) => {
      const safeUser = sanitizeUser(data.user);
      loginStore(safeUser, data.accessToken);

      if (redirectUrl && redirectUrl !== "/") {
        router.push(redirectUrl);
        return;
      }
      getDashboardForRole(safeUser.role, router);
    },
  });
}

export function useLogout() {
  const logoutStore = useAuthStore((s) => s.logout);
  const router = useRouter();
  return useMutation({
    mutationFn: async () => {
      const { logout } = await import("./auth.api");
      try {
        await logout();
      } catch {
        // Server unreachable — still clear local session
      }
    },
    onSuccess: () => {
      logoutStore();
      router.push("/");
    },
    onError: () => {
      logoutStore();
      router.push("/");
    },
  });
}


