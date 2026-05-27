import { client } from "@/shared/api/client";
import type { UniversityListItem, UniversityDetail, UniversityFilters, PaginatedResponse } from "./universities.types";

export function getUniversities(filters: UniversityFilters = {}) {
  return client.get<PaginatedResponse<UniversityListItem>>("/universities", {
    params: filters,
  });
}

export function getUniversity(identifier: string) {
  return client.get<UniversityDetail>(`/universities/${identifier}`);
}

export function getUniversityCountries() {
  return client.get<{ countries: string[] }>("/universities/countries");
}

