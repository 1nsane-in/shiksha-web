"use client";

import React, { useState, useMemo } from "react";
import { brand } from "@/lib/brand";
import { partnerUniversities } from "@/lib/brand-data";
import { SectionHeader } from "@/components/landing/about-us/section-header";
import { UniversityCard } from "@/components/landing/about-us/university-card";
import { Building2, GraduationCap, Clock, Wallet } from "lucide-react";

const countries = ["All", "Kyrgyzstan", "Uzbekistan", "Kazakhstan", "Russia"] as const;
type Country = (typeof countries)[number];

/**
 * Partner universities directory with country filter tabs.
 * Includes country comparison table from shiksha.md data.
 */
export function PartnerSection() {
  const [activeCountry, setActiveCountry] = useState<Country>("All");

  const filteredUniversities = useMemo(() => {
    if (activeCountry === "All") return partnerUniversities;
    return partnerUniversities.filter((uni) => uni.country === activeCountry);
  }, [activeCountry]);

  const universityCount = filteredUniversities.length;

  return (
    <section className="py-24" style={{ background: brand.canvas }}>
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <SectionHeader
          eyebrow="Our Directory"
          title="Partner Medical Universities"
          description="Official collaborations with government-approved medical universities across Kyrgyzstan, Uzbekistan, Kazakhstan & Russia. All universities offer NMC-approved English-medium MBBS programs with WHO recognition."
        />

        {/* Country Filter Tabs */}
        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {countries.map((country) => (
            <button
              key={country}
              onClick={() => setActiveCountry(country)}
              className="relative px-5 py-2.5 text-sm font-medium transition-all duration-200 rounded-full"
              style={{
                backgroundColor:
                  activeCountry === country ? brand.ink : "transparent",
                color: activeCountry === country ? "#fff" : brand.ink,
                border: `1px solid ${activeCountry === country ? brand.ink : brand.hairline}`,
              }}
            >
              {country === "All" ? (
                "All Universities"
              ) : (
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{
                      backgroundColor:
                        country === "Kyrgyzstan"
                          ? "#E31E24"
                          : country === "Uzbekistan"
                          ? "#1EB53A"
                          : country === "Kazakhstan"
                          ? "#00AFCA"
                          : "#0039A6",
                    }}
                  />
                  {country}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <p
          className="mt-6 text-center text-sm"
          style={{ color: brand.inkMuted }}
        >
          Showing <span className="font-semibold" style={{ color: brand.ink }}>{universityCount}</span> partner{" "}
          {universityCount === 1 ? "university" : "universities"}
          {activeCountry !== "All" && ` in ${activeCountry}`}
        </p>

        {/* Universities Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredUniversities.map((uni, index) => (
            <UniversityCard key={uni.name} {...uni} index={index} />
          ))}
        </div>

        {/* Country Comparison Section */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <p
              className="text-sm font-medium uppercase tracking-wider mb-3"
              style={{ color: brand.gold }}
            >
              Compare Options
            </p>
            <h3
              className="text-2xl sm:text-3xl font-semibold"
              style={{ color: brand.ink, letterSpacing: "-0.02em" }}
            >
              Country Comparison 2026
            </h3>
            <p className="mt-3 max-w-2xl mx-auto" style={{ color: brand.inkMuted }}>
              Compare tuition costs, living expenses, and program benefits across our partner countries
            </p>
          </div>

          {/* Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                country: "Kyrgyzstan",
                flag: "🇰🇬",
                cost: "Affordable",
                livingCost: "Low",
                duration: "6 Years",
                highlights: ["Popular among Indian students", "Budget-friendly fees"],
                accent: "#E31E24",
              },
              {
                country: "Uzbekistan",
                flag: "🇺🇿",
                cost: "Moderate",
                livingCost: "Moderate",
                duration: "6 Years",
                highlights: ["Growing international recognition", "Advanced laboratories"],
                accent: "#1EB53A",
              },
              {
                country: "Kazakhstan",
                flag: "🇰🇿",
                cost: "Moderate-Premium",
                livingCost: "Moderate",
                duration: "6 Years",
                highlights: ["NMC & WHO Approved", "Safe on-campus accommodation"],
                accent: "#00AFCA",
              },
              {
                country: "Russia",
                flag: "🇷🇺",
                cost: "Moderate",
                livingCost: "Moderate",
                duration: "6 Years",
                highlights: ["Modern simulation labs", "Research-oriented education"],
                accent: "#0039A6",
              },
            ].map((item) => (
              <div
                key={item.country}
                className="group relative p-5 rounded-xl border transition-all duration-200 hover:shadow-sm"
                style={{
                  backgroundColor: "#fff",
                  borderColor: brand.hairline,
                }}
              >
                {/* Top accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
                  style={{ backgroundColor: item.accent }}
                />

                <div className="flex items-center gap-3 mb-4 mt-1">
                  <span className="text-2xl">{item.flag}</span>
                  <h4
                    className="font-semibold text-lg"
                    style={{ color: brand.ink }}
                  >
                    {item.country}
                  </h4>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4" style={{ color: brand.gold }} />
                    <span className="text-sm" style={{ color: brand.inkMuted }}>
                      Cost: <span className="font-medium" style={{ color: brand.ink }}>{item.cost}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" style={{ color: brand.gold }} />
                    <span className="text-sm" style={{ color: brand.inkMuted }}>
                      Living: <span className="font-medium" style={{ color: brand.ink }}>{item.livingCost}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" style={{ color: brand.gold }} />
                    <span className="text-sm" style={{ color: brand.inkMuted }}>
                      Duration: <span className="font-medium" style={{ color: brand.ink }}>{item.duration}</span>
                    </span>
                  </div>
                  <div className="flex items-start gap-2 pt-2 border-t" style={{ borderColor: brand.hairline }}>
                    <GraduationCap className="w-4 h-4 mt-0.5" style={{ color: brand.gold }} />
                    <ul className="space-y-1">
                      {item.highlights.map((highlight, i) => (
                        <li key={i} className="text-xs" style={{ color: brand.inkMuted }}>
                          • {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Common Benefits */}
          <div
            className="mt-8 p-6 rounded-xl"
            style={{ backgroundColor: brand.goldLight, border: `1px solid ${brand.hairline}` }}
          >
            <p
              className="text-sm font-medium mb-3 flex items-center gap-2"
              style={{ color: brand.ink }}
            >
              <GraduationCap className="w-4 h-4" style={{ color: brand.gold }} />
              Common Benefits Across All Partner Countries
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "No Donation Required",
                "Hostel Available",
                "Indian Mess Facility",
                "Transparent Fee Structure",
                "English-Medium Instruction",
                "NMC Approved",
              ].map((benefit) => (
                <span
                  key={benefit}
                  className="px-3 py-1.5 text-xs font-medium rounded-full"
                  style={{
                    backgroundColor: "#fff",
                    color: brand.ink,
                    border: `1px solid ${brand.hairline}`,
                  }}
                >
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
