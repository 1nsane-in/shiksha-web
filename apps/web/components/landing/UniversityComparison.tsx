"use client"

import { Card } from "@/components/ui/card"

const comparisons = [
  { parameter: "College Type", india: "Govt & Pvt", kyrgyzstan: "Govt & Pvt" },
  { parameter: "Tuition Fee (total)", india: "₹60 Lacs - 1.5 Cr", kyrgyzstan: "₹15 - 25 Lacs" },
  { parameter: "Duration", india: "4.5 + 1 Year", kyrgyzstan: "5 to 6 Years" },
  { parameter: "Degree Awarded", india: "MBBS", kyrgyzstan: "MD Physician" },
  { parameter: "Internship", india: "1 Year", kyrgyzstan: "0-1 Year" },
  { parameter: "Total Subjects", india: "19", kyrgyzstan: "19" },
  { parameter: "Medium of Instruction", india: "English", kyrgyzstan: "English" },
]

export function UniversityComparison() {
  return (
    <section className="py-20 bg-[#F8F6FC]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2D2154] mb-4">
            MBBS in Kyrgyzstan vs MBBS in India
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Compare the medical education systems and make an informed decision
          </p>
        </div>
        <Card className="max-w-4xl mx-auto overflow-hidden border border-[#E0D8F0]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#2D2154]">
                  <th className="px-6 py-4 text-left text-white font-medium">Parameter</th>
                  <th className="px-6 py-4 text-left text-white font-medium">India</th>
                  <th className="px-6 py-4 text-left text-white font-medium">Kyrgyzstan</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row, index) => (
                  <tr key={row.parameter} className={index % 2 === 0 ? "bg-white" : "bg-[#F8F6FC]"}>
                    <td className="px-6 py-4 text-[#2D2154] font-medium">{row.parameter}</td>
                    <td className="px-6 py-4 text-gray-600">{row.india}</td>
                    <td className="px-6 py-4 text-gray-600">{row.kyrgyzstan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </section>
  )
}
