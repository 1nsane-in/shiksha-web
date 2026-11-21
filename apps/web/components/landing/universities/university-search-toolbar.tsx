"use client";

import React from "react";
import { Search, X } from "lucide-react";
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
  countries,
  countryFilter,
  onCountryFilterChange,
}: {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  typeFilter: UniversityTypeFilter;
  onTypeFilterChange: (value: UniversityTypeFilter) => void;
  countries?: string[];
  countryFilter?: string;
  onCountryFilterChange?: (value: string) => void;
}) {
  const hasActiveFilter =
    !!searchTerm || !!countryFilter || typeFilter !== "ALL";

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
          className="w-full py-2.5 pl-10 pr-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-gold bg-slate-50/50 text-navy"
        />
      </div>

      {/* Country Filter */}
      {countries && (
        <div className="w-full sm:w-44 shrink-0">
          <select
            aria-label="Filter by country"
            value={countryFilter || ""}
            onChange={(e) => onCountryFilterChange?.(e.target.value)}
            className="w-full py-2.5 px-3 border rounded-xl text-sm focus:outline-none text-navy"
            style={{
              borderColor: countryFilter ? brand.gold : brand.hairline,
              background: countryFilter ? brand.goldLight : "rgb(248 250 252 / 0.5)",
            }}
          >
            <option value="">All Countries</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Type Filter */}
      <div className="w-full sm:w-40 shrink-0">
        <select
          aria-label="Filter by university type"
          value={typeFilter}
          onChange={(e) =>
            onTypeFilterChange(e.target.value as UniversityTypeFilter)
          }
          className="w-full py-2.5 px-3 border rounded-xl text-sm focus:outline-none text-navy"
          style={{
            borderColor: typeFilter === "ALL" ? brand.hairline : brand.gold,
            background:
              typeFilter === "ALL" ? "rgb(248 250 252 / 0.5)" : brand.goldLight,
          }}
        >
          {FILTER_OPTIONS.map((filter) => (
            <option key={filter.id} value={filter.id}>
              {filter.label}
            </option>
          ))}
        </select>
      </div>

      {hasActiveFilter && (
        <button
          type="button"
          onClick={() => {
            onSearchChange("");
            onCountryFilterChange?.("");
            onTypeFilterChange("ALL");
          }}
          aria-label="Clear all filters"
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold text-navy transition-colors hover:bg-slate-50"
          style={{ border: `1px solid ${brand.gold}` }}
        >
          <X className="size-3.5" />
          Clear
        </button>
      )}
    </div>
  );
}
