"use client";

import { brand as theme } from "@/lib/brand";
import { Award } from "lucide-react";
import { SectionCard, RecogBadge, ChipList } from "../common/ui";
import type { UniversityRecognition } from "@/domains/universities/universities.types";

export function RecognitionSection({ recognition }: { recognition: UniversityRecognition | null }) {
  if (!recognition) return null;

  return (
    <SectionCard title="Recognition & Accreditation">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          {recognition.bodies?.includes("NMC") && <RecogBadge label="NMC Approved" value={true} />}
          {recognition.bodies?.includes("WHO") && <RecogBadge label="WHO Recognized" value={true} />}
          <RecogBadge label={`ECFMG ${recognition.ecfmgStatus}`} value={recognition.ecfmgStatus === "APPROVED"} />
          {recognition.nbaAccredited && <RecogBadge label="NBA Accredited" value={true} />}
        </div>
        {recognition.accreditations?.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider" style={{ color: theme.inkSubtle }}>Accreditations</p>
            <ChipList items={recognition.accreditations} />
          </div>
        )}
        {recognition.nationalRank != null && (
          <div className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm"
            style={{ background: theme.canvas, border: "1px solid " + theme.hairline }}>
            <Award className="size-5" style={{ color: theme.gold }} />
            <span style={{ color: theme.ink }}>Country Rank: <b>#{recognition.nationalRank}</b></span>
            {recognition.worldRank != null && (
              <span style={{ color: theme.inkSubtle }}> &middot; World Rank: <b>#{recognition.worldRank}</b></span>
            )}
          </div>
        )}
      </div>
    </SectionCard>
  );
}
