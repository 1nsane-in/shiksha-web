"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Building2,
  Globe,
  MapPin,
  GraduationCap,
  BookOpen,
  Phone,
  Mail,
} from "lucide-react";
import { Country, State } from "country-state-city";
import { brand } from "@/lib/brand";
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
  const [selectedCountryPhoneCode, setSelectedCountryPhoneCode] = useState("+91");

  const uniStates = selectedUniCountryIso
    ? State.getStatesOfCountry(selectedUniCountryIso)
    : [];

  const handleUniSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uniForm.universityName.trim()) {
      toast.error("Please enter the University Name");
      return;
    }
    if (!uniForm.country.trim()) {
      toast.error("Please select the Country");
      return;
    }
    if (!uniForm.type) {
      toast.error("Please select the University Type");
      return;
    }
    if (uniForm.programs.length === 0) {
      toast.error("Please select at least one Program");
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
        "University request submitted! Our team will review and add it within 24-48 hours."
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
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to submit request. Please try again."
      );
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

  return (
    <form onSubmit={handleUniSubmit} className="space-y-5">
      {/* University Name & Website */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: brand.inkMuted }}
          >
            <Building2 className="h-3 w-3 inline mr-1" />
            University Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g., Jalalabad International University"
            value={uniForm.universityName}
            onChange={(e) =>
              setUniForm({ ...uniForm, universityName: e.target.value })
            }
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold text-sm"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: brand.inkMuted }}
          >
            <Globe className="h-3 w-3 inline mr-1" />
            Website URL
          </label>
          <input
            type="url"
            placeholder="https://university.edu"
            value={uniForm.website}
            onChange={(e) =>
              setUniForm({ ...uniForm, website: e.target.value })
            }
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold text-sm"
          />
        </div>
      </div>

      {/* Country & State */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: brand.inkMuted }}
          >
            <MapPin className="h-3 w-3 inline mr-1" />
            Country <span className="text-red-500">*</span>
          </label>
          <select
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
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold text-sm bg-white"
            required
          >
            <option value="">Select Country</option>
            {countries.map((c) => (
              <option key={c.isoCode} value={c.isoCode}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: brand.inkMuted }}
          >
            State / Province
          </label>
          <select
            value={uniForm.state}
            onChange={(e) => setUniForm({ ...uniForm, state: e.target.value })}
            disabled={!selectedUniCountryIso}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold text-sm bg-white disabled:opacity-60"
          >
            <option value="">Select State</option>
            {uniStates.map((s) => (
              <option key={s.isoCode} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Type & Programs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: brand.inkMuted }}
          >
            <GraduationCap className="h-3 w-3 inline mr-1" />
            University Type <span className="text-red-500">*</span>
          </label>
          <select
            value={uniForm.type}
            onChange={(e) => setUniForm({ ...uniForm, type: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold text-sm bg-white"
            required
          >
            <option value="">Select Type</option>
            <option value="GOVERNMENT">Government</option>
            <option value="PRIVATE">Private</option>
            <option value="SEMI_PRIVATE">Semi-Private</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: brand.inkMuted }}
          >
            <BookOpen className="h-3 w-3 inline mr-1" />
            Programs Offered <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {PROGRAM_OPTIONS.map((program) => (
              <button
                key={program}
                type="button"
                onClick={() => toggleProgram(program)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border ${
                  uniForm.programs.includes(program)
                    ? "bg-gold text-white border-gold"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gold"
                }`}
              >
                {program}
              </button>
            ))}
          </div>
          {uniForm.programs.includes("Other") && (
            <input
              type="text"
              placeholder="Specify other programs (e.g., Physiotherapy, Dentistry...)"
              value={uniForm.otherPrograms || ""}
              onChange={(e) =>
                setUniForm({ ...uniForm, otherPrograms: e.target.value })
              }
              className="w-full mt-2 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold text-sm"
            />
          )}
        </div>
      </div>

      {/* Contact Info — Your Contact Details */}
      <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
          <Phone className="h-3 w-3" />
          Your Contact Details (for inquiry)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: brand.inkMuted }}
            >
              <Mail className="h-3 w-3 inline mr-1" />
              Your Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="your.email@example.com"
              value={uniForm.contactEmail}
              onChange={(e) =>
                setUniForm({ ...uniForm, contactEmail: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold text-sm"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: brand.inkMuted }}
            >
              <Phone className="h-3 w-3 inline mr-1" />
              Your Phone <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <select
                value={selectedCountryPhoneCode}
                onChange={(e) => setSelectedCountryPhoneCode(e.target.value)}
                className="w-16 px-1 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold text-sm bg-white shrink-0 text-center"
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
                type="tel"
                placeholder="Mobile number"
                value={uniForm.contactPhone}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  value = value.slice(0, 10);
                  setUniForm({ ...uniForm, contactPhone: value });
                }}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold text-sm"
                maxLength={10}
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="space-y-1.5">
        <label
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: brand.inkMuted }}
        >
          Additional Information
        </label>
        <textarea
          placeholder="Any other details about the university (e.g., NMC approval status, year established, tuition fees...)"
          value={uniForm.additionalInfo}
          onChange={(e) =>
            setUniForm({ ...uniForm, additionalInfo: e.target.value })
          }
          rows={3}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold text-sm resize-none"
        />
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={createUniRequestMutation.isPending}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-gold hover:bg-gold-dark"
        >
          {createUniRequestMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Building2 className="h-4 w-4" />
              Submit University Request
            </>
          )}
        </button>
      </div>
    </form>
  );
}
