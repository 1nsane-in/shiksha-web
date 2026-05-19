"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, ArrowLeft, CheckCircle } from "lucide-react";
import { forgotPassword, verifyOtp, resetPassword } from "@/domains/auth";
import { getApiErrorMessage } from "@/lib/api-error";

type Step = "email" | "otp" | "password" | "success";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await forgotPassword({ email });
      if (result.devOtp) setOtp(result.devOtp);
      setStep("otp");
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to send OTP"));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await verifyOtp({ email, otp });
      setToken(result.token);
      setStep("password");
    } catch (err) {
      setError(getApiErrorMessage(err, "Invalid OTP"));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await resetPassword({ token, password });
      setStep("success");
    } catch (err) {
      setError(getApiErrorMessage(err, "Password reset failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <img src="/img/logo.png" alt="" className="h-8" />
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs flex flex-col gap-6">
            <div className="flex flex-col items-center gap-1 text-center">
              <h1 className="text-2xl font-bold">
                {step === "email" && "Forgot password"}
                {step === "otp" && "Check your email"}
                {step === "password" && "Set new password"}
                {step === "success" && "Password reset!"}
              </h1>
              <p className="text-sm text-balance text-muted-foreground">
                {step === "email" && "Enter your email to reset your password"}
                {step === "otp" && `We sent a code to ${email}`}
                {step === "password" && "Choose a strong password"}
                {step === "success" && "Your password has been reset successfully."}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {step === "email" && (
              <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="email" className="text-sm font-medium mb-1 block">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={loading || !email}>
                  {loading ? "Sending..." : "Send OTP"}
                </Button>
                <Button
                  variant="link"
                  type="button"
                  className="w-full"
                  onClick={() => router.push("/login")}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to login
                </Button>
              </form>
            )}

            {step === "otp" && (
              <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="otp" className="text-sm font-medium mb-1 block">
                    One-Time Password
                  </label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  />
                </div>
                <Button type="submit" disabled={loading || otp.length !== 6}>
                  {loading ? "Verifying..." : "Verify OTP"}
                </Button>
                <Button
                  variant="link"
                  type="button"
                  className="w-full"
                  onClick={() => setStep("email")}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Change email
                </Button>
              </form>
            )}

            {step === "password" && (
              <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="password" className="text-sm font-medium mb-1 block">
                    New Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="At least 6 characters"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={loading || password.length < 6}>
                  {loading ? "Resetting..." : "Reset Password"}
                </Button>
              </form>
            )}

            {step === "success" && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm">Password reset successful</span>
                </div>
                <Button onClick={() => router.push("/login")}>
                  Back to login
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="https://images.unsplash.com/photo-1607013407627-6ee814329547?q=80&w=964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
