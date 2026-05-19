"use client";

import { Suspense, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  EyeOff,
  AlertCircle,
  GraduationCap,
  Users,
  Shield,
} from "lucide-react";
import { useLogin } from "@/domains/auth";
import { LoginForm } from "@/components/auth/login-form";
import { useAuth } from "@/hooks/useAuth";

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
    redirect: string;
    title: string;
    description: string;
    emailPlaceholder: string;
    buttonText: string;
  }
> = {
  student: {
    label: "Student",
    icon: GraduationCap,
    redirect: "/student/dashboard",
    title: "Sign in as Student",
    description: "Access your application dashboard",
    emailPlaceholder: "student@example.com",
    buttonText: "Sign in as Student",
  },
  parents: {
    label: "Parents",
    icon: Users,
    redirect: "/parents/dashboard",
    title: "Sign in as Parent",
    description: "Monitor your ward's application progress",
    emailPlaceholder: "parent@example.com",
    buttonText: "Sign in as Parent",
  },
  admin: {
    label: "Admin",
    icon: Shield,
    redirect: "/admin/dashboard",
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
  const { isAuthenticated, user } = useAuth();

  const initialTab = (
    redirect.includes("admin")
      ? "admin"
      : redirect.includes("parents")
        ? "parents"
        : "student"
  ) as RoleTab;

  const [activeTab, setActiveTab] = useState<RoleTab>(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const loginMutation = useLogin();

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
      const result = await loginMutation.mutateAsync(data);
      const config = roleConfig[activeTab];
      if (result.user.role === "ADMIN" || result.user.role === "SUPER_ADMIN") {
        router.push("/admin/dashboard");
      } else if (result.user.role === "STUDENT") {
        router.push("/student/dashboard");
      } else {
        router.push(config.redirect);
      }
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Invalid email or password",
      );
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") {
        router.replace("/admin/dashboard");
      } else if (user?.role === "STUDENT") {
        router.replace("/student/dashboard");
      } else {
        router.replace(redirect);
      }
    }
  }, [isAuthenticated, user, redirect, router]);

  if (isAuthenticated) {
    return (
      <div className="min-h-svh flex items-center justify-center">
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <img src="/img/logo.png" alt="" className='h-8' />
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
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
