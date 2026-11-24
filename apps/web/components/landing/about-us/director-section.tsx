import React from "react";
import Image from "next/image";

/**
 * Opening spread: the director's letter, set like the first page of a
 * prospectus. The portrait stays real and the type stays quiet.
 */
export function DirectorSection() {
  return (
    <section className="border-b border-brand-hairline bg-white pb-20 pt-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:order-2 lg:col-span-8">
            <p className="text-xs font-medium text-brand-ink-muted">
              A letter from our director
            </p>
            <h1 className="mt-4 max-w-3xl text-[clamp(2.5rem,4.5vw,3.75rem)] font-medium leading-[1.06] tracking-[-0.025em] text-brand-ink">
              We help Indian students become doctors abroad
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-brand-ink-muted sm:text-lg">
              Shiksha International works on MBBS admissions in Kyrgyzstan,
              Uzbekistan, Kazakhstan and Russia. One team handles the file from
              shortlist to visa.
            </p>

            <blockquote className="mt-10 border-l border-brand-gold pl-6">
              <p className="max-w-2xl text-base leading-relaxed text-brand-ink sm:text-lg">
                &quot;At Shiksha International, we aim to guide students with
                honesty and transparency, help them secure quality medical
                education abroad, and work with globally recognized
                universities. Our structured admission processes and strong
                international support ensure that every aspiring doctor gets the
                opportunity to build their future and become a global medical
                leader.&quot;
              </p>
            </blockquote>
          </div>

          <div className="lg:order-1 lg:col-span-4">
            <div className="relative mx-auto aspect-square w-full max-w-[240px] overflow-hidden rounded-xl border border-brand-hairline lg:mx-0">
              <Image
                src="https://cdn.shiksha.study/landing/director02.jpeg"
                alt="Kamal Singh Pilania, Director"
                fill
                unoptimized
                sizes="240px"
                className="object-cover"
              />
            </div>
            <div className="mt-5 text-center lg:text-left">
              <p className="text-base font-medium text-brand-ink">
                Kamal Singh Pilania
              </p>
              <p className="mt-1 text-sm text-brand-ink-muted">
                Director, Shiksha International
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
