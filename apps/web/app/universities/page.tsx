"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { useUniversities } from "@/domains/universities/universities.queries";
import {
  MapPin,
  GraduationCap,
  Calendar,
  AlertCircle,
  Star,
  CheckCircle,
  Building2,
  ArrowRight,
  Globe,
  Phone,
  Search,
  Filter,
} from "lucide-react";
import { motion } from "motion/react";

const theme = {
  bg: "#FAF9F6",
  surface: "#FFFFFF",
  ink: "#1A153A",
  inkMuted: "#6B6599",
  inkSubtle: "#9590B5",
  gold: "#C4953B",
  goldLight: "rgba(196, 149, 59, 0.10)",
  goldBorder: "rgba(196, 149, 59, 0.20)",
  hairline: "rgba(26, 21, 58, 0.08)",
  cardRadius: 16,
  btnRadius: 10,
};

const seedUniversities = [
  {
    id: "1",
    name: "Jalalabad International University",
    shortName: "JAIU",
    slug: "jalalabad-international-university",
    establishedYear: 1998,
    type: "PRIVATE",
    status: "ACTIVE",
    logo: "https://placehold.co/200x200/1A153A/C4953B?text=JAIU",
    bannerImage:
      "https://placehold.co/1200x400/1A153A/FAF9F6?text=Jalalabad+International+University",
    location: {
      city: "Jalalabad",
      country: "Kyrgyzstan",
      state: "Jalalabad Region",
      address: "104 Silk Road St, Jalalabad",
    },
    contact: { email: "admissions@jaiu.edu.kg", phone: "+996 XXX XXX XXX" },
    academic: { medium: "English" },
    content: {
      gallery: [],
      shortDescription:
        "NMC & WHO recognized medical university with modern infrastructure and 25+ years of excellence in medical education.",
    },
  },
  {
    id: "2",
    name: "Osh State University",
    shortName: "OSMU",
    slug: "osh-state-university",
    establishedYear: 1992,
    type: "GOVERNMENT",
    status: "ACTIVE",
    logo: "https://placehold.co/200x200/1A153A/C4953B?text=OSMU",
    bannerImage:
      "https://placehold.co/1200x400/1A153A/FAF9F6?text=Osh+State+University",
    location: {
      city: "Osh",
      country: "Kyrgyzstan",
      state: "Osh Region",
      address: "331 Lenin Ave, Osh",
    },
    contact: { email: "admissions@osmu.edu.kg", phone: "+996 XXX XXX XXX" },
    academic: { medium: "English" },
    content: {
      gallery: [],
      shortDescription:
        "One of the oldest medical universities in Central Asia with a strong alumni network and clinical training across 15+ affiliated hospitals.",
    },
  },
  {
    id: "3",
    name: "Asian Medical Institute",
    shortName: "ASI",
    slug: "asian-medical-institute",
    establishedYear: 2004,
    type: "PRIVATE",
    status: "ACTIVE",
    logo: "https://placehold.co/200x200/1A153A/C4953B?text=ASI",
    bannerImage:
      "https://placehold.co/1200x400/1A153A/FAF9F6?text=Asian+Medical+Institute",
    location: {
      city: "Kant",
      country: "Kyrgyzstan",
      state: "Chuy Region",
      address: "12 Mira St, Kant",
    },
    contact: { email: "admissions@asi.edu.kg", phone: "+996 XXX XXX XXX" },
    academic: { medium: "English" },
    content: {
      gallery: [],
      shortDescription:
        "Modern medical institute with affordable fee structure, NMC approved curriculum, and dedicated international student support.",
    },
  },
];

function universityTypeBadge(type: string) {
  const map: Record<string, { label: string; style: string }> = {
    GOVERNMENT: {
      label: "Government",
      style: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    },
    PRIVATE: {
      label: "Private",
      style: "bg-violet-50 text-violet-700 ring-violet-200",
    },
  };
  return (
    map[type] ?? {
      label: type,
      style: "bg-gray-50 text-gray-600 ring-gray-200",
    }
  );
}

function formatEstablished(year: number | null | undefined) {
  if (!year) return "\u2014";
  const current = new Date().getFullYear();
  return year + " \u00B7 " + (current - year) + " yrs";
}

export default function PublicUniversitiesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "GOVERNMENT" | "PRIVATE">("ALL");

  const { data: response, isLoading, error } = useUniversities({ limit: 50 });
  const universities = response?.data?.length ? response.data : seedUniversities;

  // Filter logic
  const filteredUniversities = useMemo(() => {
    return universities.filter((uni) => {
      const matchesSearch =
        uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        uni.shortName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === "ALL" || uni.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [universities, searchTerm, typeFilter]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FAF9F6] pt-24 sm:pt-28 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header Banner */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider bg-amber-50 text-gold border border-amber-200/50 mb-4">
              <Star className="size-3.5 fill-gold" />
              NMC, WHO & ECFMG Approved
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1A153A] leading-tight tracking-tight">
              Our Partner <span className="text-gold">Medical Universities</span>
            </h1>
            <p className="text-slate-500 mt-4 leading-relaxed text-sm sm:text-base">
              Explore premier government and private medical universities in Kyrgyzstan. Low-cost English medium MBBS programs fully compliant with NMC directives.
            </p>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm max-w-4xl mx-auto mb-12 flex flex-col sm:flex-row items-center gap-4">
            {/* Search Input */}
            <div className="relative w-full sm:flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search university by name or abbreviation (e.g. OSMU)..."
                className="w-full py-2.5 pl-10 pr-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-gold bg-slate-50/50 text-[#1A153A]"
              />
            </div>

            {/* Type Filters */}
            <div className="flex gap-2 shrink-0 w-full sm:w-auto justify-center sm:justify-start border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
              {[
                { id: "ALL", label: "All Types" },
                { id: "GOVERNMENT", label: "Government" },
                { id: "PRIVATE", label: "Private" },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setTypeFilter(filter.id as any)}
                  className="py-2 px-4 rounded-xl text-xs font-bold transition-all duration-150 border"
                  style={{
                    background: typeFilter === filter.id ? theme.goldLight : "transparent",
                    borderColor: typeFilter === filter.id ? theme.gold : theme.hairline,
                    color: typeFilter === filter.id ? theme.ink : theme.inkMuted,
                  }}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Loading Indicator */}
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block size-8 animate-spin rounded-full border-4 border-solid border-gold border-r-transparent shrink-0" />
              <p className="text-xs text-slate-400 mt-4 font-semibold">Loading university directory...</p>
            </div>
          ) : filteredUniversities.length === 0 ? (
            <div className="text-center py-20 border border-slate-100 border-dashed rounded-2xl bg-white max-w-lg mx-auto">
              <Building2 className="size-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-base font-bold text-slate-700">No Universities Found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                No partners match your criteria. Try resetting filters or updating your search string.
              </p>
              <button
                onClick={() => router.push("/contact-us?subject=university-request")}
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-gold hover:bg-[#b0852f] text-white font-semibold text-xs rounded-lg transition-all duration-200"
              >
                <Building2 className="w-4 h-4" />
                Request to Add University
              </button>
            </div>
          ) : (
            /* Card list grid */
            <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
              {filteredUniversities.map((uni, index) => {
                const typeBadge = universityTypeBadge(uni.type);
                const imageSrc = uni.bannerImage || uni.logo || "";
                const hasImage = !!imageSrc;
                return (
                  <motion.div
                    key={uni.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.05,
                    }}
                  >
                    <div
                      className="group relative overflow-hidden transition-all duration-200 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md"
                    >
                      {/* top accent bar */}
                      <div className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 bg-gold" />

                      <div className="flex flex-col sm:flex-row">
                        {/* Image banner */}
                        <div className="relative w-full shrink-0 overflow-hidden sm:w-44 sm:min-h-[260px] bg-slate-50">
                          <div className="relative h-48 w-full sm:h-full">
                            {hasImage ? (
                              <Image
                                src={imageSrc}
                                alt={uni.name}
                                fill
                                unoptimized
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 640px) 100vw, 176px"
                              />
                            ) : (
                              <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                                <Building2 className="size-10 text-slate-300" />
                                <span className="text-xs font-semibold text-slate-400">
                                  {uni.shortName || "MBBS"}
                                </span>
                              </div>
                            )}
                          </div>

                          <span className={`absolute left-3 top-3 inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium leading-none ring-1 ring-inset ${typeBadge.style}`}>
                            {typeBadge.label}
                          </span>
                        </div>

                        {/* Contents */}
                        <div className="flex min-w-0 flex-1 flex-col p-5 justify-between">
                          <div className="space-y-3">
                            <div className="min-w-0">
                              <h3 className="text-base font-bold text-[#1A153A] leading-snug truncate">
                                {uni.name}
                              </h3>
                              {uni.shortName && (
                                <span className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
                                  {uni.shortName}
                                </span>
                              )}
                            </div>

                            {uni.content?.shortDescription && (
                              <p className="line-clamp-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
                                {uni.content.shortDescription}
                              </p>
                            )}

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-semibold bg-slate-100 text-slate-500">
                                <Calendar className="size-3" />
                                {formatEstablished(uni.establishedYear)}
                              </span>
                              <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-semibold bg-slate-100 text-slate-500">
                                <GraduationCap className="size-3" />
                                {uni.academic?.medium || "English"}
                              </span>
                              {uni.location?.city && (
                                <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-semibold bg-slate-100 text-slate-500 block truncate max-w-[140px]">
                                  <MapPin className="size-3" />
                                  {uni.location.city}
                                </span>
                              )}
                            </div>

                            {/* Approvals */}
                            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-bold text-emerald-600">
                              <span className="flex items-center gap-1"><CheckCircle className="size-3" /> NMC</span>
                              <span className="flex items-center gap-1"><CheckCircle className="size-3 text-blue-500" /> WHO</span>
                              <span className="flex items-center gap-1"><CheckCircle className="size-3 text-purple-500" /> ECFMG</span>
                            </div>
                          </div>

                          <div className="pt-5 border-t border-slate-100 flex items-center gap-2 mt-4">
                            <button
                              onClick={() => router.push("/student/university/" + uni.slug + "?apply=true")}
                              className="flex-1 py-2 px-3 text-center text-xs font-bold text-white rounded-lg transition-all duration-150 active:scale-[0.98] bg-gold"
                            >
                              Apply Now
                            </button>
                            <button
                              onClick={() => router.push("/student/university/" + uni.slug)}
                              className="flex-1 py-2 px-3 text-center text-xs font-bold text-[#1A153A] border rounded-lg transition-all duration-150 bg-transparent border-slate-200 hover:border-[#1A153A]"
                            >
                              View details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Request University Banner - After listings */}
          {!isLoading && filteredUniversities.length > 0 && (
            <div className="max-w-5xl mx-auto mt-16">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1A153A] via-[#2d2652] to-[#1A153A] border border-gold/20">
                {/* Decorative pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-gold blur-3xl" />
                  <div className="absolute -left-20 -bottom-20 w-48 h-48 rounded-full bg-gold blur-3xl" />
                </div>
                
                <div className="relative px-6 py-8 sm:px-10 sm:py-10 flex flex-col sm:flex-row items-center gap-6">
                  {/* Icon */}
                  <div className="shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-gold" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-lg sm:text-xl font-bold text-gold mb-2">
                      Can&apos;t Find Your University?
                    </h3>
                    <p className="text-sm text-white/80 leading-relaxed max-w-xl">
                      If the university you&apos;re looking for isn&apos;t listed in our directory, 
                      let us know and our team will research and add it to our database within 24-48 hours.
                    </p>
                  </div>
                  
                  {/* CTA Button */}
                  <div className="shrink-0">
                    <button
                      onClick={() => router.push("/contact-us?subject=university-request")}
                      className="group inline-flex items-center gap-2 px-6 py-3 bg-gold hover:bg-[#b0852f] text-[#1A153A] font-bold text-sm rounded-xl transition-all duration-200 active:scale-[0.98] whitespace-nowrap"
                    >
                      <span>Request University</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
