"use client";

import { useState } from "react";
import { useAdminStudents, useStudentStats, useUpdateStudentStage } from "@/domains/admin";
import { StudentStatsCards } from "@/components/admin/students/student-stats-cards";
import { StudentsFilters } from "@/components/admin/students/students-filters";
import { StudentsTable } from "@/components/admin/students/students-table";
import { StudentDetailPanel } from "@/components/admin/students/student-detail-panel";

export default function AdminStudentsPage() {
  const [page, setPage] = useState(1);
  const [stage, setStage] = useState<number | undefined>(undefined);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [editStage, setEditStage] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useAdminStudents({ page, limit: 10, stage, status });
  const { data: stats } = useStudentStats();
  const updateStageMutation = useUpdateStudentStage();

  const selectStudent = (student: any) => {
    setSelectedStudent(student);
    setEditStage(student.currentStage);
    setEditStatus(student.applicationStatus);
  };

  const handleUpdateStage = async (studentId: string) => {
    if (editStage === null) return;
    try {
      await updateStageMutation.mutateAsync({
        id: studentId,
        payload: { stage: editStage, status: editStatus || undefined },
      });
      setSelectedStudent((prev: any) => ({
        ...prev,
        currentStage: editStage,
        applicationStatus: editStatus || prev.applicationStatus,
      }));
      refetch();
    } catch { /* error handled by UI feedback */ }
  };

  const students = data?.data ?? [];

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-[#111]">Student Management</h1>
        <p className="text-sm text-[#666]">Track, manage, and progress prospective students through key admission milestones.</p>
      </div>

      <StudentStatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-end">
            <StudentsFilters stage={stage} status={status} onStageChange={setStage} onStatusChange={setStatus} />
          </div>
          <StudentsTable
            students={students}
            isLoading={isLoading}
            isError={isError}
            page={page}
            totalPages={data?.totalPages ?? 1}
            onRetry={refetch}
            onPageChange={setPage}
            onSelectStudent={selectStudent}
          />
        </div>

        <div>
          <StudentDetailPanel
            student={selectedStudent}
            editStage={editStage}
            editStatus={editStatus}
            isPending={updateStageMutation.isPending}
            onStageChange={setEditStage}
            onStatusChange={setEditStatus}
            onSave={() => handleUpdateStage(selectedStudent.id)}
          />
        </div>
      </div>
    </div>
  );
}
