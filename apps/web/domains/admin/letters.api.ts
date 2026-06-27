import { client } from "@/shared/api/client";
import type { UploadLetterPayload, UpdateLetterPayload, LetterResponse } from "./letters.types";

const route = {
  admission: "/letters/admission" as const,
  invitation: "/letters/invitation" as const,
  invitationDetail: (id: string) => `/letters/invitation/${id}` as const,
  approveAccess: (applicationId: string) => `/letters/invitation/${applicationId}/approve-access` as const,
} as const;

export function uploadAdmissionLetter(data: UploadLetterPayload) {
  return client.post<LetterResponse>(route.admission, data);
}

export function uploadInvitationLetter(data: UploadLetterPayload) {
  return client.post<LetterResponse>(route.invitation, data);
}

export function updateInvitationLetter(id: string, data: UpdateLetterPayload) {
  return client.patch<LetterResponse>(route.invitationDetail(id), data);
}

export function approveInvitationLetterAccess(applicationId: string) {
  return client.post<LetterResponse>(route.approveAccess(applicationId));
}
