import type { WhyShikshaItem } from "@/lib/brand-data";

/**
 * One row in the support list. Quiet type, no icon tile.
 */
export function WhyWciecCard({
  index,
  title,
  desc,
}: WhyShikshaItem & { index: number }) {
  return (
    <div className="grid grid-cols-[32px_1fr] gap-4 border-t border-brand-hairline py-5">
      <span className="text-xs font-medium tabular-nums text-brand-ink-muted">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div>
        <h3 className="text-base font-medium text-brand-ink">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-brand-ink-muted">
          {desc}
        </p>
      </div>
    </div>
  );
}
