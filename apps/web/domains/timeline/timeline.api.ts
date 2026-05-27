import { client } from "@/shared/api/client";
import type { TimelineEvent } from "./timeline.types";

export function getApplicationTimeline(applicationId: string) {
  return client.get<TimelineEvent[]>("/timeline/application/" + applicationId);
}

export function getStudentTimeline() {
  return client.get<TimelineEvent[]>("/timeline/my");
}
