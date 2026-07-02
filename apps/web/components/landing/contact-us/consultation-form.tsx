"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { Country, State } from "country-state-city";
import { brand } from "@/lib/brand";
import { useCreateConsultation } from "@/domains/consultations";
import type { CreateConsultationPayload } from "@/domains/consultations/consultations.types";

/**
 * Self-contained consultation request form.
 * Manages its own form state, country/state dropdowns, validation, and submission.
 */
export function ConsultationForm({
  title,
  submitLabel,
}: {
  title?: string;
  submitLabel?: string;
}) {
  const createMutation = useCreateConsultation();
  const countries = Country.getAllCountries();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    neetScore: "",
    state: "",
    country: "",
    preferredUniversity: "",
    preferredIntake: "",
  });

  const [selectedCountryIso, setSelectedCountryIso] = useState("");
  const [selectedCountryPhoneCode, setSelectedCountryPhoneCode] = useState("");

  const states = selectedCountryIso
    ? State.getStatesOfCountry(selectedCountryIso)
    : [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const isoCode = e.target.value;
    const countryObj = countries.find((c) => c.isoCode === isoCode);

    setSelectedCountryIso(isoCode);
    setSelectedCountryPhoneCode(
      countryObj ? `+${countryObj.phonecode.replace("+", "")}` : ""
    );
    setForm((prev) => ({
      ...prev,
      country: countryObj ? countryObj.name : "",
      state: "",
    }));
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, state: e.target.value }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (selectedCountryIso) {
      value = value.slice(0, 10);
    }
    setForm((prev) => ({ ...prev, phone: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Please enter your Full Name");
      return;
    }
    if (!form.email.trim()) {
      toast.error("Please enter your Email Id");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      toast.error("Please enter a valid Email Id");
      return;
    }
    if (!form.phone.trim()) {
      toast.error("Please enter your Mobile No.");
      return;
    }
    if (selectedCountryIso && form.phone.trim().length !== 10) {
      toast.error("Please enter a valid 10-digit Mobile No.");
      return;
    }

    const fullPhone = selectedCountryPhoneCode
      ? `${selectedCountryPhoneCode} ${form.phone.trim()}`
      : form.phone.trim();

    let neetScore: number | undefined;
    if (form.neetScore.trim()) {
      const scoreNum = parseInt(form.neetScore.trim(), 10);
      if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 720) {
        toast.error("Please enter a valid NEET Score (0 to 720)");
        return;
      }
      neetScore = scoreNum;
    }

    const payload: CreateConsultationPayload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: fullPhone,
      state: form.state.trim() || undefined,
      country: form.country.trim() || undefined,
      neetScore,
      preferredUniversity: form.preferredUniversity.trim() || undefined,
      preferredIntake: form.preferredIntake.trim() || undefined,
    };

    try {
      await createMutation.mutateAsync(payload);
      toast.success(
        "Consultation Request submitted successfully! Our advisor will contact you soon."
      );
      setForm({
        name: "",
        email: "",
        phone: "",
        neetScore: "",
        state: "",
        country: "",
        preferredUniversity: "",
        preferredIntake: "",
      });
      setSelectedCountryIso("");
      setSelectedCountryPhoneCode("");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to submit request. Please try again."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Full Name & Email Id */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label
            htmlFor="name"
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: brand.inkMuted }}
          >
            Your Name / Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="e.g., Tushar Sharma"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#3730A3] focus:border-[#3730A3] text-sm"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: brand.inkMuted }}
          >
            Email Id <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="e.g., tushar@example.com"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#3730A3] focus:border-[#3730A3] text-sm"
            required
          />
        </div>
      </div>

      {/* Country & State Select Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label
            htmlFor="country"
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: brand.inkMuted }}
          >
            Country <span className="text-red-500">*</span>
          </label>
          <select
            id="country"
            name="country"
            value={selectedCountryIso}
            onChange={handleCountryChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#3730A3] focus:border-[#3730A3] text-sm bg-white"
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
            htmlFor="state"
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: brand.inkMuted }}
          >
            State
          </label>
          <select
            id="state"
            name="state"
            value={form.state}
            onChange={handleStateChange}
            disabled={!selectedCountryIso}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#3730A3] focus:border-[#3730A3] text-sm bg-white disabled:opacity-60"
          >
            <option value="">Select State</option>
            {states.map((s) => (
              <option key={s.isoCode} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile No & NEET Score */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label
            htmlFor="phone"
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: brand.inkMuted }}
          >
            Mobile No. <span className="text-red-500">*</span>
          </label>
          <div className="relative flex rounded-lg border border-gray-300 overflow-hidden focus-within:ring-1 focus-within:ring-[#3730A3] focus-within:border-[#3730A3]">
            {selectedCountryPhoneCode && (
              <span className="bg-gray-50 border-r border-gray-300 px-3 py-2 text-sm font-semibold text-[#1A153A] flex items-center select-none shrink-0">
                {selectedCountryPhoneCode}
              </span>
            )}
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder={
                selectedCountryPhoneCode
                  ? "10-digit number"
                  : "e.g., 9876543210"
              }
              value={form.phone}
              onChange={handlePhoneChange}
              className="w-full px-4 py-2.5 text-sm outline-none border-none bg-white"
              maxLength={selectedCountryIso ? 10 : undefined}
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="neetScore"
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: brand.inkMuted }}
          >
            NEET Score{" "}
            <span className="text-xs lowercase text-[#999]">(0-720)</span>
          </label>
          <input
            id="neetScore"
            name="neetScore"
            type="number"
            placeholder="Enter Your Score"
            value={form.neetScore}
            onChange={handleChange}
            min="0"
            max="720"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#3730A3] focus:border-[#3730A3] text-sm"
          />
        </div>
      </div>

      {/* Preferred University & Intake */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label
            htmlFor="preferredUniversity"
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: brand.inkMuted }}
          >
            Preferred University
          </label>
          <select
            id="preferredUniversity"
            name="preferredUniversity"
            value={form.preferredUniversity}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#3730A3] focus:border-[#3730A3] text-sm bg-white"
          >
            <option value="">Select University</option>
            <option value="Jalal-Abad State University">Jalal-Abad State Univ</option>
            <option value="Bishkek International Medical Institute">Bishkek Int. Medical Institute</option>
            <option value="Jalalabad International University">Jalalabad International Univ</option>
            <option value="Osh State University">Osh State Univ</option>
            <option value="Andijan State Medical Institute">Andijan State Medical Institute</option>
            <option value="North Kazakhstan State Medical University">North Kazakhstan State Medical Univ</option>
            <option value="Sevastopol State University">Sevastopol State Univ</option>
            <option value="Kemerovo State University">Kemerovo State Univ</option>
            <option value="Maykop State Medical Institute">Maykop State Medical Institute</option>
            <option value="Kirov State Medical University">Kirov State Medical Univ</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="preferredIntake"
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: brand.inkMuted }}
          >
            Preferred Intake
          </label>
          <select
            id="preferredIntake"
            name="preferredIntake"
            value={form.preferredIntake}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#3730A3] focus:border-[#3730A3] text-sm bg-white"
          >
            <option value="">Select Intake</option>
            <option value="Summer">Summer Intake (May/Jun)</option>
            <option value="Winter">Winter Intake (Sep/Oct)</option>
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={
            !form.name.trim() ||
            !form.email.trim() ||
            !form.phone.trim() ||
            !form.country.trim() ||
            !form.state.trim() ||
            !form.neetScore.trim() ||
            createMutation.isPending
          }
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          style={{ background: brand.ink }}
        >
          {createMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Submit Request
            </>
          )}
        </button>
      </div>
    </form>
  );
}
