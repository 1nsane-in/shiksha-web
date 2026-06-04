"use client";

import React, { useState } from "react";
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
  Input,
} from "@repo/ui";
import { toast } from "sonner";
import { PhoneCall, Trash2, CheckCircle2, Loader2, RefreshCw } from "lucide-react";
import { useConsultations, useUpdateConsultationStatus, useDeleteConsultation } from "@/domains/consultations";
import type { Consultation } from "@/domains/consultations";

var statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  CONTACTED: "bg-blue-100 text-blue-800 border-blue-200",
  CLOSED: "bg-green-100 text-green-800 border-green-200",
};

export default function ConsultationsAdminPage() {
  const { data: consultations = [], isLoading, error, refetch } = useConsultations();
  const updateStatusMutation = useUpdateConsultationStatus();
  const deleteMutation = useDeleteConsultation();

  // Filter States
  const [searchEmail, setSearchEmail] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [filterState, setFilterState] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterMinScore, setFilterMinScore] = useState("");
  const [filterMaxScore, setFilterMaxScore] = useState("");

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

  // Computation for client-side filtering
  const filteredConsultations = consultations.filter((item: Consultation) => {
    if (searchEmail && !item.email.toLowerCase().includes(searchEmail.toLowerCase())) {
      return false;
    }
    if (searchPhone && !item.phone.includes(searchPhone)) {
      return false;
    }
    if (filterState && (!item.state || !item.state.toLowerCase().includes(filterState.toLowerCase()))) {
      return false;
    }
    if (filterCountry && (!item.country || !item.country.toLowerCase().includes(filterCountry.toLowerCase()))) {
      return false;
    }
    if (filterDate) {
      const itemDateStr = new Date(item.createdAt).toISOString().split("T")[0];
      if (itemDateStr !== filterDate) {
        return false;
      }
    }
    if (filterMinScore) {
      if (item.neetScore === null || item.neetScore < parseInt(filterMinScore, 10)) {
        return false;
      }
    }
    if (filterMaxScore) {
      if (item.neetScore === null || item.neetScore > parseInt(filterMaxScore, 10)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-[#111]">Consultation Requests</h1>
        <p className="text-sm text-[#666]">Review and manage career consultation forms submitted by prospective students.</p>
      </div>

      {/* Inline Filters Card */}
      <Card className="border-[#ECEAE6] bg-[#FAFAF8]">
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-2 mb-2">
            <h3 className="text-sm font-bold text-[#1A153A]">Filter Submissions</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchEmail("");
                setSearchPhone("");
                setFilterState("");
                setFilterCountry("");
                setFilterDate("");
                setFilterMinScore("");
                setFilterMaxScore("");
              }}
              className="text-xs text-indigo-600 font-semibold cursor-pointer"
            >
              Clear Filters
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email</label>
              <Input
                placeholder="Search email..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="text-xs py-1.5"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Phone No.</label>
              <Input
                placeholder="Search phone..."
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                className="text-xs py-1.5"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Country</label>
              <Input
                placeholder="Search country..."
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
                className="text-xs py-1.5"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">State</label>
              <Input
                placeholder="Search state..."
                value={filterState}
                onChange={(e) => setFilterState(e.target.value)}
                className="text-xs py-1.5"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Submission Date</label>
              <Input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="text-xs py-1.5"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Min NEET Score</label>
              <Input
                type="number"
                placeholder="0"
                value={filterMinScore}
                onChange={(e) => setFilterMinScore(e.target.value)}
                className="text-xs py-1.5"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Max NEET Score</label>
              <Input
                type="number"
                placeholder="720"
                value={filterMaxScore}
                onChange={(e) => setFilterMaxScore(e.target.value)}
                className="text-xs py-1.5"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Listing Grid */}
      <Card className="border-[#ECEAE6] bg-[#FAFAF8]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2 text-[#1A153A]">
            <PhoneCall className="h-4 w-4 text-[#C4953B]" />
            Matched Submissions ({filteredConsultations.length} of {consultations.length})
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
            <div className="text-center py-8 text-red-500 text-sm flex flex-col items-center gap-3">
              <p>Failed to load consultations. Please try again.</p>
              <Button onClick={() => refetch()} variant="outline" className="gap-2">
                <RefreshCw className="size-4" /> Retry
              </Button>
            </div>
          ) : filteredConsultations.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">
              No consultation requests match current filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#ECEAE6]">
                    <TableHead className="font-bold text-xs text-[#626260] uppercase tracking-wider">Date</TableHead>
                    <TableHead className="font-bold text-xs text-[#626260] uppercase tracking-wider">Name</TableHead>
                    <TableHead className="font-bold text-xs text-[#626260] uppercase tracking-wider">Email</TableHead>
                    <TableHead className="font-bold text-xs text-[#626260] uppercase tracking-wider">Mobile No.</TableHead>
                    <TableHead className="font-bold text-xs text-[#626260] uppercase tracking-wider text-center">NEET Score</TableHead>
                    <TableHead className="font-bold text-xs text-[#626260] uppercase tracking-wider">State / Country</TableHead>
                    <TableHead className="font-bold text-xs text-[#626260] uppercase tracking-wider text-center">Status</TableHead>
                    <TableHead className="font-bold text-xs text-[#626260] uppercase tracking-wider text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredConsultations.map((item: Consultation) => (
                    <TableRow key={item.id} className="border-[#ECEAE6] hover:bg-[#F2F1ED] transition-colors">
                      <TableCell className="text-xs text-[#626260]">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-semibold text-sm text-[#1A153A]">{item.name}</TableCell>
                      <TableCell className="text-sm text-[#626260]">{item.email}</TableCell>
                      <TableCell className="text-sm font-semibold font-mono text-[#626260]">{item.phone}</TableCell>
                      <TableCell className="text-sm text-center font-bold text-[#1A153A]">
                        {item.neetScore !== null ? item.neetScore : "-"}
                      </TableCell>
                      <TableCell className="text-sm text-[#626260]">
                        {item.state || "-"} / {item.country || "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          onClick={() => handleStatusChange(item.id, item.status)}
                          className={`cursor-pointer px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border select-none transition-all duration-200 active:scale-[0.97] hover:brightness-95 ${
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
                            className="h-8 w-8 text-white bg-red-600 hover:bg-red-700 cursor-pointer"
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
