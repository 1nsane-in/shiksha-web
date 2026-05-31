"use client";

import { useState } from "react";
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

const steps = [
  "Basic Info",
  "Location & Contact",
  "Academic Details",
  "Recognition",
  "Fees",
  "Infrastructure",
  "Admission",
  "Support & Content",
];

export default function NewUniversityPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const createUniversity = useCreateUniversity();
  const [imageKeys, setImageKeys] = useState<{ logo?: string; bannerImage?: string; brochure?: string }>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [locationCodes, setLocationCodes] = useState<{ countryCode: string; stateCode: string }>({ countryCode: "", stateCode: "" });
  const [formData, setFormData] = useState<any>({
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
      programs: ["MBBS"],
      duration: "5.5 years",
      medium: "English",
      specializations: [],
      intakeMonths: ["August"],
      totalSeats: 0,
      governmentSeats: 0,
      managementSeats: 0,
      nriSeats: 0,
    },
    recognition: {
      bodies: [],
      ecfmgStatus: "PENDING",
      nbaAccredited: false,
      accreditations: [],
    },
    fees: {
      tuitionAnnual: 0,
      totalProgram: 0,
      registration: 0,
      currency: "INR",
      scholarshipAvailable: false,
      paymentSchedule: "",
      refundPolicy: "",
    },
    infrastructure: {
      hospitalBeds: 0,
      departments: 0,
      hostelBoys: 0,
      hostelGirls: 0,
      laboratories: 0,
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
      counselingServices: false,
      careerGuidance: false,
    },
    content: {
      shortDescription: "",
      longDescription: "",
      highlights: [],
      gallery: [],
    },
  });

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
      const payload = {
        ...formData,
        contact: {
          email: formData.contact.email,
          phone: `+${phoneCode}-${formData.contact.phone}`,
          admissionOfficeHours: formData.contact.admissionOfficeHours,
        },
        ...(formData.brochureUrl ? { brochureUrl: formData.brochureUrl } : { brochureUrl: undefined }),
      };
      await createUniversity.mutateAsync(payload);
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
                    type="number"
                    min={1800}
                    max={new Date().getFullYear()}
                    value={formData.establishedYear}
                    onChange={(e) =>
                      updateRootField("establishedYear", parseInt(e.target.value) || new Date().getFullYear())
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(v) => updateRootField("type", v)}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
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
            {/* Program Info */}
            <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
              <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Program Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Duration *</Label>
                  <Select
                    value={formData.academic.duration}
                    onValueChange={(v) => updateField("academic", "duration", v)}
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
                <div>
                  <Label>Medium of Instruction *</Label>
                  <Select
                    value={formData.academic.medium}
                    onValueChange={(v) => updateField("academic", "medium", v)}
                  >
                    <SelectTrigger><SelectValue placeholder="Select medium" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Hindi">Hindi</SelectItem>
                      <SelectItem value="English + Local">English + Local Language</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Seat Distribution */}
            <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
              <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Seat Distribution</h4>
              <div>
                <Label>Total Seats *</Label>
                <Input
                  type="number"
                  min={0}
                  value={formData.academic.totalSeats}
                  onChange={(e) =>
                    updateField("academic", "totalSeats", parseInt(e.target.value) || 0)
                  }
                  placeholder="e.g. 150"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label>Government</Label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.academic.governmentSeats}
                    onChange={(e) =>
                      updateField("academic", "governmentSeats", parseInt(e.target.value) || 0)
                    }
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Management</Label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.academic.managementSeats}
                    onChange={(e) =>
                      updateField("academic", "managementSeats", parseInt(e.target.value) || 0)
                    }
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>NRI</Label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.academic.nriSeats}
                    onChange={(e) =>
                      updateField("academic", "nriSeats", parseInt(e.target.value) || 0)
                    }
                    placeholder="0"
                  />
                </div>
              </div>
              {formData.academic.totalSeats > 0 && (
                <div className="flex gap-2 flex-wrap pt-1">
                  {[
                    { label: "Govt", value: formData.academic.governmentSeats, color: "bg-green-100 text-green-800" },
                    { label: "Mgmt", value: formData.academic.managementSeats, color: "bg-blue-100 text-blue-800" },
                    { label: "NRI", value: formData.academic.nriSeats, color: "bg-amber-100 text-amber-800" },
                  ].map((s) => (
                    <span key={s.label} className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${s.color}`}>
                      {s.label}: {s.value}
                    </span>
                  ))}
                  {(() => {
                    const allocated = formData.academic.governmentSeats + formData.academic.managementSeats + formData.academic.nriSeats;
                    const remaining = formData.academic.totalSeats - allocated;
                    return remaining !== 0 ? (
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${remaining > 0 ? "bg-gray-100 text-gray-600" : "bg-red-100 text-red-700"}`}>
                        {remaining > 0 ? `${remaining} unallocated` : `${Math.abs(remaining)} over-allocated`}
                      </span>
                    ) : null;
                  })()}
                </div>
              )}
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
                  <Label>NAAC Grade</Label>
                  <Select
                    value={formData.recognition.naacGrade || ""}
                    onValueChange={(v) =>
                      updateField("recognition", "naacGrade", v)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A++">A++</SelectItem>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B++">B++</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <Checkbox
                  checked={formData.recognition.nbaAccredited}
                  onCheckedChange={(checked) =>
                    updateField("recognition", "nbaAccredited", checked)
                  }
                />
                <Label className="cursor-pointer">NBA Accredited</Label>
              </div>
            </div>

            {/* Rankings Section */}
            <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
              <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Rankings</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>World Rank</Label>
                  <Input
                    type="number"
                    min={1}
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
                    type="number"
                    min={1}
                    value={formData.recognition.nationalRank || ""}
                    onChange={(e) =>
                      updateField("recognition", "nationalRank", e.target.value ? parseInt(e.target.value) : null)
                    }
                    placeholder="e.g. 25"
                  />
                </div>
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label>Annual Tuition *</Label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.fees.tuitionAnnual}
                    onChange={(e) => updateField("fees", "tuitionAnnual", parseFloat(e.target.value) || 0)}
                    placeholder="500000"
                  />
                </div>
                <div>
                  <Label>Total Program *</Label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.fees.totalProgram}
                    onChange={(e) => updateField("fees", "totalProgram", parseFloat(e.target.value) || 0)}
                    placeholder="2500000"
                  />
                </div>
                <div>
                  <Label>Registration *</Label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.fees.registration}
                    onChange={(e) => updateField("fees", "registration", parseFloat(e.target.value) || 0)}
                    placeholder="25000"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Currency *</Label>
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
                <div className="flex items-end pb-2">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={formData.fees.scholarshipAvailable}
                      onCheckedChange={(checked) => updateField("fees", "scholarshipAvailable", checked)}
                    />
                    <Label className="cursor-pointer">Scholarship Available</Label>
                  </div>
                </div>
              </div>
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
            {/* Hospital & Academic */}
            <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
              <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Hospital & Academic</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label>Hospital Beds *</Label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.infrastructure.hospitalBeds}
                    onChange={(e) => updateField("infrastructure", "hospitalBeds", parseInt(e.target.value) || 0)}
                    placeholder="e.g. 800"
                  />
                </div>
                <div>
                  <Label>Departments *</Label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.infrastructure.departments}
                    onChange={(e) => updateField("infrastructure", "departments", parseInt(e.target.value) || 0)}
                    placeholder="e.g. 15"
                  />
                </div>
                <div>
                  <Label>Laboratories *</Label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.infrastructure.laboratories}
                    onChange={(e) => updateField("infrastructure", "laboratories", parseInt(e.target.value) || 0)}
                    placeholder="e.g. 10"
                  />
                </div>
              </div>
            </div>

            {/* Hostel */}
            <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
              <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Hostel Capacity</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Boys</Label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.infrastructure.hostelBoys}
                    onChange={(e) => updateField("infrastructure", "hostelBoys", parseInt(e.target.value) || 0)}
                    placeholder="e.g. 500"
                  />
                </div>
                <div>
                  <Label>Girls</Label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.infrastructure.hostelGirls}
                    onChange={(e) => updateField("infrastructure", "hostelGirls", parseInt(e.target.value) || 0)}
                    placeholder="e.g. 500"
                  />
                </div>
              </div>
            </div>

            {/* Facilities */}
            <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
              <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Facilities</h4>
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
                    type="number"
                    min={0}
                    value={formData.admission.applicationFee}
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

      case 7:
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* Support Services */}
            <div className="rounded-lg border border-border/60 bg-card p-3 space-y-4 sm:p-4">
              <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Support Services</h4>
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

