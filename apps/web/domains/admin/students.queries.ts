import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminStudents,
  getAdminStudent,
  updateAdminStudent,
  updateStudentStage,
  assignUniversity,
  getStudentStats,
} from "./students.api";
import type {
  AdminStudentFilters,
  UpdateStudentStagePayload,
  AssignUniversityPayload,
} from "./students.types";

export function useAdminStudents(filters: AdminStudentFilters = {}) {
  return useQuery({
    queryKey: ["admin", "students", filters],
    queryFn: () => getAdminStudents(filters),
  });
}

export function useAdminStudent(id: string) {
  return useQuery({
    queryKey: ["admin", "student", id],
    queryFn: () => getAdminStudent(id),
    enabled: !!id,
  });
}

export function useUpdateAdminStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      updateAdminStudent(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "students"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "student", variables.id] });
    },
  });
}

export function useUpdateStudentStage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateStudentStagePayload }) =>
      updateStudentStage(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "students"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "student", variables.id] });
    },
  });
}

export function useAssignUniversity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AssignUniversityPayload }) =>
      assignUniversity(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "students"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "student", variables.id] });
    },
  });
}

export function useStudentStats() {
  return useQuery({
    queryKey: ["admin", "students", "stats"],
    queryFn: getStudentStats,
  });
}
