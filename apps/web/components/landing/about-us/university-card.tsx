"use client";

import { brand } from "@/lib/brand";
import type { PartnerUniversity } from "@/lib/brand-data";
import { 
  Building2, 
  Users, 
  Award, 
  CheckCircle2,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  BookOpen
} from "lucide-react";
import Image from "next/image";

const LOGO_DIR = "/img/universities";

interface UniversityCardProps extends PartnerUniversity {
  index: number;
}

/**
 * Enhanced university card with rich details from shiksha.md.
 * Displays features, highlights, recognitions, and approvals.
 */
export function UniversityCard({ 
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
  index 
}: UniversityCardProps) {
  // Country color coding
  const countryColors: Record<string, { bg: string; text: string; border: string }> = {
    Kyrgyzstan: { bg: "#fef2f2", text: "#dc2626", border: "#fecaca" },
    Uzbekistan: { bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0" },
    Kazakhstan: { bg: "#ecfeff", text: "#0891b2", border: "#a5f3fc" },
    Russia: { bg: "#eff6ff", text: "#2563eb", border: "#bfdbfe" },
  };

  const colors = countryColors[country] || { bg: brand.goldLight, text: brand.gold, border: brand.hairline };

  return (
    <div
      className="group relative flex flex-col rounded-xl border bg-white transition-all duration-200 hover:shadow-sm overflow-hidden"
      style={{ borderColor: brand.hairline }}
    >
      {/* Country Badge */}
      <div
        className="absolute top-4 right-4 px-2.5 py-1 text-xs font-medium rounded-full"
        style={{
          backgroundColor: colors.bg,
          color: colors.text,
          border: `1px solid ${colors.border}`,
        }}
      >
        {country}
      </div>

      {/* Card Header */}
      <div className="p-5 pb-3">
        <div className="flex items-start gap-3">
          {logo ? (
            <div className="relative h-10 w-10 shrink-0 rounded-lg overflow-hidden">
              <Image
                src={`${LOGO_DIR}/${logo}`}
                alt={name}
                fill
                className="object-contain p-1"
                sizes="40px"
              />
            </div>
          ) : (
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold"
              style={{
                backgroundColor: colors.bg,
                color: colors.text,
              }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
          <div className="min-w-0 flex-1 pr-16">
            <h3
              className="font-semibold text-base leading-tight"
              style={{ color: brand.ink }}
            >
              {name}
            </h3>
            <div className="flex items-center gap-1 mt-1.5">
              <MapPin className="w-3 h-3 shrink-0" style={{ color: brand.inkMuted }} />
              <p className="text-xs truncate" style={{ color: brand.inkMuted }}>
                {location}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="flex flex-wrap gap-3 mt-4">
          {established && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" style={{ color: brand.gold }} />
              <span className="text-xs" style={{ color: brand.inkMuted }}>
                Est. {established}
              </span>
            </div>
          )}
          {studentStrength && (
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" style={{ color: brand.gold }} />
              <span className="text-xs" style={{ color: brand.inkMuted }}>
                {studentStrength} students
              </span>
            </div>
          )}
          {duration && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" style={{ color: brand.gold }} />
              <span className="text-xs" style={{ color: brand.inkMuted }}>
                {duration}
              </span>
            </div>
          )}
          {tuition && (
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5" style={{ color: brand.gold }} />
              <span className="text-xs" style={{ color: brand.inkMuted }}>
                {tuition.replace("Approximately ", "~")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 h-px" style={{ backgroundColor: brand.hairline }} />

      {/* Features Section */}
      <div className="p-5 py-4 space-y-4">
        {/* Key Features */}
        {features && features.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Building2 className="w-3.5 h-3.5" style={{ color: brand.gold }} />
              <span className="text-xs font-medium uppercase tracking-wide" style={{ color: brand.inkMuted }}>
                Key Features
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {features.slice(0, 4).map((feature, i) => (
                <span
                  key={i}
                  className="px-2 py-1 text-xs rounded-md"
                  style={{
                    backgroundColor: brand.canvas,
                    color: brand.ink,
                  }}
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Highlights */}
        {highlights && highlights.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Award className="w-3.5 h-3.5" style={{ color: brand.gold }} />
              <span className="text-xs font-medium uppercase tracking-wide" style={{ color: brand.inkMuted }}>
                Highlights
              </span>
            </div>
            <ul className="space-y-1">
              {highlights.slice(0, 3).map((highlight, i) => (
                <li
                  key={i}
                  className="flex items-start gap-1.5 text-xs"
                  style={{ color: brand.inkMuted }}
                >
                  <span style={{ color: brand.gold }}>•</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recognitions */}
        {recognitions && recognitions.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <BookOpen className="w-3.5 h-3.5" style={{ color: brand.gold }} />
              <span className="text-xs font-medium uppercase tracking-wide" style={{ color: brand.inkMuted }}>
                Recognitions
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {recognitions.map((rec, i) => (
                <span
                  key={i}
                  className="px-2 py-1 text-xs rounded-md"
                  style={{
                    backgroundColor: colors.bg,
                    color: colors.text,
                  }}
                >
                  {rec}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Approvals */}
        {approvals && approvals.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" style={{ color: brand.gold }} />
              <span className="text-xs font-medium uppercase tracking-wide" style={{ color: brand.inkMuted }}>
                Approvals
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {approvals.map((approval, i) => (
                <span
                  key={i}
                  className="px-2 py-1 text-xs rounded-md font-medium"
                  style={{
                    backgroundColor: "#dcfce7",
                    color: "#166534",
                  }}
                >
                  ✓ {approval}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Academic Structure */}
        {academicStructure && (
          <div className="pt-2 border-t" style={{ borderColor: brand.hairline }}>
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" style={{ color: brand.gold }} />
              <span className="text-xs" style={{ color: brand.inkMuted }}>
                Structure: <span style={{ color: brand.ink }}>{academicStructure}</span>
              </span>
            </div>
          </div>
        )}

        {/* Special Focus */}
        {specialFocus && specialFocus.length > 0 && (
          <div className="pt-2 border-t" style={{ borderColor: brand.hairline }}>
            <div className="flex items-start gap-1.5">
              <BookOpen className="w-3.5 h-3.5 mt-0.5" style={{ color: brand.gold }} />
              <div>
                <span className="text-xs block mb-1" style={{ color: brand.inkMuted }}>
                  Special Focus Areas:
                </span>
                <div className="flex flex-wrap gap-1">
                  {specialFocus.slice(0, 4).map((focus, i) => (
                    <span
                      key={i}
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: brand.canvas,
                        color: brand.inkMuted,
                      }}
                    >
                      {focus}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
