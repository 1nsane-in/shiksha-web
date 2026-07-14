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

export interface ProctoringConfig {
  aiProctoringEnabled: boolean;
  webcamRequired: boolean;
  microphoneRequired: boolean;
  screenRecordingEnabled: boolean;
  faceDetectionEnabled: boolean;
  gazeTrackingEnabled: boolean;
  tabSwitchWarnings: number;
  autoSubmitOnViolation: boolean;
  connectivityGraceMinutes: number;
}

export interface Exam {
  id: string;
  name: string;
  description?: string;
  universityId: string;
  dateWindowStart: string;
  dateWindowEnd: string;
  durationMinutes: number;
  totalMarks: number;
  passingPercentage: number;
  maxAttempts: number;
  resultTiming: 'IMMEDIATE' | 'SCHEDULED';
  resultDate?: string;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  status: ExamStatus;
  createdAt: string;
  updatedAt: string;
  questions: ExamQuestion[];
  proctoringConfig?: ProctoringConfig;
  university?: {
    id: string;
    name: string;
    shortName: string;
  };
  _count?: {
    questions: number;
    registrations: number;
  };
}

export interface CreateExamInput {
  name: string;
  description?: string;
  universityId: string;
  dateWindowStart: string;
  dateWindowEnd: string;
  durationMinutes: number;
  passingPercentage: number;
  maxAttempts?: number;
  resultTiming?: 'IMMEDIATE' | 'SCHEDULED';
  resultDate?: string;
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
}

export interface CreateQuestionInput {
  type: QuestionType;
  questionText: string;
  questionImageUrl?: string;
  marks: number;
  negativeMarks?: number;
  difficulty?: QuestionDifficulty;
  topic?: string;
  options?: { optionText: string; isCorrect: boolean }[];
  config?: {
    wordLimit?: number;
    keywords?: string[];
    manualReview?: boolean;
  };
}

export interface UpdateProctoringConfigInput {
  aiProctoringEnabled?: boolean;
  webcamRequired?: boolean;
  microphoneRequired?: boolean;
  screenRecordingEnabled?: boolean;
  faceDetectionEnabled?: boolean;
  gazeTrackingEnabled?: boolean;
  tabSwitchWarnings?: number;
  autoSubmitOnViolation?: boolean;
  connectivityGraceMinutes?: number;
}

export interface ReorderQuestionsInput {
  questionIds: string[];
}
