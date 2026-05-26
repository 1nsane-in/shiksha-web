"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApplication, useUpdateApplicationStatus } from "@/domains/applications/applications.queries";
import {
  ArrowLeft,
  Building2,
  User,
  Mail,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  FileText,
  Calendar,
  MapPin,
  Globe,
  CreditCard,
  MessageSquare,
  History,
} from "lucide-react";

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "Pending Review", color: "text-yellow-600 bg-yellow-50 border-yellow-200", icon: Clock },
  approved: { label: "Approved", color: "text-green-600 bg-green-50 border-green-200", icon: CheckCircle2 },
  rejected: { label: "Rejected", color: "text-red-600 bg-red-50 border-red-200", icon: XCircle },
};

export default function AdminApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: app, isLoading, error, refetch } = useApplication(id);
  const updateStatus = useUpdateApplicationStatus();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-destructive">Application not found</p>
        <Button variant="outline" onClick={() => router.push('/admin/applications')}>Back to Applications</Button>
      </div>
    );
  }

  const status = statusConfig[app.status] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push('/admin/applications')}>
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Application Details</h1>
            <p className="text-sm text-muted-foreground">ID: {id.slice(0, 8)}...</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-medium ${status.color}`}>
            <StatusIcon className="size-4" />
            {status.label}
          </span>
          {app.status === 'pending' && (
            <>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => updateStatus.mutate({ id, status: "approved" })}
                disabled={updateStatus.isPending}
              >
                <CheckCircle2 className="size-4 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => updateStatus.mutate({ id, status: "rejected" })}
                disabled={updateStatus.isPending}
              >
                <XCircle className="size-4 mr-1" />
                Reject
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="size-4 text-[#F0A030]" />
              Applicant
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-muted-foreground text-xs">First Name</p>
                <p className="font-medium">{app.firstName}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Last Name</p>
                <p className="font-medium">{app.lastName}</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground text-xs">Email</p>
                <p className="font-medium">{app.email}</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground text-xs">Student</p>
                <p className="font-medium">{app.student?.user?.name || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="size-4 text-[#F0A030]" />
              University & Program
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">University</p>
              <p className="font-medium">{app.university?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Program</p>
              <p className="font-medium">{app.selectedProgram || 'N/A'}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Submitted</p>
              <p className="font-medium">{app.submittedAt ? new Date(app.submittedAt).toLocaleString() : 'N/A'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
