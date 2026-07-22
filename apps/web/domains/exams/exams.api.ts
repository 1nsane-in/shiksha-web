import { api } from "@/shared/api/axios";
import type {
  Exam,
  CreateExamInput,
  CreateFullExamInput,
  CreateQuestionInput,
  ReorderQuestionsInput,
} from "./exams.types";

const BASE = "/admin/exams";

// ──────────────────────────────────────────────────────────────
// Exam CRUD
// ──────────────────────────────────────────────────────────────

export async function createExam(input: CreateFullExamInput): Promise<Exam> {
  const { data } = await api.post(BASE, input);
  return data;
}

export async function updateExam(
  examId: string,
  input: Partial<CreateExamInput>
): Promise<Exam> {
  const { data } = await api.put(`${BASE}/${examId}`, input);
  return data;
}

export async function getExam(examId: string): Promise<Exam> {
  const { data } = await api.get(`${BASE}/${examId}`);
  return data;
}

export async function getAllExams(params?: {
  page?: number;
  limit?: number;
  status?: string;
  universityId?: string;
}): Promise<{ data: Exam[]; meta: { total: number; page: number; limit: number; totalPages: number } }> {
  const { data } = await api.get(BASE, { params });
  return data;
}

export async function publishExam(examId: string): Promise<Exam> {
  const { data } = await api.post(`${BASE}/${examId}/publish`, { id: examId });
  return data;
}

// ──────────────────────────────────────────────────────────────
// Question CRUD
// ──────────────────────────────────────────────────────────────

export async function addQuestion(
  examId: string,
  input: CreateQuestionInput
): Promise<Exam["questions"][0]> {
  const { data } = await api.post(`${BASE}/${examId}/questions`, input);
  return data;
}

export async function updateQuestion(
  examId: string,
  questionId: string,
  input: CreateQuestionInput
): Promise<Exam["questions"][0]> {
  const { data } = await api.put(`${BASE}/${examId}/questions/${questionId}`, input);
  return data;
}

export async function deleteQuestion(
  examId: string,
  questionId: string
): Promise<{ success: boolean }> {
  const { data } = await api.delete(`${BASE}/${examId}/questions/${questionId}`);
  return data;
}

export async function reorderQuestions(
  examId: string,
  input: ReorderQuestionsInput
): Promise<{ success: boolean }> {
  const { data } = await api.put(`${BASE}/${examId}/questions/reorder`, input);
  return data;
}


