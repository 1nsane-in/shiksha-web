"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Badge,
  Skeleton,
} from "@repo/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui";
import {
  Users,
  GraduationCap,
  ArrowRight,
  User,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";
import {
  useAdminStudents,
  useStudentStats,
  useUpdateStudentStage,
} from "@/domains/admin";

const stageNames: Record<number, string> = {
  1: "Application Submission",
  2: "Admission Fee Payment",
  3: "Entrance Exam Process",
  4: "Invitation Letter Issue",
  5: "Visa Support & Processing",
};

const statusColors: Record<string, string> = {
  NOT_STARTED: "text-gray-600 bg-gray-50 border-gray-200",
  STAGE_1_PENDING: "text-yellow-600 bg-yellow-50 border-yellow-200",
  STAGE_1_APPROVED: "text-green-600 bg-green-50 border-green-200",
  STAGE_2_PENDING: "text-yellow-600 bg-yellow-50 border-yellow-200",
  STAGE_2_APPROVED: "text-green-600 bg-green-50 border-green-200",
  STAGE_3_ACTIVE: "text-blue-600 bg-blue-50 border-blue-200",
  STAGE_4_PENDING: "text-yellow-600 bg-yellow-50 border-yellow-200",
  STAGE_4_APPROVED: "text-green-600 bg-green-50 border-green-200",
  STAGE_5_UNLOCKED: "text-purple-600 bg-purple-50 border-purple-200",
  COMPLETED: "text-emerald-600 bg-emerald-50 border-emerald-200",
  REJECTED: "text-red-600 bg-red-50 border-red-200",
};

export default function AdminStudentsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [stage, setStage] = useState<number | undefined>(undefined);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [editStage, setEditStage] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useAdminStudents({
    page,
    limit: 10,
    stage,
    status,
  });

  const { data: stats } = useStudentStats();
  const updateStageMutation = useUpdateStudentStage();

  const handleUpdateStage = async (studentId: string) => {
    if (editStage === null) return;
    try {
      await updateStageMutation.mutateAsync({
        id: studentId,
        payload: {
          stage: editStage,
          status: editStatus || undefined,
        },
      });
      setSelectedStudent((prev: any) => ({
        ...prev,
        currentStage: editStage,
        applicationStatus: editStatus || prev.applicationStatus,
      }));
      refetch();
    } catch (err) {
      alert("Failed to update student stage.");
    }
  };

  const selectStudent = (student: any) => {
    setSelectedStudent(student);
    setEditStage(student.currentStage);
    setEditStatus(student.applicationStatus);
  };

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="size-12 text-red-400 mb-4" />
        <h2 className="text-lg font-semibold text-[#111]">Failed to load student profiles</h2>
        <Button onClick={() => refetch()} variant="outline" className="gap-2 mt-4">
          Retry
        </Button>
      </div>
    );
  }

  const students = data?.data ?? [];

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-[#111]">Student Management</h1>
        <p className="text-sm text-[#666]">Track, manage, and progress prospective students through key admission milestones.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-[#ECEAE6] bg-[#FAFAF8]">
          <CardContent className="pt-4 flex items-center gap-4">
            <div className="rounded-lg bg-violet-100 p-2.5">
              <Users className="size-5 text-violet-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Total Registered</p>
              <p className="text-xl font-bold text-[#111] mt-0.5">{stats?.total ?? 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#ECEAE6] bg-[#FAFAF8]">
          <CardContent className="pt-4 flex items-center gap-4">
            <div className="rounded-lg bg-yellow-100 p-2.5">
              <Clock className="size-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">In Stage 1 & 2</p>
              <p className="text-xl font-bold text-[#111] mt-0.5">
                {stats?.byStage ? ((stats.byStage[1] ?? 0) + (stats.byStage[2] ?? 0)) : 0}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#ECEAE6] bg-[#FAFAF8]">
          <CardContent className="pt-4 flex items-center gap-4">
            <div className="rounded-lg bg-blue-100 p-2.5">
              <GraduationCap className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">In Entrance Exam</p>
              <p className="text-xl font-bold text-[#111] mt-0.5">{stats?.byStage ? (stats.byStage[3] ?? 0) : 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#ECEAE6] bg-[#FAFAF8]">
          <CardContent className="pt-4 flex items-center gap-4">
            <div className="rounded-lg bg-emerald-100 p-2.5">
              <CheckCircle2 className="size-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Visa & Completed</p>
              <p className="text-xl font-bold text-[#111] mt-0.5">
                {stats?.byStage ? ((stats.byStage[5] ?? 0) + (stats.byStatus?.["COMPLETED"] ?? 0)) : 0}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Students Table Section */}
        <div className="lg:col-span-2 space-y-4">
          <Card size="xl" className="border-[#ECEAE6] bg-[#FAFAF8]">
            <CardHeader className="flex flex-row items-center justify-between pb-2 flex-wrap gap-2">
              <div>
                <CardTitle className="text-base font-semibold">All Student Accounts</CardTitle>
                <CardDescription className="text-xs">Browse list or select a row for immediate actions.</CardDescription>
              </div>
              <div className="flex gap-2">
                <Select
                  value={stage === undefined ? "all" : stage.toString()}
                  onValueChange={(val) => setStage(val === "all" ? undefined : parseInt(val))}
                >
                  <SelectTrigger className="w-[130px] bg-white border-[#E5E7EB] text-xs">
                    <SelectValue placeholder="Stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    <SelectItem value="1">Stage 1</SelectItem>
                    <SelectItem value="2">Stage 2</SelectItem>
                    <SelectItem value="3">Stage 3</SelectItem>
                    <SelectItem value="4">Stage 4</SelectItem>
                    <SelectItem value="5">Stage 5</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={status === undefined ? "all" : status}
                  onValueChange={(val) => setStatus(val === "all" ? undefined : val)}
                >
                  <SelectTrigger className="w-[140px] bg-white border-[#E5E7EB] text-xs">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="STAGE_1_PENDING">Stage 1 Pending</SelectItem>
                    <SelectItem value="STAGE_1_APPROVED">Stage 1 Approved</SelectItem>
                    <SelectItem value="STAGE_2_PENDING">Stage 2 Pending</SelectItem>
                    <SelectItem value="STAGE_2_APPROVED">Stage 2 Approved</SelectItem>
                    <SelectItem value="STAGE_3_ACTIVE">Stage 3 Active</SelectItem>
                    <SelectItem value="STAGE_4_PENDING">Stage 4 Pending</SelectItem>
                    <SelectItem value="STAGE_4_APPROVED">Stage 4 Approved</SelectItem>
                    <SelectItem value="STAGE_5_UNLOCKED">Stage 5 Unlocked</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
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
                          onClick={() => selectStudent(student)}
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
                              variant="outline"
                              className={`text-[10px] uppercase font-bold py-0.5 px-2 ${
                                statusColors[student.applicationStatus] || "text-gray-600 bg-gray-50"
                              }`}
                            >
                              {student.applicationStatus?.replace(/_/g, " ")}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/admin/students/${student.id}`);
                              }}
                              className="text-[#3730A3] hover:text-indigo-900 font-semibold text-xs cursor-pointer"
                            >
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Pagination */}
              {data && data.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-xs text-gray-400">
                    Showing page {data.page} of {data.totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={page <= 1}
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      className="cursor-pointer"
                    >
                      <ChevronLeft className="size-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={page >= data.totalPages}
                      onClick={() => setPage((prev) => Math.min(prev + 1, data.totalPages))}
                      className="cursor-pointer"
                    >
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Selected Student Details Panel */}
        <div>
          {selectedStudent ? (
            <Card className="sticky top-6 border-[#ECEAE6] bg-[#FAFAF8]">
              <CardHeader className="pb-3 border-b border-[#ECEAE6]">
                <CardTitle className="text-base font-semibold text-[#111]">Student Overview</CardTitle>
                <CardDescription className="text-xs">Quick progress controls & credentials.</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-5">
                {/* Basic info */}
                <div>
                  <h3 className="font-bold text-sm text-[#111] mb-1">{selectedStudent.user?.name}</h3>
                  <p className="text-xs text-gray-400">Email: {selectedStudent.user?.email}</p>
                  <p className="text-xs text-gray-400">Phone: {selectedStudent.user?.phone ?? "N/A"}</p>
                </div>

                {/* More Details CTA */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/admin/students/${selectedStudent.id}`)}
                  className="w-full border-[#3730A3] text-[#3730A3] hover:bg-[#EEF2FF] font-semibold flex items-center justify-center gap-1.5 cursor-pointer h-9 text-xs"
                >
                  Full Profile & Documents <ArrowRight className="size-4" />
                </Button>

                {/* Academic results */}
                <div className="bg-white border border-[#ECEAE6] rounded-xl p-3.5 space-y-2">
                  <h4 className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Academics</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-gray-400">NEET Score</p>
                      <p className="font-bold text-sm text-[#111]">{selectedStudent.neetScore ?? "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">NEET Rank</p>
                      <p className="font-bold text-sm text-[#111]">{selectedStudent.neetRank ?? "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">12th Grade %</p>
                      <p className="font-bold text-sm text-[#111]">
                        {selectedStudent.twelfthPercentage ? `${selectedStudent.twelfthPercentage}%` : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">10th Grade %</p>
                      <p className="font-bold text-sm text-[#111]">
                        {selectedStudent.tenthPercentage ? `${selectedStudent.tenthPercentage}%` : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="space-y-2 text-xs">
                  <h4 className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Demographics</h4>
                  <div className="space-y-1">
                    <p className="text-gray-400 flex items-start gap-1">
                      <MapPin className="size-3.5 shrink-0 mt-0.5" />
                      <span>
                        {selectedStudent.address ? `${selectedStudent.address}, ${selectedStudent.city ?? ""}, ${selectedStudent.state ?? ""}, ${selectedStudent.country ?? ""}` : "No address specified"}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Action - Update Stage/Status */}
                <div className="border-t border-[#ECEAE6] pt-4 space-y-3">
                  <h4 className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Update Progression</h4>
                  
                  <div className="space-y-2">
                    <div>
                      <label className="text-[10px] text-gray-400 block mb-1">Current Stage</label>
                      <Select
                        value={editStage?.toString() ?? ""}
                        onValueChange={(val) => setEditStage(parseInt(val))}
                      >
                        <SelectTrigger className="w-full text-xs bg-white border-[#E5E7EB]">
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Stage 1: Application</SelectItem>
                          <SelectItem value="2">Stage 2: Admission Fee</SelectItem>
                          <SelectItem value="3">Stage 3: Entrance Exam</SelectItem>
                          <SelectItem value="4">Stage 4: Invitation Letter</SelectItem>
                          <SelectItem value="5">Stage 5: Visa Support</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-[10px] text-gray-400 block mb-1">Application Status</label>
                      <Select
                        value={editStatus ?? ""}
                        onValueChange={(val) => setEditStatus(val)}
                      >
                        <SelectTrigger className="w-full text-xs bg-white border-[#E5E7EB]">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NOT_STARTED">Not Started</SelectItem>
                          <SelectItem value="STAGE_1_PENDING">Stage 1 Pending</SelectItem>
                          <SelectItem value="STAGE_1_APPROVED">Stage 1 Approved</SelectItem>
                          <SelectItem value="STAGE_2_PENDING">Stage 2 Pending</SelectItem>
                          <SelectItem value="STAGE_2_APPROVED">Stage 2 Approved</SelectItem>
                          <SelectItem value="STAGE_3_ACTIVE">Stage 3 Active</SelectItem>
                          <SelectItem value="STAGE_4_PENDING">Stage 4 Pending</SelectItem>
                          <SelectItem value="STAGE_4_APPROVED">Stage 4 Approved</SelectItem>
                          <SelectItem value="STAGE_5_UNLOCKED">Stage 5 Unlocked</SelectItem>
                          <SelectItem value="COMPLETED">Completed</SelectItem>
                          <SelectItem value="REJECTED">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      size="sm"
                      className="w-full bg-[#3730A3] hover:bg-[#2e288a] text-white font-medium text-xs h-9"
                      disabled={updateStageMutation.isPending || (editStage === selectedStudent.currentStage && editStatus === selectedStudent.applicationStatus)}
                      onClick={() => handleUpdateStage(selectedStudent.id)}
                    >
                      {updateStageMutation.isPending ? "Updating..." : "Save Progression"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center p-6 text-center text-gray-400 border-dashed border-2 border-[#ECEAE6] bg-[#FAFAF8]">
              <div>
                <User className="size-8 mx-auto text-gray-300 mb-2" />
                <p className="text-sm font-medium">Select student from list</p>
                <p className="text-xs text-gray-400">Click a student row to view details & manage stage progress</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
