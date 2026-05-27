"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { useMyApplicationById } from "@/domains/student/student.queries";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Mail,
  MapPin,
  Globe,
  User,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "Pending Review", color: "text-yellow-600 bg-yellow-50 border-yellow-200", icon: Clock },
  approved: { label: "Approved", color: "text-green-600 bg-green-50 border-green-200", icon: CheckCircle2 },
  rejected: { label: "Rejected", color: "text-red-600 bg-red-50 border-red-200", icon: XCircle },
};

export default function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: app, isLoading, error, refetch } = useMyApplicationById(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="size-6 animate-spin text-[#4B2D8E]" />
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-red-600">Application not found</p>
        <Button variant="outline" onClick={() => router.push('/student/applications')}>
          Back to Applications
        </Button>
      </div>
    );
  }

  const status = statusConfig[app.status] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.push('/student/applications')}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-[#2D2154]">Application Details</h1>
          <p className="text-sm text-[#6B6B6B]">Submitted on {new Date(app.submittedAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium mb-6 ${status.color}`}>
        <StatusIcon className="size-4" />
        {status.label}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="size-4 text-[#F0A030]" />
              University
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-[#6B6B6B]">Name</p>
              <p className="font-medium text-[#2D2154]">{app.university?.name}</p>
            </div>
            {app.university?.location && (
              <div>
                <p className="text-[#6B6B6B]">Location</p>
                <p className="font-medium text-[#2D2154]">
                  {[app.university.location.city, app.university.location.country].filter(Boolean).join(', ')}
                </p>
              </div>
            )}
            <div>
              <p className="text-[#6B6B6B]">Program</p>
              <p className="font-medium text-[#2D2154]">{app.selectedProgram || 'Not specified'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="size-4 text-[#F0A030]" />
              Applicant
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-[#6B6B6B]">Name</p>
              <p className="font-medium text-[#2D2154]">{app.firstName} {app.lastName}</p>
            </div>
            <div>
              <p className="text-[#6B6B6B]">Email</p>
              <p className="font-medium text-[#2D2154]">{app.email}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
