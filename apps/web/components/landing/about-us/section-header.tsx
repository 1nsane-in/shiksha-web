import { brand } from "@/lib/brand";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  dark?: boolean;
}

/**
 * Reusable section header used across landing pages.
 * Renders an eyebrow label, a bold title, and optional description.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  dark,
}: SectionHeaderProps) {
  return (
    <div className="max-w-2xl mb-12 sm:mb-16">
      <span
        className="text-[11px] font-bold uppercase tracking-[0.2em]"
        style={{ color: brand.gold }}
      >
        {eyebrow}
      </span>
      <h2
        className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2"
        style={{ color: dark ? "#fff" : brand.ink }}
      >
        {title}
      </h2>
      {description && (
        <p
          className="text-sm sm:text-base mt-2 sm:mt-3"
          style={{ color: dark ? "rgba(255,255,255,0.62)" : brand.inkMuted }}
        >
          {description}
        </p>
      )}
    </div>
  );
}
