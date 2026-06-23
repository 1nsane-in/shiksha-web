"use client";

import { useState } from "react";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronDown,
  Building,
  Globe,
  Star,
  Users,
  MessageSquare,
} from "lucide-react";

const offices = [
  {
    state: "Tamil Nadu",
    branches: [
      {
        name: "Chennai Head Office (Exclusive)",
        address: "No 1/151A, 1st Floor, Post Office Street, Pallavaram, 200 Feet Radial Rd, Thoraipakkam, Chennai, Tamil Nadu - 600097",
        phone: "+91 9994 123 120, +91 7550036020",
        email: "contact@wciecorganization.com",
      },
      {
        name: "Trichy Branch Office",
        address: "No 33A/1, ASS Complex, First Floor, Amalapuri colony, wireless road, K K Nagar, Trichy - 620021",
        phone: "+91 6383863518, +91 7845823549",
        email: "contact@wciecorganization.com",
      },
      {
        name: "Coimbatore Admission Office",
        address: "166, TV Samy Road West, RS Puram, Coimbatore - 641002",
        phone: "0422 4342 500, +91 9498088890",
        email: "contact@wciecorganization.com",
      },
    ],
  },
  {
    state: "Delhi & NCR",
    branches: [
      {
        name: "Shakarpur Office (Admission Center)",
        address: "#G-4, S-521-522, Moon House, School Block, Shakarpur, New Delhi, Delhi - 110092",
        phone: "+91 98113 85441, +91 7075001500",
        email: "contact@wciecorganization.com",
      },
      {
        name: "Lajpat Nagar Office",
        address: "B-25, 2nd Floor, Opposite Metro Pillar No.9, Above Bandhan Bank, Lajpat Nagar II, New Delhi - 110024",
        phone: "+91 8860637009",
        email: "contact@wciecorganization.com",
      },
      {
        name: "Connaught Place Office",
        address: "906, Tolstoy House, Tolstoy Rd, near Janpath Metro Station, Connaught Place, New Delhi - 110001",
        phone: "+91 9971001410",
        email: "contact@wciecorganization.com",
      },
    ],
  },
  {
    state: "Gujarat & Western India",
    branches: [
      {
        name: "Ahmedabad Head Office",
        address: "302, Span Trade Centre, Opp Kocharab Ashram, Paldi, Ellisbridge, Ahmedabad, Gujarat - 380007",
        phone: "+91 8460103497, +91 9978265556",
        email: "contact@wciecorganization.com",
      },
    ],
  },
  {
    state: "Rajasthan Office",
    branches: [
      {
        name: "Jaipur Head Office",
        address: "Plot no. 6, Shakti Nagar, 2nd Floor, Triveni Choraha, Gopalpura Bypass, Jaipur, Rajasthan - 302018",
        phone: "+91 7300323123, +91 9358323123",
        email: "contact@wciecorganization.com",
      },
    ],
  },
  {
    state: "Maharashtra (Nagpur & Pune)",
    branches: [
      {
        name: "Official State Head Office (Nagpur)",
        address: "Flat No. 201, 2nd Floor, Plot No. 430, Mrignayani Enclave, Sangam Talkies Square, Anand Nagar, Nagpur - 440009",
        phone: "+91 9673473797, +91 8282825079",
        email: "contact@wciecorganization.com",
      },
      {
        name: "Pune Wakad Office",
        address: "Office No. 102, First Floor, Icon Tower, Dange Chowk Road, Wakad, Pune - 411057",
        phone: "+91 9673473797",
        email: "contact@wciecorganization.com",
      },
    ],
  },
  {
    state: "Kerala Offices",
    branches: [
      {
        name: "Calicut Center",
        address: "Room No 532, Second floor, Emerald building, Near Big Bazar, Mavoor Road, Calicut, Kerala - 673004",
        phone: "+91 9388082020, +91 8892842121",
        email: "contact@wciecorganization.com",
      },
      {
        name: "Adoor Center",
        address: "KKI Building, K.P Road, Adoor, Pathanamthitta, Kerala",
        phone: "+91 9846573011, +91 9446330111",
        email: "contact@wciecorganization.com",
      },
      {
        name: "Trivandrum Center",
        address: "2nd Floor, Kuttoor Plaza, Thycaud, Thampanoor, Trivandrum, Kerala",
        phone: "+91 9645850000, +91 9048650000",
        email: "contact@wciecorganization.com",
      },
    ],
  },
  {
    state: "Central & Northern India",
    branches: [
      {
        name: "Chhattisgarh Center (Raipur)",
        address: "A-808, 8th Floor, Babylon Tower, VIP Square, Telibandha, Raipur, Chhattisgarh - 492006",
        phone: "+91 7995799579",
        email: "contact@wciecorganization.com",
      },
      {
        name: "Madhya Pradesh Center (Indore)",
        address: "Office No. 509, 5th Floor, Shekhar Central, AB Road, Manorama Ganj, Palasia Square, Indore - 452018",
        phone: "+91 7995799579",
        email: "contact@wciecorganization.com",
      },
      {
        name: "Punjab & Haryana (Chandigarh/Nuh)",
        address: "Booth no 99, Clockton Street, Phase-1, OMAXE, New Chandigarh, Punjab / Nuh, Haryana",
        phone: "+91 98764 67707, +91 9729228313",
        email: "contact@wciecorganization.com",
      },
    ],
  },
];

export default function ContactPage() {
  const [expandedState, setExpandedState] = useState<string | null>("Tamil Nadu");

  const toggleState = (stateName: string) => {
    setExpandedState((prev) => (prev === stateName ? null : stateName));
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FAF9F6] pt-24 sm:pt-28 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header Banner */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider bg-amber-50 text-[#C4953B] border border-amber-200/50 mb-4">
              <Building className="size-3.5" />
              15+ Physical Admission Offices
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1A153A] leading-tight tracking-tight">
              Find an Admission Center <span className="text-[#C4953B]">Near You</span>
            </h1>
            <p className="text-slate-500 mt-4 leading-relaxed text-sm sm:text-base">
              Need personal counselling? Parents and students can visit our local head offices across India for offline documents verification and free medical seat allocation.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-10">
            {/* Left side: Quick admission hotline */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 translate-x-12 -translate-y-12 rounded-full bg-[#C4953B]/5 pointer-events-none" />

                <h3 className="text-lg font-bold text-[#1A153A]">Counseling Hotline</h3>
                <p className="text-xs text-slate-400">Call us directly or send an email for instantaneous admissions routing support.</p>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-start gap-3.5">
                    <div className="size-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 border border-amber-100">
                      <Phone className="size-5 text-[#C4953B]" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block leading-none">Global Hotline</span>
                      <a href="tel:+996556611890" className="text-sm font-bold text-[#1A153A] mt-1 hover:text-[#C4953B] transition-colors duration-150">
                        +996 5566 11890
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="size-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 border border-amber-100">
                      <Phone className="size-5 text-[#C4953B]" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block leading-none">India Counsel Line</span>
                      <a href="tel:+919994123120" className="text-sm font-bold text-[#1A153A] mt-1 hover:text-[#C4953B] transition-colors duration-150">
                        +91 9994 123 120
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="size-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 border border-amber-100">
                      <Mail className="size-5 text-[#C4953B]" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block leading-none">Admissions Mail</span>
                      <a href="mailto:contact@wciecorganization.com" className="text-xs font-bold text-[#1A153A] mt-1 hover:text-[#C4953B] transition-colors duration-150 block truncate">
                        contact@wciecorganization.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#FAF9F6] border border-amber-200/40 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Star className="size-4 text-[#C4953B] fill-[#C4953B]" />
                  <h4 className="text-sm font-bold text-[#1A153A]">Our Legacy</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Founded in 2014, WCIEC has grown into a leading admissions advisor representing top government and private medical universities globally.
                </p>
                <div className="flex items-center gap-4 pt-2">
                  <div className="text-center bg-white p-2.5 rounded-lg border border-slate-100 flex-1">
                    <span className="text-lg font-extrabold text-[#1A153A] block">15+</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Years Exp</span>
                  </div>
                  <div className="text-center bg-white p-2.5 rounded-lg border border-slate-100 flex-1">
                    <span className="text-lg font-extrabold text-[#1A153A] block">12k+</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Students</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: State Accordion list */}
            <div className="lg:col-span-8 space-y-4">
              <h3 className="text-base font-bold uppercase tracking-wider text-slate-400 mb-2">
                Browse Offices By State
              </h3>

              <div className="space-y-3">
                {offices.map((group) => {
                  const isExpanded = expandedState === group.state;
                  return (
                    <div
                      key={group.state}
                      className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm transition-all duration-200"
                      style={{
                        borderColor: isExpanded ? "rgba(196, 149, 59, 0.2)" : "rgba(26, 21, 58, 0.04)",
                      }}
                    >
                      <button
                        onClick={() => toggleState(group.state)}
                        className="w-full flex items-center justify-between p-5 text-left font-bold text-sm sm:text-base text-[#1A153A] transition-colors duration-150 hover:bg-slate-50/50"
                      >
                        <span className="flex items-center gap-3">
                          <MapPin className="size-4 text-[#C4953B]" />
                          {group.state}
                          <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-bold">
                            {group.branches.length} {group.branches.length === 1 ? "Office" : "Offices"}
                          </span>
                        </span>
                        <ChevronDown
                          className="size-4 text-slate-400 transition-transform duration-200"
                          style={{
                            transform: isExpanded ? "rotate(180deg)" : "rotate(0)",
                          }}
                        />
                      </button>

                      {isExpanded && (
                        <div className="border-t border-slate-50 p-5 space-y-6 bg-slate-50/20">
                          {group.branches.map((branch, i) => (
                            <div
                              key={branch.name}
                              className={`space-y-2 pb-5 last:pb-0 ${
                                i < group.branches.length - 1 ? "border-b border-dashed border-slate-200" : ""
                              }`}
                            >
                              <h4 className="text-sm font-bold text-[#1A153A] flex items-center gap-1.5">
                                <Building className="size-3.5 text-[#C4953B]" />
                                {branch.name}
                              </h4>
                              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed pl-5">
                                {branch.address}
                              </p>
                              <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-xs text-slate-400 pl-5 pt-1">
                                <span className="flex items-center gap-1">
                                  <Phone className="size-3 text-[#C4953B]" />
                                  {branch.phone}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Mail className="size-3 text-[#C4953B]" />
                                  {branch.email}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
