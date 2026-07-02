import { brand } from "@/lib/brand";
import { GraduationCap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { iconMap, type WhyShikshaItem } from "@/lib/brand-data";

/**
 * A single feature card for the "Why Shiksha" section.
 * Renders an icon, title, and description.
 */
export function WhyWciecCard({ icon, title, desc }: WhyShikshaItem) {
  const Icon: LucideIcon = iconMap[icon] ?? GraduationCap;

  return (
    <div className="flex gap-5 p-6 rounded-xl transition-all hover:bg-[#FAF9F6] border border-transparent hover:border-gray-100">
      <div
        className="flex size-10 shrink-0 items-center justify-center rounded-lg"
        style={{ background: brand.goldLight, color: brand.gold }}
      >
        <Icon className="size-5" />
      </div>
      <div>
        <h3 className="font-bold text-base text-[#2D2154]">{title}</h3>
        <p className="mt-2 text-xs sm:text-sm leading-relaxed" style={{ color: brand.inkMuted }}>
          {desc}
        </p>
      </div>
    </div>
  );
}
