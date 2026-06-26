"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

import { useCreateConsultation } from "@/domains/consultations";
import { useCreateUniversityRequest } from "@/domains/university-requests";
import { toast } from "sonner";
import { Phone, Mail, MapPin, Clock, Send, ShieldCheck, Loader2, Building2, Globe, BookOpen, GraduationCap } from "lucide-react";
import { Country, State } from "country-state-city";

import { brand as theme } from "@/lib/brand";

// Loading fallback for Suspense — layout provides Header/Footer/wrapper
function ContactPageLoading() {
  return (
    <div className="flex items-center justify-center py-32">
      <div className="text-center">
        <div className="inline-block size-8 animate-spin rounded-full border-4 border-solid border-gold border-r-transparent" />
        <p className="text-sm text-gray-500 mt-4">Loading...</p>
      </div>
    </div>
  );
}

// Main page component wrapped in Suspense
export default function ContactUsPageWrapper() {
  return (
    <Suspense fallback={<ContactPageLoading />}>
      <ContactUsPage />
    </Suspense>
  );
}

function ContactUsPage() {
  const searchParams = useSearchParams();
  const createMutation = useCreateConsultation();
  const createUniRequestMutation = useCreateUniversityRequest();
  const [activeTab, setActiveTab] = useState<"consultation" | "university">("consultation");
  
  // Set active tab based on query param
  useEffect(() => {
    const subject = searchParams.get("subject");
    if (subject === "university-request") {
      setActiveTab("university");
    }
  }, [searchParams]);
  
  // Consultation form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    neetScore: "",
    state: "",
    country: "",
  });
  
  // University request form state
  const [uniForm, setUniForm] = useState({
    universityName: "",
    country: "",
    state: "",
    website: "",
    type: "",
    programs: [] as string[],
    otherPrograms: "",
    contactEmail: "",
    contactPhone: "",
    additionalInfo: "",
  });
  
  const [selectedUniCountryIso, setSelectedUniCountryIso] = useState("");

  const [selectedCountryIso, setSelectedCountryIso] = useState("");
  const [selectedCountryPhoneCode, setSelectedCountryPhoneCode] = useState("");

  const countries = Country.getAllCountries();
  const states = selectedCountryIso ? State.getStatesOfCountry(selectedCountryIso) : [];
  const uniStates = selectedUniCountryIso ? State.getStatesOfCountry(selectedUniCountryIso) : [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const isoCode = e.target.value;
    const countryObj = countries.find((c) => c.isoCode === isoCode);
    
    setSelectedCountryIso(isoCode);
    setSelectedCountryPhoneCode(countryObj ? `+${countryObj.phonecode.replace("+", "")}` : "");
    setForm((prev) => ({
      ...prev,
      country: countryObj ? countryObj.name : "",
      state: "", // reset state when country changes
    }));
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, state: e.target.value }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // strip non-digits
    if (selectedCountryIso) {
      value = value.slice(0, 10); // limit to 10 digits
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

    const payload: any = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: fullPhone,
      state: form.state.trim() || undefined,
      country: form.country.trim() || undefined,
    };

    if (form.neetScore.trim()) {
      const scoreNum = parseInt(form.neetScore.trim(), 10);
      if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 720) {
        toast.error("Please enter a valid NEET Score (0 to 720)");
        return;
      }
      payload.neetScore = scoreNum;
    }

    try {
      await createMutation.mutateAsync(payload);
      toast.success("Consultation Request submitted successfully! Our advisor will contact you soon.");
      setForm({
        name: "",
        email: "",
        phone: "",
        neetScore: "",
        state: "",
        country: "",
      });
      setSelectedCountryIso("");
      setSelectedCountryPhoneCode("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to submit request. Please try again.");
    }
  };

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
      toast.success("University request submitted! Our team will review and add it within 24-48 hours.");
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
      setSelectedCountryPhoneCode("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to submit request. Please try again.");
    }
  };

  return (
    <>
      {/* Banner Section */}
        <section className="relative py-16 overflow-hidden bg-[#1A153A]">
          <div className="pointer-events-none absolute inset-0 opacity-15">
            <Image
              alt="Medical counseling consultation"
              src="https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&w=1920&q=80"
              fill
              className="object-cover select-none"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-[#1A153A]/95" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <p
              className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em]"
              style={{ background: theme.goldLight, color: theme.gold }}
            >
              <span className="size-1.5 rounded-full" style={{ background: theme.gold }} />
              Admissions open 2026-27
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">
              Get Free <span style={{ color: theme.gold }}>Admission Consultation</span>
            </h1>
            <p className="max-w-2xl mx-auto text-base text-gray-300 leading-relaxed">
              Have questions about medical studies abroad? Submit your score and eligibility details below 
              to receive personalized matching with top international medical universities.
            </p>
          </div>
        </section>

        {/* Form and Info Section */}
        <section className="py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            
            {/* Left: Contact Info (2/5 size) */}
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight" style={{ color: theme.ink }}>
                  Contact Information
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: theme.inkMuted }}>
                  Connect with our overseas medical consultants directly. We offer support with university shortlisting, 
                  MCI/NMC screening exam assistance, documentation, and student visa support.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4">
                <div className="flex gap-4 p-4 rounded-xl border bg-white" style={{ borderColor: theme.hairline }}>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ background: theme.goldLight, color: theme.gold }}>
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold" style={{ color: theme.ink }}>Mobile Number</h4>
                    <p className="text-sm font-mono mt-1" style={{ color: theme.inkMuted }}>+7 918 482-65-01</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-xl border bg-white" style={{ borderColor: theme.hairline }}>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ background: theme.goldLight, color: theme.gold }}>
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold" style={{ color: theme.ink }}>Email Address</h4>
                    <p className="text-sm mt-1" style={{ color: theme.inkMuted }}>siksha.sabkaadhikaar@gmail.com</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-xl border bg-white" style={{ borderColor: theme.hairline }}>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ background: theme.goldLight, color: theme.gold }}>
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold" style={{ color: theme.ink }}>Corporate Office</h4>
                    <p className="text-sm mt-1 leading-relaxed" style={{ color: theme.inkMuted }}>
                      WCIEC Corporate Towers, Suite 504, Sector 62, Noida, NCR, India
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-xl border bg-white" style={{ borderColor: theme.hairline }}>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ background: theme.goldLight, color: theme.gold }}>
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold" style={{ color: theme.ink }}>Consultation Hours</h4>
                    <p className="text-sm mt-1" style={{ color: theme.inkMuted }}>Monday – Saturday: 9:00 AM – 6:30 PM</p>
                    <p className="text-xs mt-0.5" style={{ color: theme.gold }}>Online requests open 24/7</p>
                  </div>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="p-4 rounded-xl flex items-center gap-3 bg-[#EEF2FF] border border-[#E0E7FF]">
                <ShieldCheck className="h-6 w-6 text-indigo-600 shrink-0" />
                <p className="text-xs text-indigo-950 font-medium leading-relaxed">
                  Your details are encrypted and securely shared only with authorized counselors. We respect student privacy.
                </p>
              </div>
            </div>

            {/* Right: Forms (3/5 size) */}
            <div className="lg:col-span-3">
              {/* Tab Switcher */}
              <div className="bg-white rounded-2xl border p-6 sm:p-8 shadow-sm" style={{ borderColor: theme.hairline }}>
                <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setActiveTab("consultation")}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      activeTab === "consultation"
                        ? "bg-white text-[#1A153A] shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Phone className="h-4 w-4" />
                      Free Consultation
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("university")}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      activeTab === "university"
                        ? "bg-white text-[#1A153A] shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Request University
                    </span>
                  </button>
                </div>

                {activeTab === "consultation" ? (
                  <>
                    <div className="mb-6">
                      <h3 className="text-xl font-bold tracking-tight" style={{ color: theme.ink }}>
                        Free Guidance Request Form
                      </h3>
                      <p className="text-xs mt-1" style={{ color: theme.inkMuted }}>
                        All fields are securely verified. Ensure correct mobile number for OTP/Call.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Full Name & Email Id */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.inkMuted }}>
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
                      <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.inkMuted }}>
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
                      <label htmlFor="country" className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.inkMuted }}>
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
                      <label htmlFor="state" className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.inkMuted }}>
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
                      <label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.inkMuted }}>
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
                          placeholder={selectedCountryPhoneCode ? "10-digit number" : "e.g., 9876543210"}
                          value={form.phone}
                          onChange={handlePhoneChange}
                          className="w-full px-4 py-2.5 text-sm outline-none border-none bg-white"
                          maxLength={selectedCountryIso ? 10 : undefined}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="neetScore" className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.inkMuted }}>
                        NEET Score <span className="text-xs lowercase text-[#999]">(0-720)</span>
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

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.country.trim() || !form.state.trim() || !form.neetScore.trim() || createMutation.isPending}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      style={{ background: theme.ink }}
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
                  </>
                ) : (
                  <>
                    <div className="mb-6">
                      <h3 className="text-xl font-bold tracking-tight" style={{ color: theme.ink }}>
                        Request to Add University
                      </h3>
                      <p className="text-xs mt-1" style={{ color: theme.inkMuted }}>
                        Can&apos;t find your desired university? Submit details and we&apos;ll add it within 24-48 hours.
                      </p>
                    </div>

                    <form onSubmit={handleUniSubmit} className="space-y-5">
                      {/* University Name & Website */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.inkMuted }}>
                            <Building2 className="h-3 w-3 inline mr-1" />
                            University Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g., Jalalabad International University"
                            value={uniForm.universityName}
                            onChange={(e) => setUniForm({ ...uniForm, universityName: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold text-sm"
                            required
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.inkMuted }}>
                            <Globe className="h-3 w-3 inline mr-1" />
                            Website URL
                          </label>
                          <input
                            type="url"
                            placeholder="https://university.edu"
                            value={uniForm.website}
                            onChange={(e) => setUniForm({ ...uniForm, website: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold text-sm"
                          />
                        </div>
                      </div>

                      {/* Country & State */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.inkMuted }}>
                            <MapPin className="h-3 w-3 inline mr-1" />
                            Country <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={selectedUniCountryIso}
                            onChange={(e) => {
                              const isoCode = e.target.value;
                              const countryObj = countries.find((c) => c.isoCode === isoCode);
                              setSelectedUniCountryIso(isoCode);
                              setUniForm({ ...uniForm, country: countryObj?.name || "", state: "" });
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
                          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.inkMuted }}>
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
                          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.inkMuted }}>
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
                          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.inkMuted }}>
                            <BookOpen className="h-3 w-3 inline mr-1" />
                            Programs Offered <span className="text-red-500">*</span>
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {["MBBS", "BDS", "Nursing", "Pharmacy", "Other"].map((program) => (
                              <button
                                key={program}
                                type="button"
                                onClick={() => {
                                  const newPrograms = uniForm.programs.includes(program)
                                    ? uniForm.programs.filter((p) => p !== program)
                                    : [...uniForm.programs, program];
                                  setUniForm({ ...uniForm, programs: newPrograms });
                                }}
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
                              onChange={(e) => setUniForm({ ...uniForm, otherPrograms: e.target.value })}
                              className="w-full mt-2 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold text-sm"
                            />
                          )}
                        </div>
                      </div>

                      {/* Contact Info - Your Contact Details */}
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          Your Contact Details (for inquiry)
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.inkMuted }}>
                              <Mail className="h-3 w-3 inline mr-1" />
                              Your Email <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="email"
                              placeholder="your.email@example.com"
                              value={uniForm.contactEmail}
                              onChange={(e) => setUniForm({ ...uniForm, contactEmail: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold text-sm"
                              required
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.inkMuted }}>
                              <Phone className="h-3 w-3 inline mr-1" />
                              Your Phone <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-2">
                              <select
                                value={selectedCountryPhoneCode || "+91"}
                                onChange={(e) => setSelectedCountryPhoneCode(e.target.value)}
                                className="w-16 px-1 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold text-sm bg-white shrink-0 text-center"
                                required
                              >
                                {countries.map((c) => (
                                  <option key={c.isoCode} value={`+${c.phonecode.replace("+", "")}`}>
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
                        <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.inkMuted }}>
                          Additional Information
                        </label>
                        <textarea
                          placeholder="Any other details about the university (e.g., NMC approval status, year established, tuition fees...)"
                          value={uniForm.additionalInfo}
                          onChange={(e) => setUniForm({ ...uniForm, additionalInfo: e.target.value })}
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
                  </>
                )}
              </div>
            </div>
            
          </div>
        </section>
    </>
  );
}
