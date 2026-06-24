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
} from "./parents.types";
import type { AuthResponse } from "@/domains/auth/auth.types";

/* ─── Student-side endpoints ─── */

export function generateInviteLink() {
  return client.post<InviteLinkResponse>("/parents/invite-link");
}

export function getFamilyCode() {
  return client.get<FamilyCodeResponse>("/parents/family-code");
}

export function regenerateFamilyCode() {
  return client.post<FamilyCodeResponse>("/parents/regenerate-family-code");
}

export function getMyParentLinks() {
  return client.get<ParentLink[]>("/parents/my-links");
}

export function removeParentLink(id: string) {
  return client.delete<void>(`/parents/link/${id}`);
}

/* ─── Parent-side endpoints ─── */

export function validateInviteCode(code: string) {
  return client.get<InviteDetails>(`/parents/invite/${code}`);
}

export function sendEmailOtp(email: string, name?: string) {
  return client.post<{ message: string }>("/auth/parent-send-email-otp", { email, name });
}

export function verifyEmailOtp(email: string, otp: string) {
  return client.post<{ message: string }>("/auth/parent-verify-email-otp", { email, otp });
}

export function sendPhoneOtp(phone: string) {
  return client.post<{ message: string }>("/auth/parent-send-phone-otp", { phone });
}

export function verifyPhoneOtp(phone: string, otp: string) {
  return client.post<{ message: string }>("/auth/parent-verify-phone-otp", { phone, otp });
}

export function parentRegister(data: ParentRegisterRequest) {
  return client.post<AuthResponse>("/auth/parent-register", data);
}

export function linkByFamilyCode(data: LinkByCodeRequest) {
  return client.post<LinkByCodeResponse>("/parents/link-by-code", data);
}

export function getLinkedChildren() {
  return client.get<ChildProgress[]>("/parents/children");
}

/* ─── Admin endpoints ─── */

export function getAdminParentLinks(params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) {
  return client.get<import("./parents.types").AdminParentLinksResponse>("/admin/parent-links", { params });
}

export function createAdminParentLink(
  data: import("./parents.types").CreateParentLinkRequest
) {
  return client.post<import("./parents.types").AdminParentLink>("/admin/parent-links", data);
}

export function updateAdminParentLinkStatus(
  id: string,
  data: import("./parents.types").UpdateParentLinkStatusRequest
) {
  return client.patch<import("./parents.types").AdminParentLink>(
    `/admin/parent-links/${id}`,
    data
  );
}

export function deleteAdminParentLink(id: string) {
  return client.delete<void>(`/admin/parent-links/${id}`);
}
