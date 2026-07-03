"use client";

import { useRouter } from "next/navigation";
import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Button, Skeleton } from "@repo/ui";
import { AlertCircle } from "lucide-react";
import { STATUS_CONFIG } from "@/components/admin/shared/status-config";
import type { Application } from "@/domains/applications/applications.types";

interface Props {
  data: Application[] | undefined;
  isLoading: boolean;
  error: Error | null;
  onRetry: () => void;
}

export function ApplicationsTable({ data, isLoading, error, onRetry }: Props) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center max-w-sm mx-auto">
        <AlertCircle className="size-10 text-red-500 mb-3" />
        <p className="text-sm font-bold text-[#1A153A]">Failed to load applications</p>
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-3 cursor-pointer">
          Retry
        </Button>
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500 rounded-xl bg-white border border-dashed border-gray-200">
        <AlertCircle className="size-10 text-gray-300 mb-2" />
        <p className="text-sm font-semibold text-[#1A153A]">No university applications found</p>
        <p className="text-xs text-gray-400 mt-0.5">Please check again later or adjust search terms.</p>
      </div>
    );
  }

  return (
    <Card className="border border-[#ECEAE6] p-1">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#ECEAE6]">
              <TableHead className="font-bold text-[10px] text-gray-400 uppercase tracking-wider py-3 px-4">
                Student
              </TableHead>
              <TableHead className="font-bold text-[10px] text-gray-400 uppercase tracking-wider py-3 px-4">
                University & Program
              </TableHead>
              <TableHead className="font-bold text-[10px] text-gray-400 uppercase tracking-wider py-3 px-4">
                Submitted Date
              </TableHead>
              <TableHead className="font-bold text-[10px] text-gray-400 uppercase tracking-wider text-center py-3 px-4">
                Status
              </TableHead>
              <TableHead className="font-bold text-[10px] text-gray-400 uppercase tracking-wider text-right py-3 px-4">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((app) => {
              const status = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
              const StatusIcon = status.icon;
              return (
                <TableRow
                  key={app.id}
                  className="hover:bg-gray-50/50 transition-colors border-b border-[#ECEAE6] cursor-pointer"
                  onClick={() => router.push(`/admin/applications/${app.id}`)}
                >
                  <TableCell className="py-3 px-4">
                    <div>
                      <p className="font-bold text-sm text-[#1A153A]">
                        {app.firstName} {app.lastName}
                      </p>
                      <p className="text-xs text-gray-400 font-mono mt-0.5">{app.email}</p>
                    </div>
                  </TableCell>

                  <TableCell className="py-3 px-4">
                    <div className="space-y-1">
                      <p className="font-semibold text-sm text-[#1A153A] leading-tight">
                        {app.university?.name || "Unknown University"}
                      </p>
                      <span className="inline-block font-bold text-gray-500 bg-gray-50 border rounded px-1.5 py-0.5 text-[9px] uppercase tracking-wider">
                        {app.selectedProgram || "Unknown program"}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="py-3 px-4 text-xs text-gray-400 font-semibold uppercase">
                    {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : "Pending"}
                  </TableCell>

                  <TableCell className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold ${status.bg} ${status.border} ${status.text}`}
                    >
                      <StatusIcon className="size-3.5" />
                      {status.label}
                    </span>
                  </TableCell>

                  <TableCell className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <Button size="sm" variant="ghost" onClick={() => router.push(`/admin/applications/${app.id}`)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
