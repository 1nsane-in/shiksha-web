"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Country, State } from "country-state-city";
import {
  CheckCircle2,
  Calendar,
  MessageSquare,
  ShieldCheck,
  User,
  Mail,
  Phone,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Loader2,
  Globe,
} from "lucide-react";
import { useCreateConsultation } from "@/domains/consultations";

export function FinalCTA() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    neetScore: "",
    country: "",
    stateName: "",
    prefUniversity: "Jalalabad International University",
    prefIntake: "Winter",
  });
  const [selectedCountryIso, setSelectedCountryIso] = useState("");
  const [selectedCountryPhoneCode, setSelectedCountryPhoneCode] = useState("");
  const createMutation = useCreateConsultation();

  const countries = Country.getAllCountries();
  const states = selectedCountryIso
    ? State.getStatesOfCountry(selectedCountryIso)
    : [];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const isoCode = e.target.value;
    const countryObj = countries.find((c) => c.isoCode === isoCode);
    setSelectedCountryIso(isoCode);
    setSelectedCountryPhoneCode(
      countryObj ? `+${countryObj.phonecode.replace("+", "")}` : "",
    );
    setFormData((prev) => ({
      ...prev,
      country: countryObj ? countryObj.name : "",
      stateName: "",
    }));
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, stateName: e.target.value }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (selectedCountryIso) {
      value = value.slice(0, 10);
    }
    setFormData((prev) => ({ ...prev, mobile: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.mobile) {
      toast.error("Please fill in Name, Email, and Mobile Number.");
      return;
    }
    if (selectedCountryIso && formData.mobile.trim().length !== 10) {
      toast.error("Please enter a valid 10-digit Mobile No.");
      return;
    }

    const fullPhone = selectedCountryPhoneCode
      ? `${selectedCountryPhoneCode} ${formData.mobile.trim()}`
      : formData.mobile.trim();

    const payload: Record<string, unknown> = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: fullPhone,
    };

    if (formData.neetScore.trim()) {
      const scoreNum = parseInt(formData.neetScore.trim(), 10);
      if (!isNaN(scoreNum) && scoreNum >= 0 && scoreNum <= 720) {
        payload.neetScore = scoreNum;
      }
    }

    if (formData.country.trim()) {
      payload.country = formData.country.trim();
    }

    if (formData.stateName.trim()) {
      payload.state = formData.stateName.trim();
    }

    if (formData.prefUniversity.trim()) {
      payload.preferredUniversity = formData.prefUniversity.trim();
    }

    if (formData.prefIntake.trim()) {
      payload.preferredIntake = formData.prefIntake.trim();
    }

    try {
      await createMutation.mutateAsync(payload as any);
      setSubmitted(true);
    } catch {
      toast.error("Failed to submit. Please try again.");
    }
  };

  return (
    <section className="py-20 sm:py-28 bg-gradient-to-br from-[#1A153A] via-[#2D2154] to-[#1A153A] relative overflow-hidden border-t border-slate-900">
      {/* Background radial accent */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 rounded-full bg-[#C4953B]/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column - Benefits & Copy */}
          <div className="lg:col-span-5 text-white space-y-6">
            <span className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider bg-[#C4953B]/20 text-[#C4953B] border border-[#C4953B]/30">
              <TrendingUp className="size-3" />
              Free Personalized Counseling
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight text-white">
              Start Your Medical Career Journey with Confidence
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Book a free counselling session with a medical doctor from our
              counseling panel. We assist with admissions, document
              notarization, hostel allocations, and study visa processing.
            </p>

            <div className="space-y-4 pt-4 border-t border-slate-700/50">
              <div className="flex items-start gap-3.5 text-xs sm:text-sm text-slate-200">
                <ShieldCheck className="size-5 text-[#C4953B] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold">
                    100% Secure Admissions
                  </strong>
                  Direct university partnerships, no hidden commissions.
                </div>
              </div>
              <div className="flex items-start gap-3.5 text-xs sm:text-sm text-slate-200">
                <Calendar className="size-5 text-[#C4953B] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold">
                    Flexible Intake & Modes
                  </strong>
                  Choose Summer/Winter intakes with in-person or virtual
                  counseling.
                </div>
              </div>
              <div className="flex items-start gap-3.5 text-xs sm:text-sm text-slate-200">
                <MessageSquare className="size-5 text-[#C4953B] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold">
                    NMC & FMGE Integration
                  </strong>
                  Complete guidance on how to pass the licensing exams in India.
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl text-slate-800 border border-slate-100 max-w-xl mx-auto">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#1A153A]">
                      Book Free Counseling
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Submit your details to enter the admission queue.
                    </p>
                  </div>

                  

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                        <User className="size-3 text-[#C4953B]" /> Name{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className="w-full py-2 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#C4953B] bg-slate-50/50"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                        <Mail className="size-3 text-[#C4953B]" /> Email{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Your email address"
                        className="w-full py-2 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#C4953B] bg-slate-50/50"
                      />
                    </div>

                    {/* Mobile with country code prefix */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                        <Phone className="size-3 text-[#C4953B]" /> Mobile{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        {selectedCountryPhoneCode && (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-slate-500 font-medium pointer-events-none">
                            {selectedCountryPhoneCode}
                          </span>
                        )}
                        <input
                          type="tel"
                          name="mobile"
                          required
                          value={formData.mobile}
                          onChange={handlePhoneChange}
                          placeholder={
                            selectedCountryIso
                              ? "10-digit number"
                              : "Enter mobile number"
                          }
                          className={`w-full py-2 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#C4953B] bg-slate-50/50 ${
                            selectedCountryPhoneCode ? "pl-16" : ""
                          }`}
                        />
                      </div>
                    </div>

                    {/* NEET Score */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                        <BookOpen className="size-3 text-[#C4953B]" /> NEET
                        Score
                      </label>
                      <input
                        type="number"
                        name="neetScore"
                        value={formData.neetScore}
                        onChange={handleChange}
                        placeholder="NEET score (optional)"
                        className="w-full py-2 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#C4953B] bg-slate-50/50"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                        <Globe className="size-3 text-[#C4953B]" /> Country{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={selectedCountryIso}
                        onChange={handleCountryChange}
                        className="w-full py-2 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#C4953B] bg-slate-50/50 cursor-pointer"
                      >
                        <option value="">Select Country</option>
                        {countries.map((c) => (
                          <option key={c.isoCode} value={c.isoCode}>
                            {c.flag} {c.name} (+{c.phonecode})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* State */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                        State of Residence
                      </label>
                      {selectedCountryIso ? (
                        <select
                          value={formData.stateName}
                          onChange={handleStateChange}
                          className="w-full py-2 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#C4953B] bg-slate-50/50 cursor-pointer"
                        >
                          <option value="">Select State</option>
                          {states.map((s) => (
                            <option key={s.isoCode} value={s.name}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          name="stateName"
                          value={formData.stateName}
                          onChange={handleChange}
                          placeholder="Select a country first"
                          disabled
                          className="w-full py-2 px-3 border border-slate-200 rounded-lg text-sm bg-slate-100 cursor-not-allowed"
                        />
                      )}
                    </div>

                    {/* Preferred University */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                        Preferred University
                      </label>
                      <select
                        name="prefUniversity"
                        value={formData.prefUniversity}
                        onChange={handleChange}
                        className="w-full py-2 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#C4953B] bg-slate-50/50 cursor-pointer"
                      >
                        <option value="Jalal-Abad State University">
                          Jalal-Abad State Univ
                        </option>
                        <option value="Bishkek International Medical Institute">
                          Bishkek Int. Medical Institute
                        </option>
                        <option value="Jalalabad International University">
                          Jalalabad International Univ
                        </option>
                        <option value="Osh State University">
                          Osh State Univ
                        </option>
                        <option value="Andijan State Medical Institute">
                          Andijan State Medical Institute
                        </option>
                        <option value="North Kazakhstan State Medical University">
                          North Kazakhstan State Medical Univ
                        </option>
                        <option value="Sevastopol State University">
                          Sevastopol State Univ
                        </option>
                        <option value="Kemerovo State University">
                          Kemerovo State Univ
                        </option>
                        <option value="Maykop State Medical Institute">
                          Maykop State Medical Institute
                        </option>
                        <option value="Kirov State Medical University">
                          Kirov State Medical Univ
                        </option>
                      </select>
                    </div>

                    {/* Preferred Intake */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                        Preferred Intake
                      </label>
                      <select
                        name="prefIntake"
                        value={formData.prefIntake}
                        onChange={handleChange}
                        className="w-full py-2 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#C4953B] bg-slate-50/50 cursor-pointer"
                      >
                        <option value="Summer">Summer Intake (May/Jun)</option>
                        <option value="Winter">Winter Intake (Sep/Oct)</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={createMutation.isPending}
                      className="w-full py-3 text-sm font-bold uppercase tracking-wider rounded-xl transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
                      style={{
                        background: "#C4953B",
                        color: "#1A153A",
                      }}
                    >
                      {createMutation.isPending ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Book Free Counseling
                          <ArrowRight className="size-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-12 px-4 animate-fadeIn space-y-5">
                  <div className="size-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4 border border-emerald-200/50">
                    <CheckCircle2 className="size-8 text-emerald-500" />
                  </div>
                  <h4 className="text-2xl font-extrabold text-[#1A153A]">
                    Lead Submitted Successfully
                  </h4>
                  <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Thank you,{" "}
                    <strong className="text-slate-800">{formData.name}</strong>.
                    One of our expert medical education counselors will call you
                    shortly on{" "}
                    <strong className="text-slate-800">
                      {formData.mobile}
                    </strong>{" "}
                    to schedule your session.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setSelectedCountryIso("");
                      setSelectedCountryPhoneCode("");
                      setFormData({
                        name: "",
                        email: "",
                        mobile: "",
                        neetScore: "",
                        country: "",
                        stateName: "",
                        prefUniversity: "Jalalabad International University",
                        prefIntake: "Winter",
                      });
                    }}
                    className="text-xs text-[#C4953B] font-bold border-b border-[#C4953B]/50 pb-0.5 hover:text-[#1A153A]"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
