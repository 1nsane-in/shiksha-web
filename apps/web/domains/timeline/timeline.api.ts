import { client } from "@/shared/api/client";
import type { TimelineEvent } from "./timeline.types";

const route = {
  byApplication: (applicationId: string) => `/timeline/application/${applicationId}` as const,
  my: "/timeline/my" as const,
} as const;

export function getApplicationTimeline(applicationId: string) {
  return client.get<TimelineEvent[]>(route.byApplication(applicationId));
}

export function getStudentTimeline() {
  return client.get<TimelineEvent[]>(route.my);
}
