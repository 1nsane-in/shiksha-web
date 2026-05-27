"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { Button } from "@repo/ui";
import { Badge } from "@repo/ui";
import { Input } from "@repo/ui";
import { Skeleton } from "@repo/ui";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@repo/ui";
import {
  CheckCircle2, XCircle, RotateCcw, Search, RefreshCw,
  AlertCircle, FileText, Eye, Clock
} from "lucide-react";
import { usePendingDocuments, useVerifyDocument, useMarkForReupload } from "@/domains/documents";

export default function AdminDocumentsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = usePendingDocuments({ page, limit: 20 });
  const verifyMutation = useVerifyDocument();
  const reuploadMutation = useMarkForReupload();

  const handleVerify = async (id: string, status: "APPROVED" | "REJECTED") => {
    try {
      await verifyMutation.mutateAsync({ id, status });
      refetch();
    } catch {}
  };

  const handleReupload = async (id: string) => {
    const remarks = prompt("Enter remarks for re-upload:");
    if (remarks) {
      try {
        await reuploadMutation.mutateAsync({ id, remarks });
        refetch();
      } catch {}
    }
  };

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="size-12 text-red-400 mb-4" />
        <h2 className="text-lg font-semibold text-[#2D2154]">Failed to load documents</h2>
        <p className="text-sm text-gray-500 mt-1 mb-6">Something went wrong.</p>
        <Button onClick={() => refetch()} variant="outline" className="gap-2">
          <RefreshCw className="size-4" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#2D2154]">Document Verification</h1>
          <p className="text-sm text-gray-500">Review and verify student-uploaded documents</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            placeholder="Search by student name..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card size="xl">
        <CardHeader>
          <CardTitle>Pending Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : !data || data.data.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-center">
              <CheckCircle2 className="size-12 text-green-300 mb-3" />
              <p className="text-sm text-gray-500 font-medium">All documents reviewed</p>
              <p className="text-xs text-gray-400 mt-1">No pending documents requiring verification</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Document Type</TableHead>
                      <TableHead>File</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.data.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">{doc.student?.user?.name ?? "N/A"}</TableCell>
                        <TableCell>{doc.documentType.name}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="gap-1 text-xs h-7" onClick={() => window.open(doc.fileUrl, "_blank")}>
                            <Eye className="size-3" /> View
                          </Button>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {new Date(doc.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs gap-1">
                            <Clock className="size-3" /> Pending
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="sm" variant="ghost"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50 h-8 px-2"
                              onClick={() => handleVerify(doc.id, "APPROVED")}
                              disabled={verifyMutation.isPending}
                            >
                              <CheckCircle2 className="size-4" />
                            </Button>
                            <Button
                              size="sm" variant="ghost"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                              onClick={() => handleVerify(doc.id, "REJECTED")}
                              disabled={verifyMutation.isPending}
                            >
                              <XCircle className="size-4" />
                            </Button>
                            <Button
                              size="sm" variant="ghost"
                              className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 h-8 px-2"
                              onClick={() => handleReupload(doc.id)}
                              disabled={reuploadMutation.isPending}
                            >
                              <RotateCcw className="size-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {data.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-500">Page {data.page} of {data.totalPages}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
                    <Button size="sm" variant="outline" disabled={page >= data.totalPages} onClick={() => setPage(page + 1)}>Next</Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
