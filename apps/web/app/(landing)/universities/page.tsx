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
  const typeParam = searchParams.get("type");
  const typeFilter: UniversityTypeFilter =
    typeParam === "GOVERNMENT" || typeParam === "PRIVATE"
      ? typeParam
      : "ALL";
  const [searchTerm, setSearchTerm] = useState("");

  const { data: response, isLoading, error } = useUniversities({ limit: 50 });
  const universities = response?.data?.length
    ? response.data
    : seedUniversities;

  const countryOptions = useMemo(
    () =>
      Array.from(
        new Set(
          universities
            .map((uni) => uni.location?.country)
            .filter((country): country is string => !!country),
        ),
      ).sort(),
    [universities],
  );

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

  const handleCountryChange = useCallback(
    (country: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (country) params.set("country", country);
      else params.delete("country");
      router.replace(
        params.size ? `/universities?${params.toString()}` : "/universities",
      );
    },
    [router, searchParams],
  );

  const handleTypeFilterChange = useCallback(
    (value: UniversityTypeFilter) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "ALL") params.delete("type");
      else params.set("type", value);
      router.replace(
        params.size ? `/universities?${params.toString()}` : "/universities",
      );
    },
    [router, searchParams],
  );

  const handleRequestUniversity = useCallback(
    () => router.push("/contact-us?subject=university-request"),
    [router],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-32">
      <UniversityHero />

      <UniversitySearchToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        typeFilter={typeFilter}
        onTypeFilterChange={handleTypeFilterChange}
        countries={countryOptions}
        countryFilter={selectedCountry}
        onCountryFilterChange={handleCountryChange}
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
