"use client";

import { useState } from "react";
import { FileText, ExternalLink } from "lucide-react";
import { PreviewDialog } from "@/components/admin/shared/preview-dialog";

interface Document {
  id: string;
  fileUrl?: string;
  status: string;
  documentType?: { name: string; code: string };
}

interface Props {
  documents: Document[];
  passportUrl?: string;
  certificateUrl?: string;
}

export function SubmittedDocuments({ documents, passportUrl, certificateUrl }: Props) {
  const [previewFile, setPreviewFile] = useState<{ url: string; name: string } | null>(null);

  // Combine regular documents with formData documents
  const allDocuments = [
    ...documents,
    ...(passportUrl ? [{ 
      id: 'passport-form', 
      fileUrl: passportUrl, 
      status: 'UPLOADED' as const,
      documentType: { name: 'Passport (Form Upload)', code: 'PASSPORT_FORM' }
    }] : []),
    ...(certificateUrl ? [{ 
      id: 'certificate-form', 
      fileUrl: certificateUrl, 
      status: 'UPLOADED' as const,
      documentType: { name: 'School Certificate (Form Upload)', code: 'CERTIFICATE_FORM' }
    }] : []),
  ];

  return (
    <>
      <PreviewDialog isOpen={!!previewFile} onClose={() => setPreviewFile(null)} fileUrl={previewFile?.url || null} fileName={previewFile?.name || null} />

      <div className="rounded-xl border border-[#d3cec6] bg-white p-6">
        <div className="mb-5 flex items-center gap-2 border-b border-[#ebe7e1] pb-3">
          <div className="rounded-lg bg-zinc-100 p-1.5">
            <FileText className="h-4 w-4 text-[#111111]" />
          </div>
          <h2 className="text-sm font-medium text-[#111111] tracking-tight">Submitted Documents</h2>
        </div>
        {allDocuments.length > 0 ? (
          <div className="divide-y divide-[#ebe7e1]">
            {allDocuments.map((doc: Document) => (
              <div key={doc.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="font-medium text-sm text-[#111111]">{doc.documentType?.name}</p>
                  <p className="text-[10px] text-[#626260] mt-0.5">Code: {doc.documentType?.code}</p>
                </div>
                <div className="flex items-center gap-3">
                  {doc.fileUrl && (
                    <button type="button" onClick={() => setPreviewFile({ url: doc.fileUrl, name: doc.documentType?.name })}
                      className="inline-flex items-center gap-1 rounded-lg border border-[#d3cec6] bg-white px-2.5 py-1 text-xs font-medium text-[#111111] hover:bg-zinc-50 transition-all cursor-pointer">
                      <ExternalLink className="h-3 w-3" /> View
                    </button>
                  )}
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium border ${
                    doc.status === "APPROVED" ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : doc.status === "REJECTED" ? "bg-red-50 border-red-200 text-red-700"
                    : "bg-amber-50 border-amber-200 text-amber-700"
                  }`}>
                    {doc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#626260] py-4 text-center">No documents uploaded yet</p>
        )}
      </div>
    </>
  );
}
