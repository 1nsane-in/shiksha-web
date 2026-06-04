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
import { ArrowLeft, Save } from "lucide-react";
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
        establishedYear: university.establishedYear || new Date().getFullYear(),
        type: university.type || "PRIVATE",
        website: university.website || "",
        logo: university.logo || "",
        bannerImage: university.bannerImage || "",
        brochureUrl: university.brochureUrl || "",
        location: university.location || { country: "", state: "", city: "", address: "" },
        contact: university.contact || { email: "", phone: "", admissionOfficeHours: "" },
        academic: university.academic || { programs: ["MBBS"], duration: "5.5 years", medium: "English", specializations: [], intakeMonths: [], totalSeats: 0, governmentSeats: 0, managementSeats: 0, nriSeats: 0 },
        recognition: university.recognition || { bodies: [], ecfmgStatus: "PENDING", nbaAccredited: false, accreditations: [] },
        fees: university.fees || { tuitionAnnual: 0, totalProgram: 0, registration: 0, currency: "INR", scholarshipAvailable: false, paymentSchedule: "", refundPolicy: "" },
        infrastructure: university.infrastructure || { hospitalBeds: 0, departments: 0, hostelBoys: 0, hostelGirls: 0, laboratories: 0, facilities: [], cafeteria: false, wifiCampus: false, transportation: false },
        admission: university.admission || { entranceExams: ["NEET"], minimumMarks: "", ageCriteria: "", eligibility: "", requiredDocuments: [], applicationDeadline: "", applicationFee: 0, selectionProcess: "" },
        support: university.support || { topRecruiters: [], alumniNetwork: false, internationalStudentSupport: false, visaAssistance: false, languageSupport: [], counselingServices: false, careerGuidance: false },
        content: university.content || { shortDescription: "", longDescription: "", highlights: [], gallery: [] },
        admin: university.admin || { pocName: "", pocDesignation: "", pocEmail: "", pocPhone: "", accountName: "", accountNumber: "", bankName: "", bankBranch: "", ifscCode: "", commission: 10 },
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
      await updateMutation.mutateAsync({ id: params.id as string, data: formData });
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
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Website *</Label>
              <Input value={formData.website} onChange={(e) => updateRootField("website", e.target.value)} />
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
            <div className="sm:col-span-2">
              <Label>Payment Schedule</Label>
              <Textarea value={formData.fees.paymentSchedule} onChange={(e) => updateField("fees", "paymentSchedule", e.target.value)} />
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
              <Label>Departments</Label>
              <Input type="number" value={formData.infrastructure.departments} onChange={(e) => updateField("infrastructure", "departments", parseInt(e.target.value) || 0)} />
            </div>
            <div>
              <Label>Laboratories</Label>
              <Input type="number" value={formData.infrastructure.laboratories} onChange={(e) => updateField("infrastructure", "laboratories", parseInt(e.target.value) || 0)} />
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
              <Label>POC Email</Label>
              <Input type="email" value={formData.admin.pocEmail} onChange={(e) => updateField("admin", "pocEmail", e.target.value)} />
            </div>
            <div>
              <Label>POC Phone</Label>
              <Input value={formData.admin.pocPhone} onChange={(e) => updateField("admin", "pocPhone", e.target.value)} />
            </div>
            <div>
              <Label>Commission (%)</Label>
              <Input type="number" value={formData.admin.commission} onChange={(e) => updateField("admin", "commission", parseFloat(e.target.value) || 0)} />
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
