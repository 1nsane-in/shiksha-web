"use client";

import { useState, useEffect, useRef } from "react";

interface AnimatedHeadingProps {
  /** Text to animate. Use \n for line breaks. */
  text: string;
  /** Tailwind classes for the heading */
  className?: string;
  /** Delay per character in ms (default: 30) */
  charDelay?: number;
  /** Initial delay before animation starts in ms (default: 200) */
  initialDelay?: number;
  /** Transition duration per character in ms (default: 500) */
  duration?: number;
  /** Inline letter-spacing (default: "-0.04em") */
  letterSpacing?: string;
  /** Additional inline styles merged onto the h1 element */
  style?: React.CSSProperties;
}

/**
 * AnimatedHeading — character-by-character entrance animation.
 *
 * Each character starts at opacity: 0 and translateX(-18px),
 * then transitions to opacity: 1 and translateX(0).
 * Staggered delay = (lineIndex * lineLength * charDelay) + (charIndex * charDelay)
 *
 * Respects prefers-reduced-motion: renders fully visible immediately.
 */
export function AnimatedHeading({
  text,
  className = "",
  charDelay = 30,
  initialDelay = 200,
  duration = 500,
  letterSpacing = "-0.04em",
  style,
}: AnimatedHeadingProps) {
  const [triggered, setTriggered] = useState(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion.current = mq.matches;

    if (mq.matches) {
      // Skip animation — show immediately
      setTriggered(true);
      return;
    }

    const timer = setTimeout(() => setTriggered(true), initialDelay);
    return () => clearTimeout(timer);
  }, [initialDelay]);

  const lines = text.split("\n");
  const skipAnimation = reducedMotion.current;

  return (
    <h1 className={className} style={{ letterSpacing, ...style }}>
      {lines.map((line, lineIndex) => {
        const lineLength = line.length;

        return (
          <span key={lineIndex} className="block">
            {line.split("").map((char, charIndex) => {
              const isSpace = char === " ";
              const delayMs =
                lineIndex * lineLength * charDelay + charIndex * charDelay;

              return (
                <span
                  key={charIndex}
                  className="inline-block"
                  style={
                    skipAnimation
                      ? {}
                      : {
                          opacity: triggered ? 1 : 0,
                          transform: triggered
                            ? "translateX(0)"
                            : "translateX(-18px)",
                          transition: `opacity ${duration}ms ease-out ${delayMs}ms, transform ${duration}ms ease-out ${delayMs}ms`,
                        }
                  }
                >
                  {isSpace ? "\u00A0" : char}
                </span>
              );
            })}
          </span>
        );
      })}
    </h1>
  );
}
