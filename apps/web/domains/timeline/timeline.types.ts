export interface TimelineEvent {
  id: string;
  applicationId: string;
  studentId: string;
  stage: number;
  event: string;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
  occurredAt: string;
  isCompleted: boolean;
  isActive: boolean;
  application?: {
    id: string;
    university: {
      name: string;
      shortName: string;
    };
  };
}