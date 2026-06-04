"use client";

import React, { useState } from "react";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { useCreateConsultation } from "@/domains/consultations";
import { toast } from "sonner";
import { Phone, Mail, MapPin, Clock, Send, ShieldCheck, HelpCircle, Loader2 } from "lucide-react";

const theme = {
  ink: "#1A153A",
  inkMuted: "#6B6599",
  gold: "#C4953B",
  goldLight: "rgba(196, 149, 59, 0.10)",
  canvas: "#FAF9F6",
  surface: "#FFFFFF",
  hairline: "rgba(26, 21, 58, 0.08)",
};

export default function ContactUsPage() {
  const createMutation = useCreateConsultation();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    neetScore: "",
    state: "",
    country: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
    if (!form.phone.trim()) {
      toast.error("Please enter your Mobile No.");
      return;
    }

    const payload: any = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
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
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to submit request. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: theme.canvas }}>
      <Header />

      <main className="flex-1">
        {/* Banner Section */}
        <section className="relative py-16 overflow-hidden bg-[#1A153A]">
          <div className="pointer-events-none absolute inset-0 opacity-15">
            <img
              alt="Medical counseling consultation"
              src="https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&w=1920&q=80"
              className="size-full object-cover"
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
                    <h4 className="text-sm font-semibold" style={{ color: theme.ink }}>Mobile Numbers</h4>
                    <p className="text-sm font-mono mt-1" style={{ color: theme.inkMuted }}>+996 5566 11890</p>
                    <p className="text-sm font-mono" style={{ color: theme.inkMuted }}>+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-xl border bg-white" style={{ borderColor: theme.hairline }}>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ background: theme.goldLight, color: theme.gold }}>
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold" style={{ color: theme.ink }}>Email Addresses</h4>
                    <p className="text-sm mt-1" style={{ color: theme.inkMuted }}>admissions@shiksha-global.com</p>
                    <p className="text-sm" style={{ color: theme.inkMuted }}>support@shiksha-global.com</p>
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

            {/* Right: Consultation Form (3/5 size) */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border p-6 sm:p-8 shadow-sm" style={{ borderColor: theme.hairline }}>
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

                  {/* Mobile No & NEET Score */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.inkMuted }}>
                        Mobile No. <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="e.g., +91 9876543210"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#3730A3] focus:border-[#3730A3] text-sm"
                        required
                      />
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

                  {/* State & Country */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label htmlFor="state" className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.inkMuted }}>
                        State
                      </label>
                      <input
                        id="state"
                        name="state"
                        type="text"
                        placeholder="Enter Your State"
                        value={form.state}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#3730A3] focus:border-[#3730A3] text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="country" className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.inkMuted }}>
                        Country
                      </label>
                      <input
                        id="country"
                        name="country"
                        type="text"
                        placeholder="Enter Your country"
                        value={form.country}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#3730A3] focus:border-[#3730A3] text-sm"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={createMutation.isPending}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
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
              </div>
            </div>
            
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
