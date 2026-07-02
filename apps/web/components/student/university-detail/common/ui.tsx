"use client";

import { brand as theme } from "@/lib/brand";
import {
  Check,
  X,
  Globe,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";

/* ─── SectionCard ─── */
export function SectionCard({
  title,
  children,
  isEmpty,
  emptyMessage,
}: {
  title: string;
  children?: React.ReactNode;
  isEmpty?: boolean;
  emptyMessage?: string;
}) {
  return (
    <div
      className="rounded-2xl px-6 py-7 md:px-8"
      style={{
        background: theme.surface,
        border: "1px solid " + theme.hairline,
        position: "relative",
      }}
    >
      <div
        className="absolute left-0 top-0 h-1 w-16 rounded-tl-2xl"
        style={{ background: theme.gold }}
      />
      <h2 className="mb-5 text-lg font-semibold" style={{ color: theme.ink }}>
        {title}
      </h2>
      {isEmpty ? (
        <div className="py-8 text-center">
          <p className="text-sm" style={{ color: theme.inkMuted }}>
            {emptyMessage || "Information not available at this time."}
          </p>
        </div>
      ) : (
        children
      )}
    </div>
  );
}

/* ─── StatBox ─── */
export function StatBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      className="rounded-xl px-4 py-3.5 text-center transition-all duration-200"
      style={{
        background: theme.surface,
        border: "1px solid " + theme.hairline,
      }}
    >
      <div
        className="mx-auto mb-1.5 flex items-center justify-center"
        style={{ color: theme.gold }}
      >
        {icon}
      </div>
      <p
        className="text-lg font-semibold leading-tight"
        style={{ color: theme.ink }}
      >
        {value}
      </p>
      <p className="mt-0.5 text-xs" style={{ color: theme.inkSubtle }}>
        {label}
      </p>
    </div>
  );
}

/* ─── ChipList ─── */
export function ChipList({ items, limit }: { items: string[]; limit?: number }) {
  const show = limit ? items.slice(0, limit) : items;
  const remaining = limit ? items.length - limit : 0;
  return (
    <div className="flex flex-wrap gap-2">
      {show.map((item) => (
        <span
          key={item}
          className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium transition-colors"
          style={{
            background: theme.goldLight,
            color: theme.ink,
            border: "1px solid " + theme.goldBorder,
          }}
        >
          {item}
        </span>
      ))}
      {remaining > 0 && (
        <span
          className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium"
          style={{
            color: theme.inkSubtle,
            background: theme.canvas,
            border: "1px solid " + theme.hairline,
          }}
        >
          +{remaining} more
        </span>
      )}
    </div>
  );
}

/* ─── BoolBadge ─── */
export function BoolBadge({ value }: { value: boolean }) {
  return value ? (
    <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700">
      <Check className="size-3.5" /> Yes
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-sm font-medium text-rose-500">
      <X className="size-3.5" /> No
    </span>
  );
}

/* ─── BoolRow ─── */
export function BoolRow({ label, value }: { label: string; value: boolean }) {
  return (
    <div
      className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm"
      style={{
        background: theme.canvas,
        border: "1px solid " + theme.hairline,
      }}
    >
      <span style={{ color: theme.ink }}>{label}</span>
      <BoolBadge value={value} />
    </div>
  );
}

/* ─── InfoField ─── */
export function InfoField({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p
        className="mb-1 text-xs font-medium uppercase tracking-wider"
        style={{ color: theme.inkSubtle }}
      >
        {label}
      </p>
      <p className="text-sm leading-relaxed" style={{ color: theme.ink }}>
        {value}
      </p>
    </div>
  );
}

/* ─── InfraStat ─── */
export function InfraStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      className="rounded-xl px-3 py-3 text-center"
      style={{
        background: theme.canvas,
        border: "1px solid " + theme.hairline,
      }}
    >
      <div
        className="mx-auto mb-1 flex items-center justify-center"
        style={{ color: theme.gold }}
      >
        {icon}
      </div>
      <p className="text-base font-semibold" style={{ color: theme.ink }}>
        {value}
      </p>
      <p className="text-xs" style={{ color: theme.inkSubtle }}>
        {label}
      </p>
    </div>
  );
}

/* ─── FeeBox ─── */
export function FeeBox({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className="rounded-xl px-4 py-4"
      style={{
        background: highlight ? theme.goldLight : theme.canvas,
        border: "1px solid " + (highlight ? theme.goldBorder : theme.hairline),
      }}
    >
      <p
        className="text-xs font-medium uppercase tracking-wider"
        style={{ color: theme.inkSubtle }}
      >
        {label}
      </p>
      <p
        className="mt-1 text-xl font-bold"
        style={{ color: highlight ? theme.gold : theme.ink }}
      >
        {value}
      </p>
      {sub && (
        <p className="text-xs" style={{ color: theme.inkSubtle }}>
          {sub}
        </p>
      )}
    </div>
  );
}

/* ─── SideInfo ─── */
export function SideInfo({
  icon,
  label,
  value,
  link,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  link?: boolean;
}) {
  return (
    <div className="flex items-start gap-2.5 text-sm">
      <span className="mt-0.5 shrink-0" style={{ color: theme.gold }}>
        {icon}
      </span>
      <div className="min-w-0">
        <p
          className="text-xs font-medium uppercase tracking-wider"
          style={{ color: theme.inkSubtle }}
        >
          {label}
        </p>
        {link ? (
          <a
            href={value.startsWith("http") ? value : `https://${value}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium underline-offset-2 hover:underline"
            style={{ color: theme.ink }}
          >
            {value}
            <Globe className="size-3 shrink-0" style={{ color: theme.gold }} />
          </a>
        ) : (
          <p className="font-medium" style={{ color: theme.ink }}>
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

/* ─── RecogBadge ─── */
export function RecogBadge({ label, value }: { label: string; value: boolean }) {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium"
      style={{
        background: value
          ? "rgba(16, 185, 129, 0.08)"
          : "rgba(239, 68, 68, 0.06)",
        border:
          "1px solid " +
          (value ? "rgba(16, 185, 129, 0.20)" : "rgba(239, 68, 68, 0.12)"),
        color: value ? "#065F46" : "#991B1B",
      }}
    >
      <ShieldCheck className="size-4" />
      {label}
      <span className={value ? "text-emerald-600" : "text-rose-500"}>
        {value ? "✓" : "✗"}
      </span>
    </div>
  );
}

/* ─── SeatBox ─── */
export function SeatBox({
  label,
  value,
  total,
}: {
  label: string;
  value: number;
  total?: number | null;
}) {
  const pct = total && total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div
      className="rounded-xl px-4 py-3 text-center"
      style={{
        background: theme.surface,
        border: "1px solid " + theme.hairline,
      }}
    >
      <p className="text-lg font-bold" style={{ color: theme.ink }}>
        {value}
      </p>
      <p className="text-xs font-medium" style={{ color: theme.inkSubtle }}>
        {label}
      </p>
      {pct > 0 && (
        <div
          className="mt-2 h-1.5 w-full overflow-hidden rounded-full"
          style={{ background: theme.hairline }}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${pct}%`, background: theme.gold }}
          />
        </div>
      )}
    </div>
  );
}
