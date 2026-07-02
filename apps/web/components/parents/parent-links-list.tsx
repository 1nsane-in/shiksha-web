"use client";

import { useCallback, useState } from "react";
import { Card, Badge, Button, Skeleton } from "@repo/ui";
import { UserX, Mail, Trash2, Users, AlertTriangle, X } from "lucide-react";
import { toast } from "sonner";
import { useMyParentLinks, useRemoveParentLink } from "@/domains/parents";
import type { ParentLink } from "@/domains/parents";

function StatusBadge({ status }: { status: ParentLink["status"] }) {
  switch (status) {
    case "APPROVED":
      return <Badge variant="default" className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50">APPROVED</Badge>;
    case "PENDING":
      return <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">PENDING</Badge>;
    case "REJECTED":
      return <Badge variant="destructive">REJECTED</Badge>;
  }
}

export function ParentLinksList() {
  const { data: links, isLoading } = useMyParentLinks();
  const removeMutation = useRemoveParentLink();
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [confirmLink, setConfirmLink] = useState<ParentLink | null>(null);

  const handleRemove = useCallback((link: ParentLink) => {
    setConfirmLink(link);
  }, []);

  const confirmRemove = useCallback(() => {
    if (!confirmLink) return;
    const link = confirmLink;
    setConfirmLink(null);
    setRemovingId(link.id);
    removeMutation.mutate(link.id, {
      onSuccess: () => {
        toast.success(`${link.parentName} has been removed`);
        setRemovingId(null);
      },
      onError: (err) => {
        const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to remove parent";
        toast.error(message);
        setRemovingId(null);
      },
    });
  }, [confirmLink, removeMutation]);

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-5 h-5 text-gray-600" />
          <h2 className="font-medium text-gray-900">My Parents</h2>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </Card>
    );
  }

  if (!links || links.length === 0) {
    return null; // Don't show the section if there are no linked parents
  }

  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-gray-600" />
        <h2 className="font-medium text-gray-900">My Parents</h2>
        <span className="text-xs text-gray-400 ml-auto">{links.length} linked</span>
      </div>

      <div className="space-y-3">
        {links.map((link) => (
          <div
            key={link.id}
            className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-white hover:border-gray-200 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <span className="text-sm font-medium text-gray-600">
                  {(link.parentName ?? "?").charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {link.parentName}
                  </p>
                  <StatusBadge status={link.status} />
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                  <Mail className="w-3 h-3" />
                  <span className="truncate">{link.parentEmail}</span>
                  {link.relation && (
                    <>
                      <span className="text-gray-300">·</span>
                      <span>{link.relation}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {link.status === "APPROVED" && (
              <Button
                variant="ghost"
                size="icon-sm"
                disabled={removingId === link.id}
                onClick={() => handleRemove(link)}
                className="text-gray-400 hover:text-red-600 shrink-0"
                aria-label={`Remove ${link.parentName}`}
              >
                {removingId === link.id ? (
                  <Trash2 className="w-4 h-4 animate-pulse" />
                ) : (
                  <UserX className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Confirm remove dialog */}
      {confirmLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setConfirmLink(null)}>
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900">Remove parent?</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {confirmLink.parentName} will lose access to your admission progress.
                </p>
              </div>
              <button onClick={() => setConfirmLink(null)} className="shrink-0 p-1 rounded-md text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <Button variant="secondary" size="sm" onClick={() => setConfirmLink(null)}>
                Cancel
              </Button>
              <Button variant="destructive" size="sm" onClick={confirmRemove}>
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}