"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, IndianRupee, Lock } from "lucide-react";
import type { StageActionItem } from "@/domains/student/student.constants";

interface NextStepCardProps {
  action: StageActionItem;
  variant?: "default" | "locked";
}

/** Sidebar locked next step card */
export function LockedNextStepCard() {
  const router = useRouter();

  return (
    <div className="rounded-xl border border-amber-200 bg-white p-5">
      <p className="mb-3 text-sm font-semibold text-navy">Next Step</p>
      <div className="flex items-center gap-2 mb-1">
        <Lock className="size-4 text-amber-600" />
        <span className="text-sm font-medium text-navy">Admission Letter Ready</span>
      </div>
      <p className="mb-4 text-sm text-slate-500">
        Your admission letter is ready. Pay ₹5,000 to unlock and download.
      </p>
      <button
        onClick={() => router.push("/student/payments")}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-royal-blue px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-navy-light"
      >
        <IndianRupee className="size-4" />
        Pay ₹5,000 to Unlock
        <ArrowRight className="size-4" />
      </button>
    </div>
  );
}

/** Default sidebar next step card */
export function NextStepCard({ action }: NextStepCardProps) {
  const router = useRouter();
  const ActionIcon = action.icon;

  return (
    <div className="rounded-xl border border-royal-blue/20 bg-white p-5">
      <p className="mb-3 text-sm font-semibold text-navy">Next Step</p>
      <div className="flex items-center gap-2 mb-1">
        <ActionIcon className="size-4 text-royal-blue" />
        <span className="text-sm font-medium text-navy">{action.label}</span>
      </div>
      <p className="mb-4 text-sm text-slate-500">{action.description}</p>
      <button
        onClick={() => router.push(action.href)}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-royal-blue px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-navy-light"
      >
        Proceed
        <ArrowRight className="size-4" />
      </button>
    </div>
  );
}
