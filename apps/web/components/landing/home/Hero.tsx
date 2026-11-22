"use client";

import { Button } from "@/ui";
import { Card, CardContent } from "@/ui";

export function Hero() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-medium text-slate-600 mb-6 tracking-wide uppercase">
            Premium Medical Admission Platform
          </p>
          
          <h1 className="mb-6 text-4xl font-medium leading-[1.05] tracking-tight text-navy sm:text-5xl md:text-[72px]" style={{ letterSpacing: '-1.4px' }}>
            Your Medical University Admission Journey, <span className="text-navy">Simplified</span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Manage applications, documents, payments, and admission progress from one secure platform built for students, parents, agents, and admission teams.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Button className="h-[42px] px-[22px] py-[10px] text-[15px]">
              Start Your Application
            </Button>
            <Button variant="secondary" className="h-[42px] px-[22px] py-[10px] text-[15px]">
              Talk to Counsellor
            </Button>
          </div>
          
          {/* Dashboard preview - Intercom product mockup card */}
          <div className="relative">
            <div className="bg-white rounded-xl border border-border p-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-error"></div>
                  <div className="w-3 h-3 rounded-full bg-champagne-gold"></div>
                  <div className="w-3 h-3 rounded-full bg-success-bright"></div>
                </div>
                <div className="text-sm text-slate-600">Application Dashboard</div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card size="default">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-ice-grey flex items-center justify-center">
                        <span className="text-navy font-medium">1</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-navy">Profile Setup</h3>
                        <p className="text-sm text-slate-600">Completed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card size="default">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-ice-grey flex items-center justify-center">
                        <span className="text-navy font-medium">2</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-navy">Document Upload</h3>
                        <p className="text-sm text-slate-600">In Review</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card size="default">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-ice-grey flex items-center justify-center">
                        <span className="text-navy font-medium">3</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-navy">Payment</h3>
                        <p className="text-sm text-slate-600">Pending</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-navy">Overall Progress</span>
                  <span className="text-sm font-medium text-navy">65%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-[6px]">
                  <div className="bg-navy h-[6px] rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
