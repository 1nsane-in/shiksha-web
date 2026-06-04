"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { Button } from "@repo/ui";
import { Badge } from "@repo/ui";
import { Skeleton } from "@repo/ui";
import { useAuth } from "@/hooks/useAuth";
import { useStageInfo, useMyApplications, useDashboardOverview, useDashboardActivity } from "@/domains/student";
import { useStudentTimeline } from "@/domains/timeline";
import {
  Mail,
  GraduationCap,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  ChevronRight,
  Clock,
  User,
  BarChart3,
  Calendar,
  LifeBuoy,
  Phone,
} from "lucide-react";
import { PassportSection } from "@/components/student/passport-section";

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
  const latestApp = applications[0];
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
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#2D2154]">
            Welcome{user?.name ? `, ${user.name}` : ""}!
          </h1>
          <p className="text-sm text-gray-500 mt-1.5 font-medium">
            {latestApp
              ? `${latestApp.university.name} — ${latestApp.university.shortName}`
              : "Track your admission progress and complete your journey"}
          </p>
        </div>
        <div className="flex flex-col sm:items-end gap-1 shrink-0">
          <Badge
            variant={
              stageInfo?.applicationStatus === "APPROVED" || stageInfo?.applicationStatus === "approved"
                ? "default"
                : "secondary"
            }
            className={`w-fit text-xs px-3 py-1 font-semibold text-white ${
              stageInfo?.applicationStatus === "approved" || stageInfo?.applicationStatus === "APPROVED"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-[#4B2D8E] hover:bg-[#4B2D8E]/90"
            }`}
          >
            {(stageInfo?.applicationStatus ?? "IN_PROGRESS").toUpperCase()}
          </Badge>
          {latestApp?.selectedProgram && (
            <span className="text-xs text-gray-400 font-semibold mt-1">
              {latestApp.selectedProgram}
            </span>
          )}
        </div>
      </div>

      {/* Grid Layout: 30% Left (Progress), 70% Right (Content) */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8">
        
        {/* Left Column (30%) - Sidebar Widgets */}
        <div className="space-y-4">

          {/* 1. Personal Details */}
          <Card className="border-gray-200/80 shadow-sm bg-white">
            <CardHeader className="border-b border-gray-50 pb-3">
              <CardTitle className="text-sm font-bold text-[#2D2154] flex items-center gap-2">
                <User className="size-4" />
                Personal Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-2">
              {overviewLoading ? (
                <Skeleton className="h-24 w-full rounded-md" />
              ) : profile ? (
                <>
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-50">
                    <div className="size-10 rounded-full bg-[#4B2D8E] flex items-center justify-center text-white font-bold text-sm">
                      {(profile.name || user?.name || "?").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#2D2154] truncate">{profile.name || user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{profile.email || user?.email}</p>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-xs pt-1">
                    {profile.studentId && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Student ID</span>
                        <span className="text-[#2D2154] font-medium">{profile.studentId}</span>
                      </div>
                    )}
                    {profile.phone && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Phone</span>
                        <span className="text-[#2D2154] font-medium">{profile.phone}</span>
                      </div>
                    )}
                    {profile.dob && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">DOB</span>
                        <span className="text-[#2D2154] font-medium">{profile.dob}</span>
                      </div>
                    )}
                    {profile.gender && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Gender</span>
                        <span className="text-[#2D2154] font-medium capitalize">{profile.gender}</span>
                      </div>
                    )}
                    {(profile.city || profile.country) && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Location</span>
                        <span className="text-[#2D2154] font-medium truncate ml-2 text-right">
                          {[profile.city, profile.state, profile.country].filter(Boolean).join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-xs text-gray-400 py-2">No details available</p>
              )}
            </CardContent>
          </Card>

          {/* 2. Quick Stats */}
          <Card className="border-gray-200/80 shadow-sm bg-white">
            <CardHeader className="border-b border-gray-50 pb-3">
              <CardTitle className="text-sm font-bold text-[#2D2154] flex items-center gap-2">
                <BarChart3 className="size-4" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {overviewLoading ? (
                <Skeleton className="h-16 w-full rounded-md" />
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#F8F6FC] rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-[#4B2D8E]">{applications.length}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Applications</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-green-600">{approvedCount}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Approved</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-amber-600">{pendingDocs}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Pending Docs</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-blue-600">{currentStage}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Stage</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 3. Application Summary */}
          <Card className="border-gray-200/80 shadow-sm bg-white">
            <CardHeader className="border-b border-gray-50 pb-3">
              <CardTitle className="text-sm font-bold text-[#2D2154] flex items-center gap-2">
                <GraduationCap className="size-4" />
                Application Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {appsLoading ? (
                <Skeleton className="h-16 w-full rounded-md" />
              ) : applications.length === 0 ? (
                <p className="text-xs text-gray-400 py-2">No applications yet</p>
              ) : (
                <div className="space-y-1.5">
                  {applications.slice(0, 4).map((app) => (
                    <div key={app.id} className="flex items-center justify-between gap-2">
                      <span className="text-xs text-[#2D2154] font-medium truncate">
                        {app.university.shortName}
                      </span>
                      <Badge
                        variant={
                          app.status === "approved" || app.status === "APPROVED"
                            ? "default"
                            : app.status === "rejected" || app.status === "REJECTED"
                              ? "destructive"
                              : "secondary"
                        }
                        className={`shrink-0 text-[10px] px-1.5 py-0 font-medium ${
                          app.status === "approved" || app.status === "APPROVED"
                            ? "bg-green-600 text-white"
                            : ""
                        }`}
                      >
                        {app.status === "approved" || app.status === "APPROVED"
                          ? "Approved"
                          : app.status === "rejected" || app.status === "REJECTED"
                            ? "Rejected"
                            : app.status}
                      </Badge>
                    </div>
                  ))}
                  {applications.length > 4 && (
                    <p className="text-xs text-gray-400 pt-1 text-center">
                      +{applications.length - 4} more
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 4. Important Deadlines */}
          <Card className="border-gray-200/80 shadow-sm bg-white">
            <CardHeader className="border-b border-gray-50 pb-3">
              <CardTitle className="text-sm font-bold text-[#2D2154] flex items-center gap-2">
                <Calendar className="size-4" />
                Important Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {activityLoading ? (
                <Skeleton className="h-12 w-full rounded-md" />
              ) : deadlines.length === 0 ? (
                <p className="text-xs text-gray-400 py-2">No upcoming deadlines</p>
              ) : (
                <div className="space-y-2">
                  {deadlines.map((dl, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="size-2 mt-1.5 rounded-full bg-[#F0A030] shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-[#2D2154]">{dl.title}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          {new Date(dl.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                        {dl.detail && (
                          <p className="text-[10px] text-gray-400 mt-0.5">{dl.detail}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 5. Need Help? */}
          <Card className="border-gray-200/80 shadow-sm bg-white">
            <CardHeader className="border-b border-gray-50 pb-3">
              <CardTitle className="text-sm font-bold text-[#2D2154] flex items-center gap-2">
                <LifeBuoy className="size-4" />
                Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3 text-xs text-gray-600">
                <p>
                  Contact our support team for assistance with your admission process,
                  document queries, or payment issues.
                </p>
                <div className="flex items-center gap-2 text-[#4B2D8E] font-medium">
                  <Mail className="size-3.5 shrink-0" />
                  support@shweb.com
                </div>
                <div className="flex items-center gap-2 text-[#4B2D8E] font-medium">
                  <Phone className="size-3.5 shrink-0" />
                  +91-XXXXXXXXXX
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full mt-1 text-xs border-gray-200 text-gray-600 hover:text-[#4B2D8E]"
                  onClick={() => router.push("/student/contact")}
                >
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Column (70%) - Dashboard Actions and Sections */}
        <div className="space-y-8">
          
          {/* Action Cards Section */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Required Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentStage === 1 && (
                <Card
                  className="border-[#4B2D8E]/20 bg-gradient-to-br from-white to-[#F0A030]/5 hover:shadow-md transition-shadow"
                >
                  <CardContent className="flex items-center justify-between py-5">
                    <div>
                      <h3 className="font-semibold text-[#2D2154] text-sm">
                        Complete Your Application
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Submit documents to move forward
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="gap-1 shrink-0 bg-[#4B2D8E] hover:bg-[#3d2473] text-white"
                      onClick={() => router.push("/student/university")}
                    >
                      Continue <ArrowRight className="size-3" />
                    </Button>
                  </CardContent>
                </Card>
              )}

              {(currentStage === 2 || currentStage > 2) && (
                <Card className="border-gray-200/80 hover:shadow-md transition-shadow">
                  <CardContent className="flex items-center justify-between py-5">
                    <div>
                      <h3 className="font-semibold text-[#2D2154] text-sm">
                        Admission Fee (₹5,000)
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Pay to unlock your admission letter
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant={currentStage === 2 ? "default" : "secondary"}
                      className={`gap-1 shrink-0 ${
                        currentStage === 2 
                          ? "bg-[#4B2D8E] hover:bg-[#3d2473] text-white" 
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                      onClick={() => router.push("/student/payments")}
                    >
                      {currentStage === 2 ? "Pay Now" : "View"}{" "}
                      <ArrowRight className="size-3" />
                    </Button>
                  </CardContent>
                </Card>
              )}

              {currentStage === 3 && (
                <Card
                  className="border-[#4B2D8E]/20 bg-gradient-to-br from-white to-[#F0A030]/5 hover:shadow-md transition-shadow"
                >
                  <CardContent className="flex items-center justify-between py-5">
                    <div>
                      <h3 className="font-semibold text-[#2D2154] text-sm">
                        Entrance Exam
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Check exam details and pay fee
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="gap-1 shrink-0 bg-[#4B2D8E] hover:bg-[#3d2473] text-white"
                      onClick={() => router.push("/student/exams")}
                    >
                      View <ArrowRight className="size-3" />
                    </Button>
                  </CardContent>
                </Card>
              )}

              {currentStage >= 3 && (
                <Card className="border-gray-200/80 hover:shadow-md transition-shadow">
                  <CardContent className="flex items-center justify-between py-5">
                    <div>
                      <h3 className="font-semibold text-[#2D2154] text-sm">
                        Exam Fee (₹10,000)
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Pay to proceed with exam
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant={currentStage === 3 ? "default" : "secondary"}
                      className={`gap-1 shrink-0 ${
                        currentStage === 3 
                          ? "bg-[#4B2D8E] hover:bg-[#3d2473] text-white" 
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                      onClick={() => router.push("/student/payments")}
                    >
                      {currentStage === 3 ? "Pay Now" : "View"}{" "}
                      <ArrowRight className="size-3" />
                    </Button>
                  </CardContent>
                </Card>
              )}

              {currentStage >= 4 && (
                <Card className="border-gray-200/80 hover:shadow-md transition-shadow">
                  <CardContent className="flex items-center justify-between py-5">
                    <div>
                      <h3 className="font-semibold text-[#2D2154] text-sm">
                        Invitation Letter
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Download your invitation letter
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="gap-1 shrink-0 border-gray-200 hover:bg-gray-50"
                      variant="secondary"
                      onClick={() => router.push("/student/letters")}
                    >
                      View <ArrowRight className="size-3" />
                    </Button>
                  </CardContent>
                </Card>
              )}

              {currentStage >= 5 && (
                <Card className="border-gray-200/80 hover:shadow-md transition-shadow">
                  <CardContent className="flex items-center justify-between py-5">
                    <div>
                      <h3 className="font-semibold text-[#2D2154] text-sm">
                        Visa & Travel
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Get visa support and travel guidance
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="gap-1 shrink-0 border-gray-200 hover:bg-gray-50"
                      variant="secondary"
                      onClick={() => router.push("/student/letters")}
                    >
                      View <ArrowRight className="size-3" />
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Applications Section */}
          <Card className="border-gray-200/80 shadow-sm bg-white">
            <CardHeader className="border-b border-gray-50 pb-4">
              <CardTitle className="text-lg font-bold text-[#2D2154]">My Applications</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {appsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <Skeleton key={`app-skel-${i}`} className="h-16 w-full rounded-md" />
                  ))}
                </div>
              ) : applications.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <GraduationCap className="size-10 text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500 mb-4">
                    You haven&apos;t applied to any universities yet.
                  </p>
                  <Button
                    size="sm"
                    onClick={() => router.push("/student/university")}
                    className="gap-1 bg-[#4B2D8E] hover:bg-[#3d2473] text-white"
                  >
                    Browse Universities <ArrowRight className="size-3" />
                  </Button>
                </div>
              ) : (
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
                        className="flex w-full items-center gap-4 rounded-lg p-4 transition-all cursor-pointer text-left border bg-white border-transparent hover:bg-[#F8F6FC]/50 hover:border-gray-100"
                        onClick={() =>
                          router.push(`/student/applications/${app.id}`)
                        }
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#2D2154] truncate">
                            {app.university.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
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
                              ? "bg-green-600 text-white"
                              : ""
                          }`}
                        >
                          {app.status}
                        </Badge>
                        <span className="text-xs text-gray-400 shrink-0">
                          {new Date(app.submittedAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <ChevronRight className="size-4 text-gray-400 shrink-0" />
                      </button>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Passport & Travel Info */}
          <div className="border border-gray-200/80 rounded-lg overflow-hidden bg-white shadow-sm">
            <PassportSection />
          </div>

          {/* Recent Activity Section */}
          <Card className="border-gray-200/80 shadow-sm bg-white">
            <CardHeader className="border-b border-gray-50 pb-4">
              <CardTitle className="text-lg font-bold text-[#2D2154]">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {timelineLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full rounded-md" />
                  ))}
                </div>
              ) : recentActivity.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <Clock className="size-10 text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">No recent activity</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {recentActivity.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start gap-4 rounded-lg p-4 hover:bg-[#F8F6FC] transition-colors border border-transparent"
                    >
                      <div className="size-2 mt-2 rounded-full bg-[#4B2D8E] shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#2D2154]">
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
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
