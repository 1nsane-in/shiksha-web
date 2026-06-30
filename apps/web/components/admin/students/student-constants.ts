export const stageNames: Record<number, string> = {
  1: "Application Submission",
  2: "Admission Fee Payment",
  3: "Entrance Exam Process",
  4: "Invitation Letter Issue",
  5: "Visa Support & Processing",
};

export const statusColors: Record<string, string> = {
  NOT_STARTED: "bg-gray-100 text-gray-800 border-gray-200",
  STAGE_1_PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  STAGE_1_APPROVED: "bg-green-100 text-green-800 border-green-200",
  STAGE_2_PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  STAGE_2_APPROVED: "bg-green-100 text-green-800 border-green-200",
  STAGE_3_ACTIVE: "bg-blue-100 text-blue-800 border-blue-200",
  STAGE_4_PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  STAGE_4_APPROVED: "bg-green-100 text-green-800 border-green-200",
  STAGE_5_UNLOCKED: "bg-purple-100 text-purple-800 border-purple-200",
  COMPLETED: "bg-emerald-100 text-emerald-800 border-emerald-200",
  REJECTED: "bg-red-100 text-red-800 border-red-200",
};
