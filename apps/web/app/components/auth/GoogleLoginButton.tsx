'use client';

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { AuthService } from "@/lib/auth-service";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

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
  const { login, register } = useAuth();
  const router = useRouter();

  // This is a simplified version that works with the existing auth flow
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // For demo purposes, we'll simulate a Google login with a mock token
      // In a real implementation, this would come from Google's OAuth flow
      const mockToken = "mock_google_access_token_" + Date.now();
      
      // Try login first
      try {
        await login(mockToken);
        if (onLoginSuccess) {
          onLoginSuccess();
        }
        router.push("/dashboard");
      } catch (loginError) {
        // If login fails, try registering
        try {
          // Mock user data - in real implementation, you'd get this from Google
          const userData = {
            name: "Google User",
            email: "google@example.com",
            provider: "google"
          };
          
          await register(mockToken, userData);
          if (onRegisterSuccess) {
            onRegisterSuccess();
          }
          router.push("/dashboard");
        } catch (registerError) {
          throw registerError;
        }
      }
    } catch (error) {
      console.error('Google authentication failed:', error);
      // Show error to user
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleGoogleLogin}
      disabled={loading}
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