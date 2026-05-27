"use client"

import { Card, CardContent } from "@repo/ui"

const keyFeatures = [
  { label: "Intake for MBBS Course", value: "September - October" },
  { label: "Course Duration", value: "5.8 Years (incl. 1 year internship)" },
  { label: "Tuition Fee (total)", value: "₹15 - 25 Lacs" },
  { label: "Medium of Instruction", value: "English" },
  { label: "University Recognition", value: "NMC, WHO, ECFMG Approved" },
  { label: "Indian Students", value: "16,000+" },
]

export function UniversityOverview() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#2D2154] mb-6">
              MBBS in Kyrgyzstan
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Kyrgyzstan, situated in Central Asia, was part of the former USSR, which became independent in 1991. 
              90% of the population follows Islam. Kyrgyzstan is a very popular choice among Indian Students due 
              to the affordability of the MBBS Program.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              An MBBS in Kyrgyzstan is a highly sought-after option for Indian students seeking to study MBBS Abroad. 
              Since 2016, India has witnessed a sudden surge of students seeking Medicine degrees in Kyrgyzstan, 
              cementing its status as a top destination for MBBS education after Russia.
            </p>
            <p className="text-gray-600 leading-relaxed">
              The MBBS course in Kyrgyzstan runs for a total of 6 years including 1 year of internship. 
              The cost for this whole Medicine course is around 12 lakh to 15 lakh.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {keyFeatures.map((feature) => (
              <Card key={feature.label} className="border border-[#E0D8F0]">
                <CardContent className="p-5">
                  <p className="text-sm text-[#6B6B6B] mb-1">{feature.label}</p>
                  <p className="text-base font-semibold text-[#2D2154]">{feature.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

