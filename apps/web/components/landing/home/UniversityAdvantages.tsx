"use client";

import { useState } from "react";
import {
  Home,
  Utensils,
  ShieldCheck,
  ChefHat,
  Tv,
  Wifi,
  Coffee,
  HeartHandshake,
} from "lucide-react";

const advantages = [
  {
    title: "Affordability",
    description: "Kyrgyzstan is the most affordable option after Russia among all the MBBS abroad destinations. The total course fee ranges from ₹15-25 Lacs.",
  },
  {
    title: "NMC Guidelines",
    description: "Few Medical Colleges in Kyrgyzstan fulfil all the New NMC guidelines laid for the Licensing Exam in India (NExT).",
  },
  {
    title: "Medicine Syllabus",
    description: "The curriculum of the MBBS program in Kyrgyzstan covers all 19 subjects, similar to that offered in the Indian Medical Colleges.",
  },
  {
    title: "Internship",
    description: "The total period of the MBBS course dedicated to clinical exposure amounts to 1 year, which is as per the NMC requirements.",
  },
  {
    title: "Safety",
    description: "Kyrgyzstan values tradition and family ties, so there is no racism or religious discrimination. Indian students feel safe and welcome.",
  },
  {
    title: "Global Recognition",
    description: "Medical universities in Kyrgyzstan are recognized by NMC, WHO, ECFMG, and other global medical councils.",
  },
];

export function UniversityAdvantages() {
  const [activeTab, setActiveTab] = useState<"hostel" | "mess">("hostel");

  return (
    <section className="py-20 bg-white border-t border-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Core Advantages */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A153A] mb-4">
            Advantages to Study MBBS in Kyrgyzstan
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Multiple advantages make Kyrgyzstan a preferred destination for Indian medical aspirants
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {advantages.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-slate-100 bg-slate-50/50 p-6 transition-all duration-200 hover:border-[#C4953B]/50 hover:bg-white hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-[#1A153A] mb-3">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed text-sm">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Hostel & Mess Showcase Tabs */}
        <div className="bg-[#FAF9F6] rounded-2xl border border-amber-200/40 p-6 sm:p-10 max-w-5xl mx-auto shadow-sm">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-[#1A153A] mb-2">Student Life & Comfort Abroad</h3>
            <p className="text-sm text-slate-500">We ensure homeland comforts, safety, and hygiene so students thrive academically.</p>
          </div>

          {/* Tab buttons */}
          <div className="flex justify-center border-b border-slate-200/60 mb-8 max-w-sm mx-auto">
            <button
              onClick={() => setActiveTab("hostel")}
              className="flex-1 py-3 text-center text-sm font-bold border-b-2 transition-all duration-150 flex items-center justify-center gap-2"
              style={{
                borderColor: activeTab === "hostel" ? "#C4953B" : "transparent",
                color: activeTab === "hostel" ? "#1A153A" : "#6B6599",
              }}
            >
              <Home className="size-4" />
              Secure Hostels
            </button>
            <button
              onClick={() => setActiveTab("mess")}
              className="flex-1 py-3 text-center text-sm font-bold border-b-2 transition-all duration-150 flex items-center justify-center gap-2"
              style={{
                borderColor: activeTab === "mess" ? "#C4953B" : "transparent",
                color: activeTab === "mess" ? "#1A153A" : "#6B6599",
              }}
            >
              <Utensils className="size-4" />
              Indian Food Mess
            </button>
          </div>

          {/* Tab content showcase */}
          {activeTab === "hostel" ? (
            <div className="grid md:grid-cols-12 gap-8 items-center animate-fadeIn">
              <div className="md:col-span-7 space-y-4">
                <h4 className="text-lg font-bold text-[#1A153A] flex items-center gap-2">
                  <ShieldCheck className="size-5 text-[#C4953B]" />
                  Separate, Fully Managed Safe Hostels
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Adjusting to a new country is simple with our secure, fully furnished student hostels. We prioritize privacy, strict discipline, and top-tier maintenance for both boys and girls.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex items-start gap-2.5 text-xs text-slate-600">
                    <ShieldCheck className="size-4 text-[#C4953B] shrink-0 mt-0.5" />
                    <span>24/7 Guards & CCTV Surveillance</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-600">
                    <Wifi className="size-4 text-[#C4953B] shrink-0 mt-0.5" />
                    <span>High-Speed Wi-Fi & Study Rooms</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-600">
                    <Tv className="size-4 text-[#C4953B] shrink-0 mt-0.5" />
                    <span>Common Lounge & Recreational Area</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-600">
                    <Coffee className="size-4 text-[#C4953B] shrink-0 mt-0.5" />
                    <span>Laundry Rooms & Hot Water Supply</span>
                  </div>
                </div>
              </div>
              <div className="md:col-span-5 border border-amber-200/20 rounded-xl overflow-hidden shadow-sm bg-white p-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C4953B] bg-amber-100/60 px-2 py-1 rounded">Hostel Policy</span>
                <h5 className="font-bold text-sm text-[#1A153A] mt-3 mb-2">Strict Safety Norms</h5>
                <ul className="text-xs text-slate-500 space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="size-1 bg-[#C4953B] rounded-full" />
                    Separate wings/buildings for boys and girls
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-1 bg-[#C4953B] rounded-full" />
                    Strict warden supervision & curfew hours
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-1 bg-[#C4953B] rounded-full" />
                    Regular sanitization & weekly room cleaning
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-12 gap-8 items-center animate-fadeIn">
              <div className="md:col-span-7 space-y-4">
                <h4 className="text-lg font-bold text-[#1A153A] flex items-center gap-2">
                  <ChefHat className="size-5 text-[#C4953B]" />
                  Hygienic Indian Food Prepared by Native Chefs
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Never miss home-cooked comfort. Our modern university mess services serve freshly prepared, authentic Indian vegetarian and non-vegetarian cuisine under strict dietary guidelines.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex items-start gap-2.5 text-xs text-slate-600">
                    <ChefHat className="size-4 text-[#C4953B] shrink-0 mt-0.5" />
                    <span>Experienced Cooks from India</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-600">
                    <Coffee className="size-4 text-[#C4953B] shrink-0 mt-0.5" />
                    <span>Pure Vegetarian & Non-Veg separate sections</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-600">
                    <Utensils className="size-4 text-[#C4953B] shrink-0 mt-0.5" />
                    <span>Fresh daily deliveries of groceries & spices</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-600">
                    <HeartHandshake className="size-4 text-[#C4953B] shrink-0 mt-0.5" />
                    <span>Custom menu for national festivals</span>
                  </div>
                </div>
              </div>
              <div className="md:col-span-5 border border-amber-200/20 rounded-xl overflow-hidden shadow-sm bg-white p-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C4953B] bg-amber-100/60 px-2 py-1 rounded">Meal Schedule</span>
                <h5 className="font-bold text-sm text-[#1A153A] mt-3 mb-2">3 Wholesome Meals Daily</h5>
                <ul className="text-xs text-slate-500 space-y-2">
                  <li className="flex justify-between border-b pb-1 border-slate-100">
                    <span>Breakfast:</span> <span className="font-semibold text-slate-700">Teas, Parathas, Eggs, Poha</span>
                  </li>
                  <li className="flex justify-between border-b pb-1 border-slate-100">
                    <span>Lunch:</span> <span className="font-semibold text-slate-700">Roti, Dal, Rice, Subzi, Salad</span>
                  </li>
                  <li className="flex justify-between pb-1">
                    <span>Dinner:</span> <span className="font-semibold text-slate-700">Roti, Chicken/Paneer, Veg, Rice</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
