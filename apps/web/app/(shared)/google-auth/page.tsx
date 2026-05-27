"use client";

import { useState } from "react";
import { Button } from "@repo/ui";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";

export default function GoogleAuthPage() {
  const router = useRouter();
  const { isAuthenticated, login, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError(null);

    try {
      // This would normally be handled by the Google SDK
      // For demonstration purposes, we'll simulate successful authentication
      const mockAccessToken = "mock_google_access_token_" + Date.now();

      // Simulate the actual login process
      await login(mockAccessToken);
      router.push("/");
    } catch (err) {
      setError("Authentication failed. Please try again.");
      console.error("Auth error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Google Authentication
          </h1>
          <p className="text-gray-600">
            {isAuthenticated
              ? "You're logged in with Google!"
              : "Sign in with your Google account"}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          {isAuthenticated ? (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-gray-700">Welcome back!</p>
              </div>

              <Button
                onClick={logout}
                className="w-full bg-red-500 hover:bg-red-600 text-white"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <GoogleLoginButton />
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              <div className="text-center text-sm text-gray-500">
                <p>This is a demonstration of Google authentication flow.</p>
                <p className="mt-1">
                  In a real implementation, this would connect to Google's OAuth
                  service.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

