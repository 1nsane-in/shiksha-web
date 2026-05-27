import { client } from "@/shared/api/client";
import type { UploadLetterPayload, UpdateLetterPayload, LetterResponse } from "./letters.types";

export function uploadAdmissionLetter(data: UploadLetterPayload) {
  return client.post<LetterResponse>("/letters/admission", data);
}

export function uploadInvitationLetter(data: UploadLetterPayload) {
  return client.post<LetterResponse>("/letters/invitation", data);
}

export function updateInvitationLetter(id: string, data: UpdateLetterPayload) {
  return client.patch<LetterResponse>("/letters/invitation/" + id, data);
}

export function approveInvitationLetterAccess(applicationId: string) {
  return client.post<LetterResponse>("/letters/invitation/" + applicationId + "/approve-access");
}
