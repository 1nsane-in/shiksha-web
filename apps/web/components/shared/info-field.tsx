import { cn } from "@/lib/utils";

interface InfoFieldProps {
  label: string;
  value: string;
  className?: string;
}

export function InfoField({ label, value, className }: InfoFieldProps) {
  return (
    <div className={cn(className)}>
      <p className="text-[#6B6B6B]">{label}</p>
      <p className="font-medium text-[#2D2154]">{value}</p>
    </div>
  );
}
