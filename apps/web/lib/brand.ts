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
  /* ─── Text ─── */
  ink: "#1A153A",
  inkMuted: "#6B6599",
  inkSubtle: "#9794BA",

  /* ─── Chromatic accent ─── */
  gold: "#C4953B",
  goldLight: "rgba(196, 149, 59, 0.10)",
  goldGlow: "rgba(196, 149, 59, 0.15)",
  goldBorder: "rgba(196, 149, 59, 0.25)",

  /* ─── Surfaces ─── */
  canvas: "#FAF9F6",
  surface: "#FFFFFF",

  /* ─── Borders ─── */
  hairline: "rgba(26, 21, 58, 0.08)",

  /* ─── Utility tints ─── */
  purpleLight: "rgba(75, 45, 142, 0.05)",

  /* ─── Component tokens ─── */
  btnRadius: "0.5rem",
} as const;

export type BrandToken = keyof typeof brand;

/**
 * Helper to build inline styles that reference brand tokens.
 * Prefer utility classes when possible.
 */
export function brandStyle(overrides: Partial<Record<string, string>>) {
  return overrides;
}
