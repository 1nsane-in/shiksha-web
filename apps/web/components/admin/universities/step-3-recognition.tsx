"use client";

import { Input } from "@repo/ui";
import { Label } from "@repo/ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui";
import { Button } from "@repo/ui";
import type { WizardStepProps } from "./new-page.types";

export function RecognitionStep({ formData, formErrors, onFieldUpdate }: WizardStepProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Accreditation Status */}
      <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
        <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Accreditation Status</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>ECFMG Status *</Label>
            <Select
              value={formData.recognition.ecfmgStatus}
              onValueChange={(v) => onFieldUpdate("recognition", "ecfmgStatus", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="APPROVED">✅ Approved</SelectItem>
                <SelectItem value="NOT_APPROVED">❌ Not Approved</SelectItem>
                <SelectItem value="PENDING">⏳ Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>WHO Listed</Label>
            <Select
              value={(formData.recognition.bodies || []).includes("WHO") ? "YES" : "NO"}
              onValueChange={(v) => {
                const current = formData.recognition.bodies || [];
                if (v === "YES" && !current.includes("WHO")) {
                  onFieldUpdate("recognition", "bodies", [...current, "WHO"]);
                } else if (v === "NO") {
                  onFieldUpdate("recognition", "bodies", current.filter((b: string) => b !== "WHO"));
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="YES">Yes</SelectItem>
                <SelectItem value="NO">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="w-full sm:w-1/2">
          <Label>NMC Approved</Label>
          <Select
            value={(formData.recognition.bodies || []).includes("NMC") ? "YES" : "NO"}
            onValueChange={(v) => {
              const current = formData.recognition.bodies || [];
              if (v === "YES" && !current.includes("NMC")) {
                onFieldUpdate("recognition", "bodies", [...current, "NMC"]);
              } else if (v === "NO") {
                onFieldUpdate("recognition", "bodies", current.filter((b: string) => b !== "NMC"));
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="YES">Yes</SelectItem>
              <SelectItem value="NO">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Rankings Section */}
      <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
        <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Rankings</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>World Rank</Label>
            <Input
              type="text" inputMode="numeric"
              value={formData.recognition.worldRank || ""}
              onChange={(e) => onFieldUpdate("recognition", "worldRank", e.target.value ? parseInt(e.target.value) : null)}
              placeholder="e.g. 450"
            />
          </div>
          <div>
            <Label>National Rank</Label>
            <Input
              type="text" inputMode="numeric"
              value={formData.recognition.nationalRank || ""}
              onChange={(e) => onFieldUpdate("recognition", "nationalRank", e.target.value ? parseInt(e.target.value) : null)}
              placeholder="e.g. 25"
            />
          </div>
          <div>
            <Label>World Ranking Source</Label>
            <Select
              value={formData.recognition.worldRankingSource || ""}
              onValueChange={(v) => {
                onFieldUpdate("recognition", "worldRankingSource", v || null);
                if (v !== "Other") onFieldUpdate("recognition", "otherRankingSource", null);
              }}
            >
              <SelectTrigger><SelectValue placeholder="Select source" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="QS World">QS World Rankings</SelectItem>
                <SelectItem value="THE">Times Higher Education</SelectItem>
                <SelectItem value="US News">US News & World Report</SelectItem>
                <SelectItem value="Webometrics">Webometrics</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {formData.recognition.worldRankingSource === "Other" && (
              <Input className="mt-2" value={formData.recognition.otherRankingSource || ""} onChange={(e) => onFieldUpdate("recognition", "otherRankingSource", e.target.value || null)} placeholder="Enter ranking source name" />
            )}
          </div>
          <div>
            <Label>National Ranking Source</Label>
            <Select
              value={formData.recognition.nationalRankingSource || ""}
              onValueChange={(v) => onFieldUpdate("recognition", "nationalRankingSource", v || null)}
            >
              <SelectTrigger><SelectValue placeholder="Select source" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="CUG Complete">CUG Complete University Guide (UK)</SelectItem>
                <SelectItem value="NIRF">NIRF (India)</SelectItem>
                <SelectItem value="Guardian">Guardian University Guide (UK)</SelectItem>
                <SelectItem value="Forbes">Forbes (US)</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {formData.recognition.nationalRankingSource === "Other" && (
              <Input className="mt-2" value={formData.recognition.otherNationalRankingSource || ""} onChange={(e) => onFieldUpdate("recognition", "otherNationalRankingSource", e.target.value || null)} placeholder="Enter national ranking source name" />
            )}
          </div>
        </div>

        {/* Subject Rankings */}
        <div className="border-t border-border/40 pt-3 mt-2">
          <div className="flex items-center justify-between mb-2">
            <Label className={`text-xs ${formErrors["recognition.subjectRankings"] || Object.keys(formErrors).some(k => k.startsWith("recognition.subjectRankings.")) ? "text-destructive" : "text-muted-foreground"}`}>
              Subject Rankings
              {Object.keys(formErrors).some(k => k.startsWith("recognition.subjectRankings.")) && <span className="ml-1 text-destructive">(Subject and ranking required)</span>}
            </Label>
            <Button type="button" variant="outline" size="sm"
              onClick={() => onFieldUpdate("recognition", "subjectRankings", [...(formData.recognition.subjectRankings || []), { subject: "", ranking: "" }])}
            >+ Add Subject Ranking</Button>
          </div>
          {(formData.recognition.subjectRankings || []).length === 0 ? (
            <p className="text-xs text-muted-foreground">No subject rankings listed yet.</p>
          ) : (
            <div className="space-y-2">
              {(formData.recognition.subjectRankings || []).map((item: { subject: string; ranking: string }, i: number) => {
                const itemError = formErrors[`recognition.subjectRankings.${i}`];
                return (
                  <div key={i} data-error-field={`recognition.subjectRankings.${i}`} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Input value={item.subject} onChange={(e) => {
                        const updated = [...(formData.recognition.subjectRankings || [])];
                        updated[i] = { ...updated[i], subject: e.target.value };
                        onFieldUpdate("recognition", "subjectRankings", updated);
                      }} placeholder="e.g. Medicine" className={`flex-1 ${itemError || (!item.subject && item.ranking) ? "border-destructive" : ""}`} />
                      <Input value={item.ranking} onChange={(e) => {
                        const updated = [...(formData.recognition.subjectRankings || [])];
                        updated[i] = { ...updated[i], ranking: e.target.value };
                        onFieldUpdate("recognition", "subjectRankings", updated);
                      }} placeholder="e.g. Top 100" className={`flex-1 ${itemError || (item.subject && !item.ranking) ? "border-destructive" : ""}`} />
                      <button type="button" onClick={() => {
                        const updated = (formData.recognition.subjectRankings || []).filter((_: any, j: number) => j !== i);
                        onFieldUpdate("recognition", "subjectRankings", updated);
                      }} className="text-destructive/70 hover:text-destructive text-lg leading-none flex-shrink-0">×</button>
                    </div>
                    {(itemError || (!item.subject && item.ranking) || (item.subject && !item.ranking)) && <p className="text-xs text-destructive">{itemError || "Subject and ranking are required"}</p>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
