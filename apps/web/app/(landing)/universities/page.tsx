"use client";

import React, { useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useUniversities } from "@/domains/universities/universities.queries";
import { seedUniversities } from "@/components/landing/universities/universities-data";
import { UniversityHero } from "@/components/landing/universities/university-hero";
import {
  UniversitySearchToolbar,
  type UniversityTypeFilter,
} from "@/components/landing/universities/university-search-toolbar";
import { UniversityLoading, UniversityEmptyState } from "@/components/landing/universities/university-list-section";
import { RequestBanner } from "@/components/landing/universities/request-banner";

// ---------------------------------------------------------------------------
// Dynamic imports — UniversityCardGrid uses motion/react (~20 KB), defer it
// ---------------------------------------------------------------------------
const UniversityCardGrid = dynamic(
  () =>
    import("@/components/landing/universities/university-list-section").then(
      (mod) => ({ default: mod.UniversityCardGrid })
    ),
  { loading: () => <UniversityLoading /> }
);

/**
 * Public-facing universities listing page.
 */
export default function PublicUniversitiesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<UniversityTypeFilter>("ALL");

  const { data: response, isLoading, error } = useUniversities({ limit: 50 });
  const universities =
    response?.data?.length ? response.data : seedUniversities;

  // Filter logic (memoized)
  const filteredUniversities = useMemo(() => {
    return universities.filter((uni) => {
      const matchesSearch =
        uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        uni.shortName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType =
        typeFilter === "ALL" || uni.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [universities, searchTerm, typeFilter]);

  const handleApply = useCallback(
    (slug: string) => router.push(`/student/university/${slug}`),
    [router]
  );

  const handleViewDetails = useCallback(
    (slug: string) => router.push(`/student/university/${slug}`),
    [router]
  );

  const handleRequestUniversity = useCallback(
    () => router.push("/contact-us?subject=university-request"),
    [router]
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <UniversityHero />

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
        <>
          <UniversityCardGrid
            universities={filteredUniversities}
            onApply={handleApply}
            onViewDetails={handleViewDetails}
          />
          <RequestBanner onRequestUniversity={handleRequestUniversity} />
        </>
      )}
    </div>
  );
}
