"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Badge, Skeleton } from "@repo/ui";
import { FileCheck, ExternalLink } from "lucide-react";

interface Props {
  documents: any[];
  isLoading: boolean;
  onVerify: (docId: string, status: "APPROVED" | "REJECTED") => void;
}

export function StudentDocumentsCard({ documents, isLoading, onVerify }: Props) {
  return (
    <Card className="border-[#ECEAE6] bg-[#FAFAF8]">
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <FileCheck className="h-4 w-4" />
          Verify Uploaded Documents ({documents.length})
        </CardTitle>
        <CardDescription>Review file matches, accept, or reject for student re-upload.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-8 text-[#888] text-sm">No documents uploaded yet.</div>
        ) : (
          <div className="space-y-4">
            {documents.map((doc: any) => (
              <div key={doc.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border bg-white" style={{ borderColor: "rgba(26, 21, 58, 0.08)" }}>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-semibold text-[#111]">{doc.documentType?.name || "Document"}</h4>
                    <Badge
                      className={`text-[10px] py-0.5 px-1.5 rounded uppercase font-bold border ${
                        doc.status === "APPROVED"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : doc.status === "REJECTED" || doc.status === "REUPLOAD_REQUIRED"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-yellow-50 text-yellow-700 border-yellow-200"
                      }`}
                    >
                      {doc.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 truncate max-w-sm">File: {doc.fileName}</p>
                  {doc.remarks && (
                    <p className="text-xs text-red-600 mt-1.5 bg-red-50 p-2 rounded-lg border border-red-100 font-medium">
                      Remarks: {doc.remarks}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 w-full sm:w-auto shrink-0 justify-end">
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-9 items-center justify-center rounded-lg px-3.5 border border-[#ECEAE6] text-xs font-semibold text-gray-700 hover:bg-[#FAFAF8] gap-1 bg-white select-none transition-all active:scale-[0.98] cursor-pointer"
                  >
                    View File <ExternalLink className="h-3 w-3" />
                  </a>
                  {doc.status !== "APPROVED" && (
                    <Button type="button" size="sm" className="bg-green-600 hover:bg-green-700 text-white font-medium text-xs h-9"
                      onClick={() => onVerify(doc.id, "APPROVED")}>
                      Approve
                    </Button>
                  )}
                  {doc.status !== "REJECTED" && doc.status !== "REUPLOAD_REQUIRED" && (
                    <Button type="button" variant="destructive" size="sm" className="text-xs h-9 font-medium text-white bg-red-600 hover:bg-red-700"
                      onClick={() => onVerify(doc.id, "REJECTED")}>
                      Reject
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
