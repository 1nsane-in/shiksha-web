import { client } from "@/shared/api/client";
import type { AdmissionLetter, InvitationLetter } from "./letters.types";

export function getMyAdmissionLetter() {
  return client.get<AdmissionLetter>("/letters/admission/my");
}

export function getMyInvitationLetter() {
  return client.get<InvitationLetter>("/letters/invitation/my");
}

export function downloadAdmissionLetter(applicationId: string) {
  return client.post<AdmissionLetter>("/letters/admission/" + applicationId + "/download");
}

export function downloadInvitationLetter(applicationId: string) {
  return client.post<InvitationLetter>("/letters/invitation/" + applicationId + "/download");
}
