"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Badge, Skeleton } from "@repo/ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui";
import { User, AlertCircle, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { stageNames, statusColors } from "./student-constants";

interface Props {
  students: any[];
  isLoading: boolean;
  isError: boolean;
  page: number;
  totalPages: number;
  onRetry: () => void;
  onPageChange: (page: number) => void;
  onSelectStudent: (student: any) => void;
}

export function StudentsTable({ students, isLoading, isError, page, totalPages, onRetry, onPageChange, onSelectStudent }: Props) {
  const router = useRouter();

  if (isError) {
    return (
      <Card className="border-[#ECEAE6] bg-[#FAFAF8]">
        <CardContent className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="size-12 text-red-400 mb-4" />
          <h2 className="text-lg font-semibold text-[#111]">Failed to load student profiles</h2>
          <Button onClick={onRetry} variant="outline" className="gap-2 mt-4">Retry</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card size="xl" className="border-[#EAE7E3] bg-[#FAFAF8]">
      <CardHeader className="flex flex-row items-center justify-between pb-2 flex-wrap gap-2">
        <div>
          <CardTitle className="text-base font-semibold">All Student Accounts</CardTitle>
          <CardDescription className="text-xs">Browse list or select a row for immediate actions.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-md" />
            ))}
          </div>
        ) : students.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center text-gray-500">
            <User className="size-10 text-gray-300 mb-2" />
            <p className="text-sm font-medium">No students match current filters</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#ECEAE6]">
                    <TableHead className="font-semibold text-xs text-[#666] uppercase tracking-wider">Student</TableHead>
                    <TableHead className="font-semibold text-xs text-[#666] uppercase tracking-wider">Current Stage</TableHead>
                    <TableHead className="font-semibold text-xs text-[#666] uppercase tracking-wider">Status</TableHead>
                    <TableHead className="font-semibold text-xs text-[#666] uppercase tracking-wider text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow
                      key={student.id}
                      className="hover:bg-[#F2F1ED] cursor-pointer border-[#ECEAE6] transition-colors"
                      onClick={() => onSelectStudent(student)}
                    >
                      <TableCell>
                        <div>
                          <p className="font-semibold text-sm text-[#111]">{student.user?.name ?? "N/A"}</p>
                          <p className="text-xs text-gray-400 font-mono">{student.user?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-semibold text-[#555]">
                          Stage {student.currentStage}: {stageNames[student.currentStage] ?? "N/A"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`text-[10px] uppercase font-bold py-0.5 px-2 rounded border ${statusColors[student.applicationStatus] || "bg-gray-100 text-gray-800"}`}
                        >
                          {student.applicationStatus?.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => { e.stopPropagation(); router.push(`/admin/students/${student.id}`); }}
                          className="text-[#3730A3] hover:text-indigo-900 font-semibold text-xs cursor-pointer"
                        >
                          Details <ArrowRight className="size-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-xs text-gray-400">Showing page {page} of {totalPages}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="cursor-pointer">
                    <ChevronLeft className="size-4" />
                  </Button>
                  <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className="cursor-pointer">
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
