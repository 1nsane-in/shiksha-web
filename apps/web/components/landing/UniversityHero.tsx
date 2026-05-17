"use client"

import { Button } from "@/components/ui/button"

export function UniversityHero() {
  return (
    <section className="relative py-20 overflow-hidden bg-[#2D2154]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#4B2D8E]/20 to-transparent" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#F0A030]/20 text-[#F0A030] text-sm font-medium mb-6">
            Admissions Open 2026-27
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Study <span className="text-[#F0A030]">MBBS</span> in Kyrgyzstan
          </h1>
          <p className="text-lg text-white/70 mb-8 max-w-3xl mx-auto leading-relaxed">
            Affordable MBBS programs at NMC-approved universities. 
            Quality education with global recognition.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="h-[48px] px-[28px] text-base">
              Apply Now
            </Button>
            <Button variant="secondary" className="h-[48px] px-[28px] text-base border-white/20 text-[#2D2154] bg-white hover:bg-white/90">
              Talk to Counsellor
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
