import Image from "next/image";
import { ChevronDown } from "lucide-react";
import type { PartnerUniversity } from "@/lib/brand-data";
import { CountryStamp } from "@/components/landing/about-us/country-stamp";

interface UniversityRowProps extends PartnerUniversity {
  index: number;
}

function DetailList({ label, items }: { label: string; items?: string[] }) {
  if (!items?.length) return null;

  return (
    <div>
      <dt className="text-xs font-medium text-brand-ink-muted">{label}</dt>
      <dd className="mt-1 text-sm leading-relaxed text-brand-ink">
        {items.join(" · ")}
      </dd>
    </div>
  );
}

/**
 * One university file in the register. Native details keeps every piece of
 * content available without turning the page into a wall of cards.
 */
export function UniversityRow({
  name,
  location,
  country,
  logo,
  established,
  studentStrength,
  features,
  highlights,
  recognitions,
  approvals,
  tuition,
  duration,
  specialFocus,
  academicStructure,
  index,
}: UniversityRowProps) {
  return (
    <details className="group border-b border-brand-hairline">
      <summary className="relative grid cursor-pointer list-none grid-cols-1 gap-3 px-3 py-4 pr-10 transition-colors hover:bg-ice-grey/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-ink/30 md:grid-cols-[32px_minmax(0,1fr)_150px_170px] md:items-center md:gap-4 [&::-webkit-details-marker]:hidden">
        <span className="hidden text-xs font-medium tabular-nums text-brand-ink-muted md:block">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="flex min-w-0 items-center gap-3">
          {logo ? (
            <Image
              src={`/img/universities/${logo}`}
              alt={name}
              width={40}
              height={40}
              className="size-10 shrink-0 object-contain"
            />
          ) : (
            <span className="flex size-10 shrink-0 items-center justify-center rounded border border-brand-hairline text-xs font-medium tabular-nums text-brand-ink-muted">
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
          <div className="min-w-0">
            <span className="block text-sm font-medium leading-snug text-brand-ink">
              {name}
            </span>
            <p className="mt-1 flex items-center gap-2 text-xs text-brand-ink-muted">
              <CountryStamp country={country} />
              <span className="truncate">{location}</span>
            </p>
          </div>
        </div>

        <p className="text-xs text-brand-ink-muted md:text-right">
          <span className="md:hidden">Tuition: </span>
          <span className="font-medium tabular-nums text-brand-ink">
            {tuition ? tuition.replace("Approximately ", "") : "On request"}
          </span>
        </p>

        <p className="text-xs text-brand-ink-muted">
          <span className="md:hidden">Approvals: </span>
          <span className="font-medium text-brand-ink">
            {approvals?.join(" · ") ?? "Not listed"}
          </span>
        </p>

        <ChevronDown
          className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-brand-ink-muted transition-transform duration-200 group-open:rotate-180"
          strokeWidth={1.5}
        />
      </summary>

      <div className="border-t border-brand-hairline px-3 pb-6 pt-5 md:pl-28">
        <p className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-brand-ink-muted">
          {established && <span>Est. {established}</span>}
          {studentStrength && <span>{studentStrength} students</span>}
          {duration && <span>{duration}</span>}
          {academicStructure && <span>{academicStructure}</span>}
        </p>

        <dl className="mt-5 grid gap-5 sm:grid-cols-2">
          <DetailList label="Key features" items={features} />
          <DetailList label="Highlights" items={highlights} />
          <DetailList label="Recognitions" items={recognitions} />
          <DetailList label="Special focus" items={specialFocus} />
        </dl>
      </div>
    </details>
  );
}
