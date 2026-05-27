"use client";

import { Button } from "@repo/ui";

export function FinalCTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-teal-600">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Start Your Admission Journey with Clarity and Confidence
          </h2>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed">
            Join thousands of students who have simplified their medical university admission process with our platform.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105">
              Start Application
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300">
              Contact Counsellor
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
