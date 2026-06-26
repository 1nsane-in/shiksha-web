import { brand } from "@/lib/brand";
import type { PartnerUniversity } from "@/lib/brand-data";

interface UniversityCardProps extends PartnerUniversity {
  index: number;
}

/**
 * A single row in the partner universities directory listing.
 */
export function UniversityCard({ name, location, index }: UniversityCardProps) {
  return (
    <div
      className="flex items-center gap-4 rounded-xl p-5 bg-white border"
      style={{ borderColor: brand.hairline }}
    >
      <span className="text-xs font-bold text-gray-300">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div>
        <p className="text-xs sm:text-sm font-bold text-[#2D2154]">{name}</p>
        <p className="text-[10px] text-gray-400">{location}</p>
      </div>
    </div>
  );
}
