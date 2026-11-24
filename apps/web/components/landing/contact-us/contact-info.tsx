import React from "react";
import { Phone, Mail, MapPin, Clock, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { brand } from "@/lib/brand";

type ContactCard = {
  icon: LucideIcon;
  title: string;
  value: string;
  extra?: string;
};

/**
 * Contact details as a quiet office list next to the request form.
 */
export function ContactInfo() {
  const cards: ContactCard[] = [
    {
      icon: Phone,
      title: "International helpline",
      value: "+7 918 482-65-01",
      extra: "India: +91 88264 27297",
    },
    {
      icon: Mail,
      title: "Email",
      value: "admin@shiksha.study",
    },
    {
      icon: MapPin,
      title: "Office",
      value: "India office and international support offices",
    },
    {
      icon: Clock,
      title: "Consultation hours",
      value: "Monday to Saturday, 9:00 AM to 6:30 PM",
      extra: "Online requests open 24/7",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2
          className="text-2xl font-medium tracking-[-0.01em]"
          style={{ color: brand.ink }}
        >
          Admissions desk
        </h2>
        <p
          className="mt-3 text-sm leading-relaxed"
          style={{ color: brand.inkMuted }}
        >
          Reach us directly for MBBS abroad guidance, document checks, visa
          support and FMGE/NEXT coaching.
        </p>
      </div>

      <div className="border-t border-brand-hairline">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="flex gap-4 border-b border-brand-hairline py-5"
            >
              <Icon
                className="mt-0.5 size-4 shrink-0 text-brand-ink-muted"
                strokeWidth={1.5}
              />
              <div>
                <h3
                  className="text-sm font-medium"
                  style={{ color: brand.ink }}
                >
                  {card.title}
                </h3>
                <p
                  className="mt-1 text-sm leading-relaxed"
                  style={{ color: brand.inkMuted }}
                >
                  {card.value}
                </p>
                {card.extra && (
                  <p
                    className="mt-1 text-xs"
                    style={{ color: brand.inkMuted }}
                  >
                    {card.extra}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-start gap-3 border-t border-brand-hairline pt-5">
        <ShieldCheck
          className="mt-0.5 size-4 shrink-0 text-brand-ink-muted"
          strokeWidth={1.5}
        />
        <p className="text-xs leading-relaxed text-brand-ink-muted">
          We use your details only to respond to this request.
        </p>
      </div>
    </div>
  );
}
