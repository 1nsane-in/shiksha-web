"use client";

import React from "react";
import { Search } from "lucide-react";
import { brand } from "@/lib/brand";

export type UniversityTypeFilter = "ALL" | "GOVERNMENT" | "PRIVATE";

const FILTER_OPTIONS: {
  id: UniversityTypeFilter;
  label: string;
}[] = [
  { id: "ALL", label: "All Types" },
  { id: "GOVERNMENT", label: "Government" },
  { id: "PRIVATE", label: "Private" },
];

/**
 * Search input + type filter pills for the universities listing.
 */
export function UniversitySearchToolbar({
  searchTerm,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
}: {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  typeFilter: UniversityTypeFilter;
  onTypeFilterChange: (value: UniversityTypeFilter) => void;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm max-w-4xl mx-auto mb-12 flex flex-col sm:flex-row items-center gap-4">
      {/* Search Input */}
      <div className="relative w-full sm:flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search university by name or abbreviation (e.g. OSMU)..."
          className="w-full py-2.5 pl-10 pr-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-gold bg-slate-50/50 text-[#1A153A]"
        />
      </div>

      {/* Type Filters */}
      <div className="flex gap-2 shrink-0 w-full sm:w-auto justify-center sm:justify-start border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
        {FILTER_OPTIONS.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onTypeFilterChange(filter.id)}
            className="py-2 px-4 rounded-xl text-xs font-bold transition-all duration-150 border"
            style={{
              background:
                typeFilter === filter.id ? brand.goldLight : "transparent",
              borderColor:
                typeFilter === filter.id ? brand.gold : brand.hairline,
              color: typeFilter === filter.id ? brand.ink : brand.inkMuted,
            }}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}
