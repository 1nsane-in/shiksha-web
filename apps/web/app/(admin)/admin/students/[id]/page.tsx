"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { toast } from "sonner";
import {
  useAdminStudent,
  useUpdateStudentStage,
} from "@/domains/admin";
import {
  useStudentDocuments,
  useVerifyDocument,
  useMarkForReupload,
} from "@/domains/documents";
import {
  ArrowLeft,
  User,
  GraduationCap,
  Calendar,
  Phone,
  Mail,
  MapPin,
  ClipboardList,
  FileCheck,
  ExternalLink,
  Loader2,
  Clock,
} from "lucide-react";

const stageNames: Record<number, string> = {
  1: "Application Submission",
  2: "Admission Fee Payment",
  3: "Entrance Exam Process",
  4: "Invitation Letter Issue",
  5: "Visa Support & Processing",
};

const statusColors: Record<string, string> = {
  NOT_STARTED: "bg-gray-100 text-gray-800 border-gray-200",
  STAGE_1_PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  STAGE_1_APPROVED: "bg-green-100 text-green-800 border-green-200",
  STAGE_2_PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  STAGE_2_APPROVED: "bg-green-100 text-green-800 border-green-200",
  STAGE_3_ACTIVE: "bg-blue-100 text-blue-800 border-blue-200",
  STAGE_4_PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  STAGE_4_APPROVED: "bg-green-100 text-green-800 border-green-200",
  STAGE_5_UNLOCKED: "bg-purple-100 text-purple-800 border-purple-200",
  COMPLETED: "bg-emerald-100 text-emerald-800 border-emerald-200",
  REJECTED: "bg-red-100 text-red-800 border-red-200",
};

export default function StudentDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const { data: student, isLoading, error, refetch } = useAdminStudent(id);
  const { data: documents = [], isLoading: isDocsLoading, refetch: refetchDocs } = useStudentDocuments(id);

  const updateStageMutation = useUpdateStudentStage();
  const verifyDocMutation = useVerifyDocument();
  const rejectDocMutation = useMarkForReupload();

  const [stageInput, setStageInput] = useState<number | null>(null);
  const [statusInput, setStatusInput] = useState<string | null>(null);

  // Initialize input values once data is loaded
  React.useEffect(() => {
    if (student) {
      setStageInput(student.currentStage);
      setStatusInput(student.applicationStatus);
    }
  }, [student]);

  const handleUpdateStage = async () => {
    if (stageInput === null || statusInput === null) return;
    try {
      await updateStageMutation.mutateAsync({
        id,
        payload: {
          stage: stageInput,
          status: statusInput,
        },
      });
      toast.success("Student stage progression updated successfully!");
      refetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update stage progress");
    }
  };

  const handleVerifyDocument = async (docId: string, status: "APPROVED" | "REJECTED") => {
    try {
      if (status === "APPROVED") {
        await verifyDocMutation.mutateAsync({ id: docId, status: "APPROVED" });
        toast.success("Document approved successfully");
      } else {
        const remarks = prompt("Enter rejection remarks for student re-upload:") || "";
        if (!remarks.trim()) {
          toast.error("Rejection remarks are required");
          return;
        }
        await rejectDocMutation.mutateAsync({ id: docId, remarks });
        toast.success("Document marked for re-upload");
      }
      refetchDocs();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to verify document");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6">
        <Skeleton className="h-8 w-1/4" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-[400px] md:col-span-2" />
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-xl font-semibold">Failed to load student profile</h2>
        <Button onClick={() => router.push("/admin/students")} className="mt-4 bg-[#3730A3] text-white">
          Back to Students
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => router.push("/admin/students")}
            className="border-[#ECEAE6] hover:bg-[#FAFAF8] bg-white cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#111]">{student.user?.name}</h1>
            <p className="text-xs text-[#666]">Student ID: {student.id}</p>
          </div>
        </div>
        <Badge
          className={`px-3 py-1 rounded-full text-xs font-semibold uppercase border ${
            statusColors[student.applicationStatus] || "bg-gray-100 text-gray-800"
          }`}
        >
          {student.applicationStatus?.replace(/_/g, " ")}
        </Badge>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        
        {/* Left Column (2/3 width): Timeline, Docs, Academics */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Stage Timeline */}
          <Card className="border-[#ECEAE6] bg-[#FAFAF8]">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                Admission Stage Progress
              </CardTitle>
              <CardDescription>Visual tracker of student workflow steps.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative border-l-2 border-[#ECEAE6] ml-4 pl-6 space-y-6">
                {[1, 2, 3, 4, 5].map((step) => {
                  const isCurrent = student.currentStage === step;
                  const isPassed = student.currentStage > step;
                  return (
                    <div key={step} className="relative">
                      <span
                        className={`absolute -left-[31px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full border transition-all ${
                          isPassed
                            ? "bg-green-600 border-green-600 text-white"
                            : isCurrent
                            ? "bg-[#3730A3] border-[#3730A3] text-white animate-pulse"
                            : "bg-white border-gray-300 text-gray-400"
                        }`}
                        style={{ fontSize: 9, fontWeight: 700 }}
                      >
                        {isPassed ? "✓" : step}
                      </span>
                      <div>
                        <h4
                          className={`text-sm font-semibold ${
                            isCurrent ? "text-[#3730A3]" : isPassed ? "text-green-700" : "text-gray-500"
                          }`}
                        >
                          Stage {step}: {stageNames[step]}
                        </h4>
                        {isCurrent && (
                          <p className="text-xs text-gray-400 mt-1 font-medium flex items-center gap-1">
                            <Clock className="h-3 w-3 text-[#3730A3]" /> Current active state of student.
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Uploaded Documents Management */}
          <Card className="border-[#ECEAE6] bg-[#FAFAF8]">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <FileCheck className="h-4 w-4" />
                Verify Uploaded Documents ({documents.length})
              </CardTitle>
              <CardDescription>Review file matches, accept, or reject for student re-upload.</CardDescription>
            </CardHeader>
            <CardContent>
              {isDocsLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : documents.length === 0 ? (
                <div className="text-center py-8 text-[#888] text-sm">
                  No documents uploaded yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {documents.map((doc: any) => (
                    <div
                      key={doc.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border bg-white"
                      style={{ borderColor: "rgba(26, 21, 58, 0.08)" }}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-semibold text-[#111]">{doc.documentType?.name || "Document"}</h4>
                          <Badge
                            className={`text-[10px] py-0.5 px-1.5 rounded uppercase font-bold border ${
                              doc.status === "APPROVED"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : doc.status === "REJECTED" || doc.status === "REUPLOAD_REQUIRED"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-yellow-50 text-yellow-700 border-yellow-200"
                            }`}
                          >
                            {doc.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 truncate max-w-sm">File: {doc.fileName}</p>
                        {doc.remarks && (
                          <p className="text-xs text-red-600 mt-1.5 bg-red-50 p-2 rounded-lg border border-red-100 font-medium">
                            Remarks: {doc.remarks}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex gap-2 w-full sm:w-auto shrink-0 justify-end">
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-9 items-center justify-center rounded-lg px-3.5 border border-[#ECEAE6] text-xs font-semibold text-gray-700 hover:bg-[#FAFAF8] gap-1 bg-white select-none transition-all active:scale-[0.98] cursor-pointer"
                        >
                          View File <ExternalLink className="h-3 w-3" />
                        </a>
                        {doc.status !== "APPROVED" && (
                          <Button
                            type="button"
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white font-medium text-xs h-9"
                            onClick={() => handleVerifyDocument(doc.id, "APPROVED")}
                          >
                            Approve
                          </Button>
                        )}
                        {doc.status !== "REJECTED" && doc.status !== "REUPLOAD_REQUIRED" && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="text-xs h-9 font-medium text-white bg-red-600 hover:bg-red-700"
                            onClick={() => handleVerifyDocument(doc.id, "REJECTED")}
                          >
                            Reject
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Academic History Block */}
          <Card className="border-[#ECEAE6] bg-[#FAFAF8]">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Academic History & Entrance Scores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-[#ECEAE6] p-3.5 rounded-xl text-center">
                  <p className="text-xs text-gray-400">NEET Score</p>
                  <p className="text-xl font-bold text-[#111] mt-1">{student.neetScore ?? "N/A"}</p>
                </div>
                <div className="bg-white border border-[#ECEAE6] p-3.5 rounded-xl text-center">
                  <p className="text-xs text-gray-400">NEET Rank</p>
                  <p className="text-xl font-bold text-[#111] mt-1">{student.neetRank ?? "N/A"}</p>
                </div>
                <div className="bg-white border border-[#ECEAE6] p-3.5 rounded-xl text-center">
                  <p className="text-xs text-gray-400">12th Grade %</p>
                  <p className="text-xl font-bold text-[#111] mt-1">
                    {student.twelfthPercentage ? `${student.twelfthPercentage}%` : "N/A"}
                  </p>
                </div>
                <div className="bg-white border border-[#ECEAE6] p-3.5 rounded-xl text-center">
                  <p className="text-xs text-gray-400">10th Grade %</p>
                  <p className="text-xl font-bold text-[#111] mt-1">
                    {student.tenthPercentage ? `${student.tenthPercentage}%` : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1/3 width): Status update, Demographics, University applications */}
        <div className="space-y-6">
          
          {/* Quick Stage Progression */}
          <Card className="border-[#ECEAE6] bg-[#FAFAF8]">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-[#666]">
                Manage Workflow Stage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#666]">Select Stage</label>
                <select
                  value={stageInput ?? ""}
                  onChange={(e) => setStageInput(parseInt(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3730A3]"
                >
                  <option value="1">Stage 1: Application Submission</option>
                  <option value="2">Stage 2: Admission Fee Payment</option>
                  <option value="3">Stage 3: Entrance Exam Process</option>
                  <option value="4">Stage 4: Invitation Letter Issue</option>
                  <option value="5">Stage 5: Visa Support & Processing</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#666]">Select Status</label>
                <select
                  value={statusInput ?? ""}
                  onChange={(e) => setStatusInput(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3730A3]"
                >
                  <option value="NOT_STARTED">Not Started</option>
                  <option value="STAGE_1_PENDING">Stage 1 Pending</option>
                  <option value="STAGE_1_APPROVED">Stage 1 Approved</option>
                  <option value="STAGE_2_PENDING">Stage 2 Pending</option>
                  <option value="STAGE_2_APPROVED">Stage 2 Approved</option>
                  <option value="STAGE_3_ACTIVE">Stage 3 Active</option>
                  <option value="STAGE_4_PENDING">Stage 4 Pending</option>
                  <option value="STAGE_4_APPROVED">Stage 4 Approved</option>
                  <option value="STAGE_5_UNLOCKED">Stage 5 Unlocked</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <Button
                type="button"
                onClick={handleUpdateStage}
                disabled={updateStageMutation.isPending || (stageInput === student.currentStage && statusInput === student.applicationStatus)}
                className="w-full bg-[#3730A3] hover:bg-[#2e288a] text-white font-medium text-xs h-10 mt-2"
              >
                {updateStageMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" /> Updating...
                  </>
                ) : (
                  "Save Progression"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Demographics / Personal Details Card */}
          <Card className="border-[#ECEAE6] bg-[#FAFAF8]">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-[#666]">
                Demographics & Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="flex gap-3">
                <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-500">Email Address</p>
                  <p className="text-sm text-[#111] mt-0.5">{student.user?.email}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-500">Mobile No.</p>
                  <p className="text-sm font-mono text-[#111] mt-0.5">{student.user?.phone || "N/A"}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-500">Date of Birth</p>
                  <p className="text-sm text-[#111] mt-0.5">
                    {student.dob ? new Date(student.dob).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-500">Address Details</p>
                  <p className="text-sm text-[#111] mt-0.5 leading-relaxed">
                    {student.address ? `${student.address}, ${student.city ?? ""}, ${student.state ?? ""}, ${student.country ?? ""}` : "N/A"}
                  </p>
                </div>
              </div>
              {student.passportNumber && (
                <div className="border-t pt-3 flex gap-3">
                  <User className="h-4 w-4 text-gray-400 shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-500">Passport Number</p>
                    <p className="text-sm text-[#111] mt-0.5 font-mono">{student.passportNumber}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Applied Universities Card */}
          <Card className="border-[#ECEAE6] bg-[#FAFAF8]">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-[#666]">
                Applied Universities ({student.applications?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {student.applications && student.applications.length > 0 ? (
                <div className="space-y-3">
                  {student.applications.map((app: any) => (
                    <div
                      key={app.id}
                      className="p-3 bg-white border border-[#ECEAE6] rounded-xl flex items-center justify-between"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-[#111]">{app.university?.name}</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">{app.university?.shortName || "Matched university"}</p>
                      </div>
                      <Badge className="text-[9px] uppercase font-bold bg-blue-50 text-blue-700 border border-blue-100">
                        {app.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#888] text-center py-4">No universities assigned yet.</p>
              )}
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
}
