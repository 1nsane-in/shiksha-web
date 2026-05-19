import { create } from "zustand";
import { persist } from "zustand/middleware";

function setTokenCookie(token: string) {
  if (typeof document === "undefined") return;
  document.cookie = `refreshToken=${token}; path=/; max-age=${15 * 60}; SameSite=Lax`;
}

function clearTokenCookie() {
  if (typeof document === "undefined") return;
  document.cookie = "refreshToken=; path=/; max-age=0";
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "STUDENT" | "PARENT" | "ADMIN" | "SUPER_ADMIN";
  isActive: boolean;
}

interface AuthState {
  user: User | null;
  access_token: string | null;
  loading: boolean;
  login: (userData: User, accessToken: string) => void;
  setTokens: (accessToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      access_token: null,
      loading: true,

      login: (userData, accessToken) => {
        set({ user: userData, access_token: accessToken });
        setTokenCookie(accessToken);
      },

      setTokens: (accessToken) => {
        set({ access_token: accessToken });
        setTokenCookie(accessToken);
      },

      logout: () => {
        set({ user: null, access_token: null });
        clearTokenCookie();
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        access_token: state.access_token,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.access_token) {
          setTokenCookie(state.access_token);
        }
        useAuthStore.setState({ loading: false });
      },
    }
  )
);

export const selectUser = (s: AuthState) => s.user;
export const selectToken = (s: AuthState) => s.access_token;
export const selectLoading = (s: AuthState) => s.loading;
export const selectIsAuthenticated = (s: AuthState) => !!s.access_token && !!s.user;
export const selectIsAdmin = (s: AuthState) =>
  s.user?.role === "ADMIN" || s.user?.role === "SUPER_ADMIN";
export const selectIsSuperAdmin = (s: AuthState) => s.user?.role === "SUPER_ADMIN";
export const selectIsStudent = (s: AuthState) => s.user?.role === "STUDENT";
