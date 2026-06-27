import { Clock, FileText, CheckCircle2, XCircle, CreditCard, GraduationCap, Plane, type LucideIcon } from "lucide-react";

// ── Application Status Configuration ──

export interface StatusConfigItem {
  label: string;
  color: string;
  icon: LucideIcon;
}

export const statusConfig: Record<string, StatusConfigItem> = {
  pending: {
    label: "Pending Review",
    color: "text-yellow-600 bg-yellow-50 border-yellow-200",
    icon: Clock,
  },
  in_review: {
    label: "In Review",
    color: "text-blue-600 bg-blue-50 border-blue-200",
    icon: FileText,
  },
  approved: {
    label: "Approved",
    color: "text-green-600 bg-green-50 border-green-200",
    icon: CheckCircle2,
  },
  rejected: {
    label: "Rejected",
    color: "text-red-600 bg-red-50 border-red-200",
    icon: XCircle,
  },
};

// ── Stage Actions Mapping ──

export interface StageActionItem {
  label: string;
  href: string;
  description: string;
  icon: LucideIcon;
}

export const stageActions: Record<number, StageActionItem> = {
  2: {
    label: "Pay Admission Fee",
    href: "/student/payments",
    description: "Pay ₹5,000 to proceed",
    icon: CreditCard,
  },
  3: {
    label: "View Exam Details",
    href: "/student/exams",
    description: "Check exam schedule & pay ₹10,000",
    icon: GraduationCap,
  },
  4: {
    label: "View Invitation Letter",
    href: "/student/letters",
    description: "Download your invitation letter",
    icon: FileText,
  },
  5: {
    label: "Visa Support",
    href: "/student/visa-support",
    description: "Get visa and travel assistance",
    icon: Plane,
  },
};

// ── Stage Names ──

export const stageNames: Record<number, string> = {
  1: "Application",
  2: "Admission Fee",
  3: "Entrance Exam",
  4: "Invitation Letter",
  5: "Visa Support",
};
