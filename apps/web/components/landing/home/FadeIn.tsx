"use client";

import { useState, useEffect, useRef } from "react";

interface FadeInProps {
  children: React.ReactNode;
  /** Delay in ms before starting the fade-in */
  delay?: number;
  /** Duration of the fade-in transition in ms */
  duration?: number;
  /** Optional className */
  className?: string;
}

/**
 * FadeIn — wraps children that fade in after a configurable delay.
 * Uses a setTimeout + React state for precise control.
 */
export function FadeIn({
  children,
  delay = 0,
  duration = 1000,
  className,
}: FadeInProps) {
  const [visible, setVisible] = useState(false);
  const mounted = useRef(false);

  useEffect(() => {
    // Skip delay on mount if it's 0 — trigger instantly on next frame
    if (delay === 0 && !mounted.current) {
      mounted.current = true;
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-opacity ${className ?? ""}`}
      style={{
        opacity: visible ? 1 : 0,
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
}
