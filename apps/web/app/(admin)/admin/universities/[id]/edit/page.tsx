"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAdminUniversity, useUpdateUniversity } from "@/domains/universities";
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
import { ArrowLeft, ImagePlus, Save, Trash2, Upload } from "lucide-react";
import { Country, State, City } from "country-state-city";
import { SearchableSelect } from "@/components/ui/searchable-select";

export default function EditUniversityPage() {
  const params = useParams();
  const router = useRouter();
  const { data: university, isLoading } = useAdminUniversity(params.id as string);
  const updateMutation = useUpdateUniversity();
  const [formData, setFormData] = useState<any>(null);
  const [locationCodes, setLocationCodes] = useState<{ countryCode: string; stateCode: string }>({ countryCode: "", stateCode: "" });

  useEffect(() => {
    if (university && !formData) {
      setFormData({
        name: university.name || "",
        shortName: university.shortName || "",
        code: university.code || "",
        establishedYear: university.establishedYear || new Date().getFullYear(),
        type: university.type || "PRIVATE",
        website: university.website || "",
        logo: university.logo || "",
        bannerImage: university.bannerImage || "",
        brochureUrl: university.brochureUrl || "",
        location: university.location || { country: "", state: "", city: "", address: "", latitude: null, longitude: null },
        contact: university.contact || { email: "", phone: "", admissionOfficeHours: "" },
        academic: university.academic || { programs: ["MBBS"], duration: "5.5 years", medium: "English", specializations: [], intakeMonths: [], totalSeats: 0, governmentSeats: 0, managementSeats: 0, nriSeats: 0, curriculumType: "", clinicalTraining: "" },
        recognition: (() => {
          const rawRec = university.recognition;
          const rawSubj = rawRec?.subjectRankings;
          const subjArr = Array.isArray(rawSubj) ? rawSubj : Object.entries(rawSubj || {}).map(([k, v]) => ({ subject: k, ranking: v as string }));
          return { bodies: [], ecfmgStatus: "PENDING", nbaAccredited: false, accreditations: [], naacGrade: "", worldRank: null, nationalRank: null, rankingSource: "", worldRankingSource: "", nationalRankingSource: "", otherRankingSource: "", otherNationalRankingSource: "", subjectRankings: subjArr, ...rawRec, subjectRankings: subjArr };
        })(),
        fees: (() => {
          const rawFees = university.fees;
          const rawOther = rawFees?.otherFees;
          const otherFeesArr = Array.isArray(rawOther) ? rawOther : Object.entries(rawOther || {}).map(([k, v]) => ({ name: k, amount: v as number }));
          return { tuitionAnnual: 0, totalProgram: 0, hostelAnnual: 0, registration: 0, examination: 0, library: 0, otherFees: otherFeesArr, currency: "INR", scholarshipAvailable: false, scholarshipDetails: "", paymentSchedule: "", refundPolicy: "", feeHikePolicy: "", ...rawFees, otherFees: otherFeesArr };
        })(),
        infrastructure: university.infrastructure || { hospitalBeds: 0, departments: [], hostelBoys: 0, hostelGirls: 0, laboratories: [], facilities: [], cafeteria: false, wifiCampus: false, transportation: false, librarySize: "", campusArea: 0 },
        admission: university.admission || { entranceExams: ["NEET"], minimumMarks: "", ageCriteria: "", eligibility: "", requiredDocuments: [], applicationDeadline: "", applicationFee: 0, selectionProcess: "", reservationPolicy: "", programEligibility: [] },
        support: university.support || { topRecruiters: [], alumniNetwork: false, alumniCount: 0, internationalStudentSupport: false, visaAssistance: false, languageSupport: [], counselingServices: false, careerGuidance: false, placementRate: null, averagePackage: null },
        content: university.content || { shortDescription: "", longDescription: "", highlights: [], gallery: [], whyChooseUs: "", virtualTour: "" },
        admin: (() => {
          const rawAdmin = university.admin;
          const rawBank = rawAdmin?.bankDetails;
          const bankArr = Array.isArray(rawBank) ? rawBank : Object.entries(rawBank || {}).map(([k, v]) => ({ key: k, value: v as string }));
          return { pocName: "", pocDesignation: "", pocEmail: "", pocPhone: "", phoneCountryCode: "", phoneNumber: "", accountName: "", accountNumber: "", bankName: "", bankBranch: "", ifscCode: "", commission: 10, gstNumber: "", panNumber: "", bankCountry: "", bankDetails: bankArr, ...rawAdmin, bankDetails: bankArr };
        })(),
        socialLinks: university.socialLinks || { facebook: "", instagram: "", youtube: "", linkedin: "", twitter: "", tiktok: "" },
        studentDemographics: university.studentDemographics || { totalStudents: 0, localStudents: 0, foreignStudents: 0, foreignByCountry: [] },
      });
      // Resolve country/state codes from names
      if (university.location?.country) {
        const country = Country.getAllCountries().find(c => c.name === university.location.country);
        if (country) {
          setLocationCodes(prev => ({ ...prev, countryCode: country.isoCode }));
          if (university.location.state) {
            const state = State.getStatesOfCountry(country.isoCode).find(s => s.name === university.location.state);
            if (state) setLocationCodes(prev => ({ ...prev, stateCode: state.isoCode }));
          }
        }
      }
    }
  }, [university, formData]);

  if (isLoading || !formData) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-[#6B6B6B]">Loading...</p>
      </div>
    );
  }

  const updateField = (section: string, field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const updateRootField = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const data = JSON.parse(JSON.stringify(formData));
      // Convert arrays back to Record<> for API first
      if (Array.isArray(data.fees?.otherFees)) {
        const r: Record<string, number> = {};
        for (const item of data.fees.otherFees) {
          if (item.name?.trim()) r[item.name.trim()] = item.amount ?? 0;
        }
        data.fees = { ...data.fees, otherFees: r };
      }
      if (Array.isArray(data.recognition?.subjectRankings)) {
        const r: Record<string, string> = {};
        for (const item of data.recognition.subjectRankings) {
          if (item.subject?.trim()) r[item.subject.trim()] = item.ranking ?? "";
        }
        data.recognition = { ...data.recognition, subjectRankings: r };
      }
      if (Array.isArray(data.admin?.bankDetails)) {
        const r: Record<string, string> = {};
        for (const item of data.admin.bankDetails) {
          if (item.key?.trim()) r[item.key.trim()] = item.value ?? "";
        }
        data.admin = { ...data.admin, bankDetails: r };
      }
      // Remove fields that don't exist in API DTO
      delete data.code;
      // Strip DB-injected id/universityId + empty strings so API validation doesn't reject
      const clean = (obj: any): any => {
        if (obj === null || obj === undefined) return undefined;
        if (Array.isArray(obj)) {
          const cleaned = obj.map(clean).filter((x: any) => x !== undefined);
          return cleaned.length ? cleaned : undefined;
        }
        if (typeof obj === "object") {
          const result: any = {};
          for (const [k, v] of Object.entries(obj)) {
            if (k === "id" || k === "universityId") continue;
            const val = clean(v);
            if (val !== undefined && val !== "" && !(Array.isArray(val) && val.length === 0)) result[k] = val;
          }
          return Object.keys(result).length ? result : undefined;
        }
        return obj;
      };
      await updateMutation.mutateAsync({ id: params.id as string, data: clean(data) });
      router.push(`/admin/universities/${params.id}`);
    } catch (error) {
      console.error("Failed to update university:", error);
      alert("Failed to update university");
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-3 max-w-4xl mx-auto w-full sm:gap-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-[#2D2154] sm:text-2xl">Edit University</h1>
          <p className="text-xs text-[#6B6B6B] sm:text-sm">{university?.name}</p>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Basic Info */}
        <div className="rounded-lg border border-border bg-card p-3 sm:p-5 space-y-4">
          <h2 className="text-sm font-semibold">Basic Information</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label>University Name *</Label>
              <Input value={formData.name} onChange={(e) => updateRootField("name", e.target.value)} />
            </div>
            <div>
              <Label>Short Name *</Label>
              <Input value={formData.shortName} onChange={(e) => updateRootField("shortName", e.target.value)} />
            </div>
            <div>
              <Label>Established Year *</Label>
              <Input type="number" value={formData.establishedYear} onChange={(e) => updateRootField("establishedYear", parseInt(e.target.value))} />
            </div>
            <div>
              <Label>Type *</Label>
              <Select value={formData.type} onValueChange={(v) => updateRootField("type", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="GOVERNMENT">Government</SelectItem>
                  <SelectItem value="PRIVATE">Private</SelectItem>
                  <SelectItem value="DEEMED">Deemed</SelectItem>
                  <SelectItem value="AUTONOMOUS">Autonomous</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Website *</Label>
              <Input value={formData.website} onChange={(e) => updateRootField("website", e.target.value)} />
            </div>
            <div>
              <Label>University Code</Label>
              <Input value={formData.code} onChange={(e) => updateRootField("code", e.target.value)} placeholder="e.g., ABC-001" />
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="rounded-lg border border-border bg-card p-3 sm:p-5 space-y-4">
          <h2 className="text-sm font-semibold">Media</h2>
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
                    } catch { alert("Logo upload failed"); }
                  }}
                  onClick={() => !formData.logo && document.getElementById("edit-logo-upload")?.click()}
                >
                  {formData.logo ? (
                    <img src={formData.logo} alt="Logo" className="h-full w-full rounded-lg object-cover" />
                  ) : (
                    <>
                      <Upload className="mb-1 h-5 w-5 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">Upload</span>
                    </>
                  )}
                  <input id="edit-logo-upload" type="file" accept="image/*" className="hidden" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const { uploadFile } = await import("@/domains/documents/documents.api");
                      const res = await uploadFile(file, "logos");
                      updateRootField("logo", res.url);
                    } catch { alert("Logo upload failed"); }
                  }} />
                </div>
                {formData.logo && (
                  <button type="button" onClick={() => updateRootField("logo", "")} className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white text-[10px] shadow hover:bg-destructive/90">✕</button>
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
                    } catch { alert("Banner upload failed"); }
                  }}
                  onClick={() => !formData.bannerImage && document.getElementById("edit-banner-upload")?.click()}
                >
                  {formData.bannerImage ? (
                    <img src={formData.bannerImage} alt="Banner" className="h-full w-full rounded-lg object-cover" />
                  ) : (
                    <>
                      <ImagePlus className="mb-1 h-6 w-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Drop or click to upload banner</span>
                      <span className="text-[10px] text-muted-foreground/60">1200×400px recommended</span>
                    </>
                  )}
                  <input id="edit-banner-upload" type="file" accept="image/*" className="hidden" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const { uploadFile } = await import("@/domains/documents/documents.api");
                      const res = await uploadFile(file, "banners");
                      updateRootField("bannerImage", res.url);
                    } catch { alert("Banner upload failed"); }
                  }} />
                </div>
                {formData.bannerImage && (
                  <button type="button" onClick={() => updateRootField("bannerImage", "")} className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white text-[10px] shadow hover:bg-destructive/90">✕</button>
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
                  <button type="button" onClick={() => updateRootField("brochureUrl", "")} className="text-destructive/70 hover:text-destructive text-xs font-medium">Remove</button>
                </div>
              ) : (
                <div
                  className="group flex h-16 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border/80 bg-muted/30 transition-colors hover:border-primary/50 hover:bg-primary/5"
                  onClick={() => document.getElementById("edit-brochure-upload")?.click()}
                >
                  <Upload className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Upload brochure PDF</span>
                </div>
              )}
              <input id="edit-brochure-upload" type="file" accept=".pdf,application/pdf" className="hidden" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (file.type !== "application/pdf") { alert("Please upload a PDF file"); return; }
                try {
                  const { uploadFile } = await import("@/domains/documents/documents.api");
                  const res = await uploadFile(file, "brochures");
                  updateRootField("brochureUrl", res.url);
                } catch { alert("Brochure upload failed"); }
              }} />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="rounded-lg border border-border bg-card p-3 sm:p-5 space-y-4">
          <h2 className="text-sm font-semibold">Location</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>Country *</Label>
              <SearchableSelect
                options={Country.getAllCountries().map(c => ({ label: c.name, value: c.isoCode }))}
                value={locationCodes.countryCode}
                onChange={(code) => {
                  setLocationCodes({ countryCode: code, stateCode: "" });
                  updateField("location", "country", Country.getCountryByCode(code)?.name || "");
                  updateField("location", "state", "");
                  updateField("location", "city", "");
                }}
                placeholder="Search country..."
              />
            </div>
            <div>
              <Label>State *</Label>
              <SearchableSelect
                options={locationCodes.countryCode ? State.getStatesOfCountry(locationCodes.countryCode).map(s => ({ label: s.name, value: s.isoCode })) : []}
                value={locationCodes.stateCode}
                onChange={(code) => {
                  setLocationCodes(prev => ({ ...prev, stateCode: code }));
                  updateField("location", "state", State.getStateByCodeAndCountry(code, locationCodes.countryCode)?.name || "");
                  updateField("location", "city", "");
                }}
                placeholder="Search state..."
                disabled={!locationCodes.countryCode}
              />
            </div>
            <div>
              <Label>City *</Label>
              <SearchableSelect
                options={locationCodes.countryCode && locationCodes.stateCode ? City.getCitiesOfState(locationCodes.countryCode, locationCodes.stateCode).map(c => ({ label: c.name, value: c.name })) : []}
                value={formData.location.city}
                onChange={(val) => updateField("location", "city", val)}
                placeholder="Search city..."
                disabled={!locationCodes.stateCode}
              />
            </div>
            <div>
              <Label>Address</Label>
              <Input value={formData.location.address} onChange={(e) => updateField("location", "address", e.target.value)} />
            </div>
            <div>
              <Label>Latitude</Label>
              <Input type="number" step="any" value={formData.location.latitude ?? ""} onChange={(e) => updateField("location", "latitude", e.target.value ? parseFloat(e.target.value) : null)} placeholder="e.g., 28.6139" />
            </div>
            <div>
              <Label>Longitude</Label>
              <Input type="number" step="any" value={formData.location.longitude ?? ""} onChange={(e) => updateField("location", "longitude", e.target.value ? parseFloat(e.target.value) : null)} placeholder="e.g., 77.2090" />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="rounded-lg border border-border bg-card p-3 sm:p-5 space-y-4">
          <h2 className="text-sm font-semibold">Contact</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>Email *</Label>
              <Input type="email" value={formData.contact.email} onChange={(e) => updateField("contact", "email", e.target.value)} />
            </div>
            <div>
              <Label>Phone *</Label>
              <Input value={formData.contact.phone} onChange={(e) => updateField("contact", "phone", e.target.value)} />
            </div>
            <div>
              <Label>Office Hours</Label>
              <Input value={formData.contact.admissionOfficeHours} onChange={(e) => updateField("contact", "admissionOfficeHours", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="rounded-lg border border-border bg-card p-3 sm:p-5 space-y-4">
          <h2 className="text-sm font-semibold">Social Media Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Facebook</Label>
              <Input type="url" inputMode="url" value={formData.socialLinks?.facebook || ""} onChange={(e) => updateField("socialLinks", "facebook", e.target.value)} placeholder="https://facebook.com/university" />
            </div>
            <div>
              <Label>Instagram</Label>
              <Input type="url" inputMode="url" value={formData.socialLinks?.instagram || ""} onChange={(e) => updateField("socialLinks", "instagram", e.target.value)} placeholder="https://instagram.com/university" />
            </div>
            <div>
              <Label>YouTube</Label>
              <Input type="url" inputMode="url" value={formData.socialLinks?.youtube || ""} onChange={(e) => updateField("socialLinks", "youtube", e.target.value)} placeholder="https://youtube.com/channel" />
            </div>
            <div>
              <Label>LinkedIn</Label>
              <Input type="url" inputMode="url" value={formData.socialLinks?.linkedin || ""} onChange={(e) => updateField("socialLinks", "linkedin", e.target.value)} placeholder="https://linkedin.com/school/university" />
            </div>
            <div>
              <Label>Twitter / X</Label>
              <Input type="url" inputMode="url" value={formData.socialLinks?.twitter || ""} onChange={(e) => updateField("socialLinks", "twitter", e.target.value)} placeholder="https://twitter.com/university" />
            </div>
            <div>
              <Label>TikTok</Label>
              <Input type="url" inputMode="url" value={formData.socialLinks?.tiktok || ""} onChange={(e) => updateField("socialLinks", "tiktok", e.target.value)} placeholder="https://tiktok.com/@university" />
            </div>
          </div>
        </div>

        {/* Academic */}
        <div className="rounded-lg border border-border bg-card p-3 sm:p-5 space-y-4">
          <h2 className="text-sm font-semibold">Academic</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>Duration</Label>
              <Input value={formData.academic.duration} onChange={(e) => updateField("academic", "duration", e.target.value)} />
            </div>
            <div>
              <Label>Medium</Label>
              <Input value={formData.academic.medium} onChange={(e) => updateField("academic", "medium", e.target.value)} />
            </div>
            <div>
              <Label>Total Seats</Label>
              <Input type="number" value={formData.academic.totalSeats} onChange={(e) => updateField("academic", "totalSeats", parseInt(e.target.value) || 0)} />
            </div>
            <div>
              <Label>Government Seats</Label>
              <Input type="number" value={formData.academic.governmentSeats} onChange={(e) => updateField("academic", "governmentSeats", parseInt(e.target.value) || 0)} />
            </div>
            <div>
              <Label>Management Seats</Label>
              <Input type="number" value={formData.academic.managementSeats} onChange={(e) => updateField("academic", "managementSeats", parseInt(e.target.value) || 0)} />
            </div>
            <div>
              <Label>NRI Seats</Label>
              <Input type="number" value={formData.academic.nriSeats} onChange={(e) => updateField("academic", "nriSeats", parseInt(e.target.value) || 0)} />
            </div>
            <div>
              <Label>Curriculum Type</Label>
              <Input value={formData.academic.curriculumType || ""} onChange={(e) => updateField("academic", "curriculumType", e.target.value)} placeholder="e.g., CBSE, ICSE, State" />
            </div>
            <div className="sm:col-span-2">
              <Label>Clinical Training</Label>
              <Textarea value={formData.academic.clinicalTraining || ""} onChange={(e) => updateField("academic", "clinicalTraining", e.target.value)} rows={2} />
            </div>
          </div>
        </div>

        {/* Fees */}
        <div className="rounded-lg border border-border bg-card p-3 sm:p-5 space-y-4">
          <h2 className="text-sm font-semibold">Fees</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>Annual Tuition Fee</Label>
              <Input type="number" value={formData.fees.tuitionAnnual} onChange={(e) => updateField("fees", "tuitionAnnual", parseFloat(e.target.value) || 0)} />
            </div>
            <div>
              <Label>Total Program Fee</Label>
              <Input type="number" value={formData.fees.totalProgram} onChange={(e) => updateField("fees", "totalProgram", parseFloat(e.target.value) || 0)} />
            </div>
            <div>
              <Label>Registration Fee</Label>
              <Input type="number" value={formData.fees.registration} onChange={(e) => updateField("fees", "registration", parseFloat(e.target.value) || 0)} />
            </div>
            <div>
              <Label>Currency</Label>
              <Select value={formData.fees.currency} onValueChange={(v) => updateField("fees", "currency", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">INR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Hostel Fee (Annual)</Label>
              <Input type="number" value={formData.fees.hostelAnnual || 0} onChange={(e) => updateField("fees", "hostelAnnual", parseFloat(e.target.value) || 0)} />
            </div>
            <div>
              <Label>Examination Fee</Label>
              <Input type="number" value={formData.fees.examination || 0} onChange={(e) => updateField("fees", "examination", parseFloat(e.target.value) || 0)} />
            </div>
            <div>
              <Label>Library Fee</Label>
              <Input type="number" value={formData.fees.library || 0} onChange={(e) => updateField("fees", "library", parseFloat(e.target.value) || 0)} />
            </div>
            <div>
              <Label>Scholarship Available</Label>
              <Select value={formData.fees.scholarshipAvailable ? "true" : "false"} onValueChange={(v) => updateField("fees", "scholarshipAvailable", v === "true")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Label>Scholarship Details</Label>
              <Textarea value={formData.fees.scholarshipDetails || ""} onChange={(e) => updateField("fees", "scholarshipDetails", e.target.value)} rows={2} />
            </div>
            <div className="sm:col-span-2">
              <Label>Payment Schedule</Label>
              <Textarea value={formData.fees.paymentSchedule} onChange={(e) => updateField("fees", "paymentSchedule", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label>Fee Hike Policy</Label>
              <Textarea value={formData.fees.feeHikePolicy || ""} onChange={(e) => updateField("fees", "feeHikePolicy", e.target.value)} rows={2} />
            </div>
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs text-muted-foreground">Other Fees</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => updateField("fees", "otherFees", [...(formData.fees?.otherFees || []), { name: "", amount: 0 }])}>+ Add Fee</Button>
              </div>
              {(formData.fees?.otherFees || []).length === 0 ? (
                <p className="text-xs text-muted-foreground">No additional fees listed yet.</p>
              ) : (
                <div className="space-y-2">
                  {(formData.fees?.otherFees || []).map((item: { name: string; amount: number }, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                      <Input value={item.name} onChange={(e) => { const updated = [...(formData.fees?.otherFees || [])]; updated[i] = { ...updated[i], name: e.target.value }; updateField("fees", "otherFees", updated); }} placeholder="e.g. Lab Fee" className="flex-1" />
                      <Input type="number" value={item.amount} onChange={(e) => { const updated = [...(formData.fees?.otherFees || [])]; updated[i] = { ...updated[i], amount: parseFloat(e.target.value) || 0 }; updateField("fees", "otherFees", updated); }} placeholder="Amount" className="w-32" />
                      <button type="button" onClick={() => { const updated = (formData.fees?.otherFees || []).filter((_: any, j: number) => j !== i); updateField("fees", "otherFees", updated); }} className="text-destructive/70 hover:text-destructive text-lg leading-none flex-shrink-0">×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Infrastructure */}
        <div className="rounded-lg border border-border bg-card p-3 sm:p-5 space-y-4">
          <h2 className="text-sm font-semibold">Infrastructure</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <Label>Hospital Beds</Label>
              <Input type="number" value={formData.infrastructure.hospitalBeds} onChange={(e) => updateField("infrastructure", "hospitalBeds", parseInt(e.target.value) || 0)} />
            </div>
            <div>
              <Label>Library Size</Label>
              <Input value={formData.infrastructure.librarySize || ""} onChange={(e) => updateField("infrastructure", "librarySize", e.target.value)} placeholder="e.g., 50000 books" />
            </div>
            <div>
              <Label>Campus Area (acres)</Label>
              <Input type="number" value={formData.infrastructure.campusArea || 0} onChange={(e) => updateField("infrastructure", "campusArea", parseFloat(e.target.value) || 0)} />
            </div>
            <div className="sm:col-span-2">
              <Label>Departments</Label>
              <Input value={formData.infrastructure.departments?.join(", ") || ""} onChange={(e) => updateField("infrastructure", "departments", e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))} placeholder="Cardiology, Neurology, Orthopedics" />
            </div>
            <div className="sm:col-span-2">
              <Label>Laboratories</Label>
              <Input value={formData.infrastructure.laboratories?.join(", ") || ""} onChange={(e) => updateField("infrastructure", "laboratories", e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))} placeholder="Anatomy Lab, Physiology Lab, Biochemistry Lab" />
            </div>
            <div>
              <Label>Hostel (Boys)</Label>
              <Input type="number" value={formData.infrastructure.hostelBoys} onChange={(e) => updateField("infrastructure", "hostelBoys", parseInt(e.target.value) || 0)} />
            </div>
            <div>
              <Label>Hostel (Girls)</Label>
              <Input type="number" value={formData.infrastructure.hostelGirls} onChange={(e) => updateField("infrastructure", "hostelGirls", parseInt(e.target.value) || 0)} />
            </div>
          </div>
          <div className="flex flex-wrap gap-4 pt-2">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={formData.infrastructure.cafeteria} onCheckedChange={(v) => updateField("infrastructure", "cafeteria", v)} />
              Cafeteria
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={formData.infrastructure.wifiCampus} onCheckedChange={(v) => updateField("infrastructure", "wifiCampus", v)} />
              WiFi Campus
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={formData.infrastructure.transportation} onCheckedChange={(v) => updateField("infrastructure", "transportation", v)} />
              Transportation
            </label>
          </div>
        </div>

        {/* Recognition */}
        <div className="rounded-lg border border-border bg-card p-3 sm:p-5 space-y-4">
          <h2 className="text-sm font-semibold">Recognition & Accreditation</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>Recognition Bodies</Label>
              <Input value={formData.recognition.bodies?.join(", ") || ""} onChange={(e) => updateField("recognition", "bodies", e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))} placeholder="NMC, WHO, etc." />
            </div>
            <div>
              <Label>ECFMG Status</Label>
              <Select value={formData.recognition.ecfmgStatus} onValueChange={(v) => updateField("recognition", "ecfmgStatus", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="NOT_REQUIRED">Not Required</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>World Rank</Label>
              <Input type="number" value={formData.recognition.worldRank ?? ""} onChange={(e) => updateField("recognition", "worldRank", parseInt(e.target.value) || null)} />
            </div>
            <div>
              <Label>National Rank</Label>
              <Input type="number" value={formData.recognition.nationalRank ?? ""} onChange={(e) => updateField("recognition", "nationalRank", parseInt(e.target.value) || null)} />
            </div>
            <div>
              <Label>NAAC Grade</Label>
              <Select value={formData.recognition.naacGrade || ""} onValueChange={(v) => updateField("recognition", "naacGrade", v)}>
                <SelectTrigger><SelectValue placeholder="Select NAAC grade" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Not Accredited</SelectItem>
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
            <div>
              <Label>Ranking Source</Label>
              <Input value={formData.recognition.rankingSource || ""} onChange={(e) => updateField("recognition", "rankingSource", e.target.value)} placeholder="e.g., NIRF, QS, Times" />
            </div>
            <div>
              <Label>World Ranking Source</Label>
              <Input value={formData.recognition.worldRankingSource || ""} onChange={(e) => updateField("recognition", "worldRankingSource", e.target.value)} />
            </div>
            <div>
              <Label>National Ranking Source</Label>
              <Input value={formData.recognition.nationalRankingSource || ""} onChange={(e) => updateField("recognition", "nationalRankingSource", e.target.value)} />
            </div>
            <div>
              <Label>Other Ranking Source</Label>
              <Input value={formData.recognition.otherRankingSource || ""} onChange={(e) => updateField("recognition", "otherRankingSource", e.target.value)} />
            </div>
            <div>
              <Label>Other National Ranking Source</Label>
              <Input value={formData.recognition.otherNationalRankingSource || ""} onChange={(e) => updateField("recognition", "otherNationalRankingSource", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs text-muted-foreground">Subject Rankings</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => updateField("recognition", "subjectRankings", [...(formData.recognition?.subjectRankings || []), { subject: "", ranking: "" }])}>+ Add Subject Ranking</Button>
              </div>
              {(formData.recognition?.subjectRankings || []).length === 0 ? (
                <p className="text-xs text-muted-foreground">No subject rankings listed yet.</p>
              ) : (
                <div className="space-y-2">
                  {(formData.recognition?.subjectRankings || []).map((item: { subject: string; ranking: string }, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                      <Input value={item.subject} onChange={(e) => { const updated = [...(formData.recognition?.subjectRankings || [])]; updated[i] = { ...updated[i], subject: e.target.value }; updateField("recognition", "subjectRankings", updated); }} placeholder="e.g. Medicine" className="flex-1" />
                      <Input value={item.ranking} onChange={(e) => { const updated = [...(formData.recognition?.subjectRankings || [])]; updated[i] = { ...updated[i], ranking: e.target.value }; updateField("recognition", "subjectRankings", updated); }} placeholder="e.g. Top 100" className="flex-1" />
                      <button type="button" onClick={() => { const updated = (formData.recognition?.subjectRankings || []).filter((_: any, j: number) => j !== i); updateField("recognition", "subjectRankings", updated); }} className="text-destructive/70 hover:text-destructive text-lg leading-none flex-shrink-0">×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Admission */}
        <div className="rounded-lg border border-border bg-card p-3 sm:p-5 space-y-4">
          <h2 className="text-sm font-semibold">Admission Details</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>Entrance Exams</Label>
              <Input value={formData.admission.entranceExams?.join(", ") || ""} onChange={(e) => updateField("admission", "entranceExams", e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))} />
            </div>
            <div>
              <Label>Minimum Marks</Label>
              <Input value={formData.admission.minimumMarks || ""} onChange={(e) => updateField("admission", "minimumMarks", e.target.value)} />
            </div>
            <div>
              <Label>Age Criteria</Label>
              <Input value={formData.admission.ageCriteria || ""} onChange={(e) => updateField("admission", "ageCriteria", e.target.value)} />
            </div>
            <div>
              <Label>Eligibility</Label>
              <Input value={formData.admission.eligibility || ""} onChange={(e) => updateField("admission", "eligibility", e.target.value)} />
            </div>
            <div>
              <Label>Application Fee</Label>
              <Input type="number" value={formData.admission.applicationFee} onChange={(e) => updateField("admission", "applicationFee", parseFloat(e.target.value) || 0)} />
            </div>
            <div>
              <Label>Application Deadline</Label>
              <Input type="date" value={formData.admission.applicationDeadline ? formData.admission.applicationDeadline.split("T")[0] : ""} onChange={(e) => updateField("admission", "applicationDeadline", e.target.value ? new Date(e.target.value).toISOString() : "")} />
            </div>
            <div className="sm:col-span-2">
              <Label>Reservation Policy</Label>
              <Textarea value={formData.admission.reservationPolicy || ""} onChange={(e) => updateField("admission", "reservationPolicy", e.target.value)} rows={2} />
            </div>
            <div className="sm:col-span-2">
              <Label>Selection Process</Label>
              <Textarea value={formData.admission.selectionProcess || ""} onChange={(e) => updateField("admission", "selectionProcess", e.target.value)} rows={3} />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs text-muted-foreground mb-1.5 block">Program Eligibility</Label>
              <div className="space-y-2">
                {(formData.admission.programEligibility || []).map((entry: { programName: string; minimumMarks: string; eligibility: string }, i: number) => (
                  <div key={i} className="flex items-start gap-2 p-3 border rounded-lg bg-muted/30">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <Input placeholder="Program Name" value={entry.programName || ""} onChange={(e) => {
                        const list = [...(formData.admission.programEligibility || [])];
                        list[i] = { ...list[i], programName: e.target.value };
                        updateField("admission", "programEligibility", list);
                      }} />
                      <Input placeholder="Minimum Marks" value={entry.minimumMarks || ""} onChange={(e) => {
                        const list = [...(formData.admission.programEligibility || [])];
                        list[i] = { ...list[i], minimumMarks: e.target.value };
                        updateField("admission", "programEligibility", list);
                      }} />
                      <Input placeholder="Eligibility Criteria" value={entry.eligibility || ""} onChange={(e) => {
                        const list = [...(formData.admission.programEligibility || [])];
                        list[i] = { ...list[i], eligibility: e.target.value };
                        updateField("admission", "programEligibility", list);
                      }} />
                    </div>
                    <Button type="button" variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-destructive" onClick={() => {
                      const list = [...(formData.admission.programEligibility || [])];
                      list.splice(i, 1);
                      updateField("admission", "programEligibility", list);
                    }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => {
                  const list = [...(formData.admission.programEligibility || []), { programName: "", minimumMarks: "", eligibility: "" }];
                  updateField("admission", "programEligibility", list);
                }}>+ Add Program Eligibility</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="rounded-lg border border-border bg-card p-3 sm:p-5 space-y-4">
          <h2 className="text-sm font-semibold">Support Services</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>Placement Rate (%)</Label>
              <Input type="number" value={formData.support.placementRate ?? ""} onChange={(e) => updateField("support", "placementRate", parseFloat(e.target.value) || 0)} />
            </div>
            <div>
              <Label>Average Package</Label>
              <Input type="number" value={formData.support.averagePackage ?? ""} onChange={(e) => updateField("support", "averagePackage", parseFloat(e.target.value) || 0)} />
            </div>
          </div>
          <div className="flex flex-wrap gap-4 pt-2">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={formData.support.visaAssistance} onCheckedChange={(v) => updateField("support", "visaAssistance", v)} />
              Visa Assistance
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={formData.support.internationalStudentSupport} onCheckedChange={(v) => updateField("support", "internationalStudentSupport", v)} />
              International Student Support
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={formData.support.counselingServices} onCheckedChange={(v) => updateField("support", "counselingServices", v)} />
              Counseling Services
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={formData.support.careerGuidance} onCheckedChange={(v) => updateField("support", "careerGuidance", v)} />
              Career Guidance
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={formData.support.alumniNetwork} onCheckedChange={(v) => updateField("support", "alumniNetwork", v)} />
              Alumni Network
            </label>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-4">
            <div>
              <Label>Alumni Count</Label>
              <Input type="number" value={formData.support.alumniCount || 0} onChange={(e) => updateField("support", "alumniCount", parseInt(e.target.value) || 0)} />
            </div>
          </div>
        </div>

        {/* Student Demographics */}
        <div className="rounded-lg border border-border bg-card p-3 sm:p-5 space-y-4">
          <h2 className="text-sm font-semibold">Student Demographics</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <Label>Total Students</Label>
              <Input type="number" value={formData.studentDemographics?.totalStudents ?? ""} onChange={(e) => updateField("studentDemographics", "totalStudents", parseInt(e.target.value) || 0)} />
            </div>
            <div>
              <Label>Local Students</Label>
              <Input type="number" value={formData.studentDemographics?.localStudents ?? ""} onChange={(e) => updateField("studentDemographics", "localStudents", parseInt(e.target.value) || 0)} />
            </div>
            <div>
              <Label>Foreign Students</Label>
              <Input type="number" value={formData.studentDemographics?.foreignStudents ?? ""} onChange={(e) => updateField("studentDemographics", "foreignStudents", parseInt(e.target.value) || 0)} />
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">Foreign Students by Country</Label>
            <div className="space-y-2">
              {(formData.studentDemographics?.foreignByCountry || []).map((entry: { country: string; count: number }, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    placeholder="Country name"
                    className="flex-1"
                    value={entry.country || ""}
                    onChange={(e) => {
                      const list = [...(formData.studentDemographics?.foreignByCountry || [])];
                      list[i] = { ...list[i], country: e.target.value };
                      updateField("studentDemographics", "foreignByCountry", list);
                    }}
                  />
                  <Input
                    type="number"
                    placeholder="Count"
                    className="w-24"
                    value={entry.count || ""}
                    onChange={(e) => {
                      const list = [...(formData.studentDemographics?.foreignByCountry || [])];
                      list[i] = { ...list[i], count: parseInt(e.target.value) || 0 };
                      updateField("studentDemographics", "foreignByCountry", list);
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 shrink-0 text-destructive"
                    onClick={() => {
                      const list = [...(formData.studentDemographics?.foreignByCountry || [])];
                      list.splice(i, 1);
                      updateField("studentDemographics", "foreignByCountry", list);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const list = [...(formData.studentDemographics?.foreignByCountry || []), { country: "", count: 0 }];
                  updateField("studentDemographics", "foreignByCountry", list);
                }}
              >
                + Add Country
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="rounded-lg border border-border bg-card p-3 sm:p-5 space-y-4">
          <h2 className="text-sm font-semibold">Content</h2>
          <div className="space-y-4">
            <div>
              <Label>Short Description</Label>
              <Textarea value={formData.content.shortDescription} onChange={(e) => updateField("content", "shortDescription", e.target.value)} rows={2} />
            </div>
            <div>
              <Label>Long Description</Label>
              <Textarea value={formData.content.longDescription} onChange={(e) => updateField("content", "longDescription", e.target.value)} rows={5} />
            </div>
            <div>
              <Label>Why Choose Us</Label>
              <Textarea value={formData.content.whyChooseUs || ""} onChange={(e) => updateField("content", "whyChooseUs", e.target.value)} rows={3} />
            </div>
            <div>
              <Label>Virtual Tour URL</Label>
              <Input type="url" value={formData.content.virtualTour || ""} onChange={(e) => updateField("content", "virtualTour", e.target.value)} placeholder="https://..." />
            </div>
          </div>
        </div>

        {/* Admin */}
        <div className="rounded-lg border border-border bg-card p-3 sm:p-5 space-y-4">
          <h2 className="text-sm font-semibold">Admin / Point of Contact</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>POC Name</Label>
              <Input value={formData.admin.pocName} onChange={(e) => updateField("admin", "pocName", e.target.value)} />
            </div>
            <div>
              <Label>POC Designation</Label>
              <Input value={formData.admin.pocDesignation || ""} onChange={(e) => updateField("admin", "pocDesignation", e.target.value)} placeholder="e.g., Director of Admissions" />
            </div>
            <div>
              <Label>POC Email</Label>
              <Input type="email" value={formData.admin.pocEmail} onChange={(e) => updateField("admin", "pocEmail", e.target.value)} />
            </div>
            <div>
              <Label>POC Phone</Label>
              <Input value={formData.admin.pocPhone} onChange={(e) => updateField("admin", "pocPhone", e.target.value)} />
            </div>
            <div>
              <Label>Phone Country Code</Label>
              <Input value={formData.admin.phoneCountryCode || ""} onChange={(e) => updateField("admin", "phoneCountryCode", e.target.value)} placeholder="e.g., +91" />
            </div>
            <div>
              <Label>Phone Number (without country code)</Label>
              <Input value={formData.admin.phoneNumber || ""} onChange={(e) => updateField("admin", "phoneNumber", e.target.value)} />
            </div>
            <div>
              <Label>Commission (%)</Label>
              <Input type="number" value={formData.admin.commission} onChange={(e) => updateField("admin", "commission", parseFloat(e.target.value) || 0)} />
            </div>
            <div>
              <Label>GST Number</Label>
              <Input value={formData.admin.gstNumber || ""} onChange={(e) => updateField("admin", "gstNumber", e.target.value)} />
            </div>
            <div>
              <Label>PAN Number</Label>
              <Input value={formData.admin.panNumber || ""} onChange={(e) => updateField("admin", "panNumber", e.target.value)} />
            </div>
            <div>
              <Label>Bank Country</Label>
              <Input value={formData.admin.bankCountry || ""} onChange={(e) => updateField("admin", "bankCountry", e.target.value)} />
            </div>
            <div>
              <Label>Account Name</Label>
              <Input value={formData.admin.accountName} onChange={(e) => updateField("admin", "accountName", e.target.value)} />
            </div>
            <div>
              <Label>Account Number</Label>
              <Input value={formData.admin.accountNumber} onChange={(e) => updateField("admin", "accountNumber", e.target.value)} />
            </div>
            <div>
              <Label>Bank Name</Label>
              <Input value={formData.admin.bankName} onChange={(e) => updateField("admin", "bankName", e.target.value)} />
            </div>
            <div>
              <Label>Bank Branch</Label>
              <Input value={formData.admin.bankBranch} onChange={(e) => updateField("admin", "bankBranch", e.target.value)} />
            </div>
            <div>
              <Label>IFSC Code</Label>
              <Input value={formData.admin.ifscCode} onChange={(e) => updateField("admin", "ifscCode", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs text-muted-foreground">Additional Bank Details</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => updateField("admin", "bankDetails", [...(formData.admin?.bankDetails || []), { key: "", value: "" }])}>+ Add Bank Detail</Button>
              </div>
              {(formData.admin?.bankDetails || []).length === 0 ? (
                <p className="text-xs text-muted-foreground">No additional bank details listed yet.</p>
              ) : (
                <div className="space-y-2">
                  {(formData.admin?.bankDetails || []).map((item: { key: string; value: string }, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                      <Input value={item.key} onChange={(e) => { const updated = [...(formData.admin?.bankDetails || [])]; updated[i] = { ...updated[i], key: e.target.value }; updateField("admin", "bankDetails", updated); }} placeholder="e.g. SWIFT Code" className="flex-1" />
                      <Input value={item.value} onChange={(e) => { const updated = [...(formData.admin?.bankDetails || [])]; updated[i] = { ...updated[i], value: e.target.value }; updateField("admin", "bankDetails", updated); }} placeholder="Value" className="flex-1" />
                      <button type="button" onClick={() => { const updated = (formData.admin?.bankDetails || []).filter((_: any, j: number) => j !== i); updateField("admin", "bankDetails", updated); }} className="text-destructive/70 hover:text-destructive text-lg leading-none flex-shrink-0">×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="sticky bottom-0 flex justify-end gap-2 border-t border-border bg-[#F7F5F2] py-3 -mx-4 px-4 sm:-mx-6 sm:px-6">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button size="sm" onClick={handleSubmit} disabled={updateMutation.isPending}>
          <Save className="mr-1.5 h-3.5 w-3.5" />
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
