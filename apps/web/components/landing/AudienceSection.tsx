"use client";

import { Card, CardContent } from "@/components/ui/card";

export function AudienceSection() {
  const audiences = [
    {
      title: "Students",
      description: "Track your application progress, manage documents, and stay informed about next steps"
    },
    {
      title: "Parents",
      description: "Stay updated on their child's admission journey with secure access and notifications"
    },
    {
      title: "Admission Agents",
      description: "Streamline your workflow with centralized student management and communication tools"
    },
    {
      title: "University/Admin Teams",
      description: "Efficiently process applications with our professional, transparent workflow system"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            For Everyone Involved
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Our platform serves the entire medical admission ecosystem with tailored experiences for each stakeholder.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {audiences.map((audience, index) => (
            <Card key={index} className="border border-gray-200 hover:border-primary/50 transition-colors duration-300">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-lg">
                      {audience.title.charAt(0)}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{audience.title}</h3>
                <p className="text-gray-600">{audience.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}