"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Input, Field, FieldDescription, FieldGroup, FieldLabel } from "@repo/ui";
import { useAuthStore } from "@/stores/auth-store";
import { getApiErrorMessage } from "@/lib/api-error";
import { useValidateInviteCode } from "@/domains/parents";
import {
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  Mail,
  Phone,
  User,
} from "lucide-react";
import Link from "next/link";

type Step = "register" | "email-otp" | "phone-otp" | "success" | "error";

export default function InviteRegisterPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;

  const { data: invite, isLoading: inviteLoading, error: inviteError } = useValidateInviteCode(code);

  const [step, setStep] = useState<Step>("register");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Form fields
  const [parentName, setParentName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passError, setPassError] = useState("");
  const [relation, setRelation] = useState("");

  // OTPs
  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Set initial relation from invite
  useEffect(() => {
    if (invite?.relation) {
      setRelation(invite.relation);
    }
  }, [invite?.relation]);

  // ─── Send email OTP ───
  const handleSendEmailOtp = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const { sendEmailOtp } = await import("@/domains/parents/parents.api");
      await sendEmailOtp(invite!.email, parentName);
      setStep("email-otp");
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to send email OTP"));
    } finally {
      setLoading(false);
    }
  }, [invite, parentName]);

  // ─── Verify email OTP ───
  const handleVerifyEmailOtp = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const { verifyEmailOtp } = await import("@/domains/parents/parents.api");
      await verifyEmailOtp(invite!.email, emailOtp);
      // Auto-send phone OTP
      const { sendPhoneOtp } = await import("@/domains/parents/parents.api");
      await sendPhoneOtp(phone);
      setStep("phone-otp");
    } catch (err) {
      setError(getApiErrorMessage(err, "Invalid email OTP"));
    } finally {
      setLoading(false);
    }
  }, [invite, emailOtp, phone]);

  // ─── Verify phone OTP ───
  const handleVerifyPhoneOtp = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const { verifyPhoneOtp } = await import("@/domains/parents/parents.api");
      await verifyPhoneOtp(phone, phoneOtp);
      // Submit registration
      await submitRegistration();
    } catch (err) {
      setError(getApiErrorMessage(err, "Invalid phone OTP"));
    } finally {
      setLoading(false);
    }
  }, [phone, phoneOtp]);

  // ─── Submit final registration ───
  const submitRegistration = useCallback(async () => {
    setLoading(true);
    try {
      const { parentRegister } = await import("@/domains/parents/parents.api");
      const result = await parentRegister({
        name: parentName,
        email: invite!.email,
        phone,
        password,
        inviteCode: code,
        ...(relation ? { relation } : {}),
      });
      useAuthStore.getState().login(result.user, result.accessToken);
      setStep("success");
      setTimeout(() => {
        router.push("/parents/dashboard");
      }, 1500);
    } catch (err) {
      setError(getApiErrorMessage(err, "Registration failed. Please try again."));
    } finally {
      setLoading(false);
    }
  }, [parentName, invite, phone, password, code, router]);

  // ─── Handle form submission (step 1 → send email OTP) ───
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setPassError("");

    if (!parentName.trim()) {
      setError("Please enter your name");
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid phone number");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setPassError("Passwords do not match");
      return;
    }

    await handleSendEmailOtp();
  };

  // ─── Loading state for invite validation ───
  if (inviteLoading) {
    return (
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col p-6 md:p-10">
          <div className="flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-[#4B2D8E]" />
              <p className="text-sm text-gray-500">Validating invite link…</p>
            </div>
          </div>
        </div>
        <div className="relative hidden lg:block bg-muted" />
      </div>
    );
  }

  // ─── Error state for invalid/expired invite ───
  if (inviteError || (invite && !invite.valid)) {
    const isExpired = invite?.expired;
    const isUsed = invite?.alreadyUsed;
    return (
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col p-6 md:p-10">
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-sm text-center space-y-4">
              <div className="mx-auto w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                <AlertCircle className="w-7 h-7 text-red-500" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Invalid Invite Link</h1>
              <p className="text-sm text-gray-500">
                {isExpired
                  ? "This invite link has expired. Please ask your child to send a new invite."
                  : isUsed
                    ? "This invite link has already been used."
                    : "This invite link is invalid or has been revoked."}
              </p>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-lg bg-[#4B2D8E] px-4 py-2 text-sm font-medium text-white hover:bg-[#3D2370] transition-colors"
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>
        <div className="relative hidden lg:block bg-muted" />
      </div>
    );
  }

  // ─── Main registration form ───
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start mb-6">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <img src="/img/logo.png" alt="" className="h-8" />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            {/* Stepper indicator */}
            {step !== "error" && step !== "success" && (
              <div className="flex items-center justify-center gap-2 mb-6">
                {["register", "email-otp", "phone-otp"].map((s, i) => (
                  <div key={s} className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
                        step === s
                          ? "bg-[#4B2D8E] text-white"
                          : s === "register" && step !== "register"
                            ? "bg-green-500 text-white"
                            : s === "email-otp" && step === "phone-otp"
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {((s === "register" && step !== "register") ||
                        (s === "email-otp" && step === "phone-otp")) ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        i + 1
                      )}
                    </div>
                    {i < 2 && (
                      <div
                        className={`w-8 h-0.5 ${
                          (s === "register" && step !== "register") ||
                          (s === "email-otp" && step === "phone-otp")
                            ? "bg-green-500"
                            : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {step === "success" && (
              <div className="text-center space-y-4">
                <div className="mx-auto w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
                  <CheckCircle className="w-7 h-7 text-green-500" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900">Account Created!</h1>
                <p className="text-sm text-gray-500">
                  Welcome to Shiksha Study. Redirecting to your dashboard…
                </p>
                <Loader2 className="mx-auto h-5 w-5 animate-spin text-[#4B2D8E]" />
              </div>
            )}

            {step === "register" && (
              <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
                <FieldGroup>
                  <div className="flex flex-col items-center gap-1 text-center mb-2">
                    <h1 className="text-2xl font-bold">Create Parent Account</h1>
                    <p className="text-sm text-balance text-muted-foreground">
                      You&apos;ve been invited to track your child&apos;s admission
                    </p>
                  </div>

                  {/* Pre-filled from invite */}
                  <Field>
                    <FieldLabel>Student</FieldLabel>
                    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{invite?.studentName ?? "—"}</span>
                    </div>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="email">Email (locked)</FieldLabel>
                    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{invite?.email ?? "—"}</span>
                    </div>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="relation">Relation</FieldLabel>
                    <select
                      id="relation"
                      value={relation}
                      onChange={(e) => setRelation(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-[#4B2D8E] focus:outline-none focus:ring-2 focus:ring-[#4B2D8E]/20"
                    >
                      <option value="">Select relation</option>
                      <option value="FATHER">Father</option>
                      <option value="MOTHER">Mother</option>
                      <option value="GUARDIAN">Guardian</option>
                    </select>
                  </Field>

                  <FieldSeparator />

                  <Field>
                    <FieldLabel htmlFor="parentName">Your Name</FieldLabel>
                    <Input
                      id="parentName"
                      type="text"
                      placeholder="Anita Sharma"
                      required
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+919876543210"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <FieldDescription>For SMS alerts about your child&apos;s progress</FieldDescription>
                  </Field>

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
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9c9fa5] hover:text-[#626260] transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Re-enter password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9c9fa5] hover:text-[#626260] transition-colors"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </Field>

                  {passError && (
                    <div className="text-sm text-red-600 text-center">{passError}</div>
                  )}

                  <Field>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading || !parentName || !phone || password.length < 6 || !confirmPassword}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending OTP…
                        </>
                      ) : (
                        <>
                          Continue
                          <ArrowRight className="ml-1.5 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            )}

            {step === "email-otp" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleVerifyEmailOtp();
                }}
                className="flex flex-col gap-6"
              >
                <FieldGroup>
                  <div className="flex flex-col items-center gap-1 text-center mb-2">
                    <Mail className="h-8 w-8 text-[#4B2D8E]" />
                    <h1 className="text-2xl font-bold">Verify your email</h1>
                    <p className="text-sm text-balance text-muted-foreground">
                      We sent a code to <strong>{invite?.email}</strong>
                    </p>
                  </div>

                  <Field>
                    <FieldLabel htmlFor="emailOtp">Email OTP</FieldLabel>
                    <Input
                      id="emailOtp"
                      type="text"
                      placeholder="Enter 6-digit code"
                      required
                      maxLength={6}
                      value={emailOtp}
                      onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ""))}
                    />
                  </Field>

                  <Field>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading || emailOtp.length !== 6}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying…
                        </>
                      ) : (
                        "Verify Email"
                      )}
                    </Button>
                  </Field>

                  <Field>
                    <Button
                      variant="link"
                      type="button"
                      className="w-full"
                      disabled={loading}
                      onClick={handleSendEmailOtp}
                    >
                      Resend code
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            )}

            {step === "phone-otp" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleVerifyPhoneOtp();
                }}
                className="flex flex-col gap-6"
              >
                <FieldGroup>
                  <div className="flex flex-col items-center gap-1 text-center mb-2">
                    <Phone className="h-8 w-8 text-[#4B2D8E]" />
                    <h1 className="text-2xl font-bold">Verify your phone</h1>
                    <p className="text-sm text-balance text-muted-foreground">
                      We sent a code to <strong>{phone}</strong>
                    </p>
                  </div>

                  <Field>
                    <FieldLabel htmlFor="phoneOtp">Phone OTP</FieldLabel>
                    <Input
                      id="phoneOtp"
                      type="text"
                      placeholder="Enter 6-digit code"
                      required
                      maxLength={6}
                      value={phoneOtp}
                      onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, ""))}
                    />
                  </Field>

                  <Field>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading || phoneOtp.length !== 6}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying…
                        </>
                      ) : (
                        "Verify Phone & Create Account"
                      )}
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            )}
          </div>
        </div>
      </div>
      <div className="relative hidden lg:block bg-muted">
        <img
          src="https://images.unsplash.com/photo-1607013407627-6ee814329547?q=80&w=964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
}

function FieldSeparator() {
  return (
    <div className="relative my-1">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>
    </div>
  );
}
