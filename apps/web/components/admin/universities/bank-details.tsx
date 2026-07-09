"use client";

import React from "react";
import { Button, Input } from "@repo/ui";
import { Country } from "country-state-city";
import { getBankConfig } from "@repo/shared-types";
import { InfoRow, SectionHeading } from "./ui";
import { Building, Globe, Hash, Plus, MapPin, FileText } from "lucide-react";

interface Props {
  admin: any;
  countryName: string | null | undefined;
  bankEditing: boolean;
  bankForm: Record<string, string>;
  bankShowAddField: boolean;
  bankNewKey: string;
  bankNewValue: string;
  bankSaving: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => Promise<void>;
  onFieldChange: (field: string, val: string) => void;
  onAddField: () => Promise<void>;
  onSetShowAddField: (v: boolean) => void;
  onSetNewKey: (v: string) => void;
  onSetNewValue: (v: string) => void;
}

export function BankDetailsCard({
  admin,
  countryName,
  bankEditing,
  bankForm,
  bankShowAddField,
  bankNewKey,
  bankNewValue,
  bankSaving,
  onEdit,
  onCancel,
  onSave,
  onFieldChange,
  onAddField,
  onSetShowAddField,
  onSetNewKey,
  onSetNewValue,
}: Props) {
  /* resolve country code */
  const raw = (admin?.bankCountry || countryName || "").trim();
  const isCode = raw.length === 2;
  const ctry = isCode
    ? Country.getCountryByCode(raw.toUpperCase())
    : Country.getAllCountries().find((c) => c.name.toLowerCase() === raw.toLowerCase());
  const code = ctry?.isoCode || null;
  const config = code && code !== "IN" ? getBankConfig(code) : undefined;

  const bd = admin?.bankDetails as Record<string, any> | null | undefined;
  const details = bd && typeof bd === "object" && !Array.isArray(bd) ? bd : {};

  /* ── EDIT MODE ── */
  if (bankEditing) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="p-4 sm:p-5 space-y-3">
          <SectionHeading icon={Building} title="Bank Account Details" />
          {config ? (
            config.fields.map((f: any) => (
              <div key={f.name}>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">{f.label}</p>
                <Input value={bankForm[f.name] || ""} onChange={(e) => onFieldChange(f.name, e.target.value)} placeholder={f.placeholder} className="h-8 text-xs" />
              </div>
            ))
          ) : (
            <>
              <BankField label="Account Name" value={bankForm.accountName || ""} onChange={(v) => onFieldChange("accountName", v)} />
              <BankField label="Account Number" value={bankForm.accountNumber || ""} onChange={(v) => onFieldChange("accountNumber", v)} />
              <BankField label="Bank Name" value={bankForm.bankName || ""} onChange={(v) => onFieldChange("bankName", v)} />
              <BankField label="Branch" value={bankForm.bankBranch || ""} onChange={(v) => onFieldChange("bankBranch", v)} />
              <BankField label="IFSC Code" value={bankForm.ifscCode || ""} onChange={(v) => onFieldChange("ifscCode", v)} />
              <BankField label="GST Number" value={bankForm.gstNumber || ""} onChange={(v) => onFieldChange("gstNumber", v)} />
              <BankField label="PAN Number" value={bankForm.panNumber || ""} onChange={(v) => onFieldChange("panNumber", v)} />
            </>
          )}
          <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
            <Button size="sm" className="bg-indigo-700 text-white h-8 text-xs" onClick={onSave} disabled={bankSaving}>{bankSaving ? "Saving..." : "Save"}</Button>
            <Button size="sm" variant="outline" className="h-8 text-xs" onClick={onCancel}>Cancel</Button>
          </div>
        </div>
      </div>
    );
  }

  /* ── VIEW MODE ── */
  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="p-4 sm:p-5 space-y-3">
        <SectionHeading icon={Building} title="Bank Account Details" onEdit={onEdit} />

        {config ? (
          /* Foreign country: config-based fields */
          <>
            <InfoRow icon={Globe} label="Country" value={config.countryName} />
            {config.fields.map((f: any) => (
              <InfoRow key={f.name} icon={Hash} label={f.label} value={details[f.name] || "—"} />
            ))}
            {Object.keys(details).filter((k) => !config.fields.some((f: any) => f.name === k)).length > 0 && (
              <div className="border-t border-gray-200 pt-3 mt-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Additional Details</p>
                <div className="space-y-1.5">
                  {Object.entries(details).filter(([k]) => !config.fields.some((f: any) => f.name === k)).map(([k, v]) => (
                    <InfoRow key={k} icon={Hash} label={k} value={String(v ?? "") || "—"} />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          /* India / fallback */
          <>
            <InfoRow icon={Building} label="Account Name" value={admin?.accountName || "—"} />
            <InfoRow icon={Hash} label="Account Number" value={admin?.accountNumber || "—"} />
            <InfoRow icon={Building} label="Bank Name" value={admin?.bankName || "—"} />
            <InfoRow icon={MapPin} label="Branch" value={admin?.bankBranch || "—"} />
            <InfoRow icon={FileText} label="IFSC Code" value={admin?.ifscCode || "—"} />
            {admin?.gstNumber && <InfoRow icon={FileText} label="GST Number" value={admin.gstNumber} />}
            {admin?.panNumber && <InfoRow icon={FileText} label="PAN Number" value={admin.panNumber} />}
            {admin?.bankCountry && <InfoRow icon={Globe} label="Bank Country" value={admin.bankCountry} />}
            {Object.keys(details).length > 0 && (
              <div className="border-t border-gray-200 pt-3 mt-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Additional Bank Details</p>
                <div className="space-y-1.5">
                  {Object.entries(details).map(([k, v]) => (
                    <InfoRow key={k} icon={Hash} label={k} value={String(v ?? "") || "—"} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Add Extra Field */}
        {!bankShowAddField ? (
          <button onClick={() => onSetShowAddField(true)} className="flex items-center gap-1.5 text-xs font-medium text-indigo-700 hover:text-indigo-900 mt-2">
            <Plus className="h-3 w-3" /> Add Extra Field
          </button>
        ) : (
          <div className="border-t border-gray-200 pt-3 mt-1 space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">New Field</p>
            <div className="flex items-center gap-2">
              <Input placeholder="Field name" value={bankNewKey} onChange={(e) => onSetNewKey(e.target.value)} className="flex-1 text-xs h-8" />
              <Input placeholder="Value" value={bankNewValue} onChange={(e) => onSetNewValue(e.target.value)} className="flex-1 text-xs h-8" />
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" className="bg-indigo-700 text-white h-7 text-xs" onClick={onAddField}>Save</Button>
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => { onSetShowAddField(false); onSetNewKey(""); onSetNewValue(""); }}>Cancel</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* internal: single bank field input */
function BankField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">{label}</p>
      <Input value={value} onChange={(e) => onChange(e.target.value)} className="h-8 text-xs" />
    </div>
  );
}
