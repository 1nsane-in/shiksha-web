"use client";

import { useState, useCallback } from "react";
import { Card, Button, Tabs, TabsList, TabsTrigger, TabsContent, Skeleton } from "@repo/ui";
import { Link, Copy, Check, RefreshCw, Share2, Clock, QrCode, Users } from "lucide-react";
import { toast } from "sonner";
import { useGenerateInviteLink, useFamilyCode, useRegenerateFamilyCode } from "@/domains/parents";

export function AddParentSection() {
  const [activeTab, setActiveTab] = useState("invite-link");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Invite Link
  const generateMutation = useGenerateInviteLink();
  const inviteLink = generateMutation.data;

  // Family Code — only fetch when tab is active
  const { data: familyCodeData, isLoading: familyCodeLoading } = useFamilyCode(activeTab === "family-code");
  const regenerateMutation = useRegenerateFamilyCode();

  const handleCopy = useCallback(async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  }, []);

  const handleShare = useCallback(async (url: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Link to my Shiksha Study account",
          text: "Track my admission progress! Use this link to connect as my parent.",
          url,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          toast.error("Failed to share");
        }
      }
    } else {
      handleCopy(url, "share");
    }
  }, [handleCopy]);

  const handleGenerateLink = useCallback(() => {
    generateMutation.mutate();
  }, [generateMutation]);

  const handleRegenerateCode = useCallback(() => {
    regenerateMutation.mutate();
  }, [regenerateMutation]);

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <Users className="w-5 h-5 text-gray-600" />
        <h2 className="font-medium text-gray-900">Add Parent</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 w-full border border-gray-200/80 bg-gray-50/50 p-0.5 rounded-lg">
          <TabsTrigger value="invite-link" className="flex items-center gap-1.5 flex-1 py-1.5 data-active:border data-active:border-gray-200 data-active:shadow-sm data-active:bg-white rounded-md text-xs">
            <Link className="w-3.5 h-3.5" />
            Share Link
          </TabsTrigger>
          <TabsTrigger value="family-code" className="flex items-center gap-1.5 flex-1 py-1.5 data-active:border data-active:border-gray-200 data-active:shadow-sm data-active:bg-white rounded-md text-xs">
            <QrCode className="w-3.5 h-3.5" />
            Family Code
          </TabsTrigger>
        </TabsList>

        {/* ─── Invite Link Tab ─── */}
        <TabsContent value="invite-link" className="space-y-4">
          {!inviteLink ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                <Link className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Generate an invite link</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Share this link with your parent so they can create an account and get linked automatically.
                </p>
              </div>
              <Button
                variant="default"
                size="sm"
                disabled={generateMutation.isPending}
                onClick={handleGenerateLink}
              >
                {generateMutation.isPending ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Generating…
                  </>
                ) : (
                  <>
                    <Link className="w-3.5 h-3.5" />
                    Generate Link
                  </>
                )}
              </Button>
            </div>
          ) : (
            <>
              {/* Generated Link Display */}
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1 font-medium">Invite Link</p>
                <p className="text-sm text-gray-900 break-all font-mono">{inviteLink.inviteUrl}</p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleCopy(inviteLink.inviteUrl, "invite-link")}
                >
                  {copiedField === "invite-link" ? (
                    <><Check className="w-3.5 h-3.5" /> Copied</>
                  ) : (
                    <><Copy className="w-3.5 h-3.5" /> Copy Link</>
                  )}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleShare(inviteLink.inviteUrl)}
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Share
                </Button>
              </div>

              {/* Info */}
              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Expires in 7 days</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Link className="w-3.5 h-3.5" />
                  <span>One-time use — parent will be auto-linked on signup</span>
                </div>
              </div>

              {/* Regenerate */}
              <button
                type="button"
                disabled={generateMutation.isPending}
                onClick={handleGenerateLink}
                className="text-xs text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${generateMutation.isPending ? "animate-spin" : ""}`} />
                Regenerate link (invalidates previous)
              </button>
            </>
          )}
        </TabsContent>

        {/* ─── Family Code Tab ─── */}
        <TabsContent value="family-code" className="space-y-4">
          {familyCodeLoading ? (
            <div className="flex flex-col items-center gap-4 py-4">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-[68px] w-[220px] rounded-xl" />
              <div className="flex gap-2">
                <Skeleton className="h-9 w-28 rounded-md" />
                <Skeleton className="h-9 w-28 rounded-md" />
              </div>
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-72" />
                <Skeleton className="h-3 w-56 mx-auto" />
              </div>
            </div>
          ) : (
            <>
              {/* Code Display */}
              <div className="flex flex-col items-center gap-2">
                <p className="text-xs text-gray-500 font-medium">Your Family Code</p>
                <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl px-8 py-4">
                  <span className="text-3xl font-bold tracking-[0.25em] text-gray-900 select-all">
                    {familyCodeData?.familyCode ?? "------"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleCopy(familyCodeData?.familyCode ?? "", "family-code")}
                >
                  {copiedField === "family-code" ? (
                    <><Check className="w-3.5 h-3.5" /> Copied</>
                  ) : (
                    <><Copy className="w-3.5 h-3.5" /> Copy Code</>
                  )}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={regenerateMutation.isPending}
                  onClick={handleRegenerateCode}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${regenerateMutation.isPending ? "animate-spin" : ""}`} />
                  Regenerate
                </Button>
              </div>

              {/* Info */}
              <div className="text-center text-xs text-gray-500 space-y-1">
                <p>Share this code with your parent. They can enter it during signup to get linked automatically.</p>
                <p>The code doesn't expire unless you regenerate it. Multiple parents can use the same code.</p>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}
