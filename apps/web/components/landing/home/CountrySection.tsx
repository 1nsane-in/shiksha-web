"use client";

import Image from "next/image";
import { motion } from "motion/react";

const countries = [
  {
    name: "Russia",
    slug: "russia",
    flag: "🇷🇺",
    image: "https://images.unsplash.com/photo-1513326738677-b964603b136d?w=400&q=80",
    alt: "Russia",
  },
  {
    name: "Kyrgyzstan",
    slug: "kyrgyzstan",
    flag: "🇰🇬",
    image: "https://images.unsplash.com/photo-1629340038197-191832a53546?w=400&q=80",
    alt: "Kyrgyzstan",
  },
  {
    name: "Uzbekistan",
    slug: "uzbekistan",
    flag: "🇺🇿",
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400&q=80",
    alt: "Uzbekistan",
  },
  {
    name: "Kazakhstan",
    slug: "kazakhstan",
    flag: "🇰🇿",
    image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=400&q=80",
    alt: "Kazakhstan",
  },
  {
    name: "Tajikistan",
    slug: "tajikistan",
    flag: "🇹🇯",
    image: "https://images.unsplash.com/photo-1589652717521-10c0d092dea9?w=400&q=80",
    alt: "Tajikistan",
  },
  {
    name: "Armenia",
    slug: "armenia",
    flag: "🇦🇲",
    image: "https://images.unsplash.com/photo-1672924986550-eea7b31eb414?w=400&q=80",
    alt: "Armenia",
  },
];

export function CountrySection() {
  return (
    <section className="py-20 bg-white" aria-labelledby="countries-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left Side - Title */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium" style={{ background: "#FEF3C7", color: "#B45309" }}>
                Popular Destinations
              </span>
              <h2
                id="countries-heading"
                className="mt-6 text-3xl font-bold leading-tight tracking-tight sm:text-4xl"
                style={{ color: "#0F172A" }}
              >
                Study Abroad MBBS
              </h2>
              <p className="mt-4 text-lg leading-relaxed" style={{ color: "#475569" }}>
                Explore top medical universities across 6 countries offering NMC, WHO &
                ECFMG recognized MBBS programs with affordable tuition and global
                career opportunities.
              </p>
            </motion.div>
          </div>

          {/* Right Side - Country Cards */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {countries.map((country, index) => (
                <motion.article
                  key={country.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:border-slate-300 hover:shadow-xl"
                >
                  {/* Country Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={country.image}
                      alt={country.alt}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  </div>

                  {/* Country Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl" aria-hidden="true">{country.flag}</span>
                      <h3 className="font-semibold text-white">{country.name}</h3>
                    </div>
                    <p className="mt-1 text-sm text-slate-200">NMC & WHO Recognized</p>
                  </div>

                  {/* Hover overlay with CTA */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <a
                      href={`/countries/${country.slug}`}
                      className="px-6 py-2.5 text-sm font-medium text-white rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors"
                    >
                      Explore Universities
                    </a>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}