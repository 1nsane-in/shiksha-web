"use client";

import { brand as theme } from "@/lib/brand";
import { SectionCard, FeeBox, InfoField, BoolRow } from "../common/ui";
import type { UniversityFees } from "@/domains/universities/universities.types";

export function FeesSection({ fees }: { fees: UniversityFees | null }) {
  if (!fees) return null;

  return (
    <SectionCard title="Fees & Financials">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {fees.tuitionAnnual != null && (
          <FeeBox label="Tuition Fee" value={`${fees.currency} ${fees.tuitionAnnual.toLocaleString()}`} sub="/year" />
        )}
        {fees.hostelAnnual != null && (
          <FeeBox label="Hostel Fee" value={`${fees.currency} ${fees.hostelAnnual.toLocaleString()}`} sub="/year" />
        )}
        {fees.totalProgram != null && (
          <FeeBox label="Total Program Fee" value={`${fees.currency} ${fees.totalProgram.toLocaleString()}`} sub="Approx" highlight />
        )}
        {fees.registration != null && (
          <FeeBox label="Registration Fee" value={`${fees.currency} ${fees.registration.toLocaleString()}`} />
        )}
        {fees.otherFees != null && typeof fees.otherFees === "object" && (
          <div className="sm:col-span-2 lg:col-span-3">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider" style={{ color: theme.inkSubtle }}>Other Fees</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {Object.entries(fees.otherFees).map(([key, val]) => (
                <div key={key} className="rounded-lg px-3 py-2 text-sm"
                  style={{ background: theme.canvas, border: "1px solid " + theme.hairline }}>
                  <span style={{ color: theme.inkSubtle }}>{key.replace(/([A-Z])/g, " $1").trim()}:</span>
                  <span className="ml-1 font-medium" style={{ color: theme.ink }}>{String(val)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {fees.paymentSchedule && <InfoField label="Payment Schedule" value={fees.paymentSchedule} />}
        {fees.scholarshipAvailable != null && (
          <BoolRow label="Scholarship Available" value={fees.scholarshipAvailable} />
        )}
        {fees.refundPolicy && (
          <div className="sm:col-span-2 lg:col-span-3">
            <InfoField label="Refund Policy" value={fees.refundPolicy} />
          </div>
        )}
      </div>
    </SectionCard>
  );
}
