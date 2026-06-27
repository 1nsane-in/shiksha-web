"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, IndianRupee, Lock } from "lucide-react";
import type { StageActionItem } from "@/domains/student/student.constants";

interface StageActionCardProps {
  action: StageActionItem;
  variant?: "default" | "locked";
}

/** Locked card for admission fee when letter is locked */
export function LockedStageCard() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50/50 px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-amber-100 p-2.5">
          <Lock className="size-5 text-amber-600" />
        </div>
        <div>
          <p className="font-semibold text-[#2D2154]">Admission Letter Ready</p>
          <p className="text-sm text-[#6B6B6B]">
            Pay ₹5,000 admission fee to unlock and download
          </p>
        </div>
      </div>
      <button
        onClick={() => router.push("/student/payments")}
        className="inline-flex items-center gap-2 rounded-lg bg-[#4B2D8E] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#3D2475]"
      >
        <IndianRupee className="size-4" />
        Pay ₹5,000 to Unlock
        <ArrowRight className="size-4" />
      </button>
    </div>
  );
}

/** Default stage action card */
export function StageActionCard({ action, variant = "default" }: StageActionCardProps) {
  const router = useRouter();
  const ActionIcon = action.icon;

  const bgClass = variant === "locked"
    ? "border-amber-200 bg-amber-50/50"
    : "border-[#4B2D8E]/20 bg-[#4B2D8E]/5";
  const iconBgClass = variant === "locked"
    ? "bg-amber-100"
    : "bg-[#4B2D8E]/10";
  const iconColorClass = variant === "locked"
    ? "text-amber-600"
    : "text-[#4B2D8E]";

  return (
    <div className={`flex items-center justify-between rounded-xl border ${bgClass} px-5 py-4`}>
      <div className="flex items-center gap-3">
        <div className={`rounded-full ${iconBgClass} p-2.5`}>
          {variant === "locked" ? (
            <Lock className={`size-5 ${iconColorClass}`} />
          ) : (
            <ActionIcon className={`size-5 ${iconColorClass}`} />
          )}
        </div>
        <div>
          <p className="font-semibold text-[#2D2154]">{action.label}</p>
          <p className="text-sm text-[#6B6B6B]">{action.description}</p>
        </div>
      </div>
      <button
        onClick={() => router.push(action.href)}
        className="inline-flex items-center gap-2 rounded-lg bg-[#4B2D8E] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#3D2475]"
      >
        {variant === "locked" ? (
          <>
            <IndianRupee className="size-4" />
            Pay ₹5,000 to Unlock
          </>
        ) : (
          "Proceed"
        )}
        <ArrowRight className="size-4" />
      </button>
    </div>
  );
}
