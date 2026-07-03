"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, CheckCircle2, XCircle, Loader2, AlertCircle, ExternalLink } from "lucide-react";
import { useUploadFile } from "@/domains/documents/documents.queries";
import { useUploadAdmissionLetter } from "@/domains/admin/letters.queries";
import { PreviewDialog } from "@/components/admin/shared/preview-dialog";

interface Props {
  applicationId: string;
  firstName: string;
  onApprove: () => Promise<void>;
  onReject: () => Promise<void>;
  isPending: boolean;
}

export function ReviewActionPanel({ applicationId, firstName, onApprove, onReject, isPending }: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{ url: string; fileName: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [approving, setApproving] = useState(false);
  const [actionError, setActionError] = useState("");
  const [previewFile, setPreviewFile] = useState<{ url: string; name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFileMutation = useUploadFile();
  const uploadLetterMutation = useUploadAdmissionLetter();

  useEffect(() => {
    return () => {
      if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
    };
  }, [localPreviewUrl]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setActionError("");
    setUploadedFile(null);
    if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
    setLocalPreviewUrl(URL.createObjectURL(file));
  };

  const handleUploadFile = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setActionError("");
    try {
      const result = await uploadFileMutation.mutateAsync({ file: selectedFile, folder: "admission-letters" });
      setUploadedFile({ url: result.url, fileName: selectedFile.name });
    } catch (err: any) {
      setActionError(err?.message || "File upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    if (localPreviewUrl) { URL.revokeObjectURL(localPreviewUrl); setLocalPreviewUrl(null); }
    setUploadedFile(null);
    setActionError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleApprove = async () => {
    if (!uploadedFile) return;
    setApproving(true);
    setActionError("");
    try {
      await onApprove();
      await uploadLetterMutation.mutateAsync({ applicationId, fileUrl: uploadedFile.url, fileName: uploadedFile.fileName });
      setUploadedFile(null);
      setSelectedFile(null);
    } catch (err: any) {
      setActionError(err?.message || "Approval flow failed");
    } finally {
      setApproving(false);
    }
  };

  return (
    <>
      <PreviewDialog isOpen={!!previewFile} onClose={() => setPreviewFile(null)} fileUrl={previewFile?.url || null} fileName={previewFile?.name || null} />

      <div className="rounded-xl border-2 border-[#111111] bg-white p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Upload className="h-4 w-4 text-[#111111]" />
          <h2 className="text-sm font-medium text-[#111111] tracking-tight">Action Required: Upload Admission Letter</h2>
        </div>
        <p className="text-xs text-[#626260] leading-relaxed">
          To approve {firstName}&apos;s application, upload the official university Admission Letter PDF.
        </p>

        <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleFileSelect} className="hidden" />

        <div className="flex flex-col gap-4 pt-1">
          {!selectedFile && !uploadedFile && (
            <button type="button" onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-lg border border-[#d3cec6] bg-zinc-50 px-4 py-2 text-xs font-medium text-[#111111] hover:bg-zinc-100 transition-all cursor-pointer">
              <Upload className="h-3.5 w-3.5" /> Select Admission Letter (PDF)
            </button>
          )}

          {selectedFile && !uploadedFile && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d3cec6] bg-zinc-50 px-3 py-1 text-xs font-medium text-[#111111]">
                  Selected: {selectedFile.name}
                </span>
                {localPreviewUrl && (
                  <button type="button" onClick={() => setPreviewFile({ url: localPreviewUrl, name: selectedFile.name })}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#d3cec6] bg-white px-3 py-1.5 text-xs font-medium text-[#111111] hover:bg-zinc-50 transition-all cursor-pointer">
                    <ExternalLink className="h-3 w-3" /> Preview
                  </button>
                )}
                <button type="button" onClick={handleRemove}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 transition-all cursor-pointer">
                  <XCircle className="h-3 w-3" /> Remove
                </button>
              </div>
              <button type="button" onClick={handleUploadFile} disabled={uploading}
                className="inline-flex items-center gap-2 rounded-lg bg-[#111111] px-4 py-2 text-xs font-medium text-white hover:bg-black transition-all cursor-pointer disabled:opacity-50">
                {uploading ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading...</> : <><Upload className="h-3.5 w-3.5" /> Upload to Server</>}
              </button>
            </div>
          )}

          {uploadedFile && (
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Uploaded: {uploadedFile.fileName}
              </span>
              <button type="button" onClick={() => setPreviewFile({ url: uploadedFile.url, name: uploadedFile.fileName })}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#d3cec6] bg-white px-3 py-1.5 text-xs font-medium text-[#111111] hover:bg-zinc-50 transition-all cursor-pointer">
                <ExternalLink className="h-3 w-3" /> Preview
              </button>
              <button type="button" onClick={handleRemove}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 transition-all cursor-pointer">
                <XCircle className="h-3 w-3" /> Remove
              </button>
            </div>
          )}
        </div>

        {actionError && (
          <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {actionError}
          </div>
        )}

        <div className="flex items-center gap-2 pt-4 border-t border-dashed border-[#ebe7e1]">
          <button onClick={handleApprove} disabled={!uploadedFile || approving}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#111111] px-4 py-2 text-xs font-medium text-white hover:bg-black transition-all disabled:opacity-50 cursor-pointer">
            {approving ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Processing...</> : <><CheckCircle2 className="h-3.5 w-3.5" /> Approve & Notify</>}
          </button>
          <button onClick={onReject} disabled={approving}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#d3cec6] bg-white px-4 py-2 text-xs font-medium text-[#111111] hover:bg-zinc-50 transition-all cursor-pointer disabled:opacity-50">
            <XCircle className="h-3 w-3" /> Reject
          </button>
        </div>
      </div>
    </>
  );
}
