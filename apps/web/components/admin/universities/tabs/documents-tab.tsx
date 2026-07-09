"use client";

import React, { useState } from "react";
import { Card, CardContent, Button } from "@repo/ui";
import { EmptyState } from "@/components/admin/universities/ui";
import { DocUploadModal } from "@/components/admin/universities/modals";
import { Plus, FileText, Download, Trash2, Upload } from "lucide-react";

interface Props {
  documents: any[];
  onDeleteDoc: (id: string) => void;
  onUploadDoc: (fd: FormData) => Promise<void>;
  uniId: string;
}

export function DocumentsTab({ documents, onDeleteDoc, onUploadDoc, uniId }: Props) {
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#111]">University Documents</h3>
        <Button size="sm" className="bg-[#3730A3] hover:bg-[#312E81] text-white cursor-pointer" onClick={() => setShowUpload(true)}>
          <Plus className="h-4 w-4 mr-1" /> Upload Document
        </Button>
      </div>
      {documents && documents.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc: any) => (
            <Card key={doc.id} size="sm" className="border-[#ECEAE6]">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#111] truncate">{doc.fileName || doc.type}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-1">{doc.type?.replace(/_/g, " ")}</p>
                    {doc.fileSize && <p className="text-xs text-gray-400 mt-1">{(doc.fileSize / 1024).toFixed(1)} KB</p>}
                    {doc.uploadedAt && <p className="text-xs text-gray-400">{new Date(doc.uploadedAt).toLocaleDateString("en-IN")}</p>}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#ECEAE6] text-gray-500 hover:bg-gray-50 hover:text-[#3730A3] transition-colors">
                      <Download className="h-4 w-4" />
                    </a>
                    <button onClick={() => onDeleteDoc(doc.id)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState icon={FileText} message="No documents uploaded yet." action={<Button size="sm" className="bg-[#3730A3] hover:bg-[#312E81] text-white" onClick={() => setShowUpload(true)}><Upload className="h-4 w-4 mr-1" /> Upload First Document</Button>} />
      )}
      {showUpload && <DocUploadModal universityId={uniId} onClose={() => setShowUpload(false)} onUpload={onUploadDoc} />}
    </div>
  );
}
