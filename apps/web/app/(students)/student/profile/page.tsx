"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@repo/ui";
import { Button } from "@repo/ui";
import { Badge } from "@repo/ui";
import { Skeleton } from "@repo/ui";
import { useAuth } from "@/hooks/useAuth";
import {
  useStageInfo,
  useMyApplications,
  useDashboardOverview,
  useDashboardActivity,
} from "@/domains/student";
import { useStudentTimeline } from "@/domains/timeline";
import { AddParentSection } from "@/components/parents/add-parent-section";
import { ParentLinksList } from "@/components/parents/parent-links-list";
import { PassportSection } from "@/components/student/passport-section";
import {
  Mail,
  GraduationCap,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  ChevronRight,
  Clock,
  Calendar,
  Phone,
  LifeBuoy,
  FileText,
  CreditCard,
  Plane,
  User,
  Upload,
  Zap,
  BarChart3,
} from "lucide-react";

export default function StudentDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    data: stageInfo,
    isError: stageError,
    refetch: refetchStage,
  } = useStageInfo();
  const { data: timeline, isLoading: timelineLoading } = useStudentTimeline();
  const { data: appsData, isLoading: appsLoading } = useMyApplications();
  const { data: overview, isLoading: overviewLoading } = useDashboardOverview();
  const { data: activity, isLoading: activityLoading } = useDashboardActivity();
  const currentStage = stageInfo?.currentStage ?? 1;
  const applications = appsData?.data ?? [];
  const recentActivity = timeline?.slice(0, 5) ?? [];

  const profile = overview?.profile;
  const approvedCount = applications.filter(
    (a) => a.status === "approved" || a.status === "APPROVED",
  ).length;
  const pendingDocs = overview?.documentStats?.pending ?? 0;
  const deadlines = activity?.upcomingDeadlines ?? [];

  if (stageError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="size-12 text-red-400 mb-4" />
        <h2 className="text-lg font-semibold text-[#2D2154]">
          Failed to load dashboard
        </h2>
        <p className="text-sm text-gray-500 mt-1 mb-6">
          Something went wrong. Please try again.
        </p>
        <Button
          onClick={() => refetchStage()}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className="size-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ─── Grid: 30% Left / 70% Right ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-5 lg:gap-6 items-start">
        {/* ============================================ */}
        {/* LEFT COLUMN — Profile & Status               */}
        {/* ============================================ */}
        <div className="space-y-4">
          {/* 1. Personal Details */}
          <Card className="p-4">
            {overviewLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            ) : profile ? (
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-xl bg-[#4B2D8E] flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-sm shadow-[#4B2D8E]/20">
                  {(profile.name || user?.name || "?")
                    .charAt(0)
                    .toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-semibold text-gray-900 truncate">
                    {profile.name || user?.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {profile.email || user?.email}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-400">No details available</p>
            )}
          </Card>

          {/* 2. Quick Stats */}
          {(overviewLoading || applications.length > 0 || approvedCount > 0 || pendingDocs > 0) && (
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-5 h-5 text-gray-600" />
                <h2 className="font-medium text-gray-900">Overview</h2>
              </div>
              {overviewLoading ? (
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="h-20 rounded-lg" />
                  <Skeleton className="h-20 rounded-lg" />
                  <Skeleton className="h-20 rounded-lg" />
                  <Skeleton className="h-20 rounded-lg" />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#F8F6FC] rounded-lg p-3">
                    <p className="text-xl font-bold text-[#4B2D8E]">
                      {applications.length}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5 font-medium">
                      Applications
                    </p>
                  </div>
                  <div className="bg-emerald-50/70 rounded-lg p-3">
                    <p className="text-xl font-bold text-emerald-600">
                      {approvedCount}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5 font-medium">
                      Approved
                    </p>
                  </div>
                  <div className="bg-amber-50/70 rounded-lg p-3">
                    <p className="text-xl font-bold text-amber-600">
                      {pendingDocs}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5 font-medium">
                      Pending Docs
                    </p>
                  </div>
                  <div className="bg-blue-50/70 rounded-lg p-3">
                    <p className="text-xl font-bold text-blue-600">
                      {currentStage}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5 font-medium">
                      Current Stage
                    </p>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* 3. Add Parent Section */}
          <AddParentSection />

          {/* 4. Parent Links List */}
          <ParentLinksList />

          {/* 5. Important Deadlines */}
          {activityLoading ? (
            <Skeleton className="h-24 rounded-lg" />
          ) : deadlines.length > 0 ? (
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5 text-gray-600" />
                <h2 className="font-medium text-gray-900">Upcoming Deadlines</h2>
              </div>
              <div className="space-y-3">
                {deadlines.map((dl, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="size-2 rounded-full bg-[#F0A030] mt-1.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-900">
                        {dl.title}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {new Date(dl.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      {dl.detail && (
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {dl.detail}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ) : null}

          {/* 6. Need Help */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <LifeBuoy className="w-5 h-5 text-gray-600" />
              <h2 className="font-medium text-gray-900">Need Help?</h2>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              Contact our support team for help with admission, documents,
              or payments.
            </p>
            <div className="space-y-2.5">
              <a
                href="mailto:siksha.sabkaadhikaar@gmail.com"
                className="flex items-center gap-3 text-xs text-gray-600 hover:text-gray-900 transition-colors"
              >
                <div className="size-7 rounded-md bg-gray-50 flex items-center justify-center">
                  <Mail className="size-3.5 text-gray-500" />
                </div>
                <span className="font-medium">
                  siksha.sabkaadhikaar@gmail.com
                </span>
              </a>
              <a
                href="tel:+79184826501"
                className="flex items-center gap-3 text-xs text-gray-600 hover:text-gray-900 transition-colors"
              >
                <div className="size-7 rounded-md bg-gray-50 flex items-center justify-center">
                  <Phone className="size-3.5 text-gray-500" />
                </div>
                <span className="font-medium">+7 918 482-65-01</span>
              </a>
            </div>
          </Card>
        </div>

        {/* ============================================ */}
        {/* RIGHT COLUMN — Dashboard Content              */}
        {/* ============================================ */}
        <div className="space-y-4">
          {/* Stage Progress */}
          <StageProgress
            stage={currentStage}
            status={stageInfo?.applicationStatus ?? "NOT_STARTED"}
          />

          {/* Scholarship Banner — hidden for now */}
          {/* <ScholarshipBanner /> */}

          {/* Stats Bar or Empty State */}
          {overview ? (
            overview.documentStats.total > 0 ||
            overview.paymentStats.totalPaid > 0 ||
            overview.applicationSummary.total > 0 ? (
              <div className="grid grid-cols-4 gap-3">
                <StatCard
                  icon={FileText}
                  label="Documents"
                  value={`${overview.documentStats.approved}/${overview.documentStats.total}`}
                  sub={`${overview.documentStats.approved} approved`}
                  accent="blue"
                />
                <StatCard
                  icon={CreditCard}
                  label="Payments"
                  value={
                    overview.paymentStats.totalPaid > 0
                      ? `₹${(overview.paymentStats.totalPaid / 1000).toFixed(0)}k`
                      : "—"
                  }
                  sub={
                    overview.paymentStats.pendingAmount > 0
                      ? `₹${(overview.paymentStats.pendingAmount / 1000).toFixed(0)}k pending`
                      : overview.paymentStats.totalPaid > 0
                        ? "completed"
                        : "no payments"
                  }
                  accent="emerald"
                />
                <StatCard
                  icon={GraduationCap}
                  label="Applications"
                  value={String(overview.applicationSummary.total)}
                  sub={
                    overview.applicationSummary.total > 0 ? "submitted" : "none"
                  }
                  accent="purple"
                />
                <StatCard
                  icon={Plane}
                  label="Letters"
                  value={`${(overview.lettersAvailability.admissionLetter ? 1 : 0) + (overview.lettersAvailability.invitationLetter ? 1 : 0)}/2`}
                  sub={
                    overview.lettersAvailability.admissionLetter
                      ? "available"
                      : "incomplete"
                  }
                  accent="amber"
                />
              </div>
            ) : (
              <Card className="p-4">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-lg bg-[#F8F6FC] flex items-center justify-center shrink-0">
                    <GraduationCap className="size-5 text-[#4B2D8E]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      Start your admission journey
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Apply to universities, upload documents, and track your
                      progress here.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push("/student/university")}
                    className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-[#4B2D8E] hover:bg-[#3d2473] px-4 py-2 rounded-md transition-colors"
                  >
                    Browse Universities <ArrowRight className="size-3" />
                  </button>
                </div>
              </Card>
            )
          ) : overviewLoading ? (
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-22 rounded-lg" />
              ))}
            </div>
          ) : null}

          {/* Quick Actions */}
          <QuickActionsSection currentStage={currentStage} />

          {/* Required Actions Based on Stage */}
          <RequiredActionsSection
            currentStage={currentStage}
            hasApplications={applications.length > 0}
          />

          {/* My Applications */}
          <ApplicationsSection
            applications={applications}
            appsLoading={appsLoading}
            router={router}
          />

          {/* Passport & Travel */}
          <Card className="p-0 overflow-hidden">
            <PassportSection />
          </Card>

          {/* Recent Activity */}
          <RecentActivitySection
            recentActivity={recentActivity}
            timelineLoading={timelineLoading}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function StageProgress({ stage, status }: { stage: number; status: string }) {
  const names = ["Registration", "Exam", "Admission", "Invitation", "Visa"];
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-900">
            Stage {stage} of 5
          </span>
          <span className="text-[10px] text-gray-400">—</span>
          <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
            {status.replace(/_/g, " ")}
          </span>
        </div>
        <span className="text-[10px] text-gray-400 font-medium">
          {Math.round((stage / 5) * 100)}%
        </span>
      </div>
      <div className="flex gap-1.5">
        {names.map((n, i) => (
          <div key={n} className="flex-1">
            <div
              className={`h-2 rounded-full transition-all ${
                i + 1 <= stage ? "bg-[#4B2D8E]" : "bg-gray-100"
              }`}
            />
            <p
              className={`text-[10px] mt-1.5 text-center font-medium ${
                i + 1 === stage ? "text-[#4B2D8E]" : "text-gray-400"
              }`}
            >
              {n}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ScholarshipBanner() {
  return (
    <div className="p-4 border border-amber-200/50 rounded-xl bg-gradient-to-r from-[#FAF9F6] to-amber-50/50 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="space-y-1.5 text-center sm:text-left">
        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#C4953B] bg-amber-100/60 px-2 py-0.5 rounded">
          Scholarship Alert
        </span>
        <h2 className="text-sm font-bold text-[#1A153A]">
          WCIEC Doing Good Merit Scholarship
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
          Up to <strong className="text-[#1A153A]">$100,000+</strong> total
          funding available. Awarded based on NEET score (&gt;450) and 12th PCB
          marks (&gt;85%).
        </p>
      </div>
      <Link
        href="/student/tickets/new?subject=Scholarship%20Inquiry"
        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider py-2.5 px-5 rounded-xl transition-all duration-150 active:scale-[0.97] bg-[#C4953B] text-[#1A153A] shrink-0 hover:bg-[#b88935]"
      >
        Check Eligibility
        <ArrowRight className="size-3.5" />
      </Link>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: any;
  label: string;
  value: string;
  sub: string;
  accent: "blue" | "emerald" | "purple" | "amber";
}) {
  const accentMap = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    purple: "bg-purple-50 text-purple-600",
    amber: "bg-amber-50 text-amber-600",
  };
  return (
    <Card className="p-3">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2.5 ${accentMap[accent]}`}
      >
        <Icon className="size-4" />
      </div>
      <p className="text-lg font-bold text-gray-900">{value}</p>
      <p className="text-[11px] text-gray-500 mt-0.5">{sub}</p>
    </Card>
  );
}

function QuickActionsSection({ currentStage }: { currentStage: number }) {
  const router = useRouter();
  const actions = [
    {
      icon: User,
      label: "Update Profile",
      desc: "Personal details, address, academic info",
      href: "/student/profile",
      color: "bg-blue-50 text-blue-600",
      always: true,
    },
    {
      icon: Upload,
      label: "Upload Documents",
      desc:
        currentStage === 1
          ? "Aadhaar, PAN, 10th, 12th, NEET, Passport"
          : "Stage-specific documents",
      href: "/student/documents",
      color: "bg-purple-50 text-purple-600",
      always: true,
    },
  ];

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-5 h-5 text-gray-600" />
        <h2 className="font-medium text-gray-900">Quick Actions</h2>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="flex flex-col items-start gap-1.5 p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50/50 transition-all"
          >
            <div
              className={`size-8 rounded-lg ${action.color} flex items-center justify-center`}
            >
              <action.icon className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-900">
                {action.label}
              </p>
              <p className="text-[10px] text-gray-500 mt-0.5 leading-snug">
                {action.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}

function RequiredActionsSection({
  currentStage,
  hasApplications,
}: {
  currentStage: number;
  hasApplications: boolean;
}) {
  const router = useRouter();
  const actions: {
    show: boolean;
    title: string;
    desc: string;
    btn: string;
    href: string;
    primary: boolean;
  }[] = [
    {
      show: currentStage === 1 && hasApplications,
      title: "Complete Your Application",
      desc: "Submit documents to move forward",
      btn: "Continue",
      href: "/student/university",
      primary: true,
    },
    {
      show: currentStage >= 2,
      title:
        currentStage === 2
          ? "Pay Admission Fee (₹5,000)"
          : "View Admission Fee",
      desc:
        currentStage === 2
          ? "Unlock your admission letter"
          : "Payment completed",
      btn: currentStage === 2 ? "Pay Now" : "View",
      href: "/student/payments",
      primary: currentStage === 2,
    },
    {
      show: currentStage === 3,
      title: "Entrance Exam",
      desc: "Check exam details and pay fee",
      btn: "View",
      href: "/student/exams",
      primary: true,
    },
    {
      show: currentStage >= 4,
      title:
        currentStage >= 5 ? "Invitation Letter" : "Download Invitation Letter",
      desc:
        currentStage >= 5 ? "Letter ready for download" : "Pay fee to unlock",
      btn: "View",
      href: "/student/letters",
      primary: false,
    },
    {
      show: currentStage >= 5,
      title: "Visa & Travel",
      desc: "Get visa support and travel guidance",
      btn: "View",
      href: "/student/letters",
      primary: false,
    },
  ];

  const visible = actions.filter((a) => a.show);
  if (visible.length === 0) return null;

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <AlertCircle className="w-5 h-5 text-gray-600" />
        <h2 className="font-medium text-gray-900">Required Actions</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {visible.map((action) => (
          <Card
            key={action.title}
            className={`p-4 ${action.primary ? "border-[#4B2D8E]/20" : "border-gray-200/80"}`}
          >
            <div className="flex items-center justify-between h-full gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-gray-900">
                  {action.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{action.desc}</p>
              </div>
              <Button
                size="sm"
                variant={action.primary ? "default" : "secondary"}
                className={`gap-1 shrink-0 ${
                  action.primary
                    ? "bg-[#4B2D8E] hover:bg-[#3d2473] text-white"
                    : "border-gray-200 text-gray-600"
                }`}
                onClick={() => router.push(action.href)}
              >
                {action.btn} <ArrowRight className="size-3" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
}

function ApplicationsSection({
  applications,
  appsLoading,
  router,
}: {
  applications: any[];
  appsLoading: boolean;
  router: any;
}) {
  if (appsLoading) {
    return (
      <Card className="p-4">
        <div className="space-y-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton
              key={`app-skel-${i}`}
              className="h-14 w-full rounded-lg"
            />
          ))}
        </div>
      </Card>
    );
  }
  if (applications.length === 0) return null;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-600" />
          <h2 className="font-medium text-gray-900">My Applications</h2>
        </div>
        {applications.length > 0 && (
          <Link
            href="/student/applications"
            className="text-xs text-gray-600 font-medium hover:text-gray-900"
          >
            View all
          </Link>
        )}
      </div>
      <div className="space-y-1">
        {[...applications]
          .sort(
            (a, b) =>
              new Date(b.submittedAt).getTime() -
              new Date(a.submittedAt).getTime(),
          )
          .map((app) => (
            <button
              key={app.id}
              type="button"
              className="flex w-full items-center gap-4 rounded-lg p-3 transition-all cursor-pointer text-left border border-gray-100 hover:bg-gray-50/50"
              onClick={() => router.push(`/student/applications/${app.id}`)}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {app.university.name}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {app.selectedProgram ?? "—"}
                </p>
              </div>
              <Badge
                variant={
                  app.status === "approved" || app.status === "APPROVED"
                    ? "default"
                    : app.status === "rejected" || app.status === "REJECTED"
                      ? "destructive"
                      : "secondary"
                }
                className={`shrink-0 text-xs px-2.5 py-0.5 font-medium ${
                  app.status === "approved" || app.status === "APPROVED"
                    ? "bg-emerald-600 text-white"
                    : ""
                }`}
              >
                {app.status}
              </Badge>
              <span className="text-xs text-gray-400 shrink-0 hidden sm:block">
                {new Date(app.submittedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <ChevronRight className="size-4 text-gray-300 shrink-0" />
            </button>
          ))}
      </div>
    </Card>
  );
}

function RecentActivitySection({
  recentActivity,
  timelineLoading,
}: {
  recentActivity: any[];
  timelineLoading: boolean;
}) {
  if (timelineLoading) {
    return <Skeleton className="h-40 w-full rounded-lg" />;
  }
  if (recentActivity.length === 0) return null;

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-5 h-5 text-gray-600" />
        <h2 className="font-medium text-gray-900">Recent Activity</h2>
      </div>
      <div className="space-y-1">
        {recentActivity.map((event) => (
          <div
            key={event.id}
            className="flex items-start gap-4 rounded-lg p-3 hover:bg-gray-50/50 transition-colors border border-gray-100"
          >
            <div className="size-2 rounded-full bg-[#4B2D8E] mt-1.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">
                {event.title}
              </p>
              {event.description && (
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {event.description}
                </p>
              )}
            </div>
            <span className="text-xs text-gray-400 shrink-0 self-start mt-0.5">
              {new Date(event.occurredAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              })}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
