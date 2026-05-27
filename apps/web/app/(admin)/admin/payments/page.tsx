"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { Button } from "@repo/ui";
import { Badge } from "@repo/ui";
import { Skeleton } from "@repo/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui";
import { CheckCircle2, AlertCircle, RefreshCw, CreditCard, IndianRupee, Clock } from "lucide-react";
import { usePendingPayments, useManualApprovePayment } from "@/domains/admin";

export default function AdminPaymentsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = usePendingPayments(page, 20);
  const approveMutation = useManualApprovePayment();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleApprove = async (paymentId: string) => {
    try {
      await approveMutation.mutateAsync({ paymentId });
      setFeedback({ type: "success", message: "Payment approved successfully" });
      refetch();
    } catch {
      setFeedback({ type: "error", message: "Failed to approve payment" });
    }
    setTimeout(() => setFeedback(null), 3000);
  };

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="size-12 text-red-400 mb-4" />
        <h2 className="text-lg font-semibold text-[#2D2154]">Failed to load payments</h2>
        <Button onClick={() => refetch()} variant="outline" className="gap-2 mt-4">
          <RefreshCw className="size-4" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
      <div>
        <h1 className="text-xl font-bold text-[#2D2154]">Payment Management</h1>
        <p className="text-sm text-gray-500">Monitor and approve student payments</p>
      </div>

      {feedback && (
        <div className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm ${
          feedback.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"
        }`}>
          {feedback.type === "success" ? <CheckCircle2 className="size-4" /> : <AlertCircle className="size-4" />}
          {feedback.message}
        </div>
      )}

      <Card size="xl">
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : !data || data.data.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-center">
              <CheckCircle2 className="size-12 text-green-300 mb-3" />
              <p className="text-sm text-gray-500 font-medium">All payments processed</p>
              <p className="text-xs text-gray-400 mt-1">No pending payments requiring manual approval</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>University</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.data.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.student?.user?.name ?? "N/A"}</TableCell>
                        <TableCell className="text-sm text-gray-500">{payment.application?.university?.shortName ?? "N/A"}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">Stage {payment.stage}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          <span className="flex items-center gap-1">
                            <IndianRupee className="size-3" />
                            {payment.amount.toLocaleString("en-IN")}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {new Date(payment.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs gap-1">
                            <Clock className="size-3" /> {payment.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            className="gap-1 text-xs"
                            onClick={() => handleApprove(payment.id)}
                            disabled={approveMutation.isPending}
                          >
                            <CheckCircle2 className="size-3.5" />
                            {approveMutation.isPending ? "Approving..." : "Approve"}
                          </Button>
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
