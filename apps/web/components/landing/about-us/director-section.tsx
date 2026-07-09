import React from "react";
import Image from "next/image";
import { brand } from "@/lib/brand";
import { Quote } from "lucide-react";

/**
 * Director's Message section featuring Kamal Singh Pilania
 * with mission statement and goals.
 */
export function DirectorSection() {
  return (
    <section
      className="py-24 border-b"
      style={{ borderColor: brand.hairline, background: brand.canvas }}
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Director Image & Info */}
          <div className="lg:col-span-4 text-center">
            <div
              className="relative mx-auto size-48 sm:size-56 rounded-full overflow-hidden border-4"
              style={{ borderColor: brand.gold }}
            >
              <Image
                src="https://cdn.shiksha.study/landing/director.jpeg"
                alt="Kamal Singh Pilania - Director"
                fill
                className="object-cover"
              />
            </div>
            <div className="mt-6">
              <h3 className="text-xl font-bold" style={{ color: brand.ink }}>
                Kamal Singh Pilania
              </h3>
              <p className="text-sm mt-1" style={{ color: brand.inkMuted }}>
                Director, Shiksha International
              </p>
            </div>
          </div>

          {/* Message Content */}
          <div className="lg:col-span-8">
            <div className="space-y-2 mb-6">
              <span
                className="text-[11px] font-bold uppercase tracking-[0.2em]"
                style={{ color: brand.gold }}
              >
                Director&apos;s Message
              </span>
              <h2
                className="text-3xl sm:text-4xl font-extrabold tracking-tight"
                style={{ color: brand.ink }}
              >
                Guiding Dreams, Building Future Doctors
              </h2>
            </div>

            <div
              className="relative pl-6 border-l-2"
              style={{ borderColor: brand.gold }}
            >
              <Quote
                className="absolute -left-3 -top-2 size-6"
                style={{ color: brand.gold, background: brand.canvas }}
              />
              <p
                className="text-base sm:text-lg leading-relaxed italic"
                style={{ color: brand.inkMuted }}
              >
                &quot;At Shiksha International, we aim to guide students with
                honesty and transparency, help them secure quality medical
                education abroad, and work with globally recognized
                universities. Our structured admission processes and strong
                international support ensure that every aspiring doctor gets the
                opportunity to build their future and become a global medical
                leader.&quot;
              </p>
            </div>

            {/* Mission Points */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Guide students with honesty and transparency",
                "Help secure quality medical education abroad",
                "Work with globally recognized universities",
                "Provide structured admission processes",
                "Offer strong international support",
                "Build future doctors and global medical leaders",
              ].map((point, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-sm"
                  style={{ color: brand.inkMuted }}
                >
                  <span
                    className="size-2 rounded-full shrink-0"
                    style={{ background: brand.gold }}
                  />
                  {point}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
