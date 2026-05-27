"use client";

import { Card, CardContent } from "@repo/ui";

export function ProblemSection() {
  const problems = [
    {
      title: "Confusing Admission Steps",
      description: "Too many scattered processes with unclear next steps"
    },
    {
      title: "Scattered Document Communication",
      description: "Documents sent via email, WhatsApp, and various platforms"
    },
    {
      title: "No Clear Payment Visibility",
      description: "Unclear payment milestones and deadlines"
    },
    {
      title: "Delayed Updates",
      description: "Long waits for status changes and feedback"
    },
    {
      title: "Lack of Transparent Tracking",
      description: "No clear visibility into application progress"
    },
    {
      title: "Dependency on Manual Follow-ups",
      description: "Constantly chasing administrators for updates"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            The Problems Students Face
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            We understand the challenges you encounter when navigating the complex medical university admission process.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <Card key={index} className="border border-gray-200 hover:border-primary/50 transition-colors duration-300">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="mt-1">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                      <span className="text-red-500 font-bold text-sm">!</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{problem.title}</h3>
                    <p className="text-gray-600">{problem.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
