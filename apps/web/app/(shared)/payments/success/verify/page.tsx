"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@repo/ui";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { verifyPayment } from "@/domains/payments/payments.api";

type VerifyState = "loading" | "success" | "failed" | "error";

export default function PaymentVerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState<VerifyState>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function verify() {
      try {
        const status = searchParams.get("status") || "success";
        const txnid = searchParams.get("txnid") || "";
        const mihpayid = searchParams.get("mihpayid") || "";
        const amount = searchParams.get("amount") || "";
        const productinfo = searchParams.get("productinfo") || "";
        const firstname = searchParams.get("firstname") || "";
        const email = searchParams.get("email") || "";
        const hash = searchParams.get("hash") || "";
        const udf1 = searchParams.get("udf1") || "";
        const udf2 = searchParams.get("udf2") || "";
        const bank_ref_num = searchParams.get("bank_ref_num") || "";
        const mode = searchParams.get("mode") || "";
        const errorParam = searchParams.get("error") || "";
        const error_Message = searchParams.get("error_Message") || "";
        const additionalCharges = searchParams.get("additionalCharges") || "";

        if (!txnid || !hash) {
          setState("error");
          setMessage("Missing payment parameters. Please contact support.");
          return;
        }

        const result = await verifyPayment({
          status,
          txnid,
          mihpayid,
          amount,
          productinfo,
          firstname,
          email,
          hash,
          udf1,
          udf2,
          bank_ref_num,
          mode,
          error: errorParam,
          error_Message,
          additionalCharges: additionalCharges || undefined,
        });

        if (result.success) {
          setState("success");
          setMessage("Your payment has been verified successfully.");
        } else {
          setState("failed");
          setMessage("Payment verification failed. Please contact support.");
        }
      } catch (err: any) {
        setState("error");
        setMessage(
          err?.response?.data?.message ||
            err?.message ||
            "Something went wrong verifying your payment.",
        );
      }
    }

    verify();
  }, [searchParams]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        {state === "loading" && (
          <>
            <Loader2 className="mx-auto size-12 animate-spin text-[#4B2D8E]" />
            <h2 className="mt-4 text-lg font-semibold text-[#2D2154]">
              Verifying Payment...
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Please wait while we confirm your payment.
            </p>
          </>
        )}

        {state === "success" && (
          <>
            <CheckCircle2 className="mx-auto size-14 text-green-500" />
            <h2 className="mt-4 text-lg font-semibold text-[#2D2154]">
              Payment Successful!
            </h2>
            <p className="mt-2 text-sm text-gray-500">{message}</p>
            <div className="mt-6 flex flex-col gap-3">
              <Button
                onClick={() => router.push("/student/payments")}
                className="bg-[#4B2D8E] hover:bg-[#3D2475]"
              >
                View Payments
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/student/dashboard")}
              >
                Go to Dashboard
              </Button>
            </div>
          </>
        )}

        {(state === "failed" || state === "error") && (
          <>
            <XCircle className="mx-auto size-14 text-red-500" />
            <h2 className="mt-4 text-lg font-semibold text-[#2D2154]">
              {state === "failed" ? "Payment Failed" : "Verification Error"}
            </h2>
            <p className="mt-2 text-sm text-gray-500">{message}</p>
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
          </>
        )}
      </div>
    </div>
  );
}
