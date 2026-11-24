"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { brand } from "@/lib/brand";

const SHOW_AFTER_PX = 400;

/**
 * Floating "back to top" button pinned bottom-right of landing pages.
 * Only flips state when crossing the threshold, so scrolling stays cheap.
 */
export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > SHOW_AFTER_PX);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Scroll back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 ease-out hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none ${
        visible
          ? "translate-y-0 scale-100 opacity-100"
          : "pointer-events-none translate-y-3 scale-90 opacity-0"
      }`}
      style={{ background: brand.ink, outlineColor: brand.gold }}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
