"use client";

import { useState } from "react";
import { useApplications } from "@/domains/applications/applications.queries";
import type { ApplicationFilters } from "@/domains/applications/applications.types";
import { ApplicationsFilters } from "@/components/admin/applications/applications-filters";
import { ApplicationsTable } from "@/components/admin/applications/applications-table";
import { PaginationBar } from "@/components/admin/applications/pagination-bar";

export default function AdminApplicationsPage() {
  const [filters, setFilters] = useState<ApplicationFilters>({ page: 1, limit: 10 });
  const [search, setSearch] = useState("");

  const { data, isLoading, error, refetch } = useApplications(filters);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setFilters((prev) => ({ ...prev, search: val, page: 1 }));
  };

  const handleStatusFilter = (status: string) => {
    setFilters((prev) => ({ ...prev, status: status === "all" ? undefined : status, page: 1 }));
  };

  const handlePage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 md:p-6">
      <ApplicationsFilters
        search={search}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusFilter}
      />

      <ApplicationsTable data={data?.data} isLoading={isLoading} error={error} onRetry={() => refetch()} />

      {data?.meta && (
        <PaginationBar
          page={data.meta.page}
          totalPages={data.meta.totalPages}
          total={data.meta.total}
          onPageChange={handlePage}
        />
      )}
    </div>
  );
}
