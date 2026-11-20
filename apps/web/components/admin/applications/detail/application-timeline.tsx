"use client";

import { History } from "lucide-react";

interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  occurredAt: string;
}

interface Props {
  events: TimelineEvent[];
}

export function ApplicationTimeline({ events }: Props) {
  return (
    <div className="rounded-xl border border-border bg-white p-6">
      <div className="mb-5 flex items-center gap-2 border-b border-slate-200 pb-3">
        <div className="rounded-lg bg-zinc-100 p-1.5">
          <History className="h-4 w-4 text-navy" />
        </div>
        <h2 className="text-sm font-medium text-navy tracking-tight">Audit Trail & History</h2>
      </div>
      {events.length > 0 ? (
        <div className="relative pl-5 space-y-6 before:absolute before:left-[3px] before:top-2 before:bottom-2 before:w-[1px] before:bg-border">
          {events.map((e: TimelineEvent) => (
            <div key={e.id} className="relative space-y-1">
              <div className="absolute -left-[19px] top-1.5 h-2 w-2 shrink-0 rounded-full bg-navy" />
              <p className="text-sm font-medium text-navy">{e.title}</p>
              {e.description && <p className="text-xs text-slate-600 leading-relaxed">{e.description}</p>}
              <p className="text-[10px] font-mono text-slate-600">{new Date(e.occurredAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-600 py-4 text-center">No timeline history recorded yet</p>
      )}
    </div>
  );
}
