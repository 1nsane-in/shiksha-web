"use client";

import { useAuthStore, selectUser, selectToken, selectIsAuthenticated, selectIsAdmin, selectIsSuperAdmin, selectIsStudent } from "@/stores/auth-store";

export function useAuth() {
  const user = useAuthStore(selectUser);
  const token = useAuthStore(selectToken);
  const loading = useAuthStore((s) => s.loading);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isAdmin = useAuthStore(selectIsAdmin);
  const isSuperAdmin = useAuthStore(selectIsSuperAdmin);
  const isStudent = useAuthStore(selectIsStudent);
  const login = useAuthStore((s) => s.login);
  const setTokens = useAuthStore((s) => s.setTokens);
  const logout = useAuthStore((s) => s.logout);

  return {
    user,
    token,
    loading,
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    isStudent,
    login,
    setTokens,
    logout,
  };
}

