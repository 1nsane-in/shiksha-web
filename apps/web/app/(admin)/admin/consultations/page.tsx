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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";
import { toast } from "sonner";
import {
  PhoneCall,
  Trash2,
  CheckCircle2,
  Clock,
  MessageSquare,
  AlertCircle,
  RefreshCw,
  Search,
} from "lucide-react";
import {
  useConsultations,
  useUpdateConsultationStatus,
  useDeleteConsultation,
} from "@/domains/consultations";
import type { Consultation } from "@/domains/consultations";

const theme = {
  ink: "#1A153A",
  inkMuted: "#6B6599",
  gold: "#C4953B",
  goldLight: "rgba(196, 149, 59, 0.08)",
  canvas: "#FAF9F6",
  surface: "#FFFFFF",
  hairline: "rgba(26, 21, 58, 0.08)",
};

const statusColors: Record<string, string> = {
  PENDING: "text-amber-800 bg-amber-50 border-amber-200",
  CONTACTED: "text-blue-800 bg-blue-50 border-blue-200",
  CLOSED: "text-emerald-800 bg-emerald-50 border-emerald-200",
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

  const handleStatusChange = async (id: string, nextStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status: nextStatus });
      toast.success(`Status updated to ${nextStatus}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this consultation request?"))
      return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Consultation request deleted successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete request");
    }
  };

  // Client-side filtering
  const filteredConsultations = consultations.filter((item: Consultation) => {
    if (
      searchEmail &&
      !item.email.toLowerCase().includes(searchEmail.toLowerCase())
    ) {
      return false;
    }
    if (searchPhone && !item.phone.includes(searchPhone)) {
      return false;
    }
    if (
      filterState &&
      (!item.state ||
        !item.state.toLowerCase().includes(filterState.toLowerCase()))
    ) {
      return false;
    }
    if (
      filterCountry &&
      (!item.country ||
        !item.country.toLowerCase().includes(filterCountry.toLowerCase()))
    ) {
      return false;
    }
    if (filterDate) {
      const itemDateStr = new Date(item.createdAt).toISOString().split("T")[0];
      if (itemDateStr !== filterDate) {
        return false;
      }
    }
    return true;
  });

  // Derived Statistics
  const pendingCount = consultations.filter((c) => c.status === "PENDING").length;
  const contactedCount = consultations.filter((c) => c.status === "CONTACTED").length;
  const closedCount = consultations.filter((c) => c.status === "CLOSED").length;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center max-w-lg mx-auto">
        <AlertCircle className="size-12 text-red-400 mb-4 animate-pulse" />
        <h2 className="text-lg font-bold text-[#1A153A]">Failed to load consultation requests</h2>
        <p className="text-sm text-gray-500 mt-1">Please verify your server connection and database URL settings.</p>
        <Button onClick={() => refetch()} variant="outline" className="gap-2 mt-4 cursor-pointer">
          <RefreshCw className="size-4" /> Retry Connection
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 md:p-6">
      {/* Title Header */}
      <div className="border-b pb-5" style={{ borderColor: theme.hairline }}>
        <h1 className="text-xl font-bold tracking-tight text-[#1A153A]">Consultation Desk</h1>
        <p className="text-sm text-gray-500">Assess, trace and resolve career counselling registrations submitted by prospective applicants.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border bg-white p-5 flex items-center gap-4" style={{ borderColor: theme.hairline }}>
          <div className="rounded-lg bg-gray-50 p-2.5">
            <PhoneCall className="size-5" style={{ color: theme.gold }} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Submissions</p>
            <p className="text-lg font-bold text-[#1A153A]">{consultations.length}</p>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5 flex items-center gap-4" style={{ borderColor: theme.hairline }}>
          <div className="rounded-lg bg-amber-50 p-2.5">
            <Clock className="size-5 text-amber-600" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pending Response</p>
            <p className="text-lg font-bold text-amber-700">{pendingCount}</p>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5 flex items-center gap-4" style={{ borderColor: theme.hairline }}>
          <div className="rounded-lg bg-blue-50 p-2.5">
            <MessageSquare className="size-5 text-blue-600" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">In Discussion</p>
            <p className="text-lg font-bold text-blue-700">{contactedCount}</p>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5 flex items-center gap-4" style={{ borderColor: theme.hairline }}>
          <div className="rounded-lg bg-emerald-50 p-2.5">
            <CheckCircle2 className="size-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Resolved Cases</p>
            <p className="text-lg font-bold text-emerald-700">{closedCount}</p>
          </div>
        </div>
      </div>

      {/* Modern Filter Card */}
      <div
        className="rounded-xl border bg-white p-6 transition-all"
        style={{ borderColor: theme.hairline }}
      >
        <div className="flex items-center justify-between border-b pb-3 mb-5" style={{ borderColor: theme.hairline }}>
          <div className="flex items-center gap-2">
            <Search className="size-4" style={{ color: theme.gold }} />
            <h3 className="text-xs font-bold text-[#1A153A] uppercase tracking-wider">Advanced Filtering</h3>
          </div>
          <button
            onClick={() => {
              setSearchEmail("");
              setSearchPhone("");
              setFilterState("");
              setFilterCountry("");
              setFilterDate("");
            }}
            className="text-[11px] font-bold text-gray-400 hover:text-[#1A153A] uppercase tracking-wider transition-all select-none cursor-pointer"
          >
            Clear Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
            <Input
              placeholder="Filter by email..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="text-xs py-2 bg-gray-50/30 border-gray-200"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Mobile Number</label>
            <Input
              placeholder="Filter by mobile..."
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              className="text-xs py-2 bg-gray-50/30 border-gray-200"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Country Name</label>
            <Input
              placeholder="Filter by country..."
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
              className="text-xs py-2 bg-gray-50/30 border-gray-200"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">State Name</label>
            <Input
              placeholder="Filter by state..."
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
              className="text-xs py-2 bg-gray-50/30 border-gray-200"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Registration Date</label>
            <Input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="text-xs py-2 bg-gray-50/30 border-gray-200 block w-full"
            />
          </div>
        </div>
      </div>

      {/* Main Submissions Card */}
      <div
        className="rounded-xl border bg-white p-6"
        style={{ borderColor: theme.hairline }}
      >
        <div className="mb-4 flex items-center justify-between flex-wrap gap-2 border-b pb-3" style={{ borderColor: theme.hairline }}>
          <h2 className="text-sm font-bold text-[#1A153A] flex items-center gap-1.5">
            <span>List of Registered Inquiries</span>
            <span className="text-xs font-normal text-gray-400">
              ({filteredConsultations.length} shown of {consultations.length} total)
            </span>
          </h2>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : filteredConsultations.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            No matching inquiry requests are currently registered.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b" style={{ borderColor: theme.hairline }}>
                  <TableHead className="font-bold text-[10px] text-gray-400 uppercase tracking-wider">Date</TableHead>
                  <TableHead className="font-bold text-[10px] text-gray-400 uppercase tracking-wider">Name</TableHead>
                  <TableHead className="font-bold text-[10px] text-gray-400 uppercase tracking-wider">Email Address</TableHead>
                  <TableHead className="font-bold text-[10px] text-gray-400 uppercase tracking-wider">Mobile No.</TableHead>
                  <TableHead className="font-bold text-[10px] text-gray-400 uppercase tracking-wider text-center">NEET Score</TableHead>
                  <TableHead className="font-bold text-[10px] text-gray-400 uppercase tracking-wider">Location</TableHead>
                  <TableHead className="font-bold text-[10px] text-gray-400 uppercase tracking-wider text-center">Status</TableHead>
                  <TableHead className="font-bold text-[10px] text-gray-400 uppercase tracking-wider text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredConsultations.map((item: Consultation) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-gray-50/50 transition-colors border-b"
                    style={{ borderColor: theme.hairline }}
                  >
                    <TableCell className="text-xs text-gray-400 font-medium">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-bold text-sm text-[#1A153A]">{item.name}</TableCell>
                    <TableCell className="text-sm text-gray-500">{item.email}</TableCell>
                    <TableCell className="text-sm font-semibold font-mono text-gray-500">{item.phone}</TableCell>
                    <TableCell className="text-sm text-center font-bold text-[#1A153A]">
                      {item.neetScore !== null ? item.neetScore : ":"}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {item.state || ":"}{item.country ? ` / ${item.country}` : ""}
                    </TableCell>
                    <TableCell className="text-center">
                      <Select
                        value={item.status}
                        onValueChange={(val) => handleStatusChange(item.id, val)}
                      >
                        <SelectTrigger className={`w-[120px] text-[10px] font-bold py-1 px-2.5 h-8 select-none border rounded-full transition-all duration-200 uppercase tracking-wider mx-auto ${
                          statusColors[item.status] || "text-gray-600 bg-gray-50 border-gray-200"
                        }`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING" className="text-xs font-bold text-amber-700">PENDING</SelectItem>
                          <SelectItem value="CONTACTED" className="text-xs font-bold text-blue-700">CONTACTED</SelectItem>
                          <SelectItem value="CLOSED" className="text-xs font-bold text-emerald-700">CLOSED</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8 text-white bg-red-600 hover:bg-red-700 cursor-pointer rounded-lg"
                        onClick={() => handleDelete(item.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
