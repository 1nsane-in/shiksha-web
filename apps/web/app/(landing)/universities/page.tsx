import React, { Suspense } from "react";
import { serverGet } from "@/shared/api/server-fetch";
import type { PaginatedResponse, UniversityListItem } from "@/domains/universities/universities.types";
import { seedUniversities } from "@/components/landing/universities/universities-data";
import { UniversityHero } from "@/components/landing/universities/university-hero";
import { UniversitiesClient } from "@/components/landing/universities/universities-client";
import { UniversityLoading } from "@/components/landing/universities/university-list-section";

export const metadata = {
  title: "Universities | Shiksha International",
  description:
    "Explore government and private medical universities across Kyrgyzstan, Uzbekistan, Kazakhstan and Russia.",
};

export default async function PublicUniversitiesPage() {
  const response = await serverGet<PaginatedResponse<UniversityListItem>>("/universities?limit=50");
  const universities = response?.data?.length ? response.data : seedUniversities;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-32">
      <UniversityHero />
      <Suspense fallback={<UniversityLoading />}>
        <UniversitiesClient universities={universities} />
      </Suspense>
    </div>
  );
}
