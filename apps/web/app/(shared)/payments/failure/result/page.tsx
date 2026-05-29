"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@repo/ui";
import { XCircle } from "lucide-react";

export default function PaymentFailurePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error =
    searchParams.get("error_Message") || "Payment was not completed.";

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <XCircle className="mx-auto size-14 text-red-500" />
        <h2 className="mt-4 text-lg font-semibold text-[#2D2154]">
          Payment Failed
        </h2>
        <p className="mt-2 text-sm text-gray-500">{error}</p>
        <div className="mt-6 flex flex-col gap-3">
          <Button
            onClick={() => router.push("/student/payments")}
            className="bg-[#4B2D8E] hover:bg-[#3D2475]"
          >
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/student/dashboard")}
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
