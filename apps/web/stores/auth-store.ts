import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "STUDENT" | "ADMIN" | "SUPER_ADMIN";
  isActive: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (userData: User, authToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      loading: true,

      login: (userData, authToken) => {
        document.cookie = `token=${authToken}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
        set({ user: userData, token: authToken });
      },

      logout: () => {
        document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
        set({ user: null, token: null });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
      onRehydrateStorage: () => () => {
        useAuthStore.setState({ loading: false });
      },
    }
  )
);

export const selectUser = (s: AuthState) => s.user;
export const selectToken = (s: AuthState) => s.token;
export const selectLoading = (s: AuthState) => s.loading;
export const selectIsAuthenticated = (s: AuthState) => !!s.token && !!s.user;
export const selectIsAdmin = (s: AuthState) =>
  s.user?.role === "ADMIN" || s.user?.role === "SUPER_ADMIN";
export const selectIsSuperAdmin = (s: AuthState) => s.user?.role === "SUPER_ADMIN";
export const selectIsStudent = (s: AuthState) => s.user?.role === "STUDENT";
