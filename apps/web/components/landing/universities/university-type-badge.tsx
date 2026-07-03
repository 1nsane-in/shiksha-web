import React from "react";

// ---------------------------------------------------------------------------
// Type badge style map
// ---------------------------------------------------------------------------
const TYPE_STYLES: Record<string, { label: string; style: string }> = {
  GOVERNMENT: {
    label: "Government",
    style: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  PRIVATE: {
    label: "Private",
    style: "bg-violet-50 text-violet-700 ring-violet-200",
  },
};

/**
 * Badge showing the university type (Government / Private / SEMI_PRIVATE).
 */
export function UniversityTypeBadge({ type }: { type: string }) {
  const resolved = TYPE_STYLES[type] ?? {
    label: type,
    style: "bg-gray-50 text-gray-600 ring-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium leading-none ring-1 ring-inset ${resolved.style}`}
    >
      {resolved.label}
    </span>
  );
}

/**
 * Formats the establishment year: "1998 · 28 yrs"
 */
export function formatEstablished(year: number | null | undefined) {
  if (!year) return "\u2014";
  const current = new Date().getFullYear();
  return `${year} \u00B7 ${current - year} yrs`;
}
