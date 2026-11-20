import { cn } from "@/lib/utils";

interface InfoFieldProps {
  label: string;
  value: string;
  className?: string;
}

export function InfoField({ label, value, className }: InfoFieldProps) {
  return (
    <div className={cn(className)}>
      <p className="text-slate-500">{label}</p>
      <p className="font-medium text-navy">{value}</p>
    </div>
  );
}
