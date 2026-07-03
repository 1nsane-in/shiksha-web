"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Skeleton, Button } from "@repo/ui";
import { toast } from "sonner";
import { useAdminStudent, useUpdateStudentStage } from "@/domains/admin";
import { useStudentDocuments, useVerifyDocument, useMarkForReupload } from "@/domains/documents";
import { StudentHeader } from "@/components/admin/students/detail/student-header";
import { StudentTimeline } from "@/components/admin/students/detail/student-timeline";
import { StudentDocumentsCard } from "@/components/admin/students/detail/student-documents-card";
import { StudentAcademicCard } from "@/components/admin/students/detail/student-academic-card";
import { StudentStageWorkflow } from "@/components/admin/students/detail/student-stage-workflow";
import { StudentDemographicsCard } from "@/components/admin/students/detail/student-demographics-card";
import { StudentUniversitiesCard } from "@/components/admin/students/detail/student-universities-card";

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

  useEffect(() => {
    if (student) {
      setStageInput(student.currentStage);
      setStatusInput(student.applicationStatus);
    }
  }, [student]);

  const handleUpdateStage = async () => {
    if (stageInput === null || statusInput === null) return;
    try {
      await updateStageMutation.mutateAsync({ id, payload: { stage: stageInput, status: statusInput } });
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
        if (!remarks.trim()) { toast.error("Rejection remarks are required"); return; }
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
      <StudentHeader name={student.user?.name} studentId={student.id} applicationStatus={student.applicationStatus} />

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <StudentTimeline currentStage={student.currentStage} />
          <StudentDocumentsCard documents={documents} isLoading={isDocsLoading} onVerify={handleVerifyDocument} />
          <StudentAcademicCard
            neetScore={student.neetScore}
            neetRank={student.neetRank}
            twelfthPercentage={student.twelfthPercentage}
            tenthPercentage={student.tenthPercentage}
          />
        </div>

        <div className="space-y-6">
          <StudentStageWorkflow
            stage={stageInput}
            status={statusInput}
            isPending={updateStageMutation.isPending}
            hasChanges={stageInput !== student.currentStage || statusInput !== student.applicationStatus}
            onStageChange={setStageInput}
            onStatusChange={setStatusInput}
            onSave={handleUpdateStage}
          />
          <StudentDemographicsCard
            email={student.user?.email}
            phone={student.user?.phone}
            dob={student.dob}
            address={student.address}
            city={student.city}
            state={student.state}
            country={student.country}
            passportNumber={student.passportNumber}
          />
          <StudentUniversitiesCard applications={student.applications} />
        </div>
      </div>
    </div>
  );
}
