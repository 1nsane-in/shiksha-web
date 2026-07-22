"use client";

import { Input } from "@repo/ui";
import { Label } from "@repo/ui";
import { Button } from "@repo/ui";
import { Checkbox } from "@repo/ui";
import type { WizardStepProps } from "./new-page.types";

export function InfrastructureStep({ formData, formErrors, onFieldUpdate }: WizardStepProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Departments */}
      <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
        <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Departments</h4>
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs text-muted-foreground">Department Names</Label>
            <Button type="button" variant="outline" size="sm" onClick={() => onFieldUpdate("infrastructure", "departments", [...(formData.infrastructure.departments || []), ""])}>+ Add Department</Button>
          </div>
          {(!formData.infrastructure.departments || formData.infrastructure.departments.length === 0) ? (
            <p className="text-xs text-muted-foreground">No departments added yet.</p>
          ) : (
            <div className="space-y-2">
              {formData.infrastructure.departments.map((dept: string, i: number) => (
                <div key={i} data-error-field={`infrastructure.departments.${i}`} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Input value={dept} onChange={(e) => {
                      const updated = [...formData.infrastructure.departments]; updated[i] = e.target.value;
                      onFieldUpdate("infrastructure", "departments", updated);
                    }} placeholder="e.g. Cardiology" className={`flex-1 ${formErrors[`infrastructure.departments.${i}`] ? "border-destructive" : ""}`} />
                    <button type="button" onClick={() => {
                      const updated = formData.infrastructure.departments.filter((_: any, j: number) => j !== i);
                      onFieldUpdate("infrastructure", "departments", updated);
                    }} className="text-destructive/70 hover:text-destructive text-lg leading-none flex-shrink-0">×</button>
                  </div>
                  {formErrors[`infrastructure.departments.${i}`] && <p className="text-xs text-destructive">{formErrors[`infrastructure.departments.${i}`]}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Laboratories */}
      <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
        <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Laboratories</h4>
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs text-muted-foreground">Laboratory Names</Label>
            <Button type="button" variant="outline" size="sm" onClick={() => onFieldUpdate("infrastructure", "laboratories", [...(formData.infrastructure.laboratories || []), ""])}>+ Add Laboratory</Button>
          </div>
          {(!formData.infrastructure.laboratories || formData.infrastructure.laboratories.length === 0) ? (
            <p className="text-xs text-muted-foreground">No laboratories added yet.</p>
          ) : (
            <div className="space-y-2">
              {formData.infrastructure.laboratories.map((lab: string, i: number) => (
                <div key={i} data-error-field={`infrastructure.laboratories.${i}`} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Input value={lab} onChange={(e) => {
                      const updated = [...formData.infrastructure.laboratories]; updated[i] = e.target.value;
                      onFieldUpdate("infrastructure", "laboratories", updated);
                    }} placeholder="e.g. Anatomy Lab" className={`flex-1 ${formErrors[`infrastructure.laboratories.${i}`] ? "border-destructive" : ""}`} />
                    <button type="button" onClick={() => {
                      const updated = formData.infrastructure.laboratories.filter((_: any, j: number) => j !== i);
                      onFieldUpdate("infrastructure", "laboratories", updated);
                    }} className="text-destructive/70 hover:text-destructive text-lg leading-none flex-shrink-0">×</button>
                  </div>
                  {formErrors[`infrastructure.laboratories.${i}`] && <p className="text-xs text-destructive">{formErrors[`infrastructure.laboratories.${i}`]}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hostel */}
      <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
        <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Hostel Capacity</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div data-error-field="infrastructure.hostelBoys">
            <Label>Boys</Label>
            <Input type="text" inputMode="numeric" value={formData.infrastructure.hostelBoys || ""} onChange={(e) => onFieldUpdate("infrastructure", "hostelBoys", parseInt(e.target.value) || 0)} placeholder="e.g. 500" className={formErrors["infrastructure.hostelBoys"] ? "border-destructive" : ""} />
            {formErrors["infrastructure.hostelBoys"] && <p className="text-xs text-destructive mt-1">{formErrors["infrastructure.hostelBoys"]}</p>}
          </div>
          <div data-error-field="infrastructure.hostelGirls">
            <Label>Girls</Label>
            <Input type="text" inputMode="numeric" value={formData.infrastructure.hostelGirls || ""} onChange={(e) => onFieldUpdate("infrastructure", "hostelGirls", parseInt(e.target.value) || 0)} placeholder="e.g. 500" className={formErrors["infrastructure.hostelGirls"] ? "border-destructive" : ""} />
            {formErrors["infrastructure.hostelGirls"] && <p className="text-xs text-destructive mt-1">{formErrors["infrastructure.hostelGirls"]}</p>}
          </div>
        </div>
      </div>

      {/* Facilities */}
      <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Facilities</h4>
          <Button type="button" variant="outline" size="sm" onClick={() => onFieldUpdate("infrastructure", "facilities", [...(formData.infrastructure.facilities || []), ""])}>+ Add Extra</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { key: "cafeteria", label: "Cafeteria" },
            { key: "wifiCampus", label: "WiFi Campus" },
            { key: "transportation", label: "Transportation" },
          ].map((item) => (
            <label key={item.key} className="flex items-center gap-3 rounded-md border border-border/60 p-3 cursor-pointer hover:bg-muted/50 transition-colors">
              <Checkbox checked={formData.infrastructure[item.key]} onCheckedChange={(checked) => onFieldUpdate("infrastructure", item.key, checked)} />
              <span className="text-sm">{item.label}</span>
            </label>
          ))}
          {formData.infrastructure.facilities?.map((name: string, i: number) => (
            <div key={i} data-error-field={`infrastructure.facilities.${i}`} className={`flex flex-col gap-1 rounded-md border p-3 ${formErrors[`infrastructure.facilities.${i}`] ? "border-destructive" : "border-border/60"}`}>
              <div className="flex items-center gap-2">
                <Input value={name} onChange={(e) => {
                  const updated = [...(formData.infrastructure.facilities || [])]; updated[i] = e.target.value;
                  onFieldUpdate("infrastructure", "facilities", updated);
                }} placeholder="Facility name" className={`h-7 text-sm flex-1 min-w-0 ${formErrors[`infrastructure.facilities.${i}`] ? "border-destructive" : ""}`} />
                <button type="button" onClick={() => {
                  const updated = (formData.infrastructure.facilities || []).filter((_: string, j: number) => j !== i);
                  onFieldUpdate("infrastructure", "facilities", updated);
                }} className="text-destructive/70 hover:text-destructive text-lg leading-none flex-shrink-0">×</button>
              </div>
              {formErrors[`infrastructure.facilities.${i}`] && <p className="text-xs text-destructive">{formErrors[`infrastructure.facilities.${i}`]}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
