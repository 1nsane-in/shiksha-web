"use client"

import { CheckCircle } from "lucide-react"

const eligibilities = [
  "Applicant must have completed 17 years of age to be eligible for applying to the course.",
  "Mental and physical condition of the candidate has to be fit and stable to continue the studies.",
  "Score of the candidate must be above 50% in 12th science from recognized boards like CBSE/HSC or ISC.",
  "Student must have opted for PCB (Physics, Chemistry, Biology) subjects in higher secondary education.",
  "Students must be ready with all important academic documents, certificates, and NEET qualification scorecard.",
]

const steps = [
  { step: "Step 1", title: "Online Application", description: "The admission process starts with the online application available at the university's official site." },
  { step: "Step 2", title: "Document Submission", description: "Submission of the documents as per the specifications mentioned by the university." },
  { step: "Step 3", title: "Admission Letter", description: "University will issue an admission letter as confirmation of application acceptance." },
  { step: "Step 4", title: "Study Visa", description: "Apply for a study visa to get entry rights in Kyrgyzstan for MBBS education." },
  { step: "Step 5", title: "Indian Embassy", description: "Contact the Indian Embassy office in Kyrgyzstan to discuss further details." },
  { step: "Step 6", title: "Relocate", description: "Legally relocate to Kyrgyzstan to pursue your higher studies in medicine." },
]

const documents = [
  "Valid passport with a blank page",
  "Passport size photos (Colorful on plain white background)",
  "A receipt of visa application fees",
  "A letter of recommendation from the home country",
  "Marksheets of 10th & 12th academic year (Scanned copy)",
  "No objection certificate from the parents/guardians",
  "A copy of the Birth Certificate",
  "Medical clearance record (HIV & Covid-19)",
  "A certificate showing a non-criminal record of the candidate",
]

export function UniversityProcess() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Eligibility */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2D2154] mb-8 text-center">
            Eligibility Criteria
          </h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-10">
            Below are the few eligibility criteria one should perfectly fit to study MBBS in Kyrgyzstan
          </p>
          <div className="max-w-3xl mx-auto space-y-4">
            {eligibilities.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="size-5 text-[#F0A030] mt-0.5 shrink-0" />
                <p className="text-gray-600 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Admission Process */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2D2154] mb-4 text-center">
            Admission Process
          </h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-10">
            Easy steps to help you with the application procedure to study MBBS in Kyrgyzstan
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((item) => (
              <div key={item.step} className="rounded-xl border border-[#E0D8F0] bg-[#F8F6FC] p-6">
                <span className="inline-block px-3 py-1 rounded-full bg-[#F0A030]/10 text-[#F0A030] text-xs font-medium mb-3">
                  {item.step}
                </span>
                <h3 className="text-lg font-semibold text-[#2D2154] mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Documents Required */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#2D2154] mb-8 text-center">
            Documents Required
          </h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-10">
            Students need to have notarized copies of the documents mentioned below
          </p>
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc, index) => (
              <div key={index} className="flex items-start gap-3 rounded-lg border border-[#E0D8F0] p-4">
                <CheckCircle className="size-4 text-[#F0A030] mt-0.5 shrink-0" />
                <p className="text-gray-600 text-sm">{doc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
