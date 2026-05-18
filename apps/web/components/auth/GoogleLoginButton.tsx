'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { googleLogin, googleRegister } from "@/domains/auth/auth.api";

declare global {
  interface Window {
    google?: any;
  }
}

export function GoogleLoginButton({ 
  onLoginSuccess,
  redirectTo = null,
}: { 
  onLoginSuccess?: () => void;
  redirectTo?: string | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load Google Identity Services SDK
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setGoogleLoaded(true);
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const sendTokenToBackend = async (idToken: string) => {
    try {
      // First try login
      const loginData = await googleLogin({ accessToken: idToken }).catch(() => null);
      
      if (loginData?.accessToken) {
        useAuthStore.getState().login(loginData.user, loginData.accessToken, loginData.refreshToken);
        if (onLoginSuccess) onLoginSuccess();
        if (redirectTo) router.push(redirectTo);
        return;
      }

      // If login fails, try registration
      const payload = JSON.parse(atob(idToken.split('.')[1]));
      const registerData = await googleRegister({
        email: payload.email,
        name: payload.name,
        phone: '',
        googleId: payload.sub,
        accessToken: idToken,
      });

      if (registerData.accessToken) {
        useAuthStore.getState().login(registerData.user, registerData.accessToken, registerData.refreshToken);
      }
      if (onLoginSuccess) onLoginSuccess();
      if (redirectTo) router.push(redirectTo);
    } catch (error) {
      console.error('Google auth error:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Backend server is not running. Please start the API server.');
      }
      throw error;
    }
  };

  const handleGoogleLogin = () => {
    setError(null);

    if (!googleLoaded || !window.google) {
      setError('Google SDK not loaded. Please refresh and try again.');
      return;
    }

    setLoading(true);

    // Initialize Google Identity Services
    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '23400190792-giinr9lds48slhi58bg87ts1evst4h3i.apps.googleusercontent.com',
      callback: async (response: any) => {
        if (response.credential) {
          try {
            await sendTokenToBackend(response.credential);
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Authentication failed');
            setLoading(false);
          }
        } else {
          setLoading(false);
          setError('Authentication cancelled');
        }
      },
      auto_select: false,
    });

    // Show the One Tap / account selection prompt
    window.google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // Fallback: use the popup ID token flow (simpler)
        window.google.accounts.oauth2.initTokenClient({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '23400190792-giinr9lds48slhi58bg87ts1evst4h3i.apps.googleusercontent.com',
          scope: 'email profile openid',
          ux_mode: 'popup',
          callback: async (tokenResponse: any) => {
            if (tokenResponse.access_token) {
              // Get user info using the access token
              try {
                const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: {
                    Authorization: `Bearer ${tokenResponse.access_token}`,
                  },
                });
                
                if (!userInfoRes.ok) {
                  throw new Error('Failed to get user info');
                }
                
                const userInfo = await userInfoRes.json();
                
                // Send to backend for login/register
                const loginData = await googleLogin({ accessToken: tokenResponse.access_token }).catch(() => null);
                
                if (loginData?.accessToken) {
                  useAuthStore.getState().login(loginData.user, loginData.accessToken, loginData.refreshToken);
                  if (onLoginSuccess) onLoginSuccess();
                  if (redirectTo) router.push(redirectTo);
                  return;
                }
                
                // If login fails, register them
                const registerData = await googleRegister({
                  name: userInfo.name,
                  accessToken: tokenResponse.access_token,
                });
                
                if (registerData.accessToken) {
                  useAuthStore.getState().login(registerData.user, registerData.accessToken, registerData.refreshToken);
                }
                if (onLoginSuccess) onLoginSuccess();
                if (redirectTo) router.push(redirectTo);
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Authentication failed');
                setLoading(false);
              }
            } else {
              setLoading(false);
              setError('Authentication cancelled');
            }
          },
          error_callback: (error: any) => {
            setLoading(false);
            setError('OAuth popup closed or cancelled');
          },
        }).requestAccessToken();
      }
    });
  };

  return (
    <div className="w-full">
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
      
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
          {error.includes('origin') && (
            <p className="text-xs text-red-500 mt-1">
              Fix: Add <code className="bg-red-100 px-1 rounded">http://localhost:3000</code> to Authorized JavaScript origins in Google Cloud Console
            </p>
          )}
          {error.includes('Backend') && (
            <p className="text-xs text-red-500 mt-1">
              Fix: Run <code className="bg-red-100 px-1 rounded">cd apps/api && npm run start:dev</code>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
