"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@repo/ui";
import { Button } from "@repo/ui";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@repo/ui";
import { Tabs, TabsList, TabsTrigger } from "@repo/ui";
import { Input } from "@repo/ui";
import {
  AlertCircle,
  ArrowLeft,
  GraduationCap,
  Users,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  sendPhoneOtp,
  verifyPhoneOtp,
  phoneRegister,
} from "@/domains/auth";
import { useLinkByFamilyCode } from "@/domains/parents";
import { useAuthStore } from "@/stores/auth-store";
import { getApiErrorMessage } from "@/lib/api-error";
import Link from "next/link";

type Step = "phone" | "otp" | "password" | "code";
type RoleTab = "student" | "parents";

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
};

/** Strip non-digits, keep max 10 chars (Indian mobile) */
function cleanPhone(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 10);
}

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const [role, setRole] = useState<RoleTab>("student");
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passError, setPassError] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [familyCode, setFamilyCode] = useState("");
  const [codeStepLoading, setCodeStepLoading] = useState(false);
  const linkMutation = useLinkByFamilyCode();

  const phoneComplete = phone.length === 10;

  const fullPhone = "+91" + phone;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await sendPhoneOtp({ phone: fullPhone });
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
      const result = await verifyPhoneOtp({ phone: fullPhone, otp });
      setToken(result.token);
      setStep("password");
    } catch (err) {
      setError(getApiErrorMessage(err, "Invalid OTP"));
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setPassError("");
    if (password !== confirmPassword) {
      setPassError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const roleValue = role === "parents" ? "PARENT" : "STUDENT";
      const result = await phoneRegister({
        token,
        name,
        password,
        confirmPassword,
        role: roleValue,
      });
      useAuthStore.getState().login(result.user, result.accessToken);
      if (roleValue === "PARENT") {
        setStep("code");
      } else {
        router.push("/student/dashboard");
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "Registration failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleLinkCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCodeStepLoading(true);
    try {
      await linkMutation.mutateAsync({
        familyCode: familyCode.trim().toUpperCase(),
      });
      router.push("/parents/dashboard");
    } catch (err) {
      setError(
        getApiErrorMessage(
          err,
          "Failed to link. You can try again from your dashboard.",
        ),
      );
    } finally {
      setCodeStepLoading(false);
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
            {step === "phone" && "Create your account"}
            {step === "otp" && "Check your phone"}
            {step === "password" && "Set your password"}
            {step === "code" && "Link to your child"}
          </h1>
          <p className="text-sm text-balance text-muted-foreground">
            {step === "phone" && "Enter your phone number to get started"}
            {step === "otp" && `We sent a code to +91 ${phone}`}
            {step === "password" && "Choose a strong password"}
            {step === "code" && "Enter the family code from your child"}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {step === "phone" && (
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
              <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium pointer-events-none z-10">
                  +91
                </span>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="9876543210"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(cleanPhone(e.target.value))}
                  className="pl-12"
                />
              </div>
            </Field>
            <Field>
              <Button
                type="submit"
                onClick={handleSendOtp}
                disabled={loading || !name || !phoneComplete}
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
                onClick={() => setStep("phone")}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Change phone number
              </Button>
            </Field>
          </>
        )}

        {step === "password" && (
          <>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmPassword">
                Confirm Password
              </FieldLabel>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((p) => !p)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </Field>
            {passError && (
              <div className="text-sm text-red-600 text-center">
                {passError}
              </div>
            )}
            <Field>
              <Button
                type="submit"
                onClick={handlePhoneRegister}
                disabled={loading || password.length < 6 || !confirmPassword}
              >
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </Field>
          </>
        )}

        {step === "code" && (
          <>
            <Field>
              <FieldLabel htmlFor="familyCode">Family Code</FieldLabel>
              <Input
                id="familyCode"
                type="text"
                placeholder="e.g. AB12CD"
                value={familyCode}
                onChange={(e) => setFamilyCode(e.target.value.toUpperCase())}
                maxLength={10}
                className="text-center text-lg tracking-[0.25em] font-bold uppercase"
              />
            </Field>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                disabled={codeStepLoading || !familyCode.trim()}
                onClick={handleLinkCode}
              >
                {codeStepLoading ? "Linking..." : "Link & Continue"}
              </Button>
              <Button
                variant="ghost"
                type="button"
                disabled={codeStepLoading}
                onClick={() => router.push("/parents/dashboard")}
              >
                Skip for now
              </Button>
            </div>
          </>
        )}

        <Field>
          <FieldDescription className="text-center">
            Already have an account?{" "}
            <Link href="/login" className="underline underline-offset-4">
              Login
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
