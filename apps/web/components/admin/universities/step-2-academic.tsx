"use client";

import { Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Country } from "country-state-city";
import type { WizardStepProps } from "./new-page.types";

const UNIVERSAL_MEDIUMS = [
  "English",
  "Hindi",
  "Russian",
  "French",
  "Spanish",
  "Arabic",
  "Chinese",
  "German",
  "Portuguese",
  "Japanese",
  "Korean",
  "Italian",
  "Turkish",
  "Bengali",
  "Urdu",
  "Kazakh",
  "Uzbek",
  "Ukrainian",
  "Swahili",
  "Amharic",
];

export function AcademicStep({ formData, formErrors, onFieldUpdate, onRootFieldUpdate, onSetFormErrors }: WizardStepProps) {
  const isOtherMedium = formData?.academic?.medium?.startsWith("Other:");
  const otherMediumValue = isOtherMedium ? formData.academic.medium.replace("Other:", "") : "";

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Program Information */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Program Information</h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              onFieldUpdate("academic", "programs", [
                ...(formData.academic.programs || []),
                { name: "", duration: "5.5 years", annualTuition: 0, registration: 0, totalSeats: 0, governmentSeats: 0, managementSeats: 0, nriSeats: 0, feeBreakdown: [] },
              ]);
              const currentEligibility = formData.admission?.programEligibility || [];
              onFieldUpdate("admission", "programEligibility", [
                ...currentEligibility,
                { minimumMarks: "", eligibility: "" }
              ]);
            }}
          >
            + Add Program
          </Button>
        </div>
        {(!formData.academic.programs || formData.academic.programs.length === 0) ? (
          <div className="rounded-lg border border-dashed border-border/60 bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">No programs added yet. Click "Add Program" to add MBBS, etc.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {formData.academic.programs.map((prog: any, i: number) => (
              <div key={i} className="rounded-lg border border-border/60 bg-card p-3 space-y-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-semibold text-foreground/60 uppercase tracking-wide">Program {i + 1}</h5>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = formData.academic.programs.filter((_: any, j: number) => j !== i);
                      onFieldUpdate("academic", "programs", updated);
                      const updatedEligibility = (formData.admission?.programEligibility || [])
                        .filter((_: any, j: number) => j !== i);
                      onFieldUpdate("admission", "programEligibility", updatedEligibility);
                    }}
                    className="text-destructive/70 hover:text-destructive text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label>Program Name *</Label>
                    <Input
                      value={prog.name}
                      onChange={(e) => {
                        const updated = [...formData.academic.programs];
                        updated[i] = { ...updated[i], name: e.target.value };
                        onFieldUpdate("academic", "programs", updated);
                      }}
                      placeholder="e.g. MBBS"
                    />
                  </div>
                  <div>
                    <Label>Duration *</Label>
                    <Select
                      value={prog.duration}
                      onValueChange={(v) => {
                        const updated = [...formData.academic.programs];
                        updated[i] = { ...updated[i], duration: v };
                        onFieldUpdate("academic", "programs", updated);
                      }}
                    >
                      <SelectTrigger><SelectValue placeholder="Select duration" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4.5 years">4.5 years</SelectItem>
                        <SelectItem value="5 years">5 years</SelectItem>
                        <SelectItem value="5.5 years">5.5 years</SelectItem>
                        <SelectItem value="6 years">6 years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div data-error-field={`academic.programs.${i}.annualTuition`}>
                    <Label>Annual Fees *</Label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={prog.annualTuition || ""}
                      onChange={(e) => {
                        const updated = [...formData.academic.programs];
                        updated[i] = { ...updated[i], annualTuition: parseFloat(e.target.value) || 0 };
                        onFieldUpdate("academic", "programs", updated);
                      }}
                      placeholder="e.g. 500000"
                      className={formErrors[`academic.programs.${i}.annualTuition`] || formErrors[`academic.programs.${i}.feeBreakdown`] ? "border-destructive" : ""}
                    />
                    {formErrors[`academic.programs.${i}.annualTuition`] && (
                      <p className="text-xs text-destructive mt-1">{formErrors[`academic.programs.${i}.annualTuition`]}</p>
                    )}
                  </div>
                  <div>
                    <Label>Registration *</Label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={prog.registration || ""}
                      onChange={(e) => {
                        const updated = [...formData.academic.programs];
                        updated[i] = { ...updated[i], registration: parseFloat(e.target.value) || 0 };
                        onFieldUpdate("academic", "programs", updated);
                      }}
                      placeholder="e.g. 25000"
                    />
                  </div>
                  <div data-error-field={`academic.programs.${i}.totalSeats`}>
                    <Label>Total Seats *</Label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={prog.totalSeats || ""}
                      onChange={(e) => {
                        const updated = [...formData.academic.programs];
                        updated[i] = { ...updated[i], totalSeats: parseInt(e.target.value) || 0 };
                        onFieldUpdate("academic", "programs", updated);
                      }}
                      placeholder="e.g. 150"
                      className={formErrors[`academic.programs.${i}.totalSeats`] || formErrors[`academic.programs.${i}.seats`] ? "border-destructive" : ""}
                    />
                    {formErrors[`academic.programs.${i}.totalSeats`] && (
                      <p className="text-xs text-destructive mt-1">{formErrors[`academic.programs.${i}.totalSeats`]}</p>
                    )}
                    {formErrors[`academic.programs.${i}.seats`] && (
                      <p className="text-xs text-destructive mt-1">{formErrors[`academic.programs.${i}.seats`]}</p>
                    )}
                  </div>
                </div>
                {/* Seat Distribution */}
                <div data-error-field={`academic.programs.${i}.seats`} className={`grid grid-cols-1 sm:grid-cols-3 gap-3 ${formErrors[`academic.programs.${i}.seats`] ? "border border-destructive rounded-lg p-2" : ""}`}>
                  <div>
                    <Label>Govt Seats *</Label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={prog.governmentSeats || ""}
                      onChange={(e) => {
                        const updated = [...formData.academic.programs];
                        updated[i] = { ...updated[i], governmentSeats: parseInt(e.target.value) || 0 };
                        onFieldUpdate("academic", "programs", updated);
                      }}
                      placeholder="0"
                      className={formErrors[`academic.programs.${i}.seats`] ? "border-destructive" : ""}
                    />
                  </div>
                  <div>
                    <Label>Management Seats *</Label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={prog.managementSeats || ""}
                      onChange={(e) => {
                        const updated = [...formData.academic.programs];
                        updated[i] = { ...updated[i], managementSeats: parseInt(e.target.value) || 0 };
                        onFieldUpdate("academic", "programs", updated);
                      }}
                      placeholder="0"
                      className={formErrors[`academic.programs.${i}.seats`] ? "border-destructive" : ""}
                    />
                  </div>
                  <div>
                    <Label>NRI Seats *</Label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={prog.nriSeats || ""}
                      onChange={(e) => {
                        const updated = [...formData.academic.programs];
                        updated[i] = { ...updated[i], nriSeats: parseInt(e.target.value) || 0 };
                        onFieldUpdate("academic", "programs", updated);
                      }}
                      placeholder="0"
                      className={formErrors[`academic.programs.${i}.seats`] ? "border-destructive" : ""}
                    />
                  </div>
                  {formErrors[`academic.programs.${i}.seats`] && (
                    <div className="sm:col-span-3">
                      <p className="text-xs text-destructive">{formErrors[`academic.programs.${i}.seats`]}</p>
                    </div>
                  )}
                </div>

                {/* Per-Program Fee Breakdown */}
                <div data-error-field={`academic.programs.${i}.feeBreakdown`} className={`border-t border-border/40 pt-3 ${formErrors[`academic.programs.${i}.feeBreakdown`] ? "border-destructive" : ""}`}>
                  <div className="flex items-center justify-between mb-2">
                    <Label className={`text-xs ${formErrors[`academic.programs.${i}.feeBreakdown`] ? "text-destructive" : "text-muted-foreground"}`}>
                      Fee Breakdown {prog.annualTuition > 0 && "*"}
                      {prog.annualTuition > 0 && (
                        <span className="ml-1 text-muted-foreground">
                          (Sum must equal {prog.annualTuition})
                        </span>
                      )}
                    </Label>
                    {formErrors[`academic.programs.${i}.feeBreakdown`] && (
                      <p className="text-xs text-destructive">{formErrors[`academic.programs.${i}.feeBreakdown`]}</p>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const updated = [...formData.academic.programs];
                        const uid = crypto.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
                        updated[i] = {
                          ...updated[i],
                          feeBreakdown: [...(updated[i].feeBreakdown || []), { id: uid, name: "", amount: 0 }],
                        };
                        onFieldUpdate("academic", "programs", updated);
                      }}
                    >
                      + Add Item
                    </Button>
                  </div>
                  {(!prog.feeBreakdown || prog.feeBreakdown.length === 0) ? (
                    <p className="text-xs text-muted-foreground">No fee breakdown items yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {prog.feeBreakdown.map((item: any, fi: number) => {
                        const itemError = formErrors[`academic.programs.${i}.feeBreakdown.${fi}`];
                        return (
                          <div key={item.id || fi} data-error-field={`academic.programs.${i}.feeBreakdown.${fi}`} className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Input
                                value={item.name}
                                onChange={(e) => {
                                  const updated = [...formData.academic.programs];
                                  updated[i].feeBreakdown = [...(updated[i].feeBreakdown || [])];
                                  updated[i].feeBreakdown[fi] = { ...updated[i].feeBreakdown[fi], name: e.target.value };
                                  onFieldUpdate("academic", "programs", updated);
                                  if (e.target.value && formErrors[`academic.programs.${i}.feeBreakdown.${fi}`]) {
                                    onSetFormErrors((prev: any) => ({ ...prev, [`academic.programs.${i}.feeBreakdown.${fi}`]: undefined }));
                                  }
                                }}
                                placeholder="Fee name"
                                className={`flex-1 ${itemError || (!item.name && item.amount) ? "border-destructive" : ""}`}
                              />
                              <Input
                                type="text"
                                inputMode="numeric"
                                value={item.amount || ""}
                                onChange={(e) => {
                                  const updated = [...formData.academic.programs];
                                  updated[i].feeBreakdown = [...(updated[i].feeBreakdown || [])];
                                  updated[i].feeBreakdown[fi] = { ...updated[i].feeBreakdown[fi], amount: parseFloat(e.target.value) || 0 };
                                  onFieldUpdate("academic", "programs", updated);
                                  if (e.target.value && formErrors[`academic.programs.${i}.feeBreakdown.${fi}`]) {
                                    onSetFormErrors((prev: any) => ({ ...prev, [`academic.programs.${i}.feeBreakdown.${fi}`]: undefined }));
                                  }
                                }}
                                placeholder="Amount"
                                className={`w-28 ${itemError || (item.name && !item.amount) ? "border-destructive" : ""}`}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...formData.academic.programs];
                                  updated[i].feeBreakdown = (updated[i].feeBreakdown || []).filter((_: any, k: number) => k !== fi);
                                  onFieldUpdate("academic", "programs", updated);
                                }}
                                className="text-destructive/70 hover:text-destructive text-lg leading-none flex-shrink-0"
                              >
                                ×
                              </button>
                            </div>
                            {(itemError || (!item.name && item.amount) || (item.name && !item.amount)) && (
                              <p className="text-xs text-destructive">
                                {itemError || "Name and amount are required"}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Medium of Instruction (Universal) */}
      <div data-error-field="academic.medium" className="rounded-lg border border-border/60 bg-card p-3 sm:p-4">
        <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide mb-3">Medium of Instruction *</h4>
        <div className="max-w-xs">
          <Select
            value={isOtherMedium ? "Other" : formData.academic.medium}
            onValueChange={(v) => {
              if (v === "Other") {
                onFieldUpdate("academic", "medium", "Other:");
              } else {
                onFieldUpdate("academic", "medium", v);
              }
              if (v && formErrors["academic.medium"]) {
                onSetFormErrors((prev: any) => ({ ...prev, "academic.medium": undefined }));
              }
            }}
          >
            <SelectTrigger className={formErrors["academic.medium"] ? "border-destructive" : ""}>
              <SelectValue placeholder="Select medium" />
            </SelectTrigger>
            <SelectContent>
              {UNIVERSAL_MEDIUMS.map((lang: string) => (
                <SelectItem key={lang} value={lang}>{lang}</SelectItem>
              ))}
              <SelectItem value="Other">Others</SelectItem>
            </SelectContent>
          </Select>
          {formErrors["academic.medium"] && (
            <p className="text-xs text-destructive mt-1">{formErrors["academic.medium"]}</p>
          )}
          {isOtherMedium && (
            <Input
              value={otherMediumValue}
              onChange={(e) => onFieldUpdate("academic", "medium", `Other:${e.target.value}`)}
              placeholder="Type the medium of instruction"
              className="mt-2"
            />
          )}
        </div>
      </div>

      {/* Student Demographics */}
      <div data-error-field="studentDemographics" className={`rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4 ${formErrors["studentDemographics.total"] || formErrors["studentDemographics.breakdown"] ? "border-destructive" : ""}`}>
        <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Student Demographics</h4>
        {(formErrors["studentDemographics.total"] || formErrors["studentDemographics.breakdown"]) && (
          <p className="text-xs text-destructive">{formErrors["studentDemographics.total"] || formErrors["studentDemographics.breakdown"]}</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div data-error-field="studentDemographics.total">
            <Label>Total Students</Label>
            <Input
              type="text"
              inputMode="numeric"
              value={formData.studentDemographics.totalStudents || ""}
              onChange={(e) =>
                onRootFieldUpdate("studentDemographics", { ...formData.studentDemographics, totalStudents: parseInt(e.target.value) || 0 })
              }
              placeholder="e.g. 5000"
              className={formErrors["studentDemographics.total"] ? "border-destructive" : ""}
            />
          </div>
          <div>
            <Label>Local Students</Label>
            <Input
              type="text"
              inputMode="numeric"
              value={formData.studentDemographics.localStudents || ""}
              onChange={(e) =>
                onRootFieldUpdate("studentDemographics", { ...formData.studentDemographics, localStudents: parseInt(e.target.value) || 0 })
              }
              placeholder="e.g. 3500"
              className={formErrors["studentDemographics.total"] ? "border-destructive" : ""}
            />
          </div>
          <div>
            <Label>Foreign Students</Label>
            <Input
              type="text"
              inputMode="numeric"
              value={formData.studentDemographics.foreignStudents || ""}
              onChange={(e) =>
                onRootFieldUpdate("studentDemographics", { ...formData.studentDemographics, foreignStudents: parseInt(e.target.value) || 0 })
              }
              placeholder="e.g. 1500"
              className={formErrors["studentDemographics.total"] || formErrors["studentDemographics.breakdown"] ? "border-destructive" : ""}
            />
          </div>
        </div>

        {/* Foreign By Country */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs text-muted-foreground">Breakdown by Country</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                onRootFieldUpdate("studentDemographics", {
                  ...formData.studentDemographics,
                  foreignByCountry: [...formData.studentDemographics.foreignByCountry, { country: "", count: 0 }],
                })
              }
            >
              + Add Country
            </Button>
          </div>
          {formData.studentDemographics.foreignByCountry.map((entry: any, ci: number) => {
            const countryError = formErrors[`studentDemographics.foreignByCountry.${ci}`];
            return (
              <div key={ci} data-error-field={`studentDemographics.foreignByCountry.${ci}`} className="mb-2 space-y-1">
                <div className="flex items-center gap-2">
                  <div className={`flex-1 ${countryError || (!entry.country && entry.count) ? "border-destructive" : ""}`}>
                    <SearchableSelect
                      options={Country.getAllCountries().map((c) => ({ label: c.name, value: c.isoCode }))}
                      value={Country.getAllCountries().find((c) => c.name === entry.country)?.isoCode ?? ""}
                      onChange={(code) => {
                        const name = Country.getCountryByCode(code)?.name || "";
                        onRootFieldUpdate("studentDemographics", {
                          ...formData.studentDemographics,
                          foreignByCountry: formData.studentDemographics.foreignByCountry.map((e: any, j: number) =>
                            j === ci ? { ...e, country: name } : e
                          ),
                        });
                        if (name && formErrors[`studentDemographics.foreignByCountry.${ci}`]) {
                          onSetFormErrors((prev: any) => ({ ...prev, [`studentDemographics.foreignByCountry.${ci}`]: undefined }));
                        }
                      }}
                      placeholder="Search country..."
                    />
                  </div>
                  <Input
                    className={`w-24 ${countryError || (entry.country && !entry.count) ? "border-destructive" : ""}`}
                    type="text"
                    inputMode="numeric"
                    value={entry.count || ""}
                    onChange={(e) => {
                      const count = parseInt(e.target.value) || 0;
                      onRootFieldUpdate("studentDemographics", {
                        ...formData.studentDemographics,
                        foreignByCountry: formData.studentDemographics.foreignByCountry.map((e: any, j: number) =>
                          j === ci ? { ...e, count } : e
                        ),
                      });
                      if (count > 0 && formErrors[`studentDemographics.foreignByCountry.${ci}`]) {
                        onSetFormErrors((prev: any) => ({ ...prev, [`studentDemographics.foreignByCountry.${ci}`]: undefined }));
                      }
                    }}
                    placeholder="Count"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-500"
                    onClick={() =>
                      onRootFieldUpdate("studentDemographics", {
                        ...formData.studentDemographics,
                        foreignByCountry: formData.studentDemographics.foreignByCountry.filter((_: any, j: number) => j !== ci),
                      })
                    }
                  >
                    ✕
                  </Button>
                </div>
                {(countryError || (!entry.country && entry.count) || (entry.country && !entry.count)) && (
                  <p className="text-xs text-destructive">
                    {countryError || "Country name and student count are required"}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
