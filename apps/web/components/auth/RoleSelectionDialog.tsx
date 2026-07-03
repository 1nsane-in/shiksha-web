"use client";

import { useEffect, useState } from "react";
import { GraduationCap, Users } from "lucide-react";
import { cn } from "@repo/ui";
import type { SocialRole } from "@/domains/auth";

interface RoleOption {
  value: SocialRole;
  label: string;
  description: string;
  icon: React.ElementType;
  accent: string;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    value: "STUDENT",
    label: "Student",
    description: "I'm applying for admission and managing my own application.",
    icon: GraduationCap,
    accent: "from-blue-500/15 to-blue-500/5 text-blue-700 dark:text-blue-300",
  },
  {
    value: "PARENT",
    label: "Parent",
    description: "I'm supporting my child through the admission process.",
    icon: Users,
    accent: "from-emerald-500/15 to-emerald-500/5 text-emerald-700 dark:text-emerald-300",
  },
];

interface RoleSelectionDialogProps {
  open: boolean;
  defaultRole?: SocialRole;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: (role: SocialRole) => void;
  onCancel: () => void;
}

/**
 * Modal that forces the user to pick STUDENT or PARENT before continuing
 * a Google OAuth flow. Blocks scroll + Escape until a choice is made.
 *
 * The component returns `null` when closed, so it remounts (and re-seeds its
 * state from `defaultRole`) every time it opens. No reset effect needed.
 */
export function RoleSelectionDialog({
  open,
  defaultRole = "STUDENT",
  title = "Continue as...",
  description = "Choose how you'll use your account. This helps us route you to the right dashboard.",
  confirmLabel = "Continue with Google",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: RoleSelectionDialogProps) {
  const [selected, setSelected] = useState<SocialRole>(defaultRole);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      }
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="role-dialog-title"
    >
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative z-10 w-full max-w-md rounded-xl border border-border bg-background p-6 shadow-2xl">
        <div className="mb-4 text-center">
          <h2
            id="role-dialog-title"
            className="text-xl font-semibold tracking-tight"
          >
            {title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>

        <div className="grid gap-3">
          {ROLE_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selected === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelected(opt.value)}
                aria-pressed={isSelected}
                className={cn(
                  "flex items-start gap-3 rounded-lg border p-4 text-left transition-all",
                  "hover:border-primary/50 hover:shadow-sm",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  isSelected
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border bg-card"
                )}
              >
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br",
                    opt.accent
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold">{opt.label}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {opt.description}
                  </span>
                </span>
                <span
                  className={cn(
                    "mt-1 h-4 w-4 shrink-0 rounded-full border-2 transition-colors",
                    isSelected
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/40"
                  )}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => onConfirm(selected)}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
