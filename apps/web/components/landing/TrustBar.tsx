"use client";

import { Shield, Lock, Eye, Clock, CheckCircle, Users } from "lucide-react";

export function TrustBar() {
  const trustItems = [
    {
      title: "Secure Document Handling",
      description: "All documents encrypted and stored securely"
    },
    {
      title: "Transparent Process",
      description: "Clear steps and updates at every stage"
    },
    {
      title: "Stage-wise Tracking",
      description: "Monitor progress through each admission stage"
    },
    {
      title: "Real-time Updates",
      description: "Instant notifications for status changes"
    },
    {
      title: "Admin Reviewed Applications",
      description: "Every submission checked by experts"
    },
    {
      title: "Multi-user Access",
      description: "Parents, agents, and admins all connected"
    }
  ];

  return (
    <section className="py-8 bg-gray-50 border-y border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {trustItems.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center p-4">
              <div className="bg-primary/10 text-primary p-3 rounded-full mb-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">
                    {index + 1}
                  </span>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-gray-500">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}