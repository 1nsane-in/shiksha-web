"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import {
  Award,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Building2,
  Calendar,
  GraduationCap,
  MapPin,
  ArrowRight,
  ShieldAlert,
  Search,
  Check,
  DollarSign,
  AlertTriangle,
} from "lucide-react";

import { brand } from "@/lib/brand";

/* ─── component-local layout tokens ─── */
const radius = { card: 16, btn: 10 };

const mockUniversities = [
  {
    id: "1",
    name: "Jalalabad International University",
    shortName: "JAIU",
    slug: "jalalabad-international-university",
    establishedYear: 1998,
    type: "PRIVATE",
    feePerYear: 3200,
    city: "Jalalabad",
    country: "Kyrgyzstan",
    minNeet: 129,
    description: "NMC & WHO recognized medical university with modern infrastructure and 25+ years of excellence.",
    tags: ["Indian Food", "Separate Hostels", "FMGE Classes"],
  },
  {
    id: "2",
    name: "Osh State University",
    shortName: "OSMU",
    slug: "osh-state-university",
    establishedYear: 1992,
    type: "GOVERNMENT",
    feePerYear: 4000,
    city: "Osh",
    country: "Kyrgyzstan",
    minNeet: 150,
    description: "One of the oldest medical universities in Central Asia. Highly prestigious government degree.",
    tags: ["Indian Food", "Government", "FMGE Classes", "Separate Hostels"],
  },
  {
    id: "3",
    name: "Asian Medical Institute",
    shortName: "ASI",
    slug: "asian-medical-institute",
    establishedYear: 2004,
    type: "PRIVATE",
    feePerYear: 2900,
    city: "Kant",
    country: "Kyrgyzstan",
    minNeet: 129,
    description: "Modern medical institute with affordable fee structure, NMC approved curriculum, and student support.",
    tags: ["Indian Food", "Separate Hostels"],
  },
];

export function EligibilityCalculator() {
  const router = useRouter();
  const [neetScore, setNeetScore] = useState<string>("150");
  const [category, setCategory] = useState<"GENERAL" | "OBC_SC_ST">("GENERAL");
  const [budget, setBudget] = useState<number>(3500); // Annual tuition fee max
  const [prefType, setPrefType] = useState<"ALL" | "GOVERNMENT" | "PRIVATE">("ALL");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  // Toggle checklist features
  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  };

  // Compute validation
  const eligibility = useMemo(() => {
    const scoreNum = parseInt(neetScore) || 0;
    const requiredMin = category === "GENERAL" ? 164 : 129;
    const qualified = scoreNum >= requiredMin;

    return {
      qualified,
      requiredMin,
      scoreNum,
    };
  }, [neetScore, category]);

  // Filter matching universities
  const matchingUniversities = useMemo(() => {
    if (!eligibility.qualified) return [];

    return mockUniversities.filter((uni) => {
      // 1. Budget Filter
      if (uni.feePerYear > budget) return false;

      // 2. Type Filter
      if (prefType !== "ALL" && uni.type !== prefType) return false;

      // 3. Feature Tags Filter
      if (selectedFeatures.length > 0) {
        const hasAllFeatures = selectedFeatures.every((feat) =>
          uni.tags.includes(feat)
        );
        if (!hasAllFeatures) return false;
      }

      return true;
    });
  }, [eligibility.qualified, budget, prefType, selectedFeatures]);

  return (
    <section className="py-20 md:py-28" style={{ background: brand.canvas }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <div
            className="mb-4 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium tracking-wide uppercase"
            style={{
              background: brand.goldLight,
              color: brand.gold,
              border: "1px solid " + brand.gold + "33",
            }}
          >
            <Award className="size-3" />
            Check Eligibility Instantly
          </div>
          <h2
            className="text-balance text-3xl font-bold leading-tight tracking-tight md:text-4xl"
            style={{ color: brand.ink }}
          >
            Interactive NEET Eligibility Calculator
          </h2>
          <p
            className="mt-3 text-balance leading-relaxed"
            style={{ color: brand.inkMuted }}
          >
            Input your NEET score and preferences to see your qualified universities and admission chances in Kyrgyzstan instantly.
          </p>
        </div>

        {/* Calculator layout */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Controls Panel */}
          <div
            className="rounded-2xl p-6 shadow-md border lg:col-span-5"
            style={{
              background: brand.surface,
              borderColor: brand.hairline,
              borderRadius: radius.card,
            }}
          >
            <h3
              className="text-lg font-bold mb-6 flex items-center gap-2"
              style={{ color: brand.ink }}
            >
              <TrendingUp className="size-5 text-[#C4953B]" />
              Calculator Parameters
            </h3>

            <div className="space-y-6">
              {/* Category selector */}
              <div>
                <label
                  className="block text-xs font-semibold uppercase tracking-wider mb-2"
                  style={{ color: brand.inkMuted }}
                >
                  Candidate Category
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "GENERAL", label: "General" },
                    { id: "OBC_SC_ST", label: "OBC / SC / ST" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id as any)}
                      className="flex items-center justify-center py-2.5 px-4 rounded-xl text-sm font-semibold border transition-all duration-200"
                      style={{
                        background:
                          category === cat.id ? brand.goldLight : "transparent",
                        borderColor:
                          category === cat.id ? brand.gold : brand.hairline,
                        color: category === cat.id ? brand.ink : brand.inkMuted,
                      }}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* NEET score field */}
              <div>
                <label
                  className="block text-xs font-semibold uppercase tracking-wider mb-2"
                  style={{ color: brand.inkMuted }}
                >
                  NEET Score (out of 720)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="720"
                    value={neetScore}
                    onChange={(e) => setNeetScore(e.target.value)}
                    className="w-full py-3 px-4 rounded-xl border text-base font-medium focus:outline-none focus:ring-1 transition-all duration-200"
                    style={{
                      borderColor: brand.hairline,
                      background: brand.canvas,
                      color: brand.ink,
                    }}
                    placeholder="Enter your NEET UG Score"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                    / 720
                  </div>
                </div>
                {/* slider */}
                <input
                  type="range"
                  min="0"
                  max="720"
                  value={neetScore}
                  onChange={(e) => setNeetScore(e.target.value)}
                  className="w-full mt-3 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#C4953B]"
                />
              </div>

              {/* Budget slider */}
              <div>
                <label
                  className="block text-xs font-semibold uppercase tracking-wider mb-1 flex justify-between"
                  style={{ color: brand.inkMuted }}
                >
                  <span>Max Budget / Year</span>
                  <span className="font-bold text-[#C4953B]" style={{ color: brand.gold }}>
                    ${budget.toLocaleString()}
                  </span>
                </label>
                <input
                  type="range"
                  min="2500"
                  max="5000"
                  step="100"
                  value={budget}
                  onChange={(e) => setBudget(parseInt(e.target.value))}
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#C4953B]"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>$2,500</span>
                  <span>$3,500</span>
                  <span>$5,000</span>
                </div>
              </div>

              {/* Pref type selector */}
              <div>
                <label
                  className="block text-xs font-semibold uppercase tracking-wider mb-2"
                  style={{ color: brand.inkMuted }}
                >
                  University Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "ALL", label: "All Types" },
                    { id: "GOVERNMENT", label: "Govt." },
                    { id: "PRIVATE", label: "Private" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setPrefType(t.id as any)}
                      className="flex items-center justify-center py-2 px-1.5 rounded-xl text-[11px] sm:text-xs font-semibold border transition-all duration-200"
                      style={{
                        background:
                          prefType === t.id ? brand.goldLight : "transparent",
                        borderColor:
                          prefType === t.id ? brand.gold : brand.hairline,
                        color: prefType === t.id ? brand.ink : brand.inkMuted,
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Extra features */}
              <div>
                <label
                  className="block text-xs font-semibold uppercase tracking-wider mb-3"
                  style={{ color: brand.inkMuted }}
                >
                  Must-Have Facilities
                </label>
                <div className="space-y-2.5">
                  {[
                    { id: "Indian Food", label: "Indian Food Mess" },
                    { id: "Separate Hostels", label: "Separate Hostels (Boys / Girls)" },
                    { id: "FMGE Classes", label: "FMGE / NExT Coaching classes" },
                  ].map((feat) => {
                    const checked = selectedFeatures.includes(feat.id);
                    return (
                      <button
                        key={feat.id}
                        type="button"
                        onClick={() => handleFeatureToggle(feat.id)}
                        className="flex items-center w-full gap-3 text-left py-2.5 px-4 rounded-xl text-sm border transition-all duration-150"
                        style={{
                          background: checked ? brand.goldLight : "transparent",
                          borderColor: checked ? brand.gold : brand.hairline,
                          color: checked ? brand.ink : brand.inkMuted,
                        }}
                      >
                        <div
                          className="flex size-4 items-center justify-center rounded border transition-all duration-150"
                          style={{
                            borderColor: checked ? brand.gold : brand.inkSubtle,
                            background: checked ? brand.gold : "transparent",
                          }}
                        >
                          {checked && <Check className="size-3 text-white stroke-[3px]" />}
                        </div>
                        <span className="font-semibold text-xs leading-none">{feat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <AnimatePresence mode="wait">
              {/* Not Qualified state */}
              {!eligibility.qualified ? (
                <motion.div
                  key="not-qualified"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center text-center p-8 border rounded-2xl h-full"
                  style={{
                    background: "rgba(239, 68, 68, 0.02)",
                    borderColor: "rgba(239, 68, 68, 0.15)",
                    borderRadius: radius.card,
                  }}
                >
                  <div className="size-16 rounded-full bg-red-50 flex items-center justify-center mb-6">
                    <XCircle className="size-8 text-red-500" />
                  </div>
                  <h4
                    className="text-xl font-bold mb-3"
                    style={{ color: brand.ink }}
                  >
                    NEET Score Not Qualified
                  </h4>
                  <p
                    className="text-sm max-w-md leading-relaxed mb-6"
                    style={{ color: brand.inkMuted }}
                  >
                    To study MBBS abroad legally under NMC guidelines, you need a minimum qualifying NEET UG score of{" "}
                    <span className="font-bold text-red-500">{eligibility.requiredMin}</span> for the{" "}
                    <span className="font-bold uppercase">{category}</span> category. Your current score is{" "}
                    <span className="font-bold text-red-500">{eligibility.scoreNum}</span>.
                  </p>
                  <div
                    className="flex gap-3 text-left p-4 rounded-xl text-xs max-w-md leading-relaxed border"
                    style={{
                      background: brand.surface,
                      borderColor: "rgba(239, 68, 68, 0.1)",
                    }}
                  >
                    <ShieldAlert className="size-6 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-red-600 block mb-0.5">Crucial Rule:</span>
                      Foreign medical degrees obtained without NEET qualification are not recognized in India. You will be ineligible to take the licensing FMGE/NExT exam.
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* Eligible state */
                <motion.div
                  key="qualified"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 flex flex-col h-full justify-between"
                >
                  {/* Status Banner */}
                  <div
                    className="p-5 border rounded-2xl flex items-center gap-4 shadow-sm"
                    style={{
                      background: "rgba(16, 185, 129, 0.03)",
                      borderColor: "rgba(16, 185, 129, 0.15)",
                      borderRadius: radius.card,
                    }}
                  >
                    <div className="size-12 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="size-6 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-emerald-800">
                        Congratulations! You are Eligible
                      </h4>
                      <p className="text-xs text-emerald-600 font-medium mt-0.5">
                        Your score of {eligibility.scoreNum} exceeds the qualifying mark of {eligibility.requiredMin}.
                      </p>
                    </div>
                    {/* Merit bonus banner */}
                    {eligibility.scoreNum >= 450 && (
                      <div className="ml-auto hidden sm:flex items-center gap-1.5 py-1 px-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 animate-pulse border border-amber-200">
                        <TrendingUp className="size-3" />
                        Scholarship Candidate
                      </div>
                    )}
                  </div>

                  {/* Matching results */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-bold uppercase tracking-wider" style={{ color: brand.inkMuted }}>
                        Matching Kyrgyzstan Universities ({matchingUniversities.length})
                      </h4>
                      <span className="text-xs text-slate-400 font-medium">
                        Based on your budget and parameters
                      </span>
                    </div>

                    <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
                      {matchingUniversities.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 border rounded-2xl text-center bg-white border-dashed">
                          <AlertTriangle className="size-8 text-amber-500 mb-3" />
                          <p className="text-sm font-bold text-slate-700">No universities match your exact parameters</p>
                          <p className="text-xs text-slate-400 mt-1 max-w-xs">
                            Try increasing your annual budget limit or unchecking some required facilities above!
                          </p>
                        </div>
                      ) : (
                        matchingUniversities.map((uni) => (
                          <div
                            key={uni.id}
                            className="p-4 border rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-all duration-200 hover:shadow-sm"
                            style={{
                              background: brand.surface,
                              borderColor: brand.hairline,
                            }}
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span
                                  className="py-0.5 px-1.5 rounded text-[9px] font-bold uppercase tracking-wide bg-slate-100 text-slate-600 border"
                                  style={{ borderColor: brand.hairline }}
                                >
                                  {uni.type}
                                </span>
                                <h5 className="font-bold text-sm" style={{ color: brand.ink }}>
                                  {uni.name} ({uni.shortName})
                                </h5>
                              </div>
                              <p className="text-xs text-slate-400 mt-1 line-clamp-1 max-w-md">
                                {uni.description}
                              </p>
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {uni.tags.map((t) => (
                                  <span
                                    key={t}
                                    className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-gray-50 border text-slate-400"
                                    style={{ borderColor: brand.hairline }}
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex sm:flex-col items-end shrink-0 gap-3 sm:gap-1.5 justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-dashed">
                              <div className="text-right">
                                <span className="text-[10px] font-semibold text-slate-400 block leading-none">Annual Fee</span>
                                <span className="text-base font-extrabold text-[#C4953B]" style={{ color: brand.gold }}>
                                  ${uni.feePerYear.toLocaleString()}
                                </span>
                              </div>
                              <button
                                onClick={() => router.push("/student/university/" + uni.slug + "?apply=true")}
                                className="inline-flex items-center justify-center gap-1 text-[11px] font-bold py-1.5 px-3 rounded-lg bg-[#1A153A] text-white hover:bg-opacity-90 transition-all duration-200 active:scale-[0.97]"
                                style={{ background: brand.ink }}
                              >
                                Apply Now
                                <ArrowRight className="size-3" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Lead / Next Step trigger */}
                  <div
                    className="p-5 border rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 shadow-sm"
                    style={{
                      background: brand.surface,
                      borderColor: brand.gold + "33",
                      borderRadius: radius.card,
                    }}
                  >
                    <div className="max-w-md text-center sm:text-left">
                      <h5 className="text-sm font-bold flex items-center justify-center sm:justify-start gap-1.5" style={{ color: brand.ink }}>
                        <GraduationCap className="size-4 text-[#C4953B]" />
                        Want a Professional Free Consultation?
                      </h5>
                      <p className="text-xs text-slate-400 mt-1">
                        Book a free counselling session with our medical admissions team to secure your seat.
                      </p>
                    </div>
                    <button
                      onClick={() => router.push("/register")}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider py-3 px-5 rounded-xl transition-all duration-200 active:scale-[0.97] shrink-0"
                      style={{
                        background: brand.gold,
                        color: brand.ink,
                      }}
                    >
                      Book Session
                      <ArrowRight className="size-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
