"use client";

import { brand as theme } from "@/lib/brand";
import Image from "next/image";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  GraduationCap,
  BookOpen,
  Users,
  Globe,
  Star,
  FileDown,
  Award,
} from "lucide-react";
import { StatBox, SideInfo } from "./common/ui";
import { AboutSection } from "./sections/about-section";
import { AdmissionSection } from "./sections/admission-section";
import { InfrastructureSection } from "./sections/infrastructure-section";
import { FeesSection } from "./sections/fees-section";
import { AcademicSection } from "./sections/academic-section";
import { SupportSection } from "./sections/support-section";
import { RecognitionSection } from "./sections/recognition-section";
import { CoursesSection } from "./sections/courses-section";
import { ApplicationForm } from "./sidebar/application-form";
import type { UniversityDetail } from "@/domains/universities/universities.types";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { RequestBanner } from "@/components/landing/universities/request-banner";

/* ─── Skeleton ─── */
export function Skeleton() {
  return (
    <div className="min-h-screen" style={{ background: theme.canvas }}>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div
          className="mb-10 h-64 animate-pulse rounded-2xl"
          style={{ background: theme.hairline }}
        />
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="h-48 animate-pulse rounded-xl"
                style={{ background: theme.hairline }}
              />
            ))}
          </div>
          <div
            className="h-80 animate-pulse rounded-xl"
            style={{ background: theme.hairline }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── ErrorState ─── */
export function ErrorState({
  error,
  onRetry,
}: {
  error: Error | null;
  onRetry?: () => void;
}) {
  return (
    <div className="min-h-screen" style={{ background: theme.canvas }}>
      <div className="mx-auto flex min-h-[70vh] max-w-6xl flex-col items-center justify-center gap-5 px-4 text-center">
        <div
          className="flex size-16 items-center justify-center rounded-full"
          style={{ background: theme.goldLight }}
        >
          <Star className="size-7" style={{ color: theme.gold }} />
        </div>
        <div>
          <p className="text-lg font-medium" style={{ color: theme.ink }}>
            {error ? "Unable to load university" : "University not found"}
          </p>
          <p className="mt-1 text-sm" style={{ color: theme.inkMuted }}>
            {error
              ? "Please check your connection and try again."
              : "The university you are looking for does not exist or has been removed."}
          </p>
        </div>
        {error && (
          <button
            onClick={onRetry}
            className="inline-flex items-center justify-center px-5 py-2 text-sm font-medium transition-all duration-200"
            style={{
              background: theme.ink,
              color: "#fff",
              borderRadius: theme.btnRadius,
            }}
          >
            Try Again
          </button>
        )}
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-1.5 text-sm font-medium"
          style={{ color: theme.inkMuted }}
        >
          <ArrowLeft className="size-4" /> Go Back
        </button>
      </div>
    </div>
  );
}

/* ─── UniversityContent ─── */
export function UniversityContent({ uni }: { uni: UniversityDetail }) {
  const loc = uni.location;
  const academic = uni.academic;
  const admission = uni.admission;
  const infra = uni.infrastructure;
  const support = uni.support;
  const content = uni.content;
  const courses = uni.courses;
  const recognition = uni.recognition;
  const fees = uni.fees;

  const hasGallery = content?.gallery && content.gallery.length > 0;
  const hasCourses = courses && courses.length > 0;
  const router = useRouter();

  const hasAnyContent =
    academic ||
    admission ||
    infra ||
    support ||
    content?.shortDescription ||
    content?.longDescription ||
    hasGallery ||
    hasCourses ||
    recognition ||
    fees;

  const locationParts = [loc?.city, loc?.state, loc?.country].filter(Boolean);
  const fullAddress = loc?.address || locationParts.join(", ");
  const website = uni.website;

  const handleRequestUniversity = useCallback(
    () => router.push("/contact-us?subject=university-request"),
    [router],
  );

  return (
    <div className="min-h-screen pb-16" style={{ background: theme.canvas }}>
      {/* ── back nav ── */}
      <div className="mx-auto max-w-6xl px-4 pt-4 sm:px-6 lg:px-8">
        <button
          onClick={() => window.history.back()}
          className="group inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
          style={{ color: theme.inkMuted }}
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Universities
        </button>
      </div>

      {/* ── hero ── */}
      <section className="relative mx-auto mt-4 max-w-6xl overflow-hidden px-4 sm:px-6 lg:px-8">
        <div
          className="relative min-h-[300px] w-full overflow-hidden rounded-2xl md:min-h-[380px]"
          style={{
            border: "1px solid " + theme.hairline,
            background: theme.surface,
          }}
        >
          <Image
            src={
              uni.bannerImage ||
              "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&q=85"
            }
            alt={uni.name}
            fill
            className="object-cover"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex items-center gap-3">
              {uni.logo && (
                <Image
                  src={uni.logo}
                  alt=""
                  width={56}
                  height={56}
                  className="size-12 rounded-xl border-2 border-white/30 object-contain bg-white p-1 md:size-14"
                />
              )}
              <div>
                <p
                  className="text-2xl font-bold text-white md:text-3xl lg:text-4xl"
                  style={{ fontFamily: "'Georgia', serif" }}
                >
                  {uni.name}
                </p>
                <p className="mt-0.5 text-sm text-white/70 md:text-base">
                  {[
                    uni.shortName,
                    uni.type.replace(/_/g, " "),
                    uni.establishedYear ? `Est. ${uni.establishedYear}` : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── content grid ── */}
      <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
        {/* ── main ── */}
        <div className="space-y-8 lg:col-span-2">
          {/* quick-stats row */}
          {academic && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {academic.duration && (
                <StatBox
                  icon={<GraduationCap className="size-4" />}
                  label="Duration"
                  value={academic.duration}
                />
              )}
              {academic.medium && (
                <StatBox
                  icon={<BookOpen className="size-4" />}
                  label="Medium"
                  value={academic.medium}
                />
              )}
              {academic.totalSeats && (
                <StatBox
                  icon={<Users className="size-4" />}
                  label="Total Seats"
                  value={String(academic.totalSeats)}
                />
              )}
              {academic.programs?.length > 0 && (
                <StatBox
                  icon={<GraduationCap className="size-4" />}
                  label="Programs"
                  value={String(academic.programs.length)}
                />
              )}
              {recognition?.worldRank && (
                <StatBox
                  icon={<Award className="size-4" />}
                  label="World Rank"
                  value={`#${recognition.worldRank}`}
                />
              )}
              {support?.placementRate && (
                <StatBox
                  icon={<Star className="size-4" />}
                  label="Placement"
                  value={`${support.placementRate}%`}
                />
              )}
              {infra?.hospitalBeds && (
                <StatBox
                  icon={<Star className="size-4" />}
                  label="Hospital Beds"
                  value={String(infra.hospitalBeds)}
                />
              )}
            </div>
          )}

          <AboutSection content={content} uniName={uni.name} />
          <AdmissionSection admission={admission} />
          <InfrastructureSection infra={infra} />
          <FeesSection fees={fees} />
          <AcademicSection academic={academic} />
          <SupportSection support={support} />
          <RecognitionSection recognition={recognition} />
          <CoursesSection courses={courses} />
        </div>

        {/* ── sidebar ── */}
        <aside className="space-y-6">
          {/* CTA */}
          <div
            className="rounded-2xl p-6 text-center"
            style={{
              background: theme.surface,
              border: "1px solid " + theme.hairline,
            }}
          >
            <p
              className="mb-3 text-sm font-medium"
              style={{ color: theme.ink }}
            >
              Ready to apply?
            </p>
            <p className="mb-5 text-xs" style={{ color: theme.inkMuted }}>
              Start your application to {uni.shortName || uni.name}
            </p>
            <ApplicationForm uniName={uni.name} uniId={uni.id} />
            {uni.brochureUrl && (
              <div
                className="mt-4 pt-4"
                style={{ borderTop: "1px solid " + theme.hairline }}
              >
                <button
                  onClick={async () => {
                    try {
                      const { client } = await import("@/shared/api/client");
                      const res = await client.get<{ url: string }>(
                        `/universities/${uni.slug || uni.id}/brochure`,
                      );
                      window.open(res.url, "_blank");
                    } catch {
                      alert("Unable to download brochure");
                    }
                  }}
                  className="group flex w-full items-center justify-center gap-2.5 rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-200 active:scale-[0.97]"
                  style={{
                    background: theme.gold,
                    color: "#fff",
                    borderRadius: theme.btnRadius,
                  }}
                >
                  <FileDown className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
                  Download Brochure (PDF)
                </button>
              </div>
            )}
          </div>

          {/* quick info */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: theme.surface,
              border: "1px solid " + theme.hairline,
            }}
          >
            <h3
              className="mb-4 text-sm font-semibold uppercase tracking-wider"
              style={{ color: theme.inkSubtle }}
            >
              Quick Info
            </h3>
            <div className="space-y-3.5">
              {loc && (
                <SideInfo
                  icon={<MapPin className="size-4" />}
                  label="Location"
                  value={fullAddress}
                />
              )}
              {loc?.address && loc.address !== fullAddress && (
                <SideInfo
                  icon={<MapPin className="size-4" />}
                  label="Address"
                  value={loc.address}
                />
              )}
              {uni.establishedYear && (
                <SideInfo
                  icon={<Calendar className="size-4" />}
                  label="Established"
                  value={String(uni.establishedYear)}
                />
              )}
              {academic?.duration && (
                <SideInfo
                  icon={<GraduationCap className="size-4" />}
                  label="Duration"
                  value={academic.duration}
                />
              )}
              {academic?.medium && (
                <SideInfo
                  icon={<BookOpen className="size-4" />}
                  label="Medium"
                  value={academic.medium}
                />
              )}
              {academic?.totalSeats && (
                <SideInfo
                  icon={<Users className="size-4" />}
                  label="Total Seats"
                  value={String(academic.totalSeats)}
                />
              )}
              {academic && academic.intakeMonths.length > 0 && (
                <SideInfo
                  icon={<Calendar className="size-4" />}
                  label="Intake"
                  value={academic.intakeMonths.join(", ")}
                />
              )}
              {website && (
                <SideInfo
                  icon={<Globe className="size-4" />}
                  label="Website"
                  value={website}
                  link
                />
              )}
            </div>
          </div>

          {/* selection process */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: theme.surface,
              border: "1px solid " + theme.hairline,
            }}
          >
            <h3
              className="mb-4 text-sm font-semibold uppercase tracking-wider"
              style={{ color: theme.inkSubtle }}
            >
              Selection Process
            </h3>
            <div className="space-y-0">
              {[
                "Choose university",
                "Documents upload",
                "Admission letter",
                "Online exam",
                "Admission confirm on successful passing exam",
                "Pay 50% fees",
                "Invitation letter",
                "Visa",
                "Departure",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className="flex size-7 items-center justify-center rounded-full text-xs font-bold"
                      style={{ background: theme.gold, color: "#fff" }}
                    >
                      {i + 1}
                    </div>
                    {i < 8 && (
                      <div
                        className="mt-1 h-full min-h-[24px] w-0.5"
                        style={{ background: theme.hairline }}
                      />
                    )}
                  </div>
                  <div className="pb-4">
                    <p
                      className="text-sm font-medium"
                      style={{ color: theme.ink }}
                    >
                      {step}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* stats */}
          {recognition && (
            <div
              className="rounded-2xl p-6"
              style={{
                background: theme.surface,
                border: "1px solid " + theme.hairline,
              }}
            >
              <h3
                className="mb-4 text-sm font-semibold uppercase tracking-wider"
                style={{ color: theme.inkSubtle }}
              >
                Statistics
              </h3>
              <div className="space-y-2">
                {support?.placementRate && (
                  <div
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm"
                    style={{ background: theme.canvas }}
                  >
                    <span style={{ color: theme.inkMuted }}>
                      Placement Rate
                    </span>
                    <span
                      className="font-semibold"
                      style={{ color: theme.gold }}
                    >
                      {support.placementRate}%
                    </span>
                  </div>
                )}
                {recognition.worldRank && (
                  <div
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm"
                    style={{ background: theme.canvas }}
                  >
                    <span style={{ color: theme.inkMuted }}>World Rank</span>
                    <span
                      className="font-semibold"
                      style={{ color: theme.ink }}
                    >
                      #{recognition.worldRank}
                    </span>
                  </div>
                )}
                {infra?.hospitalBeds && (
                  <div
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm"
                    style={{ background: theme.canvas }}
                  >
                    <span style={{ color: theme.inkMuted }}>Hospital Beds</span>
                    <span
                      className="font-semibold"
                      style={{ color: theme.ink }}
                    >
                      {infra.hospitalBeds}
                    </span>
                  </div>
                )}
                {academic?.totalSeats && (
                  <div
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm"
                    style={{ background: theme.canvas }}
                  >
                    <span style={{ color: theme.inkMuted }}>Total Seats</span>
                    <span
                      className="font-semibold"
                      style={{ color: theme.ink }}
                    >
                      {academic.totalSeats}
                    </span>
                  </div>
                )}
                {admission?.applicationFee != null &&
                  admission.applicationFee > 0 && (
                    <div
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-sm"
                      style={{ background: theme.canvas }}
                    >
                      <span style={{ color: theme.inkMuted }}>
                        Application Fee
                      </span>
                      <span
                        className="font-semibold"
                        style={{ color: theme.ink }}
                      >
                        ₹{admission.applicationFee.toLocaleString()}
                      </span>
                    </div>
                  )}
                {support?.averagePackage != null &&
                  support.averagePackage > 0 && (
                    <div
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-sm"
                      style={{ background: theme.canvas }}
                    >
                      <span style={{ color: theme.inkMuted }}>Avg Package</span>
                      <span
                        className="font-semibold"
                        style={{ color: theme.ink }}
                      >
                        ₹{support.averagePackage.toLocaleString()}
                      </span>
                    </div>
                  )}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* empty state when no content */}
      {!hasAnyContent && (
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
          <div
            className="rounded-2xl p-12 text-center border"
            style={{ background: theme.surface, borderColor: theme.hairline }}
          >
            <div
              className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full"
              style={{ background: theme.goldLight }}
            >
              <Building2 className="size-8" style={{ color: theme.gold }} />
            </div>
            <h3
              className="text-lg font-semibold mb-2"
              style={{ color: theme.ink }}
            >
              Detailed Information Coming Soon
            </h3>
            <p
              className="text-sm max-w-md mx-auto"
              style={{ color: theme.inkMuted }}
            >
              We&apos;re currently updating detailed information about this
              university. Please check back later or contact us for more
              details.
            </p>
            <button
              onClick={() => window.history.back()}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-colors"
              style={{ background: theme.ink, color: "#fff" }}
            >
              <ArrowLeft className="size-4" />
              Back to Universities
            </button>
          </div>
        </div>
      )}
      <RequestBanner onRequestUniversity={handleRequestUniversity} />
    </div>
  );
}
