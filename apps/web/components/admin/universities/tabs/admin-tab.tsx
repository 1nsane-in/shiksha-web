"use client";

import React, { useState } from "react";
import { Card, CardContent, Input, Button } from "@repo/ui";
import { SectionHeading, InfoRow } from "@/components/admin/universities/ui";
import { Country } from "country-state-city";
import { getBankConfig } from "@repo/shared-types";
import { toast } from "sonner";
import { UserCog, Briefcase, Mail, Phone, Building, Globe, Hash, FileText, MapPin, Plus, X } from "lucide-react";

interface Props {
  admin: any;
  loc: any;
  uniId: string;
  router: any;
  onSaveBank: (data: any) => Promise<void>;
  onAddBankField: (details: Record<string, any>) => Promise<void>;
}

export function AdminTab({ admin: ad, loc, uniId, router, onSaveBank, onAddBankField }: Props) {
  const [bankEditing, setBankEditing] = useState(false);
  const [bankForm, setBankForm] = useState<Record<string, string>>({});
  const [bankSaving, setBankSaving] = useState(false);
  const [showAddField, setShowAddField] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const startEdit = () => {
    const fd: Record<string, string> = {};
    if (ad) {
      fd.accountName = ad.accountName || "";
      fd.accountNumber = ad.accountNumber || "";
      fd.bankName = ad.bankName || "";
      fd.bankBranch = ad.bankBranch || "";
      fd.ifscCode = ad.ifscCode || "";
      if (ad.gstNumber) fd.gstNumber = ad.gstNumber;
      if (ad.panNumber) fd.panNumber = ad.panNumber;
      if (ad.bankCountry) fd.bankCountry = ad.bankCountry;
      const bd = ad.bankDetails as Record<string, any> | null | undefined;
      if (bd && typeof bd === "object" && !Array.isArray(bd)) {
        Object.entries(bd).forEach(([k, v]) => { fd[k] = String(v ?? ""); });
      }
    }
    setBankForm(fd);
    setBankEditing(true);
  };

  const cancelEdit = () => {
    setBankEditing(false);
    setBankForm({});
    setShowAddField(false);
    setNewKey("");
    setNewValue("");
  };

  const handleSave = async () => {
    const raw = (ad?.bankCountry || loc?.country || "").trim();
    const isCode = raw.length === 2;
    const ctry = isCode
      ? Country.getCountryByCode(raw.toUpperCase())
      : Country.getAllCountries().find((c: any) => c.name.toLowerCase() === raw.toLowerCase());
    const code = ctry?.isoCode || null;
    const config = code && code !== "IN" ? getBankConfig(code) : undefined;

    setBankSaving(true);
    try {
      if (config) {
        const details: Record<string, any> = {};
        config.fields.forEach((f: any) => {
          if (bankForm[f.name] !== undefined) details[f.name] = bankForm[f.name];
        });
        await onSaveBank({ bankDetails: details, bankCountry: code });
      } else {
        await onSaveBank({
          accountName: bankForm.accountName || "",
          accountNumber: bankForm.accountNumber || "",
          bankName: bankForm.bankName || "",
          bankBranch: bankForm.bankBranch || "",
          ifscCode: bankForm.ifscCode || "",
          gstNumber: bankForm.gstNumber || "",
          panNumber: bankForm.panNumber || "",
        });
      }
      toast.success("Bank details saved");
      setBankEditing(false);
      setBankForm({});
    } catch {
      toast.error("Failed to save bank details");
    } finally {
      setBankSaving(false);
    }
  };

  const handleAddField = async () => {
    if (!newKey.trim()) return;
    const existing = ad?.bankDetails as Record<string, any> | null | undefined;
    const currentDetails = existing && typeof existing === "object" && !Array.isArray(existing)
      ? { ...existing }
      : {};
    currentDetails[newKey.trim()] = newValue;
    try {
      await onAddBankField(currentDetails);
      toast.success("Bank detail added");
      setNewKey("");
      setNewValue("");
      setShowAddField(false);
    } catch {
      toast.error("Failed to add bank detail");
    }
  };

  const resolveCountry = () => {
    const raw = (ad?.bankCountry || loc?.country || "").trim();
    const isCode = raw.length === 2;
    const ctry = isCode
      ? Country.getCountryByCode(raw.toUpperCase())
      : Country.getAllCountries().find((c: any) => c.name.toLowerCase() === raw.toLowerCase());
    const code = ctry?.isoCode || null;
    return code && code !== "IN" ? getBankConfig(code) : undefined;
  };

  return (
    <div className="space-y-6">
      {ad ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card size="sm" className="border-[#ECEAE6]">
            <CardContent className="space-y-3 p-4 sm:p-5">
              <SectionHeading icon={UserCog} title="Point of Contact" onEdit={() => router.push("/admin/universities/" + uniId + "/edit")} />
              <InfoRow icon={UserCog} label="POC Name" value={ad.pocName} />
              <InfoRow icon={Briefcase} label="Designation" value={ad.pocDesignation} />
              <InfoRow icon={Mail} label="POC Email" value={ad.pocEmail} />
              {ad.pocPhone && <InfoRow icon={Phone} label="POC Phone" value={ad.pocPhone} />}
              <InfoRow icon={Phone} label="Phone Number" value={ad.phoneCountryCode + " " + ad.phoneNumber} />
            </CardContent>
          </Card>
          <Card size="sm" className="border-[#ECEAE6]">
            <CardContent className="space-y-3 p-4 sm:p-5">
              <SectionHeading icon={Building} title="Bank Account Details" onEdit={startEdit} />
              {(() => {
                const config = resolveCountry();
                const bd = ad.bankDetails as Record<string, any> | null | undefined;
                const details = bd && typeof bd === "object" && !Array.isArray(bd) ? bd : {};

                if (bankEditing) {
                  const updateField = (field: string, val: string) => setBankForm((prev) => ({ ...prev, [field]: val }));
                  return (
                    <>
                      {config ? config.fields.map((f: any) => (
                        <div key={f.name}>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-0.5">{f.label}</p>
                          <Input value={bankForm[f.name] || ""} onChange={(e) => updateField(f.name, e.target.value)} placeholder={f.placeholder} className="h-8 text-xs" />
                        </div>
                      )) : (
                        <>
                          {["accountName","accountNumber","bankName","bankBranch","ifscCode","gstNumber","panNumber"].map((field) => (
                            <div key={field}>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-0.5">{field.replace(/([A-Z])/g, " ").replace(/^./, (s) => s.toUpperCase())}</p>
                              <Input value={bankForm[field] || ""} onChange={(e) => updateField(field, e.target.value)} className="h-8 text-xs" />
                            </div>
                          ))}
                        </>
                      )}
                      <div className="flex items-center gap-2 pt-2 border-t border-[#ECEAE6]">
                        <Button size="sm" className="bg-[#3730A3] text-white h-8 text-xs" onClick={handleSave} disabled={bankSaving}>{bankSaving ? "Saving..." : "Save"}</Button>
                        <Button size="sm" variant="outline" className="h-8 text-xs" onClick={cancelEdit}>Cancel</Button>
                      </div>
                    </>
                  );
                }

                if (config) {
                  const known = new Set(config.fields.map((f: any) => f.name));
                  const extras = Object.entries(details).filter(([k]) => !known.has(k));
                  return (
                    <>
                      <InfoRow icon={Globe} label="Country" value={config.countryName} />
                      {config.fields.map((f: any) => <InfoRow key={f.name} icon={Hash} label={f.label} value={details[f.name] || "—"} />)}
                      {extras.length > 0 && (
                        <div className="border-t border-[#ECEAE6] pt-3 mt-1">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">Additional Details</p>
                          <div className="space-y-1.5">{extras.map(([k, v]) => <InfoRow key={k} icon={Hash} label={k} value={String(v ?? "") || "—"} />)}</div>
                        </div>
                      )}
                    </>
                  );
                }

                const extraEntries = Array.isArray(bd) ? bd.filter((e: any) => e.key) : Object.entries(bd || {}).map(([k, v]) => ({ key: k, value: String(v ?? "") }));
                return (
                  <>
                    <InfoRow icon={Building} label="Account Name" value={ad.accountName || "—"} />
                    <InfoRow icon={Hash} label="Account Number" value={ad.accountNumber || "—"} />
                    <InfoRow icon={Building} label="Bank Name" value={ad.bankName || "—"} />
                    <InfoRow icon={MapPin} label="Branch" value={ad.bankBranch || "—"} />
                    <InfoRow icon={FileText} label="IFSC Code" value={ad.ifscCode || "—"} />
                    {ad.gstNumber && <InfoRow icon={FileText} label="GST Number" value={ad.gstNumber} />}
                    {ad.panNumber && <InfoRow icon={FileText} label="PAN Number" value={ad.panNumber} />}
                    {ad.bankCountry && <InfoRow icon={Globe} label="Bank Country" value={ad.bankCountry} />}
                    {extraEntries.length > 0 && (
                      <div className="border-t border-[#ECEAE6] pt-3 mt-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">Additional Bank Details</p>
                        <div className="space-y-1.5">{extraEntries.map((item: any, i: number) => <InfoRow key={i} icon={Hash} label={item.key} value={item.value || "—"} />)}</div>
                      </div>
                    )}
                  </>
                );
              })()}
              {!bankEditing && !showAddField && (
                <button onClick={() => setShowAddField(true)} className="flex items-center gap-1.5 text-xs font-medium text-[#3730A3] hover:text-[#312E81] mt-2">
                  <Plus className="h-3 w-3" /> Add Extra Field
                </button>
              )}
              {!bankEditing && showAddField && (
                <div className="border-t border-[#ECEAE6] pt-3 mt-1 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">New Field</p>
                  <div className="flex items-center gap-2">
                    <Input placeholder="Field name" value={newKey} onChange={(e) => setNewKey(e.target.value)} className="flex-1 text-xs h-8" />
                    <Input placeholder="Value" value={newValue} onChange={(e) => setNewValue(e.target.value)} className="flex-1 text-xs h-8" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" className="bg-[#3730A3] text-white h-7 text-xs" onClick={handleAddField}>Save</Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => { setShowAddField(false); setNewKey(""); setNewValue(""); }}>Cancel</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card size="sm" className="border-[#ECEAE6]">
            <CardContent className="space-y-3 p-4 sm:p-5">
              <SectionHeading icon={UserCog} title="Point of Contact" onEdit={() => router.push("/admin/universities/" + uniId + "/edit")} />
              <InfoRow icon={UserCog} label="POC Name" value="—" />
              <InfoRow icon={Briefcase} label="Designation" value="—" />
              <InfoRow icon={Mail} label="POC Email" value="—" />
              <InfoRow icon={Phone} label="POC Phone" value="—" />
              <InfoRow icon={Phone} label="Phone Number" value="—" />
            </CardContent>
          </Card>
          <Card size="sm" className="border-[#ECEAE6]">
            <CardContent className="space-y-3 p-4 sm:p-5">
              <SectionHeading icon={Building} title="Bank Account Details" onEdit={() => router.push("/admin/universities/" + uniId + "/edit")} />
              {(() => {
                const config = resolveCountry();
                if (config) return <><InfoRow icon={Globe} label="Country" value={config.countryName} />{config.fields.map((f: any) => <InfoRow key={f.name} icon={Hash} label={f.label} value="—" />)}</>;
                return <>
                  <InfoRow icon={Building} label="Account Name" value="—" />
                  <InfoRow icon={Hash} label="Account Number" value="—" />
                  <InfoRow icon={Building} label="Bank Name" value="—" />
                  <InfoRow icon={MapPin} label="Branch" value="—" />
                  <InfoRow icon={FileText} label="IFSC Code" value="—" />
                  <InfoRow icon={FileText} label="GST Number" value="—" />
                  <InfoRow icon={FileText} label="PAN Number" value="—" />
                </>;
              })()}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
