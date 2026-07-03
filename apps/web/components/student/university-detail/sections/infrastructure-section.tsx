"use client";

import { brand as theme } from "@/lib/brand";
import { Building2, Hospital, Users, Layers, BookMarked, Check } from "lucide-react";
import { SectionCard, InfraStat, BoolRow } from "../common/ui";
import type { UniversityInfrastructure } from "@/domains/universities/universities.types";

export function InfrastructureSection({ infra }: { infra: UniversityInfrastructure | null }) {
  if (!infra) {
    return (
      <SectionCard title="Infrastructure & Facilities" isEmpty emptyMessage="Infrastructure details will be available soon." />
    );
  }

  return (
    <SectionCard
      title="Infrastructure & Facilities"
      isEmpty={
        !infra.hospitalBeds && !infra.campusArea && !infra.hostelBoys &&
        !infra.hostelGirls && !infra.departments?.length && !infra.laboratories?.length &&
        infra.cafeteria == null && infra.wifiCampus == null &&
        infra.transportation == null && !infra.facilities?.length
      }
      emptyMessage="Infrastructure details will be updated soon."
    >
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {infra.hospitalBeds != null && infra.hospitalBeds > 0 && (
          <InfraStat icon={<Hospital />} label="Hospital Beds" value={String(infra.hospitalBeds)} />
        )}
        {infra.campusArea != null && infra.campusArea > 0 && (
          <InfraStat icon={<Building2 />} label="Campus Area" value={`${infra.campusArea} acres`} />
        )}
        {infra.hostelBoys != null && infra.hostelBoys > 0 && (
          <InfraStat icon={<Users />} label="Boys Hostel" value={String(infra.hostelBoys)} />
        )}
        {infra.hostelGirls != null && infra.hostelGirls > 0 && (
          <InfraStat icon={<Users />} label="Girls Hostel" value={String(infra.hostelGirls)} />
        )}
      </div>

      {infra.departments?.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider" style={{ color: theme.inkSubtle }}>Departments</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {infra.departments.map((dept: string, i: number) => (
              <div key={i} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
                style={{ background: theme.canvas, border: "1px solid " + theme.hairline }}>
                <Layers className="size-4 shrink-0" style={{ color: theme.gold }} />
                <span style={{ color: theme.inkMuted }}>{dept}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {infra.laboratories?.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider" style={{ color: theme.inkSubtle }}>Laboratories</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {infra.laboratories.map((lab: string, i: number) => (
              <div key={i} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
                style={{ background: theme.canvas, border: "1px solid " + theme.hairline }}>
                <BookMarked className="size-4 shrink-0" style={{ color: theme.gold }} />
                <span style={{ color: theme.inkMuted }}>{lab}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {infra.cafeteria != null && <BoolRow label="Cafeteria" value={infra.cafeteria} />}
        {infra.wifiCampus != null && <BoolRow label="WiFi Campus" value={infra.wifiCampus} />}
        {infra.transportation != null && <BoolRow label="Transportation" value={infra.transportation} />}
        {infra.facilities?.includes("Library") && <BoolRow label="Library" value={true} />}
      </div>

      {infra.facilities?.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider" style={{ color: theme.inkSubtle }}>Other Facilities</p>
          <div className="flex flex-wrap gap-2">
            {infra.facilities.map((facility: string, i: number) => (
              <span key={i} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium"
                style={{ background: theme.goldLight, color: theme.ink, border: "1px solid " + theme.goldBorder }}>
                <Check className="size-3" style={{ color: theme.gold }} />
                {facility}
              </span>
            ))}
          </div>
        </div>
      )}
    </SectionCard>
  );
}
