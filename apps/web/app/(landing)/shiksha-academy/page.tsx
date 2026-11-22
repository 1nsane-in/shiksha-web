import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Box,
  FlaskConical,
  Microscope,
  Stethoscope,
} from "lucide-react";
import { brand } from "@/lib/brand";
import {
  academyGroups,
  findSubject,
  subjectHref,
  subjectsByGroup,
  totalAcademyTopics,
  type AcademyGroup,
  type AcademySubject,
} from "@/lib/academy-data";

export const metadata: Metadata = {
  title: "Shiksha Academy | FMGE & NExT subjects",
  description:
    "Explore all 19 FMGE/NExT subjects at Shiksha Academy — browse syllabus topics subject by subject, with an interactive 3D anatomy atlas.",
};

const atlasSrc =
  process.env.NEXT_PUBLIC_ATLAS_URL || "https://shiksha-anatomy.pages.dev";

type PageProps = { searchParams: Promise<{ subject?: string }> };

export default async function ShikshaAcademyPage({ searchParams }: PageProps) {
  const { subject } = await searchParams;
  const activeSubject = findSubject(subject);

  return activeSubject ? (
    <SubjectDetail subject={activeSubject} />
  ) : (
    <AcademyHome />
  );
}

const groupIcons = {
  "Pre-clinical": FlaskConical,
  "Para-clinical": Microscope,
  Clinical: Stethoscope,
} as const;

function GroupIcon({
  group,
  className,
}: {
  group: AcademyGroup;
  className?: string;
}) {
  const Icon = groupIcons[group];
  return <Icon className={className} />;
}

/* ─── Main subject index ─── */

function AcademyHome() {
  return (
    <>
      <section
        className="relative overflow-hidden px-4 pb-16 pt-32 sm:px-6 lg:px-8"
        style={{
          background: `radial-gradient(100% 140% at 8% 0%, ${brand.goldGlow}, transparent 55%), ${brand.navy}`,
        }}
      >
        <div className="mx-auto max-w-6xl text-white">
          <span
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em]"
            style={{ background: brand.goldLight, color: brand.gold }}
          >
            <Box className="size-3.5" />
            FMGE / NExT Preparation
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Shiksha <span style={{ color: brand.gold }}>Academy</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">
            Nineteen subjects. One structured path from your first textbook to
            final revision. Pick a subject to see every topic you need to cover.
          </p>

          <div className="mt-10 flex flex-wrap gap-8">
            {[
              { value: academyGroups.length.toString(), label: "Stages" },
              { value: "19", label: "Subjects" },
              { value: totalAcademyTopics.toString(), label: "Topics" },
            ].map((stat) => (
              <div key={stat.label}>
                <p
                  className="text-3xl font-black tracking-tight"
                  style={{ color: brand.gold }}
                >
                  {stat.value}
                </p>
                <p className="text-[11px] uppercase tracking-[0.16em] text-white/50">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="#subjects"
              className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ background: brand.gold, color: brand.ink }}
            >
              Explore subjects
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href={subjectHref("anatomy")}
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              3D Anatomy Atlas
            </Link>
          </div>
        </div>
      </section>

      <section id="subjects" className="scroll-mt-28 bg-white py-20">
        <div className="mx-auto max-w-6xl space-y-16 px-4 sm:px-6 lg:px-8">
          {academyGroups.map((group) => (
            <GroupBlock key={group} group={group} />
          ))}
        </div>
      </section>

      <section
        className="px-4 py-16 text-white sm:px-6 lg:px-8"
        style={{ background: brand.navy }}
      >
        <div className="mx-auto max-w-6xl">
          <p
            className="text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{ color: brand.gold }}
          >
            How it works
          </p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            A simple way to revise
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              {
                title: "Pick a subject",
                desc: "Choose from 19 FMGE/NExT subjects grouped by study stage.",
              },
              {
                title: "Work through topics",
                desc: "Every subject page lists the full syllabus topic by topic.",
              },
              {
                title: "See it in 3D",
                desc: "Anatomy comes with an interactive human anatomy atlas.",
              },
            ].map((step, index) => (
              <div
                key={step.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <span
                  className="text-2xl font-black"
                  style={{ color: brand.gold }}
                >
                  0{index + 1}
                </span>
                <h3 className="mt-3 text-base font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function GroupBlock({ group }: { group: AcademyGroup }) {
  const subjects = subjectsByGroup(group);

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <span
          className="flex size-10 items-center justify-center rounded-xl"
          style={{ background: brand.goldLight, color: brand.gold }}
        >
          <GroupIcon group={group} className="size-5" />
        </span>
        <h2 className="text-2xl font-bold" style={{ color: brand.ink }}>
          {group}
        </h2>
        <span className="text-xs" style={{ color: brand.inkMuted }}>
          {subjects.length} subjects
        </span>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => (
          <SubjectCard key={subject.slug} subject={subject} />
        ))}
      </div>
    </div>
  );
}

function SubjectCard({ subject }: { subject: AcademySubject }) {
  return (
    <Link
      href={subjectHref(subject.slug)}
      className="group flex flex-col rounded-2xl border border-brand-hairline bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-gold/40 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60"
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className="flex size-11 items-center justify-center rounded-xl"
          style={{ background: brand.goldLight, color: brand.gold }}
        >
          <GroupIcon group={subject.group} className="size-5" />
        </span>
        <ArrowRight className="size-4 text-brand-gold transition-transform duration-200 group-hover:translate-x-1" />
      </div>

      <h3
        className="mt-4 text-lg font-bold leading-snug"
        style={{ color: brand.ink }}
      >
        {subject.name}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed" style={{ color: brand.inkMuted }}>
        {subject.blurb}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {subject.topics.slice(0, 3).map((topic) => (
          <span
            key={topic}
            className="rounded-full px-2.5 py-1 text-[11px]"
            style={{ background: brand.goldLight, color: brand.ink }}
          >
            {topic}
          </span>
        ))}
      </div>
      <p
        className="mt-auto pt-5 text-[11px] font-semibold uppercase tracking-[0.14em]"
        style={{ color: brand.gold }}
      >
        {subject.topics.length} topics
      </p>
    </Link>
  );
}

/* ─── Subject detail (?subject=...) ─── */

function SubjectDetail({ subject }: { subject: AcademySubject }) {
  const related = subjectsByGroup(subject.group)
    .filter((item) => item.slug !== subject.slug)
    .slice(0, 4);

  return (
    <>
      <section
        className="px-4 pb-14 pt-32 sm:px-6 lg:px-8"
        style={{ background: brand.navy }}
      >
        <div className="mx-auto max-w-6xl text-white">
          <Link
            href="/shiksha-academy"
            className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4" />
            All subjects
          </Link>
          <p
            className="mt-8 text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{ color: brand.gold }}
          >
            {subject.group} · {subject.topics.length} topics
          </p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
            {subject.name}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">
            {subject.blurb}
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:px-8">
          <div className="rounded-2xl border border-brand-hairline p-6 sm:p-8">
            <h2 className="text-xl font-bold" style={{ color: brand.ink }}>
              Syllabus topics
            </h2>
            <p className="mt-1 text-sm" style={{ color: brand.inkMuted }}>
              Everything covered in this subject.
            </p>
            <ol className="mt-6 grid gap-3 sm:grid-cols-2">
              {subject.topics.map((topic, index) => (
                <li
                  key={topic}
                  className="flex items-start gap-3 rounded-xl border border-brand-hairline px-4 py-3"
                >
                  <span
                    className="text-xs font-bold"
                    style={{ color: brand.gold }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm" style={{ color: brand.ink }}>
                    {topic}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <aside className="space-y-5">
            <div
              className="rounded-2xl p-6 text-white"
              style={{ background: brand.navy }}
            >
              <p
                className="text-[11px] font-bold uppercase tracking-[0.18em]"
                style={{ color: brand.gold }}
              >
                At a glance
              </p>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-white/50">Stage</dt>
                  <dd className="text-right font-medium">{subject.group}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-white/50">Topics</dt>
                  <dd className="font-medium">{subject.topics.length}</dd>
                </div>
              </dl>
              <Link
                href={subject.slug === "anatomy" ? "#atlas" : subjectHref("anatomy")}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ background: brand.gold, color: brand.ink }}
              >
                {subject.slug === "anatomy"
                  ? "Open 3D atlas"
                  : "Explore 3D anatomy atlas"}
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="rounded-2xl border border-brand-hairline p-6">
              <h3 className="text-sm font-bold" style={{ color: brand.ink }}>
                More in {subject.group}
              </h3>
              <div className="mt-4 space-y-1">
                {related.map((item) => (
                  <Link
                    key={item.slug}
                    href={subjectHref(item.slug)}
                    className="group flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-slate-50"
                    style={{ color: brand.inkMuted }}
                  >
                    {item.name}
                    <ArrowRight className="size-3.5 text-brand-gold transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {subject.slug === "anatomy" && (
        <section
          id="atlas"
          className="scroll-mt-28 bg-brand-ink px-4 py-14 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-6xl">
            <p
              className="text-[11px] font-bold uppercase tracking-[0.2em]"
              style={{ color: brand.gold }}
            >
              Interactive Atlas
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
              See anatomy in 3D
            </h2>
            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white">
              <iframe
                src={atlasSrc}
                title="Shiksha Academy 3D Human Anatomy Atlas"
                className="block h-[70vh] min-h-[420px] w-full border-0"
                loading="lazy"
                allow="fullscreen"
              />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
