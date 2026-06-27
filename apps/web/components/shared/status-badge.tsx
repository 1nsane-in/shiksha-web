import { statusConfig } from "@/domains/student/student.constants";
import type { LucideIcon } from "lucide-react";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending;
  const Icon: LucideIcon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium ${config.color} ${className ?? ""}`}
    >
      <Icon className="size-4" />
      {config.label}
    </div>
  );
}
