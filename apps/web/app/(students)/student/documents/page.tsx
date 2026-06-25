"use client";

import React, { useState, useRef, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { Button } from "@repo/ui";
import { Badge } from "@repo/ui";
import { Skeleton } from "@repo/ui";
import {
  FileText, Upload, CheckCircle2, XCircle, AlertCircle,
  RefreshCw, Clock, Eye, RotateCcw,
  IdCard, GraduationCap, Plane,
  File, FileUp,
} from "lucide-react";
import { useMyDocuments, useDocumentTypes, useUploadMyDocument, useUploadFile } from "@/domains/documents";
import type { DocumentStatus, DocumentType, StudentDocument } from "@/domains/documents";

/* ─── Constants ─── */

const statusConfig: Record<DocumentStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ComponentType<{ className?: string }> }> = {
  UPLOADED: { label: "Pending", variant: "secondary", icon: Clock },
  IN_REVIEW: { label: "In review", variant: "secondary", icon: Clock },
  PROCESSING: { label: "Processing", variant: "secondary", icon: Clock },
  APPROVED: { label: "Approved", variant: "default", icon: CheckCircle2 },
  REJECTED: { label: "Rejected", variant: "destructive", icon: XCircle },
  REUPLOAD_REQUIRED: { label: "Re-upload needed", variant: "destructive", icon: RotateCcw },
};

const ACCEPTED_TYPES = ".jpg,.jpeg,.png,.pdf,.doc,.docx";
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/* ─── Helpers ─── */

function groupKey(code: string) { return code.replace(/-(front|back)$/, ""); }

function sideLabel(code: string) {
  if (code.endsWith("-front")) return "Front";
  if (code.endsWith("-back")) return "Back";
  return null;
}

function groupIcon(key: string) {
  if (key === "aadhaar" || key === "pan") return IdCard;
  if (key === "tenth" || key === "twelfth" || key === "neet") return GraduationCap;
  if (key === "passport") return Plane;
  return FileText;
}

function groupTitle(key: string) {
  switch (key) {
    case "aadhaar": return "Aadhaar Card";
    case "pan": return "PAN Card";
    case "tenth": return "10th Marksheet";
    case "twelfth": return "12th Marksheet";
    case "neet": return "NEET Scorecard";
    case "passport": return "Passport";
    default: return key;
  }
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ─── ProgressRing ─── */

function ProgressRing({ approved, total }: { approved: number; total: number }) {
  const percentage = total > 0 ? Math.round((approved / total) * 100) : 0;
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference - (percentage / 100) * circumference;
  const [offset, setOffset] = useState(circumference);
  const [visible, setVisible] = useState(false);

  React.useEffect(() => {
    const raf = requestAnimationFrame(() => { setOffset(targetOffset); setVisible(true); });
    return () => cancelAnimationFrame(raf);
  }, [targetOffset]);

  const done = percentage === 100;

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 transition-all duration-600 ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
      <svg width="80" height="80" className="-rotate-90" aria-label={`${percentage}% complete`}>
        <circle cx="40" cy="40" r={radius} fill="none" stroke="currentColor" strokeWidth="5" className="text-stone-100" />
        <circle cx="40" cy="40" r={radius} fill="none" stroke="currentColor" strokeWidth="5"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          className={`transition-[stroke-dashoffset] duration-1000 ease-out ${done ? "text-emerald-400" : "text-[#4B2D8E]"}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-base font-bold leading-none ${done ? "text-emerald-600" : "text-stone-800"}`}>
          {percentage}%
        </span>
        <span className="text-[10px] text-stone-400 leading-none mt-1">{approved}/{total}</span>
      </div>
    </div>
  );
}

/* ─── SideDropzone ─── */

function SideDropzone({
  label,
  docType,
  existingDoc,
  onUpload,
  uploading,
}: {
  label: string;
  docType: DocumentType;
  existingDoc?: StudentDocument;
  onUpload: (typeId: string, file: File) => Promise<void>;
  uploading: boolean;
}) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isApproved = existingDoc?.status === "APPROVED";

  const validateFile = useCallback((file: File) => {
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ACCEPTED_TYPES.includes(ext)) { setError("Supported: JPG, PNG, PDF, DOC, DOCX"); return false; }
    if (file.size > MAX_FILE_SIZE) { setError(`File too large (${formatFileSize(file.size)}). Max 10 MB`); return false; }
    setError(null);
    return true;
  }, []);

  const handleFile = useCallback((file: File) => {
    if (validateFile(file)) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const url = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
      setPreviewUrl(url);
      setSelectedFile(file);
    }
  }, [validateFile, previewUrl]);

  React.useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  const handleSubmit = useCallback(async () => {
    if (!selectedFile) return;
    await onUpload(docType.id, selectedFile);
    setSelectedFile(null);
    if (previewUrl) { URL.revokeObjectURL(previewUrl); setPreviewUrl(null); }
    setError(null);
  }, [selectedFile, onUpload, docType.id, previewUrl]);

  const handleRemove = useCallback(() => {
    setSelectedFile(null);
    if (previewUrl) { URL.revokeObjectURL(previewUrl); setPreviewUrl(null); }
    setError(null);
  }, [previewUrl]);

  const handleChangeFile = useCallback(() => {
    setSelectedFile(null);
    if (previewUrl) { URL.revokeObjectURL(previewUrl); setPreviewUrl(null); }
    setError(null);
    setTimeout(() => inputRef.current?.click(), 0);
  }, [previewUrl]);

  const StatusIcon = existingDoc ? statusConfig[existingDoc.status].icon : null;

  // ── Approved state ──
  if (isApproved) {
    return (
      <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-emerald-50 border border-emerald-100">
        <div className="flex items-center gap-2.5 min-w-0">
          <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-stone-800">{label}</p>
            {existingDoc && (
              <p className="text-xs text-stone-400 truncate">
                Uploaded {new Date(existingDoc.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            )}
          </div>
        </div>
        <Badge variant="default" className="text-[10px] gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 shrink-0">
          <CheckCircle2 className="size-3" />Approved
        </Badge>
      </div>
    );
  }

  // ── Not approved ──
  const showRejected = existingDoc && (existingDoc.status === "REJECTED" || existingDoc.status === "REUPLOAD_REQUIRED");

  return (
    <div className="pt-2.5 space-y-2">
      {/* Heading row */}
      <div className="flex items-center justify-between min-h-[28px]">
        <p className="text-sm font-medium text-stone-800">{label}</p>
        <div className="flex items-center gap-1.5 shrink-0">
          {existingDoc && StatusIcon && (
            <Badge variant={statusConfig[existingDoc.status].variant} className="text-[10px] gap-1 px-2 py-0.5">
              <StatusIcon className="size-3" />{statusConfig[existingDoc.status].label}
            </Badge>
          )}
          {existingDoc?.fileUrl && (
            <Button variant="ghost" size="icon-xs" onClick={() => window.open(existingDoc!.fileUrl, "_blank")} title="View file" className="size-7 text-stone-400 hover:text-stone-600">
              <Eye className="size-3.5" />
            </Button>
          )}
        </div>
      </div>

      {showRejected && existingDoc?.remarks && (
        <p className="text-xs text-red-500 flex items-center gap-1.5">
          <AlertCircle className="size-3 shrink-0" />{existingDoc.remarks}
        </p>
      )}

      {/* Dropzone */}
      {!selectedFile ? (
        <div
          onDrop={(e) => { e.preventDefault(); setDragActive(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-1.5 px-4 py-4 rounded-lg border-2 border-dashed cursor-pointer transition-all duration-200 ${
            dragActive ? "border-[#4B2D8E] bg-[#4B2D8E]/5" : "border-stone-200 hover:border-stone-300 hover:bg-stone-50/60"
          }`}
        >
          <div className={`size-9 rounded-lg flex items-center justify-center transition-colors ${dragActive ? "bg-[#4B2D8E]/10" : "bg-stone-100"}`}>
            <FileUp className={`size-4.5 transition-colors ${dragActive ? "text-[#4B2D8E]" : "text-stone-400"}`} />
          </div>
          <p className="text-sm text-stone-500">{dragActive ? "Drop file" : "Choose file or drag here"}</p>
          <p className="text-xs text-stone-400">PDF, JPG, PNG, DOC, DOCX &middot; up to 10 MB</p>
          {error && (
            <div className="flex items-center gap-1 text-xs text-red-500 mt-1"><AlertCircle className="size-3.5 shrink-0" /><span>{error}</span></div>
          )}
          <input ref={inputRef} type="file" accept={ACCEPTED_TYPES} className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </div>
      ) : (
        // File preview
        <div className="rounded-lg border border-stone-200 bg-white overflow-hidden">
          {previewUrl && (
            <div className="relative bg-stone-50 flex items-center justify-center max-h-48 overflow-hidden border-b border-stone-100">
              <img src={previewUrl} alt={selectedFile.name} className="max-h-48 w-full object-contain" />
            </div>
          )}
          <div className="p-3.5">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg flex items-center justify-center shrink-0 bg-stone-100 overflow-hidden">
                {previewUrl ? (
                  <img src={previewUrl} alt="" className="size-10 object-cover" />
                ) : (
                  <File className="size-5 text-[#4B2D8E]" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-stone-800 truncate">{selectedFile.name}</p>
                <p className="text-xs text-stone-400 mt-px">{formatFileSize(selectedFile.size)}</p>
              </div>
              <button type="button" onClick={handleChangeFile} className="text-xs text-[#4B2D8E] hover:underline shrink-0">Change</button>
            </div>
            {error && <div className="flex items-center gap-1 text-xs text-red-500 mt-2 pt-2 border-t border-stone-100"><AlertCircle className="size-3.5" /><span>{error}</span></div>}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
              <Button variant="ghost" size="xs" onClick={handleRemove} className="text-stone-400 hover:text-red-500 hover:bg-red-50 gap-1.5">
                <XCircle className="size-3.5" />Remove
              </Button>
              <Button size="xs" disabled={uploading || !!error} onClick={handleSubmit}>
                {uploading ? <><RefreshCw className="size-3 animate-spin" /> Uploading...</> : <><Upload className="size-3" /> Upload</>}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── EmptyDocumentsState ─── */

function EmptyDocumentsState() {
  return (
    <div className="flex flex-col items-center justify-center py-28 text-center">
      <div className="mb-6 size-24 rounded-2xl bg-[#4B2D8E]/5 flex items-center justify-center ring-1 ring-[#4B2D8E]/10">
        <div className="size-12 rounded-xl bg-[#4B2D8E]/10 flex items-center justify-center">
          <FileText className="size-6 text-[#4B2D8E]/50" />
        </div>
      </div>
      <h2 className="text-xl font-semibold text-stone-800 tracking-tight">No documents required</h2>
      <p className="text-sm text-stone-400 mt-2 max-w-sm leading-relaxed">
        Required documents will appear here once your admission stage is configured.
      </p>
    </div>
  );
}

/* ─── DocumentGroup ─── */

function DocumentGroup({
  groupKey: gKey,
  docTypes,
  existingDocs,
  onDropzoneUpload,
  uploadingFor,
}: {
  groupKey: string;
  docTypes: DocumentType[];
  existingDocs: Map<string, StudentDocument | undefined>;
  onDropzoneUpload: (typeId: string, file: File) => Promise<void>;
  uploadingFor: string | null;
}) {
  const Icon = groupIcon(gKey);
  const title = groupTitle(gKey);
  const allApproved = docTypes.every((dt) => existingDocs.get(dt.id)?.status === "APPROVED");
  const anyRejected = docTypes.some((dt) => {
    const s = existingDocs.get(dt.id)?.status;
    return s === "REJECTED" || s === "REUPLOAD_REQUIRED";
  });
  const anyUploaded = docTypes.some((dt) => existingDocs.get(dt.id));
  const approvedCount = docTypes.filter((dt) => existingDocs.get(dt.id)?.status === "APPROVED").length;

  const sides = docTypes.map((dt) => ({
    dt, side: sideLabel(dt.code), existingDoc: existingDocs.get(dt.id),
  }));

  const iconBg = allApproved ? "bg-emerald-100 text-emerald-600" :
    anyRejected ? "bg-red-100 text-red-500" :
    anyUploaded ? "bg-[#4B2D8E]/10 text-[#4B2D8E]" :
    "bg-stone-100 text-stone-400";

  const statusLabel = allApproved ? "Complete" :
    anyRejected ? "Needs attention" :
    anyUploaded ? `Uploaded` :
    `Pending`;

  const statusColor = allApproved ? "text-emerald-600" :
    anyRejected ? "text-red-500" :
    "text-stone-400";

  return (
    <Card className="border-stone-200 shadow-sm transition-all duration-200 hover:shadow-md p-6">
      <CardHeader className="p-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${iconBg}`}>
            <Icon className="size-5" />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-sm font-semibold text-stone-900">{title}</CardTitle>
            <p className={`text-xs mt-0.5 ${statusColor}`}>
              {statusLabel}{!allApproved && ` (${approvedCount}/${docTypes.length})`}
            </p>
          </div>
        </div>
        {anyUploaded && !allApproved && (
          <span className="size-2 rounded-full bg-amber-400 shrink-0" />
        )}
      </CardHeader>
      <CardContent className={`p-0 ${sides.length === 2 ? "grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0" : "space-y-0"}`}>
        {sides.map(({ dt, side, existingDoc }) => (
          <SideDropzone
            key={dt.id}
            label={side ?? dt.name}
            docType={dt}
            existingDoc={existingDoc}
            onUpload={onDropzoneUpload}
            uploading={uploadingFor === dt.id}
          />
        ))}
      </CardContent>
    </Card>
  );
}

/* ─── Page ─── */

export default function Page() {
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);

  const { data: myDocs, isLoading: docsLoading, isError: docsError, refetch: refetchDocs } = useMyDocuments();
  const { data: docTypes, isLoading: typesLoading } = useDocumentTypes();
  const uploadFileMutation = useUploadFile();
  const uploadDocMutation = useUploadMyDocument();
  const isLoading = docsLoading || typesLoading;

  const groups = useMemo(() => {
    if (!docTypes) return [];
    const map = new Map<string, DocumentType[]>();
    for (const dt of docTypes) {
      const key = groupKey(dt.code);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(dt);
    }
    const order = ["aadhaar", "pan", "tenth", "twelfth", "neet", "passport"];
    return order.filter((k) => map.has(k)).map((k) => ({ key: k, types: map.get(k)! }));
  }, [docTypes]);

  const existingMap = useMemo(() => {
    const map = new Map<string, StudentDocument | undefined>();
    if (!myDocs) return map;
    for (const doc of myDocs) {
      const existing = map.get(doc.documentTypeId);
      if (!existing || new Date(doc.createdAt) > new Date(existing.createdAt)) {
        map.set(doc.documentTypeId, doc);
      }
    }
    return map;
  }, [myDocs]);

  const totalDocs = useMemo(() => groups.reduce((s, g) => s + g.types.length, 0), [groups]);
  const approvedCount = useMemo(() => { let c=0; for (const g of groups) for (const dt of g.types) if (existingMap.get(dt.id)?.status==="APPROVED") c++; return c; }, [groups, existingMap]);
  const pendingCount = useMemo(() => { let c=0; for (const g of groups) for (const dt of g.types) { const s=existingMap.get(dt.id)?.status; if (s && s!=="APPROVED" && s!=="REJECTED" && s!=="REUPLOAD_REQUIRED") c++; } return c; }, [groups, existingMap]);
  const missingCount = useMemo(() => { let c=0; for (const g of groups) for (const dt of g.types) if (!existingMap.get(dt.id)) c++; return c; }, [groups, existingMap]);
  const rejectedCount = useMemo(() => { let c=0; for (const g of groups) for (const dt of g.types) { const s=existingMap.get(dt.id)?.status; if (s==="REJECTED"||s==="REUPLOAD_REQUIRED") c++; } return c; }, [groups, existingMap]);

  const handleDropzoneUpload = useCallback(async (typeId: string, file: File) => {
    setUploadingFor(typeId);
    try {
      const result = await uploadFileMutation.mutateAsync(file);
      await uploadDocMutation.mutateAsync({
        documentTypeId: typeId,
        fileUrl: result.url,
        fileName: result.fileName,
        fileSize: result.fileSize,
      });
      await refetchDocs();
    } catch (err) {
      console.error("Upload failed:", err);
      throw err;
    } finally {
      setUploadingFor(null);
    }
  }, [uploadFileMutation, uploadDocMutation, refetchDocs]);

  return (
    <div className="space-y-6">
      {/* Error state */}
      {docsError && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <AlertCircle className="size-12 text-red-400 mb-4" />
          <h2 className="text-lg font-semibold text-stone-800">Failed to load documents</h2>
          <p className="text-sm text-stone-500 mt-1 mb-6">Something went wrong. Try again.</p>
          <Button onClick={() => refetchDocs()} variant="outline" className="gap-2"><RefreshCw className="size-4" /> Retry</Button>
        </div>
      )}

      {/* Loading state */}
      {isLoading && !docsError && (
        <div className="space-y-5">
          <Card className="border-stone-200 shadow-sm"><CardContent className="p-5">
            <div className="flex items-center gap-5">
              <Skeleton className="size-20 rounded-full shrink-0" />
              <div className="flex-1 space-y-2.5">
                <Skeleton className="h-5 w-40" /><Skeleton className="h-4 w-56" />
                <div className="flex gap-2 mt-3">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
              </div>
            </div>
          </CardContent></Card>
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border-stone-200 shadow-sm"><CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2"><Skeleton className="h-4 w-36" /><Skeleton className="h-3 w-48" /></div>
              </div>
            </CardContent></Card>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !docsError && groups.length === 0 && <EmptyDocumentsState />}

      {/* Main content */}
      {!isLoading && !docsError && groups.length > 0 && (
        <>
          {/* Header */}
          <div className="flex items-start gap-5">
            <ProgressRing approved={approvedCount} total={totalDocs} />
            <div className="flex-1 min-w-0 pt-0.5">
              <h1 className="text-xl font-semibold tracking-tight text-stone-900">Documents</h1>
              <p className="text-sm text-stone-500 mt-0.5">
                {approvedCount === totalDocs
                  ? "All required documents approved"
                  : "Upload and manage your admission documents"
                }
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3.5">
                {missingCount > 0 && (
                  <span className="inline-flex items-center gap-2 text-xs text-stone-500">
                    <span className="size-2 rounded-full bg-stone-300" />
                    {missingCount} to upload
                  </span>
                )}
                {pendingCount > 0 && (
                  <span className="inline-flex items-center gap-2 text-xs text-amber-600">
                    <span className="size-2 rounded-full bg-amber-400" />
                    {pendingCount} pending
                  </span>
                )}
                {rejectedCount > 0 && (
                  <span className="inline-flex items-center gap-2 text-xs text-red-500">
                    <span className="size-2 rounded-full bg-red-400" />
                    {rejectedCount} rejected
                  </span>
                )}
                {approvedCount > 0 && (
                  <span className="inline-flex items-center gap-2 text-xs text-emerald-600">
                    <span className="size-2 rounded-full bg-emerald-400" />
                    {approvedCount} approved
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Document groups */}
          <div className="space-y-3">
            {groups.map((g) => (
              <DocumentGroup
                key={g.key} groupKey={g.key} docTypes={g.types} existingDocs={existingMap}
                onDropzoneUpload={handleDropzoneUpload} uploadingFor={uploadingFor}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
