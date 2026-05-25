export interface ScheduleExamPayload {
  applicationId: string;
  examDate: string;
  examSubject: string;
  examCenter: string;
  attemptNumber?: number;
}

export interface DeclareResultPayload {
  examId: string;
  result: 'PASSED' | 'FAILED';
  remarks?: string;
}

export interface ExamResponse {
  id: string;
  applicationId: string;
  examDate: string;
  examSubject: string;
  examCenter: string;
  result?: string;
  attemptNumber: number;
  scheduledBy: string;
  declaredBy?: string;
  remarks?: string;
  createdAt: string;
  student?: {
    id: string;
    user: { name: string; email: string };
  };
  university?: { name: string; shortName: string };
}
