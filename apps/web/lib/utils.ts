import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Capitalize first letter of a string */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Format program key into human readable name */
export function formatProgram(program: string): string {
  const programNames: Record<string, string> = {
    "pre-medical": "Pre-Medical",
    "general-medicine": "General Medicine (MBBS)",
    dentistry: "Dentistry (BDS)",
    "post-graduate": "Post-Graduate",
  };
  return programNames[program] || program;
}

/** Format a date string to locale date string */
export function formatDate(
  date: string | Date | null | undefined,
  options?: Intl.DateTimeFormatOptions,
): string {
  if (!date) return "N/A";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(undefined, options);
}

/** Format date with time */
export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
