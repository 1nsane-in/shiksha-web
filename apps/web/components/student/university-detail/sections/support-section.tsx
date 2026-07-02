"use client";

import { brand as theme } from "@/lib/brand";
import { SectionCard, BoolRow, ChipList } from "../common/ui";
import type { UniversitySupport } from "@/domains/universities/universities.types";

export function SupportSection({ support }: { support: UniversitySupport | null }) {
  if (!support) return null;

  return (
    <SectionCard title="Support & Career">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {support.placementRate != null && support.placementRate > 0 && (
          <div className="rounded-xl px-5 py-4 text-center"
            style={{ background: theme.goldLight, border: "1px solid " + theme.goldBorder }}>
            <p className="text-3xl font-bold" style={{ color: theme.gold }}>{support.placementRate}%</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider" style={{ color: theme.inkMuted }}>Placement Rate</p>
          </div>
        )}
        {support.averagePackage != null && support.averagePackage > 0 && (
          <div className="rounded-xl px-5 py-4 text-center"
            style={{ background: theme.goldLight, border: "1px solid " + theme.goldBorder }}>
            <p className="text-3xl font-bold" style={{ color: theme.gold }}>₹{support.averagePackage.toLocaleString()}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider" style={{ color: theme.inkMuted }}>Avg Package</p>
          </div>
        )}
        <div className="sm:col-span-2 space-y-3">
          {support.visaAssistance != null && <BoolRow label="Visa Assistance" value={support.visaAssistance} />}
          {support.counselingServices != null && <BoolRow label="Counseling Services" value={support.counselingServices} />}
          {support.careerGuidance != null && <BoolRow label="Career Guidance" value={support.careerGuidance} />}
          {support.languageSupport?.length > 0 && (
            <div className="pt-2">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider" style={{ color: theme.inkSubtle }}>Language Support</p>
              <ChipList items={support.languageSupport} />
            </div>
          )}
        </div>
      </div>
    </SectionCard>
  );
}
