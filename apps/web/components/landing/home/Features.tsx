"use client";

import { brand } from "@/lib/brand";
import {
  LayoutDashboard,
  FileText,
  GitBranch,
  CreditCard,
  ShieldCheck,
  Bell,
  Users,
  Mail,
} from "lucide-react";

const features = [
  {
    icon: LayoutDashboard,
    title: "Student Dashboard",
    desc: "Every admission activity, one place. See your stage, pending items, deadlines — at a glance.",
  },
  {
    icon: FileText,
    title: "Document Management",
    desc: "Upload, track, and review documents in a secure vault. Re-upload if rejected. All metadata stored.",
  },
  {
    icon: GitBranch,
    title: "Stage-wise Tracking",
    desc: "From application to visa — each stage unlocks only when the previous is approved. No guesswork.",
  },
  {
    icon: CreditCard,
    title: "Payment Milestones",
    desc: "Clear payment schedule with stage-linked milestones. Confirmed via Razorpay webhooks, not just frontend.",
  },
  {
    icon: ShieldCheck,
    title: "Admin Review Flow",
    desc: "Every document and application verified by Shiksha admins. Transparent feedback and remarks.",
  },
  {
    icon: Bell,
    title: "Real-time Notifications",
    desc: "Instant alerts for status changes, document approvals, payment confirmations, and new remarks.",
  },
  {
    icon: Users,
    title: "Multi-user Access",
    desc: "Students, parents, agents, and admins — each with role-based views. Everyone stays in sync.",
  },
  {
    icon: Mail,
    title: "Letters & Communication",
    desc: "Admission letters, invitation letters, and visa support documents — all accessible from your dashboard.",
  },
];

export function Features() {
  return (
    <section className="py-20 sm:py-28" style={{ background: brand.canvas }}>
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em]"
            style={{ background: brand.goldLight, color: brand.gold }}
          >
            The Platform
          </span>
          <h2
            className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-4 leading-[1.15]"
            style={{ color: brand.ink }}
          >
            Everything you need,
            <br />
            <span style={{ color: brand.gold }}>tracked and transparent.</span>
          </h2>
          <p
            className="mt-4 text-sm sm:text-base leading-relaxed max-w-xl"
            style={{ color: brand.inkMuted }}
          >
            Our platform gives students, parents, and admins a single source of truth for the entire
            admission journey — from document upload to visa support.
          </p>
        </div>

        {/* Feature grid — left-aligned, no cards, no numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title}>
                <div
                  className="flex size-10 items-center justify-center rounded-lg mb-4"
                  style={{ background: brand.goldLight }}
                >
                  <Icon className="size-5" style={{ color: brand.gold }} />
                </div>
                <h3
                  className="text-sm font-extrabold leading-snug mb-1.5"
                  style={{ color: brand.ink }}
                >
                  {f.title}
                </h3>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: brand.inkMuted }}
                >
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
