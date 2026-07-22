export enum QuestionType {
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  MULTI_CHOICE = 'MULTI_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  SUBJECTIVE = 'SUBJECTIVE',
}

export enum QuestionDifficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export enum ExamStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

export enum RegistrationStatus {
  REGISTERED = 'REGISTERED',
  READY = 'READY',
  ATTENDED = 'ATTENDED',
  ABSENT = 'ABSENT',
  COMPLETED = 'COMPLETED',
  INTERRUPTED = 'INTERRUPTED',
  CANCELLED = 'CANCELLED',
}

export enum SessionStatus {
  READY = 'READY',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  INTERRUPTED = 'INTERRUPTED',
  SUBMITTED = 'SUBMITTED',
}

export enum ResultStatus {
  PASS = 'PASS',
  FAIL = 'FAIL',
}

export interface QuestionOption {
  id?: string;
  optionText: string;
  isCorrect: boolean;
  orderIndex: number;
}

export interface ExamQuestion {
  id?: string;
  type: QuestionType;
  questionText: string;
  questionImageUrl?: string;
  marks: number;
  negativeMarks?: number;
  difficulty?: QuestionDifficulty;
  topic?: string;
  orderIndex: number;
  options?: QuestionOption[];
  config?: {
    wordLimit?: number;
    keywords?: string[];
    manualReview?: boolean;
  };
}

export interface ExamResponse {
  id?: string;
  questionId: string;
  selectedOption?: number;
  textAnswer?: string;
  isCorrect?: boolean;
  marksObtained?: number;
  timeTaken?: number;
  flaggedForReview?: boolean;
}

export interface ExamResult {
  id?: string;
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  rank?: number;
  correctAnswers: number;
  wrongAnswers: number;
  unattempted: number;
  status: ResultStatus;
  certificateUrl?: string;
}
