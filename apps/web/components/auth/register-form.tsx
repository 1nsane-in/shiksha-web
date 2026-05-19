"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  ArrowLeft,
  GraduationCap,
  Users,
  Shield,
} from "lucide-react";
import { sendOtp, verifyOtp, completeRegistration } from "@/domains/auth";
import { useAuthStore } from "@/stores/auth-store";
import { getApiErrorMessage } from "@/lib/api-error";
import { GoogleLoginButton } from "./GoogleLoginButton";

type Step = "email" | "otp" | "password";
type RoleTab = "student" | "parents" | "admin";

const roleConfig: Record<
  RoleTab,
  { label: string; icon: React.ElementType; redirect: string }
> = {
  student: {
    label: "Student",
    icon: GraduationCap,
    redirect: "/student/dashboard",
  },
  parents: { label: "Parent", icon: Users, redirect: "/parents/dashboard" },
  admin: { label: "Admin", icon: Shield, redirect: "/admin/dashboard" },
};

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const [role, setRole] = useState<RoleTab>("student");
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passError, setPassError] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await sendOtp({ email, name });
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

  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setPassError("");
    if (password !== confirmPassword) {
      setPassError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const roleValue = role === "parents" ? "PARENT" : role.toUpperCase();
      const result = await completeRegistration({ token, password, confirmPassword, role: roleValue });
      useAuthStore.getState().login(result.user, result.accessToken);
      if (result.user.role === "ADMIN" || result.user.role === "SUPER_ADMIN") {
        router.push("/admin/dashboard");
      } else if (result.user.role === "PARENT") {
        router.push("/parents/dashboard");
      } else {
        router.push("/");
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "Registration failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <Tabs value={role} onValueChange={(v) => setRole(v as RoleTab)}>
          <TabsList className="w-full">
            {(["student", "parents"] as const).map((tab) => {
              const Icon = roleConfig[tab].icon;
              return (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="flex-1 gap-2 py-2 data-active:bg-primary data-active:text-primary-foreground data-active:shadow-sm"
                >
                  <Icon className="h-4 w-4" />
                  {roleConfig[tab].label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">
            {step === "email" && "Create your account"}
            {step === "otp" && "Check your email"}
            {step === "password" && "Set your password"}
          </h1>
          <p className="text-sm text-balance text-muted-foreground">
            {step === "email" && "Enter your email to get started"}
            {step === "otp" && `We sent a code to ${email}`}
            {step === "password" && "Choose a strong password"}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {step === "email" && (
          <>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Field>
              <Button
                type="submit"
                onClick={handleSendOtp}
                disabled={loading || !email || !name}
              >
                {loading ? "Sending..." : "Send OTP"}
              </Button>
            </Field>
          </>
        )}

        {step === "otp" && (
          <>
            <Field>
              <FieldLabel htmlFor="otp">One-Time Password</FieldLabel>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit code"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              />
            </Field>
            <Field>
              <Button
                type="submit"
                onClick={handleVerifyOtp}
                disabled={loading || otp.length !== 6}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
            </Field>
            <Field>
              <Button
                variant="link"
                type="button"
                className="w-full"
                onClick={() => setStep("email")}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Change email
              </Button>
            </Field>
          </>
        )}

        {step === "password" && (
          <>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="At least 6 characters"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Field>
            {passError && (
              <div className="text-sm text-red-600 text-center">{passError}</div>
            )}
            <Field>
              <Button
                type="submit"
                onClick={handleCompleteRegistration}
                disabled={loading || password.length < 6 || !confirmPassword}
              >
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </Field>
          </>
        )}

        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <GoogleLoginButton />
          <FieldDescription className="text-center">
            Already have an account?{" "}
            <a href="/login" className="underline underline-offset-4">
              Login
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
