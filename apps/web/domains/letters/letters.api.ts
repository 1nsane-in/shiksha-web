import { client } from "@/shared/api/client";
import type { AdmissionLetter, InvitationLetter } from "./letters.types";

const route = {
  admissionMy: "/letters/admission/my" as const,
  invitationMy: "/letters/invitation/my" as const,
  admissionDownload: (applicationId: string) => `/letters/admission/${applicationId}/download` as const,
  invitationDownload: (applicationId: string) => `/letters/invitation/${applicationId}/download` as const,
} as const;

export function getMyAdmissionLetter() {
  return client.get<AdmissionLetter>(route.admissionMy);
}

export function getMyInvitationLetter() {
  return client.get<InvitationLetter>(route.invitationMy);
}

export function downloadAdmissionLetter(applicationId: string) {
  return client.post<AdmissionLetter>(route.admissionDownload(applicationId));
}

export function downloadInvitationLetter(applicationId: string) {
  return client.post<InvitationLetter>(route.invitationDownload(applicationId));
}
