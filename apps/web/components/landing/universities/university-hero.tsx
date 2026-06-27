import React from "react";
import { Star } from "lucide-react";

/**
 * Hero banner with badge, headline, and description for the public universities listing page.
 */
export function UniversityHero() {
  return (
    <div className="text-center max-w-3xl mx-auto mb-16">
      <span className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider bg-amber-50 text-gold border border-amber-200/50 mb-4">
        <Star className="size-3.5 fill-gold" />
        NMC, WHO & ECFMG Approved
      </span>
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1A153A] leading-tight tracking-tight">
        Our Partner <span className="text-gold">Medical Universities</span>
      </h1>
      <p className="text-slate-500 mt-4 leading-relaxed text-sm sm:text-base">
        Explore premier government and private medical universities in
        Kyrgyzstan. Low-cost English medium MBBS programs fully compliant with
        NMC directives.
      </p>
    </div>
  );
}
