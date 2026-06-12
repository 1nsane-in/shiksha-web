"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { Button } from "@repo/ui";
import { Input } from "@repo/ui";
import { Label } from "@repo/ui";
import { Badge } from "@repo/ui";
import { Skeleton } from "@repo/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui";
import { Upload, FileText, CheckCircle2, AlertCircle, RefreshCw, Lock, Unlock } from "lucide-react";
import { useUploadAdmissionLetter, useUploadInvitationLetter, useApproveInvitationLetterAccess } from "@/domains/admin";
import { useUploadFile } from "@/domains/documents";

export default function AdminLettersPage() {
  const [tab, setTab] = useState("admission");
  const [admissionAppId, setAdmissionAppId] = useState("");
  const [invitationAppId, setInvitationAppId] = useState("");
  const [approveAppId, setApproveAppId] = useState("");
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingUpload, setPendingUpload] = useState<"admission" | "invitation" | null>(null);

  const uploadAdmissionMutation = useUploadAdmissionLetter();
  const uploadInvitationMutation = useUploadInvitationLetter();
  const approveAccessMutation = useApproveInvitationLetterAccess();
  const uploadFileMutation = useUploadFile();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !pendingUpload) return;

    setUploadStatus("uploading");
    try {
      const folderName = pendingUpload === "admission" ? "admission-letters" : "invitation-letters";
      const uploadResult = await uploadFileMutation.mutateAsync({ file, folder: folderName });
      const appId = pendingUpload === "admission" ? admissionAppId : invitationAppId;
      if (!appId) {
        setUploadStatus("error");
        return;
      }

      if (pendingUpload === "admission") {
        await uploadAdmissionMutation.mutateAsync({
          applicationId: appId,
          fileUrl: uploadResult.url,
          fileName: uploadResult.fileName,
        });
      } else {
        await uploadInvitationMutation.mutateAsync({
          applicationId: appId,
          fileUrl: uploadResult.url,
          fileName: uploadResult.fileName,
        });
      }
      setUploadStatus("success");
      setTimeout(() => setUploadStatus(null), 3000);
    } catch {
      setUploadStatus("error");
    } finally {
      setPendingUpload(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const triggerFileUpload = (type: "admission" | "invitation") => {
    setPendingUpload(type);
    fileInputRef.current?.click();
  };

  const handleApproveAccess = async () => {
    if (!approveAppId) return;
    try {
      await approveAccessMutation.mutateAsync(approveAppId);
      setUploadStatus("approved");
      setTimeout(() => setUploadStatus(null), 3000);
    } catch {
      setUploadStatus("error");
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
      <div>
        <h1 className="text-xl font-bold text-[#2D2154]">Letters Management</h1>
        <p className="text-sm text-gray-500">Upload and manage admission and invitation letters</p>
      </div>

      <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.jpg,.png" className="hidden" onChange={handleFileSelect} />

      {uploadStatus === "success" && (
        <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          <CheckCircle2 className="size-4" /> Letter uploaded successfully
        </div>
      )}
      {uploadStatus === "approved" && (
        <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          <Unlock className="size-4" /> Invitation letter access approved
        </div>
      )}
      {uploadStatus === "error" && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="size-4" /> Operation failed. Please try again.
        </div>
      )}

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="admission">Admission Letter</TabsTrigger>
          <TabsTrigger value="invitation">Invitation Letter</TabsTrigger>
          <TabsTrigger value="approve">Approve Access</TabsTrigger>
        </TabsList>

        <TabsContent value="admission" className="space-y-4 mt-4">
          <Card >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="size-5" /> Upload Admission Letter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Application ID</Label>
                <Input
                  placeholder="Enter application UUID"
                  value={admissionAppId}
                  onChange={(e) => setAdmissionAppId(e.target.value)}
                />
              </div>
              <Button
                className="gap-2"
                onClick={() => triggerFileUpload("admission")}
                disabled={!admissionAppId || uploadStatus === "uploading"}
              >
                <Upload className="size-4" />
                {uploadStatus === "uploading" ? "Uploading..." : "Select & Upload Letter"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invitation" className="space-y-4 mt-4">
          <Card >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="size-5" /> Upload Invitation Letter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Application ID</Label>
                <Input
                  placeholder="Enter application UUID"
                  value={invitationAppId}
                  onChange={(e) => setInvitationAppId(e.target.value)}
                />
              </div>
              <Button
                className="gap-2"
                onClick={() => triggerFileUpload("invitation")}
                disabled={!invitationAppId || uploadStatus === "uploading"}
              >
                <Upload className="size-4" />
                {uploadStatus === "uploading" ? "Uploading..." : "Select & Upload Letter"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approve" className="space-y-4 mt-4">
          <Card >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Unlock className="size-5" /> Approve Invitation Letter Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500">
                This will unlock the invitation letter for the student and advance them to Visa stage.
              </p>
              <div className="space-y-2">
                <Label>Application ID</Label>
                <Input
                  placeholder="Enter application UUID"
                  value={approveAppId}
                  onChange={(e) => setApproveAppId(e.target.value)}
                />
              </div>
              <Button
                className="gap-2"
                onClick={handleApproveAccess}
                disabled={!approveAppId || approveAccessMutation.isPending}
              >
                <Unlock className="size-4" />
                {approveAccessMutation.isPending ? "Approving..." : "Approve Access"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
