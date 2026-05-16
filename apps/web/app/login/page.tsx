'use client';

import { Button } from "@/components/ui/button";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

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