"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Card,
  CardContent,
} from "@repo/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";
import {
  Plus,
  Search,
  Building2,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Eye,
  ShieldAlert,
  CheckCircle,
  Loader2,
  Inbox,
  Clock,
  CheckCircle2,
  XCircle,
  GraduationCap,
  Mail,
  Phone,
  Globe,
  BookOpen,
  RefreshCw,
  X,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useAdminUniversities,
  useUpdateUniversityStatus,
} from "@/domains/universities";
import { useUniversityRequests } from "@/domains/university-requests";

const typeColors: Record<string, string> = {
  GOVERNMENT: "bg-blue-50 text-blue-700 border-blue-200",
  PRIVATE: "bg-purple-50 text-purple-700 border-purple-200",
  DEEMED: "bg-amber-50 text-amber-700 border-amber-200",
  AUTONOMOUS: "bg-teal-50 text-teal-700 border-teal-200",
};

const statusColors: Record<string, string> = {
  ACTIVE: "bg-green-50 text-green-700 border-green-200",
  DRAFT: "bg-gray-50 text-gray-700 border-gray-200",
  UNDER_REVIEW: "bg-yellow-50 text-yellow-700 border-yellow-200",
  INACTIVE: "bg-red-50 text-red-700 border-red-200",
  SUSPENDED: "bg-orange-50 text-orange-700 border-orange-200",
};

const requestStatusColors: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  UNDER_REVIEW: "bg-blue-50 text-blue-700 border-blue-200",
  APPROVED: "bg-green-50 text-green-700 border-green-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
  ADDED: "bg-purple-50 text-purple-700 border-purple-200",
};

export default function UniversitiesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"universities" | "requests">("universities");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [requestStatusFilter, setRequestStatusFilter] = useState("all");
  const [requestTypeFilter, setRequestTypeFilter] = useState("all");
  const [requestCountryFilter, setRequestCountryFilter] = useState("all");
  const [requestProgramFilter, setRequestProgramFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const filters = {
    page,
    limit: 50,
    ...(search.trim() && { search: search.trim() }),
    ...(statusFilter !== "all" && { status: statusFilter }),
    ...(typeFilter !== "all" && { type: typeFilter }),
  };

  const { data: universitiesData, isLoading, refetch: refetchUniversities } = useAdminUniversities(filters);
  const updateStatus = useUpdateUniversityStatus();
  const universities = universitiesData?.data ?? [];
  const totalPages = universitiesData?.meta?.totalPages ?? 1;

  const { data: requestsData, isLoading: isLoadingRequests, error: requestsError, refetch: refetchRequests } = useUniversityRequests(
    requestStatusFilter === "all" ? undefined : requestStatusFilter
  );
  const requests = requestsData ?? [];

  // Client-side filtering for requests (since API only supports status filter)
  const filteredRequests = requests.filter((req: any) => {
    if (requestTypeFilter !== "all" && req.type !== requestTypeFilter) return false;
    if (requestCountryFilter !== "all" && req.country !== requestCountryFilter) return false;
    if (requestProgramFilter !== "all") {
      const hasProgram = req.programs?.includes(requestProgramFilter);
      const hasOtherProgram = requestProgramFilter === "Other" && req.otherPrograms;
      if (!hasProgram && !hasOtherProgram) return false;
    }
    return true;
  });

  // Show error toast if requests fail
  useEffect(() => {
    if (requestsError) {
      toast.error("Failed to load university requests. Please check your connection.");
    }
  }, [requestsError]);

  const handleStatusToggle = (
    e: React.MouseEvent,
    uniId: string,
    currentStatus: string,
  ) => {
    e.stopPropagation();
    const nextStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    updateStatus.mutate({ id: uniId, status: nextStatus });
  };

  return (
    <div className="flex flex-1 flex-col gap-6 max-w-7xl mx-auto p-4 md:p-6">
      {/* Header with Tabs */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight text-[#111]">
              Universities
            </h1>
            <p className="text-sm text-[#666]">
              Onboard and manage medical school information, academic courses, and
              admissions.
            </p>
          </div>
          {activeTab === "universities" && (
            <Button
              onClick={() => router.push("/admin/universities/new")}
              size="sm"
              className="bg-[#3730A3] hover:bg-[#2e288a] text-white font-medium cursor-pointer flex items-center gap-1.5 h-10 px-4"
            >
              <Plus className="h-4 w-4" />
              Add University
            </Button>
          )}
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit border border-gray-200">
          <button
            onClick={() => setActiveTab("universities")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border ${
              activeTab === "universities"
                ? "bg-white text-[#1A153A] shadow-sm border-gray-200"
                : "text-gray-500 hover:text-gray-700 border-transparent"
            }`}
          >
            <Building2 className="h-4 w-4" />
            Universities
            <Badge className="ml-1 bg-gray-100 text-gray-600 text-xs">
              {universitiesData?.meta?.total ?? universities.length}
            </Badge>
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border ${
              activeTab === "requests"
                ? "bg-white text-[#1A153A] shadow-sm border-gray-200"
                : "text-gray-500 hover:text-gray-700 border-transparent"
            }`}
          >
            <Inbox className="h-4 w-4" />
            Requests
            <Badge className="ml-1 bg-amber-100 text-amber-700 text-xs">
              {requests.length}
            </Badge>
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === "universities" ? (
        <>
          {/* Filters bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center bg-[#FAFAF8] border border-[#ECEAE6] rounded-xl p-4">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by name or abbreviation..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10 bg-white border-[#E5E7EB] text-sm h-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {/* Status Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Status</label>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value ?? "all")}
            >
              <SelectTrigger className="w-full sm:w-[140px] bg-white border-[#E5E7EB] text-xs h-9">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Type Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Type</label>
            <Select
              value={typeFilter}
              onValueChange={(value) => setTypeFilter(value ?? "all")}
            >
              <SelectTrigger className="w-full sm:w-[140px] bg-white border-[#E5E7EB] text-xs h-9">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="GOVERNMENT">Government</SelectItem>
                <SelectItem value="PRIVATE">Private</SelectItem>
                <SelectItem value="DEEMED">Deemed</SelectItem>
                <SelectItem value="AUTONOMOUS">Autonomous</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Refresh Button */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-transparent uppercase tracking-wider">Action</label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchUniversities()}
              disabled={isLoading}
              className="h-9 px-3 border-[#E5E7EB] hover:bg-white"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Card List */}
      <div className="flex flex-col gap-3 md:hidden">
        {isLoading ? (
          <div className="py-12 flex justify-center items-center">
            <Loader2 className="h-6 w-6 text-[#3730A3] animate-spin" />
          </div>
        ) : universities.length === 0 ? (
          <div className="text-center py-12 text-sm text-gray-500 bg-white border border-[#ECEAE6] rounded-xl">
            No universities matched your search.
          </div>
        ) : (
          universities.map((uni) => (
            <div
              key={uni.id}
              className="cursor-pointer rounded-xl border border-[#ECEAE6] bg-white p-4 transition-all hover:shadow-md active:bg-[#FAFAF8]"
              onClick={() => router.push(`/admin/universities/${uni.id}`)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-base font-bold text-[#111]">
                    {uni.name}
                  </h4>
                  <p className="text-xs text-gray-400 font-medium">
                    {uni.shortName}
                  </p>
                </div>
                <Badge
                  className={`shrink-0 text-[10px] uppercase font-bold py-0.5 px-2 border ${
                    statusColors[uni.status] || "bg-gray-100 text-gray-800"
                  }`}
                >
                  {uni.status.replace("_", " ")}
                </Badge>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-gray-500 border-t pt-3 border-gray-100">
                <span className="flex items-center gap-1 font-semibold text-[10px] text-[#3730A3]">
                  <Building2 className="h-3 w-3" /> {uni.type}
                </span>
                {uni.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {uni.location.city},{" "}
                    {uni.location.country}
                  </span>
                )}
                <span className="text-[10px] font-mono">
                  Est. {uni.establishedYear}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-hidden rounded-xl border p-2 border-[#ECEAE6] bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#FAFAF8] border-[#ECEAE6]">
              <TableHead className="text-xs font-semibold text-[#666] uppercase tracking-wider py-4">
                University
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#666] uppercase tracking-wider py-4">
                Type
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#666] uppercase tracking-wider py-4">
                Location
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#666] uppercase tracking-wider py-4 text-center">
                Status
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#666] uppercase tracking-wider py-4 text-center">
                Est.
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#666] uppercase tracking-wider py-4 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <Loader2 className="h-6 w-6 text-[#3730A3] animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : universities.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-12 text-sm text-[#888]"
                >
                  No universities found matching current filters.
                </TableCell>
              </TableRow>
            ) : (
              universities.map((uni) => (
                <TableRow
                  key={uni.id}
                  className="cursor-pointer border-[#ECEAE6] hover:bg-[#F2F1ED] transition-colors"
                  onClick={() => router.push(`/admin/universities/${uni.id}`)}
                >
                  <TableCell className="py-4">
                    <div>
                      <div className="font-bold text-sm text-[#111]">
                        {uni.name}
                      </div>
                      <div className="text-xs text-gray-400 font-medium mt-0.5">
                        {uni.shortName}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`border uppercase text-[10px] font-bold ${typeColors[uni.type] || "bg-gray-50 text-gray-700 border-gray-200"}`}
                    >
                      {uni.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {uni.location ? (
                      <div className="text-sm">
                        <div className="font-medium text-[#111]">
                          {uni.location.city}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {uni.location.country}
                        </div>
                      </div>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={`uppercase text-[10px] font-bold py-0.5 px-2.5 rounded-full border ${
                        statusColors[uni.status] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {uni.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center font-mono text-sm font-medium text-[#111]">
                    {uni.establishedYear}
                  </TableCell>
                  <TableCell
                    className="text-right py-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          router.push(`/admin/universities/${uni.id}`)
                        }
                        className="text-[#3730A3] hover:text-[#2e288a] font-semibold text-xs cursor-pointer"
                      >
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`font-semibold text-xs cursor-pointer h-8 flex items-center gap-1 px-3 ${
                          uni.status === "ACTIVE"
                            ? "text-red-700 border-red-200 hover:bg-red-50 bg-white"
                            : "text-green-700 border-green-200 hover:bg-green-50 bg-white"
                        }`}
                        onClick={(e) =>
                          handleStatusToggle(e, uni.id, uni.status)
                        }
                        disabled={updateStatus.isPending}
                      >
                        {uni.status === "ACTIVE" ? (
                          <>
                            <ShieldAlert className="h-3.5 w-3.5" /> Deactivate
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-3.5 w-3.5" /> Activate
                          </>
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-gray-400">
            Showing page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="cursor-pointer border-[#ECEAE6] hover:bg-[#FAFAF8] bg-white text-xs h-9"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="cursor-pointer border-[#ECEAE6] hover:bg-[#FAFAF8] bg-white text-xs h-9"
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
        </>
      ) : (
        <>
          {/* Requests Filters */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end bg-[#FAFAF8] border border-[#ECEAE6] rounded-xl p-4">
            <div className="flex flex-wrap gap-3 flex-1">
              {/* Status Filter */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Status</label>
                <Select
                  value={requestStatusFilter}
                  onValueChange={(value) => setRequestStatusFilter(value ?? "all")}
                >
                  <SelectTrigger className="w-full sm:w-[150px] bg-white border-[#E5E7EB] text-xs h-9">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                    <SelectItem value="ADDED">Added</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Type Filter */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Type</label>
                <Select
                  value={requestTypeFilter}
                  onValueChange={(value) => setRequestTypeFilter(value ?? "all")}
                >
                  <SelectTrigger className="w-full sm:w-[140px] bg-white border-[#E5E7EB] text-xs h-9">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="GOVERNMENT">Government</SelectItem>
                    <SelectItem value="PRIVATE">Private</SelectItem>
                    <SelectItem value="DEEMED">Deemed</SelectItem>
                    <SelectItem value="AUTONOMOUS">Autonomous</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Country Filter */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Country</label>
                <Select
                  value={requestCountryFilter}
                  onValueChange={(value) => setRequestCountryFilter(value ?? "all")}
                >
                  <SelectTrigger className="w-full sm:w-[150px] bg-white border-[#E5E7EB] text-xs h-9">
                    <SelectValue placeholder="All Countries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    <SelectItem value="India">India</SelectItem>
                    <SelectItem value="Russia">Russia</SelectItem>
                    <SelectItem value="Ukraine">Ukraine</SelectItem>
                    <SelectItem value="Kazakhstan">Kazakhstan</SelectItem>
                    <SelectItem value="Uzbekistan">Uzbekistan</SelectItem>
                    <SelectItem value="Kyrgyzstan">Kyrgyzstan</SelectItem>
                    <SelectItem value="Georgia">Georgia</SelectItem>
                    <SelectItem value="Armenia">Armenia</SelectItem>
                    <SelectItem value="Belarus">Belarus</SelectItem>
                    <SelectItem value="Moldova">Moldova</SelectItem>
                    <SelectItem value="Azerbaijan">Azerbaijan</SelectItem>
                    <SelectItem value="Tajikistan">Tajikistan</SelectItem>
                    <SelectItem value="Turkmenistan">Turkmenistan</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Program Filter */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Program</label>
                <Select
                  value={requestProgramFilter}
                  onValueChange={(value) => setRequestProgramFilter(value ?? "all")}
                >
                  <SelectTrigger className="w-full sm:w-[160px] bg-white border-[#E5E7EB] text-xs h-9">
                    <SelectValue placeholder="All Programs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Programs</SelectItem>
                    <SelectItem value="MBBS">MBBS</SelectItem>
                    <SelectItem value="BDS">BDS</SelectItem>
                    <SelectItem value="BAMS">BAMS</SelectItem>
                    <SelectItem value="BHMS">BHMS</SelectItem>
                    <SelectItem value="BUMS">BUMS</SelectItem>
                    <SelectItem value="MD">MD</SelectItem>
                    <SelectItem value="MS">MS</SelectItem>
                    <SelectItem value="MDS">MDS</SelectItem>
                    <SelectItem value="MCh">MCh</SelectItem>
                    <SelectItem value="DM">DM</SelectItem>
                    <SelectItem value="PhD">PhD</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              {(requestStatusFilter !== "all" || requestTypeFilter !== "all" || requestCountryFilter !== "all" || requestProgramFilter !== "all") && (
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-transparent uppercase tracking-wider">Action</label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setRequestStatusFilter("all");
                      setRequestTypeFilter("all");
                      setRequestCountryFilter("all");
                      setRequestProgramFilter("all");
                    }}
                    className="h-9 px-3 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                </div>
              )}

              {/* Refresh Button */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-transparent uppercase tracking-wider">Action</label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetchRequests()}
                  disabled={isLoadingRequests}
                  className="h-9 px-3 border-[#E5E7EB] hover:bg-white"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoadingRequests ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">
                Showing <span className="font-semibold text-[#111]">{filteredRequests.length}</span> of {requests.length}
              </p>
            </div>
          </div>

          {/* Requests Table */}
          <div className="overflow-hidden rounded-xl border p-2 border-[#ECEAE6] bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#FAFAF8] border-[#ECEAE6]">
                  <TableHead className="text-xs font-semibold text-[#666] uppercase tracking-wider py-4">
                    University
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-[#666] uppercase tracking-wider py-4">
                    Website
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-[#666] uppercase tracking-wider py-4">
                    Location
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-[#666] uppercase tracking-wider py-4">
                    Type
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-[#666] uppercase tracking-wider py-4">
                    Programs
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-[#666] uppercase tracking-wider py-4 text-center">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingRequests ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <Loader2 className="h-6 w-6 text-[#3730A3] animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-12 text-sm text-[#888]"
                    >
                      {requests.length === 0 
                        ? "No university requests found." 
                        : "No requests match the selected filters."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((req: any) => (
                    <TableRow
                      key={req.id}
                      className="border-[#ECEAE6] hover:bg-[#F2F1ED] transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedRequest(req);
                        setIsDrawerOpen(true);
                      }}
                    >
                      <TableCell className="py-4">
                        <div className="font-bold text-sm text-[#111]">
                          {req.universityName}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        {req.website ? (
                          <a
                            href={req.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#3730A3] hover:underline flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Globe className="h-3 w-3" />
                            <span className="truncate max-w-[120px]">
                              {req.website.replace(/^https?:\/\//, '')}
                            </span>
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium text-[#111]">
                            {req.state || req.country}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5">
                            {req.country}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`border uppercase text-[10px] font-bold ${typeColors[req.type] || "bg-gray-50 text-gray-700 border-gray-200"}`}
                        >
                          {req.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {req.programs?.filter((p: string) => p !== "Other").map((program: string) => (
                            <span
                              key={program}
                              className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-gray-100 text-gray-600"
                            >
                              {program}
                            </span>
                          ))}
                          {req.otherPrograms && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-gray-100 text-gray-600">
                              {req.otherPrograms}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          className={`uppercase text-[10px] font-bold py-0.5 px-2.5 rounded-full border ${
                            requestStatusColors[req.status] || "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {req.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {/* Request Details Sheet */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent side="right" className="sm:max-w-xl w-full p-0 overflow-hidden">
          {selectedRequest && (
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-100 bg-white">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-[#111] leading-tight">
                      {selectedRequest.universityName}
                    </h2>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        className={`uppercase text-[10px] font-bold py-0.5 px-2 rounded-full border ${
                          requestStatusColors[selectedRequest.status] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {selectedRequest.status.replace("_", " ")}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        Requested {new Date(selectedRequest.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
                {/* Quick Info Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider">Location</span>
                    </div>
                    <p className="text-sm font-semibold text-[#111]">
                      {selectedRequest.state || selectedRequest.country}
                    </p>
                    <p className="text-xs text-gray-500">{selectedRequest.country}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <Building2 className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider">Type</span>
                    </div>
                    <Badge className={`text-[10px] ${typeColors[selectedRequest.type] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
                      {selectedRequest.type}
                    </Badge>
                  </div>
                </div>

                {/* Website */}
                {selectedRequest.website && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                      Website
                    </label>
                    <a 
                      href={selectedRequest.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-[#3730A3] hover:text-[#2e288a] transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#3730A3]/10 flex items-center justify-center group-hover:bg-[#3730A3]/20 transition-colors">
                        <Globe className="h-4 w-4 text-[#3730A3]" />
                      </div>
                      <span className="font-medium truncate">{selectedRequest.website.replace(/^https?:\/\//, '')}</span>
                    </a>
                  </div>
                )}

                {/* Programs */}
                <div className="space-y-3">
                  <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="h-3.5 w-3.5" />
                    Programs Offered
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedRequest.programs?.filter((p: string) => p !== "Other").map((program: string) => (
                      <span
                        key={program}
                        className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-[#3730A3]/5 text-[#3730A3] border border-[#3730A3]/10"
                      >
                        {program}
                      </span>
                    ))}
                    {selectedRequest.otherPrograms && (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                        {selectedRequest.otherPrograms}
                      </span>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-3">
                  <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    Contact Information
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                        <Mail className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Email</p>
                        <p className="text-sm font-medium text-[#111] truncate">{selectedRequest.contactEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                        <Phone className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Phone</p>
                        <p className="text-sm font-medium text-[#111]">{selectedRequest.contactPhone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                {selectedRequest.additionalInfo && (
                  <div className="space-y-3">
                    <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                      Additional Information
                    </label>
                    <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100">
                      <p className="text-sm text-gray-700 leading-relaxed">{selectedRequest.additionalInfo}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="px-6 py-4 border-t border-gray-100 bg-white">
                <Button 
                  variant="outline" 
                  className="w-full h-11 text-sm font-semibold border-gray-200 hover:bg-gray-50"
                >
                  Mark as Reviewed
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
