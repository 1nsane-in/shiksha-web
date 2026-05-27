"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { Button } from "@repo/ui";
import { Badge } from "@repo/ui";
import { Skeleton } from "@repo/ui";
import { useMyAdmissionLetter, useMyInvitationLetter } from "@/domains/letters";
import {
  FileText, Download, Lock, CheckCircle2, Eye,
  RefreshCw, AlertCircle, Inbox
} from "lucide-react";

function LetterCard({
  letter,
  label,
  isInvitation,
  isLoading,
}: {
  letter: { fileUrl?: string; fileName?: string; viewCount?: number; downloadCount?: number; isDownloadable?: boolean; uploadedAt?: string } | undefined;
  label: string;
  isInvitation?: boolean;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <Card size="sm">
        <CardContent className="py-6">
          <div className="flex items-start gap-4">
            <Skeleton className="size-12 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-8 w-28" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!letter?.fileUrl) {
    return (
      <Card size="sm" className="opacity-70">
        <CardContent className="py-6">
          <div className="flex items-start gap-4">
            <div className="size-12 rounded-lg bg-gray-100 flex items-center justify-center">
              {isInvitation ? (
                <Lock className="size-6 text-gray-400" />
              ) : (
                <FileText className="size-6 text-gray-400" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[#2D2154]">{label}</h3>
              <Badge variant="outline" className="mt-1 text-xs">
                {isInvitation ? "Locked" : "Not yet available"}
              </Badge>
              <p className="text-xs text-gray-400 mt-2">
                {isInvitation
                  ? "Complete all previous stages to unlock"
                  : "Will be available after admission review"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card size="sm">
      <CardContent className="py-6">
        <div className="flex items-start gap-4">
          <div className="size-12 rounded-lg bg-[#4B2D8E]/10 flex items-center justify-center shrink-0">
            <FileText className="size-6 text-[#4B2D8E]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-[#2D2154]">{label}</h3>
            <p className="text-xs text-gray-500 truncate mt-0.5">
              {letter.fileName ?? "Document"}
            </p>
            {letter.uploadedAt && (
              <p className="text-xs text-gray-400 mt-1">
                Uploaded {new Date(letter.uploadedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            )}
            {isInvitation && letter.isDownloadable && (
              <Badge variant="default" className="mt-2 text-xs bg-green-100 text-green-700 hover:bg-green-100 gap-1">
                <CheckCircle2 className="size-3" />
                Ready to download
              </Badge>
            )}
            <div className="flex items-center gap-4 mt-3">
              <Button
                size="sm"
                className="gap-1.5 text-xs h-8"
                onClick={() => window.open(letter.fileUrl, "_blank")}
              >
                <Eye className="size-3.5" />
                View Letter
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-xs h-8"
                onClick={() => window.open(letter.fileUrl, "_blank")}
              >
                <Download className="size-3.5" />
                Download
              </Button>
            </div>
            <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Eye className="size-3" />
                {letter.viewCount ?? 0} views
              </span>
              <span className="flex items-center gap-1">
                <Download className="size-3" />
                {letter.downloadCount ?? 0} downloads
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LettersPage() {
  const { data: admissionLetter, isLoading: admissionLoading, isError: admissionError, refetch: refetchAdmission } = useMyAdmissionLetter();
  const { data: invitationLetter, isLoading: invitationLoading, isError: invitationError, refetch: refetchInvitation } = useMyInvitationLetter();

  const isLoading = admissionLoading && invitationLoading;
  const hasError = admissionError && invitationError;

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="size-12 text-red-400 mb-4" />
        <h2 className="text-lg font-semibold text-[#2D2154]">Failed to load letters</h2>
        <p className="text-sm text-gray-500 mt-1 mb-6">Something went wrong. Please try again.</p>
        <Button onClick={() => { refetchAdmission(); refetchInvitation(); }} variant="outline" className="gap-2">
          <RefreshCw className="size-4" />
          Retry
        </Button>
      </div>
    );
  }

  if (!isLoading && !admissionLetter && !invitationLetter) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Inbox className="size-16 text-[#4B2D8E]/30 mb-4" />
        <h2 className="text-xl font-bold text-[#2D2154]">No letters yet</h2>
        <p className="text-sm text-gray-500 mt-2 max-w-sm">
          Your admission and invitation letters will appear here once available.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#2D2154]">My Letters</h1>
        <p className="text-sm text-gray-500 mt-1">Access your admission and invitation documents</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LetterCard
          letter={admissionLetter}
          label="Admission Letter"
          isLoading={admissionLoading}
        />
        <LetterCard
          letter={invitationLetter}
          label="Invitation Letter"
          isInvitation
          isLoading={invitationLoading}
        />
      </div>
    </div>
  );
}

