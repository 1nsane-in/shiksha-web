export {
  useStudentProfile,
  useStageInfo,
  useMyApplications,
  useMyApplicationById,
  useCheckApplication,
  useSubmitApplication,
  useUpdateProfile,
  useDashboardOverview,
  useDashboardActivity,
  useDashboardNextSteps,
} from "./student.queries";
export type {
  StudentProfile,
  StudentApplication,
  StageInfo,
  StageRequirement,
  StudentDocument,
  PaymentSummary,
  ApplicationCheckResult,
  ApplicationDetail,
  SubmitApplicationFormData,
  DashboardOverview,
  DashboardActivity,
  DashboardNextSteps,
  NextAction,
  UpdateStudentProfileData,
} from "./student.types";
export {
  statusConfig,
  stageActions,
  stageNames,
} from "./student.constants";
export type {
  StatusConfigItem,
  StageActionItem,
} from "./student.constants";
