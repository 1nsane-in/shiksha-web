'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { AuthService } from "@/app/lib/auth-service";

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (accessToken: string) => Promise<void>;
  register: (accessToken: string, userData: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on mount
    const authenticated = AuthService.isAuthenticated();
    setIsAuthenticated(authenticated);
    setLoading(false);
  }, []);

  const login = async (accessToken: string) => {
    try {
      const result = await AuthService.googleLogin(accessToken);
      setUser(result.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (accessToken: string, userData: any) => {
    try {
      const result = await AuthService.googleRegister(accessToken, userData);
      setUser(result.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
