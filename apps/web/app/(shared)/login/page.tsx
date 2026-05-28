"use client";

import { Suspense, useState } from "react";
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
  FieldSeparator,
} from "@repo/ui";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, GraduationCap, Users, Shield } from "lucide-react";
import { useLogin } from "@/domains/auth";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

type RoleTab = "student" | "parents" | "admin";

const roleConfig: Record<
  RoleTab,
  {
    label: string;
    icon: React.ElementType;
    title: string;
    description: string;
    emailPlaceholder: string;
    buttonText: string;
  }
> = {
  student: {
    label: "Student",
    icon: GraduationCap,
    title: "Sign in as Student",
    description: "Access your application dashboard",
    emailPlaceholder: "student@example.com",
    buttonText: "Sign in as Student",
  },
  parents: {
    label: "Parents",
    icon: Users,
    title: "Sign in as Parent",
    description: "Monitor your ward's application progress",
    emailPlaceholder: "parent@example.com",
    buttonText: "Sign in as Parent",
  },
  admin: {
    label: "Admin",
    icon: Shield,
    title: "Sign in as Admin",
    description: "Admin login or continue with Google",
    emailPlaceholder: "admin@example.com",
    buttonText: "Sign in as Admin",
  },
};

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  // Persist redirect for Google OAuth callback page
  if (typeof window !== "undefined" && redirect !== "/") {
    sessionStorage.setItem("postLoginRedirect", redirect);
  }

  const initialTab = (
    redirect.includes("admin")
      ? "admin"
      : redirect.includes("parents")
        ? "parents"
        : "student"
  ) as RoleTab;

  const [activeTab, setActiveTab] = useState<RoleTab>(initialTab);
  const [serverError, setServerError] = useState("");

  const loginMutation = useLogin(redirect);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError("");
    try {
      await loginMutation.mutateAsync(data);
    } catch (err: unknown) {
      const apiError =
        err && typeof err === "object" && "response" in err
          ? (err as { response: { data: { message?: string } } }).response?.data
              ?.message
          : undefined;
      setServerError(apiError ?? (err instanceof Error ? err.message : "Invalid email or password"));
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
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as RoleTab)}
            >
              <TabsList className="w-full">
                {(["student", "parents", "admin"] as const).map((tab) => {
                  const Icon = roleConfig[tab].icon;
                  return (
                    <TabsTrigger key={tab} value={tab} className="flex-1 gap-2">
                      <Icon className="h-4 w-4" />
                      {roleConfig[tab].label}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                  <h1 className="text-2xl font-bold">
                    {roleConfig[activeTab].title}
                  </h1>
                  <p className="text-sm text-balance text-muted-foreground">
                    {roleConfig[activeTab].description}
                  </p>
                </div>
                {serverError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span className="text-sm">{serverError}</span>
                  </div>
                )}
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder={roleConfig[activeTab].emailPlaceholder}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </Field>
                <Field>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <a
                      href="/forgot-password"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </Field>
                <Field>
                  <Button
                    type="submit"
                    disabled={isSubmitting || loginMutation.isPending}
                  >
                    {isSubmitting || loginMutation.isPending
                      ? "Logging in..."
                      : roleConfig[activeTab].buttonText}
                  </Button>
                </Field>
                <FieldSeparator>Or continue with</FieldSeparator>
                <Field>
                  <GoogleLoginButton redirectTo={redirect !== "/" ? redirect : null} />
                  <FieldDescription className="text-center">
                    Don&apos;t have an account?{" "}
                    <a
                      href="/register"
                      className="underline underline-offset-4"
                    >
                      Sign up
                    </a>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="https://images.unsplash.com/photo-1607013407627-6ee814329547?q=80&w=964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <p className="text-gray-600">Loading...</p>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
