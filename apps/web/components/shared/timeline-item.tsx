import type { TimelineEvent } from "@/domains/timeline";
import { formatDateTime } from "@/lib/utils";

interface TimelineItemProps {
  event: TimelineEvent;
}

export function TimelineItem({ event }: TimelineItemProps) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div
          className={`size-3 rounded-full mt-1 ${
            event.isCompleted
              ? "bg-green-500"
              : event.isActive
                ? "bg-royal-blue"
                : "bg-neutral-200"
          }`}
        />
        <div className="w-px flex-1 bg-neutral-200" />
      </div>
      <div className="pb-4">
        <div className="flex items-center gap-2">
          <p className="font-medium text-sm text-navy">{event.title}</p>
          <span className="text-xs text-slate-500 bg-neutral-100 px-1.5 py-0.5 rounded">
            Stage {event.stage}
          </span>
        </div>
        {event.description && (
          <p className="text-sm text-slate-500 mt-0.5">{event.description}</p>
        )}
        <p className="text-xs text-slate-400 mt-1">{formatDateTime(event.occurredAt)}</p>
      </div>
    </div>
  );
}
