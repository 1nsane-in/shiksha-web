export interface ParentLink {
  id: string;
  parentId: string;
  parentName: string;
  parentEmail: string;
  parentPhone?: string | null;
  relation: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  invitedBy: string;
  createdAt: string;
}

export interface InviteLinkResponse {
  inviteUrl: string;
  code: string;
  expiresAt: string;
}

export interface FamilyCodeResponse {
  familyCode: string;
}

/* ─── Parent Registration & Linking ─── */

export interface ParentRegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  inviteCode?: string;
  relation?: string;
}

export interface InviteDetails {
  email: string;
  studentName: string;
  relation: string | null;
  valid: boolean;
  expired?: boolean;
  alreadyUsed?: boolean;
}

export interface ChildProgress {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  relation: string;
  currentStage: number;
  totalStages: number;
  applicationStatus: string;
  documentProgress: {
    uploaded: number;
    total: number;
  };
  universityCount: number;
}

export interface LinkByCodeResponse {
  message: string;
}

export interface LinkByCodeRequest {
  familyCode: string;
}

/* ─── Admin endpoints ─── */

export interface AdminParentLink {
  id: string;
  parentId: string;
  parentName: string;
  parentEmail: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  relation: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  invitedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateParentLinkRequest {
  parentEmail: string;
  studentEmail: string;
  relation?: string;
}

export interface UpdateParentLinkStatusRequest {
  status: "APPROVED" | "REJECTED";
}

export interface AdminParentLinksResponse {
  data: AdminParentLink[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
