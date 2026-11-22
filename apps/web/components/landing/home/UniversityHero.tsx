"use client"

import { Button } from "@/ui"

export function UniversityHero() {
  return (
    <section className="relative py-20 overflow-hidden bg-navy">
      <div className="absolute inset-0 bg-gradient-to-br from-royal-blue/20 to-transparent" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-royal-blue/20 text-royal-blue text-sm font-medium mb-6">
            Admissions Open 2026-27
          </span>
          <h1 className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
            Study <span className="text-royal-blue">MBBS</span> in Kyrgyzstan
          </h1>
          <p className="text-lg text-white/70 mb-8 max-w-3xl mx-auto leading-relaxed">
            Affordable MBBS programs at NMC-approved universities. 
            Quality education with global recognition.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="h-[48px] px-[28px] text-base">
              Apply Now
            </Button>
            <Button variant="secondary" className="h-[48px] px-[28px] text-base border-white/20 text-navy bg-white hover:bg-white/90">
              Talk to Counsellor
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

