import { Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import type { ReactElement } from "react";

export const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; border: string; text: string; icon: React.ComponentType<{ className?: string }> }
> = {
  pending: { label: "Pending", bg: "bg-amber-50/50", border: "border-amber-200", text: "text-amber-800", icon: Clock },
  approved: { label: "Approved", bg: "bg-emerald-50/50", border: "border-emerald-200", text: "text-emerald-800", icon: CheckCircle2 },
  rejected: { label: "Rejected", bg: "bg-red-50/50", border: "border-red-200", text: "text-red-800", icon: XCircle },
  in_review: { label: "In Review", bg: "bg-blue-50/50", border: "border-blue-200", text: "text-blue-800", icon: AlertCircle },
};
