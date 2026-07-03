"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import {
  MapPin,
  GraduationCap,
  Calendar,
  CheckCircle,
  Building2,
  ArrowRight,
} from "lucide-react";
import type { UniversityListItem } from "@/domains/universities/universities.types";
import { UniversityTypeBadge, formatEstablished } from "./university-type-badge";

/**
 * A single university card with banner image, details, approvals, and CTA buttons.
 */
export function UniversityCard({
  university,
  index,
  onApply,
  onViewDetails,
}: {
  university: UniversityListItem;
  index: number;
  onApply: (slug: string) => void;
  onViewDetails: (slug: string) => void;
}) {
  const imageSrc = university.bannerImage || university.logo || "";
  const hasImage = !!imageSrc;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <div className="group relative overflow-hidden transition-all duration-200 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md">
        {/* top accent bar */}
        <div className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 bg-gold" />

        <div className="flex flex-col sm:flex-row">
          {/* Image banner */}
          <div className="relative w-full shrink-0 overflow-hidden sm:w-44 sm:min-h-[260px] bg-slate-50">
            <div className="relative h-48 w-full sm:h-full">
              {hasImage ? (
                <Image
                  src={imageSrc}
                  alt={university.name}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 176px"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                  <Building2 className="size-10 text-slate-300" />
                  <span className="text-xs font-semibold text-slate-400">
                    {university.shortName || "MBBS"}
                  </span>
                </div>
              )}
            </div>

            <div className="absolute left-3 top-3">
              <UniversityTypeBadge type={university.type} />
            </div>
          </div>

          {/* Contents */}
          <div className="flex min-w-0 flex-1 flex-col p-5 justify-between">
            <div className="space-y-3">
              <div className="min-w-0">
                <h3 className="text-base font-bold text-[#1A153A] leading-snug truncate">
                  {university.name}
                </h3>
                {university.shortName && (
                  <span className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
                    {university.shortName}
                  </span>
                )}
              </div>

              {university.content?.shortDescription && (
                <p className="line-clamp-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {university.content.shortDescription}
                </p>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-semibold bg-slate-100 text-slate-500">
                  <Calendar className="size-3" />
                  {formatEstablished(university.establishedYear)}
                </span>
                <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-semibold bg-slate-100 text-slate-500">
                  <GraduationCap className="size-3" />
                  {university.academic?.medium || "English"}
                </span>
                {university.location?.city && (
                  <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-semibold bg-slate-100 text-slate-500 block truncate max-w-[140px]">
                    <MapPin className="size-3" />
                    {university.location.city}
                  </span>
                )}
              </div>

              {/* Approvals */}
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-bold text-emerald-600">
                <span className="flex items-center gap-1">
                  <CheckCircle className="size-3" /> NMC
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="size-3 text-blue-500" /> WHO
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="size-3 text-purple-500" /> ECFMG
                </span>
              </div>
            </div>

            <div className="pt-5 border-t border-slate-100 flex items-center gap-2 mt-4">
              <button
                onClick={() =>
                  onApply(`${university.slug}?apply=true`)
                }
                className="flex-1 py-2 px-3 text-center text-xs font-bold text-white rounded-lg transition-all duration-150 active:scale-[0.98] bg-gold"
              >
                Apply Now
              </button>
              <button
                onClick={() => onViewDetails(university.slug)}
                className="flex-1 py-2 px-3 text-center text-xs font-bold text-[#1A153A] border rounded-lg transition-all duration-150 bg-transparent border-slate-200 hover:border-[#1A153A]"
              >
                View details
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
