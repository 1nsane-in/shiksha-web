"use client";

import { createContext, useContext, useCallback, type ReactNode } from "react";
import { useAuthStore, selectUser, selectIsAuthenticated } from "@/stores/auth-store";

interface AuthContextType {
  user: ReturnType<typeof selectUser>;
  isAuthenticated: boolean;
  loading: boolean;
  login: (accessToken: string) => Promise<void>;
  register: (accessToken: string, userData: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const user = useAuthStore(selectUser);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const loading = useAuthStore((s) => s.loading);
  const login = useCallback(async (accessToken: string) => {
    const { AuthService } = await import("@/app/lib/auth-service");
    const result = await AuthService.googleLogin(accessToken);
    if (result.user && result.token) {
      useAuthStore.getState().login(result.user, result.token);
    }
  }, []);
  const register = useCallback(async (accessToken: string, userData: any) => {
    const { AuthService } = await import("@/app/lib/auth-service");
    const result = await AuthService.googleRegister(accessToken, userData);
    if (result.user && result.token) {
      useAuthStore.getState().login(result.user, result.token);
    }
  }, []);
  const logout = useCallback(() => {
    useAuthStore.getState().logout();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
