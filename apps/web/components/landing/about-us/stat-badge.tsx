import { brand } from "@/lib/brand";

interface StatBadgeProps {
  value: string;
  label: string;
}

/**
 * Displays a bold statistic with a subdued label beneath it.
 * Used in the Foundation and Impact sections.
 */
export function StatBadge({ value, label }: StatBadgeProps) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold" style={{ color: brand.gold }}>
        {value}
      </p>
      <p className="text-[10px] opacity-60">{label}</p>
    </div>
  );
}
