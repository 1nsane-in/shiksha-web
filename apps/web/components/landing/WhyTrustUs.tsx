"use client";

import { Card, CardContent } from "@repo/ui";

export function WhyTrustUs() {
  const trustPoints = [
    {
      title: "Transparent Process",
      description: "Every step of your admission journey is clearly outlined and visible to you"
    },
    {
      title: "Document Review",
      description: "All documents are professionally reviewed by our expert team"
    },
    {
      title: "Secure File Handling",
      description: "Military-grade encryption for all your sensitive documents"
    },
    {
      title: "Clear Stage Updates",
      description: "Regular, timely updates on your application progression"
    },
    {
      title: "No Hidden Confusion",
      description: "We eliminate ambiguity with clear, consistent communication"
    },
    {
      title: "Multi-User Access",
      description: "Designed for students, parents, agents, and university teams"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Why Trust Us
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            We've built this platform with trust at its core. Every feature is designed to give you peace of mind throughout your admission journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trustPoints.map((point, index) => (
            <Card key={index} className="border border-gray-200 hover:border-primary/50 transition-colors duration-300">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="mt-1">
                    <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                      <span className="text-teal-600 font-bold text-sm">✓</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{point.title}</h3>
                    <p className="text-gray-600">{point.description}</p>
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
