"use client";

import React, { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText, Upload, CheckCircle2, XCircle, AlertCircle,
  RefreshCw, Inbox, Clock, Eye, Download, RotateCcw
} from "lucide-react";
import { useMyDocuments, useDocumentTypes, useUploadMyDocument, useUploadFile } from "@/domains/documents";
import type { DocumentStatus, DocumentType, StudentDocument } from "@/domains/documents";

const statusConfig: Record<DocumentStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ComponentType<{ className?: string }> }> = {
  UPLOADED: { label: "Pending Review", variant: "secondary", icon: Clock },
  IN_REVIEW: { label: "In Review", variant: "secondary", icon: Clock },
  PROCESSING: { label: "Processing", variant: "secondary", icon: Clock },
  APPROVED: { label: "Approved", variant: "default", icon: CheckCircle2 },
  REJECTED: { label: "Rejected", variant: "destructive", icon: XCircle },
  REUPLOAD_REQUIRED: { label: "Re-upload Required", variant: "destructive", icon: RotateCcw },
};

function DocumentCard({ docType, existingDoc, onUpload, uploading }: { docType: DocumentType; existingDoc?: StudentDocument; onUpload: (typeId: string) => void; uploading: boolean; }) {
  return (
    <Card className={existingDoc?.status === "APPROVED" ? "border-green-200 bg-green-50/30" : ""}>
      <CardContent className="py-5">
        <div className="flex items-start gap-4">
          <div className={`size-12 rounded-lg flex items-center justify-center shrink-0 ${existingDoc?.status === "APPROVED" ? "bg-green-100" : existingDoc?.status === "REJECTED" || existingDoc?.status === "REUPLOAD_REQUIRED" ? "bg-red-100" : "bg-[#4B2D8E]/10"}`}>
            <FileText className={`size-6 ${existingDoc?.status === "APPROVED" ? "text-green-600" : existingDoc?.status === "REJECTED" || existingDoc?.status === "REUPLOAD_REQUIRED" ? "text-red-500" : "text-[#4B2D8E]"}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-[#2D2154]">{docType.name}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{docType.description ?? `Required for Stage ${docType.requiredForStage}`}</p>
            {existingDoc && (() => {
              const info = statusConfig[existingDoc.status];
              return (
                <div className="mt-2 space-y-1">
                  <Badge variant={info.variant as "default" | "secondary" | "destructive" | "outline"} className="text-xs gap-1">
                    {info.icon && <info.icon className="size-3" />}{info.label}
                  </Badge>
                  {existingDoc.remarks && <p className="text-xs text-red-600 mt-1">{existingDoc.remarks}</p>}
                  <p className="text-xs text-gray-400">Uploaded {new Date(existingDoc.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
              );
            })()}
            <div className="flex items-center gap-2 mt-3">
              {(!existingDoc || existingDoc.status === "REJECTED" || existingDoc.status === "REUPLOAD_REQUIRED") && (
                <Button size="sm" className="gap-1.5 text-xs h-8" onClick={() => onUpload(docType.id)} disabled={uploading}>
                  <Upload className="size-3.5" />{uploading ? "Uploading..." : existingDoc ? "Re-upload" : "Upload"}
                </Button>
              )}
              {existingDoc?.fileUrl && (
                <>
                  <Button variant="ghost" size="sm" className="gap-1 text-xs h-8" onClick={() => window.open(existingDoc.fileUrl, "_blank")}>
                    <Eye className="size-3.5" /> View
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-1 text-xs h-8" onClick={() => window.open(existingDoc.fileUrl, "_blank")}>
                    <Download className="size-3.5" /> Download
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Page() {
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingDocTypeId, setPendingDocTypeId] = useState<string | null>(null);

  const { data: myDocs, isLoading: docsLoading, isError: docsError, refetch: refetchDocs } = useMyDocuments();
  const { data: docTypes, isLoading: typesLoading } = useDocumentTypes();
  const uploadFileMutation = useUploadFile();
  const uploadDocMutation = useUploadMyDocument();
  const isLoading = docsLoading || typesLoading;

  const getExistingDoc = (docTypeId: string) => {
    if (!myDocs) return undefined;
    const docsForType = myDocs.filter(d => d.documentTypeId === docTypeId);
    return docsForType.reduce<StudentDocument | undefined>((best, curr) => {
      if (!best) return curr;
      return new Date(curr.createdAt) > new Date(best.createdAt) ? curr : best;
    }, undefined);
  };

  const handleUpload = (documentTypeId: string) => {
    setPendingDocTypeId(documentTypeId);
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !pendingDocTypeId) return;
    setUploadingFor(pendingDocTypeId);
    try {
      const uploadResult = await uploadFileMutation.mutateAsync(file);
      await uploadDocMutation.mutateAsync({
        documentTypeId: pendingDocTypeId,
        fileUrl: uploadResult.url,
        fileName: uploadResult.fileName,
        fileSize: uploadResult.fileSize,
      });
      refetchDocs();
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploadingFor(null);
      setPendingDocTypeId(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (docsError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="size-12 text-red-400 mb-4" />
        <h2 className="text-lg font-semibold text-[#2D2154]">Failed to load documents</h2>
        <p className="text-sm text-gray-500 mt-1 mb-6">Something went wrong. Please try again.</p>
        <Button onClick={() => refetchDocs()} variant="outline" className="gap-2">
          <RefreshCw className="size-4" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#2D2154]">My Documents</h1>
        <p className="text-sm text-gray-500 mt-1">Upload and manage your admission documents</p>
      </div>
      <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,.pdf,.doc,.docx" className="hidden" onChange={handleFileSelected} />
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="py-5">
                <div className="flex items-start gap-4">
                  <Skeleton className="size-12 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-64" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !docTypes || docTypes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Inbox className="size-16 text-[#4B2D8E]/30 mb-4" />
          <h2 className="text-xl font-bold text-[#2D2154]">No document types configured</h2>
          <p className="text-sm text-gray-500 mt-2 max-w-sm">Your required documents will appear here once configured by the admin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {docTypes.map((docType) => (
            <DocumentCard key={docType.id} docType={docType} existingDoc={getExistingDoc(docType.id)} onUpload={handleUpload} uploading={uploadingFor === docType.id} />
          ))}
        </div>
      )}
    </div>
  );
}
