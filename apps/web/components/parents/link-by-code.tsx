"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Field, FieldLabel, FieldGroup } from "@repo/ui";
import { useLinkByFamilyCode } from "@/domains/parents";
import { getApiErrorMessage } from "@/lib/api-error";
import { Link, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";

export function LinkByCode() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const linkMutation = useLinkByFamilyCode();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const sanitized = code.replace(/\s/g, "").toUpperCase();
    if (sanitized.length !== 6) {
      setError("Family code must be exactly 6 characters");
      return;
    }

    try {
      await linkMutation.mutateAsync({ familyCode: sanitized });
      setSuccess(true);
      setCode("");
      setTimeout(() => {
        router.refresh();
      }, 1500);
    } catch (err) {
      setError(getApiErrorMessage(err, "Code not found. Please check with your child."));
    }
  };

  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <Link className="w-5 h-5 text-gray-600" />
        <h2 className="font-medium text-gray-900">Link to your child</h2>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Enter your child&apos;s family code to get started. Ask them to share it with you.
      </p>

      {success ? (
        <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span>Linked successfully! Refreshing dashboard…</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="family-code">Family Code</FieldLabel>
              <div className="relative">
                <input
                  id="family-code"
                  type="text"
                  placeholder="AB12CD"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase())}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-center text-2xl font-bold tracking-[0.3em] text-gray-900 placeholder:text-gray-300 focus:border-[#4B2D8E] focus:outline-none focus:ring-2 focus:ring-[#4B2D8E]/20 uppercase"
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
            </Field>

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={code.replace(/\s/g, "").length < 6 || linkMutation.isPending}
            >
              {linkMutation.isPending ? (
                "Linking…"
              ) : (
                <>
                  Link Child
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </>
              )}
            </Button>
          </FieldGroup>
        </form>
      )}
    </Card>
  );
}
