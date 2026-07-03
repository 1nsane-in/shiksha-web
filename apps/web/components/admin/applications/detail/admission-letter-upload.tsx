"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, CheckCircle2, XCircle, Loader2, ExternalLink } from "lucide-react";
import { useUploadFile } from "@/domains/documents/documents.queries";
import { useUploadAdmissionLetter } from "@/domains/admin/letters.queries";
import { PreviewDialog } from "@/components/admin/shared/preview-dialog";

interface Props {
  applicationId: string;
  existingLetter?: { fileUrl: string; fileName: string } | null;
}

export function AdmissionLetterUpload({ applicationId, existingLetter }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [latestLetter, setLatestLetter] = useState<{ fileUrl: string; fileName: string } | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [previewFile, setPreviewFile] = useState<{ url: string; name: string } | null>(null);

  const uploadFile = useUploadFile();
  const uploadLetter = useUploadAdmissionLetter();

  useEffect(() => {
    return () => {
      if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
    };
  }, [localPreviewUrl]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setUploadError("");
    setSuccess(false);
    if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
    setLocalPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setUploadError("");
    setSuccess(false);
    try {
      const uploadResult = await uploadFile.mutateAsync(selectedFile);
      await uploadLetter.mutateAsync({ applicationId, fileUrl: uploadResult.url, fileName: selectedFile.name });
      setLatestLetter({ fileUrl: uploadResult.url, fileName: selectedFile.name });
      setSuccess(true);
    } catch (err: any) {
      setUploadError(err?.response?.data?.message || err?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    if (localPreviewUrl) { URL.revokeObjectURL(localPreviewUrl); setLocalPreviewUrl(null); }
    setLatestLetter(null);
    setSuccess(false);
    setUploadError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const letterToDisplay = latestLetter || existingLetter;

  return (
    <div className="rounded-xl border border-[#d3cec6] bg-white p-6 space-y-4">
      <PreviewDialog isOpen={!!previewFile} onClose={() => setPreviewFile(null)} fileUrl={previewFile?.url || null} fileName={previewFile?.name || null} />

      <div className="flex items-center gap-2">
        <Upload className="h-4 w-4 text-[#111111]" />
        <h2 className="text-sm font-medium text-[#111111] tracking-tight">Official Admission Letter</h2>
      </div>
      <p className="text-xs text-[#626260] leading-relaxed">
        Upload the official university admission letter PDF.
      </p>

      {letterToDisplay && !selectedFile && (
        <div className="flex items-center justify-between rounded-lg border border-[#d3cec6] bg-zinc-50 px-4 py-3 text-xs font-medium text-[#111111] flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span className="truncate max-w-[280px]">Letter active: {letterToDisplay.fileName || "Admission_Letter.pdf"}</span>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setPreviewFile({ url: letterToDisplay.fileUrl, name: letterToDisplay.fileName || "Admission Letter" })}
              className="inline-flex items-center gap-1 rounded-md border border-[#d3cec6] bg-white px-2.5 py-1 text-xs font-medium text-[#111111] hover:bg-zinc-50 transition-all cursor-pointer">
              <ExternalLink className="h-3 w-3" /> View
            </button>
            <button type="button" onClick={handleRemove}
              className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-100 transition-all cursor-pointer">
              <XCircle className="h-3 w-3" /> Remove
            </button>
          </div>
        </div>
      )}

      {selectedFile && (
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
          {!success && (
            <button type="button" onClick={handleUpload} disabled={uploading}
              className="inline-flex items-center gap-2 rounded-lg bg-[#111111] px-4 py-2 text-xs font-medium text-white hover:bg-black transition-all cursor-pointer disabled:opacity-50">
              {uploading ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading...</> : <><Upload className="h-3.5 w-3.5" /> Upload to Server</>}
            </button>
          )}
        </div>
      )}

      {success && (
        <div className="flex items-center justify-between rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs font-medium text-emerald-800 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Admission letter uploaded successfully.</span>
          </div>
          <button type="button" onClick={handleRemove}
            className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-100 transition-all cursor-pointer">
            <XCircle className="h-3 w-3" /> Replace
          </button>
        </div>
      )}

      {!letterToDisplay && !selectedFile && !success && (
        <>
          <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleFileSelect} className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
            className="inline-flex items-center gap-2 rounded-lg border border-[#d3cec6] bg-zinc-50 px-4 py-2 text-xs font-medium text-[#111111] hover:bg-zinc-100 transition-all disabled:opacity-50">
            <Upload className="h-3.5 w-3.5" /> Select Admission Letter PDF
          </button>
        </>
      )}

      {uploadError && <p className="text-xs text-red-600 font-semibold">{uploadError}</p>}
    </div>
  );
}
