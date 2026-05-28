/**
 * Pure mapping logic for application status badges and stage actions.
 * Extracted for testability.
 */

// --- Status Badge Color Mapping ---
export type StatusColorScheme = {
  label: string;
  color: string;
};

export const statusColorMap: Record<string, StatusColorScheme> = {
  pending: {
    label: "Pending Review",
    color: "text-yellow-600 bg-yellow-50 border-yellow-200",
  },
  in_review: {
    label: "In Review",
    color: "text-blue-600 bg-blue-50 border-blue-200",
  },
  approved: {
    label: "Approved",
    color: "text-green-600 bg-green-50 border-green-200",
  },
  rejected: {
    label: "Rejected",
    color: "text-red-600 bg-red-50 border-red-200",
  },
};

export function getStatusColor(status: string): StatusColorScheme | undefined {
  if (Object.hasOwn(statusColorMap, status)) {
    return statusColorMap[status];
  }
  return undefined;
}

// --- Stage-to-Action Mapping ---
export type StageAction = {
  label: string;
  href: string;
  description: string;
};

export const stageActionsMap: Record<number, StageAction> = {
  2: {
    label: "Pay Admission Fee",
    href: "/student/payments",
    description: "Pay ₹5,000 to proceed",
  },
  3: {
    label: "View Exam Details",
    href: "/student/exams",
    description: "Check exam schedule & pay ₹10,000",
  },
  4: {
    label: "View Invitation Letter",
    href: "/student/letters",
    description: "Download your invitation letter",
  },
  5: {
    label: "Visa Support",
    href: "/student/visa-support",
    description: "Get visa and travel assistance",
  },
};

export function getStageAction(stage: number): StageAction | undefined {
  if (Object.hasOwn(stageActionsMap, stage)) {
    return stageActionsMap[stage];
  }
  return undefined;
}

// --- Application Sort ---
export interface ApplicationSortItem {
  submittedAt: string;
  [key: string]: unknown;
}

export function sortApplicationsByDateDesc<T extends ApplicationSortItem>(
  applications: T[],
): T[] {
  return [...applications].sort(
    (a, b) =>
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
  );
}
