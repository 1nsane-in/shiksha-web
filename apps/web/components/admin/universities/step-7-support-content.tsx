"use client";

import { Label } from "@repo/ui";
import { Textarea } from "@repo/ui";
import { Checkbox } from "@repo/ui";
import { Button } from "@repo/ui";
import { Input } from "@repo/ui";
import type { WizardStepProps } from "./new-page.types";

export function SupportContentStep({ formData, formErrors, onFieldUpdate }: WizardStepProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Support Services */}
      <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Support Services</h4>
          <Button type="button" variant="outline" size="sm" onClick={() => onFieldUpdate("support", "extraServices", [...(formData.support.extraServices || []), ""])}>+ Add Extra</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { key: "alumniNetwork", label: "Alumni Network" },
            { key: "internationalStudentSupport", label: "International Student Support" },
            { key: "visaAssistance", label: "Visa Assistance" },
            { key: "counselingServices", label: "Counseling Services" },
            { key: "careerGuidance", label: "Career Guidance" },
          ].map((item) => (
            <label key={item.key} className="flex items-center gap-3 rounded-md border border-border/60 p-3 cursor-pointer hover:bg-muted/50 transition-colors">
              <Checkbox checked={formData.support[item.key]} onCheckedChange={(checked) => onFieldUpdate("support", item.key, checked)} />
              <span className="text-sm">{item.label}</span>
            </label>
          ))}
          {formData.support.extraServices?.map((name: string, i: number) => {
            const error = formErrors[`support.extraServices.${i}`];
            return (
              <div key={i} className="flex flex-col gap-1">
                <div className="flex items-center gap-2 rounded-md border border-border/60 p-3">
                  <Input data-error-field={`support.extraServices.${i}`} value={name} onChange={(e) => {
                    const updated = [...(formData.support.extraServices || [])]; updated[i] = e.target.value;
                    onFieldUpdate("support", "extraServices", updated);
                  }} placeholder="Service name" className={`h-7 text-sm flex-1 min-w-0 ${error ? "border-destructive" : ""}`} />
                  <button type="button" onClick={() => {
                    const updated = (formData.support.extraServices || []).filter((_: string, j: number) => j !== i);
                    onFieldUpdate("support", "extraServices", updated);
                  }} className="text-destructive/70 hover:text-destructive text-lg leading-none flex-shrink-0">×</button>
                </div>
                {error && <p className="text-xs text-destructive px-1">{error}</p>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
        <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Content</h4>
        <div data-error-field="content.shortDescription">
          <Label>Short Description *</Label>
          <Textarea data-error-field="content.shortDescription" value={formData.content.shortDescription} onChange={(e) => onFieldUpdate("content", "shortDescription", e.target.value)} placeholder="Brief overview of the university (150-200 characters)" rows={2} className={formErrors["content.shortDescription"] ? "border-destructive" : ""} />
          <div className="flex items-center justify-between mt-1">
            {formErrors["content.shortDescription"] ? <p className="text-xs text-destructive">{formErrors["content.shortDescription"]}</p> : <span />}
            {formData.content.shortDescription && <p className="text-xs text-muted-foreground">{formData.content.shortDescription.length} characters</p>}
          </div>
        </div>
        <div data-error-field="content.longDescription">
          <Label>Long Description *</Label>
          <Textarea data-error-field="content.longDescription" rows={5} value={formData.content.longDescription} onChange={(e) => onFieldUpdate("content", "longDescription", e.target.value)} placeholder="Detailed description covering history, achievements, campus life, and unique offerings" className={formErrors["content.longDescription"] ? "border-destructive" : ""} />
          {formErrors["content.longDescription"] && <p className="text-xs text-destructive mt-1">{formErrors["content.longDescription"]}</p>}
        </div>
      </div>
    </div>
  );
}
