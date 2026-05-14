"use client";

import { Card, CardContent } from "@/components/ui/card";

export function Features() {
  const features = [
    {
      title: "Student Dashboard",
      description: "Centralized view of all your admission activities"
    },
    {
      title: "Document Management",
      description: "Upload, track, and review all documents securely"
    },
    {
      title: "Application Stage Tracking",
      description: "Clear progress visualization through each stage"
    },
    {
      title: "Payment Milestones",
      description: "Transparent payment process with deadlines"
    },
    {
      title: "Admin Review Flow",
      description: "Professional review process with feedback"
    },
    {
      title: "Notifications",
      description: "Real-time alerts for important updates"
    },
    {
      title: "Agent Management",
      description: "Seamless coordination with your admission agent"
    },
    {
      title: "Admission Letter Updates",
      description: "Access to invitation and admission letters"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Platform Features
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Comprehensive tools designed to streamline your medical university admission process.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border border-gray-200 hover:border-primary/50 transition-colors duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-primary/10 rounded-full">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">
                        {index + 1}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}