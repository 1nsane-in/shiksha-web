"use client";

import { Card, CardContent } from "@repo/ui";
import { ShieldCheck, BookOpen, GraduationCap, CheckCircle2, UserCheck, Star } from "lucide-react";

export function WhyTrustUs() {
  const trustPoints = [
    {
      title: "Transparent Process",
      description: "Every step of your admission journey is clearly outlined and visible to you",
    },
    {
      title: "Document Review",
      description: "All documents are professionally reviewed by our expert team",
    },
    {
      title: "Secure File Handling",
      description: "Military-grade encryption for all your sensitive documents",
    },
    {
      title: "Clear Stage Updates",
      description: "Regular, timely updates on your application progression",
    },
    {
      title: "No Hidden Confusion",
      description: "We eliminate ambiguity with clear, consistent communication",
    },
    {
      title: "Multi-User Access",
      description: "Designed for students, parents, agents, and university teams",
    },
  ];

  const facultyBoard = [
    {
      name: "Dr. Deepak Marwah",
      role: "Eminent Faculty for General Medicine",
      spec: "General Medicine specialist, renowned national FMGE trainer with 15+ years of coaching success.",
    },
    {
      name: "Dr. Rajiv Dhawan",
      role: "Distinguished Faculty for ENT",
      spec: "ENT master educator, helping foreign graduates crack clinical licensing questions with high-yield focus.",
    },
    {
      name: "Dr. Ashwini Ranjan",
      role: "Eminent Faculty for PSM",
      spec: "Preventive & Social Medicine authority, offering strategic, comprehensive guidance on community health topics.",
    },
  ];

  return (
    <section className="py-20 bg-slate-50/50 border-t border-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Why Trust Us Headers */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A153A] mb-4">
            Why Trust Shiksha (WCIEC)
          </h2>
          <p className="text-slate-600 leading-relaxed">
            We are more than an admissions portal; we are a lifelong mentor in your global medical education.
          </p>
        </div>

        {/* Trust pillars grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {trustPoints.map((point, index) => (
            <Card
              key={index}
              className="border border-slate-100 shadow-sm transition-all duration-200 hover:shadow-md hover:border-[#C4953B]/50"
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="shrink-0">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                      <CheckCircle2 className="size-4 text-emerald-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#1A153A] mb-1.5">{point.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{point.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FMGE/NExT Faculty Section */}
        <div className="bg-white rounded-2xl border border-slate-100 p-8 sm:p-12 shadow-sm">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider bg-amber-50 text-[#C4953B] border border-amber-200/50 mb-4">
              <Star className="size-3 fill-[#C4953B]" />
              In-Campus Licensing Exam Coaching
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#1A153A] mb-4">
              Meet Our Eminent FMGE / NExT Faculty Board
            </h3>
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
              We resolve your biggest returning barrier. Shiksha provides expert, on-site licensing exam coaching delivered by India&apos;s top-tier doctors and educators directly inside Kyrgyzstan partner campuses.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {facultyBoard.map((fac) => (
              <div
                key={fac.name}
                className="flex flex-col h-full bg-[#FAF9F6] border border-slate-100 p-6 rounded-xl relative overflow-hidden transition-all duration-200 hover:border-[#C4953B]/30"
              >
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-24 h-24 translate-x-12 -translate-y-12 rounded-full bg-[#C4953B]/5 shrink-0" />

                <div className="size-12 rounded-full bg-amber-100/60 flex items-center justify-center shrink-0 mb-5 border border-amber-200/40">
                  <UserCheck className="size-6 text-[#C4953B]" />
                </div>

                <h4 className="text-lg font-bold text-[#1A153A] mb-1 leading-snug">
                  {fac.name}
                </h4>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#C4953B] block mb-4">
                  {fac.role}
                </span>

                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-auto">
                  {fac.spec}
                </p>
              </div>
            ))}
          </div>

          {/* FMGE stat banner */}
          <div className="mt-10 p-5 rounded-xl border border-dashed border-amber-200/60 bg-amber-50/20 text-center text-xs text-slate-500 max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3">
            <BookOpen className="size-5 text-[#C4953B] shrink-0" />
            <span>
              <strong>Guaranteed Prep Pathway:</strong> Curriculum covers all 19 clinical and non-clinical subjects, integrated with rigorous weekly assessments and regular simulated mock tests.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
