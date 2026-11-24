"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { HUMAN_ANATOMY } from "@/shared/api/constants";
import {
  ArrowLeft,
  ArrowRight,
  Box,
  Check,
  ChevronDown,
  LayoutGrid,
  List,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import { brand } from "@/lib/brand";
import {
  academyGroups,
  academySubjects,
  subjectHref,
  subjectsByGroup,
  totalAcademyTopics,
  type AcademyGroup,
  type AcademySubject,
} from "@/lib/academy-data";

/* Warm paper palette, kept separate from the global canvas tokens. */
const paper = "oklch(0.976 0.008 85)";
const paperDeep = "oklch(0.955 0.012 85)";
const surface = "oklch(0.995 0.003 85)";
const line = "oklch(0.88 0.010 85)";

function BannerImage({ alt }: { alt?: string }) {
  return (
    <>
      <Image
        src={HUMAN_ANATOMY}
        alt={alt ?? ""}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(16,44,80,0.98) 0%, rgba(16,44,80,0.92) 38%, rgba(16,44,80,0.45) 68%, rgba(16,44,80,0.22) 100%), linear-gradient(0deg, rgba(16,44,80,0.95) 0%, transparent 38%)",
        }}
      />
    </>
  );
}

type Stage = "All" | AcademyGroup;
type View = "index" | "cards";

export function AcademyExplorer() {
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState<Stage>("All");
  const [view, setView] = useState<View>("index");
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return academySubjects.filter((subject) => {
      const stageMatch = stage === "All" || subject.group === stage;
      const termMatch =
        !term ||
        subject.name.toLowerCase().includes(term) ||
        subject.blurb.toLowerCase().includes(term) ||
        subject.topics.some((topic) => topic.toLowerCase().includes(term));
      return stageMatch && termMatch;
    });
  }, [query, stage]);

  return (
    <>
      <section
        className="relative isolate overflow-hidden px-4 pb-24 pt-32 sm:px-6 lg:px-8"
        style={{ background: brand.navy }}
      >
        <BannerImage alt="Anatomical illustration of the human body over a world map" />
        {/* ponytail: CSS entrance instead of motion — LCP content must paint at FCP */}
        <div className="animate-menu-in relative mx-auto max-w-6xl">
          <span
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em]"
            style={{ background: brand.goldLight, color: brand.gold }}
          >
            <Box className="size-3.5" />
            FMGE / NExT preparation
          </span>
          <h1
            className="mt-6 text-balance text-[clamp(2.6rem,6vw,4.5rem)] font-extrabold leading-[1.05] tracking-[-0.04em]"
            style={{ color: surface }}
          >
            Shiksha{" "}
            <span className="block" style={{ color: brand.gold }}>
              Academy
            </span>
          </h1>
          <p
            className="mt-5 max-w-xl text-base leading-relaxed sm:text-lg"
            style={{ color: "rgba(255,255,255,0.78)" }}
          >
            A study cabinet for nineteen medical subjects. Open a stage, expand
            a subject, and see exactly which topics to revise.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#subjects"
              className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ background: brand.gold, color: brand.ink }}
            >
              Browse subjects
              <ArrowRight className="size-4" />
            </a>
            <Link
              href={subjectHref("anatomy")}
              className="inline-flex items-center gap-2 rounded-lg border border-white/25 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Anatomy subject
            </Link>
          </div>
          <p
            className="mt-7 text-xs tracking-wide"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            3 stages · 19 subjects · {totalAcademyTopics} topics
          </p>
        </div>
      </section>

      <div id="subjects" className="scroll-mt-28" style={{ background: paper }}>
        <div
          className="sticky top-24 z-20 border-y px-4 py-3 sm:px-6 lg:px-8"
          style={{ background: paper, borderColor: line }}
        >
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3">
            <label className="relative min-w-[200px] flex-1 sm:max-w-xs">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2"
                style={{ color: brand.inkMuted }}
              />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search subjects or topics"
                aria-label="Search subjects or topics"
                className="w-full rounded-lg border py-2.5 pl-9 pr-3 text-sm outline-none transition-colors focus:border-brand-gold"
                style={{
                  borderColor: line,
                  background: surface,
                  color: brand.ink,
                }}
              />
            </label>

            <div
              className="flex flex-wrap items-center gap-1.5"
              role="group"
              aria-label="Filter by stage"
            >
              {(["All", ...academyGroups] as Stage[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setStage(item)}
                  aria-pressed={stage === item}
                  className="rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors"
                  style={{
                    borderColor: stage === item ? brand.ink : line,
                    background: stage === item ? brand.ink : surface,
                    color: stage === item ? surface : brand.inkMuted,
                  }}
                >
                  {item === "All" ? "All stages" : item}
                </button>
              ))}
            </div>

            <div
              className="ml-auto flex items-center gap-1 rounded-lg border p-1"
              style={{ borderColor: line, background: surface }}
            >
              {(
                [
                  { id: "index", label: "Index", icon: List },
                  { id: "cards", label: "Cards", icon: LayoutGrid },
                ] as const
              ).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setView(id)}
                  aria-pressed={view === id}
                  className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors"
                  style={{
                    background: view === id ? paperDeep : "transparent",
                    color: view === id ? brand.ink : brand.inkMuted,
                  }}
                >
                  <Icon className="size-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-lg font-semibold" style={{ color: brand.ink }}>
                No subjects match that search.
              </p>
              <p className="mt-2 text-sm" style={{ color: brand.inkMuted }}>
                Try a topic name like histology, vasculature or epidemiology.
              </p>
            </div>
          ) : view === "index" ? (
            <IndexView
              subjects={filtered}
              openSlug={openSlug}
              onToggle={(slug) => setOpenSlug(openSlug === slug ? null : slug)}
            />
          ) : (
            <CardsView subjects={filtered} />
          )}
        </div>
      </div>
    </>
  );
}

/* ─── Index view ─── */

function IndexView({
  subjects,
  openSlug,
  onToggle,
}: {
  subjects: AcademySubject[];
  openSlug: string | null;
  onToggle: (slug: string) => void;
}) {
  return (
    <div className="space-y-14">
      {academyGroups.map((group) => {
        const groupSubjects = subjects.filter(
          (subject) => subject.group === group,
        );
        if (!groupSubjects.length) return null;

        return (
          <section key={group}>
            <div className="mb-4 flex items-center gap-4">
              <h2
                className="text-xs font-bold uppercase tracking-[0.2em]"
                style={{ color: brand.ink }}
              >
                {group}
              </h2>
              <span className="h-px flex-1" style={{ background: line }} />
              <span className="text-xs" style={{ color: brand.inkMuted }}>
                {groupSubjects.length} subjects
              </span>
            </div>
            <div className="border-t" style={{ borderColor: line }}>
              {groupSubjects.map((subject) => (
                <SubjectRow
                  key={subject.slug}
                  subject={subject}
                  number={academySubjects.indexOf(subject) + 1}
                  isOpen={openSlug === subject.slug}
                  onToggle={() => onToggle(subject.slug)}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function SubjectRow({
  subject,
  number,
  isOpen,
  onToggle,
}: {
  subject: AcademySubject;
  number: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="border-b"
      style={{ borderColor: line }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="group grid w-full grid-cols-[2rem_1fr_auto] items-start gap-3 py-5 text-left sm:grid-cols-[3rem_1fr_auto] sm:gap-5"
      >
        <span
          className="pt-1 text-xs font-semibold tabular-nums transition-colors"
          style={{ color: isOpen ? brand.gold : brand.inkSubtle }}
        >
          {String(number).padStart(2, "0")}
        </span>
        <span className="min-w-0">
          <span
            className="block text-xl font-bold tracking-tight transition-colors group-hover:text-brand-gold sm:text-2xl"
            style={{ color: brand.ink }}
          >
            {subject.name}
          </span>
          <span
            className="mt-1 block max-w-2xl text-sm leading-relaxed"
            style={{ color: brand.inkMuted }}
          >
            {subject.blurb}
          </span>
          <span className="mt-3 hidden flex-wrap gap-1.5 sm:flex">
            {subject.topics.slice(0, 3).map((topic) => (
              <span
                key={topic}
                className="rounded-full px-2.5 py-1 text-[11px]"
                style={{ background: paperDeep, color: brand.inkMuted }}
              >
                {topic}
              </span>
            ))}
          </span>
        </span>
        <span className="flex items-center gap-3 pt-1">
          <span
            className="hidden text-xs sm:inline"
            style={{ color: brand.inkMuted }}
          >
            {subject.topics.length} topics
          </span>
          <ChevronDown
            className={`size-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            style={{ color: brand.gold }}
          />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ gridTemplateRows: "0fr", opacity: 0 }}
            animate={{ gridTemplateRows: "1fr", opacity: 1 }}
            exit={{ gridTemplateRows: "0fr", opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="grid"
          >
            <div className="overflow-hidden">
              <div className="grid gap-2 pb-6 pl-11 sm:grid-cols-2 sm:pl-20 lg:grid-cols-3">
                {subject.topics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-lg border px-3 py-2 text-xs"
                    style={{
                      borderColor: line,
                      background: surface,
                      color: brand.inkMuted,
                    }}
                  >
                    {topic}
                  </span>
                ))}
                <Link
                  href={subjectHref(subject.slug)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold sm:col-span-2 lg:col-span-3"
                  style={{ background: brand.ink, color: surface }}
                >
                  Open {subject.name} subject
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Card view ─── */

function CardsView({ subjects }: { subjects: AcademySubject[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {subjects.map((subject, index) => (
        <motion.div
          key={subject.slug}
          layout
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.4,
            delay: Math.min(index * 0.03, 0.24),
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <Link
            href={subjectHref(subject.slug)}
            className="group flex h-full flex-col rounded-xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-gold/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60"
            style={{ borderColor: line, background: surface }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-semibold tabular-nums"
                style={{ color: brand.inkSubtle }}
              >
                {String(academySubjects.indexOf(subject) + 1).padStart(2, "0")}
              </span>
              <ArrowRight className="size-4 text-brand-gold transition-transform group-hover:translate-x-1" />
            </div>
            <h3 className="mt-4 text-lg font-bold" style={{ color: brand.ink }}>
              {subject.name}
            </h3>
            <p
              className="mt-1.5 flex-1 text-sm leading-relaxed"
              style={{ color: brand.inkMuted }}
            >
              {subject.blurb}
            </p>
            <p
              className="mt-4 text-xs font-semibold"
              style={{ color: brand.gold }}
            >
              {subject.group} · {subject.topics.length} topics
            </p>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Subject detail (?subject=...) ─── */

export function AcademySubjectView({ subject }: { subject: AcademySubject }) {
  const [revised, setRevised] = useState<string[]>([]);

  const toggleTopic = (topic: string) => {
    setRevised((current) => {
      return current.includes(topic)
        ? current.filter((item) => item !== topic)
        : [...current, topic];
    });
  };

  const progress = revised.length / subject.topics.length;
  const related = subjectsByGroup(subject.group)
    .filter((item) => item.slug !== subject.slug)
    .slice(0, 4);

  return (
    <>
      <section
        className="relative isolate overflow-hidden px-4 pb-16 pt-32 sm:px-6 lg:px-8"
        style={{ background: brand.navy }}
      >
        <BannerImage />
        <div className="relative mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
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
            <h1
              className="mt-3 text-[clamp(2.4rem,5vw,4rem)] font-extrabold leading-[1.08] tracking-[-0.035em]"
              style={{ color: surface }}
            >
              {subject.name}
            </h1>
            <p
              className="mt-4 max-w-2xl text-base leading-relaxed"
              style={{ color: "rgba(255,255,255,0.68)" }}
            >
              {subject.blurb}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16" style={{ background: paper }}>
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.35fr_0.65fr] lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="rounded-xl border p-5 sm:p-7"
            style={{ borderColor: line, background: surface }}
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold" style={{ color: brand.ink }}>
                  Syllabus topics
                </h2>
                <p className="mt-1 text-sm" style={{ color: brand.inkMuted }}>
                  Tap a topic as you revise it. Progress stays on this page.
                </p>
              </div>
              <span
                className="text-xs font-semibold tabular-nums"
                style={{ color: brand.inkMuted }}
              >
                {revised.length} / {subject.topics.length}
              </span>
            </div>

            <div
              className="mt-5 h-1.5 overflow-hidden rounded-full"
              style={{ background: paperDeep }}
            >
              <div
                className="h-full origin-left rounded-full transition-transform duration-500 ease-out"
                style={{
                  background: brand.gold,
                  transform: `scaleX(${progress})`,
                }}
              />
            </div>

            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {subject.topics.map((topic, index) => {
                const done = revised.includes(topic);
                return (
                  <li key={topic}>
                    <button
                      type="button"
                      onClick={() => toggleTopic(topic)}
                      aria-pressed={done}
                      className="flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition-colors hover:border-brand-gold/50"
                      style={{
                        borderColor: line,
                        background: done ? paperDeep : surface,
                      }}
                    >
                      <span
                        className="flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors"
                        style={{
                          borderColor: done ? brand.gold : line,
                          background: done ? brand.gold : "transparent",
                          color: brand.ink,
                        }}
                      >
                        {done && <Check className="size-3" strokeWidth={3} />}
                      </span>
                      <span
                        className="text-xs font-semibold tabular-nums"
                        style={{ color: brand.inkSubtle }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className="text-sm"
                        style={{ color: done ? brand.inkMuted : brand.ink }}
                      >
                        {topic}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.14,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="space-y-4"
          >
            <div
              className="rounded-xl p-6 text-white"
              style={{ background: brand.navy }}
            >
              <p
                className="text-[11px] font-bold uppercase tracking-[0.18em]"
                style={{ color: brand.gold }}
              >
                Study stage
              </p>
              <p className="mt-3 text-lg font-semibold">{subject.group}</p>
              <div className="mt-5 border-t border-white/10 pt-5">
                <p className="text-sm text-white/60">
                  {revised.length === subject.topics.length
                    ? "Every topic marked. Ready for revision."
                    : `${subject.topics.length - revised.length} topics left to revise.`}
                </p>
              </div>
              <Link
                href="/shiksha-academy"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ background: brand.gold, color: brand.ink }}
              >
                Browse all subjects
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <div
              className="rounded-xl border p-6"
              style={{ borderColor: line, background: surface }}
            >
              <h3 className="text-sm font-bold" style={{ color: brand.ink }}>
                More in {subject.group}
              </h3>
              <div className="mt-3 space-y-1">
                {related.map((item) => (
                  <Link
                    key={item.slug}
                    href={subjectHref(item.slug)}
                    className="group flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-black/[0.04]"
                    style={{ color: brand.inkMuted }}
                  >
                    {item.name}
                    <ArrowRight className="size-3.5 text-brand-gold transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ))}
              </div>
            </div>
          </motion.aside>
        </div>
      </section>
    </>
  );
}
