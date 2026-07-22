"use client";

import { Input } from "@repo/ui";
import { Label } from "@repo/ui";
import { Textarea } from "@repo/ui";
import type { WizardStepProps } from "./new-page.types";

export function AdmissionStep({ formData, formErrors, onFieldUpdate }: WizardStepProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Global Eligibility */}
      <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
        <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Global Eligibility</h4>
        <div data-error-field="admission.ageCriteria">
          <Label>Age Criteria *</Label>
          <Input data-error-field="admission.ageCriteria" value={formData.admission.ageCriteria} onChange={(e) => onFieldUpdate("admission", "ageCriteria", e.target.value)} placeholder="e.g. 17-25 years" className={formErrors["admission.ageCriteria"] ? "border-destructive" : ""} />
          {formErrors["admission.ageCriteria"] && <p className="text-xs text-destructive mt-1">{formErrors["admission.ageCriteria"]}</p>}
        </div>
      </div>

      {/* Per-Program Eligibility */}
      <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
        <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Eligibility by Program</h4>
        {formData.academic?.programs?.length > 0 ? (
          <div className="space-y-6">
            {formData.academic.programs.map((prog: any, i: number) => {
              if (!prog.name?.trim()) return null;
              const progEligibility = formData.admission?.programEligibility?.[i] || { minimumMarks: "", eligibility: "" };
              const minMarksError = formErrors[`admission.programEligibility.${i}.minimumMarks`];
              const eligibilityError = formErrors[`admission.programEligibility.${i}.eligibility`];
              return (
                <div key={i} className="border border-border/50 rounded-md p-4 bg-muted/20">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold">{i + 1}</span>
                    <span className="font-medium">{prog.name}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div data-error-field={`admission.programEligibility.${i}.minimumMarks`}>
                      <Label>Minimum Marks *</Label>
                      <Input data-error-field={`admission.programEligibility.${i}.minimumMarks`} value={progEligibility.minimumMarks} onChange={(e) => {
                        const newEligibility = [...(formData.admission?.programEligibility || [])];
                        newEligibility[i] = { ...newEligibility[i], minimumMarks: e.target.value, eligibility: newEligibility[i]?.eligibility || "" };
                        onFieldUpdate("admission", "programEligibility", newEligibility);
                      }} placeholder="e.g. 50th percentile or 720 marks" className={minMarksError ? "border-destructive" : ""} />
                      {minMarksError && <p className="text-xs text-destructive mt-1">{minMarksError}</p>}
                    </div>
                    <div data-error-field={`admission.programEligibility.${i}.eligibility`}>
                      <Label>Eligibility Criteria *</Label>
                      <Input data-error-field={`admission.programEligibility.${i}.eligibility`} value={progEligibility.eligibility} onChange={(e) => {
                        const newEligibility = [...(formData.admission?.programEligibility || [])];
                        newEligibility[i] = { ...newEligibility[i], eligibility: e.target.value, minimumMarks: newEligibility[i]?.minimumMarks || "" };
                        onFieldUpdate("admission", "programEligibility", newEligibility);
                      }} placeholder="e.g. 10+2 with PCB, 50% aggregate" className={eligibilityError ? "border-destructive" : ""} />
                      {eligibilityError && <p className="text-xs text-destructive mt-1">{eligibilityError}</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground bg-muted/50 rounded-md p-4 text-center">No programs added in Step 3. Please add programs first.</div>
        )}
      </div>

      {/* Application Details */}
      <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
        <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Application Details</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div data-error-field="admission.applicationDeadline">
            <Label>Application Deadline *</Label>
            <Input data-error-field="admission.applicationDeadline" type="date" value={formData.admission.applicationDeadline} onChange={(e) => onFieldUpdate("admission", "applicationDeadline", e.target.value)} className={formErrors["admission.applicationDeadline"] ? "border-destructive" : ""} />
            {formErrors["admission.applicationDeadline"] && <p className="text-xs text-destructive mt-1">{formErrors["admission.applicationDeadline"]}</p>}
          </div>
          <div data-error-field="admission.applicationFee">
            <Label>Application Fee *</Label>
            <Input data-error-field="admission.applicationFee" type="text" inputMode="numeric" value={formData.admission.applicationFee || ""} onChange={(e) => onFieldUpdate("admission", "applicationFee", parseFloat(e.target.value) || 0)} placeholder="e.g. 1500" className={formErrors["admission.applicationFee"] ? "border-destructive" : ""} />
            {formErrors["admission.applicationFee"] && <p className="text-xs text-destructive mt-1">{formErrors["admission.applicationFee"]}</p>}
          </div>
        </div>
        <div data-error-field="admission.selectionProcess">
          <Label>Selection Process *</Label>
          <Textarea data-error-field="admission.selectionProcess" value={formData.admission.selectionProcess} onChange={(e) => onFieldUpdate("admission", "selectionProcess", e.target.value)} placeholder="e.g. NEET score → Counseling → Document verification → Admission confirmation" rows={2} className={formErrors["admission.selectionProcess"] ? "border-destructive" : ""} />
          {formErrors["admission.selectionProcess"] && <p className="text-xs text-destructive mt-1">{formErrors["admission.selectionProcess"]}</p>}
        </div>
      </div>
    </div>
  );
}
