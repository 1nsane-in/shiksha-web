"use client";

import React from "react";
import { Building2 } from "lucide-react";
import type { UniversityListItem } from "@/domains/universities/universities.types";
import { UniversityCard } from "./university-card";

/**
 * Loading spinner shown while fetching universities.
 */
export function UniversityLoading() {
  return (
    <div className="text-center py-20">
      <div className="inline-block size-8 animate-spin rounded-full border-4 border-solid border-gold border-r-transparent shrink-0" />
      <p className="text-xs text-slate-400 mt-4 font-semibold">
        Loading university directory...
      </p>
    </div>
  );
}

/**
 * Empty state shown when no universities match the current filters.
 */
export function UniversityEmptyState({
  onRequestUniversity,
}: {
  onRequestUniversity: () => void;
}) {
  return (
    <div className="text-center py-20 border border-slate-100 border-dashed rounded-2xl bg-white max-w-lg mx-auto">
      <Building2 className="size-12 text-slate-300 mx-auto mb-4" />
      <h3 className="text-base font-bold text-slate-700">
        No Universities Found
      </h3>
      <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
        No partners match your criteria. Try resetting filters or updating your
        search string.
      </p>
      <button
        onClick={onRequestUniversity}
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-gold hover:bg-[#b0852f] text-white font-semibold text-xs rounded-lg transition-all duration-200"
      >
        <Building2 className="w-4 h-4" />
        Request to Add University
      </button>
    </div>
  );
}

/**
 * Renders the card grid of filtered universities.
 */
export function UniversityCardGrid({
  universities,
  onApply,
  onViewDetails,
}: {
  universities: UniversityListItem[];
  onApply: (slug: string) => void;
  onViewDetails: (slug: string) => void;
}) {
  if (universities.length === 0) return null;

  return (
    <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
      {universities.map((uni, index) => (
        <UniversityCard
          key={uni.id}
          university={uni}
          index={index}
          onApply={onApply}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}
