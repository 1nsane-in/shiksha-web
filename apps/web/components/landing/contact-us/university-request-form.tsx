"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Loader2, Building2 } from "lucide-react";
import { Country, State } from "country-state-city";
import { useCreateUniversityRequest } from "@/domains/university-requests";

type UniFormState = {
  universityName: string;
  country: string;
  state: string;
  website: string;
  type: string;
  programs: string[];
  otherPrograms: string;
  contactEmail: string;
  contactPhone: string;
  additionalInfo: string;
};

const PROGRAM_OPTIONS = ["MBBS", "BDS", "Nursing", "Pharmacy", "Other"];

const fieldClass =
  "w-full rounded-lg border border-hairline bg-white px-4 py-3 text-sm text-brand-ink placeholder:text-brand-ink-muted focus:border-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-ink/15 disabled:bg-ice-grey disabled:text-brand-ink-muted";

const labelClass = "text-xs font-medium text-brand-ink";

/**
 * Self-contained form for requesting a new university to be added.
 * Manages its own state, country/state dropdowns, program selection, validation, and submission.
 */
export function UniversityRequestForm() {
  const createUniRequestMutation = useCreateUniversityRequest();
  const countries = Country.getAllCountries();

  const [uniForm, setUniForm] = useState<UniFormState>({
    universityName: "",
    country: "",
    state: "",
    website: "",
    type: "",
    programs: [],
    otherPrograms: "",
    contactEmail: "",
    contactPhone: "",
    additionalInfo: "",
  });

  const [selectedUniCountryIso, setSelectedUniCountryIso] = useState("");
  const [selectedCountryPhoneCode, setSelectedCountryPhoneCode] =
    useState("+91");

  const uniStates = selectedUniCountryIso
    ? State.getStatesOfCountry(selectedUniCountryIso)
    : [];

  const handleUniSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uniForm.universityName.trim()) {
      toast.error("Enter the university name");
      return;
    }
    if (!uniForm.country.trim()) {
      toast.error("Select the country");
      return;
    }
    if (!uniForm.type) {
      toast.error("Select the university type");
      return;
    }
    if (uniForm.programs.length === 0) {
      toast.error("Select at least one program");
      return;
    }

    const payload = {
      universityName: uniForm.universityName.trim(),
      country: uniForm.country,
      state: uniForm.state || undefined,
      website: uniForm.website.trim() || undefined,
      type: uniForm.type,
      programs: uniForm.programs,
      otherPrograms: uniForm.otherPrograms.trim() || undefined,
      contactEmail: uniForm.contactEmail.trim(),
      contactPhone: `${selectedCountryPhoneCode || "+91"} ${uniForm.contactPhone.trim()}`,
      additionalInfo: uniForm.additionalInfo.trim() || undefined,
    };

    try {
      await createUniRequestMutation.mutateAsync(payload);
      toast.success(
        "University request submitted. Our team will review it within 24-48 hours."
      );
      setUniForm({
        universityName: "",
        country: "",
        state: "",
        website: "",
        type: "",
        programs: [],
        otherPrograms: "",
        contactEmail: "",
        contactPhone: "",
        additionalInfo: "",
      });
      setSelectedUniCountryIso("");
      setSelectedCountryPhoneCode("+91");
    } catch (err: unknown) {
      const message = (
        err as { response?: { data?: { message?: string } } }
      )?.response?.data?.message;
      toast.error(message || "Could not submit the request. Try again.");
    }
  };

  const toggleProgram = (program: string) => {
    setUniForm((prev) => {
      const programs = prev.programs.includes(program)
        ? prev.programs.filter((p) => p !== program)
        : [...prev.programs, program];
      return { ...prev, programs };
    });
  };

  const isFormIncomplete =
    !uniForm.universityName.trim() ||
    !uniForm.country.trim() ||
    !uniForm.type ||
    uniForm.programs.length === 0 ||
    !uniForm.contactEmail.trim() ||
    !uniForm.contactPhone.trim();

  return (
    <form onSubmit={handleUniSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="request-university-name" className={labelClass}>
            University name <span className="text-red-600">*</span>
          </label>
          <input
            id="request-university-name"
            type="text"
            placeholder="Enter university name"
            value={uniForm.universityName}
            onChange={(e) =>
              setUniForm({ ...uniForm, universityName: e.target.value })
            }
            className={fieldClass}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="request-university-website" className={labelClass}>
            Website
          </label>
          <input
            id="request-university-website"
            type="url"
            placeholder="https://university.edu"
            value={uniForm.website}
            onChange={(e) =>
              setUniForm({ ...uniForm, website: e.target.value })
            }
            className={fieldClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="request-university-country" className={labelClass}>
            Country <span className="text-red-600">*</span>
          </label>
          <select
            id="request-university-country"
            value={selectedUniCountryIso}
            onChange={(e) => {
              const isoCode = e.target.value;
              const countryObj = countries.find((c) => c.isoCode === isoCode);
              setSelectedUniCountryIso(isoCode);
              setUniForm({
                ...uniForm,
                country: countryObj?.name || "",
                state: "",
              });
            }}
            className={fieldClass}
            required
          >
            <option value="">Select country</option>
            {countries.map((c) => (
              <option key={c.isoCode} value={c.isoCode}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="request-university-state" className={labelClass}>
            State or province
          </label>
          <select
            id="request-university-state"
            value={uniForm.state}
            onChange={(e) => setUniForm({ ...uniForm, state: e.target.value })}
            disabled={!selectedUniCountryIso}
            className={fieldClass}
          >
            <option value="">Select state</option>
            {uniStates.map((s) => (
              <option key={s.isoCode} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="request-university-type" className={labelClass}>
            University type <span className="text-red-600">*</span>
          </label>
          <select
            id="request-university-type"
            value={uniForm.type}
            onChange={(e) => setUniForm({ ...uniForm, type: e.target.value })}
            className={fieldClass}
            required
          >
            <option value="">Select type</option>
            <option value="GOVERNMENT">Government</option>
            <option value="PRIVATE">Private</option>
            <option value="SEMI_PRIVATE">Semi-private</option>
          </select>
        </div>

        <div className="space-y-2">
          <p id="request-programs-label" className={labelClass}>
            Programs offered <span className="text-red-600">*</span>
          </p>
          <div
            role="group"
            aria-labelledby="request-programs-label"
            className="flex flex-wrap gap-2"
          >
            {PROGRAM_OPTIONS.map((program) => {
              const isSelected = uniForm.programs.includes(program);
              return (
                <button
                  key={program}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => toggleProgram(program)}
                  className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-ink/30 ${
                    isSelected
                      ? "border-brand-ink bg-brand-ink text-white"
                      : "border-hairline bg-white text-brand-ink-muted hover:border-brand-ink/30 hover:text-brand-ink"
                  }`}
                >
                  {program}
                </button>
              );
            })}
          </div>
          {uniForm.programs.includes("Other") && (
            <input
              type="text"
              aria-label="Other programs"
              placeholder="Physiotherapy, Dentistry"
              value={uniForm.otherPrograms || ""}
              onChange={(e) =>
                setUniForm({ ...uniForm, otherPrograms: e.target.value })
              }
              className={`${fieldClass} mt-2`}
            />
          )}
        </div>
      </div>

      <div className="rounded-xl border border-brand-hairline bg-ice-grey p-5">
        <h4 className="text-sm font-medium text-brand-ink">
          Your contact details
        </h4>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="request-contact-email" className={labelClass}>
              Email <span className="text-red-600">*</span>
            </label>
            <input
              id="request-contact-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={uniForm.contactEmail}
              onChange={(e) =>
                setUniForm({ ...uniForm, contactEmail: e.target.value })
              }
              className={fieldClass}
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="request-contact-phone"
              className={labelClass}
            >
              Phone <span className="text-red-600">*</span>
            </label>
            <div className="flex gap-2">
              <select
                aria-label="Country code"
                value={selectedCountryPhoneCode}
                onChange={(e) => setSelectedCountryPhoneCode(e.target.value)}
                className={`${fieldClass} shrink-0 px-2 text-center`}
                style={{ width: "6rem" }}
              >
                {countries.map((c) => (
                  <option
                    key={c.isoCode}
                    value={`+${c.phonecode.replace("+", "")}`}
                  >
                    +{c.phonecode.replace("+", "")}
                  </option>
                ))}
              </select>
              <input
                id="request-contact-phone"
                type="tel"
                autoComplete="tel"
                placeholder="Mobile number"
                value={uniForm.contactPhone}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  value = value.slice(0, 10);
                  setUniForm({ ...uniForm, contactPhone: value });
                }}
                className={`${fieldClass} min-w-0 flex-1`}
                maxLength={10}
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="request-additional-info" className={labelClass}>
          Additional information
        </label>
        <textarea
          id="request-additional-info"
          placeholder="NMC approval, year established, tuition fees"
          value={uniForm.additionalInfo}
          onChange={(e) =>
            setUniForm({ ...uniForm, additionalInfo: e.target.value })
          }
          rows={3}
          className={`${fieldClass} resize-none`}
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isFormIncomplete || createUniRequestMutation.isPending}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-gold px-6 py-3 text-sm font-medium text-brand-ink transition-colors hover:bg-gold-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-ink/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {createUniRequestMutation.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Building2 className="size-4" strokeWidth={1.5} />
              Submit university request
            </>
          )}
        </button>
      </div>
    </form>
  );
}
