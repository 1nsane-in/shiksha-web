export interface ExamDetail {
  id: string;
  applicationId: string;
  examDate?: string;
  examSubject?: string;
  examCenter?: string;
  result?: 'AWAITED' | 'PASSED' | 'FAILED';
  resultDeclaredAt?: string;
  resultRemarks?: string;
  attemptNumber: number;
}
