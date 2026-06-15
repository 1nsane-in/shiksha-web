"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCreateUniversity } from "@/domains/universities";
import { Button } from "@repo/ui";
import { Input } from "@repo/ui";
import { Label } from "@repo/ui";
import { Textarea } from "@repo/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";
import { Checkbox } from "@repo/ui";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { Country, State, City } from "country-state-city";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  SUPPORTED_FOREIGN_BANK_COUNTRIES,
  getBankConfig,
  type BankFieldConfig,
} from "@repo/shared-types";

const steps = [
  "Basic Info",
  "Location & Contact",
  "Academic Details",
  "Recognition",
  "Fees",
  "Infrastructure",
  "Admission",
  "Support & Content",
  "Bank Details",
];

export default function NewUniversityPage() {
  const router = useRouter();

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

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const createUniversity = useCreateUniversity();
  const [imageKeys, setImageKeys] = useState<{ logo?: string; bannerImage?: string; brochure?: string }>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [locationCodes, setLocationCodes] = useState<{ countryCode: string; stateCode: string }>({ countryCode: "", stateCode: "" });
  const [selectedBankCountry, setSelectedBankCountry] = useState("");
  const [extraBankFields, setExtraBankFields] = useState<Array<{ key: string; value: string }>>([]);
  const getDefaultFormData = () => ({
    name: "",
    shortName: "",
    establishedYear: new Date().getFullYear(),
    type: "PRIVATE",
    website: "",
    logo: "",
    bannerImage: "",
    brochureUrl: "",
    location: {
      country: "",
      state: "",
      city: "",
      address: "",
    },
    contact: {
      email: "",
      phone: "",
      admissionOfficeHours: "Mon-Fri 9AM-5PM",
    },
    academic: {
      programs: [{ name: "MBBS", duration: "5.5 years", annualTuition: 0, registration: 0, totalSeats: 0, governmentSeats: 0, managementSeats: 0, nriSeats: 0, feeBreakdown: [] }],
      duration: "5.5 years",
      medium: "English",
      specializations: [],
      intakeMonths: ["August"],
    },
    recognition: {
      bodies: [],
      ecfmgStatus: "PENDING",
      nbaAccredited: false,
      accreditations: [],
      worldRankingSource: "",
      nationalRankingSource: "",
      otherRankingSource: "",
      otherNationalRankingSource: "",
      subjectRankings: [] as Array<{ subject: string; ranking: string }>,
    },
    fees: {
      currency: "INR",
      scholarshipAvailable: false,
      scholarships: [] as string[],
      paymentSchedule: "",
      refundPolicy: "",
      feeBreakdown: [] as Array<{ id: string; name: string; amount: number }>,
    },
    infrastructure: {
      departments: [] as string[],
      hostelBoys: 0,
      hostelGirls: 0,
      laboratories: [] as string[],
      facilities: [],
      cafeteria: false,
      wifiCampus: false,
      transportation: false,
    },
    admission: {
      entranceExams: ["NEET"],
      minimumMarks: "",
      ageCriteria: "",
      eligibility: "",
      requiredDocuments: [],
      applicationDeadline: "",
      applicationFee: 0,
      selectionProcess: "",
    },
    support: {
      topRecruiters: [],
      alumniNetwork: false,
      internationalStudentSupport: false,
      visaAssistance: false,
      languageSupport: [],
      extraServices: [] as string[],
      counselingServices: false,
      careerGuidance: false,
    },
    content: {
      shortDescription: "",
      longDescription: "",
      highlights: [],
      gallery: [],
    },
    admin: {
      pocName: "",
      pocDesignation: "",
      pocEmail: "",
      pocPhone: "",
      accountName: "",
      accountNumber: "",
      bankName: "",
      bankBranch: "",
      ifscCode: "",
      gstNumber: "",
      panNumber: "",
      commission: 0,
      bankCountry: "",
      bankDetails: {},
    },
    studentDemographics: {
      totalStudents: 0,
      localStudents: 0,
      foreignStudents: 0,
      foreignByCountry: [] as { country: string; count: number }[],
    },
    socialLinks: {
      facebook: "",
      instagram: "",
      youtube: "",
      linkedin: "",
      twitter: "",
      tiktok: "",
    },
  });

  const [formData, setFormData] = useState<any>(getDefaultFormData());

  const isOtherMedium = formData?.academic?.medium?.startsWith("Other:");
  const otherMediumValue = isOtherMedium ? formData.academic.medium.replace("Other:", "") : "";

  const STORAGE_KEY = "university-create-form";

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.formData) {
          const defaults = getDefaultFormData();
          const merged: any = { ...defaults };
          const d = defaults as Record<string, any>;
          for (const key of Object.keys(parsed.formData)) {
            const val = parsed.formData[key];
            if (val !== null && typeof val === "object" && !Array.isArray(val) && d[key] && typeof d[key] === "object") {
              merged[key] = { ...d[key], ...val };
            } else {
              merged[key] = val;
            }
          }
          setFormData(merged);
        }
        if (parsed.currentStep !== undefined) setCurrentStep(parsed.currentStep);
        if (parsed.locationCodes) setLocationCodes(parsed.locationCodes);
        if (parsed.selectedBankCountry !== undefined) setSelectedBankCountry(parsed.selectedBankCountry);
        if (parsed.imageKeys) setImageKeys(parsed.imageKeys);
        if (parsed.extraBankFields) setExtraBankFields(parsed.extraBankFields);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            formData,
            currentStep,
            locationCodes,
            selectedBankCountry,
            imageKeys,
            extraBankFields,
          })
        );
      } catch {}
    }, 300);
    return () => clearTimeout(timer);
  }, [formData, currentStep, locationCodes, selectedBankCountry, imageKeys, extraBankFields]);

  const updateField = (section: string, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const updateRootField = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateBankField = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      admin: {
        ...prev.admin,
        bankDetails: {
          ...(prev.admin.bankDetails || {}),
          [field]: value,
        },
      },
    }));
  };

  const renderBankFields = (countryCode: string) => {
    const config = getBankConfig(countryCode);
    if (!config) return null;

    return (
      <>
        {config.fields.map((field: BankFieldConfig) => {
          const val = formData.admin.bankDetails?.[field.name] || "";
          const commonProps = {
            value: val,
            onChange: (e: any) => updateBankField(field.name, e.target.value),
            placeholder: field.placeholder,
          };

          if (field.type === "textarea") {
            return (
              <div key={field.name} className="sm:col-span-2">
                <Label>
                  {field.label}
                  {field.required && <span className="text-destructive ml-0.5">*</span>}
                </Label>
                <Textarea rows={2} {...commonProps} />
                {field.hint && <p className="text-xs text-muted-foreground mt-1">{field.hint}</p>}
              </div>
            );
          }

          return (
            <div key={field.name}>
              <Label>
                {field.label}
                {field.required && <span className="text-destructive ml-0.5">*</span>}
              </Label>
              <Input {...commonProps} />
              {field.hint && <p className="text-xs text-muted-foreground mt-1">{field.hint}</p>}
            </div>
          );
        })}

        {/* Extra key-value fields */}
        {(extraBankFields || []).map((item, idx) => (
          <div key={`extra-${idx}`} className="relative sm:col-span-2 flex items-start gap-2">
            <div className="flex-1 grid grid-cols-2 gap-2">
              <div>
                <Label>Field Name</Label>
                <Input
                  value={item.key}
                  onChange={(e) => {
                    const copy = [...extraBankFields];
                    copy[idx] = { ...copy[idx], key: e.target.value };
                    setExtraBankFields(copy);
                  }}
                  placeholder="e.g. Routing Number"
                />
              </div>
              <div>
                <Label>Value</Label>
                <Input
                  value={item.value}
                  onChange={(e) => {
                    const copy = [...extraBankFields];
                    copy[idx] = { ...copy[idx], value: e.target.value };
                    setExtraBankFields(copy);
                  }}
                  placeholder="Field value"
                />
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="mt-6 shrink-0 h-9 w-9 text-destructive"
              onClick={() => setExtraBankFields(extraBankFields.filter((_, i) => i !== idx))}
            >
              ✕
            </Button>
          </div>
        ))}

        <div className="sm:col-span-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExtraBankFields([...extraBankFields, { key: "", value: "" }])}
          >
            + Add Extra
          </Button>
        </div>
      </>
    );
  };

  const removeImage = async (field: "logo" | "bannerImage" | "brochure") => {
    const key = imageKeys[field];
    if (key) {
      try {
        const { deleteFile } = await import("@/domains/documents/documents.api");
        await deleteFile(key);
      } catch { /* ignore delete failure */ }
    }
    const formField = field === "brochure" ? "brochureUrl" : field;
    updateRootField(formField, "");
    setImageKeys((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setFormErrors({});
    try {
      const phoneCode = Country.getCountryByCode(locationCodes.countryCode)?.phonecode || "";
      const otherFees: Record<string, number> = {};
      // Per-program fee breakdowns (prefixed with program name)
      (formData.academic.programs || []).forEach((prog: any) => {
        if (prog.feeBreakdown && prog.name?.trim()) {
          prog.feeBreakdown.forEach((item: any) => {
            if (item.name?.trim()) {
              const key = `${prog.name.trim()} - ${item.name.trim()}`;
              otherFees[key] = item.amount || 0;
            }
          });
        }
      });
      const scholarshipDetails = formData.fees.scholarships
        .filter((s: string) => s.trim())
        .join(", ");
      const payload = {
        ...formData,
        contact: {
          email: formData.contact.email,
          phone: `+${phoneCode}-${formData.contact.phone}`,
          admissionOfficeHours: formData.contact.admissionOfficeHours,
        },
        fees: {
          ...formData.fees,
          otherFees,
          ...(scholarshipDetails ? { scholarshipDetails } : {}),
        },
        ...(formData.brochureUrl ? { brochureUrl: formData.brochureUrl } : { brochureUrl: undefined }),
      };
      delete payload.fees.feeBreakdown;
      delete (payload.fees as any).scholarships;
      // Merge extra services into languageSupport for backend
      const extras = (payload.support as any).extraServices?.filter((s: string) => s.trim()) || [];
      payload.support.languageSupport = [...(payload.support.languageSupport || []), ...extras];
      delete (payload.support as any).extraServices;
      // Merge extra bank fields into bankDetails
      if (extraBankFields?.length) {
        for (const item of extraBankFields) {
          if (item.key?.trim()) {
            payload.admin.bankDetails[item.key.trim()] = item.value;
          }
        }
      }
      // Transform subjectRankings array to Record for backend
      const subjectRankingsRecord: Record<string, string> = {};
      (payload.recognition.subjectRankings || []).forEach((item: { subject: string; ranking: string }) => {
        if (item.subject?.trim()) {
          subjectRankingsRecord[item.subject.trim()] = item.ranking || "";
        }
      });
      payload.recognition.subjectRankings = subjectRankingsRecord;
      await createUniversity.mutateAsync(payload);
      localStorage.removeItem(STORAGE_KEY);
      router.push("/admin/universities");
    } catch (error: any) {
      const errData = error?.response?.data?.error || error?.response?.data;
      if (errData?.fields) {
        setFormErrors(errData.fields);
      } else if (errData?.message) {
        setFormErrors({ _general: errData.message });
      } else {
        setFormErrors({ _general: "Failed to create university. Please check all fields and try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* Identity */}
            <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
              <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Identity</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label>University Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => updateRootField("name", e.target.value)}
                    placeholder="ABC Medical College"
                  />
                </div>
                <div>
                  <Label>Short Name *</Label>
                  <Input
                    value={formData.shortName}
                    onChange={(e) => updateRootField("shortName", e.target.value)}
                    placeholder="ABC MC"
                  />
                </div>
                <div>
                  <Label>Established Year *</Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={formData.establishedYear || ""}
                    onChange={(e) =>
                      updateRootField("establishedYear", parseInt(e.target.value) || new Date().getFullYear())
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div >
                  <Label>Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(v) => updateRootField("type", v)}
                  >
                    <SelectTrigger className={"w-full"}><SelectValue /></SelectTrigger>
                    <SelectContent >
                      <SelectItem value="GOVERNMENT">Government</SelectItem>
                      <SelectItem value="PRIVATE">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Website *</Label>
                  <Input
                    value={formData.website}
                    onChange={(e) => updateRootField("website", e.target.value)}
                    placeholder="https://university.edu"
                  />
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
              <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Social Media</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Facebook</Label>
                  <Input
                    value={formData.socialLinks?.facebook || ""}
                    onChange={(e) => updateField("socialLinks", "facebook", e.target.value)}
                    placeholder="https://facebook.com/university"
                  />
                </div>
                <div>
                  <Label>Instagram</Label>
                  <Input
                    value={formData.socialLinks?.instagram || ""}
                    onChange={(e) => updateField("socialLinks", "instagram", e.target.value)}
                    placeholder="https://instagram.com/university"
                  />
                </div>
                <div>
                  <Label>YouTube</Label>
                  <Input
                    value={formData.socialLinks?.youtube || ""}
                    onChange={(e) => updateField("socialLinks", "youtube", e.target.value)}
                    placeholder="https://youtube.com/channel"
                  />
                </div>
                <div>
                  <Label>LinkedIn</Label>
                  <Input
                    value={formData.socialLinks?.linkedin || ""}
                    onChange={(e) => updateField("socialLinks", "linkedin", e.target.value)}
                    placeholder="https://linkedin.com/school/university"
                  />
                </div>
                <div>
                  <Label>Twitter / X</Label>
                  <Input
                    value={formData.socialLinks?.twitter || ""}
                    onChange={(e) => updateField("socialLinks", "twitter", e.target.value)}
                    placeholder="https://twitter.com/university"
                  />
                </div>
                <div>
                  <Label>TikTok</Label>
                  <Input
                    value={formData.socialLinks?.tiktok || ""}
                    onChange={(e) => updateField("socialLinks", "tiktok", e.target.value)}
                    placeholder="https://tiktok.com/@university"
                  />
                </div>
              </div>
            </div>

            {/* Media */}
            <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
              <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Media</h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-[auto_1fr] sm:gap-6 items-start">
                {/* Logo */}
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">Logo</Label>
                  <div className="relative">
                    <div
                      className="group flex h-28 w-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/80 bg-muted/30 transition-colors hover:border-primary/50 hover:bg-primary/5"
                      onDragOver={(e) => { e.preventDefault(); }}
                      onDrop={async (e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files?.[0];
                        if (!file || !file.type.startsWith("image/")) return;
                        try {
                          const { uploadFile } = await import("@/domains/documents/documents.api");
                          const res = await uploadFile(file, "logos");
                          updateRootField("logo", res.url);
                          setImageKeys((prev) => ({ ...prev, logo: res.key }));
                        } catch { alert("Logo upload failed"); }
                      }}
                      onClick={() => !formData.logo && document.getElementById("logo-upload")?.click()}
                    >
                      {formData.logo ? (
                        <img src={formData.logo} alt="Logo" className="h-full w-full rounded-lg object-cover" />
                      ) : (
                        <>
                          <svg className="mb-1 h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16V4m0 0l-4 4m4-4l4 4M4 20h16" /></svg>
                          <span className="text-[10px] text-muted-foreground">Upload</span>
                        </>
                      )}
                      <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const { uploadFile } = await import("@/domains/documents/documents.api");
                          const res = await uploadFile(file, "logos");
                          updateRootField("logo", res.url);
                          setImageKeys((prev) => ({ ...prev, logo: res.key }));
                        } catch { alert("Logo upload failed"); }
                      }} />
                    </div>
                    {formData.logo && (
                      <button type="button" onClick={() => removeImage("logo")} className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white text-[10px] shadow hover:bg-destructive/90">✕</button>
                    )}
                  </div>
                </div>
                {/* Banner */}
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">Banner Image</Label>
                  <div className="relative">
                    <div
                      className="group flex h-28 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/80 bg-muted/30 transition-colors hover:border-primary/50 hover:bg-primary/5"
                      onDragOver={(e) => { e.preventDefault(); }}
                      onDrop={async (e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files?.[0];
                        if (!file || !file.type.startsWith("image/")) return;
                        try {
                          const { uploadFile } = await import("@/domains/documents/documents.api");
                          const res = await uploadFile(file, "banners");
                          updateRootField("bannerImage", res.url);
                          setImageKeys((prev) => ({ ...prev, bannerImage: res.key }));
                        } catch { alert("Banner upload failed"); }
                      }}
                      onClick={() => !formData.bannerImage && document.getElementById("banner-upload")?.click()}
                    >
                      {formData.bannerImage ? (
                        <img src={formData.bannerImage} alt="Banner" className="h-full w-full rounded-lg object-cover" />
                      ) : (
                        <>
                          <svg className="mb-1 h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4-4a2 2 0 012.8 0L16 17m-2-2l1.6-1.6a2 2 0 012.8 0L20 15M4 20h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          <span className="text-xs text-muted-foreground">Drop or click to upload banner</span>
                          <span className="text-[10px] text-muted-foreground/60">1200×400px recommended</span>
                        </>
                      )}
                      <input id="banner-upload" type="file" accept="image/*" className="hidden" onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const { uploadFile } = await import("@/domains/documents/documents.api");
                          const res = await uploadFile(file, "banners");
                          updateRootField("bannerImage", res.url);
                          setImageKeys((prev) => ({ ...prev, bannerImage: res.key }));
                        } catch { alert("Banner upload failed"); }
                      }} />
                    </div>
                    {formData.bannerImage && (
                      <button type="button" onClick={() => removeImage("bannerImage")} className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white text-[10px] shadow hover:bg-destructive/90">✕</button>
                    )}
                  </div>
                </div>
              </div>
              {/* Brochure */}
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Brochure (PDF)</Label>
                <div className="relative">
                  {formData.brochureUrl ? (
                    <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/30 p-3">
                      <svg className="h-8 w-8 text-red-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V8l-6-6H7zm7 1.5L18.5 8H14V3.5zM9 13h6v1.5H9V13zm0 3h6v1.5H9V16zm0-6h3v1.5H9V10z"/></svg>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">Brochure uploaded</p>
                        <p className="text-xs text-muted-foreground truncate">{formData.brochureUrl}</p>
                      </div>
                      <button type="button" onClick={() => removeImage("brochure")} className="text-destructive/70 hover:text-destructive text-xs font-medium">Remove</button>
                    </div>
                  ) : (
                    <div
                      className="group flex h-16 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border/80 bg-muted/30 transition-colors hover:border-primary/50 hover:bg-primary/5"
                      onClick={() => document.getElementById("brochure-upload")?.click()}
                    >
                      <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16V4m0 0l-4 4m4-4l4 4M4 20h16" /></svg>
                      <span className="text-sm text-muted-foreground">Upload brochure PDF</span>
                    </div>
                  )}
                  <input id="brochure-upload" type="file" accept=".pdf,application/pdf" className="hidden" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.type !== "application/pdf") { alert("Please upload a PDF file"); return; }
                    try {
                      const { uploadFile } = await import("@/domains/documents/documents.api");
                      const res = await uploadFile(file, "brochures");
                      updateRootField("brochureUrl", res.url);
                      setImageKeys((prev) => ({ ...prev, brochure: res.key }));
                    } catch { alert("Brochure upload failed"); }
                  }} />
                </div>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* Location */}
            <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
              <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Location</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label>Country *</Label>
                  <SearchableSelect
                    options={Country.getAllCountries().map((c) => ({ label: c.name, value: c.isoCode }))}
                    value={locationCodes.countryCode}
                    onChange={(code) => {
                      setLocationCodes({ countryCode: code, stateCode: "" });
                      const name = Country.getCountryByCode(code)?.name || "";
                      updateField("location", "country", name);
                      updateField("location", "state", "");
                      updateField("location", "city", "");
                    }}
                    placeholder="Search country..."
                  />
                </div>
                <div>
                  <Label>State *</Label>
                  <SearchableSelect
                    options={
                      locationCodes.countryCode
                        ? State.getStatesOfCountry(locationCodes.countryCode).map((s) => ({ label: s.name, value: s.isoCode }))
                        : []
                    }
                    value={locationCodes.stateCode}
                    onChange={(code) => {
                      setLocationCodes((prev) => ({ ...prev, stateCode: code }));
                      const name = State.getStateByCodeAndCountry(code, locationCodes.countryCode)?.name || "";
                      updateField("location", "state", name);
                      updateField("location", "city", "");
                    }}
                    placeholder="Search state..."
                    disabled={!locationCodes.countryCode}
                  />
                </div>
                <div>
                  <Label>City *</Label>
                  <SearchableSelect
                    options={
                      locationCodes.countryCode && locationCodes.stateCode
                        ? City.getCitiesOfState(locationCodes.countryCode, locationCodes.stateCode).map((c) => ({ label: c.name, value: c.name }))
                        : []
                    }
                    value={formData.location.city}
                    onChange={(val) => updateField("location", "city", val)}
                    placeholder="Search city..."
                    disabled={!locationCodes.stateCode}
                  />
                </div>
              </div>
              <div>
                <Label>Address *</Label>
                <Textarea
                  value={formData.location.address}
                  onChange={(e) => updateField("location", "address", e.target.value)}
                  placeholder="Full street address"
                  rows={2}
                />
              </div>
            </div>

            {/* Contact */}
            <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
              <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Contact</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={formData.contact.email}
                    onChange={(e) => updateField("contact", "email", e.target.value)}
                    placeholder="admissions@university.edu"
                  />
                  {formData.contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact.email) && (
                    <p className="text-xs text-destructive mt-1">Please enter a valid email address</p>
                  )}
                </div>
                <div>
                  <Label>Phone *</Label>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-10 items-center rounded-md border border-border bg-muted px-3 text-sm font-medium text-muted-foreground select-none">
                      +{Country.getCountryByCode(locationCodes.countryCode)?.phonecode || "—"}
                    </span>
                    <Input
                      className="flex-1"
                      value={formData.contact.phone}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                        updateField("contact", "phone", digits);
                      }}
                      placeholder="9876543210"
                      maxLength={10}
                      inputMode="numeric"
                    />
                  </div>
                  {formData.contact.phone && formData.contact.phone.length < 10 && (
                    <p className="text-xs text-muted-foreground mt-1">{formData.contact.phone.length}/10 digits</p>
                  )}
                </div>
              </div>
              <div>
                <Label>Office Hours *</Label>
                <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 mt-1">
                  <Select
                    value={formData.contact._officeHoursDays || "Mon-Fri"}
                    onValueChange={(val) => {
                      updateField("contact", "_officeHoursDays", val);
                      const time = `${formData.contact._officeHoursFrom || "09:00"} - ${formData.contact._officeHoursTo || "17:00"}`;
                      updateField("contact", "admissionOfficeHours", `${val} ${time}`);
                    }}
                  >
                    <SelectTrigger><SelectValue placeholder="Days" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mon-Fri">Mon – Fri</SelectItem>
                      <SelectItem value="Mon-Sat">Mon – Sat</SelectItem>
                      <SelectItem value="Mon-Sun">Mon – Sun</SelectItem>
                      <SelectItem value="Sat-Sun">Sat – Sun</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-muted-foreground">from</span>
                  <Input
                    type="time"
                    value={formData.contact._officeHoursFrom || "09:00"}
                    onChange={(e) => {
                      updateField("contact", "_officeHoursFrom", e.target.value);
                      const days = formData.contact._officeHoursDays || "Mon-Fri";
                      const to = formData.contact._officeHoursTo || "17:00";
                      updateField("contact", "admissionOfficeHours", `${days} ${e.target.value} - ${to}`);
                    }}
                  />
                  <span className="text-sm text-muted-foreground">to</span>
                  <Input
                    type="time"
                    value={formData.contact._officeHoursTo || "17:00"}
                    onChange={(e) => {
                      updateField("contact", "_officeHoursTo", e.target.value);
                      const days = formData.contact._officeHoursDays || "Mon-Fri";
                      const from = formData.contact._officeHoursFrom || "09:00";
                      updateField("contact", "admissionOfficeHours", `${days} ${from} - ${e.target.value}`);
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{formData.contact.admissionOfficeHours}</p>
              </div>
            </div>
          </div>
        );

      case 2:
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
                  onClick={() =>
                    updateField("academic", "programs", [
                      ...(formData.academic.programs || []),
                      { name: "", duration: "5.5 years", annualTuition: 0, registration: 0, totalSeats: 0, governmentSeats: 0, managementSeats: 0, nriSeats: 0, feeBreakdown: [] },
                    ])
                  }
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
                            updateField("academic", "programs", updated);
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
                              updateField("academic", "programs", updated);
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
                              updateField("academic", "programs", updated);
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
                        <div>
                          <Label>Annual Tuition *</Label>
                          <Input
                            type="text"
                            inputMode="numeric"
                            value={prog.annualTuition || ""}
                            onChange={(e) => {
                              const updated = [...formData.academic.programs];
                              updated[i] = { ...updated[i], annualTuition: parseFloat(e.target.value) || 0 };
                              updateField("academic", "programs", updated);
                            }}
                            placeholder="e.g. 500000"
                          />
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
                              updateField("academic", "programs", updated);
                            }}
                            placeholder="e.g. 25000"
                          />
                        </div>
                        <div>
                          <Label>Total Seats *</Label>
                          <Input
                            type="text"
                            inputMode="numeric"
                            value={prog.totalSeats || ""}
                            onChange={(e) => {
                              const updated = [...formData.academic.programs];
                              updated[i] = { ...updated[i], totalSeats: parseInt(e.target.value) || 0 };
                              updateField("academic", "programs", updated);
                            }}
                            placeholder="e.g. 150"
                          />
                        </div>
                      </div>
                      {/* Seat Distribution */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <Label>Govt Seats</Label>
                          <Input
                            type="text"
                            inputMode="numeric"
                            value={prog.governmentSeats || ""}
                            onChange={(e) => {
                              const updated = [...formData.academic.programs];
                              updated[i] = { ...updated[i], governmentSeats: parseInt(e.target.value) || 0 };
                              updateField("academic", "programs", updated);
                            }}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <Label>Management Seats</Label>
                          <Input
                            type="text"
                            inputMode="numeric"
                            value={prog.managementSeats || ""}
                            onChange={(e) => {
                              const updated = [...formData.academic.programs];
                              updated[i] = { ...updated[i], managementSeats: parseInt(e.target.value) || 0 };
                              updateField("academic", "programs", updated);
                            }}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <Label>NRI Seats</Label>
                          <Input
                            type="text"
                            inputMode="numeric"
                            value={prog.nriSeats || ""}
                            onChange={(e) => {
                              const updated = [...formData.academic.programs];
                              updated[i] = { ...updated[i], nriSeats: parseInt(e.target.value) || 0 };
                              updateField("academic", "programs", updated);
                            }}
                            placeholder="0"
                          />
                        </div>
                      </div>

                      {/* Per-Program Fee Breakdown */}
                      <div className="border-t border-border/40 pt-3">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-xs text-muted-foreground">Fee Breakdown</Label>
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
                              updateField("academic", "programs", updated);
                            }}
                          >
                            + Add Item
                          </Button>
                        </div>
                        {(!prog.feeBreakdown || prog.feeBreakdown.length === 0) ? (
                          <p className="text-xs text-muted-foreground">No fee breakdown items yet.</p>
                        ) : (
                          <div className="space-y-2">
                            {prog.feeBreakdown.map((item: any, fi: number) => (
                              <div key={item.id || fi} className="flex items-center gap-2">
                                <Input
                                  value={item.name}
                                  onChange={(e) => {
                                    const updated = [...formData.academic.programs];
                                    updated[i].feeBreakdown = [...(updated[i].feeBreakdown || [])];
                                    updated[i].feeBreakdown[fi] = { ...updated[i].feeBreakdown[fi], name: e.target.value };
                                    updateField("academic", "programs", updated);
                                  }}
                                  placeholder="Fee name"
                                  className="flex-1"
                                />
                                <Input
                                  type="text"
                                  inputMode="numeric"
                                  value={item.amount || ""}
                                  onChange={(e) => {
                                    const updated = [...formData.academic.programs];
                                    updated[i].feeBreakdown = [...(updated[i].feeBreakdown || [])];
                                    updated[i].feeBreakdown[fi] = { ...updated[i].feeBreakdown[fi], amount: parseFloat(e.target.value) || 0 };
                                    updateField("academic", "programs", updated);
                                  }}
                                  placeholder="Amount"
                                  className="w-28"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...formData.academic.programs];
                                    updated[i].feeBreakdown = (updated[i].feeBreakdown || []).filter((_: any, k: number) => k !== fi);
                                    updateField("academic", "programs", updated);
                                  }}
                                  className="text-destructive/70 hover:text-destructive text-lg leading-none flex-shrink-0"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Medium of Instruction (Universal) */}
            <div className="rounded-lg border border-border/60 bg-card p-3 sm:p-4">
              <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide mb-3">Medium of Instruction</h4>
              <div className="max-w-xs">
                <Select
                  value={isOtherMedium ? "Other" : formData.academic.medium}
                  onValueChange={(v) => {
                    if (v === "Other") {
                      updateField("academic", "medium", "Other:");
                    } else {
                      updateField("academic", "medium", v);
                    }
                  }}
                >
                  <SelectTrigger><SelectValue placeholder="Select medium" /></SelectTrigger>
                  <SelectContent>
                    {UNIVERSAL_MEDIUMS.map((lang: string) => (
                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                    <SelectItem value="Other">Others</SelectItem>
                  </SelectContent>
                </Select>
                {isOtherMedium && (
                  <Input
                    value={otherMediumValue}
                    onChange={(e) => updateField("academic", "medium", `Other:${e.target.value}`)}
                    placeholder="Type the medium of instruction"
                    className="mt-2"
                  />
                )}
              </div>
            </div>



            {/* Student Demographics */}
            <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
              <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Student Demographics</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label>Total Students</Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={formData.studentDemographics.totalStudents || ""}
                    onChange={(e) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        studentDemographics: { ...prev.studentDemographics, totalStudents: parseInt(e.target.value) || 0 },
                      }))
                    }
                    placeholder="e.g. 5000"
                  />
                </div>
                <div>
                  <Label>Local Students</Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={formData.studentDemographics.localStudents || ""}
                    onChange={(e) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        studentDemographics: { ...prev.studentDemographics, localStudents: parseInt(e.target.value) || 0 },
                      }))
                    }
                    placeholder="e.g. 3500"
                  />
                </div>
                <div>
                  <Label>Foreign Students</Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={formData.studentDemographics.foreignStudents || ""}
                    onChange={(e) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        studentDemographics: { ...prev.studentDemographics, foreignStudents: parseInt(e.target.value) || 0 },
                      }))
                    }
                    placeholder="e.g. 1500"
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
                      setFormData((prev: any) => ({
                        ...prev,
                        studentDemographics: {
                          ...prev.studentDemographics,
                          foreignByCountry: [...prev.studentDemographics.foreignByCountry, { country: "", count: 0 }],
                        },
                      }))
                    }
                  >
                    + Add Country
                  </Button>
                </div>
                {formData.studentDemographics.foreignByCountry.map((entry: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <div className="flex-1">
                      <SearchableSelect
                        options={Country.getAllCountries().map((c) => ({ label: c.name, value: c.isoCode }))}
                        value={Country.getAllCountries().find((c) => c.name === entry.country)?.isoCode ?? ""}
                        onChange={(code) => {
                          const name = Country.getCountryByCode(code)?.name || "";
                          setFormData((prev: any) => {
                            const updated = [...prev.studentDemographics.foreignByCountry];
                            updated[i] = { ...updated[i], country: name };
                            return { ...prev, studentDemographics: { ...prev.studentDemographics, foreignByCountry: updated } };
                          });
                        }}
                        placeholder="Search country..."
                      />
                    </div>
                    <Input
                      className="w-24"
                      type="text"
                      inputMode="numeric"
                      value={entry.count || ""}
                      onChange={(e) =>
                        setFormData((prev: any) => {
                          const updated = [...prev.studentDemographics.foreignByCountry];
                          updated[i] = { ...updated[i], count: parseInt(e.target.value) || 0 };
                          return { ...prev, studentDemographics: { ...prev.studentDemographics, foreignByCountry: updated } };
                        })
                      }
                      placeholder="Count"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-500"
                      onClick={() =>
                        setFormData((prev: any) => ({
                          ...prev,
                          studentDemographics: {
                            ...prev.studentDemographics,
                            foreignByCountry: prev.studentDemographics.foreignByCountry.filter((_: any, j: number) => j !== i),
                          },
                        }))
                      }
                    >
                      ✕
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* Status Section */}
            <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
              <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Accreditation Status</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>ECFMG Status *</Label>
                  <Select
                    value={formData.recognition.ecfmgStatus}
                    onValueChange={(v) =>
                      updateField("recognition", "ecfmgStatus", v)
                    }
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
                        updateField("recognition", "bodies", [...current, "WHO"]);
                      } else if (v === "NO") {
                        updateField("recognition", "bodies", current.filter((b: string) => b !== "WHO"));
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
                      updateField("recognition", "bodies", [...current, "NMC"]);
                    } else if (v === "NO") {
                      updateField("recognition", "bodies", current.filter((b: string) => b !== "NMC"));
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
                    type="text"
                    inputMode="numeric"
                    value={formData.recognition.worldRank || ""}
                    onChange={(e) =>
                      updateField("recognition", "worldRank", e.target.value ? parseInt(e.target.value) : null)
                    }
                    placeholder="e.g. 450"
                  />
                </div>
                <div>
                  <Label>National Rank</Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={formData.recognition.nationalRank || ""}
                    onChange={(e) =>
                      updateField("recognition", "nationalRank", e.target.value ? parseInt(e.target.value) : null)
                    }
                    placeholder="e.g. 25"
                  />
                </div>
                <div>
                  <Label>World Ranking Source</Label>
                  <Select
                    value={formData.recognition.worldRankingSource || ""}
                    onValueChange={(v) => {
                      updateField("recognition", "worldRankingSource", v || null);
                      if (v !== "Other") {
                        updateField("recognition", "otherRankingSource", null);
                      }
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
                    <Input
                      className="mt-2"
                      value={formData.recognition.otherRankingSource || ""}
                      onChange={(e) => updateField("recognition", "otherRankingSource", e.target.value || null)}
                      placeholder="Enter ranking source name"
                    />
                  )}
                </div>
                <div>
                  <Label>National Ranking Source</Label>
                  <Select
                    value={formData.recognition.nationalRankingSource || ""}
                    onValueChange={(v) => updateField("recognition", "nationalRankingSource", v || null)}
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
                    <Input
                      className="mt-2"
                      value={formData.recognition.otherNationalRankingSource || ""}
                      onChange={(e) => updateField("recognition", "otherNationalRankingSource", e.target.value || null)}
                      placeholder="Enter national ranking source name"
                    />
                  )}
                </div>
              </div>

              {/* Subject Rankings */}
              <div className="border-t border-border/40 pt-3 mt-2">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs text-muted-foreground">Subject Rankings</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      updateField("recognition", "subjectRankings", [...(formData.recognition.subjectRankings || []), { subject: "", ranking: "" }])
                    }
                  >
                    + Add Subject Ranking
                  </Button>
                </div>
                {(formData.recognition.subjectRankings || []).length === 0 ? (
                  <p className="text-xs text-muted-foreground">No subject rankings listed yet.</p>
                ) : (
                  <div className="space-y-2">
                    {(formData.recognition.subjectRankings || []).map((item: { subject: string; ranking: string }, i: number) => (
                      <div key={i} className="flex items-center gap-2">
                        <Input
                          value={item.subject}
                          onChange={(e) => {
                            const updated = [...(formData.recognition.subjectRankings || [])];
                            updated[i] = { ...updated[i], subject: e.target.value };
                            updateField("recognition", "subjectRankings", updated);
                          }}
                          placeholder="e.g. Medicine"
                          className="flex-1"
                        />
                        <Input
                          value={item.ranking}
                          onChange={(e) => {
                            const updated = [...(formData.recognition.subjectRankings || [])];
                            updated[i] = { ...updated[i], ranking: e.target.value };
                            updateField("recognition", "subjectRankings", updated);
                          }}
                          placeholder="e.g. Top 100"
                          className="flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (formData.recognition.subjectRankings || []).filter((_: any, j: number) => j !== i);
                            updateField("recognition", "subjectRankings", updated);
                          }}
                          className="text-destructive/70 hover:text-destructive text-lg leading-none flex-shrink-0"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* Fee Structure */}
            <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
              <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Fee Structure</h4>

              <div>
                <Label>Currency *</Label>
                <div className="max-w-xs">
                  <Select
                    value={formData.fees.currency}
                    onValueChange={(v) => updateField("fees", "currency", v)}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">₹ INR</SelectItem>
                      <SelectItem value="USD">$ USD</SelectItem>
                      <SelectItem value="EUR">€ EUR</SelectItem>
                      <SelectItem value="RUB">₽ RUB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Checkbox
                  id="scholarship-toggle"
                  checked={formData.fees.scholarshipAvailable}
                  onCheckedChange={(checked) => updateField("fees", "scholarshipAvailable", checked)}
                />
                <Label htmlFor="scholarship-toggle" className="cursor-pointer font-medium">Scholarship Available</Label>
              </div>

              {formData.fees.scholarshipAvailable && (
                <div className="border-t border-border/40 pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs text-muted-foreground">Scholarship Names</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateField("fees", "scholarships", [...formData.fees.scholarships, ""])
                      }
                    >
                      + Add Scholarship
                    </Button>
                  </div>
                  {formData.fees.scholarships.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No scholarships listed yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {formData.fees.scholarships.map((name: string, i: number) => (
                        <div key={i} className="flex items-center gap-2">
                          <Input
                            value={name}
                            onChange={(e) => {
                              const updated = [...formData.fees.scholarships];
                              updated[i] = e.target.value;
                              updateField("fees", "scholarships", updated);
                            }}
                            placeholder="e.g. Merit-Based Scholarship"
                            className="flex-1"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = formData.fees.scholarships.filter((_: string, j: number) => j !== i);
                              updateField("fees", "scholarships", updated);
                            }}
                            className="text-destructive/70 hover:text-destructive text-lg leading-none flex-shrink-0"
                          >
                            ×
                          </button>
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
              <div>
                <Label>Payment Schedule</Label>
                <Textarea
                  value={formData.fees.paymentSchedule}
                  onChange={(e) => updateField("fees", "paymentSchedule", e.target.value)}
                  placeholder="e.g. Semester-wise, 50% at admission + 50% before 2nd year"
                  rows={2}
                />
              </div>
              <div>
                <Label>Refund Policy</Label>
                <Textarea
                  value={formData.fees.refundPolicy}
                  onChange={(e) => updateField("fees", "refundPolicy", e.target.value)}
                  placeholder="e.g. Full refund before classes start, 50% within first month"
                  rows={2}
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* Departments */}
            <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
              <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Departments</h4>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs text-muted-foreground">Department Names</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateField("infrastructure", "departments", [...(formData.infrastructure.departments || []), ""])}
                  >
                    + Add Department
                  </Button>
                </div>
                {(!formData.infrastructure.departments || formData.infrastructure.departments.length === 0) ? (
                  <p className="text-xs text-muted-foreground">No departments added yet.</p>
                ) : (
                  <div className="space-y-2">
                    {formData.infrastructure.departments.map((dept: string, i: number) => (
                      <div key={i} className="flex items-center gap-2">
                        <Input
                          value={dept}
                          onChange={(e) => {
                            const updated = [...formData.infrastructure.departments];
                            updated[i] = e.target.value;
                            updateField("infrastructure", "departments", updated);
                          }}
                          placeholder="e.g. Cardiology"
                          className="flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = formData.infrastructure.departments.filter((_: any, j: number) => j !== i);
                            updateField("infrastructure", "departments", updated);
                          }}
                          className="text-destructive/70 hover:text-destructive text-lg leading-none flex-shrink-0"
                        >
                          ×
                        </button>
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
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateField("infrastructure", "laboratories", [...(formData.infrastructure.laboratories || []), ""])}
                  >
                    + Add Laboratory
                  </Button>
                </div>
                {(!formData.infrastructure.laboratories || formData.infrastructure.laboratories.length === 0) ? (
                  <p className="text-xs text-muted-foreground">No laboratories added yet.</p>
                ) : (
                  <div className="space-y-2">
                    {formData.infrastructure.laboratories.map((lab: string, i: number) => (
                      <div key={i} className="flex items-center gap-2">
                        <Input
                          value={lab}
                          onChange={(e) => {
                            const updated = [...formData.infrastructure.laboratories];
                            updated[i] = e.target.value;
                            updateField("infrastructure", "laboratories", updated);
                          }}
                          placeholder="e.g. Anatomy Lab"
                          className="flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = formData.infrastructure.laboratories.filter((_: any, j: number) => j !== i);
                            updateField("infrastructure", "laboratories", updated);
                          }}
                          className="text-destructive/70 hover:text-destructive text-lg leading-none flex-shrink-0"
                        >
                          ×
                        </button>
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
                <div>
                  <Label>Boys</Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={formData.infrastructure.hostelBoys || ""}
                    onChange={(e) => updateField("infrastructure", "hostelBoys", parseInt(e.target.value) || 0)}
                    placeholder="e.g. 500"
                  />
                </div>
                <div>
                  <Label>Girls</Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={formData.infrastructure.hostelGirls || ""}
                    onChange={(e) => updateField("infrastructure", "hostelGirls", parseInt(e.target.value) || 0)}
                    placeholder="e.g. 500"
                  />
                </div>
              </div>
            </div>

            {/* Facilities */}
            <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Facilities</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    updateField("infrastructure", "facilities", [...(formData.infrastructure.facilities || []), ""])
                  }
                >
                  + Add Extra
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { key: "cafeteria", label: "Cafeteria" },
                  { key: "wifiCampus", label: "WiFi Campus" },
                  { key: "transportation", label: "Transportation" },
                ].map((item) => (
                  <label key={item.key} className="flex items-center gap-3 rounded-md border border-border/60 p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                    <Checkbox
                      checked={formData.infrastructure[item.key]}
                      onCheckedChange={(checked) => updateField("infrastructure", item.key, checked)}
                    />
                    <span className="text-sm">{item.label}</span>
                  </label>
                ))}
                {formData.infrastructure.facilities?.map((name: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 rounded-md border border-border/60 p-3">
                    <Input
                      value={name}
                      onChange={(e) => {
                        const updated = [...(formData.infrastructure.facilities || [])];
                        updated[i] = e.target.value;
                        updateField("infrastructure", "facilities", updated);
                      }}
                      placeholder="Facility name"
                      className="h-7 text-sm flex-1 min-w-0"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (formData.infrastructure.facilities || []).filter((_: string, j: number) => j !== i);
                        updateField("infrastructure", "facilities", updated);
                      }}
                      className="text-destructive/70 hover:text-destructive text-lg leading-none flex-shrink-0"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* Eligibility */}
            <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
              <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Eligibility Criteria</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Minimum Marks *</Label>
                  <Input
                    value={formData.admission.minimumMarks}
                    onChange={(e) => updateField("admission", "minimumMarks", e.target.value)}
                    placeholder="e.g. 50th percentile in NEET"
                  />
                </div>
                <div>
                  <Label>Age Criteria *</Label>
                  <Input
                    value={formData.admission.ageCriteria}
                    onChange={(e) => updateField("admission", "ageCriteria", e.target.value)}
                    placeholder="e.g. 17–25 years"
                  />
                </div>
              </div>
              <div>
                <Label>Eligibility *</Label>
                <Textarea
                  value={formData.admission.eligibility}
                  onChange={(e) => updateField("admission", "eligibility", e.target.value)}
                  placeholder="e.g. 10+2 with Physics, Chemistry, Biology with min 50% aggregate"
                  rows={2}
                />
              </div>
            </div>

            {/* Application */}
            <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
              <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Application Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Application Deadline *</Label>
                  <Input
                    type="date"
                    value={formData.admission.applicationDeadline}
                    onChange={(e) => updateField("admission", "applicationDeadline", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Application Fee *</Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={formData.admission.applicationFee || ""}
                    onChange={(e) => updateField("admission", "applicationFee", parseFloat(e.target.value) || 0)}
                    placeholder="e.g. 1500"
                  />
                </div>
              </div>
              <div>
                <Label>Selection Process *</Label>
                <Textarea
                  value={formData.admission.selectionProcess}
                  onChange={(e) => updateField("admission", "selectionProcess", e.target.value)}
                  placeholder="e.g. NEET score → Counseling → Document verification → Admission confirmation"
                  rows={2}
                />
              </div>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* Point of Contact */}
            <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
              <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Point of Contact</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>POC Name *</Label>
                  <Input
                    value={formData.admin.pocName}
                    onChange={(e) => updateField("admin", "pocName", e.target.value)}
                    placeholder="Contact person name"
                  />
                </div>
                <div>
                  <Label>POC Designation *</Label>
                  <Input
                    value={formData.admin.pocDesignation}
                    onChange={(e) => updateField("admin", "pocDesignation", e.target.value)}
                    placeholder="e.g. Admissions Officer"
                  />
                </div>
                <div>
                  <Label>POC Email *</Label>
                  <Input
                    type="email"
                    value={formData.admin.pocEmail}
                    onChange={(e) => updateField("admin", "pocEmail", e.target.value)}
                    placeholder="admin@university.edu"
                  />
                </div>
                <div>
                  <Label>POC Phone *</Label>
                  <Input
                    value={formData.admin.pocPhone}
                    onChange={(e) => updateField("admin", "pocPhone", e.target.value)}
                    placeholder="+7-XXX-XXX-XXXX"
                  />
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
              <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Bank Details</h4>
              <div>
                <Label>Bank Country *</Label>
                <Select
                  value={selectedBankCountry}
                  onValueChange={(code: string | null) => {
                    const countryCode = code ?? "";
                    setSelectedBankCountry(countryCode);
                    setExtraBankFields([]);
                    updateField("admin", "bankCountry", countryCode);
                    if (countryCode && countryCode !== "IN") {
                      updateField("admin", "bankDetails", {});
                    }
                  }}
                >
                  <SelectTrigger className="max-w-xs">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN">India</SelectItem>
                    {SUPPORTED_FOREIGN_BANK_COUNTRIES.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedBankCountry === "IN" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Account Name *</Label>
                    <Input
                      value={formData.admin.accountName}
                      onChange={(e) => updateField("admin", "accountName", e.target.value)}
                      placeholder="Name on bank account"
                    />
                  </div>
                  <div>
                    <Label>Account Number *</Label>
                    <Input
                      value={formData.admin.accountNumber}
                      onChange={(e) => updateField("admin", "accountNumber", e.target.value)}
                      placeholder="Bank account number"
                    />
                  </div>
                  <div>
                    <Label>Bank Name *</Label>
                    <Input
                      value={formData.admin.bankName}
                      onChange={(e) => updateField("admin", "bankName", e.target.value)}
                      placeholder="e.g. State Bank of India"
                    />
                  </div>
                  <div>
                    <Label>Bank Branch</Label>
                    <Input
                      value={formData.admin.bankBranch}
                      onChange={(e) => updateField("admin", "bankBranch", e.target.value)}
                      placeholder="Branch name"
                    />
                  </div>
                  <div>
                    <Label>IFSC / SWIFT Code *</Label>
                    <Input
                      value={formData.admin.ifscCode}
                      onChange={(e) => updateField("admin", "ifscCode", e.target.value)}
                      placeholder="e.g. SBIN0001234"
                    />
                  </div>
                  <div>
                    <Label>Commission (%) *</Label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={formData.admin.commission || ""}
                      onChange={(e) => updateField("admin", "commission", parseFloat(e.target.value) || 0)}
                      placeholder="e.g. 10"
                    />
                  </div>
                  <div>
                    <Label>GST Number</Label>
                    <Input
                      value={formData.admin.gstNumber}
                      onChange={(e) => updateField("admin", "gstNumber", e.target.value)}
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <Label>PAN Number</Label>
                    <Input
                      value={formData.admin.panNumber}
                      onChange={(e) => updateField("admin", "panNumber", e.target.value)}
                      placeholder="Optional"
                    />
                  </div>
                </div>
              )}

              {selectedBankCountry && selectedBankCountry !== "IN" && (
                <div>
                  <h5 className="text-sm font-medium text-foreground/80 mb-3">
                    {getBankConfig(selectedBankCountry)?.countryName || selectedBankCountry} Bank Details
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {renderBankFields(selectedBankCountry)}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* Support Services */}
            <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Support Services</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    updateField("support", "extraServices", [...(formData.support.extraServices || []), ""])
                  }
                >
                  + Add Extra
                </Button>
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
                    <Checkbox
                      checked={formData.support[item.key]}
                      onCheckedChange={(checked) => updateField("support", item.key, checked)}
                    />
                    <span className="text-sm">{item.label}</span>
                  </label>
                ))}
                {formData.support.extraServices?.map((name: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 rounded-md border border-border/60 p-3">
                    <Input
                      value={name}
                      onChange={(e) => {
                        const updated = [...(formData.support.extraServices || [])];
                        updated[i] = e.target.value;
                        updateField("support", "extraServices", updated);
                      }}
                      placeholder="Service name"
                      className="h-7 text-sm flex-1 min-w-0"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (formData.support.extraServices || []).filter((_: string, j: number) => j !== i);
                        updateField("support", "extraServices", updated);
                      }}
                      className="text-destructive/70 hover:text-destructive text-lg leading-none flex-shrink-0"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
              <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Content</h4>
              <div>
                <Label>Short Description *</Label>
                <Textarea
                  value={formData.content.shortDescription}
                  onChange={(e) => updateField("content", "shortDescription", e.target.value)}
                  placeholder="Brief overview of the university (150–200 characters)"
                  rows={2}
                />
                {formData.content.shortDescription && (
                  <p className="text-xs text-muted-foreground mt-1">{formData.content.shortDescription.length} characters</p>
                )}
              </div>
              <div>
                <Label>Long Description *</Label>
                <Textarea
                  rows={5}
                  value={formData.content.longDescription}
                  onChange={(e) => updateField("content", "longDescription", e.target.value)}
                  placeholder="Detailed description covering history, achievements, campus life, and unique offerings"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-3 max-w-4xl mx-auto w-full sm:gap-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-[#2D2154] sm:text-2xl">
            Add New University
          </h1>
          <p className="text-xs text-[#6B6B6B] sm:text-sm">
            Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
          </p>
        </div>
      </div>

      <div className="flex gap-1">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`h-1.5 flex-1 rounded-full sm:h-2 ${
              index <= currentStep ? "bg-[#4B2D8E]" : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      {Object.keys(formErrors).length > 0 && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 flex gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <svg className="h-5 w-5 text-destructive" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" /></svg>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-destructive">Unable to create university</p>
            <ul className="list-disc list-inside space-y-0.5">
              {Object.entries(formErrors).map(([field, message]) => (
                <li key={field} className="text-sm text-destructive/80">
                  {field === "_general" ? message : message}
                </li>
              ))}
            </ul>
          </div>
          <button onClick={() => setFormErrors({})} className="ml-auto flex-shrink-0 text-destructive/60 hover:text-destructive">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
          </button>
        </div>
      )}

      <div className="rounded-lg border border-border bg-card p-3 sm:p-5">
        <h2 className="mb-3 text-sm font-semibold text-foreground sm:mb-4 sm:text-base">{steps[currentStep]}</h2>
        {renderStep()}
      </div>

      <div className="flex justify-between gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentStep(currentStep - 1)}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
          Previous
        </Button>
        {currentStep < steps.length - 1 ? (
          <Button size="sm" onClick={() => setCurrentStep(currentStep + 1)}>
            Next
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        ) : (
          <Button size="sm" onClick={handleSubmit} disabled={loading}>
            <Save className="mr-1.5 h-3.5 w-3.5" />
            {loading ? "Creating..." : "Create"}
          </Button>
        )}
      </div>
    </div>
  );
}

