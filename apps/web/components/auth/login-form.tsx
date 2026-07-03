"use client";

import { useState } from "react";
import { cn } from "@repo/ui";
import { Button } from "@repo/ui";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@repo/ui";
import { Input } from "@repo/ui";
import { useLogin } from "@/domains/auth";
import { GoogleLoginButton } from "./GoogleLoginButton";
import Link from "next/link";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const loginMutation = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await loginMutation.mutateAsync({ email, password });
      // The mutation's onSuccess handler handles role-based routing.
    } catch (err: unknown) {
      const apiError =
        err && typeof err === "object" && "response" in err
          ? (err as { response: { data: { message?: string } } }).response?.data
              ?.message
          : undefined;
      setError(
        apiError ??
          (err instanceof Error ? err.message : "Invalid email or password"),
      );
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        {error && (
          <div className="text-sm text-red-600 text-center">{error}</div>
        )}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>
        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <span
              className="text-sm underline-offset-4 hover:underline cursor-pointer text-primary"
              onClick={() => {
                console.log("Span clicked");
                window.location.href = "/forgot-password";
              }}
            >
              Forgot your password?
            </span>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Field>
        <Field>
          <Button type="submit" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <GoogleLoginButton mode="login" />
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline underline-offset-4">
              Sign up
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
