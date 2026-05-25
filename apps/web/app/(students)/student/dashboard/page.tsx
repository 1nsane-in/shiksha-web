"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useStageInfo, useMyApplications } from "@/domains/student";
import { useStudentTimeline } from "@/domains/timeline";
import {
  FileText, Mail, GraduationCap, Plane, IdCard,
  ArrowRight, RefreshCw, AlertCircle, Inbox,
  ChevronRight, Clock, CheckCircle2
} from "lucide-react";
import { motion } from "motion/react";

const stageIcons = [FileText, Mail, GraduationCap, Plane, IdCard];
const stageNames = ["Application", "Admission & Payment", "Entrance Exam", "Invitation Letter", "Visa & Travel"];
const stageDescriptions = [
  "Submit your application and required documents",
  "Review and pay the admission fee to receive your letter",
  "Take the entrance exam and pay the exam fee",
  "Download your invitation letter for visa processing",
  "Get visa support and travel guidance",
];

function StageCircle({
  stage,
  currentStage,
  index,
}: {
  stage: number;
  currentStage: number;
  index: number;
}) {
  const Icon = stageIcons[index];
  const isCompleted = stage < currentStage;
  const isActive = stage === currentStage;
  const isUpcoming = stage > currentStage;

  return (
    <motion.div
      animate={
        isActive
          ? { scale: [1, 1.08, 1], transition: { repeat: Infinity, duration: 2, ease: "easeInOut" } }
          : {}
      }
      className={`relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
        isCompleted
          ? "border-[#F0A030] bg-[#F0A030] text-white"
          : isActive
            ? "border-[#4B2D8E] bg-[#4B2D8E] text-white shadow-lg shadow-[#4B2D8E]/30"
            : "border-gray-300 bg-white text-gray-400"
      }`}
    >
      {isCompleted ? (
        <CheckCircle2 className="size-5" />
      ) : (
        <Icon className="size-4" />
      )}
    </motion.div>
  );
}

function StageConnector({
  stage,
  currentStage,
}: {
  stage: number;
  currentStage: number;
}) {
  const isCompleted = stage < currentStage;
  const isActive = stage === currentStage;

  return (
    <div className="absolute left-5 top-10 flex h-full w-0.5 -translate-x-1/2">
      <div
        className={`h-full w-full transition-all duration-500 ${
          isCompleted
            ? "bg-[#F0A030]"
            : isActive
              ? "bg-gradient-to-b from-[#4B2D8E] to-gray-300"
              : "bg-gray-200"
        }`}
      />
    </div>
  );
}

function TimelineSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="size-10 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-64" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function StudentDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: stageInfo, isLoading: stageLoading, isError: stageError, refetch: refetchStage } = useStageInfo();
  const { data: timeline, isLoading: timelineLoading } = useStudentTimeline();
  const { data: appsData, isLoading: appsLoading } = useMyApplications();

  const currentStage = stageInfo?.currentStage ?? 1;
  const applications = appsData?.data ?? [];
  const hasApplication = applications.length > 0;
  const latestApp = applications[0];
  const recentActivity = timeline?.slice(0, 5) ?? [];

  if (stageError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="size-12 text-red-400 mb-4" />
        <h2 className="text-lg font-semibold text-[#2D2154]">Failed to load dashboard</h2>
        <p className="text-sm text-gray-500 mt-1 mb-6">Something went wrong. Please try again.</p>
        <Button onClick={() => refetchStage()} variant="outline" className="gap-2">
          <RefreshCw className="size-4" />
          Retry
        </Button>
      </div>
    );
  }

  if (!hasApplication && !appsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Inbox className="size-16 text-[#4B2D8E]/30 mb-4" />
        <h2 className="text-xl font-bold text-[#2D2154]">No applications yet</h2>
        <p className="text-sm text-gray-500 mt-2 max-w-sm">
          Browse universities to get started!
        </p>
        <Button className="mt-6 gap-2" onClick={() => router.push("/student/university")}>
          Browse Universities
          <ArrowRight className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#2D2154]">
            Welcome{user?.name ? `, ${user.name}` : ""}!
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {latestApp
              ? `${latestApp.university.name} - ${latestApp.university.shortName}`
              : "Track your admission progress"}
          </p>
        </div>
        <Badge
          variant={stageInfo?.applicationStatus === "APPROVED" ? "default" : "secondary"}
          className="w-fit text-xs px-3 py-1"
        >
          {stageInfo?.applicationStatus ?? "IN_PROGRESS"}
        </Badge>
      </div>

      {/* Vertical Timeline */}
      <Card size="xl">
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          {stageLoading || timelineLoading ? (
            <TimelineSkeleton />
          ) : (
            <div className="space-y-0">
              {stageNames.map((name, i) => {
                const stageNum = i + 1;
                return (
                  <div key={stageNum} className="relative flex gap-4 pb-8 last:pb-0">
                    <div className="flex flex-col items-center">
                      <StageCircle stage={stageNum} currentStage={currentStage} index={i} />
                      {i < stageNames.length - 1 && (
                        <StageConnector stage={stageNum} currentStage={currentStage} />
                      )}
                    </div>
                    <div className="flex-1 pt-1.5">
                      <h3
                        className={`text-sm font-semibold ${
                          stageNum <= currentStage ? "text-[#2D2154]" : "text-gray-400"
                        }`}
                      >
                        {name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">{stageDescriptions[i]}</p>
                      {recentActivity.find((e) => e.stage === stageNum && e.isCompleted) && (
                        <p className="text-xs text-[#F0A030] mt-1 flex items-center gap-1">
                          <CheckCircle2 className="size-3" />
                          Completed
                        </p>
                      )}
                      {stageNum === currentStage && (
                        <p className="text-xs text-[#4B2D8E] mt-1 font-medium">In Progress</p>
                      )}
                    </div>
                    {stageNum < currentStage && (
                      <ChevronRight className="size-4 text-[#F0A030] shrink-0 self-center" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentStage === 1 && (
          <Card size="sm" className="border-[#4B2D8E]/20 bg-gradient-to-br from-white to-[#F0A030]/5">
            <CardContent className="flex items-center justify-between py-5">
              <div>
                <h3 className="font-semibold text-[#2D2154] text-sm">Complete Your Application</h3>
                <p className="text-xs text-gray-500 mt-1">Submit documents to move forward</p>
              </div>
              <Button size="sm" className="gap-1 shrink-0" onClick={() => router.push("/student/university")}>
                Continue <ArrowRight className="size-3" />
              </Button>
            </CardContent>
          </Card>
        )}

        {(currentStage === 2 || currentStage > 2) && (
          <Card size="sm" className="border-[#4B2D8E]/20">
            <CardContent className="flex items-center justify-between py-5">
              <div>
                <h3 className="font-semibold text-[#2D2154] text-sm">Admission Fee (₹5,000)</h3>
                <p className="text-xs text-gray-500 mt-1">Pay to unlock your admission letter</p>
              </div>
              <Button size="sm" variant={currentStage === 2 ? "default" : "secondary"} className="gap-1 shrink-0" onClick={() => router.push("/student/payments")}>
                {currentStage === 2 ? "Pay Now" : "View"} <ArrowRight className="size-3" />
              </Button>
            </CardContent>
          </Card>
        )}

        {currentStage === 3 && (
          <Card size="sm" className="border-[#4B2D8E]/20 bg-gradient-to-br from-white to-[#F0A030]/5">
            <CardContent className="flex items-center justify-between py-5">
              <div>
                <h3 className="font-semibold text-[#2D2154] text-sm">Entrance Exam</h3>
                <p className="text-xs text-gray-500 mt-1">Check exam details and pay fee</p>
              </div>
              <Button size="sm" className="gap-1 shrink-0" onClick={() => router.push("/student/exams")}>
                View <ArrowRight className="size-3" />
              </Button>
            </CardContent>
          </Card>
        )}

        {currentStage >= 3 && (
          <Card size="sm" className="border-[#4B2D8E]/20">
            <CardContent className="flex items-center justify-between py-5">
              <div>
                <h3 className="font-semibold text-[#2D2154] text-sm">Exam Fee (₹10,000)</h3>
                <p className="text-xs text-gray-500 mt-1">Pay to proceed with exam</p>
              </div>
              <Button size="sm" variant={currentStage === 3 ? "default" : "secondary"} className="gap-1 shrink-0" onClick={() => router.push("/student/payments")}>
                {currentStage === 3 ? "Pay Now" : "View"} <ArrowRight className="size-3" />
              </Button>
            </CardContent>
          </Card>
        )}

        {currentStage >= 4 && (
          <Card size="sm" className="border-[#4B2D8E]/20">
            <CardContent className="flex items-center justify-between py-5">
              <div>
                <h3 className="font-semibold text-[#2D2154] text-sm">Invitation Letter</h3>
                <p className="text-xs text-gray-500 mt-1">Download your invitation letter</p>
              </div>
              <Button size="sm" className="gap-1 shrink-0" onClick={() => router.push("/student/letters")}>
                View <ArrowRight className="size-3" />
              </Button>
            </CardContent>
          </Card>
        )}

        {currentStage >= 5 && (
          <Card size="sm" className="border-[#4B2D8E]/20">
            <CardContent className="flex items-center justify-between py-5">
              <div>
                <h3 className="font-semibold text-[#2D2154] text-sm">Visa & Travel</h3>
                <p className="text-xs text-gray-500 mt-1">Get visa support and travel guidance</p>
              </div>
              <Button size="sm" className="gap-1 shrink-0" onClick={() => router.push("/student/letters")}>
                View <ArrowRight className="size-3" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Activity */}
      <Card size="xl">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {timelineLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
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
                  className="flex items-start gap-3 rounded-lg p-3 hover:bg-[#F8F6FC] transition-colors"
                >
                  <div className="size-2 mt-2 rounded-full bg-[#4B2D8E] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#2D2154]">{event.title}</p>
                    {event.description && (
                      <p className="text-xs text-gray-500 mt-0.5">{event.description}</p>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">
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
  );
}
