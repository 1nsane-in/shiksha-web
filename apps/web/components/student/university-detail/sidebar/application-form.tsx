"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { brand as theme } from "@/lib/brand";
import Link from "next/link";
import {
  useSubmitApplication,
  useCheckApplication,
} from "@/domains/student/student.queries";
import { useAuth } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/api-error";
import type { SubmitApplicationFormData } from "@/domains/student/student.types";
import {
  Check,
  ChevronRight,
  Loader2,
  Plus,
  X,
} from "lucide-react";
import { Country, State, City } from "country-state-city";

/* ─── FormField ─── */
function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  disabled,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label
        className="mb-1 block text-xs font-medium"
        style={{ color: theme.inkMuted }}
      >
        {label}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60"
        style={{
          background: theme.canvas,
          color: theme.ink,
          border: "1px solid " + (error ? "#EF4444" : theme.hairline),
        }}
      />
      {error && <p className="mt-0.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

/* ─── SelectField ─── */
function SelectField({
  label,
  name,
  value,
  onChange,
  error,
  options,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label
        className="mb-1 block text-xs font-medium"
        style={{ color: theme.inkMuted }}
      >
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-all duration-200"
        style={{
          background: theme.canvas,
          color: theme.ink,
          border: "1px solid " + (error ? "#EF4444" : theme.hairline),
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-0.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

/* ─── LocationGroup ─── */
function LocationGroup({
  prefix,
  countryValue,
  stateValue,
  cityValue,
  onCountryChange,
  onStateChange,
  onCityChange,
}: {
  prefix: string;
  countryValue: string;
  stateValue: string;
  cityValue: string;
  onCountryChange: (v: string) => void;
  onStateChange: (v: string) => void;
  onCityChange: (v: string) => void;
}) {
  const countries = useMemo(() => Country.getAllCountries().map((c) => ({ value: c.isoCode, label: c.name })), []);
  const states = useMemo(() => (countryValue ? State.getStatesOfCountry(countryValue).map((s) => ({ value: s.isoCode, label: s.name })) : []), [countryValue]);
  const cities = useMemo(() => (countryValue && stateValue ? City.getCitiesOfState(countryValue, stateValue).map((c) => ({ value: c.name, label: c.name })) : []), [countryValue, stateValue]);

  return (
    <div className="grid grid-cols-1 gap-3">
      <SelectField
        label="Country *"
        name={`${prefix}Country`}
        value={countryValue}
        onChange={(e) => { onCountryChange(e.target.value); onStateChange(""); onCityChange(""); }}
        options={[{ value: "", label: "Select country" }, ...countries]}
      />
      <div className="grid grid-cols-2 gap-2">
        <SelectField
          label="State *"
          name={`${prefix}State`}
          value={stateValue}
          onChange={(e) => { onStateChange(e.target.value); onCityChange(""); }}
          options={[{ value: "", label: "Select state" }, ...states]}
        />
        <SelectField
          label="City *"
          name={`${prefix}City`}
          value={cityValue}
          onChange={(e) => onCityChange(e.target.value)}
          options={[{ value: "", label: "Select city" }, ...cities]}
        />
      </div>
    </div>
  );
}

/* ─── ApplicationForm ─── */
export function ApplicationForm({
  uniName,
  uniId,
}: {
  uniName: string;
  uniId: string;
}) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [extraLanguages, setExtraLanguages] = useState<{ name: string; speaking: string; reading: string; writing: string }[]>([]);
  const [passportFile, setPassportFile] = useState<File | null>(null);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const submit = useSubmitApplication();
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isStudent, user } = useAuth();

  // pre-fill email from logged-in user
  useEffect(() => {
    if (user?.email && !formData.email) {
      setFormData((prev) => ({ ...prev, email: user.email }));
    }
  }, [user?.email]);

  const {
    data: checkResult,
    isLoading: isCheckLoading,
    isError: isCheckError,
  } = useCheckApplication(isAuthenticated && isStudent ? uniId : "");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  }

  function addLanguage() {
    setExtraLanguages((prev) => [...prev, { name: "", speaking: "moderate", reading: "moderate", writing: "moderate" }]);
  }

  function removeLanguage(index: number) {
    setExtraLanguages((prev) => prev.filter((_, i) => i !== index));
  }

  function handleLangChange(index: number, field: string, value: string) {
    setExtraLanguages((prev) => prev.map((l, i) => (i === index ? { ...l, [field]: value } : l)));
  }

  function handleLocationCountry(prefix: string, value: string) {
    setFormData((prev) => ({
      ...prev,
      [`${prefix}Country`]: value,
      [`${prefix}State`]: "",
      [`${prefix}City`]: "",
    }));
  }

  function handleLocationState(prefix: string, value: string) {
    setFormData((prev) => ({
      ...prev,
      [`${prefix}State`]: value,
      [`${prefix}City`]: "",
    }));
  }

  function handleLocationCity(prefix: string, value: string) {
    setFormData((prev) => ({ ...prev, [`${prefix}City`]: value }));
  }

  const requiredFields = [
    "firstName", "lastName", "email", "dateOfBirth", "citizenship",
    "gender", "maritalStatus", "selectedProgram", "embassyLocation",
    "signature", "birthCity", "birthState", "birthCountry", "lang1Name",
    "permanentAddress", "permanentCity", "permanentState", "permanentZip",
    "permanentCountry",
  ] as const;

  const isFormValid = useMemo(
    () => requiredFields.every((f) => formData[f]?.trim()) && !!passportFile && !!certificateFile,
    [formData, passportFile, certificateFile],
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const required = requiredFields;
    const newErrors: Record<string, string> = {};
    for (const field of required) {
      if (!formData[field]?.trim()) newErrors[field] = "Required";
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const today = new Date().toISOString().split("T")[0];
    const payload: SubmitApplicationFormData = {
      universityId: uniId,
      firstName: formData.firstName || "",
      middleName: formData.middleName || undefined,
      lastName: formData.lastName || "",
      email: formData.email || "",
      dateOfBirth: formData.dateOfBirth || "",
      citizenship: formData.citizenship || "",
      gender: formData.gender as "male" | "female" | "other",
      maritalStatus: formData.maritalStatus as "single" | "married",
      selectedProgram: formData.selectedProgram as
        | "pre-medical" | "general-medicine" | "dentistry" | "post-graduate",
      permanentAddress: formData.permanentAddress || "",
      permanentCity: formData.permanentCity || "",
      permanentState: formData.permanentState || "",
      permanentZip: formData.permanentZip || "",
      permanentCountry: formData.permanentCountry || "",
      embassyLocation: formData.embassyLocation || "",
      signature: formData.signature || "",
      signatureDate: formData.signatureDate || today,
      placeOfBirth: {
        city: formData.birthCity || "",
        state: formData.birthState || "",
        country: formData.birthCountry || "",
      },
      language1: {
        name: formData.lang1Name || "",
        speaking: (formData.lang1Speaking || "moderate") as "high" | "moderate" | "low",
        reading: (formData.lang1Reading || "moderate") as "high" | "moderate" | "low",
        writing: (formData.lang1Writing || "moderate") as "high" | "moderate" | "low",
      },
      otherLanguages: extraLanguages.length > 0 ? extraLanguages.map((l) => ({
        name: l.name,
        speaking: l.speaking as "high" | "moderate" | "low",
        reading: l.reading as "high" | "moderate" | "low",
        writing: l.writing as "high" | "moderate" | "low",
      })) : undefined,
      postGraduateDetail:
        formData.selectedProgram === "post-graduate"
          ? formData.postGraduateDetail || ""
          : undefined,
    };
    try {
      await submit.mutateAsync({ data: payload, passport: passportFile ?? undefined, certificate: certificateFile ?? undefined });
      router.push("/student/dashboard");
    } catch (err) {
      setErrors({
        _form: getApiErrorMessage(
          err,
          "Something went wrong. Please check your details and try again.",
        ),
      });
    }
  }

  if (!isAuthenticated) {
    return (
      <Link
        href={`/login?redirectUrl=${encodeURIComponent(pathname)}`}
        className="inline-flex w-full items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold transition-all duration-200"
        style={{
          background: theme.gold,
          color: "#fff",
          borderRadius: theme.btnRadius,
        }}
      >
        Login to Apply
      </Link>
    );
  }

  if (!isStudent) {
    return (
      <div
        className="rounded-lg px-4 py-3 text-sm text-center"
        style={{
          background: "rgba(196, 149, 59, 0.08)",
          border: "1px solid rgba(196, 149, 59, 0.2)",
          color: theme.inkMuted,
        }}
      >
        Only students can apply for admission.
      </div>
    );
  }

  if (isCheckLoading) {
    return (
      <div className="flex items-center justify-center py-3">
        <Loader2 className="size-5 animate-spin" style={{ color: theme.gold }} />
      </div>
    );
  }

  if (!isCheckError && checkResult?.applied && checkResult.application) {
    const app = checkResult.application;
    const statusColors: Record<string, string> = {
      pending: "#CA8A04",
      in_review: "#2563EB",
      approved: "#16A34A",
      rejected: "#DC2626",
    };
    const statusColor = statusColors[app.status] || theme.inkMuted;

    return (
      <div
        className="rounded-xl px-4 py-4 text-left"
        style={{
          background: theme.canvas,
          border: "1px solid " + theme.hairline,
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Check className="size-4" style={{ color: "#16A34A" }} />
          <p className="text-sm font-semibold" style={{ color: theme.ink }}>
            Already Applied
          </p>
        </div>
        <p className="text-xs mb-1" style={{ color: theme.inkMuted }}>
          Program: {app.selectedProgram}
        </p>
        <p className="text-xs mb-3" style={{ color: theme.inkMuted }}>
          Status:{" "}
          <span className="font-medium" style={{ color: statusColor }}>
            {app.status
              .replace(/_/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase())}
          </span>
        </p>
        <Link
          href={`/student/applications/${app.id}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200"
          style={{
            background: theme.ink,
            color: "#fff",
            borderRadius: theme.btnRadius,
          }}
        >
          View Application
          <ChevronRight className="size-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex w-full items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold transition-all duration-200"
        style={{
          background: open ? theme.canvas : theme.gold,
          color: open ? theme.ink : "#fff",
          borderRadius: theme.btnRadius,
          border: "1px solid " + (open ? theme.hairline : theme.gold),
        }}
      >
        {open ? "Cancel" : "Apply Now"}
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-left">
          {errors._form && (
            <div
              className="flex items-start gap-2 rounded-lg px-4 py-3 text-sm text-red-700"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
              }}
            >
              <X className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{errors._form}</span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3">
            <FormField label="First Name *" name="firstName" value={formData.firstName || ""} onChange={handleChange} error={errors.firstName} />
            <FormField label="Middle Name" name="middleName" value={formData.middleName || ""} onChange={handleChange} placeholder="(optional)" />
            <FormField label="Last Name *" name="lastName" value={formData.lastName || ""} onChange={handleChange} error={errors.lastName} />
          </div>
          <div className="grid grid-cols-1 gap-3">
            <FormField label="Email *" name="email" type="email" value={formData.email || ""} onChange={handleChange} error={errors.email} disabled />            
            <FormField label="Phone *" name="phone" type="tel" value={formData.phone || ""} onChange={handleChange} error={errors.phone} />
          </div>
          <div className="grid grid-cols-1 gap-3">
            <FormField label="Date of Birth *" name="dateOfBirth" type="date" value={formData.dateOfBirth || ""} onChange={handleChange} error={errors.dateOfBirth} />
            <SelectField label="Gender *" name="gender" value={formData.gender || ""} onChange={handleChange} error={errors.gender} options={[
              { value: "", label: "Select gender" },
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "other", label: "Other" },
            ]} />
          </div>
          <div className="grid grid-cols-1 gap-3">
            <FormField label="Citizenship *" name="citizenship" value={formData.citizenship || ""} onChange={handleChange} error={errors.citizenship} placeholder="e.g. Indian" />
            <SelectField label="Marital Status *" name="maritalStatus" value={formData.maritalStatus || ""} onChange={handleChange} error={errors.maritalStatus} options={[
              { value: "", label: "Select status" },
              { value: "single", label: "Single" },
              { value: "married", label: "Married" },
            ]} />
          </div>
          <div className="grid grid-cols-1 gap-3">
            <SelectField label="Selected Program *" name="selectedProgram" value={formData.selectedProgram || ""} onChange={handleChange} error={errors.selectedProgram} options={[
              { value: "", label: "Select program" },
              { value: "pre-medical", label: "Pre-Medical" },
              { value: "general-medicine", label: "General Medicine" },
              { value: "dentistry", label: "Dentistry" },
              { value: "post-graduate", label: "Post Graduate" },
            ]} />
            <FormField label="Embassy Location *" name="embassyLocation" value={formData.embassyLocation || ""} onChange={handleChange} error={errors.embassyLocation} placeholder="e.g. New Delhi" />
          </div>

          {formData.selectedProgram === "post-graduate" && (
            <FormField label="Post Graduate Details (Specialization/Experience)" name="postGraduateDetail" value={formData.postGraduateDetail || ""} onChange={handleChange} placeholder="e.g. Completed residency in internal medicine, 2 years clinical experience" />
          )}

          <FormField label="Permanent Address *" name="permanentAddress" value={formData.permanentAddress || ""} onChange={handleChange} error={errors.permanentAddress} />
          <div className="grid grid-cols-1 gap-3">
            <FormField label="Zip Code *" name="permanentZip" value={formData.permanentZip || ""} onChange={handleChange} error={errors.permanentZip} />
          </div>
          <LocationGroup
            prefix="permanent"
            countryValue={formData.permanentCountry || ""}
            stateValue={formData.permanentState || ""}
            cityValue={formData.permanentCity || ""}
            onCountryChange={(v) => handleLocationCountry("permanent", v)}
            onStateChange={(v) => handleLocationState("permanent", v)}
            onCityChange={(v) => handleLocationCity("permanent", v)}
          />

          <p className="text-xs font-medium uppercase tracking-wider pt-2" style={{ color: theme.inkSubtle }}>City, State, Country of Birth *</p>
          <LocationGroup
            prefix="birth"
            countryValue={formData.birthCountry || ""}
            stateValue={formData.birthState || ""}
            cityValue={formData.birthCity || ""}
            onCountryChange={(v) => handleLocationCountry("birth", v)}
            onStateChange={(v) => handleLocationState("birth", v)}
            onCityChange={(v) => handleLocationCity("birth", v)}
          />

          <p className="text-xs font-medium uppercase tracking-wider pt-2" style={{ color: theme.inkSubtle }}>Language Ability *</p>
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3 p-3 rounded-lg" style={{ background: theme.canvas, border: "1px solid " + theme.hairline }}>
              <FormField label="Language Name *" name="lang1Name" value={formData.lang1Name || ""} onChange={handleChange} error={errors.lang1Name} placeholder="e.g. English" />
              <div className="grid grid-cols-3 gap-2">
                <SelectField label="Speaking" name="lang1Speaking" value={formData.lang1Speaking || "moderate"} onChange={handleChange} options={[
                  { value: "high", label: "High" },
                  { value: "moderate", label: "Moderate" },
                  { value: "low", label: "Low" },
                ]} />
                <SelectField label="Reading" name="lang1Reading" value={formData.lang1Reading || "moderate"} onChange={handleChange} options={[
                  { value: "high", label: "High" },
                  { value: "moderate", label: "Moderate" },
                  { value: "low", label: "Low" },
                ]} />
                <SelectField label="Writing" name="lang1Writing" value={formData.lang1Writing || "moderate"} onChange={handleChange} options={[
                  { value: "high", label: "High" },
                  { value: "moderate", label: "Moderate" },
                  { value: "low", label: "Low" },
                ]} />
              </div>
            </div>
            {extraLanguages.map((lang, i) => (
              <div key={i} className="grid grid-cols-1 gap-3 p-3 rounded-lg relative" style={{ background: theme.canvas, border: "1px solid " + theme.hairline }}>
                <button type="button" onClick={() => removeLanguage(i)} className="absolute top-2 right-2 p-1 rounded hover:opacity-70" style={{ color: "#EF4444" }}><X size={14} /></button>
                <FormField label="Language Name" name={`langExtra_${i}_name`} value={lang.name} onChange={(e) => handleLangChange(i, "name", e.target.value)} placeholder="e.g. Hindi" />
                <div className="grid grid-cols-3 gap-2">
                  <SelectField label="Speaking" name={`langExtra_${i}_speaking`} value={lang.speaking} onChange={(e) => handleLangChange(i, "speaking", e.target.value)} options={[
                    { value: "high", label: "High" }, { value: "moderate", label: "Moderate" }, { value: "low", label: "Low" },
                  ]} />
                  <SelectField label="Reading" name={`langExtra_${i}_reading`} value={lang.reading} onChange={(e) => handleLangChange(i, "reading", e.target.value)} options={[
                    { value: "high", label: "High" }, { value: "moderate", label: "Moderate" }, { value: "low", label: "Low" },
                  ]} />
                  <SelectField label="Writing" name={`langExtra_${i}_writing`} value={lang.writing} onChange={(e) => handleLangChange(i, "writing", e.target.value)} options={[
                    { value: "high", label: "High" }, { value: "moderate", label: "Moderate" }, { value: "low", label: "Low" },
                  ]} />
                </div>
              </div>
            ))}
            <button type="button" onClick={addLanguage} className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-200 hover:opacity-70" style={{ color: theme.inkMuted, border: "1px dashed " + theme.hairline }}>
              <Plus size={14} /> Add Language
            </button>
          </div>

          <p className="text-xs font-medium uppercase tracking-wider pt-2" style={{ color: theme.inkSubtle }}>Attachments</p>
          <p className="text-xs" style={{ color: theme.inkMuted }}>To receive original invitation, attach to this application letter:</p>

          <div className="rounded-lg p-3" style={{ background: theme.canvas, border: "1px solid " + theme.hairline }}>
            <p className="text-xs font-medium mb-2">1. Scanned copy of passport (first page) *</p>
            {passportFile ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <Check size={14} style={{ color: "#16a34a" }} />
                  <span className="truncate max-w-[200px]">{passportFile.name}</span>
                </div>
                <button type="button" onClick={() => setPassportFile(null)} className="text-xs hover:underline" style={{ color: "#EF4444" }}>Remove</button>
              </div>
            ) : (
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-3 text-xs transition-all hover:opacity-70" style={{ border: "1px dashed " + theme.hairline }}>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f && f.size <= 10*1024*1024) setPassportFile(f); else if (f) alert("File too large. Max 10 MB."); }} />
                <Plus size={14} /> Choose passport copy
              </label>
            )}
          </div>

          <div className="rounded-lg p-3" style={{ background: theme.canvas, border: "1px solid " + theme.hairline }}>
            <p className="text-xs font-medium mb-2">2. Scanned copy of school certificate *</p>
            {certificateFile ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <Check size={14} style={{ color: "#16a34a" }} />
                  <span className="truncate max-w-[200px]">{certificateFile.name}</span>
                </div>
                <button type="button" onClick={() => setCertificateFile(null)} className="text-xs hover:underline" style={{ color: "#EF4444" }}>Remove</button>
              </div>
            ) : (
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-3 text-xs transition-all hover:opacity-70" style={{ border: "1px dashed " + theme.hairline }}>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f && f.size <= 10*1024*1024) setCertificateFile(f); else if (f) alert("File too large. Max 10 MB."); }} />
                <Plus size={14} /> Choose certificate
              </label>
            )}
          </div>

          <FormField label="Signature (Full Name) *" name="signature" value={formData.signature || ""} onChange={handleChange} error={errors.signature} placeholder="Type your full name as signature" />

          <button
            type="submit"
            disabled={submit.isPending || !isFormValid}
            className="inline-flex w-full items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold transition-all duration-200 disabled:opacity-60"
            style={{
              background: theme.ink,
              color: "#fff",
              borderRadius: theme.btnRadius,
            }}
          >
            {submit.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            {submit.isPending ? "Submitting..." : "Submit Application"}
          </button>
          <p className="text-xs text-center" style={{ color: theme.inkSubtle }}>
            By submitting, you agree to our terms and privacy policy.
          </p>
        </form>
      )}
    </div>
  );
}
