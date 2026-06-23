"use client";

import { useState } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useUniversity } from "@/domains/universities/universities.queries";
import {
  useSubmitApplication,
  useCheckApplication,
} from "@/domains/student/student.queries";
import { useAuth } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/api-error";
import type { SubmitApplicationFormData } from "@/domains/student/student.types";
import {
  MapPin,
  GraduationCap,
  Calendar,
  Building2,
  BookOpen,
  ArrowLeft,
  ChevronRight,
  FileDown,
  Loader2,
  Mail,
  Phone,
  Users,
  Globe,
  Clock,
  Award,
  Star,
  BookMarked,
  Hospital,
  Check,
  X,
  Banknote,
  ShieldCheck,
  DollarSign,
  Layers,
  ImageIcon,
} from "lucide-react";
import Image from "next/image";

/* ─── brand tokens ─── */
const theme = {
  canvas: "#FAF9F6",
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

/* ─── helpers ─── */
function typeBadgeStyle(type: string) {
  const map: Record<string, { label: string; cls: string }> = {
    GOVERNMENT: { label: "Government", cls: "bg-emerald-50 text-emerald-700" },
    PRIVATE: { label: "Private", cls: "bg-violet-50 text-violet-700" },
    DEEMED: { label: "Deemed", cls: "bg-amber-50 text-amber-700" },
    AUTONOMOUS: { label: "Autonomous", cls: "bg-teal-50 text-teal-700" },
  };
  return map[type] ?? { label: type, cls: "bg-gray-50 text-gray-600" };
}

function BoolBadge({ value }: { value: boolean }) {
  return value ? (
    <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700">
      <Check className="size-3.5" /> Yes
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-sm font-medium text-rose-500">
      <X className="size-3.5" /> No
    </span>
  );
}

function ChipList({ items, limit }: { items: string[]; limit?: number }) {
  const show = limit ? items.slice(0, limit) : items;
  const remaining = limit ? items.length - limit : 0;
  return (
    <div className="flex flex-wrap gap-2">
      {show.map((item) => (
        <span
          key={item}
          className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium transition-colors"
          style={{
            background: theme.goldLight,
            color: theme.ink,
            border: "1px solid " + theme.goldBorder,
          }}
        >
          {item}
        </span>
      ))}
      {remaining > 0 && (
        <span
          className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium"
          style={{
            color: theme.inkSubtle,
            background: theme.canvas,
            border: "1px solid " + theme.hairline,
          }}
        >
          +{remaining} more
        </span>
      )}
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl px-6 py-7 md:px-8"
      style={{
        background: theme.surface,
        border: "1px solid " + theme.hairline,
        position: "relative",
      }}
    >
      <div
        className="absolute left-0 top-0 h-1 w-16 rounded-tl-2xl"
        style={{ background: theme.gold }}
      />
      <h2 className="mb-5 text-lg font-semibold" style={{ color: theme.ink }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function Skeleton() {
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

function ErrorState({
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

/* ─── page wrapper ─── */
export default function UniversityDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { data: uni, isLoading, error, refetch } = useUniversity(slug);

  if (isLoading) return <Skeleton />;
  if (error || !uni)
    return <ErrorState error={error as Error} onRetry={() => refetch?.()} />;

  return <UniversityContent uni={uni} />;
}

/* ─── mapped helpers ─── */
function mappedLocation(
  uni: NonNullable<ReturnType<typeof useUniversity>["data"]>,
) {
  const loc = uni.location;
  if (!loc) return null;
  return {
    city: loc.city,
    country: loc.country,
    state: loc.state,
    address: loc.address,
  };
}

function mappedAcademic(
  uni: NonNullable<ReturnType<typeof useUniversity>["data"]>,
) {
  return uni.academic;
}

function mappedAdmission(
  uni: NonNullable<ReturnType<typeof useUniversity>["data"]>,
) {
  return uni.admission;
}

function mappedInfra(
  uni: NonNullable<ReturnType<typeof useUniversity>["data"]>,
) {
  return uni.infrastructure;
}

function mappedSupport(
  uni: NonNullable<ReturnType<typeof useUniversity>["data"]>,
) {
  return uni.support;
}

function mappedContent(
  uni: NonNullable<ReturnType<typeof useUniversity>["data"]>,
) {
  return uni.content;
}

function mappedCourses(
  uni: NonNullable<ReturnType<typeof useUniversity>["data"]>,
) {
  return uni.courses;
}

function mappedRecognition(
  uni: NonNullable<ReturnType<typeof useUniversity>["data"]>,
) {
  return uni.recognition;
}

function mappedFees(
  uni: NonNullable<ReturnType<typeof useUniversity>["data"]>,
) {
  return uni.fees;
}

/* ─── main content ─── */
function UniversityContent({
  uni,
}: {
  uni: NonNullable<ReturnType<typeof useUniversity>["data"]>;
}) {
  const loc = mappedLocation(uni);
  const academic = mappedAcademic(uni);
  const admission = mappedAdmission(uni);
  const infra = mappedInfra(uni);
  const support = mappedSupport(uni);
  const content = mappedContent(uni);
  const courses = mappedCourses(uni);
  const recognition = mappedRecognition(uni);
  const fees = mappedFees(uni);

  const hasGallery = content?.gallery && content.gallery.length > 0;
  const hasCourses = courses && courses.length > 0;

  const locationParts = [loc?.city, loc?.state, loc?.country].filter(Boolean);
  const fullAddress = loc?.address || locationParts.join(", ");
  const website = (uni as any).website || (uni as any).detailUrl;

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
          {uni.bannerImage ? (
            <Image
              src={uni.bannerImage}
              alt={uni.name}
              fill
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${theme.ink} 0%, #2D2860 100%)`,
              }}
            >
              <Building2
                className="size-20"
                style={{ color: "rgba(255,255,255,0.15)" }}
              />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          {/* badges */}
          <div className="absolute right-4 top-4 flex flex-wrap gap-2">
            <span
              className="rounded-md px-3 py-1 text-xs font-semibold tracking-wide uppercase"
              style={{
                background: typeBadgeStyle(uni.type).cls.split(" ")[0],
                color:
                  typeBadgeStyle(uni.type)
                    .cls.split(" ")[1]
                    .replace("text-", "#") || "#fff",
              }}
            >
              {typeBadgeStyle(uni.type).label}
            </span>
            {uni.status === "ACTIVE" && (
              <span className="rounded-md bg-emerald-500/20 px-3 py-1 text-xs font-semibold tracking-wide uppercase text-emerald-200">
                Active
              </span>
            )}
            {uni.establishedYear && (
              <span className="rounded-md bg-white/15 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
                Est. {uni.establishedYear}
              </span>
            )}
          </div>
          {/* text overlay */}
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
                  {uni.shortName} &middot; {uni.type.replace(/_/g, " ")}
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
              {uni.establishedYear && (
                <StatBox
                  icon={<Calendar className="size-4" />}
                  label="Founded"
                  value={String(uni.establishedYear)}
                />
              )}
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
              {academic.programs && academic.programs.length > 0 && (
                <StatBox
                  icon={<BookMarked className="size-4" />}
                  label="Programs"
                  value={String(academic.programs.length)}
                />
              )}
              {recognition?.worldRank ? (
                <StatBox
                  icon={<Award className="size-4" />}
                  label="World Rank"
                  value={`#${recognition.worldRank}`}
                />
              ) : null}
              {support?.placementRate ? (
                <StatBox
                  icon={<Star className="size-4" />}
                  label="Placement"
                  value={`${support.placementRate}%`}
                />
              ) : null}
              {infra?.hospitalBeds ? (
                <StatBox
                  icon={<Hospital className="size-4" />}
                  label="Hospital Beds"
                  value={String(infra.hospitalBeds)}
                />
              ) : null}
            </div>
          )}

          {/* ── About / Gallery ── */}
          {(content?.shortDescription || content?.longDescription || hasGallery) && (
            <SectionCard title="About & Gallery">
              {content?.shortDescription && (
                <p
                  className="mb-4 text-sm leading-relaxed"
                  style={{ color: theme.inkMuted }}
                >
                  {content.shortDescription}
                </p>
              )}
              {content?.longDescription && (
                <div
                  className="mb-6 text-sm leading-relaxed whitespace-pre-wrap"
                  style={{ color: theme.inkMuted }}
                >
                  {content.longDescription}
                </div>
              )}
              {hasGallery && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {content!.gallery
                    .slice(0, 6)
                    .map((img: string, i: number) => (
                      <div
                        key={i}
                        className="group relative aspect-[4/3] overflow-hidden rounded-xl"
                        style={{ border: "1px solid " + theme.hairline }}
                      >
                        <Image
                          src={img}
                          alt={`${uni.name} gallery ${i + 1}`}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, 25vw"
                        />
                      </div>
                    ))}
                  {content!.gallery.length > 6 && (
                    <div
                      className="flex aspect-[4/3] items-center justify-center rounded-xl"
                      style={{
                        background: theme.goldLight,
                        border: "1px solid " + theme.goldBorder,
                      }}
                    >
                      <p
                        className="text-sm font-medium"
                        style={{ color: theme.gold }}
                      >
                        +{content!.gallery.length - 6} more
                      </p>
                    </div>
                  )}
                </div>
              )}
            </SectionCard>
          )}

          {/* ── Admission Details ── */}
          {admission && (
            <SectionCard title="Admission Details">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <InfoField label="Eligibility" value={admission.eligibility} />
                <InfoField
                  label="Minimum Marks"
                  value={admission.minimumMarks}
                />
                <InfoField label="Age Criteria" value={admission.ageCriteria} />
                {/* Selection Process - Show as timeline if it has steps */}
                {(() => {
                  const selectionSteps = admission.selectionProcess?.split("→").map((s: string) => s.trim()).filter(Boolean) || [];
                  const hasSelectionSteps = selectionSteps.length > 1;
                  return hasSelectionSteps ? (
                    <div className="sm:col-span-2">
                      <p
                        className="mb-3 text-xs font-medium uppercase tracking-wider"
                        style={{ color: theme.inkSubtle }}
                      >
                        Selection Process
                      </p>
                      <div className="space-y-0">
                        {selectionSteps.map((step: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className="flex flex-col items-center">
                              <div
                                className="flex size-7 items-center justify-center rounded-full text-xs font-bold"
                                style={{
                                  background: theme.gold,
                                  color: "#fff",
                                }}
                              >
                                {idx + 1}
                              </div>
                              {idx < selectionSteps.length - 1 && (
                                <div
                                  className="mt-1 h-full min-h-[24px] w-0.5"
                                  style={{ background: theme.hairline }}
                                />
                              )}
                            </div>
                            <div className="pb-4">
                              <p className="text-sm font-medium" style={{ color: theme.ink }}>
                                {step}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <InfoField
                      label="Selection Process"
                      value={admission.selectionProcess}
                    />
                  );
                })()}
                {admission.applicationFee != null && admission.applicationFee > 0 ? (
                  <InfoField
                    label="Application Fee"
                    value={`₹${admission.applicationFee.toLocaleString()}`}
                  />
                ) : admission.applicationFee === 0 ? (
                  <InfoField
                    label="Application Fee"
                    value="Free"
                  />
                ) : null}
                {admission.applicationDeadline && (
                  <InfoField
                    label="Deadline"
                    value={new Date(
                      admission.applicationDeadline,
                    ).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  />
                )}
                {admission.entranceExams &&
                  admission.entranceExams.length > 0 && (
                    <div className="sm:col-span-2">
                      <p
                        className="mb-2 text-xs font-medium uppercase tracking-wider"
                        style={{ color: theme.inkSubtle }}
                      >
                        Entrance Exams
                      </p>
                      <ChipList items={admission.entranceExams} />
                    </div>
                  )}
                {admission.requiredDocuments &&
                  admission.requiredDocuments.length > 0 && (
                    <div className="sm:col-span-2">
                      <p
                        className="mb-2 text-xs font-medium uppercase tracking-wider"
                        style={{ color: theme.inkSubtle }}
                      >
                        Required Documents
                      </p>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {admission.requiredDocuments.map((doc: string, i: number) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
                            style={{
                              background: theme.canvas,
                              border: "1px solid " + theme.hairline,
                            }}
                          >
                            <Check className="size-4 shrink-0" style={{ color: theme.gold }} />
                            <span style={{ color: theme.inkMuted }}>{doc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </SectionCard>
          )}

          {/* ── Infrastructure & Facilities ── */}
          {infra && (
            <SectionCard title="Infrastructure & Facilities">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {infra.hospitalBeds != null && (
                  <InfraStat
                    icon={<Hospital />}
                    label="Hospital Beds"
                    value={String(infra.hospitalBeds)}
                  />
                )}
                {infra.departments?.length > 0 && (
                  <InfraStat
                    icon={<Layers />}
                    label="Departments"
                    value={infra.departments.join(", ")}
                  />
                )}
                {infra.laboratories?.length > 0 && (
                  <InfraStat
                    icon={<BookMarked />}
                    label="Labs"
                    value={infra.laboratories.join(", ")}
                  />
                )}
                {infra.campusArea != null && (
                  <InfraStat
                    icon={<Building2 />}
                    label="Campus Area"
                    value={`${infra.campusArea} acres`}
                  />
                )}
                {infra.hostelBoys != null && (
                  <InfraStat
                    icon={<Users />}
                    label="Boys Hostel"
                    value={String(infra.hostelBoys)}
                  />
                )}
                {infra.hostelGirls != null && (
                  <InfraStat
                    icon={<Users />}
                    label="Girls Hostel"
                    value={String(infra.hostelGirls)}
                  />
                )}
              </div>
              
              {/* Departments */}
              {infra.departments && infra.departments.length > 0 && (
                <div className="mt-5">
                  <p
                    className="mb-2 text-xs font-medium uppercase tracking-wider"
                    style={{ color: theme.inkSubtle }}
                  >
                    Departments
                  </p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {infra.departments.map((dept: string, i: number) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
                        style={{
                          background: theme.canvas,
                          border: "1px solid " + theme.hairline,
                        }}
                      >
                        <Layers className="size-4 shrink-0" style={{ color: theme.gold }} />
                        <span style={{ color: theme.inkMuted }}>{dept}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Laboratories */}
              {infra.laboratories && infra.laboratories.length > 0 && (
                <div className="mt-5">
                  <p
                    className="mb-2 text-xs font-medium uppercase tracking-wider"
                    style={{ color: theme.inkSubtle }}
                  >
                    Laboratories
                  </p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {infra.laboratories.map((lab: string, i: number) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
                        style={{
                          background: theme.canvas,
                          border: "1px solid " + theme.hairline,
                        }}
                      >
                        <BookMarked className="size-4 shrink-0" style={{ color: theme.gold }} />
                        <span style={{ color: theme.inkMuted }}>{lab}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* boolean facilities */}
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {infra.cafeteria != null && (
                  <BoolRow label="Cafeteria" value={infra.cafeteria} />
                )}
                {infra.wifiCampus != null && (
                  <BoolRow label="WiFi Campus" value={infra.wifiCampus} />
                )}
                {infra.transportation != null && (
                  <BoolRow
                    label="Transportation"
                    value={infra.transportation}
                  />
                )}
                {infra.facilities?.includes("Library") && (
                  <BoolRow label="Library" value={true} />
                )}
              </div>
              {infra.facilities && infra.facilities.length > 0 && (
                <div className="mt-5">
                  <p
                    className="mb-2 text-xs font-medium uppercase tracking-wider"
                    style={{ color: theme.inkSubtle }}
                  >
                    Other Facilities
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {infra.facilities.map((facility: string, i: number) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium"
                        style={{
                          background: theme.goldLight,
                          color: theme.ink,
                          border: "1px solid " + theme.goldBorder,
                        }}
                      >
                        <Check className="size-3" style={{ color: theme.gold }} />
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </SectionCard>
          )}

          {/* ── Fees ── */}
          {fees && (
            <SectionCard title="Fees & Financials">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {fees.tuitionAnnual != null && (
                  <FeeBox
                    label="Tuition Fee"
                    value={`${fees.currency} ${fees.tuitionAnnual.toLocaleString()}`}
                    sub="/year"
                  />
                )}
                {fees.hostelAnnual != null && (
                  <FeeBox
                    label="Hostel Fee"
                    value={`${fees.currency} ${fees.hostelAnnual.toLocaleString()}`}
                    sub="/year"
                  />
                )}
                {fees.totalProgram != null && (
                  <FeeBox
                    label="Total Program Fee"
                    value={`${fees.currency} ${fees.totalProgram.toLocaleString()}`}
                    sub="Approx"
                    highlight
                  />
                )}
                {fees.registration != null && (
                  <FeeBox
                    label="Registration Fee"
                    value={`${fees.currency} ${fees.registration.toLocaleString()}`}
                  />
                )}
                {fees.otherFees != null &&
                  typeof fees.otherFees === "object" && (
                    <div className="sm:col-span-2 lg:col-span-3">
                      <p
                        className="mb-2 text-xs font-medium uppercase tracking-wider"
                        style={{ color: theme.inkSubtle }}
                      >
                        Other Fees
                      </p>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {Object.entries(fees.otherFees).map(([key, val]) => (
                          <div
                            key={key}
                            className="rounded-lg px-3 py-2 text-sm"
                            style={{
                              background: theme.canvas,
                              border: "1px solid " + theme.hairline,
                            }}
                          >
                            <span style={{ color: theme.inkSubtle }}>
                              {key.replace(/([A-Z])/g, " $1").trim()}:
                            </span>
                            <span
                              className="ml-1 font-medium"
                              style={{ color: theme.ink }}
                            >
                              {String(val)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                {fees.paymentSchedule && (
                  <InfoField label="Payment Schedule" value={fees.paymentSchedule} />
                )}
                {fees.scholarshipAvailable != null && (
                  <BoolRow
                    label="Scholarship Available"
                    value={fees.scholarshipAvailable}
                  />
                )}
                {fees.refundPolicy && (
                  <div className="sm:col-span-2 lg:col-span-3">
                    <InfoField
                      label="Refund Policy"
                      value={fees.refundPolicy}
                    />
                  </div>
                )}
              </div>
            </SectionCard>
          )}

          {/* ── Academic Programs ── */}
          {academic &&
            (academic.programs?.length || academic.specializations?.length) && (
              <SectionCard title="Academic Programs">
                <div className="grid gap-6 sm:grid-cols-2">
                  {academic.programs && academic.programs.length > 0 && (
                    <div>
                      <p
                        className="mb-2 text-xs font-medium uppercase tracking-wider"
                        style={{ color: theme.inkSubtle }}
                      >
                        Programs Offered
                      </p>
                      <ul className="space-y-1.5">
                        {academic.programs.map((p: any) => (
                          <li
                            key={typeof p === "string" ? p : p.name}
                            className="flex items-center gap-2 text-sm"
                            style={{ color: theme.inkMuted }}
                          >
                            <ChevronRight
                              className="size-3.5 shrink-0"
                              style={{ color: theme.gold }}
                            />
                            {typeof p === "string" ? p : p.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {academic.specializations &&
                    academic.specializations.length > 0 && (
                      <div>
                        <p
                          className="mb-2 text-xs font-medium uppercase tracking-wider"
                          style={{ color: theme.inkSubtle }}
                        >
                          Specializations
                        </p>
                        <ChipList items={academic.specializations} />
                      </div>
                    )}
                  {academic.intakeMonths &&
                    academic.intakeMonths.length > 0 && (
                      <div>
                        <p
                          className="mb-2 text-xs font-medium uppercase tracking-wider"
                          style={{ color: theme.inkSubtle }}
                        >
                          Intake Months
                        </p>
                        <ChipList items={academic.intakeMonths} />
                      </div>
                    )}
                  {/* seat breakdown */}
                  {(academic.governmentSeats ||
                    academic.managementSeats ||
                    academic.nriSeats) && (
                    <div className="sm:col-span-2">
                      <p
                        className="mb-3 text-xs font-medium uppercase tracking-wider"
                        style={{ color: theme.inkSubtle }}
                      >
                        Seat Distribution
                      </p>
                      <div className="grid grid-cols-3 gap-3">
                        {academic.governmentSeats != null && (
                          <SeatBox
                            label="Government"
                            value={academic.governmentSeats}
                            total={academic.totalSeats}
                          />
                        )}
                        {academic.managementSeats != null && (
                          <SeatBox
                            label="Management"
                            value={academic.managementSeats}
                            total={academic.totalSeats}
                          />
                        )}
                        {academic.nriSeats != null && (
                          <SeatBox
                            label="NRI"
                            value={academic.nriSeats}
                            total={academic.totalSeats}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </SectionCard>
            )}

          {/* ── Support & Career ── */}
          {support && (
            <SectionCard title="Support & Career">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {support.placementRate != null && (
                  <div
                    className="rounded-xl px-5 py-4 text-center"
                    style={{
                      background: theme.goldLight,
                      border: "1px solid " + theme.goldBorder,
                    }}
                  >
                    <p
                      className="text-3xl font-bold"
                      style={{ color: theme.gold }}
                    >
                      {support.placementRate}%
                    </p>
                    <p
                      className="mt-1 text-xs font-medium uppercase tracking-wider"
                      style={{ color: theme.inkMuted }}
                    >
                      Placement Rate
                    </p>
                  </div>
                )}
                {support.averagePackage != null && (
                  <div
                    className="rounded-xl px-5 py-4 text-center"
                    style={{
                      background: theme.goldLight,
                      border: "1px solid " + theme.goldBorder,
                    }}
                  >
                    <p
                      className="text-3xl font-bold"
                      style={{ color: theme.gold }}
                    >
                      ₹{support.averagePackage.toLocaleString()}
                    </p>
                    <p
                      className="mt-1 text-xs font-medium uppercase tracking-wider"
                      style={{ color: theme.inkMuted }}
                    >
                      Avg Package
                    </p>
                  </div>
                )}
                <div className="sm:col-span-2 space-y-3">
                  {support.visaAssistance != null && (
                    <BoolRow
                      label="Visa Assistance"
                      value={support.visaAssistance}
                    />
                  )}
                  {support.counselingServices != null && (
                    <BoolRow
                      label="Counseling Services"
                      value={support.counselingServices}
                    />
                  )}
                  {support.careerGuidance != null && (
                    <BoolRow
                      label="Career Guidance"
                      value={support.careerGuidance}
                    />
                  )}
                  {support.languageSupport &&
                    support.languageSupport.length > 0 && (
                      <div className="pt-2">
                        <p
                          className="mb-2 text-xs font-medium uppercase tracking-wider"
                          style={{ color: theme.inkSubtle }}
                        >
                          Language Support
                        </p>
                        <ChipList items={support.languageSupport} />
                      </div>
                    )}
                </div>
              </div>
            </SectionCard>
          )}

          {/* ── Recognition & Accreditation ── */}
          {recognition && (
            <SectionCard title="Recognition & Accreditation">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  {recognition.bodies?.includes("NMC") && <RecogBadge label="NMC Approved" value={true} />}
                  {recognition.bodies?.includes("WHO") && <RecogBadge label="WHO Recognized" value={true} />}
                  <RecogBadge label={`ECFMG ${recognition.ecfmgStatus}`} value={recognition.ecfmgStatus === "APPROVED"} />
                  {recognition.nbaAccredited && <RecogBadge label="NBA Accredited" value={true} />}
                </div>
                {recognition.accreditations &&
                  recognition.accreditations.length > 0 && (
                    <div>
                      <p
                        className="mb-2 text-xs font-medium uppercase tracking-wider"
                        style={{ color: theme.inkSubtle }}
                      >
                        Accreditations
                      </p>
                      <ChipList items={recognition.accreditations} />
                    </div>
                  )}
                {recognition.nationalRank != null && (
                  <div
                    className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm"
                    style={{
                      background: theme.canvas,
                      border: "1px solid " + theme.hairline,
                    }}
                  >
                    <Award className="size-5" style={{ color: theme.gold }} />
                    <span style={{ color: theme.ink }}>
                      Country Rank: <b>#{recognition.nationalRank}</b>
                    </span>
                    {recognition.worldRank != null && (
                      <span style={{ color: theme.inkSubtle }}>
                        {" "}
                        &middot; World Rank: <b>#{recognition.worldRank}</b>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </SectionCard>
          )}

          {/* ── Courses ── */}
          {hasCourses && (
            <SectionCard title="Courses Offered">
              <div
                className="overflow-x-auto rounded-xl"
                style={{ border: "1px solid " + theme.hairline }}
              >
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr style={{ background: theme.canvas }}>
                      <th
                        className="px-4 py-3 font-semibold"
                        style={{
                          color: theme.ink,
                          borderBottom: "1px solid " + theme.hairline,
                        }}
                      >
                        Course
                      </th>
                      <th
                        className="px-4 py-3 font-semibold"
                        style={{
                          color: theme.ink,
                          borderBottom: "1px solid " + theme.hairline,
                        }}
                      >
                        Duration
                      </th>
                      <th
                        className="px-4 py-3 font-semibold"
                        style={{
                          color: theme.ink,
                          borderBottom: "1px solid " + theme.hairline,
                        }}
                      >
                        Fees
                      </th>
                      <th
                        className="px-4 py-3 font-semibold"
                        style={{
                          color: theme.ink,
                          borderBottom: "1px solid " + theme.hairline,
                        }}
                      >
                        Seats
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((c: any, i: number) => (
                      <tr
                        key={c.id || i}
                        style={{
                          borderBottom:
                            i < courses.length - 1
                              ? "1px solid " + theme.hairline
                              : "none",
                        }}
                      >
                        <td
                          className="px-4 py-3 font-medium"
                          style={{ color: theme.ink }}
                        >
                          {c.name || c.courseName}
                        </td>
                        <td
                          className="px-4 py-3"
                          style={{ color: theme.inkMuted }}
                        >
                          {c.duration || c.courseDuration || "-"}
                        </td>
                        <td
                          className="px-4 py-3"
                          style={{ color: theme.inkMuted }}
                        >
                          {c.fees != null
                            ? `₹${(typeof c.fees === "number" ? c.fees : Number(c.fees)).toLocaleString()}`
                            : c.courseFee
                              ? `₹${Number(c.courseFee).toLocaleString()}`
                              : "-"}
                        </td>
                        <td
                          className="px-4 py-3"
                          style={{ color: theme.inkMuted }}
                        >
                          {c.totalSeats || c.seats || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          )}
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
                      const res = await client.get<{ url: string }>(`/universities/${uni.slug || uni.id}/brochure`);
                      window.open(res.url, "_blank");
                    } catch { alert("Unable to download brochure"); }
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
              {academic?.intakeMonths && academic.intakeMonths.length > 0 && (
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

          {/* contact */}
          {uni.contact && (
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
                Contact
              </h3>
              <div className="space-y-3.5">
                {uni.contact.email && (
                  <SideInfo
                    icon={<Mail className="size-4" />}
                    label="Email"
                    value={uni.contact.email}
                    link
                  />
                )}
                {uni.contact.phone && (
                  <SideInfo
                    icon={<Phone className="size-4" />}
                    label="Phone"
                    value={uni.contact.phone}
                  />
                )}
                {uni.contact.admissionOfficeHours && (
                  <SideInfo
                    icon={<Clock className="size-4" />}
                    label="Office Hours"
                    value={uni.contact.admissionOfficeHours}
                  />
                )}
              </div>
            </div>
          )}

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
                {admission?.applicationFee != null && (
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
                {support?.averagePackage != null && (
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
    </div>
  );
}

/* ─── helper components ─── */
function StatBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      className="rounded-xl px-4 py-3.5 text-center transition-all duration-200"
      style={{
        background: theme.surface,
        border: "1px solid " + theme.hairline,
      }}
    >
      <div
        className="mx-auto mb-1.5 flex items-center justify-center"
        style={{ color: theme.gold }}
      >
        {icon}
      </div>
      <p
        className="text-lg font-semibold leading-tight"
        style={{ color: theme.ink }}
      >
        {value}
      </p>
      <p className="mt-0.5 text-xs" style={{ color: theme.inkSubtle }}>
        {label}
      </p>
    </div>
  );
}

function InfoField({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p
        className="mb-1 text-xs font-medium uppercase tracking-wider"
        style={{ color: theme.inkSubtle }}
      >
        {label}
      </p>
      <p className="text-sm leading-relaxed" style={{ color: theme.ink }}>
        {value}
      </p>
    </div>
  );
}

function InfraStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      className="rounded-xl px-3 py-3 text-center"
      style={{
        background: theme.canvas,
        border: "1px solid " + theme.hairline,
      }}
    >
      <div
        className="mx-auto mb-1 flex items-center justify-center"
        style={{ color: theme.gold }}
      >
        {icon}
      </div>
      <p className="text-base font-semibold" style={{ color: theme.ink }}>
        {value}
      </p>
      <p className="text-xs" style={{ color: theme.inkSubtle }}>
        {label}
      </p>
    </div>
  );
}

function BoolRow({ label, value }: { label: string; value: boolean }) {
  return (
    <div
      className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm"
      style={{
        background: theme.canvas,
        border: "1px solid " + theme.hairline,
      }}
    >
      <span style={{ color: theme.ink }}>{label}</span>
      <BoolBadge value={value} />
    </div>
  );
}

function FeeBox({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className="rounded-xl px-4 py-4"
      style={{
        background: highlight ? theme.goldLight : theme.canvas,
        border: "1px solid " + (highlight ? theme.goldBorder : theme.hairline),
      }}
    >
      <p
        className="text-xs font-medium uppercase tracking-wider"
        style={{ color: theme.inkSubtle }}
      >
        {label}
      </p>
      <p
        className="mt-1 text-xl font-bold"
        style={{ color: highlight ? theme.gold : theme.ink }}
      >
        {value}
      </p>
      {sub && (
        <p className="text-xs" style={{ color: theme.inkSubtle }}>
          {sub}
        </p>
      )}
    </div>
  );
}

function SideInfo({
  icon,
  label,
  value,
  link,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  link?: boolean;
}) {
  return (
    <div className="flex items-start gap-2.5 text-sm">
      <span className="mt-0.5 shrink-0" style={{ color: theme.gold }}>
        {icon}
      </span>
      <div className="min-w-0">
        <p
          className="text-xs font-medium uppercase tracking-wider"
          style={{ color: theme.inkSubtle }}
        >
          {label}
        </p>
        {link ? (
          <a
            href={value.startsWith("http") ? value : `https://${value}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 truncate font-medium underline-offset-2 hover:underline"
            style={{ color: theme.ink }}
          >
            {value}
            <Globe className="size-3 shrink-0" style={{ color: theme.gold }} />
          </a>
        ) : (
          <p className="truncate font-medium" style={{ color: theme.ink }}>
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

function RecogBadge({ label, value }: { label: string; value: boolean }) {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium"
      style={{
        background: value
          ? "rgba(16, 185, 129, 0.08)"
          : "rgba(239, 68, 68, 0.06)",
        border:
          "1px solid " +
          (value ? "rgba(16, 185, 129, 0.20)" : "rgba(239, 68, 68, 0.12)"),
        color: value ? "#065F46" : "#991B1B",
      }}
    >
      <ShieldCheck className="size-4" />
      {label}
      <span className={value ? "text-emerald-600" : "text-rose-500"}>
        {value ? "✓" : "✗"}
      </span>
    </div>
  );
}

function SeatBox({
  label,
  value,
  total,
}: {
  label: string;
  value: number;
  total?: number | null;
}) {
  const pct = total && total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div
      className="rounded-xl px-4 py-3 text-center"
      style={{
        background: theme.surface,
        border: "1px solid " + theme.hairline,
      }}
    >
      <p className="text-lg font-bold" style={{ color: theme.ink }}>
        {value}
      </p>
      <p className="text-xs font-medium" style={{ color: theme.inkSubtle }}>
        {label}
      </p>
      {pct > 0 && (
        <div
          className="mt-2 h-1.5 w-full overflow-hidden rounded-full"
          style={{ background: theme.hairline }}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${pct}%`, background: theme.gold }}
          />
        </div>
      )}
    </div>
  );
}

/* ─── application form ─── */
function ApplicationForm({
  uniName,
  uniId,
}: {
  uniName: string;
  uniId: string;
}) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const submit = useSubmitApplication();
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isStudent } = useAuth();

  // Check if student already applied to this university
  const {
    data: checkResult,
    isLoading: isCheckLoading,
    isError: isCheckError,
  } = useCheckApplication(isAuthenticated && isStudent ? uniId : "");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const required = [
      "firstName",
      "lastName",
      "email",
      "dateOfBirth",
      "citizenship",
      "gender",
      "maritalStatus",
      "selectedProgram",
      "embassyLocation",
      "signature",
      "birthCity",
      "birthState",
      "birthCountry",
      "lang1Name",
      "permanentAddress",
      "permanentCity",
      "permanentState",
      "permanentZip",
      "permanentCountry",
    ];
    const newErrors: Record<string, string> = {};
    for (const field of required) {
      if (!formData[field]?.trim()) newErrors[field] = "Required";
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const today = new Date().toISOString().split("T")[0];
    const payload: SubmitApplicationFormData = {
      universityId: uniId,
      firstName: formData.firstName || "",
      lastName: formData.lastName || "",
      email: formData.email || "",
      dateOfBirth: formData.dateOfBirth || "",
      citizenship: formData.citizenship || "",
      gender: formData.gender as "male" | "female" | "other",
      maritalStatus: formData.maritalStatus as "single" | "married",
      selectedProgram: formData.selectedProgram as
        | "pre-medical"
        | "general-medicine"
        | "dentistry"
        | "post-graduate",
      permanentAddress: formData.permanentAddress || "",
      permanentCity: formData.permanentCity || "",
      permanentState: formData.permanentState || "",
      permanentZip: formData.permanentZip || "",
      permanentCountry: formData.permanentCountry || "",
      embassyLocation: formData.embassyLocation || "",
      signature: formData.signature || "",
      signatureDate: formData.signatureDate || today,
      placeOfBirth: {
        city: formData.birthCity || "",
        state: formData.birthState || "",
        country: formData.birthCountry || "",
      },
      language1: {
        name: formData.lang1Name || "",
        speaking: (formData.lang1Speaking || "moderate") as
          | "high"
          | "moderate"
          | "low",
        reading: (formData.lang1Reading || "moderate") as
          | "high"
          | "moderate"
          | "low",
        writing: (formData.lang1Writing || "moderate") as
          | "high"
          | "moderate"
          | "low",
      },
      postGraduateDetail:
        formData.selectedProgram === "post-graduate"
          ? formData.postGraduateDetail || ""
          : undefined,
    };
    try {
      await submit.mutateAsync(payload);
      router.push("/student/dashboard");
    } catch (err) {
      setErrors({
        _form: getApiErrorMessage(
          err,
          "Something went wrong. Please check your details and try again.",
        ),
      });
    }
  }

  // ── Not authenticated → prompt to login ──
  if (!isAuthenticated) {
    return (
      <Link
        href={`/login?redirectUrl=${encodeURIComponent(pathname)}`}
        className="inline-flex w-full items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold transition-all duration-200"
        style={{
          background: theme.gold,
          color: "#fff",
          borderRadius: theme.btnRadius,
        }}
      >
        Login to Apply
      </Link>
    );
  }

  // ── Authenticated but not a student ──
  if (!isStudent) {
    return (
      <div
        className="rounded-lg px-4 py-3 text-sm text-center"
        style={{
          background: "rgba(196, 149, 59, 0.08)",
          border: "1px solid rgba(196, 149, 59, 0.2)",
          color: theme.inkMuted,
        }}
      >
        Only students can apply for admission.
      </div>
    );
  }

  // ── Loading check application status ──
  if (isCheckLoading) {
    return (
      <div className="flex items-center justify-center py-3">
        <Loader2
          className="size-5 animate-spin"
          style={{ color: theme.gold }}
        />
      </div>
    );
  }

  // ── Already applied → show status card ──
  if (!isCheckError && checkResult?.applied && checkResult.application) {
    const app = checkResult.application;
    const statusColors: Record<string, string> = {
      pending: "#CA8A04",
      in_review: "#2563EB",
      approved: "#16A34A",
      rejected: "#DC2626",
    };
    const statusColor = statusColors[app.status] || theme.inkMuted;

    return (
      <div
        className="rounded-xl px-4 py-4 text-left"
        style={{
          background: theme.canvas,
          border: "1px solid " + theme.hairline,
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Check className="size-4" style={{ color: "#16A34A" }} />
          <p className="text-sm font-semibold" style={{ color: theme.ink }}>
            Already Applied
          </p>
        </div>
        <p className="text-xs mb-1" style={{ color: theme.inkMuted }}>
          Program: {app.selectedProgram}
        </p>
        <p className="text-xs mb-3" style={{ color: theme.inkMuted }}>
          Status:{" "}
          <span className="font-medium" style={{ color: statusColor }}>
            {app.status
              .replace(/_/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase())}
          </span>
        </p>
        <Link
          href={`/student/applications/${app.id}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200"
          style={{
            background: theme.ink,
            color: "#fff",
            borderRadius: theme.btnRadius,
          }}
        >
          View Application
          <ChevronRight className="size-3.5" />
        </Link>
      </div>
    );
  }

  // ── Authenticated student, not applied (or check failed) → show form ──
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex w-full items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold transition-all duration-200"
        style={{
          background: open ? theme.canvas : theme.gold,
          color: open ? theme.ink : "#fff",
          borderRadius: theme.btnRadius,
          border: "1px solid " + (open ? theme.hairline : theme.gold),
        }}
      >
        {open ? "Cancel" : "Apply Now"}
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-left">
          {errors._form && (
            <div
              className="flex items-start gap-2 rounded-lg px-4 py-3 text-sm text-red-700"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
              }}
            >
              <X className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{errors._form}</span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3">
            <FormField
              label="First Name *"
              name="firstName"
              value={formData.firstName || ""}
              onChange={handleChange}
              error={errors.firstName}
            />
            <FormField
              label="Last Name *"
              name="lastName"
              value={formData.lastName || ""}
              onChange={handleChange}
              error={errors.lastName}
            />
          </div>

          <div className="grid grid-cols-1 gap-3">
            <FormField
              label="Email *"
              name="email"
              type="email"
              value={formData.email || ""}
              onChange={handleChange}
              error={errors.email}
            />
            <FormField
              label="Phone *"
              name="phone"
              type="tel"
              value={formData.phone || ""}
              onChange={handleChange}
              error={errors.phone}
            />
          </div>

          <div className="grid grid-cols-1 gap-3">
            <FormField
              label="Date of Birth *"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth || ""}
              onChange={handleChange}
              error={errors.dateOfBirth}
            />
            <SelectField
              label="Gender *"
              name="gender"
              value={formData.gender || ""}
              onChange={handleChange}
              error={errors.gender}
              options={[
                { value: "", label: "Select gender" },
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "other", label: "Other" },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 gap-3">
            <FormField
              label="Citizenship *"
              name="citizenship"
              value={formData.citizenship || ""}
              onChange={handleChange}
              error={errors.citizenship}
              placeholder="e.g. Indian"
            />
            <SelectField
              label="Marital Status *"
              name="maritalStatus"
              value={formData.maritalStatus || ""}
              onChange={handleChange}
              error={errors.maritalStatus}
              options={[
                { value: "", label: "Select status" },
                { value: "single", label: "Single" },
                { value: "married", label: "Married" },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 gap-3">
            <SelectField
              label="Selected Program *"
              name="selectedProgram"
              value={formData.selectedProgram || ""}
              onChange={handleChange}
              error={errors.selectedProgram}
              options={[
                { value: "", label: "Select program" },
                { value: "pre-medical", label: "Pre-Medical" },
                { value: "general-medicine", label: "General Medicine" },
                { value: "dentistry", label: "Dentistry" },
                { value: "post-graduate", label: "Post Graduate" },
              ]}
            />
            <FormField
              label="Embassy Location *"
              name="embassyLocation"
              value={formData.embassyLocation || ""}
              onChange={handleChange}
              error={errors.embassyLocation}
              placeholder="e.g. New Delhi"
            />
          </div>

          {formData.selectedProgram === "post-graduate" && (
            <FormField
              label="Post Graduate Details (Specialization/Experience)"
              name="postGraduateDetail"
              value={formData.postGraduateDetail || ""}
              onChange={handleChange}
              placeholder="e.g. Completed residency in internal medicine, 2 years clinical experience"
            />
          )}

           <FormField
            label="Permanent Address *"
            name="permanentAddress"
            value={formData.permanentAddress || ""}
            onChange={handleChange}
            error={errors.permanentAddress}
          />

          <div className="grid grid-cols-1 gap-3">
            <FormField
              label="City *"
              name="permanentCity"
              value={formData.permanentCity || ""}
              onChange={handleChange}
              error={errors.permanentCity}
            />
            <FormField
              label="State *"
              name="permanentState"
              value={formData.permanentState || ""}
              onChange={handleChange}
              error={errors.permanentState}
            />
          </div>

          <div className="grid grid-cols-1 gap-3">
            <FormField
              label="Zip Code *"
              name="permanentZip"
              value={formData.permanentZip || ""}
              onChange={handleChange}
              error={errors.permanentZip}
            />
            <FormField
              label="Country *"
              name="permanentCountry"
              value={formData.permanentCountry || ""}
              onChange={handleChange}
              error={errors.permanentCountry}
            />
          </div>

          <p
            className="text-xs font-medium uppercase tracking-wider pt-2"
            style={{ color: theme.inkSubtle }}
          >
            Place of Birth *
          </p>
          <div className="grid grid-cols-1 gap-3">
            <FormField
              label="Birth City *"
              name="birthCity"
              value={formData.birthCity || ""}
              onChange={handleChange}
              error={errors.birthCity}
              placeholder="e.g. Mumbai"
            />
            <FormField
              label="Birth State *"
              name="birthState"
              value={formData.birthState || ""}
              onChange={handleChange}
              error={errors.birthState}
              placeholder="e.g. Maharashtra"
            />
            <FormField
              label="Birth Country *"
              name="birthCountry"
              value={formData.birthCountry || ""}
              onChange={handleChange}
              error={errors.birthCountry}
              placeholder="e.g. India"
            />
          </div>

          <p
            className="text-xs font-medium uppercase tracking-wider pt-2"
            style={{ color: theme.inkSubtle }}
          >
            Language Ability *
          </p>
          <div className="grid grid-cols-1 gap-3">
            <FormField
              label="Language Name *"
              name="lang1Name"
              value={formData.lang1Name || ""}
              onChange={handleChange}
              error={errors.lang1Name}
              placeholder="e.g. English"
            />
            <SelectField
              label="Speaking Level"
              name="lang1Speaking"
              value={formData.lang1Speaking || "moderate"}
              onChange={handleChange}
              options={[
                { value: "high", label: "High" },
                { value: "moderate", label: "Moderate" },
                { value: "low", label: "Low" },
              ]}
            />
            <SelectField
              label="Reading Level"
              name="lang1Reading"
              value={formData.lang1Reading || "moderate"}
              onChange={handleChange}
              options={[
                { value: "high", label: "High" },
                { value: "moderate", label: "Moderate" },
                { value: "low", label: "Low" },
              ]}
            />
            <SelectField
              label="Writing Level"
              name="lang1Writing"
              value={formData.lang1Writing || "moderate"}
              onChange={handleChange}
              options={[
                { value: "high", label: "High" },
                { value: "moderate", label: "Moderate" },
                { value: "low", label: "Low" },
              ]}
            />
          </div>

          <FormField
            label="Signature (Full Name) *"
            name="signature"
            value={formData.signature || ""}
            onChange={handleChange}
            error={errors.signature}
            placeholder="Type your full name as signature"
          />

          <button
            type="submit"
            disabled={submit.isPending}
            className="inline-flex w-full items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold transition-all duration-200 disabled:opacity-60"
            style={{
              background: theme.ink,
              color: "#fff",
              borderRadius: theme.btnRadius,
            }}
          >
            {submit.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : null}
            {submit.isPending ? "Submitting..." : "Submit Application"}
          </button>

          <p className="text-xs text-center" style={{ color: theme.inkSubtle }}>
            By submitting, you agree to our terms and privacy policy.
          </p>
        </form>
      )}
    </div>
  );
}
function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        className="mb-1 block text-xs font-medium"
        style={{ color: theme.inkMuted }}
      >
        {label}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-all duration-200"
        style={{
          background: theme.canvas,
          color: theme.ink,
          border: "1px solid " + (error ? "#EF4444" : theme.hairline),
        }}
      />
      {error && <p className="mt-0.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  error,
  options,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label
        className="mb-1 block text-xs font-medium"
        style={{ color: theme.inkMuted }}
      >
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-all duration-200"
        style={{
          background: theme.canvas,
          color: theme.ink,
          border: "1px solid " + (error ? "#EF4444" : theme.hairline),
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-0.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}
