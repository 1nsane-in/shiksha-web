"use client";

import { Card, CardContent } from "@/components/ui/card";

export function SolutionSection() {
  const solutions = [
    {
      title: "One Student Dashboard",
      description: "Centralized view of all your admission activities in one place"
    },
    {
      title: "Step-by-Step Workflow",
      description: "Clear progression through each admission stage with guidance"
    },
    {
      title: "Document Management",
      description: "Upload, track, and review all documents in one secure location"
    },
    {
      title: "Payment Milestone Tracking",
      description: "Transparent payment process with clear deadlines and progress"
    },
    {
      title: "Admission Progress Tracking",
      description: "Real-time updates on application status and next steps"
    },
    {
      title: "Agent/Admin Communication",
      description: "Direct messaging system for efficient coordination"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Our Solution
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            A streamlined, professional platform designed to eliminate confusion and simplify your medical university admission journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <Card key={index} className="border border-gray-200 hover:border-primary/50 transition-colors duration-300">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="mt-1">
                    <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                      <span className="text-teal-600 font-bold text-sm">✓</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{solution.title}</h3>
                    <p className="text-gray-600">{solution.description}</p>
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