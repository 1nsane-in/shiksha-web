"use client";

import { useRouter } from "next/navigation";
import { Button } from "@repo/ui";
import { ArrowLeft, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { STATUS_CONFIG } from "@/components/admin/shared/status-config";

interface Props {
  id: string;
  firstName: string;
  lastName: string;
  status: string;
  isPending?: boolean;
  showActions?: boolean;
  onApprove: () => void;
  onReject: () => void;
}

export function ApplicationDetailHeader({
  id,
  firstName,
  lastName,
  status,
  isPending,
  showActions,
  onApprove,
  onReject,
}: Props) {
  const router = useRouter();
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const StatusIcon = config.icon;

  return (
    <div className="border-b border-[#d3cec6] bg-transparent">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/admin/applications")}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#d3cec6] bg-white text-[#111111] hover:bg-zinc-50 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-medium tracking-tight text-[#111111]">
                {firstName} {lastName}
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full border border-[#d3cec6] px-2.5 py-0.5 text-[11px] font-medium bg-white text-[#111111]">
                <StatusIcon className="h-3 w-3 text-[#626260]" />
                {config.label}
              </span>
            </div>
            <p className="text-[11px] text-[#626260] mt-0.5">
              ID: <span className="font-mono text-zinc-500">{id}</span>
            </p>
          </div>
        </div>

        {showActions && (
          <div className="flex items-center gap-2">
            <button
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#111111] px-4 py-2 text-xs font-medium text-white hover:bg-black transition-all disabled:opacity-50 cursor-pointer"
              onClick={onApprove}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5" />
              )}
              Approve
            </button>
            <button
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#d3cec6] bg-white px-4 py-2 text-xs font-medium text-[#111111] hover:bg-zinc-50 transition-all disabled:opacity-50 cursor-pointer"
              onClick={onReject}
              disabled={isPending}
            >
              <XCircle className="h-3.5 w-3.5" /> Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
