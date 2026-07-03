"use client";

import { Button } from "@repo/ui";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { googleLogin, googleRegister } from "@/domains/auth/auth.api";
import { RoleSelectionDialog } from "./RoleSelectionDialog";
import type { SocialRole, AuthResponse } from "@/domains/auth";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
            auto_select?: boolean;
          }) => void;
          prompt: (
            cb?: (notification: {
              isNotDisplayed: () => boolean;
              isSkippedMoment: () => boolean;
            }) => void
          ) => void;
        };
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            ux_mode: "popup" | "redirect";
            callback: (response: { access_token?: string }) => void;
            error_callback?: (err: unknown) => void;
          }) => { requestAccessToken: () => void };
        };
      };
    };
  }
}

type Mode = "login" | "register";

interface GoogleLoginButtonProps {
  /**
   * Pre-selected role. When provided, the role dialog is skipped and
   * the user goes straight to Google. When omitted, the modal prompts
   * for STUDENT/PARENT before launching Google.
   */
  defaultRole?: SocialRole;
  /** Force prompt even if `defaultRole` is set. */
  alwaysPrompt?: boolean;
  mode?: Mode;
  onLoginSuccess?: () => void;
  redirectTo?: string | null;
}

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

function getDashboardForRole(role?: string): string {
  switch (role) {
    case "ADMIN":
    case "SUPER_ADMIN":
      return "/admin/dashboard";
    case "PARENT":
      return "/parents/dashboard";
    case "STUDENT":
    default:
      return "/student/dashboard";
  }
}

export function GoogleLoginButton({
  defaultRole,
  alwaysPrompt = false,
  mode = "login",
  onLoginSuccess,
  redirectTo = null,
}: GoogleLoginButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const pendingRole = useRef<SocialRole | null>(null);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      console.warn(
        "NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set. Google sign-in will not work."
      );
      return;
    }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setGoogleLoaded(true);
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const completeWithResponse = useCallback(
    (data: AuthResponse | null) => {
      if (data?.accessToken && data?.user) {
        useAuthStore.getState().login(data.user, data.accessToken);
        if (onLoginSuccess) onLoginSuccess();
        if (redirectTo) {
          router.push(redirectTo);
        } else {
          router.push(getDashboardForRole(data.user.role));
        }
        return true;
      }
      return false;
    },
    [onLoginSuccess, redirectTo, router]
  );

  const exchangeIdToken = useCallback(
    async (idToken: string, role: SocialRole) => {
      const data = await googleLogin({ accessToken: idToken, role });
      if (completeWithResponse(data)) return;

      // Login call returned 200 but no token = unexpected; fall through to register
      throw new Error("Google login failed: empty response");
    },
    [completeWithResponse]
  );

  const exchangeAccessToken = useCallback(
    async (accessToken: string, role: SocialRole) => {
      // Pull userinfo via Google API
      const userInfoRes = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (!userInfoRes.ok) throw new Error("Failed to fetch Google profile");
      const userInfo = (await userInfoRes.json()) as {
        sub: string;
        email: string;
        name?: string;
      };
      if (!userInfo.email) throw new Error("Google account has no email");

      const data = await googleLogin({ accessToken, role });
      if (completeWithResponse(data)) return;

      // No existing user -> explicit register (with selected role)
      const registerData = await googleRegister({
        name: userInfo.name || userInfo.email.split("@")[0],
        email: userInfo.email,
        phone: "",
        googleId: userInfo.sub,
        accessToken,
        role,
      });
      completeWithResponse(registerData);
    },
    [completeWithResponse]
  );

  const launchGoogle = useCallback(
    (role: SocialRole) => {
      if (!GOOGLE_CLIENT_ID) {
        setError("Google sign-in is not configured. Contact support.");
        return;
      }
      if (!googleLoaded || !window.google) {
        setError("Google SDK not loaded. Please refresh and try again.");
        return;
      }
      setLoading(true);
      setError(null);
      pendingRole.current = role;
      try {
        sessionStorage.setItem("googleSelectedRole", role);
      } catch {
        // sessionStorage unavailable; non-fatal
      }

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          if (!response?.credential) {
            setLoading(false);
            setError("Authentication cancelled");
            return;
          }
          try {
            await exchangeIdToken(response.credential, pendingRole.current || role);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Authentication failed");
          } finally {
            setLoading(false);
            pendingRole.current = null;
          }
        },
        auto_select: false,
      });

      const googleApi = window.google;
      googleApi.accounts.id.prompt((notification) => {
        if (!notification.isNotDisplayed() && !notification.isSkippedMoment()) {
          return;
        }
        // Fallback to OAuth2 popup flow
        const client = googleApi.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: "email profile openid",
          ux_mode: "popup",
          callback: async (tokenResponse) => {
            if (!tokenResponse?.access_token) {
              setLoading(false);
              setError("Authentication cancelled");
              return;
            }
            try {
              await exchangeAccessToken(
                tokenResponse.access_token,
                pendingRole.current || role
              );
            } catch (err) {
              setError(err instanceof Error ? err.message : "Authentication failed");
            } finally {
              setLoading(false);
              pendingRole.current = null;
            }
          },
          error_callback: () => {
            setLoading(false);
            setError("OAuth popup closed or cancelled");
          },
        });
        client.requestAccessToken();
      });
    },
    [exchangeIdToken, exchangeAccessToken, googleLoaded]
  );

  const handleClick = () => {
    setError(null);
    if (defaultRole && !alwaysPrompt) {
      launchGoogle(defaultRole);
    } else {
      setShowRoleDialog(true);
    }
  };

  const handleRoleConfirm = (role: SocialRole) => {
    setShowRoleDialog(false);
    launchGoogle(role);
  };

  const buttonLabel = mode === "register" ? "Sign up with Google" : "Sign in with Google";

  return (
    <>
      <Button
        type="button"
        onClick={handleClick}
        disabled={!googleLoaded || loading}
        className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
      >
        {loading ? (
          <>
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700" />
            Processing...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {buttonLabel}
          </>
        )}
      </Button>

      <RoleSelectionDialog
        open={showRoleDialog}
        defaultRole={defaultRole ?? "STUDENT"}
        title={
          mode === "register"
            ? "Create your account as..."
            : "Sign in as..."
        }
        confirmLabel={buttonLabel}
        onConfirm={handleRoleConfirm}
        onCancel={() => setShowRoleDialog(false)}
      />

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
          {error.includes("origin") && (
            <p className="text-xs text-red-500 mt-1">
              Fix: Add <code className="bg-red-100 px-1 rounded">http://localhost:3000</code> to Authorized JavaScript origins in Google Cloud Console
            </p>
          )}
          {error.includes("Backend") && (
            <p className="text-xs text-red-500 mt-1">
              Fix: Run <code className="bg-red-100 px-1 rounded">cd apps/api && npm run start:dev</code>
            </p>
          )}
        </div>
      )}
    </>
  );
}
