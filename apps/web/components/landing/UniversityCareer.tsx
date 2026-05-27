"use client"

import { Card } from "@repo/ui"
import { Stethoscope, Microscope, HeartPulse, Building, GraduationCap } from "lucide-react"

const careers = [
  {
    title: "MD / MS Specialization",
    description: "Most popular choice after completing MBBS from Kyrgyzstan. Pursue postgraduate specializations in various medical fields.",
    icon: <Stethoscope className="size-6" />,
  },
  {
    title: "Clinical Research",
    description: "Medical doctors can involve in clinical research programs organized by AIIMS, TIFR, Indian Council for Medical Research, etc.",
    icon: <Microscope className="size-6" />,
  },
  {
    title: "Field Experience",
    description: "Candidates who strive to work for field experience will get opportunity to work in primary health centers or with NGOs.",
    icon: <HeartPulse className="size-6" />,
  },
  {
    title: "Own Practice",
    description: "Start your own venture in your respective country. Students can opt for a personal clinic to practice after graduation.",
    icon: <Building className="size-6" />,
  },
]

export function UniversityCareer() {
  return (
    <section className="py-20 bg-[#F8F6FC]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2D2154] mb-4">
            Career Options After MBBS
          </h2>
          <p className="text-gray-600 leading-relaxed">
            After graduating from Kyrgyzstan medical universities, students can choose from various medical domains
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {careers.map((career) => (
            <Card key={career.title} className="border border-[#E0D8F0] hover:border-[#F0A030]/50 transition-all text-center p-6">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#F0A030]/10 text-[#F0A030] mb-4">
                {career.icon}
              </div>
              <h3 className="text-lg font-semibold text-[#2D2154] mb-3">{career.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{career.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

