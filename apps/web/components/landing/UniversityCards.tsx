"use client";

import Image from "next/image";
import { Button } from "@repo/ui";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
import { motion } from "motion/react";

/* ─── brand tokens ─── */
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

/* ─── static seed data fallback ─── */
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
    DEEMED: {
      label: "Deemed",
      style: "bg-amber-50 text-amber-700 ring-amber-200",
    },
    AUTONOMOUS: {
      label: "Autonomous",
      style: "bg-blue-50 text-blue-700 ring-blue-200",
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

function statusIndicator(status: string | null | undefined) {
  if (!status || status === "ACTIVE") return null;
  const isInactive = status === "INACTIVE" || status === "CLOSED";
  return (
    <span
      className={
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium " +
        (isInactive
          ? "bg-red-50 text-red-600 ring-1 ring-inset ring-red-200"
          : "bg-amber-50 text-amber-600 ring-1 ring-inset ring-amber-200")
      }
    >
      {status}
    </span>
  );
}

/* ─── loading skeleton ─── */
function Skeleton() {
  return (
    <section className="py-20" style={{ background: theme.bg }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 flex flex-col items-center gap-4">
          <div
            className="h-4 w-28 animate-pulse rounded-full"
            style={{ background: theme.hairline }}
          />
          <div
            className="h-8 w-80 animate-pulse rounded-lg"
            style={{ background: theme.hairline }}
          />
          <div
            className="h-4 w-96 animate-pulse rounded-md"
            style={{ background: theme.hairline }}
          />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="animate-pulse overflow-hidden rounded-2xl"
              style={{
                background: theme.surface,
                boxShadow: "0 1px 3px rgba(26,21,58,0.06)",
              }}
            >
              <div className="flex flex-col sm:flex-row">
                <div
                  className="h-48 w-full shrink-0 sm:h-auto sm:w-44"
                  style={{ background: theme.hairline }}
                />
                <div className="flex-1 space-y-3 p-5">
                  <div className="h-4 w-3/4 rounded bg-gray-200" />
                  <div className="h-3 w-1/3 rounded bg-gray-100" />
                  <div className="h-3 w-full rounded bg-gray-100" />
                  <div className="h-3 w-2/3 rounded bg-gray-100" />
                  <div className="h-9 w-full rounded-lg bg-gray-100" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── error / empty state ─── */
function ErrorState({
  error,
  onRetry,
}: {
  error: Error | null;
  onRetry: () => void;
}) {
  return (
    <section className="py-20" style={{ background: theme.bg }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[320px] flex-col items-center justify-center gap-5 text-center">
          <div
            className="flex size-16 items-center justify-center rounded-full"
            style={{ background: theme.goldLight }}
          >
            <AlertCircle className="size-7" style={{ color: theme.gold }} />
          </div>
          <div>
            <p className="text-lg font-medium" style={{ color: theme.ink }}>
              {error
                ? "Unable to load universities"
                : "No universities available"}
            </p>
            <p className="mt-1 text-sm" style={{ color: theme.inkMuted }}>
              {error
                ? "Please check your connection and try again."
                : "Check back later for new university listings."}
            </p>
          </div>
          {error && (
            <Button
              onClick={onRetry}
              style={{
                background: theme.ink,
                color: "#fff",
                borderRadius: theme.btnRadius,
                padding: "10px 24px",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Try Again
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─── main component ─── */
export function UniversityCards() {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useUniversities({ limit: 10 });
  const universities = data?.length ? data : seedUniversities;

  if (isLoading) return <Skeleton />;
  if (error && !universities.length)
    return <ErrorState error={error} onRetry={() => refetch()} />;

  return (
    <section className="py-20 md:py-28" style={{ background: theme.bg }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ─── heading ─── */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <div
            className="mb-4 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium tracking-wide uppercase"
            style={{
              background: theme.goldLight,
              color: theme.gold,
              border: "1px solid " + theme.goldBorder,
            }}
          >
            <Star className="size-3" />
            NMC & WHO Recognized
          </div>
          <h2
            className="text-balance text-3xl font-bold leading-tight tracking-tight md:text-4xl"
            style={{ color: theme.ink }}
          >
            Top Medical Universities in Kyrgyzstan
          </h2>
          <p
            className="mt-3 text-balance leading-relaxed"
            style={{ color: theme.inkMuted }}
          >
            Affordable MBBS programs with global recognition, English medium
            instruction, and world-class clinical training approved by NMC, WHO,
            and ECFMG.
          </p>
        </div>

        {/* ─── card grid ─── */}
        <div className="grid gap-6 md:grid-cols-2">
          {universities.map((uni, index) => {
            const typeBadge = universityTypeBadge(uni.type);
            const imageSrc =
              uni.bannerImage || uni.logo || "";
            const hasImage = !!imageSrc;
            return (
              <motion.div
                key={uni.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              >
                <div
                  className="group relative overflow-hidden transition-all duration-300"
                  style={{
                    background: theme.surface,
                    borderRadius: theme.cardRadius,
                    boxShadow:
                      "0 1px 3px rgba(26,21,58,0.06), 0 1px 2px rgba(26,21,58,0.04)",
                  }}
                >
                  {/* hover indicator */}
                  <div
                    className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                    style={{
                      background:
                        "linear-gradient(90deg, " +
                        theme.gold +
                        ", " +
                        theme.gold +
                        "88)",
                    }}
                  />

                  <div className="flex flex-col sm:flex-row">
                    {/* ─── image column ─── */}
                    <div className="relative w-full shrink-0 overflow-hidden sm:w-44 sm:min-h-[260px]">
                      <div className="relative h-48 w-full sm:h-full">
                        {hasImage ? (
                          <Image
                            src={imageSrc}
                            alt={uni.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, 176px"
                          />
                        ) : (
                          <div
                            className="flex h-full w-full flex-col items-center justify-center gap-2"
                            style={{
                              background:
                                "linear-gradient(135deg, " +
                                theme.ink +
                                "08, " +
                                theme.ink +
                                "03)",
                            }}
                          >
                            <Building2
                              className="size-10"
                              style={{ color: theme.inkSubtle }}
                            />
                            <span
                              className="text-xs font-medium"
                              style={{ color: theme.inkMuted }}
                            >
                              {uni.shortName || "University"}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* type badge overlay on image */}
                      <span
                        className={
                          "absolute left-3 top-3 inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium leading-none ring-1 ring-inset " +
                          typeBadge.style
                        }
                      >
                        {typeBadge.label}
                      </span>

                      {/* status badge if not active */}
                      {uni.status && uni.status !== "ACTIVE" && (
                        <span className="absolute right-3 top-3">
                          {statusIndicator(uni.status)}
                        </span>
                      )}
                    </div>

                    {/* ─── content column ─── */}
                    <div className="flex min-w-0 flex-1 flex-col p-5">
                      {/* name row with logo */}
                      <div className="mb-1.5 flex items-start gap-3">
                        {/* small logo thumbnail */}
                        {uni.logo && (
                          <div className="relative mt-0.5 size-8 shrink-0 overflow-hidden rounded-md">
                            <Image
                              src={uni.logo}
                              alt={uni.shortName || uni.name}
                              fill
                              className="object-cover"
                              sizes="32px"
                            />
                          </div>
                        )}
                        <div className="min-w-0">
                          <h3
                            className="text-[15px] font-semibold leading-snug tracking-tight"
                            style={{ color: theme.ink }}
                          >
                            {uni.name}
                          </h3>
                          {uni.shortName && (
                            <span
                              className="text-xs font-medium tracking-wide uppercase"
                              style={{ color: theme.inkSubtle }}
                            >
                              {uni.shortName}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* description */}
                      {uni.content?.shortDescription && (
                        <p
                          className="mt-1.5 line-clamp-2 text-sm leading-relaxed"
                          style={{ color: theme.inkMuted }}
                        >
                          {uni.content.shortDescription}
                        </p>
                      )}

                      {/* tag chips */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span
                          className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[12px] font-medium leading-none"
                          style={{
                            background: "rgba(26,21,58,0.05)",
                            color: theme.inkMuted,
                          }}
                        >
                          <Calendar className="size-3" />
                          {formatEstablished(uni.establishedYear)}
                        </span>
                        <span
                          className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[12px] font-medium leading-none"
                          style={{
                            background: "rgba(26,21,58,0.05)",
                            color: theme.inkMuted,
                          }}
                        >
                          <GraduationCap className="size-3" />
                          {uni.academic?.medium || "N/A"}
                        </span>
                        {uni.location?.city && (
                          <span
                            className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[12px] font-medium leading-none"
                            style={{
                              background: "rgba(26,21,58,0.05)",
                              color: theme.inkMuted,
                            }}
                          >
                            <MapPin className="size-3" />
                            {uni.location.city}
                            {uni.location.state
                              ? ", " + uni.location.state
                              : ""}
                            {", " + uni.location.country}
                          </span>
                        )}
                      </div>

                      {/* recognition / trust badges */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span
                          className="inline-flex items-center gap-1 text-[11px] font-medium"
                          style={{ color: "#059669" }}
                        >
                          <CheckCircle className="size-3" />
                          NMC Approved
                        </span>
                        <span
                          className="inline-flex items-center gap-1 text-[11px] font-medium"
                          style={{ color: "#2563EB" }}
                        >
                          <CheckCircle className="size-3" />
                          WHO Listed
                        </span>
                        <span
                          className="inline-flex items-center gap-1 text-[11px] font-medium"
                          style={{ color: "#7C3AED" }}
                        >
                          <CheckCircle className="size-3" />
                          English Medium
                        </span>
                      </div>

                      {/* contact quick info */}
                      {uni.contact?.email && (
                        <div
                          className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px]"
                          style={{ color: theme.inkSubtle }}
                        >
                          <span className="inline-flex items-center gap-1">
                            <Globe className="size-3" />
                            {uni.contact.email}
                          </span>
                          {uni.contact?.phone && (
                            <span className="inline-flex items-center gap-1">
                              <Phone className="size-3" />
                              {uni.contact.phone}
                            </span>
                          )}
                        </div>
                      )}

                      {/* spacer */}
                      <div className="mt-auto" />

                      {/* divider */}
                      <hr
                        className="my-3 border-0"
                        style={{ height: 1, background: theme.hairline }}
                      />

                      {/* actions */}
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              "/student/university/" + uni.slug + "?apply=true",
                            );
                          }}
                          className="inline-flex flex-1 items-center justify-center gap-1.5 text-sm font-medium transition-all duration-200 active:scale-[0.98]"
                          style={{
                            background:
                              "linear-gradient(135deg, " +
                              theme.gold +
                              ", " +
                              theme.gold +
                              "dd)",
                            color: "#fff",
                            borderRadius: theme.btnRadius,
                            padding: "10px 18px",
                          }}
                        >
                          Apply Now
                          <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push("/student/university/" + uni.slug);
                          }}
                          className="inline-flex flex-1 items-center justify-center gap-1.5 text-sm font-medium transition-all duration-200"
                          style={{
                            background: "transparent",
                            color: theme.ink,
                            borderRadius: theme.btnRadius,
                            padding: "10px 18px",
                            border: "1px solid " + theme.hairline,
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ─── footer CTA ─── */}
        <div className="mt-10 text-center">
          <Button
            onClick={() => router.push("/universities")}
            className="inline-flex items-center gap-2 text-sm font-medium transition-all duration-200"
            style={{
              background: "transparent",
              color: theme.ink,
              borderRadius: theme.btnRadius,
              padding: "12px 28px",
              border: "1px solid " + theme.hairline,
            }}
          >
            View All Universities
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
