"use client";

import React, { Suspense, useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useUniversities } from "@/domains/universities/universities.queries";
import { seedUniversities } from "@/components/landing/universities/universities-data";
import { UniversityHero } from "@/components/landing/universities/university-hero";
import {
  UniversitySearchToolbar,
  type UniversityTypeFilter,
} from "@/components/landing/universities/university-search-toolbar";
import {
  UniversityLoading,
  UniversityEmptyState,
} from "@/components/landing/universities/university-list-section";
import { RequestBanner } from "@/components/landing/universities/request-banner";

// ---------------------------------------------------------------------------
// Dynamic imports — UniversityCardGrid uses motion/react (~20 KB), defer it
// ---------------------------------------------------------------------------
const UniversityCardGrid = dynamic(
  () =>
    import("@/components/landing/universities/university-list-section").then(
      (mod) => ({ default: mod.UniversityCardGrid }),
    ),
  { loading: () => <UniversityLoading /> },
);

/**
 * Public-facing universities listing page.
 */
function PublicUniversitiesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCountry = searchParams.get("country") || "";
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<UniversityTypeFilter>("ALL");

  const { data: response, isLoading, error } = useUniversities({
    limit: 50,
    ...(selectedCountry ? { country: selectedCountry } : {}),
  });
  const universities = response?.data?.length
    ? response.data
    : seedUniversities;

  // Filter logic (memoized)
  const filteredUniversities = useMemo(() => {
    return universities.filter((uni) => {
      const matchesSearch =
        uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        uni.shortName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === "ALL" || uni.type === typeFilter;
      const matchesCountry =
        !selectedCountry ||
        uni.location?.country?.toLowerCase() === selectedCountry.toLowerCase();
      return matchesSearch && matchesType && matchesCountry;
    });
  }, [universities, searchTerm, typeFilter, selectedCountry]);

  const handleApply = useCallback(
    (slug: string) => router.push(`/student/university/${slug}`),
    [router],
  );

  const handleViewDetails = useCallback(
    (slug: string) => router.push(`/student/university/${slug}`),
    [router],
  );

  const handleRequestUniversity = useCallback(
    () => router.push("/contact-us?subject=university-request"),
    [router],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-32">
      <UniversityHero />

      {selectedCountry && (
        <div className="mb-5 flex flex-wrap items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <span>
            Showing universities in <strong>{selectedCountry}</strong>
          </span>
          <button
            type="button"
            onClick={() => router.replace("/universities")}
            className="font-medium underline underline-offset-4 hover:no-underline"
          >
            Clear filter
          </button>
        </div>
      )}

      <UniversitySearchToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
      />

      {isLoading ? (
        <UniversityLoading />
      ) : filteredUniversities.length === 0 ? (
        <UniversityEmptyState onRequestUniversity={handleRequestUniversity} />
      ) : (
        <div className="mb-16">
          <UniversityCardGrid
            universities={filteredUniversities}
            onApply={handleApply}
            onViewDetails={handleViewDetails}
          />
          <RequestBanner onRequestUniversity={handleRequestUniversity} />
        </div>
      )}
    </div>
  );
}

export default function PublicUniversitiesPage() {
  return (
    <Suspense fallback={<UniversityLoading />}>
      <PublicUniversitiesContent />
    </Suspense>
  );
}
