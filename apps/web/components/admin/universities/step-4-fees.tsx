"use client";

import { Input } from "@repo/ui";
import { Label } from "@repo/ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui";
import { Checkbox } from "@repo/ui";
import { Button } from "@repo/ui";
import { Textarea } from "@repo/ui";
import type { WizardStepProps } from "./new-page.types";

export function FeesStep({ formData, formErrors, onFieldUpdate }: WizardStepProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Fee Structure */}
      <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
        <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Fee Structure</h4>

        <div data-error-field="fees.currency">
          <Label>Currency *</Label>
          <div className="max-w-xs">
            <Select
              value={formData.fees.currency}
              onValueChange={(v) => {
                onFieldUpdate("fees", "currency", v);
                if (v && formErrors["fees.currency"]) {
                  // error cleared by parent validation on next
                }
              }}
            >
              <SelectTrigger className={formErrors["fees.currency"] ? "border-destructive" : ""}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INR">₹ INR</SelectItem>
                <SelectItem value="USD">$ USD</SelectItem>
                <SelectItem value="EUR">€ EUR</SelectItem>
                <SelectItem value="RUB">₽ RUB</SelectItem>
              </SelectContent>
            </Select>
            {formErrors["fees.currency"] && <p className="text-xs text-destructive mt-1">{formErrors["fees.currency"]}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Checkbox id="scholarship-toggle" checked={formData.fees.scholarshipAvailable} onCheckedChange={(checked) => onFieldUpdate("fees", "scholarshipAvailable", checked)} />
          <Label htmlFor="scholarship-toggle" className="cursor-pointer font-medium">Scholarship Available</Label>
        </div>

        {formData.fees.scholarshipAvailable && (
          <div className="border-t border-border/40 pt-3">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs text-muted-foreground">Scholarship Names</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => onFieldUpdate("fees", "scholarships", [...formData.fees.scholarships, ""])}>+ Add Scholarship</Button>
            </div>
            {formData.fees.scholarships.length === 0 ? (
              <p className="text-xs text-muted-foreground">No scholarships listed yet.</p>
            ) : (
              <div className="space-y-2">
                {formData.fees.scholarships.map((name: string, i: number) => (
                  <div key={i} data-error-field={`fees.scholarships.${i}`} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Input value={name} onChange={(e) => {
                        const updated = [...formData.fees.scholarships]; updated[i] = e.target.value;
                        onFieldUpdate("fees", "scholarships", updated);
                      }} placeholder="e.g. Merit-Based Scholarship" className={`flex-1 ${formErrors[`fees.scholarships.${i}`] || (name === "") ? "border-destructive" : ""}`} />
                      <button type="button" onClick={() => {
                        const updated = formData.fees.scholarships.filter((_: string, j: number) => j !== i);
                        onFieldUpdate("fees", "scholarships", updated);
                      }} className="text-destructive/70 hover:text-destructive text-lg leading-none flex-shrink-0">×</button>
                    </div>
                    {formErrors[`fees.scholarships.${i}`] && <p className="text-xs text-destructive">{formErrors[`fees.scholarships.${i}`]}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Payment & Policies */}
      <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
        <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Payment & Policies</h4>
        <div data-error-field="fees.paymentSchedule">
          <Label>Payment Schedule *</Label>
          <Textarea data-error-field="fees.paymentSchedule" value={formData.fees.paymentSchedule} onChange={(e) => onFieldUpdate("fees", "paymentSchedule", e.target.value)} placeholder="e.g. Semester-wise, 50% at admission + 50% before 2nd year" rows={2} className={formErrors["fees.paymentSchedule"] ? "border-destructive" : ""} />
          {formErrors["fees.paymentSchedule"] && <p className="text-xs text-destructive mt-1">{formErrors["fees.paymentSchedule"]}</p>}
        </div>
        <div data-error-field="fees.refundPolicy">
          <Label>Refund Policy *</Label>
          <Textarea data-error-field="fees.refundPolicy" value={formData.fees.refundPolicy} onChange={(e) => onFieldUpdate("fees", "refundPolicy", e.target.value)} placeholder="e.g. Full refund before classes start, 50% within first month" rows={2} className={formErrors["fees.refundPolicy"] ? "border-destructive" : ""} />
          {formErrors["fees.refundPolicy"] && <p className="text-xs text-destructive mt-1">{formErrors["fees.refundPolicy"]}</p>}
        </div>
      </div>
    </div>
  );
}
