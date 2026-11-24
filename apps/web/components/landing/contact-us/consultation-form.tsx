"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { Country, State } from "country-state-city";
import { useCreateConsultation } from "@/domains/consultations";
import type { CreateConsultationPayload } from "@/domains/consultations/consultations.types";

const fieldClass =
  "w-full rounded-lg border border-hairline bg-white px-4 py-3 text-sm text-brand-ink placeholder:text-brand-ink-muted focus:border-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-ink/15 disabled:bg-ice-grey disabled:text-brand-ink-muted";

const labelClass = "text-xs font-medium text-brand-ink";

/**
 * Self-contained consultation request form.
 * Manages its own form state, country/state dropdowns, validation, and submission.
 */
export function ConsultationForm() {
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
      toast.error("Enter your name");
      return;
    }
    if (!form.email.trim()) {
      toast.error("Enter your email");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      toast.error("Enter a valid email");
      return;
    }
    if (!form.phone.trim()) {
      toast.error("Enter your mobile number");
      return;
    }
    if (selectedCountryIso && form.phone.trim().length !== 10) {
      toast.error("Enter a 10-digit mobile number");
      return;
    }

    const fullPhone = selectedCountryPhoneCode
      ? `${selectedCountryPhoneCode} ${form.phone.trim()}`
      : form.phone.trim();

    let neetScore: number | undefined;
    if (form.neetScore.trim()) {
      const scoreNum = parseInt(form.neetScore.trim(), 10);
      if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 720) {
        toast.error("Enter a NEET score from 0 to 720");
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
        "Consultation request submitted. Our advisor will contact you soon."
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
    } catch (err: unknown) {
      const message = (
        err as { response?: { data?: { message?: string } } }
      )?.response?.data?.message;
      toast.error(message || "Could not submit your request. Try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className={labelClass}>
            Your name <span className="text-red-600">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="As on your passport"
            value={form.name}
            onChange={handleChange}
            className={fieldClass}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className={labelClass}>
            Email <span className="text-red-600">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            className={fieldClass}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="country" className={labelClass}>
            Country <span className="text-red-600">*</span>
          </label>
          <select
            id="country"
            name="country"
            value={selectedCountryIso}
            onChange={handleCountryChange}
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
          <label htmlFor="state" className={labelClass}>
            State
          </label>
          <select
            id="state"
            name="state"
            value={form.state}
            onChange={handleStateChange}
            disabled={!selectedCountryIso}
            className={fieldClass}
          >
            <option value="">Select state</option>
            {states.map((s) => (
              <option key={s.isoCode} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="phone" className={labelClass}>
            Mobile number <span className="text-red-600">*</span>
          </label>
          <div className="flex overflow-hidden rounded-lg border border-hairline bg-white focus-within:border-brand-ink focus-within:ring-2 focus-within:ring-brand-ink/15">
            {selectedCountryPhoneCode && (
              <span className="flex shrink-0 select-none items-center border-r border-hairline bg-ice-grey px-3 text-sm font-medium text-brand-ink">
                {selectedCountryPhoneCode}
              </span>
            )}
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder={
                selectedCountryPhoneCode ? "10-digit number" : "Mobile number"
              }
              value={form.phone}
              onChange={handlePhoneChange}
              className="min-w-0 flex-1 bg-white px-4 py-3 text-sm text-brand-ink placeholder:text-brand-ink-muted focus:outline-none"
              maxLength={selectedCountryIso ? 10 : undefined}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="neetScore" className={labelClass}>
            NEET score <span className="text-brand-ink-muted">(0-720)</span>
          </label>
          <input
            id="neetScore"
            name="neetScore"
            type="number"
            inputMode="numeric"
            placeholder="Enter score"
            value={form.neetScore}
            onChange={handleChange}
            min="0"
            max="720"
            className={fieldClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="preferredUniversity" className={labelClass}>
            Preferred university
          </label>
          <select
            id="preferredUniversity"
            name="preferredUniversity"
            value={form.preferredUniversity}
            onChange={handleChange}
            className={fieldClass}
          >
            <option value="">Select university</option>
            <option value="Jalal-Abad State University">
              Jalal-Abad State University
            </option>
            <option value="Bishkek International Medical Institute">
              Bishkek International Medical Institute
            </option>
            <option value="Jalalabad International University">
              Jalalabad International University
            </option>
            <option value="Osh State University">Osh State University</option>
            <option value="Andijan State Medical Institute">
              Andijan State Medical Institute
            </option>
            <option value="North Kazakhstan State Medical University">
              North Kazakhstan State Medical University
            </option>
            <option value="Sevastopol State University">
              Sevastopol State University
            </option>
            <option value="Kemerovo State University">
              Kemerovo State University
            </option>
            <option value="Maykop State Medical Institute">
              Maykop State Medical Institute
            </option>
            <option value="Kirov State Medical University">
              Kirov State Medical University
            </option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="preferredIntake" className={labelClass}>
            Preferred intake
          </label>
          <select
            id="preferredIntake"
            name="preferredIntake"
            value={form.preferredIntake}
            onChange={handleChange}
            className={fieldClass}
          >
            <option value="">Select intake</option>
            <option value="Summer">Summer intake (May/Jun)</option>
            <option value="Winter">Winter intake (Sep/Oct)</option>
          </select>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={
            !form.name.trim() ||
            !form.email.trim() ||
            !form.phone.trim() ||
            !form.country.trim() ||
            createMutation.isPending
          }
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-gold px-6 py-3 text-sm font-medium text-brand-ink transition-colors hover:bg-gold-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-ink/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {createMutation.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="size-4" strokeWidth={1.5} />
              Submit request
            </>
          )}
        </button>
      </div>
    </form>
  );
}
