import type { ReactNode, ComponentType } from "react";

export function Field({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="space-y-1">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#626260]">{label}</span>
      <p className="text-sm font-normal text-[#111111] break-words">
        {value !== undefined && value !== null && value !== "" ? value : "—"}
      </p>
    </div>
  );
}

export function KeyValueRow({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-zinc-100 last:border-0 text-sm">
      <span className="text-[#626260] font-normal">{label}</span>
      <span className="text-[#111111] font-medium text-right break-all pl-4">
        {value || "—"}
      </span>
    </div>
  );
}

export function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: ComponentType<{ className?: string }>;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[#d3cec6] bg-white p-6 transition-all">
      <div className="mb-5 flex items-center gap-2 border-b border-[#ebe7e1] pb-3">
        <div className="rounded-lg bg-zinc-100 p-1.5">
          <Icon className="h-4 w-4 text-[#111111]" />
        </div>
        <h2 className="text-sm font-medium text-[#111111] tracking-tight">{title}</h2>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">{children}</div>
    </div>
  );
}
