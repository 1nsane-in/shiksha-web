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
  refreshToken: string | null;
  loading: boolean;
  login: (userData: User, accessToken: string, refreshToken: string) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      loading: true,

      login: (userData, accessToken, refreshTok) => {
        set({ user: userData, token: accessToken, refreshToken: refreshTok });
      },

      setTokens: (accessToken, refreshTok) => {
        set({ token: accessToken, refreshToken: refreshTok });
      },

      logout: () => {
        set({ user: null, token: null, refreshToken: null });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => () => {
        useAuthStore.setState({ loading: false });
      },
    }
  )
);

export const selectUser = (s: AuthState) => s.user;
export const selectToken = (s: AuthState) => s.token;
export const selectRefreshToken = (s: AuthState) => s.refreshToken;
export const selectLoading = (s: AuthState) => s.loading;
export const selectIsAuthenticated = (s: AuthState) => !!s.token && !!s.user;
export const selectIsAdmin = (s: AuthState) =>
  s.user?.role === "ADMIN" || s.user?.role === "SUPER_ADMIN";
export const selectIsSuperAdmin = (s: AuthState) => s.user?.role === "SUPER_ADMIN";
export const selectIsStudent = (s: AuthState) => s.user?.role === "STUDENT";
