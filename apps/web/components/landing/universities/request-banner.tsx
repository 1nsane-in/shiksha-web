"use client";

import React from "react";
import { Building2, ArrowRight } from "lucide-react";

/**
 * Bottom CTA banner prompting users to request an unlisted university.
 */
export function RequestBanner({
  onRequestUniversity,
}: {
  onRequestUniversity: () => void;
}) {
  return (
    <div className="max-w-5xl mx-auto mt-16">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1A153A] via-[#2d2652] to-[#1A153A] border border-gold/20">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-gold blur-3xl" />
          <div className="absolute -left-20 -bottom-20 w-48 h-48 rounded-full bg-gold blur-3xl" />
        </div>

        <div className="relative px-6 py-8 sm:px-10 sm:py-10 flex flex-col sm:flex-row items-center gap-6">
          {/* Icon */}
          <div className="shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center">
              <Building2 className="w-8 h-8 text-gold" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-bold text-gold mb-2">
              Can&apos;t Find Your University?
            </h3>
            <p className="text-sm text-white/80 leading-relaxed max-w-xl">
              If the university you&apos;re looking for isn&apos;t listed in
              our directory, let us know and our team will research and add it
              to our database within 24-48 hours.
            </p>
          </div>

          {/* CTA Button */}
          <div className="shrink-0">
            <button
              onClick={onRequestUniversity}
              className="group inline-flex items-center gap-2 px-6 py-3 bg-gold hover:bg-[#b0852f] text-[#1A153A] font-bold text-sm rounded-xl transition-all duration-200 active:scale-[0.98] whitespace-nowrap"
            >
              <span>Request University</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
