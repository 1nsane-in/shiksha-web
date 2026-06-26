import React from "react";
import { Phone, Mail, MapPin, Clock, ShieldCheck } from "lucide-react";
import { brand } from "@/lib/brand";

/**
 * Contact info sidebar with office details, hours, and a trust badge.
 * Used on the contact-us page alongside the request forms.
 */
export function ContactInfo() {
  const cards = [
    {
      icon: Phone,
      title: "Mobile Number",
      value: "+7 918 482-65-01",
    },
    {
      icon: Mail,
      title: "Email Address",
      value: "siksha.sabkaadhikaar@gmail.com",
    },
    {
      icon: MapPin,
      title: "Corporate Office",
      value: "WCIEC Corporate Towers, Suite 504, Sector 62, Noida, NCR, India",
    },
    {
      icon: Clock,
      title: "Consultation Hours",
      value: "Monday – Saturday: 9:00 AM – 6:30 PM",
      extra: "Online requests open 24/7",
    },
  ] as const;

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight" style={{ color: brand.ink }}>
          Contact Information
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: brand.inkMuted }}>
          Connect with our overseas medical consultants directly. We offer support with university shortlisting,
          MCI/NMC screening exam assistance, documentation, and student visa support.
        </p>
      </div>

      <div className="space-y-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="flex gap-4 p-4 rounded-xl border bg-white"
              style={{ borderColor: brand.hairline }}
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                style={{ background: brand.goldLight, color: brand.gold }}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold" style={{ color: brand.ink }}>
                  {card.title}
                </h4>
                <p className="text-sm mt-1" style={{ color: brand.inkMuted }}>
                  {card.value}
                </p>
                {card.extra && (
                  <p className="text-xs mt-0.5" style={{ color: brand.gold }}>
                    {card.extra}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust Badge */}
      <div className="p-4 rounded-xl flex items-center gap-3 bg-[#EEF2FF] border border-[#E0E7FF]">
        <ShieldCheck className="h-6 w-6 text-indigo-600 shrink-0" />
        <p className="text-xs text-indigo-950 font-medium leading-relaxed">
          Your details are encrypted and securely shared only with authorized counselors. We respect student privacy.
        </p>
      </div>
    </div>
  );
}
