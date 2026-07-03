import { client } from "@/shared/api/client";
import type {
  InviteLinkResponse,
  FamilyCodeResponse,
  ParentLink,
  ParentRegisterRequest,
  InviteDetails,
  ChildProgress,
  LinkByCodeRequest,
  LinkByCodeResponse,
  AdminParentLinksResponse,
  CreateParentLinkRequest,
  UpdateParentLinkStatusRequest,
  AdminParentLink,
} from "./parents.types";
import type { AuthResponse } from "@/domains/auth/auth.types";

const route = {
  inviteLink: "/parents/invite-link",
  familyCode: "/parents/family-code",
  regenerateFamilyCode: "/parents/regenerate-family-code",
  myLinks: "/parents/my-links",
  removeLink: (id: string) => `/parents/link/${id}`,
  inviteDetails: (code: string) => `/parents/invite/${code}`,
  linkByCode: "/parents/link-by-code",
  children: "/parents/children",
  parentSendEmailOtp: "/auth/parent-send-email-otp",
  parentVerifyEmailOtp: "/auth/parent-verify-email-otp",
  parentSendPhoneOtp: "/auth/parent-send-phone-otp",
  parentVerifyPhoneOtp: "/auth/parent-verify-phone-otp",
  parentRegister: "/auth/parent-register",
  adminList: "/admin/parent-links",
  adminDetail: (id: string) => `/admin/parent-links/${id}`,
} as const;

/* ─── Student-side endpoints ─── */

export function generateInviteLink() {
  return client.post<InviteLinkResponse>(route.inviteLink);
}

export function getFamilyCode() {
  return client.get<FamilyCodeResponse>(route.familyCode);
}

export function regenerateFamilyCode() {
  return client.post<FamilyCodeResponse>(route.regenerateFamilyCode);
}

export function getMyParentLinks() {
  return client.get<ParentLink[]>(route.myLinks);
}

export function removeParentLink(id: string) {
  return client.delete<void>(route.removeLink(id));
}

/* ─── Parent-side endpoints ─── */

export function validateInviteCode(code: string) {
  return client.get<InviteDetails>(route.inviteDetails(code));
}

export function sendEmailOtp(email: string, name?: string) {
  return client.post<{ message: string }>(route.parentSendEmailOtp, { email, name });
}

export function verifyEmailOtp(email: string, otp: string) {
  return client.post<{ message: string }>(route.parentVerifyEmailOtp, { email, otp });
}

export function sendPhoneOtp(phone: string) {
  return client.post<{ message: string }>(route.parentSendPhoneOtp, { phone });
}

export function verifyPhoneOtp(phone: string, otp: string) {
  return client.post<{ message: string }>(route.parentVerifyPhoneOtp, { phone, otp });
}

export function parentRegister(data: ParentRegisterRequest) {
  return client.post<AuthResponse>(route.parentRegister, data);
}

export function linkByFamilyCode(data: LinkByCodeRequest) {
  return client.post<LinkByCodeResponse>(route.linkByCode, data);
}

export async function getLinkedChildren() {
  const data = await client.get<any[]>(route.children);
  return data.map((item) => ({
    id: item.id,
    studentId: item.id,
    studentName: item.name ?? "",
    studentEmail: item.email ?? "",
    relation: item.relation ?? "",
    currentStage: item.currentStage ?? 0,
    totalStages: item.totalStages ?? 5,
    applicationStatus: item.applicationStatus ?? "PENDING",
    documentProgress: {
      uploaded: item.documentsCount ?? 0,
      total: item.documentsCount ?? 0,
    },
    universityCount: item.universityCount ?? 0,
  })) satisfies ChildProgress[];
}

/* ─── Admin endpoints ─── */

export function getAdminParentLinks(params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) {
  return client.get<AdminParentLinksResponse>(route.adminList, { params });
}

export function createAdminParentLink(
  data: CreateParentLinkRequest
) {
  return client.post<AdminParentLink>(route.adminList, data);
}

export function updateAdminParentLinkStatus(
  id: string,
  data: UpdateParentLinkStatusRequest
) {
  return client.patch<AdminParentLink>(route.adminDetail(id), data);
}

export function deleteAdminParentLink(id: string) {
  return client.delete<void>(route.adminDetail(id));
}
