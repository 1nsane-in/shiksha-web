"use client";

import React from "react";
import { Skeleton, Badge } from "@repo/ui";
import { CheckCircle2, Edit, Hash, X, Loader2, ImageIcon } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type IconComponent = LucideIcon | React.ComponentType<{ className?: string }>;

/* ─── Status badge ─── */
export const statusConfig: Record<string, { label: string; className: string }> = {
  ACTIVE: { label: "Active", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  DRAFT: { label: "Draft", className: "bg-gray-50 text-gray-600 border-gray-200" },
  UNDER_REVIEW: { label: "Under Review", className: "bg-amber-50 text-amber-700 border-amber-200" },
  INACTIVE: { label: "Inactive", className: "bg-red-50 text-red-700 border-red-200" },
  SUSPENDED: { label: "Suspended", className: "bg-orange-50 text-orange-700 border-orange-200" },
};

/* ─── Info row (label + value) ─── */
export function InfoRow({ icon: Icon, label, value }: { icon?: IconComponent; label: string; value: string | React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      {Icon && <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />}
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</p>
        <div className="text-sm font-semibold text-gray-900 mt-0.5">{value}</div>
      </div>
    </div>
  );
}

/* ─── Section heading ─── */
export function SectionHeading({ icon: Icon, title, onEdit }: { icon: IconComponent; title: string; onEdit?: () => void }) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-700">
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">{title}</h3>
      </div>
      {onEdit && (
        <button onClick={onEdit} className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 hover:text-gray-700">
          <Edit className="h-3.5 w-3.5" />
          Edit
        </button>
      )}
    </div>
  );
}

/* ─── Badge list ─── */
export function BadgeList({ items }: { items: string[] }) {
  if (!items?.length) return <span className="text-sm text-gray-400">—</span>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item, i) => (
        <span key={`${item}-${i}`} className="inline-flex items-center rounded-md border border-gray-200 bg-white px-2 py-0.5 text-xs text-gray-500">{item}</span>
      ))}
    </div>
  );
}

/* ─── Empty state ─── */
export function EmptyState({ icon: Icon, message, action }: { icon: IconComponent; message: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center rounded-lg border border-dashed border-gray-200 py-16">
      <div className="text-center">
        <Icon className="mx-auto mb-3 h-8 w-8 text-gray-400" />
        <p className="text-sm text-gray-400">{message}</p>
        {action && <div className="mt-3">{action}</div>}
      </div>
    </div>
  );
}

/* ─── Data card wrappers ─── */
export function DataCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-gray-200 bg-white ${className}`}>{children}</div>;
}
export function DataCardPad({ children }: { children: React.ReactNode }) {
  return <div className="p-4 sm:p-5">{children}</div>;
}

/* ─── Detail grid & cell ─── */
const colMap: Record<number, string> = { 1: "sm:grid-cols-1", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-4" };
export function DetailGrid({ children, cols = 2 }: { children: React.ReactNode; cols?: 1 | 2 | 3 | 4 }) {
  return <div className={`grid grid-cols-1 ${colMap[cols]} gap-3`}>{children}</div>;
}
export function DetailCell({ label, value, mono }: { label: string; value: string | React.ReactNode; mono?: boolean }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-stone-50 px-3 py-2.5">
      <p className="text-xs text-gray-400">{label}</p>
      <p className={`text-sm font-medium text-gray-900 ${mono ? "font-mono" : ""}`}>{value ?? "—"}</p>
    </div>
  );
}

/* ─── Amenity tag (checked / unchecked) ─── */
export function AmenityTag({ icon: Icon, label, checked }: { icon: IconComponent; label: string; checked: boolean }) {
  return (
    <div className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 transition-colors ${checked ? "border-emerald-200 bg-emerald-50/50" : "border-gray-200 bg-stone-50"}`}>
      <div className={`flex h-6 w-6 items-center justify-center rounded-full ${checked ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-400"}`}>
        {checked ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XIcon className="h-3.5 w-3.5" />}
      </div>
      <span className={`text-sm ${checked ? "font-medium text-emerald-800" : "text-gray-500"}`}>{label}</span>
    </div>
  );
}

/* ─── Amenity check (for infra tab) ─── */
export function AmenityCheck({ icon: Icon, label, checked }: { icon: IconComponent; label: string; checked: boolean }) {
  return (
    <div className={`flex items-center gap-3 rounded-lg border px-3.5 py-3 ${checked ? "border-emerald-200 bg-emerald-50/40" : "border-gray-200 bg-stone-50"}`}>
      <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${checked ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-400"}`}>
        {checked ? <CheckCircle2 className="h-4 w-4" /> : <XIcon className="h-4 w-4" />}
      </div>
      <span className={`text-sm ${checked ? "font-semibold text-emerald-800" : "text-gray-500"}`}>{label}</span>
    </div>
  );
}

/* ─── X icon (inline SVG) ─── */
export function XIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
  );
}

/* ─── Loading skeleton ─── */
export function LoadingSkeleton() {
  return (
    <div className="flex flex-1 flex-col animate-pulse max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      <Skeleton className="h-44 w-full rounded-2xl" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (<Skeleton key={i} className="h-16 w-full rounded-xl" />))}
      </div>
      <Skeleton className="h-10 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    </div>
  );
}

/* ─── Modal backdrop ─── */
export function ModalBackdrop({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl border border-gray-200" onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}

/* ─── Modal header ─── */
export function ModalHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-colors"><X className="h-4 w-4" /></button>
    </div>
  );
}

/* ─── Stat card (quick stats row) ─── */
export function StatCard({ icon: Icon, label, value }: { icon: IconComponent; label: string; value: unknown }) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-200 bg-white py-4 text-center shadow-xs">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700">
        <Icon className="h-4.5 w-4.5" />
      </div>
      <p className="text-base font-extrabold text-gray-900">{String(value ?? "—")}</p>
      <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">{label}</p>
    </div>
  );
}

/* ─── Infra stat (infrastructure tab) ─── */
export function InfraStat({ icon: Icon, label, value }: { icon: IconComponent; label: string; value: unknown }) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-200 bg-white py-4 text-center shadow-xs">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700">
        <Icon className="h-4.5 w-4.5" />
      </div>
      <p className="text-base font-extrabold text-gray-900">{Array.isArray(value) ? value.length : String(value ?? "—")}</p>
      <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">{label}</p>
    </div>
  );
}
