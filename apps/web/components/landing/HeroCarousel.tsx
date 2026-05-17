"use client";

import { useEffect, useState } from "react";

const images = [
  "https://images.unsplash.com/20/cambridge.JPG",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f",
  "https://images.unsplash.com/photo-1568792923760-d70635a89fdc",
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen overflow-hidden">
      {images.map((src, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <img src={src} alt="" className="h-full w-full object-cover" />
        </div>
      ))}
      <div className="absolute inset-0 bg-black/30" />
    </section>
  );
}
