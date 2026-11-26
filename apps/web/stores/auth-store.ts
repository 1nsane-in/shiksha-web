import { create } from "zustand";
import { persist } from "zustand/middleware";
import { storage } from "@/shared/api/storage";
import { STORAGE_KEYS } from "@/shared/api/constants";
import { clearQueryCache } from "@/shared/api/queryClient";
import type { User } from "@/domains/auth/auth.types";

export type { User };

/**
 * Auth tokens live in httpOnly cookies set by the API — never in JavaScript.
 * The only cookie written here is a non-sensitive `auth_role` marker for
 * Next.js proxy (UX routing only; the API enforces authorization).
 */
function setRoleCookie(role: string) {
  if (typeof document === "undefined") return;
  document.cookie = `auth_role=${encodeURIComponent(role)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
}

function clearRoleCookie() {
  if (typeof document === "undefined") return;
  document.cookie = "auth_role=; path=/; max-age=0";
}

interface AuthState {
  user: User | null;
  loading: boolean;
  /** Kept for backwards compatibility; tokens are cookie-only. */
  login: (userData: User, _accessToken?: string) => void;
  setTokens: (_accessToken?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: true,

      login: (userData) => {
        set({ user: userData });
        setRoleCookie(userData.role);
      },

      // ponytail: refresh rotates the httpOnly cookie server-side; nothing to store
      setTokens: () => {},

      logout: () => {
        set({ user: null });
        clearRoleCookie();
        storage.remove(STORAGE_KEYS.AUTH_STORAGE);
        clearQueryCache();
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => () => {
        useAuthStore.setState({ loading: false });
      },
    }
  )
);

export const selectUser = (s: AuthState) => s.user;
export const selectToken = (_s: AuthState) => null;
export const selectLoading = (s: AuthState) => s.loading;
export const selectIsAuthenticated = (s: AuthState) => !!s.user;
export const selectIsAdmin = (s: AuthState) =>
  s.user?.role === "ADMIN" || s.user?.role === "SUPER_ADMIN";
export const selectIsSuperAdmin = (s: AuthState) => s.user?.role === "SUPER_ADMIN";
export const selectIsStudent = (s: AuthState) => s.user?.role === "STUDENT";
