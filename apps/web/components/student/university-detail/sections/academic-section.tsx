"use client";

import { brand as theme } from "@/lib/brand";
import { ChevronRight } from "lucide-react";
import { SectionCard, ChipList, SeatBox } from "../common/ui";
import type { UniversityAcademic } from "@/domains/universities/universities.types";

export function AcademicSection({ academic }: { academic: UniversityAcademic | null }) {
  if (!academic) return null;
  if (!academic.programs?.length && !academic.specializations?.length) return null;

  return (
    <SectionCard title="Academic Programs">
      <div className="grid gap-6 sm:grid-cols-2">
        {academic.programs?.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider" style={{ color: theme.inkSubtle }}>Programs Offered</p>
            <ul className="space-y-1.5">
              {academic.programs.map((p: any) => (
                <li key={typeof p === "string" ? p : p.name} className="flex items-center gap-2 text-sm" style={{ color: theme.inkMuted }}>
                  <ChevronRight className="size-3.5 shrink-0" style={{ color: theme.gold }} />
                  {typeof p === "string" ? p : p.name}
                </li>
              ))}
            </ul>
          </div>
        )}
        {academic.specializations?.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider" style={{ color: theme.inkSubtle }}>Specializations</p>
            <ChipList items={academic.specializations} />
          </div>
        )}
        {academic.intakeMonths?.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider" style={{ color: theme.inkSubtle }}>Intake Months</p>
            <ChipList items={academic.intakeMonths} />
          </div>
        )}
        {(academic.governmentSeats || academic.managementSeats || academic.nriSeats) && (
          <div className="sm:col-span-2">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider" style={{ color: theme.inkSubtle }}>Seat Distribution</p>
            <div className="grid grid-cols-3 gap-3">
              {academic.governmentSeats != null && academic.governmentSeats > 0 && (
                <SeatBox label="Government" value={academic.governmentSeats} total={academic.totalSeats} />
              )}
              {academic.managementSeats != null && academic.managementSeats > 0 && (
                <SeatBox label="Management" value={academic.managementSeats} total={academic.totalSeats} />
              )}
              {academic.nriSeats != null && academic.nriSeats > 0 && (
                <SeatBox label="NRI" value={academic.nriSeats} total={academic.totalSeats} />
              )}
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
}
