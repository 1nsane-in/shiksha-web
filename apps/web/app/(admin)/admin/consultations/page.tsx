"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Skeleton,
} from "@repo/ui";
import { toast } from "sonner";
import { PhoneCall, Trash2, CheckCircle2, Loader2 } from "lucide-react";
import { useConsultations, useUpdateConsultationStatus, useDeleteConsultation } from "@/domains/consultations";
import type { Consultation } from "@/domains/consultations";

var statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  CONTACTED: "bg-blue-100 text-blue-800 border-blue-200",
  CLOSED: "bg-green-100 text-green-800 border-green-200",
};

export default function ConsultationsAdminPage() {
  const { data: consultations = [], isLoading, error } = useConsultations();
  const updateStatusMutation = useUpdateConsultationStatus();
  const deleteMutation = useDeleteConsultation();

  const handleStatusChange = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "PENDING" ? "CONTACTED" : currentStatus === "CONTACTED" ? "CLOSED" : "PENDING";
    try {
      await updateStatusMutation.mutateAsync({ id, status: nextStatus });
      toast.success(`Status updated to ${nextStatus}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this consultation request?")) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Consultation request deleted successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete request");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-[#111]">Consultation Requests</h1>
        <p className="text-sm text-[#666]">Review and manage career consultation forms submitted by prospective students.</p>
      </div>

      <Card className="border-[#ECEAE6] bg-[#FAFAF8]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <PhoneCall className="h-4 w-4" />
            All Submissions ({consultations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-md" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500 text-sm">
              Failed to load consultations. Please try again.
            </div>
          ) : consultations.length === 0 ? (
            <div className="text-center py-12 text-[#888] text-sm">
              No consultation requests submitted yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#ECEAE6]">
                    <TableHead className="font-semibold text-xs text-[#666] uppercase tracking-wider">Date</TableHead>
                    <TableHead className="font-semibold text-xs text-[#666] uppercase tracking-wider">Name</TableHead>
                    <TableHead className="font-semibold text-xs text-[#666] uppercase tracking-wider">Email</TableHead>
                    <TableHead className="font-semibold text-xs text-[#666] uppercase tracking-wider">Mobile No.</TableHead>
                    <TableHead className="font-semibold text-xs text-[#666] uppercase tracking-wider text-center">NEET Score</TableHead>
                    <TableHead className="font-semibold text-xs text-[#666] uppercase tracking-wider">State / Country</TableHead>
                    <TableHead className="font-semibold text-xs text-[#666] uppercase tracking-wider text-center">Status</TableHead>
                    <TableHead className="font-semibold text-xs text-[#666] uppercase tracking-wider text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {consultations.map((item: Consultation) => (
                    <TableRow key={item.id} className="border-[#ECEAE6] hover:bg-[#F2F1ED] transition-colors">
                      <TableCell className="text-xs text-[#555]">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium text-sm text-[#111]">{item.name}</TableCell>
                      <TableCell className="text-sm text-[#555]">{item.email}</TableCell>
                      <TableCell className="text-sm font-mono text-[#555]">{item.phone}</TableCell>
                      <TableCell className="text-sm text-center font-semibold text-[#111]">
                        {item.neetScore !== null ? item.neetScore : "-"}
                      </TableCell>
                      <TableCell className="text-sm text-[#555]">
                        {item.state || "-"} / {item.country || "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          onClick={() => handleStatusChange(item.id, item.status)}
                          className={`cursor-pointer px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide border select-none transition-all duration-200 active:scale-[0.97] hover:brightness-95 ${
                            statusColors[item.status] || "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8 text-white bg-red-600 hover:bg-red-700"
                            onClick={() => handleDelete(item.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
