import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Exam, ExamDetail, CreateFullExamInput, CreateQuestionInput, ReorderQuestionsInput } from "./exams.types";
import {
  createExam,
  updateExam,
  getExam,
  getAllExams,
  publishExam,
  getMyExam,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  reorderQuestions,
} from "./exams.api";

const EXAM_KEYS = {
  all: ["exams"] as const,
  lists: () => [...EXAM_KEYS.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...EXAM_KEYS.lists(), filters] as const,
  details: () => [...EXAM_KEYS.all, "detail"] as const,
  detail: (id: string) => [...EXAM_KEYS.details(), id] as const,
};

// ──────────────────────────────────────────────────────────────
// Query Hooks
// ──────────────────────────────────────────────────────────────

export function useExams(params?: {
  page?: number;
  limit?: number;
  status?: string;
  universityId?: string;
}) {
  return useQuery({
    queryKey: EXAM_KEYS.list(params || {}),
    queryFn: () => getAllExams(params),
  });
}

export function useExam(examId: string) {
  return useQuery({
    queryKey: EXAM_KEYS.detail(examId),
    queryFn: () => getExam(examId),
    enabled: !!examId,
  });
}

export function useMyExam() {
  return useQuery({
    queryKey: [...EXAM_KEYS.all, "my"],
    queryFn: getMyExam,
  });
}

// ──────────────────────────────────────────────────────────────
// Mutation Hooks
// ──────────────────────────────────────────────────────────────

export function useCreateExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createExam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXAM_KEYS.lists() });
      toast.success("Exam created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create exam");
    },
  });
}

export function useUpdateExam(examId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (input: Partial<CreateExamInput>) => updateExam(examId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXAM_KEYS.detail(examId) });
      toast.success("Exam updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update exam");
    },
  });
}

export function usePublishExam(examId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => publishExam(examId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXAM_KEYS.detail(examId) });
      queryClient.invalidateQueries({ queryKey: EXAM_KEYS.lists() });
      toast.success("Exam published successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to publish exam");
    },
  });
}

export function useAddQuestion(examId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (input: CreateQuestionInput) => addQuestion(examId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXAM_KEYS.detail(examId) });
      toast.success("Question added successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add question");
    },
  });
}

export function useUpdateQuestion(examId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ questionId, input }: { questionId: string; input: CreateQuestionInput }) =>
      updateQuestion(examId, questionId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXAM_KEYS.detail(examId) });
      toast.success("Question updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update question");
    },
  });
}

export function useDeleteQuestion(examId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (questionId: string) => deleteQuestion(examId, questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXAM_KEYS.detail(examId) });
      toast.success("Question deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete question");
    },
  });
}

export function useReorderQuestions(examId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (input: ReorderQuestionsInput) => reorderQuestions(examId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXAM_KEYS.detail(examId) });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to reorder questions");
    },
  });
}


