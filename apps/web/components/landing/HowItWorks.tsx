"use client";

import { Card, CardContent } from "@/components/ui/card";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Create Your Profile",
      description: "Set up your personal and academic information in seconds"
    },
    {
      number: "02",
      title: "Upload Required Documents",
      description: "Securely upload all necessary documents in one place"
    },
    {
      number: "03",
      title: "Application Review",
      description: "Our team reviews your application and provides feedback"
    },
    {
      number: "04",
      title: "Complete Payment Milestones",
      description: "Track and manage all payment stages with transparency"
    },
    {
      number: "05",
      title: "Track Admission Progress",
      description: "Monitor your application status in real-time"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            A simple, step-by-step process to guide you through your medical university admission journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="border border-gray-200 hover:border-primary/50 transition-colors duration-300">
              <CardContent className="p-6 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-primary font-bold text-xl">{step.number}</span>
                </div>
                <div className="flex justify-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">
                      {index + 1}
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}