"use client";

import { brand as theme } from "@/lib/brand";
import { SectionCard } from "../common/ui";
import type { UniversityCourse } from "@/domains/universities/universities.types";

export function CoursesSection({ courses }: { courses: UniversityCourse[] }) {
  if (!courses?.length) return null;

  return (
    <SectionCard title="Courses Offered">
      <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid " + theme.hairline }}>
        <table className="w-full text-left text-sm">
          <thead>
            <tr style={{ background: theme.canvas }}>
              <th className="px-4 py-3 font-semibold" style={{ color: theme.ink, borderBottom: "1px solid " + theme.hairline }}>Course</th>
              <th className="px-4 py-3 font-semibold" style={{ color: theme.ink, borderBottom: "1px solid " + theme.hairline }}>Duration</th>
              <th className="px-4 py-3 font-semibold" style={{ color: theme.ink, borderBottom: "1px solid " + theme.hairline }}>Fees</th>
              <th className="px-4 py-3 font-semibold" style={{ color: theme.ink, borderBottom: "1px solid " + theme.hairline }}>Seats</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c: any, i: number) => (
              <tr key={c.id || i}
                style={{ borderBottom: i < courses.length - 1 ? "1px solid " + theme.hairline : "none" }}>
                <td className="px-4 py-3 font-medium" style={{ color: theme.ink }}>{c.name || c.courseName}</td>
                <td className="px-4 py-3" style={{ color: theme.inkMuted }}>{c.duration || c.courseDuration || "-"}</td>
                <td className="px-4 py-3" style={{ color: theme.inkMuted }}>
                  {c.fees != null
                    ? `₹${(typeof c.fees === "number" ? c.fees : Number(c.fees)).toLocaleString()}`
                    : c.courseFee ? `₹${Number(c.courseFee).toLocaleString()}` : "-"}
                </td>
                <td className="px-4 py-3" style={{ color: theme.inkMuted }}>{c.totalSeats || c.seats || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}
