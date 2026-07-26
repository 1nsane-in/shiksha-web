"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@repo/ui";
import { Input } from "@repo/ui";
import { Tabs, TabsList, TabsTrigger } from "@repo/ui";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@repo/ui";
import { useSearchParams } from "next/navigation";
import { AlertCircle, Eye, EyeOff, Smartphone, Mail } from "lucide-react";
import { useLogin, usePhoneLogin } from "@/domains/auth";
import Link from "next/link";

const emailLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type EmailFormData = z.infer<typeof emailLoginSchema>;

/** Strip non-digits, keep max 10 chars */
function cleanPhone(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 10);
}

type LoginTab = "email" | "phone";

function LoginContent() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginTab, setLoginTab] = useState<LoginTab>("email");

  // Phone login state
  const [phone, setPhone] = useState("");
  const [phonePassword, setPhonePassword] = useState("");
  const [showPhonePassword, setShowPhonePassword] = useState(false);

  if (typeof window !== "undefined" && redirect !== "/") {
    sessionStorage.setItem("postLoginRedirect", redirect);
  }

  const emailLoginMutation = useLogin(redirect);
  const phoneLoginMutation = usePhoneLogin(redirect);

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleEmailSubmit = async (data: EmailFormData) => {
    setServerError("");
    try {
      await emailLoginMutation.mutateAsync(data);
    } catch (err: unknown) {
      const resData =
        err && typeof err === "object" && "response" in err
          ? (err as { response: { data: Record<string, unknown> } }).response
              ?.data
          : undefined;
      const apiError =
        resData && typeof resData.error === "object" && resData.error !== null
          ? (resData.error as Record<string, unknown>).message
          : undefined;
      setServerError(
        (typeof apiError === "string" && apiError) ||
          (err instanceof Error ? err.message : "Invalid email or password"),
      );
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    try {
      await phoneLoginMutation.mutateAsync({
        phone: fullPhone,
        password: phonePassword,
      });
    } catch (err: unknown) {
      const resData =
        err && typeof err === "object" && "response" in err
          ? (err as { response: { data: Record<string, unknown> } }).response
              ?.data
          : undefined;
      const apiError =
        resData && typeof resData.error === "object" && resData.error !== null
          ? (resData.error as Record<string, unknown>).message
          : undefined;
      setServerError(
        (typeof apiError === "string" && apiError) ||
          (err instanceof Error ? err.message : "Invalid phone or password"),
      );
    }
  };

  const fullPhone = "+91" + phone;
  const phoneComplete = phone.length === 10;

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left — Form */}
      <div className="flex flex-col p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <form
              onSubmit={
                loginTab === "email"
                  ? emailForm.handleSubmit(handleEmailSubmit)
                  : handlePhoneSubmit
              }
              className="flex flex-col gap-6"
            >
              <FieldGroup>
                {/* Logo + Header */}
                <div className="flex flex-col items-center gap-4 mb-2">
                  <Link href="/">
                    <Image
                      src="/img/logo.png"
                      alt="Shiksha Health"
                      width={32}
                      height={32}
                      className="h-8 w-auto"
                    />
                  </Link>
                  <div className="text-center">
                    <h1 className="text-2xl font-semibold tracking-tight text-[#111]">
                      Welcome back
                    </h1>
                    <p className="text-sm text-[#626260] mt-1">
                      Sign in to continue to your account
                    </p>
                  </div>
                </div>

                {/* Login Tab Toggle */}
                <Tabs
                  value={loginTab}
                  onValueChange={(v) => {
                    setLoginTab(v as LoginTab);
                    setServerError("");
                  }}
                >
                  <TabsList className="w-full">
                    <TabsTrigger
                      value="email"
                      className="flex-1 gap-2 py-2"
                    >
                      <Mail className="h-4 w-4" />
                      Email
                    </TabsTrigger>
                    <TabsTrigger
                      value="phone"
                      className="flex-1 gap-2 py-2"
                    >
                      <Smartphone className="h-4 w-4" />
                      Phone
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                {/* Error */}
                {serverError && (
                  <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{serverError}</span>
                  </div>
                )}

                {/* Email Login */}
                {loginTab === "email" && (
                  <>
                    <Field>
                      <FieldLabel htmlFor="email">Email address</FieldLabel>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        {...emailForm.register("email")}
                      />
                      {emailForm.formState.errors.email && (
                        <p className="text-xs text-red-600 mt-1">
                          {emailForm.formState.errors.email.message}
                        </p>
                      )}
                    </Field>

                    <Field>
                      <div className="flex items-center justify-between">
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <Link
                          href="/forgot-password"
                          className="text-xs text-[#626260] hover:text-[#111] underline-offset-4 hover:underline transition-colors"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          {...emailForm.register("password")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9c9fa5] hover:text-[#626260] transition-colors"
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {emailForm.formState.errors.password && (
                        <p className="text-xs text-red-600 mt-1">
                          {emailForm.formState.errors.password.message}
                        </p>
                      )}
                    </Field>

                    <Field>
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={
                          emailForm.formState.isSubmitting ||
                          emailLoginMutation.isPending
                        }
                      >
                        {emailForm.formState.isSubmitting ||
                        emailLoginMutation.isPending
                          ? "Signing in…"
                          : "Sign in"}
                      </Button>
                    </Field>
                  </>
                )}

                {/* Phone Login */}
                {loginTab === "phone" && (
                  <>
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
                          onChange={(e) =>
                            setPhone(cleanPhone(e.target.value))
                          }
                          className="pl-12"
                        />
                      </div>
                    </Field>

                    <Field>
                      <div className="flex items-center justify-between">
                        <FieldLabel htmlFor="phonePassword">
                          Password
                        </FieldLabel>
                        <Link
                          href="/forgot-password"
                          className="text-xs text-[#626260] hover:text-[#111] underline-offset-4 hover:underline transition-colors"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Input
                          id="phonePassword"
                          type={showPhonePassword ? "text" : "password"}
                          autoComplete="current-password"
                          value={phonePassword}
                          onChange={(e) =>
                            setPhonePassword(e.target.value)
                          }
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPhonePassword(!showPhonePassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9c9fa5] hover:text-[#626260] transition-colors"
                          tabIndex={-1}
                        >
                          {showPhonePassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </Field>

                    <Field>
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={
                          phoneLoginMutation.isPending ||
                          !phoneComplete ||
                          !phonePassword
                        }
                      >
                        {phoneLoginMutation.isPending
                          ? "Signing in…"
                          : "Sign in"}
                      </Button>
                    </Field>
                  </>
                )}

                <Field>
                  <FieldDescription className="text-center mt-4">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/register"
                      className="font-medium text-[#111] underline underline-offset-4 hover:no-underline"
                    >
                      Create account
                    </Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </div>
        </div>
      </div>

      {/* Right — Image */}
      <div className="relative hidden lg:block overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1607013407627-6ee814329547?q=80&w=964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
          fill
          className="object-cover"
          priority
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-10 left-10 right-10">
          <p className="text-white/90 text-lg font-medium leading-snug">
            &ldquo;The platform made my entire admission process stress-free.
            Everything was clear at every step.&rdquo;
          </p>
          <p className="text-white/60 text-sm mt-3">
            — Student, MBBS 2025 Batch
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="h-6 w-6 border-2 border-[#111] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
