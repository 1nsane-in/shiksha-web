"use client";

import Link from "next/link";
import { Card } from "@repo/ui";
import { Badge } from "@repo/ui";
import { Skeleton } from "@repo/ui";
import { useDashboardOverview, useDashboardActivity, useDashboardNextSteps } from "@/domains/student/student.queries";
import { FileText, CreditCard, GraduationCap, ArrowRight, Bell, Calendar, Plane } from "lucide-react";

export default function StudentDashboardPage() {
  const { data: overview, isLoading: l1 } = useDashboardOverview();
  const { data: activity, isLoading: l2 } = useDashboardActivity();
  const { data: nextSteps, isLoading: l3 } = useDashboardNextSteps();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {l1 ? <Skeleton className="h-8 w-48" /> : `Welcome, ${overview?.profile.name?.split(" ")[0]}`}
          </h1>
          <p className="text-sm text-gray-500 mt-1">Track your admission journey</p>
        </div>
        {activity && activity.unreadNotifications > 0 && (
          <span className="flex items-center gap-1 text-sm text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full">
            <Bell className="w-4 h-4" /> {activity.unreadNotifications} new
          </span>
        )}
      </div>

      {/* Scholarship Banner */}
      <div className="p-5 border rounded-2xl bg-gradient-to-r from-[#FAF9F6] to-amber-50/30 border-amber-200/40 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#C4953B] bg-amber-100/60 px-2 py-0.5 rounded">
            🏆 Scholarship Alert
          </span>
          <h2 className="text-base font-bold text-[#1A153A] mt-1.5">
            WCIEC Doing Good Merit Scholarship Board
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
            Up to <strong>$100,000+</strong> total funding available! Awarded automatically based on your NEET score (&gt;450) and 12th PCB marks (&gt;85%). Waiver values range from $500 to $1,500.
          </p>
        </div>
        <Link
          href="/student/tickets/new?subject=Scholarship%20Inquiry"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider py-2.5 px-4 rounded-xl transition-all duration-150 active:scale-[0.97] bg-[#C4953B] text-[#1A153A] shrink-0"
        >
          Check Eligibility
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {/* Stage Progress */}
      {l1 ? <Skeleton className="h-20 w-full" /> : overview && <StageProgress stage={overview.stage.currentStage} status={overview.stage.applicationStatus} />}

      {/* Next Steps */}
      {l3 ? <Skeleton className="h-32 w-full" /> : nextSteps && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-medium text-gray-900">What to do next</h2>
            <span className="text-sm font-medium text-emerald-600">{nextSteps.completionPercentage}% complete</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
            <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${nextSteps.completionPercentage}%` }} />
          </div>
          <div className="space-y-2">
            {nextSteps.nextActions.filter(a => !a.completed).slice(0, 3).map((action) => (
              <Link key={action.type} href={action.actionUrl} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${action.priority === "high" ? "bg-red-400" : action.priority === "medium" ? "bg-amber-400" : "bg-gray-300"}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{action.title}</p>
                    <p className="text-xs text-gray-500">{action.description}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </Link>
            ))}
          </div>
        </Card>
      )}

      {/* Stats */}
      {l1 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
      ) : overview && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat icon={FileText} label="Documents" value={`${overview.documentStats.approved}/${overview.documentStats.total}`} sub="approved" cls="bg-blue-50 text-blue-600" />
          <Stat icon={CreditCard} label="Paid" value={overview.paymentStats.totalPaid > 0 ? `₹${(overview.paymentStats.totalPaid / 1000).toFixed(0)}k` : "₹0"} sub={overview.paymentStats.pendingAmount > 0 ? `₹${(overview.paymentStats.pendingAmount / 1000).toFixed(0)}k pending` : "all clear"} cls="bg-emerald-50 text-emerald-600" />
          <Stat icon={GraduationCap} label="Applications" value={String(overview.applicationSummary.total)} sub={overview.applicationSummary.total > 0 ? "submitted" : "none yet"} cls="bg-purple-50 text-purple-600" />
          <Stat icon={Plane} label="Letters" value={`${(overview.lettersAvailability.admissionLetter ? 1 : 0) + (overview.lettersAvailability.invitationLetter ? 1 : 0)}/2`} sub="available" cls="bg-amber-50 text-amber-600" />
        </div>
      )}

      {/* Applications List */}
      {overview && overview.applicationSummary.applications.length > 0 && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-medium text-gray-900">My Applications</h2>
            <Link href="/student/applications" className="text-xs text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-2">
            {overview.applicationSummary.applications.map((app) => (
              <div key={app.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div>
                  <p className="text-sm font-medium text-gray-900">{app.university.name}</p>
                  <p className="text-xs text-gray-500">{app.selectedProgram || "General Medicine"}</p>
                </div>
                <Badge variant={app.status === "approved" ? "default" : app.status === "rejected" ? "destructive" : "secondary"}>{app.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Activity + Deadlines */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-5">
          <h2 className="font-medium text-gray-900 mb-3">Recent Activity</h2>
          {l2 ? <Skeleton className="h-24" /> : activity && activity.recentEvents.length > 0 ? (
            <div className="space-y-3">
              {activity.recentEvents.slice(0, 5).map((e) => (
                <div key={e.id} className="flex gap-3 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
                  <div>
                    <p className="text-gray-900">{e.title}</p>
                    <p className="text-xs text-gray-400">{new Date(e.occurredAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-gray-400">No activity yet</p>}
        </Card>

        <Card className="p-5">
          <h2 className="font-medium text-gray-900 mb-3">Upcoming</h2>
          {l2 ? <Skeleton className="h-24" /> : activity && activity.upcomingDeadlines.length > 0 ? (
            <div className="space-y-3">
              {activity.upcomingDeadlines.map((d, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-amber-50">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{d.title}</p>
                    <p className="text-xs text-gray-500">{new Date(d.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-gray-400">No upcoming deadlines</p>}
        </Card>
      </div>
    </div>
  );
}

function StageProgress({ stage, status }: { stage: number; status: string }) {
  const names = ["Registration", "Exam", "Admission", "Invitation", "Visa"];
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-medium text-gray-700">Stage {stage} of 5</h2>
        <Badge variant="secondary" className="text-xs">{status.replace(/_/g, " ")}</Badge>
      </div>
      <div className="flex gap-1">
        {names.map((n, i) => (
          <div key={n} className="flex-1">
            <div className={`h-2 rounded-full ${i + 1 <= stage ? "bg-emerald-500" : "bg-gray-200"}`} />
            <p className={`text-[10px] mt-1 text-center ${i + 1 === stage ? "text-emerald-700 font-medium" : "text-gray-400"}`}>{n}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function Stat({ icon: Icon, label, value, sub, cls }: { icon: any; label: string; value: string; sub: string; cls: string }) {
  return (
    <Card className="p-4">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${cls}`}><Icon className="w-4 h-4" /></div>
      <p className="text-lg font-semibold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{sub}</p>
    </Card>
  );
}
