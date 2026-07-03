# Google Authentication Implementation Plan

## Overview

This document outlines the implementation plan for integrating Google authentication into the medical admission management platform frontend. The goal is to enable users to sign up and log in using their Google accounts.

## Current State Assessment

### Backend

- API endpoints exist for Google authentication:
  - `POST /auth/google-login`
  - `POST /auth/google-register`
- Backend service handles token verification and user management
- Authentication is handled through Supabase

### Frontend

- Next.js/React application with existing UI components
- No authentication components implemented yet
- Header component exists but lacks authentication controls

## Implementation Approach

### 1. Authentication Service Layer

Create a service to handle all authentication-related operations:

**File:** `apps/web/src/lib/auth-service.ts`

```typescript
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export class AuthService {
  private static API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Google login
  static async googleLogin(accessToken: string) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/auth/google-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessToken }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Google login failed");
      }

      const data = await response.json();

      // Store session in cookies or localStorage
      const cookieStore = cookies();
      cookieStore.set("auth_token", data.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      });

      return data;
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    }
  }

  // Google registration
  static async googleRegister(accessToken: string, userData: any) {
    try {
      const response = await fetch(
        `${this.API_BASE_URL}/auth/google-register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...userData,
            accessToken,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Google registration failed");
      }

      const data = await response.json();

      // Store session in cookies or localStorage
      const cookieStore = cookies();
      cookieStore.set("auth_token", data.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      });

      return data;
    } catch (error) {
      console.error("Google registration error:", error);
      throw error;
    }
  }

  // Check if user is authenticated
  static isAuthenticated() {
    const cookieStore = cookies();
    return !!cookieStore.get("auth_token");
  }

  // Logout
  static async logout() {
    try {
      const cookieStore = cookies();
      cookieStore.delete("auth_token");
      redirect("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }
}
```

### 2. Google Login Button Component

**File:** `apps/web/src/components/auth/GoogleLoginButton.tsx`

```typescript
'use client';

import { Button } from "./button";
import { useEffect, useState } from "react";
import { AuthService } from "@/lib/auth-service";

declare global {
  interface Window {
    google?: any;
  }
}

export function GoogleLoginButton({
  onLoginSuccess,
  onRegisterSuccess
}: {
  onLoginSuccess?: () => void;
  onRegisterSuccess?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);

  useEffect(() => {
    // Load Google SDK if not already loaded
    if (typeof window !== 'undefined' && !window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => setGoogleLoaded(true);
      document.head.appendChild(script);
    } else {
      setGoogleLoaded(true);
    }

    return () => {
      // Cleanup script if needed
      if (window.google) {
        // Google SDK cleanup if needed
      }
    };
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      // This would be replaced with actual Google SDK integration
      // For now, we'll simulate with a mock token
      const mockToken = "mock_google_access_token_" + Date.now();

      // In real implementation, this would be the actual Google access token
      // from the Google Sign-In SDK

      const result = await AuthService.googleLogin(mockToken);

      if (onLoginSuccess) {
        onLoginSuccess();
      }

      // Redirect or update UI as needed
    } catch (error) {
      console.error('Google login failed:', error);
      // Show error to user
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleGoogleLogin}
      disabled={!googleLoaded || loading}
      className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
    >
      {loading ? (
        <>
          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></span>
          Processing...
        </>
      ) : (
        <>
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </>
      )}
    </Button>
  );
}
```

### 3. Authentication Context

**File:** `apps/web/src/context/AuthContext.tsx`

```typescript
'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { AuthService } from "@/lib/auth-service";

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (accessToken: string) => Promise<void>;
  register: (accessToken: string, userData: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on mount
    const checkAuthStatus = async () => {
      const authenticated = AuthService.isAuthenticated();
      setIsAuthenticated(authenticated);
      setLoading(false);
    };

    checkAuthStatus();
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

  const logout = async () => {
    try {
      await AuthService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
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
```

### 4. Updated Header Component

**Update:** `apps/web/src/components/landing/Header.tsx`

```typescript
"use client";

import Link from "next/link";
import { Button } from "./button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const navLinks = [
    { name: "Home", href: "#" },
    { name: "How It Works", href: "#" },
    { name: "Universities", href: "#" },
    { name: "Documents", href: "#" },
    { name: "Pricing", href: "#" },
    { name: "Contact", href: "#" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-xl font-bold text-primary">
              MedCareer
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-600 hover:text-primary transition-colors duration-200 text-sm font-medium"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </nav>

          {/* Auth Section */}
          <div className="hidden md:block">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-600 text-sm">{user?.name}</span>
                <Button
                  onClick={logout}
                  variant="outline"
                  className="border-gray-300 text-gray-600 hover:bg-gray-50 text-sm font-medium"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200">
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-primary"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 pb-2">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <span className="block px-3 py-2 text-gray-600 text-sm">{user?.name}</span>
                  <Button
                    onClick={logout}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Button className="w-full bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-full text-sm font-medium">
                  <Link href="/login">Login</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
```

### 5. Login Page

**File:** `apps/web/src/app/login/page.tsx`

```typescript
"use client";

import { useState } from "react";
import { Button } from "./button";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // In real implementation, this would get the actual Google access token
      const mockToken = "mock_google_access_token_" + Date.now();
      await login(mockToken);
      router.push("/dashboard"); // Redirect to user dashboard
    } catch (error) {
      console.error("Login failed:", error);
      // Show error to user
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or continue with
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <GoogleLoginButton
              onLoginSuccess={() => router.push("/dashboard")}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div>
            <Button
              type="button"
              className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              onClick={() => router.push("/register")}
            >
              Create Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 6. Integration Steps

1. **Setup Environment Variables:**
   - Add `NEXT_PUBLIC_API_URL` to `.env.local` pointing to your backend API

2. **Add Context Provider:**
   - Wrap the app with `AuthProvider` in `apps/web/src/app/layout.tsx`

3. **Update Layout:**

   ```typescript
   // apps/web/src/app/layout.tsx
   import { AuthProvider } from "@/context/AuthContext";

   export default function RootLayout({
     children,
   }: {
     children: React.ReactNode;
   }) {
     return (
       <html lang="en">
         <body>
           <AuthProvider>{children}</AuthProvider>
         </body>
       </html>
     );
   }
   ```

4. **Implement Google SDK Integration:**
   - Replace mock token with actual Google access token from SDK

5. **Add Registration Page:**
   - Similar to login page but with registration flow

## Technical Considerations

1. **Security:**
   - Use HTTPS in production
   - Secure cookies with HttpOnly and SameSite attributes
   - Proper token validation

2. **User Experience:**
   - Loading states for authentication
   - Error handling and messaging
   - Responsive design for mobile

3. **Performance:**
   - Lazy load Google SDK
   - Optimize authentication flows

## Testing Strategy

1. **Unit Tests:**
   - Test authentication service methods
   - Test context provider behavior

2. **Integration Tests:**
   - Test Google login flow
   - Test registration flow
   - Test session management

3. **E2E Tests:**
   - Full authentication journey
   - Error scenarios

## Dependencies to Install

```bash
npm install @types/react
```

This implementation follows Next.js 13+ App Router conventions and provides a solid foundation for Google authentication in the medical admission platform.
