"use client"

const advantages = [
  {
    title: "Affordability",
    description: "Kyrgyzstan is the most affordable option after Russia among all the MBBS abroad destinations. The total course fee ranges from ₹15-25 Lacs.",
  },
  {
    title: "NMC Guidelines",
    description: "Few Medical Colleges in Kyrgyzstan fulfil all the New NMC guidelines laid for the Licensing Exam in India (NExT).",
  },
  {
    title: "Medicine Syllabus",
    description: "The curriculum of the MBBS program in Kyrgyzstan covers all 19 subjects, similar to that offered in the Indian Medical Colleges.",
  },
  {
    title: "Internship",
    description: "The total period of the MBBS course dedicated to clinical exposure amounts to 1 year, which is as per the NMC requirements.",
  },
  {
    title: "Safety",
    description: "Kyrgyzstan values tradition and family ties, so there is no racism or religious discrimination. Indian students feel safe and welcome.",
  },
  {
    title: "Global Recognition",
    description: "Medical universities in Kyrgyzstan are recognized by NMC, WHO, ECFMG, and other global medical councils.",
  },
]

export function UniversityAdvantages() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2D2154] mb-4">
            Advantages to Study MBBS in Kyrgyzstan
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Multiple advantages make Kyrgyzstan a preferred destination for Indian medical aspirants
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-[#E0D8F0] bg-white p-6 transition-all hover:border-[#F0A030]/50 hover:shadow-lg"
            >
              <h3 className="text-lg font-semibold text-[#2D2154] mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
