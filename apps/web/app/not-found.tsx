import Link from "next/link";
import { headers } from "next/headers";
import { ArrowLeft } from "lucide-react";
import { brand } from "@/lib/brand";

const appLinks: Record<string, { label: string; href: string }> = {
  admin: { label: "Go to Dashboard", href: "/admin/dashboard" },
  student: { label: "Go to Dashboard", href: "/student/dashboard" },
  parents: { label: "Go to Dashboard", href: "/parents/dashboard" },
};

const landingRoutes = [
  { name: "Home", href: "/" },
  { name: "Universities", href: "/universities" },
  { name: "Contact", href: "/contact-us" },
] as const;

export default async function NotFound() {
  const h = await headers();
  const pathname = h.get("x-pathname") || "";
  const prefix = pathname.split("/").filter(Boolean)[0] || "";
  const link = appLinks[prefix];

  return (
    <section
      className="flex flex-col items-center justify-center px-4 py-24 text-center"
      style={{ background: brand.canvas, color: brand.ink }}
    >
      <span
        className="select-none text-[9rem] leading-none font-bold tracking-tighter sm:text-[11rem]"
        style={{ color: brand.hairline }}
      >
        404
      </span>

      <div className="-mt-10 space-y-4 sm:-mt-14">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Page not found
        </h1>

        <p
          className="mx-auto max-w-sm text-sm leading-relaxed sm:text-base"
          style={{ color: brand.inkMuted }}
        >
          This page may have moved or never existed. Let&apos;s get you somewhere useful.
        </p>

        {link ? (
          <div className="pt-4">
            <Link
              href={link.href}
              className="inline-flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
              style={{ background: brand.ink }}
            >
              <ArrowLeft className="h-4 w-4" />
              {link.label}
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              {landingRoutes.map((r) => (
                <Link
                  key={r.name}
                  href={r.href}
                  className="rounded-lg px-4 py-2 text-sm font-medium transition-all hover:brightness-95"
                  style={{
                    background: brand.goldLight,
                    color: brand.ink,
                    border: `1px solid ${brand.goldBorder}`,
                  }}
                >
                  {r.name}
                </Link>
              ))}
            </div>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
                style={{ background: brand.ink }}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to home
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
