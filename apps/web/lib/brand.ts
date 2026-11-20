/**
 * Landing page brand tokens — Shiksha International.
 *
 * These are the visual primitives for the marketing surface (landing, about,
 * contact, gallery, universities). They are intentionally distinct from the
 * app/dashboard palette (purple-based) to give the marketing pages a warm,
 * editorial feel.
 *
 * Tagline: Your Trusted Global Education Ally
 * Motto: Shiksha — Igniting Ambition. Building Future Doctors.
 *
 * Usage:
 *   import { brand } from "@/lib/brand";
 *   style={{ color: brand.ink }}
 *
 * Prefer CSS variables (brand-*) when possible via Tailwind:
 *   className="text-brand-ink bg-brand-canvas"
 */

export const brand = {
  /* ─── Shiksha Signature Palette ─── */
  navy: "#102C50",
  royalBlue: "#245B96",
  medicalCyan: "#19A9CE",
  champagneGold: "#C9A45C",
  pureWhite: "#FFFFFF",
  iceGrey: "#F1F5F9",

  /* ─── Text ─── */
  ink: "#102C50",
  inkMuted: "#64748B",
  inkSubtle: "#94A3B8",

  /* ─── Chromatic accent ─── */
  gold: "#C9A45C",
  goldLight: "rgba(201, 164, 92, 0.10)",
  goldGlow: "rgba(201, 164, 92, 0.15)",
  goldBorder: "rgba(201, 164, 92, 0.25)",

  /* ─── Surfaces ─── */
  canvas: "#FFFFFF",
  surface: "#FFFFFF",

  /* ─── Borders ─── */
  hairline: "rgba(16, 44, 80, 0.08)",

  /* ─── Utility tints ─── */
  purpleLight: "rgba(36, 91, 150, 0.05)",

  /* ─── Component tokens ─── */
  btnRadius: "0.5rem",
} as const;

export type BrandToken = keyof typeof brand;

/**
 * Academic admission-year label, e.g. "2026-27".
 * Auto-rolls every January so no manual bump.
 */
export function admissionYear(): string {
  const y = new Date().getFullYear();
  return `${y}-${String(y + 1).slice(-2)}`;
}

/**
 * Helper to build inline styles that reference brand tokens.
 * Prefer utility classes when possible.
 */
export function brandStyle(overrides: Partial<Record<string, string>>) {
  return overrides;
}
